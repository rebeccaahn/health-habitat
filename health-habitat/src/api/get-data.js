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
async function getUserDocument(id) {
    const userQ = query(collection(db, "UserInfo"), where("userID", "==", id));
    const userSnapshot = await getDocs(userQ);
    return userSnapshot.docs[0];
}

// Getting user's preferred weather
function getWeather(userDoc) {
    return userDoc.get("preferredWeather");
}

// Getting user's preferred cuisines
function getCuisines(userDoc) {
    return userDoc.get("dietCuisines");
}

// Getting user's diets
function getDiets(userDoc) {
    return userDoc.get("dietDiets");
}

// Getting user's allergies
function getAllergies(userDoc) {
    return userDoc.get("dietAllergies");
}

// Getting user's preferred price limit
function getPriceLimit(userDoc) {
    return userDoc.get("dietPriceLimit");
}

// Getting user's preferred exercise category
function getCategory(userDoc) {
    return userDoc.get("exerciseCategory");
}

// Getting user's exercise equipments
function getEquipments(userDoc) {
    return userDoc.get("exerciseEquipments");
}

// Getting user's preferred meditation tag
function getTag(userDoc) {
    return userDoc.get("meditationTag");
}

// Getting user's preferred meditation duration
function getDuration(userDoc) {
    return userDoc.get("duration");
}