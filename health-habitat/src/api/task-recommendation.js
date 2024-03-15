import { db, auth } from "../core/config";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    arrayUnion,
    or,
} from "firebase/firestore";
import * as getUserData from "./get-user-data";
import env from "./env.json";
import { getWeatherCategory, getWeather, getTemperature } from "./get-weather";
import { getLocation } from "./apple/appleLocationApi";
import * as appleHealthApi from "./apple/appleHealthApi";
import { getMeditationByTag } from "./get-user-data";
import { lbToKg } from "../utils/lbKgConverter";
import { getCarbs } from "./apple/appleHealthApi";
import { API_URL } from "../core/config";

export async function recommendDietTask() {
    // To be able to use sample function
    const _ = require("lodash");
    // Get current user data
    const userDoc = await getUserData.getUserDocument(auth.currentUser.email);

    let value = userDoc;

    // Query parameters to put in endpoint call
    let response = null;

    let calorieIntakeMax = await value.get("dietCalories");
    let cuisineField = await value.get("dietCuisines");
    let allergyField = await value.get("dietAllergies");
    let restrictionField = await value.get("dietRestrictions");
    let currentCalorieIntake = await getCarbs();
    let calorieField = calorieIntakeMax - currentCalorieIntake;

    console.log("CALORIES", calorieField);

    // Account for n/a options and call endpoint accordingly
    if (restrictionField == "n/a" && allergyField == "n/a") {
        response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    } else if (restrictionField == "n/a") {
        response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&intolerances=${allergyField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    } else if (allergyField == "n/a") {
        response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&diet=${restrictionField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    } else {
        response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&diet=${restrictionField}&intolerances=${allergyField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    }
    let jsonResp = await response.json();

    console.log(jsonResp);

    // Add recommended task to current user into Firestore
    let recipeID = _.sample(jsonResp["results"])["id"];
    let task = [recipeID, new Date()];

    await updateDoc(value.ref, {
        dietTask: task,
    });
}

// scoring function for exercise recommendation
function calculateExerciseScore(exercise, userIntensityLevel, pastWorkoutCategories){
    let score  = 0;

    // Calculate intensity match bonus (higher for closer intensity)
    // If the exercise intensity level matches the user's preference, add 10 to the score
    // Penalize the score based on the difference between the exercise intensity level and the user's recommended intensity level
    const intensityDiff = Math.abs(exercise.intensity_level - userIntensityLevel);
    score += 10 - intensityDiff;  // max score is 10, min score score is 1 because the range of intensities if from 1 to 10

    // Muscle group overlap penalty
    // penalize the score if the muscle group overlaps with past workout categories
    const muscleGroup = exercise.category;
    if (pastWorkoutCategories.includes(muscleGroup)) {
        score -= .5;
    }

    return score
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of ExerciseTasks to get personalized task(s) because AND queries only work on 1 field at a time
export async function recommendExerciseTask() {
    // to be able to filter through query results
    const _ = require("lodash");

    // Get current user data
    console.log("recommending exercise");
    let equipmentsQ = null;
    let exerciseIntersection = null;

    const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
    const weather = await getWeather();
    const age = await appleHealthApi.getAge();
    const gender = await appleHealthApi.getSex();
    let actualWeight = await appleHealthApi.getWeight();
    actualWeight = lbToKg(actualWeight);
    let dreamWeight = await userDoc.get("goalWeight");
    dreamWeight = lbToKg(dreamWeight);
    const availEquipment = await userDoc.get("exerciseEquipments");
    const pastWorkoutCategories = await userDoc.get("pastWorkoutCategories");

    // use machine learning model to recommend the user an intensity level for their exercise
    // using the user's actual weight, dream weight, age, and gender and the current weather condition
    const response = await fetch(API_URL + "/exercise_rec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            weather_condition: weather,
            actual_weight: actualWeight,
            dream_weight: dreamWeight,
            age: age,
            gender: gender,
        }),
    });
    let intensityResp = await response.json();
    let intensityLevel = intensityResp["category"];

    // convert response to an integer
    intensityLevel = parseInt(intensityLevel);

    // filter our documents by user equipment,intensity level, and by past workout categories
    // Account for n/a option and query accordingly
    if (getUserData.getEquipments(userDoc)[0].value == "n/a") {
        equipmentsQ = query(
            collection(db, "ExerciseTasks"),
            where("equipment", "==", "none (bodyweight exercise)")
        );
    } else {
        equipmentsQ = query(
            collection(db, "ExerciseTasks"),
            or(
                where("equipment", "==", "none (bodyweight exercise)"),
                where("equipment", "in", availEquipment)
            )
        );
    }

    // Retrieve queried documents i.e. exercises that match the user's available equipment
    const equipmentsSnapshot = await getDocs(equipmentsQ);

    // Apply scoring function to each exercise
    const exercises = equipmentsSnapshot.docs.map(exercise => {
        const score = calculateExerciseScore(exercise.data(), intensityLevel, pastWorkoutCategories);
        return { ...exercise.data(), 'score': score };
    })

    // RANKING: Sort by score (decreasing)
    rankedExercises = _.sortBy(exercises, function (exercise) { return exercise.score; }).reverse();
    console.log("INTENSITY LEVEL", intensityLevel)
    console.log("PAST MUSCLE GROUPS", pastWorkoutCategories)
    console.log("RECOMMENDED EXERCISE # 1", rankedExercises[0])
    console.log("RECOMMENDED EXERCISE # 2", rankedExercises[1])
    console.log("RECOMMENDED EXERCISE # 3", rankedExercises[2])
    console.log("RECOMMENDED EXERCISE # 4", rankedExercises[3])

    // Get the first task in rankedExercises
    let exercise = rankedExercises[0];
    
    let exerciseTask = {
        'date': new Date(),
        'task_id': exercise.task_id,
        'name': exercise.name,
        'description': exercise.description
    };

    console.log("IN TASK-RECOMMENDATION EXERCISE TASK", exerciseTask);

    // Add recommended task to current user into Firestore
    await updateDoc(userDoc.ref, {
        exerciseTask: exerciseTask,
    });

    // Push current exercise category to pastWorkoutCategories
    await updateDoc(userDoc.ref, {
        pastWorkoutCategories: arrayUnion(exercise.category)
    });

    return exerciseTask;
}

export async function recommendMeditationTask() {
    const _ = require("lodash");
    let currentTime = "morning";
    const curHour = new Date().getHours();
    if (curHour < 12) {
        currentTime = "morning";
    } else if (curHour < 17) {
        currentTime = "afternoon";
    } else if (curHour < 20) {
        currentTime = "evening";
    } else {
        currentTime = "night";
    }

    const userDoc = await getUserData.getUserDocument(auth.currentUser.email);

    let value = userDoc;

    const weather = await getWeather();
    const currentWeatherCondition = await getWeatherCategory(weather);
    const currentTemperature = await getTemperature();
    const currentHeartRate = await appleHealthApi.getHeartRateCurrent();

    let genreResponse = await fetch(`http://localhost:8000/meditation_rec`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            weather_condition: currentWeatherCondition,
            temperature: currentTemperature,
            heart_rate: currentHeartRate,
            time_of_day: currentTime,
        }),
    });
    let genreJsonResp = await genreResponse.json();
    const songGenre = genreJsonResp["genre"];

    console.log(genreJsonResp);
    console.log(songGenre);

    const tagQ = query(
        collection(db, "MeditationTasks"),
        where("tag", "==", songGenre)
    );

    // Retrieve queried documents
    const tagSnapshot = await getDocs(tagQ);

    let docsData = tagSnapshot.docs.map((doc) => doc.data());
    let jsonDocsData = JSON.stringify(docsData);

    let songResponse = await fetch(
        `http://localhost:8000/meditation_song_pick`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                songs: jsonDocsData,
                heart_rate: currentHeartRate,
            }),
        }
    );
    let songJsonResp = await songResponse.json();
    let songUrl = songJsonResp["song_name"];

    console.log(songJsonResp);
    console.log(songUrl);

    let task = [songUrl, new Date()];

    await updateDoc(value.ref, {
        meditationTask: task,
    });
}

export async function getRecommendationLocation() {
    let currentTime = "morning";
    const curHour = new Date().getHours();
    if (curHour < 12) {
        currentTime = "morning";
    } else if (curHour < 17) {
        currentTime = "afternoon";
    } else if (curHour < 20) {
        currentTime = "evening";
    } else {
        currentTime = "night";
    }

    const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
    let weather = await getWeather();
    console.log("WEATHER", weather);
    const currentWeatherCondition = await getWeatherCategory(weather);
    console.log("CONDITION", currentWeatherCondition);
    const currentTemperature = await getTemperature();
    console.log("TEMP", currentTemperature);

    let locationResponse = await fetch(
        `http://localhost:8000/meditation_location`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                weather_condition: currentWeatherCondition,
                temperature: currentTemperature,
                time_of_day: currentTime,
            }),
        }
    );
    let locationJsonResp = await locationResponse.json();

    console.log(locationJsonResp);

    return locationJsonResp["location"];
}