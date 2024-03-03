import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

function recommendDietTask() {
    // TODO: Call recipe API endpoint
    return;
}

// TODO: Incorporate live data into recommendation factors as well
// Combining queries of ExerciseTasks to get personalized task(s) 
// because AND queries only work on 1 field at a time
async function recommendExerciseTask(category, equipment) {
    const categoryQ = query(collection(db, "ExerciseTasks"), where("category", "==", category));
    // const equipmentQ = query(collection(db, "ExerciseTasks"), where("equipment", "==", equipment));
    
    const categorySnapshot = await getDocs(categoryQ);
    // const equipmentSnapshot = await getDocs(equipmentQ);
    // Uniquely union multiple arrays
    let exerciseUnion = _.union(categorySnapshot.docs);
    
    let randomExercise = _.sample(exerciseUnion);
    return randomExercise.get("name");
}

// Combining queries of MeditationTasks to get personalized task(s) 
// because AND queries only work on 1 field at a time
async function recommendMeditationTask(tag, duration) {
    const tagQ = query(collection(db, "MeditationTasks"), where("meditationTags", "array-contains", tag));
    // const tagsQ = query(collection(db, "MeditationTasks"), where("tags", "in", tags));  // if user prefers multiple tags
    // const durationQ = query(collection(db, "MeditationTasks"), where("duration", "<=", duration));
    
    const tagSnapshot = await getDocs(tagQ);
    // const durationSnapshot = await getDocs(durationQ);
    // Uniquely union multiple arrays
    let meditationUnion = _.union(tagSnapshot.docs);
    
    let randomMeditation = _.sample(meditationUnion);
    return randomMeditation.get("url");
}