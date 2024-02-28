import { db } from '../../App'
import { doc, setDoc } from "firebase/firestore"; 

// Adding document to collection ExerciseTasks
async function addExerciseTask(id, title, desc, type, muscle, equip, completed) {
    const exerciseTaskData = {
        name: title,
        description: desc,
        category: type,
        muscleEn: muscle,
        equipment: equip,
        isCompleted: completed
    };

    await setDoc(doc(db, "ExerciseTasks", id), exerciseTaskData);
}

// Adding document to collection MeditationTasks
async function addMeditationTask(id, title, desc, time, name, genres, completed) {
    const meditationTaskData = {
        track: title,
        url: desc,
        duration: time,
        artist: name,
        tags: genres,
        isCompleted: completed
    };
    
    await setDoc(doc(db, "MeditationTasks", id), meditationTaskData);
}

// Adding document to collection UserInfo
async function addUser(id, time, weather, time) {
    const userData = {
        preferredTime: time,
        preferredWeather: weather
    };
    
    await setDoc(doc(db, "UserInfo", id), userData);
}

// Adding document to subcollection DietPreferences
async function addDietPreferences(userID, id, allergiesArray, price, minutes) {
    const dietPreferencesData = {
        allergies: allergiesArray,
        priceLimit: price,
        duration: minutes
    };
    
    await setDoc(doc(db, "UserInfo", userID, "DietPreferences", id ), dietPreferencesData);
}

// Adding document to subcollection ExercisePreferences
async function addExercisePreferences(userID, id, exerciseType, muscle, equip) {
    const exercisePreferencesData = {
        category: exerciseType,
        muscleEn: muscleType,
        equipment: equip
    };
    
    await setDoc(doc(db, "UserInfo", userID, "ExercisePreferences", id), exercisePreferencesData);
}

// Adding document to subcollection MeditationPreferences
async function addMeditationPreferences(userID, id, genres, muscleType, milliseconds) {
    const meditationPreferencesData = {
        tags: genres,
        duration: milliseconds
    };
    
    await setDoc(doc(db, "UserInfo", userID, "MeditationPreferences", id), meditationPreferencesData);
}


// Function: Update "isCompleted" field of document in "*Tasks" collection

// Function: Update document in "UserInfo" collection

// Function: Update document in "DietPreferences" collection

// Function: Update document in "ExercisePreferences" collection

// Function: Update document in "MeditationPreferences" collection