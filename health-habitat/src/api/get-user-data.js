import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

// Call this function before any function call that accepts userDoc parameter
// Finding user's document
export async function getUserDocument(email) {
    const userQ = query(collection(db, "UserInfo"), where("userID", "==", email));
    const userSnapshot = await getDocs(userQ);
    return userSnapshot.docs[0];    // there should only be 1 document in the snapshot as the email is unique
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
// Getting user's exercise time
export function getExerciseTime(userDoc) {
    return userDoc.get("exerciseTime");
}

// Getting user's preferred exercise categories
export function getCategories(userDoc) {
    return userDoc.get("exerciseCategories");
}

// Getting user's preferred exercise equipments
export function getEquipments(userDoc) {
    return userDoc.get("exerciseEquipments");
}

// Getting user's preferred exercise intensity
export function getIntensity(userDoc) {
    return userDoc.get("exerciseIntensity");
}

// Getting user's preferred meditation duration in seconds
export function getMeditationTime(userDoc) {
    let time = userDoc.get("meditationTime")
    return time*60;
}

// Getting user's diet score
export function getDietScore(userDoc) {
    return userDoc.get("dietScore");
}

// Getting user's exercise score
export function getExerciseScore(userDoc) {
    return userDoc.get("exerciseScore");
}

// Getting user's meditation score
export function getMeditationScore(userDoc) {
    return userDoc.get("meditationScore");
}

// [id, date]
// Getting user's current diet task
export function getDietTask(userDoc) {
    return userDoc.get("dietTask");
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

export async function getExerciseByCategory(category) {
    // Make query
    const categoryQ = query(collection(db, "ExerciseTasks"), where("category", "==", category));

    // Retrieve queried documents
    const categorySnapshot = await getDocs(categoriesQ);

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
    tagSnapshot.forEach((doc) => {
        arrayResult.push([doc.get("url"), doc.get("time")])
    });

    // Copy this after calling getMeditationByTag(tag)
    // let randomSong = _.sample(getMeditationByTag(tag));
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