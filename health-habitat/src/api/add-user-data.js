import { db } from '../../App'
import { collection, addDoc } from "firebase/firestore"; 

// Adding document to collection UserInfo
// TODO: add parameters here
export default async function addUser(email, weather, calories, cuisines, restrictions, allergies, priceLimit, dietDuration, location, exerciseDuration, exerciseType, intensity, genres, meditationDuration) {
    const userData = {
        userID: email,
        preferredWeather: weather,
        dietCalories: calories,
        dietCuisines: cuisines,
        dietRestrictions: restrictions,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        dietTime: dietDuration,
        locationType: location,
        exerciseTime: exerciseDuration,
        exerciseCategory: exerciseType,
        exerciseIntensity: intensity,
        meditationTags: genres,
        meditationTime: meditationDuration
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}