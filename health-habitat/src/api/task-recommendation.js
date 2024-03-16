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
            `https://api.spoonacular.com/recipes/complexSearch?sort=calories&apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    } else if (restrictionField == "n/a") {
        response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?sort=calories&apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&intolerances=${allergyField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    } else if (allergyField == "n/a") {
        response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?sort=calories&apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&diet=${restrictionField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    } else {
        response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?sort=calories&apiKey=${
                env.diet_API_key
            }&maxCarbs=${calorieField}&cuisine=${cuisineField}&diet=${restrictionField}&intolerances=${allergyField}&type=${_.sample(
                getUserData.getMealType()
            )}`
        );
    }
    let jsonResp = await response.json();

    console.log(jsonResp);

    let recipeIdsString = '';
    for (let recipeResult in jsonResp["results"]) {
        // console.log("RESULT", jsonResp["results"][recipeResult]["id"]);  
        recipeIdsString += jsonResp["results"][recipeResult]["id"].toString()
        recipeIdsString += ','
    }
    recipeIdsString = recipeIdsString.slice(0, -1);
    console.log(recipeIdsString)

    let rankingResponse = await fetch(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIdsString}&apiKey=${env.diet_API_key}`
    );
    let rankingResponseJson = await rankingResponse.json();

    let scoresTmp = [];
    let totalScore = 0;
    let highestId = 0;
    let highestScore = 0;

    for (let recipeInfo in rankingResponseJson) {
        let currentScore = rankingResponseJson[recipeInfo]["readyInMinutes"] + rankingResponseJson[recipeInfo]["pricePerServing"]
        scoresTmp.push([rankingResponseJson[recipeInfo]["id"], currentScore])
        totalScore += currentScore
    }

    for (let recipeTmp in scoresTmp) {
        let recipeIDTmp = scoresTmp[recipeTmp]
        let currentScore = (1-(recipeIDTmp[1]/totalScore))*100;
        console.log("Calculating Diet Rank", recipeIDTmp[0], currentScore)
        if (currentScore > highestScore) {
            highestScore = currentScore;
            highestId = recipeIDTmp[0];
        }
    }

    console.log(`Highest Diet Score: ${highestScore}, recipeId: ${highestId}`)
    let recipeID = highestId

    // Add recommended task to current user into Firestore
    // let recipeID = _.sample(jsonResp["results"])["id"];
    let task = [recipeID, new Date()];

    await updateDoc(value.ref, {
        dietTask: task,
    });
}

// Scoring function for exercise recommendation
function calculateExerciseScore(exercise, userIntensityLevel, pastWorkoutCategories, pastExerciseTasks){
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

    // Past exercise task penalty
    // Penalize the score if the exercise has been recommended before
    if (pastExerciseTasks.includes(exercise.task_id)) {
        score -= 1;
    }

    return score
}

// Recommend exercise task based on user's preferences, weather, and user's past exercise tasks
export async function recommendExerciseTask() {
    const _ = require("lodash"); // To be able to filter and sort through query results

    // Get current user data
    console.log("RECOMMENDING EXERCISE TASK");
    let equipmentsQ = null;

    const userDoc = await getUserData.getUserDocument(auth.currentUser.email);
    const weather = await getWeather();
    const age = await appleHealthApi.getAge();
    const gender = await appleHealthApi.getSex();
    let actualWeight = await appleHealthApi.getWeight();
    actualWeight = lbToKg(actualWeight);
    let dreamWeight = await userDoc.get("goalWeight");
    dreamWeight = lbToKg(dreamWeight);
    const availEquipment = await userDoc.get("exerciseEquipments");
    let pastWorkoutCategories = await userDoc.get("pastWorkoutCategories");
    let pastExerciseTasks = await userDoc.get("completedExerciseTasks");

    // If the user has more than 10 past exercise tasks, reset the past exercise tasks
    if (pastExerciseTasks.length > 10) {
        pastExerciseTasks = [];
        // Update the user's document in Firestore
        await updateDoc(userDoc.ref, {
            completedExerciseTasks: pastExerciseTasks
        });
    }

    // If the user has more than 4 past muscle categories, reset the past workout categories
    if (pastWorkoutCategories.length > 4){
        pastWorkoutCategories = [];
        // Update the user's document in Firestore
        await updateDoc(userDoc.ref, {
            pastWorkoutCategories: pastWorkoutCategories
        });
    }


    // Use machine learning model to recommend the user an intensity level for their exercise
    // Using the user's actual weight, dream weight, age, and gender and the current weather condition (context)


    const response = await fetch("http://localhost:8000//exercise_rec", {
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


    // Convert response to an integer
    intensityLevel = parseInt(intensityLevel);

    // Filter our documents by user equipment
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
        const score = calculateExerciseScore(exercise.data(), intensityLevel, pastWorkoutCategories, pastExerciseTasks);
        return { ...exercise.data(), 'score': score };
    })

    // RANKING: Sort by score (decreasing)
    rankedExercises = _.sortBy(exercises, function (exercise) { return exercise.score; }).reverse();
    console.log("INTENSITY LEVEL", intensityLevel)
    console.log("PAST MUSCLE GROUPS", pastWorkoutCategories)
    console.log("PAST EXERCISE TASKS", pastExerciseTasks)
    console.log("RECOMMENDED EXERCISE # 1", rankedExercises[0])
    console.log("RECOMMENDED EXERCISE # 2", rankedExercises[1])
    console.log("RECOMMENDED EXERCISE # 3", rankedExercises[2])

    // Get the first task in rankedExercises (the one with the highest score i.e. the best match for the user's preferences)
    let exercise = rankedExercises[0];
    
    let exerciseTask = {
        'date': new Date(),
        'task_id': exercise.task_id,
        'name': exercise.name,
        'description': exercise.description
    };

    console.log("IN TASK-RECOMMENDATION EXERCISE TASK", exerciseTask);

    // Add recommended task to current user into Firestore
    // Push current exercise category to pastWorkoutCategories
    // Push current exercise task to pastExerciseTasks
    await updateDoc(userDoc.ref, {
        exerciseTask: exerciseTask,
        pastWorkoutCategories: arrayUnion(exercise.category),
        completedExerciseTasks: arrayUnion(exercise.task_id)
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