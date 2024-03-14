import { db, auth } from '../core/config';
import { collection, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import * as getUserData from "./get-user-data";
import env from "./env.json";
import {getWeatherCategory, getWeather, getTemperature} from "./get-weather";
import { getLocation } from './apple/appleLocationApi'
import * as appleHealthApi from "./apple/appleHealthApi";
import {getMeditationByTag} from "./get-user-data";
import { lbToKg } from '../utils/lbKgConverter';

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
    // to be able to filter through query results
    const _ = require("lodash");

    // Get current user data
    console.log('recommending exercise');
    let equipmentsQ = null;
    let exerciseIntersection = null;
    
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (doc) {
            // console.log('userDoc:', value)
            // const weather = getLocation();
            // console.log('weather')
            // appleHealthApi.initHealthApi(false);
            // use lbtokg converter to here to convert weight to kg
            // const actualWeight = appleHealthApi.getWeight();
            // const dreamWeight = getUserData.getGoalWeight(userDoc);
            // console.log('actualWeight:', actualWeight);
            // console.log('dreamWEight:', dreamWeight);
            // const age = appleHealthApi.getAge();
            // const gender = appleHealthApi.getSex();

            // use machine learning model to recommend the user an intensity level for their exercise
            // using the user's actual weight, dream weight, age, and gender and the current weather condition 
        // const response = await fetch(API_URL + '/exercise_rec', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: {
                //         'weather_condition': weather,
                //         'actual_weight': actualWeight,
                //         'dream_weight': dreamWeight,
                //         'age': age,
                //         'gender': gender
                //     }
                // })
                //     .then((response) => {
                //         if (response.ok) {
                //             response.json()
                //         }
                //         throw new Error('400 Bad Request')
                //     })
                //     .then((responseJson) => {
                //         console.log(responseJson['category']);
                //     })
                //     .catch(error => {
                //        console.log("error: ", error.message);
                //     });
            const response = 5.09; // delete this line once we get API to work
            // convert response to an integer
            const intensityLevel = parseInt(response);
            const pastWorkoutCategories = getUserData.getPastWorkoutCategories(doc);

            // filter our documents by user equipment,intensity level, and by past workout categories
            // Account for n/a option and query accordingly
            if (getUserData.getEquipments(doc)[0].value == "n/a") {
                equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "==", "none (bodyweight exercise)"));
            }
            else {
                equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "==", "none (bodyweight exercise)"), where("equipment", "in", getUserData.getEquipments(doc)));
            }
            
            const intensityQ = query(collection(db, "ExerciseTasks"), where("intensity_level", "<=", intensityLevel));

            // Retrieve queried documents
            const equipmentsSnapshot = await getDocs(equipmentsQ);
            const intensitySnapshot = await getDocs(intensityQ);

            // filter out workouts that involve muscle groups in pastWorkoutCategories if there are any
            if (pastWorkoutCategories.length > 0) {
                const muscleGroupQ = query(collection(db, "ExerciseTasks"), where("category", "not-in", pastWorkoutCategories));
                const muscleGroupSnapshot = await getDocs(muscleGroupQ);
                exerciseIntersection = _.intersectionBy(intensitySnapshot.docs, equipmentsSnapshot.docs, muscleGroupSnapshot.docs, 'task_id');
            } else {
                exerciseIntersection = _.intersectionBy(intensitySnapshot.docs, equipmentsSnapshot.docs, 'task_id');
            }
                        
            // RANKING: Sort by intensity level (decreasing)
            exerciseIntersection = _.sortBy(exerciseIntersection, function (exercise) { return exercise.intensity_level; }).reverse();
            
            // Get the first task in exerciseUnion
            let exercise = exerciseIntersection[0];
            let exerciseTask = [exercise.get("task_id"), exercise.get("name"), new Date()];
            console.log(exerciseTask);

            // Add recommended task to current user into Firestore
            await updateDoc(doc.ref, {
                exerciseTask: exerciseTask
            });
            
            // Push current exercise category to pastWorkoutCategories
            await updateDoc(doc.ref, {
                pastWorkoutCategories: arrayUnion(exercise.get("category"))
            });

            return exerciseTask;
        }
    )
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
            const currentHeartRate = appleHealthApi.getHeartRateCurrent()

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