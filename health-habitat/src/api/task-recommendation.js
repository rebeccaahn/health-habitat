import { db, auth } from '../../App'
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import * as getUserData from "/get-user-data";

export async function recommendDietTask() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Query parameters to put in endpoint call
    // TODO: Call search recipe API endpoint
    let output = `?maxCalories=${getUserData.getCalories(userDoc)}&cuisine=${getUserData.getCuisines(userDoc)}&diet=${getUserData.getRestrictions(userDoc)}&intolerances=${getUserData.getAllergies(userDoc)}&type=${_.sample(getUserData.getMealType())}`

    // Add recommended task to current user into Firestore
    let recipeID = _.sample(output["results"])["id"]
    let task = [recipeID, new Date()]
    
    await updateDoc(userDoc.ref, {
        dietTask: task
    });
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of ExerciseTasks to get personalized task(s) because AND queries only work on 1 field at a time
export async function recommendExerciseTask(intensityLevel) {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Make queries
    const equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "in", getUserData.getEquipments(userDoc)));
    const intensityQ = query(collection(db, "ExerciseTasks"), where("intensity", "<=", intensityLevel));

    // Retrieve queried documents
    const equipmentsSnapshot = await getDocs(equipmentsQ);
    const intensitySnapshot = await getDocs(intensityQ);

    // Uniquely union multiple arrays
    let exerciseUnion = _.union(intensitySnapshot.docs, equipmentsSnapshot.docs);
    
    // Add recommended task to current user into Firestore
    let randomExercise = _.sample(exerciseUnion);
    let task = [randomExercise.get("task_id"), new Date()];

    await updateDoc(userDoc.ref, {
        exerciseTask: task
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