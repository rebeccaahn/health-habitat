import { auth } from '../core/config';
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

    userDoc.then(
        async function (value) {
            // Recommend new task
            await recommend.recommendDietTask();

            // Increment score
            await updateDoc(value.ref, {
                dietScore: Math.min(10+getUserData.getDietScore(value), 100)
            });
        }
    );
}

// Incrementing score of Exercise category
export async function incrementExerciseScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value){
            // Recommend new task
            await recommend.recommendExerciseTask();

            // Increment score
            await updateDoc(value.ref, {
                exerciseScore: Math.min(10+getUserData.getExerciseScore(value), 100)
            });
        }
    );
}

// Incrementing score of Meditation category
export async function incrementMeditationScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value){
            // Recommend new task
            await recommend.recommendMeditationTask();

            // Increment score
            await updateDoc(value.ref, {
                meditationScore: Math.min(10+getUserData.getMeditationScore(value), 100)
            });
        }
    );
}

// Decrementing score of Diet category
export async function decrementDietScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value) {
            // Get assigned date of current task
            const assignedDate = getUserData.getDietTask(value)[1] * 1000

            console.log(new Date().getUTCHours())
            console.log(new Date(assignedDate).getUTCHours())

            // Decrement score by how much time passed by
            await updateDoc(value.ref, {
                dietScore: increment(-0.25 * (new Date().getUTCHours() - new Date(assignedDate).getUTCHours()))
            });
        }
    );
}

// Decrementing score of Exercise category
export async function decrementExerciseScore(number) {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value){
            // Get assigned date of current task
            const assignedDate = getUserData.getExerciseTask(value)[1] * 1000

            // Decrement score by how much time passed by
            await updateDoc(value.ref, {
                exerciseScore: increment(-0.25 * (new Date().getUTCHours() - new Date(assignedDate).getUTCHours()))
            });
        }
    );

}

// Decrementing score of Meditation category
export async function decrementMeditationScore(number) {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    userDoc.then(
        async function (value){
            // Get assigned date of current task
            const assignedDate = getUserData.getMeditationTask(value)[1] * 1000

            // Decrement score by how much time passed by
            await updateDoc(value.ref, {
                meditationScore: increment(-0.25 * (new Date().getUTCHours() - new Date(assignedDate).getUTCHours()))
            });
        }
    );
}

// Calculate the terrarium score for dashboard
export function calculateOverallScore() {
    // Get current user data
    const userDoc = getUserData.getUserDocument(auth.currentUser.email);

    /*
    Calculate average of all scores
    Overview of scoring algorithm:
        - each completed task will increase the total score by 10/3 = 3.33 points
        - after each hour each subscore will decrease by .25 points which will decrease the total score by .25 points
        - this means that after each day the total score will decrease by 6 points if no tasks are completed
        - by completing 1 task per wellness category in one day, the total score will increase by (10 - 6) = 4 points
    */

    return (getDietScore(userDoc) + getExerciseScore(userDoc) + getMeditationScore(userDoc))/3;
}