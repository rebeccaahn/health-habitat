import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

// Combining queries of Exercise_Tasks to get personalized task(s) because AND queries only work on 1 field at a time
const categoryQ = query(collection(db, "Exercise_Tasks"), where("category", "==", "Abs"));
const muscleQ = query(collection(db, "Exercise_Tasks"), where("muscle_en", "==", "Shoulders"));
const equipmentQ = query(collection(db, "Exercise_Tasks"), where("equipment", "==", "Barbell"));

const categorySnapshot = await getDocs(categoryQ);
const muscleSnapshot = await getDocs(muscleQ);
const equipmentSnapshot = await getDocs(equipmentQ);
let exerciseUnion = _.union(categorySnapshot.docs, muscleSnapshot.docs, equipmentSnapshot.docs)   // Uniquely union multiple arrays

let randomExercise = _.sample(exerciseUnion)
console.log(randomExercise.get("name"))
// exerciseUnion.forEach((doc) => {
//   console.log(doc.id, " => ", doc.get("name"));
// });

// Calculating score of Exercise_Tasks
const exerciseScoreQ = query(collection(db, "Exercise_Tasks"), where("is_completed", "==", false));
const exerciseScoreSnapshot = await getDocs(exerciseScoreQ);
let exercise_score = 100 - exerciseScoreSnapshot.size


// Combining queries of Meditation_Tasks to get personalized task(s) because AND queries only work on 1 field at a time
const tagQ = query(collection(db, "Meditation_Tasks"), where("tags", "array-contains", "pop"));
const durationQ = query(collection(db, "Meditation_Tasks"), where("duration", "<=", "240000"));

const tagSnapshot = await getDocs(tagQ);
const durationSnapshot = await getDocs(durationQ);
let meditationUnion = _.union(tagSnapshot.docs, durationSnapshot.docs)   // Uniquely union multiple arrays

let randomMeditation = _.sample(meditationUnion)
console.log(randomMeditation.get("url"))
// meditationUnion.forEach((doc) => {
//   console.log(doc.id, " => ", doc.get("url"));
// });

// Calculating score of Meditation_Tasks
const meditationScoreQ = query(collection(db, "Exercise_Tasks"), where("is_completed", "==", false));
const meditationScoreSnapshot = await getDocs(meditationScoreQ);
let meditation_score = 100 - meditationScoreSnapshot.size