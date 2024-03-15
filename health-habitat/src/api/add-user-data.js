import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../core/config';

// Adding document to collection UserInfo
export default async function addUser(email, calories, cuisines, restrictions, allergies, priceLimit, dietDuration, equipments, gymAccess, goalWeight, meditationDuration, dScore=80, eScore=80, mScore=80) {
    const userData = {
        userID: email,
        dietCalories: calories,
        dietCuisines: cuisines,
        dietRestrictions: restrictions,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        dietTime: dietDuration,
        exerciseEquipments: equipments,
        gymAccess: gymAccess,
        goalWeight: goalWeight,
        meditationTime: meditationDuration,
        dietScore: dScore,
        exerciseScore: eScore,
        meditationScore: mScore,
        dietTask: null,
        exerciseTask: null,
        meditationTask: null,
        pastWorkoutCategories: [],
        completedExerciseTasks: []
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}