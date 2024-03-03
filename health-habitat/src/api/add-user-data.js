import { db } from '../../App'
import { collection, addDoc } from "firebase/firestore"; 

// Adding document to collection UserInfo
async function addUser(id, time, weather, cuisines, diets, allergies, priceLimit, time, exerciseType, genres, time) {
    const userData = {
        userID: id,
        preferredWeather: weather,
        dietCuisines: cuisines,
        dietDiets: diets,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        exerciseCategory: exerciseType,
        // exerciseEquipments: equipments,
        meditationTags: genres,
        dietDuration: time
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}

// TODO?
// Function: Update "isCompleted" field of document in "*Tasks" collection

// Function: Update document in "UserInfo" collection