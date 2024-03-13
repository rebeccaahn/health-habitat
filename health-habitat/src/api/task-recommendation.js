import { db, auth } from '../../App'
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import * as getUserData from "./get-user-data";
import env from "./env.json";
import {getWeatherCategory, getWeather, getTemperature} from "./get-weather";
import {getHeartRateCurrent} from "./apple/appleHealthApi";
import {getMeditationByTag} from "./get-user-data";


export async function recommendDietTask() {
    // To be able to use sample function
    const _ = require("lodash");
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value) {
            // Query parameters to put in endpoint call
            let response = null;
            // Account for n/a options and call endpoint accordingly
            if ((getUserData.getRestrictions(value) == "n/a") && (getUserData.getAllergies(value) == "n/a")) {
                response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&maxCarbs=${getUserData.getCalories(value)}&cuisine=${getUserData.getCuisines(value)}&type=${_.sample(getUserData.getMealType())}`);
            } else if (getUserData.getRestrictions(value) == "n/a") {
                response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&maxCarbs=${getUserData.getCalories(value)}&cuisine=${getUserData.getCuisines(value)}&intolerances=${getUserData.getAllergies(value)}&type=${_.sample(getUserData.getMealType())}`);
            } else if (getUserData.getAllergies(value) == "n/a") {
                response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&maxCarbs=${getUserData.getCalories(value)}&cuisine=${getUserData.getCuisines(value)}&diet=${getUserData.getRestrictions(value)}&type=${_.sample(getUserData.getMealType())}`);
            } else {
                response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&maxCarbs=${getUserData.getCalories(value)}&cuisine=${getUserData.getCuisines(value)}&diet=${getUserData.getRestrictions(value)}&intolerances=${getUserData.getAllergies(value)}&type=${_.sample(getUserData.getMealType())}`);
            }
            let jsonResp = await response.json();

            console.log(jsonResp);

            // Add recommended task to current user into Firestore
            let recipeID = _.sample(jsonResp["results"])["id"];
            let task = [recipeID, new Date()];

            await updateDoc(value.ref, {
                dietTask: task
            });
        }

    );
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of ExerciseTasks to get personalized task(s) because AND queries only work on 1 field at a time
export async function recommendExerciseTask() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Make queries
    const categoriesQ = query(collection(db, "ExerciseTasks"), where("category", "in", getUserData.getCategories(userDoc)));
    // Account for n/a option and query accordingly
    let equipmentsQ = null;
    if (getUserData.getEquipments(userDoc) == "n/a") {
        equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "==", "none (bodyweight exercise)"));
    }
    else {
        equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "in", getUserData.getEquipments(userDoc)));
    }

    // Retrieve queried documents
    const categoriesSnapshot = await getDocs(categoriesQ);
    const equipmentsSnapshot = await getDocs(equipmentsQ);

    // Uniquely union multiple arrays
    let exerciseUnion = _.union(categoriesSnapshot.docs, equipmentsSnapshot.docs);
    
    // Add recommended task to current user into Firestore
    let randomExercise = _.sample(exerciseUnion);
    let task = [randomExercise.get("task_id"), new Date()];

    await updateDoc(userDoc.ref, {
        exerciseTask: task
    });

    // Push current exercise category to pastWorkoutCategories
    await updateDoc(userDoc.ref, {
        pastWorkoutCategories: arrayUnion(randomExercise.get("category"))
    });
}


export async function recommendMeditationTask() {
    let currentTime = 'morning'
    const curHour = new Date().getHours()
    if (curHour < 12) {
        currentTime = 'morning'
    } else if (curHour < 17) {
        currentTime = 'afternoon'
    } else if (curHour < 20) {
        currentTime = 'evening'
    } else {
        currentTime = 'night'
    }

    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value) {

            const currentWeatherCondition = getWeatherCategory(getWeather())
            const currentTemperature = getTemperature()
            const currentHeartRate = getHeartRateCurrent()

            let genreResponse = await fetch(`http://localhost:8000/meditation_rec/`, {
                method: "GET",
                body: JSON.stringify({
                    weather_condition : currentWeatherCondition,
                    temperature : currentTemperature,
                    heart_rate : currentHeartRate,
                    time_of_day : currentTime
                })
            });
            let genreJsonResp = await genreResponse.json();
            const songGenre = genreJsonResp['genre']

            console.log(genreJsonResp);
            console.log(songGenre)

            let songResponse = await fetch(`http://localhost:8000/meditation_song_pick/`, {
                method: "GET",
                body: JSON.stringify({
                    songs : getMeditationByTag(songGenre),
                    heart_rate : currentHeartRate,
                })
            });
            let songJsonResp = await songResponse.json();
            let songUrl = songJsonResp['song_name']

            console.log(songJsonResp)
            console.log(songUrl)

            let task = [songUrl, new Date()];

            await updateDoc(value.ref, {
                meditationTask: task
            });
        }

    );
}


export async function getRecommendationLocation() {
    let currentTime = 'morning'
    const curHour = new Date().getHours()
    if (curHour < 12) {
        currentTime = 'morning'
    } else if (curHour < 17) {
        currentTime = 'afternoon'
    } else if (curHour < 20) {
        currentTime = 'evening'
    } else {
        currentTime = 'night'
    }

    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value) {

            const currentWeatherCondition = getWeatherCategory(getWeather())
            const currentTemperature = getTemperature()

            let locationResponse = await fetch(`http://localhost:8000/meditation_location/`, {
                method: "GET",
                body: JSON.stringify({
                    weather_condition : currentWeatherCondition,
                    temperature : currentTemperature,
                    time_of_day : currentTime
                })
            });
            let locationJsonResp = await locationResponse.json();

            console.log(locationJsonResp)

            return locationJsonResp['location']
        }

    );
}


// TODO: Incorporate live data into recommendation factors as well
// Combining queries of MeditationTasks to get personalized task(s) because AND queries only work on 1 field at a time
// export async function recommendMeditationTask() {
//     // Get current user data
//     const userDoc = getUserDocument(auth.currentUser.email);
//
//     // Make queries
//     const tagQ = query(collection(db, "MeditationTasks"), where("tag", "in", getUserData.getTags(userDoc)));
//     const timeQ = query(collection(db, "MeditationTasks"), where("time", "<=", getUserData.getMeditationTime(userDoc)));
//
//     // Retrieve queried documents
//     const tagSnapshot = await getDocs(tagQ);
//     const timeSnapshot = await getDocs(timeQ);
//
//     // Uniquely union multiple arrays
//     let meditationUnion = _.union(tagSnapshot.docs, timeSnapshot.docs);
//
//     // Add recommended task to current user into Firestore
//     let randomMeditation = _.sample(meditationUnion);
//     let task = [randomMeditation.get("url"), new Date()];
//
//     await updateDoc(userDoc.ref, {
//         meditationTask: task
//     });
// }