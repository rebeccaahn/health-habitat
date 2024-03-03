import { db, auth } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

function recommendDietTask() {
    userDoc = getUserDocument(auth.currentUser.email);

    // Query parameters to put in endpoint call
    // TODO: Call search recipe API endpoint
    output = `?maxCalories=${getCalories(userDoc)}&cuisine=${getCuisines(userDoc)}&diet=${getRestrictions(userDoc)}&intolerances=${getAllergies(userDoc)}&type=${_.sample(getMealType())}`

    recipeID = _.sample(output["results"])["id"]

    // TODO: Call recipe card API endpoint
    return;
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of ExerciseTasks to get personalized task(s) because AND queries only work on 1 field at a time
async function recommendExerciseTask() {
    // Get current user data
    userDoc = getUserDocument(auth.currentUser.email);

    // Make queries
    const categoriesQ = query(collection(db, "ExerciseTasks"), where("category", "in", getCategories(userDoc)));
    const equipmentsQ = query(collection(db, "ExerciseTasks"), where("equipment", "in", getEquipments(userDoc)));

    // Retrieve queried documents
    const categoriesSnapshot = await getDocs(categoriesQ);
    const equipmentsSnapshot = await getDocs(equipmentsQ);

    // Uniquely union multiple arrays
    let exerciseUnion = _.union(categoriesSnapshot.docs, equipmentsSnapshot.docs);
    
    // Return recommended task
    let randomExercise = _.sample(exerciseUnion);
    return [randomExercise.get("name"), randomExercise.get("description")];
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of MeditationTasks to get personalized task(s) because AND queries only work on 1 field at a time
async function recommendMeditationTask() {
    // Get current user data
    userDoc = getUserDocument(auth.currentUser.email);

    // Make queries
    const tagQ = query(collection(db, "MeditationTasks"), where("tag", "in", getTags(userDoc)));
    const timeQ = query(collection(db, "MeditationTasks"), where("time", "in", getMeditationTime(userDoc)));
    
    // Retrieve queried documents
    const tagSnapshot = await getDocs(tagQ);
    const timeSnapshot = await getDocs(timeQ);

    // Uniquely union multiple arrays
    let meditationUnion = _.union(tagSnapshot.docs, timeSnapshot.docs);
    
    // Return recommended task
    let randomMeditation = _.sample(meditationUnion);
    return randomMeditation.get("url");
}