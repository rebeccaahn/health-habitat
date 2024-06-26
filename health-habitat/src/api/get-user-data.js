import { db } from "../core/config"
import { collection, query, where, getDocs } from "firebase/firestore";

// Call this function before any function call that accepts userDoc parameter
// Finding user's document
export async function getUserDocument(email) {
    console.log("Email searching", email);
    const userQ = query(collection(db, "UserInfo"), where("userID", "==", email));
    console.log(userQ);
    const userSnapshot = await getDocs(userQ);
    console.log("get docs", userSnapshot); // up to here works...
    // oof whaa which email did you use? ok yeaa i see it on firebase too okok

    let response = userSnapshot.docs;
    // with this, response is an array of len 0, so there is no email found??
    console.log("RESPONSE", response)
    return response[0];
    // userSnapshot.then(
    //     async function(value){
    //         return value.docs[0]
    //     }
    // )
    //
    // return userSnapshot.docs[0];    // there should only be 1 document in the snapshot as the email is unique
}

// Getting user's preferred diet calories
export function getCalories(userDoc) {
    return userDoc.get("dietCalories");
}

// Getting user's preferred diet cuisines
export function getCuisines(userDoc) {
    return userDoc.get("dietCuisines");
}

// Getting user's diet restrictions
export function getRestrictions(userDoc) {
    return userDoc.get("dietRestrictions");
}

// Getting user's diet allergies
export function getAllergies(userDoc) {
    return userDoc.get("dietAllergies");
}

// Getting user's preferred diet price limit
export function getPriceLimit(userDoc) {
    return userDoc.get("dietPriceLimit");
}

// Getting user's diet time
export function getDietTime(userDoc) {
    return userDoc.get("dietTime");
}

// Getting user's preferred exercise equipments
export function getEquipments(userDoc) {
    return userDoc.get("exerciseEquipments");
}

// Getting user's gym access
export function getGymAccess(userDoc) {
    return userDoc.get("gymAccess");
}

// Getting user's goal weight
export function getGoalWeight(userDoc) {
    return userDoc.get("goalWeight");
}

// Getting user's preferred meditation duration in seconds
export function getMeditationTime(userDoc) {
    let time = userDoc.get("meditationTime")
    return time*60;
}

// Getting user's diet score
export async function getDietScore(userDoc) {
    return await userDoc.get("dietScore");
}

// Getting user's exercise score
export async function getExerciseScore(userDoc) {
    return await userDoc.get("exerciseScore");
}

// Getting user's meditation score
export async function getMeditationScore(userDoc) {
    return await userDoc.get("meditationScore");
}

// [id, date]
// Getting user's current diet task
export async function getDietTask(userDoc) {
    return await userDoc.get("dietTask");
}

// Getting user's current exercise task
export function getExerciseTask(userDoc) {
    return userDoc.get("exerciseTask");
}

// Getting user's current meditation task
export function getMeditationTask(userDoc) {
    return userDoc.get("meditationTask");
}

// [least recent ... most recent]
// Getting user's 7 most recent past workout categories (most recent is last of the array)
export function getPastWorkoutCategories(userDoc) {
    const workoutArray = userDoc.get("pastWorkoutCategories");
    const length = workoutArray.length;
    if (length < 7) {
        return workoutArray;
    }
    else {
        return workoutArray.slice(length-7);
    }
}

export function getCompletedExerciseTasks(userDoc) {
    return userDoc.get("completedExerciseTasks");
}

export async function getExerciseByCategory(category) {
    // Make query
    const categoryQ = query(collection(db, "ExerciseTasks"), where("category", "==", category));

    // Retrieve queried documents
    const categorySnapshot = await getDocs(categoryQ);

    // Return the array [[name, equipment], ...]
    let arrayResult = [];
    categorySnapshot.forEach((doc) => {
        arrayResult.push([doc.get("name"), doc.get("equipment")])
    });

    // Copy this after calling getExerciseByCategory(category)
    // let randomExercise = _.sample(getExerciseByCategory(category));
}

export async function getMeditationByTag(tag) {
    // Make query
    const tagQ = query(collection(db, "MeditationTasks"), where("tag", "==", tag));

    // Retrieve queried documents
    const tagSnapshot = await getDocs(tagQ);

    // Return the array [[url, time], ...]
    let arrayResult = [];
    tagSnapshot.forEach(async (doc) => {
        let curUrl = await doc.get("url")
        let curTime = await doc.get("time")
        arrayResult.push([curUrl, curTime])
    });

    console.log("ARR RESULT FROM MED", arrayResult)

    return arrayResult;

    // Copy this after calling getMeditationByTag(tag)
    // let randomSong = _.sample(getMeditationByTag(tag));
}


export async function getTrackAndArtist(songUrl) {
    console.log("FINAL URL", songUrl)
    const songQ = query(collection(db, "MeditationTasks"), where("url", "==", songUrl));
    const songSnapshot = await getDocs(songQ);
    let songDoc = songSnapshot.docs[0];
    console.log("DOC IS", songSnapshot.docs[0].data())
    let track = await songDoc.get("track")
    let artist = await songDoc.get("artist")
    return [track, artist]
}


// Getting ideal meal type based on current time
export function getMealType()
{
    const currentHour = new Date().getHours();

    // breakfast
    if (currentHour >= 5 && currentHour < 11) {
        return ["breakfast", "salad", "bread", "soup", "beverage", "sauce", "marinade", "fingerfood", "drink"]
    }
    // lunch
    else if (currentHour >= 11 && currentHour < 16) {
        return ["main course", "side dish", "appetizer", "salad", "bread", "soup", "beverage", "sauce", "marinade", "fingerfood", "drink"]
    }
    // dinner
    else if (currentHour >= 16 && currentHour < 22) {
        return ["main course", "side dish", "appetizer", "salad", "bread", "soup", "beverage", "sauce", "marinade", "fingerfood", "drink"]
    }
    // late night snack
    else if ((currentHour >= 22 && currentHour < 24) || (currentHour >= 0 && currentHour < 5)) {
        return ["dessert", "snack", "bread", "beverage", "sauce", "marinade", "fingerfood", "drink"]
    }
}