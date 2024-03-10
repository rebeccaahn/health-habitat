import { db, auth } from '../../App'
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import * as getUserData from "./get-user-data";
import env from "./env.json" assert { type: 'json' };

// TODO: put in diet page
// To get recipe card
async function getRecipeCard() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Query parameters to put in endpoint call    
    let response = await fetch(`https://api.spoonacular.com/recipes/${getUserData.getDietTask(userDoc)[0]}/card?apiKey=${env.diet_API_key}`);
    let jsonResp = await response.json();
    
    return jsonResp["url"];
}


export async function recommendDietTask() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Query parameters to put in endpoint call
    let response = null;
    // Account for n/a options and call endpoint accordingly
    if ((getUserData.getRestrictions(userDoc) == "n/a") && (getUserData.getAllergies(userDoc) == "n/a")) {
        response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&minCarbs=${getUserData.getCalories(userDoc)}&cuisine=${getUserData.getCuisines(userDoc)}&type=${_.sample(getUserData.getMealType())}`);
    }
    else if (getUserData.getRestrictions(userDoc) == "n/a") {
        response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&minCarbs=${getUserData.getCalories(userDoc)}&cuisine=${getUserData.getCuisines(userDoc)}&intolerances=${getUserData.getAllergies(userDoc)}&type=${_.sample(getUserData.getMealType())}`);
    }
    else if (getUserData.getAllergies(userDoc) == "n/a") {
        response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&minCarbs=${getUserData.getCalories(userDoc)}&cuisine=${getUserData.getCuisines(userDoc)}&diet=${getUserData.getRestrictions(userDoc)}&type=${_.sample(getUserData.getMealType())}`);
    }
    else {
        response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${env.diet_API_key}&minCarbs=${getUserData.getCalories(userDoc)}&cuisine=${getUserData.getCuisines(userDoc)}&diet=${getUserData.getRestrictions(userDoc)}&intolerances=${getUserData.getAllergies(userDoc)}&type=${_.sample(getUserData.getMealType())}`);
    }
    let jsonResp = await response.json();

    // Add recommended task to current user into Firestore
    let recipeID = _.sample(jsonResp["results"])["id"]
    let task = [recipeID, new Date()]
    
    await updateDoc(userDoc.ref, {
        dietTask: task
    });
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of ExerciseTasks to get personalized task(s) because AND queries only work on 1 field at a time
export async function recommendExerciseTask() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Make queries
    const categoriesQ = query(collection(db, "ExerciseTasks"), where("category", "in", getUserData.getCategories(userDoc)));
    // Account for n/a option and query accordingly
    const equipmentsQ = null;
    if (getUserData.getEquipments(userDoc) == "n/a") {
        equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "==", "none (bodyweight exercise)"));
    }
    else {
        equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "in", getUserData.getEquipments(userDoc)));
    }

    // Retrieve queried documents
    const categoriesSnapshot = await getDocs(categoriesQ);
    const equipmentsSnapshot = await getDocs(equipmentsQ);

    // Uniquely union multiple arrays
    let exerciseUnion = _.union(categoriesSnapshot.docs, equipmentsSnapshot.docs);
    
    // Add recommended task to current user into Firestore
    let randomExercise = _.sample(exerciseUnion);
    let task = [randomExercise.get("task_id"), new Date()];

    await updateDoc(userDoc.ref, {
        exerciseTask: task
    });

    // Push current exercise category to pastWorkoutCategories
    await updateDoc(userDoc.ref, {
        pastWorkoutCategories: arrayUnion(randomExercise.get("category"))
    });
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of MeditationTasks to get personalized task(s) because AND queries only work on 1 field at a time
export async function recommendMeditationTask() {
    // Get current user data
    const userDoc = getUserDocument(auth.currentUser.email);

    // Make queries
    const tagQ = query(collection(db, "MeditationTasks"), where("tag", "in", getUserData.getTags(userDoc)));
    const timeQ = query(collection(db, "MeditationTasks"), where("time", "<=", getUserData.getMeditationTime(userDoc)));
    
    // Retrieve queried documents
    const tagSnapshot = await getDocs(tagQ);
    const timeSnapshot = await getDocs(timeQ);

    // Uniquely union multiple arrays
    let meditationUnion = _.union(tagSnapshot.docs, timeSnapshot.docs);
    
    // Add recommended task to current user into Firestore
    let randomMeditation = _.sample(meditationUnion);
    let task = [randomMeditation.get("url"), new Date()];
    
    await updateDoc(userDoc.ref, {
        meditationTask: task
    });
}