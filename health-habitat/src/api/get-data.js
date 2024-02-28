import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

// Finding user's document
async function getUserDocument(id) {
    const userQ = query(collection(db, "UserInfo"), where("userID", "==", id));
    const userSnapshot = await getDocs(userQ);
    return userSnapshot.docs[0]
}

// Getting user's preferred exercise category
function getCategory(userDoc) {
    return userDoc.get("exerciseCategory")
}

// Getting user's preferred exercise muscle
function getMuscle(userDoc) {
    return userDoc.get("exerciseMuscle")
}

// Getting user's preferred exercise equipment
function getEquipment(userDoc) {
    return userDoc.get("exerciseEquipment")
}

// Getting user's preferred meditation tag
function getTag(userDoc) {
    return userDoc.get("meditationTag")
}

// if user prefers multiple tags
// // Getting user's preferred meditation tags
// function getTags(userDoc) {
//     return userDoc.get("meditationTags")
// }

// Getting user's preferred meditation duration
function getDuration(userDoc) {
    return userDoc.get("duration")
}

// Combining queries of ExerciseTasks to get personalized task(s) because AND queries only work on 1 field at a time
async function getRecExerciseTask(category, muscle, equipment) {
    const categoryQ = query(collection(db, "ExerciseTasks"), where("category", "==", category));
    const muscleQ = query(collection(db, "ExerciseTasks"), where("muscleEn", "==", muscle));
    const equipmentQ = query(collection(db, "ExerciseTasks"), where("equipment", "==", equipment));
    
    const categorySnapshot = await getDocs(categoryQ);
    const muscleSnapshot = await getDocs(muscleQ);
    const equipmentSnapshot = await getDocs(equipmentQ);
    let exerciseUnion = _.union(categorySnapshot.docs, muscleSnapshot.docs, equipmentSnapshot.docs)   // Uniquely union multiple arrays
    
    let randomExercise = _.sample(exerciseUnion)
    // console.log(randomExercise.get("name"))
    return randomExercise.get("name")
}

// Combining queries of MeditationTasks to get personalized task(s) because AND queries only work on 1 field at a time
async function getRecMeditationTask(tag, duration) {
    const tagQ = query(collection(db, "MeditationTasks"), where("tags", "array-contains", tag));
    // const tagsQ = query(collection(db, "MeditationTasks"), where("tags", "in", tags));  // if user prefers multiple tags
    const durationQ = query(collection(db, "MeditationTasks"), where("duration", "<=", duration));
    
    const tagSnapshot = await getDocs(tagQ);
    const durationSnapshot = await getDocs(durationQ);
    let meditationUnion = _.union(tagSnapshot.docs, durationSnapshot.docs)   // Uniquely union multiple arrays
    
    let randomMeditation = _.sample(meditationUnion)
    // console.log(randomMeditation.get("url"))
    return randomMeditation.get("url")
}

// Calculating score of ExerciseTasks
async function getExerciseScore() {
    const exerciseScoreQ = query(collection(db, "ExerciseTasks"), where("isCompleted", "==", false));
    const exerciseScoreSnapshot = await getDocs(exerciseScoreQ);
    let exerciseScore = 100 - exerciseScoreSnapshot.size
    // console.log(exerciseScore)
    return exerciseScore
}

// Calculating score of MeditationTasks
async function getMeditationScore() {
    const meditationScoreQ = query(collection(db, "ExerciseTasks"), where("isCompleted", "==", false));
    const meditationScoreSnapshot = await getDocs(meditationScoreQ);
    let meditationScore = 100 - meditationScoreSnapshot.size
    // console.log(meditationScore)
    return meditationScore
}