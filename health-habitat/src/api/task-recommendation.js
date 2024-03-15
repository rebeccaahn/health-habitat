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

    const intensityQ = query(
        collection(db, "ExerciseTasks"),
        where("intensity_level", "<=", intensityLevel)
    );

    // Retrieve queried documents
    const equipmentsSnapshot = await getDocs(equipmentsQ);
    const intensitySnapshot = await getDocs(intensityQ);

    console.log("EQ SNAP", equipmentsSnapshot.docs);
    console.log("INT SNAP", intensitySnapshot.docs);

    // if the user has more than 5 past workout categories, reset the pastWorkoutCategories array to an empty array
    if (pastWorkoutCategories.length > 5) {
        await updateDoc(userDoc.ref, {
            pastWorkoutCategories: [],
        });
        pastWorkoutCategories = [];
    }

    // filter out workouts that involve muscle groups in pastWorkoutCategories if there are any
    if (pastWorkoutCategories.length > 0) {
        console.log("PAST WORKOUT CATEGORIES", pastWorkoutCategories);
        const muscleGroupQ = query(
            collection(db, "ExerciseTasks"),
            where("category", "not-in", pastWorkoutCategories)
        );
        const muscleGroupSnapshot = await getDocs(muscleGroupQ);
        const totalQ = query(collection(db, "ExerciseTasks"));
        const totalSnapshot = await getDocs(totalQ);
        console.log("MUSCLE SNAP", muscleGroupSnapshot.docs);
        console.log("TOTAL SNAP", totalSnapshot.docs[0].data().task_id);
        exerciseIntersection = _.intersectionBy(
            intensitySnapshot.docs,
            equipmentsSnapshot.docs,
            muscleGroupSnapshot.docs,
            (doc) => doc.data().task_id
        );
        console.log("INTERSECTION", exerciseIntersection);
    } else {
        exerciseIntersection = _.intersectionBy(
            intensitySnapshot.docs,
            equipmentsSnapshot.docs,
            (doc) => doc.data().task_id
        );
    }

    if (exerciseIntersection.length == 0) {
        console.log("INVALID AMOUNT OF WORKOUTS");
        exerciseIntersection = intensitySnapshot.docs;
    } else {
        console.log("VALID NUM OF WORKOUTS");
    }

    // RANKING: Sort by intensity level (decreasing)
    exerciseIntersection = _.sortBy(exerciseIntersection, function (exercise) {
        return exercise.intensity_level;
    });

    // Get the first task in exerciseUnion
    let exercise = exerciseIntersection[0];
    const task_id = await exercise.get("task_id");
    const name = await exercise.get("name");
    const description = await exercise.get("description");

    let exerciseTask = {
        date: new Date(),
        task_id: task_id,
        name: name,
        description: description,
    };

    console.log("IN TASK-RECOMMENDATION EXERCISE TASK", exerciseTask);

    // Add recommended task to current user into Firestore
    await updateDoc(userDoc.ref, {
        exerciseTask: exerciseTask,
    });

    // Push current exercise category to pastWorkoutCategories
    await updateDoc(userDoc.ref, {
        pastWorkoutCategories: arrayUnion(exercise.get("category")),
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