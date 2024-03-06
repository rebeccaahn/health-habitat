import { db } from '../../App'
import { collection, addDoc } from "firebase/firestore"; 

// Adding document to collection UserInfo
export default async function addUser(email, calories, cuisines, restrictions, allergies, priceLimit, dietDuration, exerciseDuration, exerciseTypes, equipments, intensity, meditationDuration, dScore=100, eScore=100, mScore=100) {
    const userData = {
        userID: email,
        dietCalories: calories,
        dietCuisines: cuisines,
        dietRestrictions: restrictions,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        dietTime: dietDuration,
        exerciseTime: exerciseDuration,
        exerciseCategories: exerciseTypes,
        exerciseEquipments: equipments,
        exerciseIntensity: intensity,
        meditationTime: meditationDuration,
        dietScore: dScore,
        exerciseScore: eScore,
        meditationScore: mScore,
        dietTask: null, // TODO: remove this line and getDietTask() since I should not store any data including id?
        exerciseTask: null,
        meditationTask: null
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}