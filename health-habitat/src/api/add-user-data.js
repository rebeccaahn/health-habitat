import { db } from '../../App'
import { collection, addDoc } from "firebase/firestore"; 

// Adding document to collection UserInfo
export default async function addUser(id, weather, calories, cuisines, diets, allergies, priceLimit, time, exerciseType, genre, time) {
    const userData = {
        dietCalories: calories,
        dietDiets: diets,
        dietAllergies: allergies,
        indoor: 

        userID: id,
        preferredWeather: weather,
        dietCuisines: cuisines,
        dietPriceLimit: priceLimit,
        exerciseCategory: exerciseType,
        // exerciseEquipments: equipments,
        meditationTag: genre,
        dietDuration: time
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}

// TODO?
// Function: Update "isCompleted" field of document in "*Tasks" collection

// Function: Update document in "UserInfo" collection