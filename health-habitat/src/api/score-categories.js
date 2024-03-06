import { auth } from '../../App'
import { updateDoc, increment } from "firebase/firestore";
import * as getUserData from "./get-user-data";
import * as recommend from "./task-recommendation";

// TODO: put this code in each category page load
// Check if task has become outdated
function checkIfDietTaskIsOutdated() {
    // Convert milliseconds to day
    const day = 1000*60*60*24;

    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Get assigned date of current task
    const assignedDate = getUserData.getDietTask(userDoc)[1]

    // Check if day has passed by
    if (new Date().getDay() != assignedDate.getDay()) {
        recommend.recommendDietTask();
    }
}
function checkIfExerciseTaskIsOutdated() {
    // Convert milliseconds to day
    const day = 1000*60*60*24;

    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Get assigned date of current task
    const assignedDate = getUserData.getExerciseTask(userDoc)[1]

    // Check if day has passed by
    if (new Date().getDay() != assignedDate.getDay()) {
        recommend.recommendExerciseTask();
    }
}
function checkIfMeditationTaskIsOutdated() {
    // Convert milliseconds to day
    const day = 1000*60*60*24;

    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Get assigned date of current task
    const assignedDate = getUserData.getMeditationTask(userDoc)[1]

    // Check if day has passed by
    if (new Date().getDay() != assignedDate.getDay()) {
        recommend.recommendMeditationTask();
    }
}

// When task is completed
// Incrementing score of Diet category
export async function incrementDietScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Recommend new task
    recommend.recommendDietTask();

    // Increment score
    await updateDoc(userDoc.ref, {
        dietScore: increment(10)
    });
}

// Incrementing score of Exercise category
export async function incrementExerciseScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Recommend new task
    recommend.recommendExerciseTask();

    // Increment score
    await updateDoc(userDoc.ref, {
        exerciseScore: increment(10)
    });
}

// Incrementing score of Meditation category
export async function incrementMeditationScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Recommend new task
    recommend.recommendMeditationTask();

    // Increment score
    await updateDoc(userDoc.ref, {
        meditationScore: increment(10)
    });
}

// Decrementing score of Diet category
export async function decrementDietScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Get assigned date of current task
    const assignedDate = getUserData.getDietTask(userDoc)[1]

    // Decrement score by how much time passed by
    await updateDoc(userDoc.ref, {
        dietScore: increment(-0.01 * (new Date().getHours() - assignedDate.getHours()))
    });
}

// Decrementing score of Exercise category
export async function decrementExerciseScore(number) {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Get assigned date of current task
    const assignedDate = getUserData.getExerciseTask(userDoc)[1]

    // Decrement score by how much time passed by
    await updateDoc(userDoc.ref, {
        exerciseScore: increment(-0.01 * (new Date().getHours() - assignedDate.getHours()))
    });
}

// Decrementing score of Meditation category
export async function decrementMeditationScore(number) {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    // Get assigned date of current task
    const assignedDate = getUserData.getMeditationTask(userDoc)[1]

    // Decrement score by how much time passed by
    await updateDoc(userDoc.ref, {
        meditationScore: increment(-0.01 * (new Date().getHours() - assignedDate.getHours()))
    });
}

// Calculate the terrarium score for dashboard
export function calculateOverallScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    return (getDietScore(userDoc) + getExerciseScore(userDoc) + getMeditationScore(userDoc))/3;
}