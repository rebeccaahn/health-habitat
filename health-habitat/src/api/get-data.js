import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

// Combining queries of Exercise_Tasks to get personalized task(s) because AND queries only work on 1 field at a time
async function getRecExerciseTask(category, muscle, equipment) {
    const categoryQ = query(collection(db, "Exercise_Tasks"), where("category", "==", category));
    const muscleQ = query(collection(db, "Exercise_Tasks"), where("muscle_en", "==", muscle));
    const equipmentQ = query(collection(db, "Exercise_Tasks"), where("equipment", "==", equipment));
    
    const categorySnapshot = await getDocs(categoryQ);
    const muscleSnapshot = await getDocs(muscleQ);
    const equipmentSnapshot = await getDocs(equipmentQ);
    let exerciseUnion = _.union(categorySnapshot.docs, muscleSnapshot.docs, equipmentSnapshot.docs)   // Uniquely union multiple arrays
    
    let randomExercise = _.sample(exerciseUnion)
    return randomExercise.get("name")
    // console.log(randomExercise.get("name"))
    // exerciseUnion.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.get("name"));
    // });
}

// Combining queries of Meditation_Tasks to get personalized task(s) because AND queries only work on 1 field at a time
async function getRecMeditationTask(tag, duration) {
    const tagQ = query(collection(db, "Meditation_Tasks"), where("tags", "array-contains", tag));
    const durationQ = query(collection(db, "Meditation_Tasks"), where("duration", "<=", duration));
    
    const tagSnapshot = await getDocs(tagQ);
    const durationSnapshot = await getDocs(durationQ);
    let meditationUnion = _.union(tagSnapshot.docs, durationSnapshot.docs)   // Uniquely union multiple arrays
    
    let randomMeditation = _.sample(meditationUnion)
    return randomMeditation.get("url")
    // console.log(randomMeditation.get("url"))
    // meditationUnion.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.get("url"));
    // });
}

// Calculating score of Exercise_Tasks
async function getExerciseScore() {
    const exerciseScoreQ = query(collection(db, "Exercise_Tasks"), where("is_completed", "==", false));
    const exerciseScoreSnapshot = await getDocs(exerciseScoreQ);
    let exercise_score = 100 - exerciseScoreSnapshot.size
}

// Calculating score of Meditation_Tasks
async function getMeditationScore() {
    const meditationScoreQ = query(collection(db, "Exercise_Tasks"), where("is_completed", "==", false));
    const meditationScoreSnapshot = await getDocs(meditationScoreQ);
    let meditation_score = 100 - meditationScoreSnapshot.size
}