import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../core/config';

// Adding document to collection UserInfo
export default async function addUser(email, calories, cuisines, restrictions, allergies, priceLimit, dietDuration, equipments, gymAccess, goalWeight, meditationDuration, dScore=100, eScore=100, mScore=100) {
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
        meditationTask: null
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}