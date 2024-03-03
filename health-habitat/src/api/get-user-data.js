import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

// Getting ideal meal type based on current time
function getMealType()
{
    const currentHour = Date.now(); // need to find correct function that gives correct hour

    // breakfast
    if (currentHour >= 8 && currentHour < 11) {
        return ["breakfast", "salad", "bread", "soup", "beverage", "sauce", "marinade", "fingerfood", "drink"]
    }
    // lunch
    else if (currentHour >= 11 && currentHour < 16) {
        return ["main course", "side dish", "appetizer", "salad", "bread", "soup", "beverage", "sauce", "marinade", "fingerfood", "drink"]
    }
    // dinner
    else if (currentHour >= 16 && currentHour < 21) {
        return ["main course", "side dish", "appetizer", "salad", "bread", "soup", "beverage", "sauce", "marinade", "fingerfood", "drink"]
    }
    // late night snack
    else if (currentHour >= 21 && currentHour < 24) {
        return ["dessert", "snack"]
    }
    // sleeping time
    else {
        return []
    }
}

// Finding user's document
async function getUserDocument(email) {
    const userQ = query(collection(db, "UserInfo"), where("userID", "==", email));
    const userSnapshot = await getDocs(userQ);
    return userSnapshot.docs[0];    // there should only be 1 document in the snapshot as the email is unique
}

// Getting user's preferred weather
function getWeather(userDoc) {
    return userDoc.get("preferredWeather");
}

// Getting user's preferred diet calories
function getCalories(userDoc) {
    return userDoc.get("dietCalories");
}

// Getting user's preferred diet cuisines
function getCuisines(userDoc) {
    return userDoc.get("dietCuisines");
}

// Getting user's diet restrictions
function getRestrictions(userDoc) {
    return userDoc.get("dietRestrictions");
}

// Getting user's diet allergies
function getAllergies(userDoc) {
    return userDoc.get("dietAllergies");
}

// Getting user's preferred diet price limit
function getPriceLimit(userDoc) {
    return userDoc.get("dietPriceLimit");
}

// Getting user's diet time
function getDietTime(userDoc) {
    return userDoc.get("dietTime");
}

// Getting user's exercise location type
function getLocationType(userDoc) {
    return userDoc.get("exerciseLocation");
}

// Getting user's exercise time
function getExerciseTime(userDoc) {
    return userDoc.get("exerciseTime");
}

// Getting user's preferred exercise categories
function getCategories(userDoc) {
    return userDoc.get("exerciseCategories");
}

// Getting user's preferred exercise equipments
function getEquipments(userDoc) {
    return userDoc.get("exerciseEquipments");
}

// Getting user's preferred exercise intensity
function getIntensity(userDoc) {
    return userDoc.get("exerciseIntensity");
}

// Getting user's preferred meditation tags
function getTags(userDoc) {
    return userDoc.get("meditationTags");
}

// Getting user's preferred meditation duration
function getMeditationTime(userDoc) {
    return userDoc.get("meditationTime");
}

// TODO: Getting user's current data
function get() {
    return;
}