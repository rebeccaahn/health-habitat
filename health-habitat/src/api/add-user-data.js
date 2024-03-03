import { db } from '../../App'
import { collection, addDoc } from "firebase/firestore"; 

// Adding document to collection UserInfo
export default async function addUser(email, weather, calories, cuisines, restrictions, allergies, priceLimit, dietDuration, location, exerciseDuration, exerciseTypes, equipments, intensity, genres, meditationDuration) {
    const userData = {
        userID: email,
        preferredWeather: weather,
        dietCalories: calories,
        dietCuisines: cuisines,
        dietRestrictions: restrictions,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        dietTime: dietDuration,
        exerciseLocation: location,
        exerciseTime: exerciseDuration,
        exerciseCategories: exerciseTypes,
        exerciseEquipments: equipments,
        exerciseIntensity: intensity,
        meditationTags: genres,
        meditationTime: meditationDuration
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}