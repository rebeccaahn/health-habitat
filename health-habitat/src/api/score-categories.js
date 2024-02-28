import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

// Getting score of DietTasks
function getDietScore() {
    return 100;
}

// Getting score of ExerciseTasks
function getExerciseScore() {
    return 100;
}

// Getting score of MeditationTasks
function getMeditationScore() {
    return 100;
}

// Setting score of DietTasks
async function setDietScore() {
    return getDietScore();
}

// Setting score of ExerciseTasks
async function setExerciseScore() {
    const exerciseScoreQ = query(collection(db, "ExerciseTasks"), where("isCompleted", "==", false));
    const exerciseScoreSnapshot = await getDocs(exerciseScoreQ);
    return getExerciseScore() - exerciseScoreSnapshot.size;
}

// Setting score of MeditationTasks
async function setMeditationScore() {
    const meditationScoreQ = query(collection(db, "MeditationTasks"), where("isCompleted", "==", false));
    const meditationScoreSnapshot = await getDocs(meditationScoreQ);
    return getMeditationScore() - meditationScoreSnapshot.size;;
}