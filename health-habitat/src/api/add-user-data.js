import { db } from '../../App'
import { collection, addDoc } from "firebase/firestore"; 

// Adding document to collection UserInfo
// TODO: add parameters here
export default async function addUser() {
    const userData = {
        dietCalories: calories,
        dietDiets: diets,
        dietAllergies: allergies,
        locationType: location,
        exerciseTime: exerciseDuration,
        exerciseCategory: exerciseType,
        exerciseIntensity: intensity,
        meditationTime: meditationDuration,
        meditationTag: genre,
        userID: email,  // TODO: how to grab userID or email from authentication
        preferredWeather: weather,
        dietCuisines: cuisines,
        dietTime: dietDuration
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}