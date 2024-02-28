import { db } from '../../App'
import { doc, addDoc } from "firebase/firestore"; 

// Adding document to collection ExerciseTasks
async function addExerciseTask(title, desc, type, muscle, equip, completed) {
    const exerciseTaskData = {
        name: title,
        description: desc,
        category: type,
        muscleEn: muscle,
        equipment: equip,
        isCompleted: completed
    };

    await addDoc(collection(db, "ExerciseTasks"), exerciseTaskData);
}

// Adding document to collection MeditationTasks
async function addMeditationTask(title, desc, time, name, genres, completed) {
    const meditationTaskData = {
        track: title,
        url: desc,
        duration: time,
        artist: name,
        tags: genres,
        isCompleted: completed
    };
    
    await addDoc(collection(db, "MeditationTasks"), meditationTaskData);
}

// Adding document to collection UserInfo
async function addUser(id, time, weather, time, allergies, priceLimit, time, exerciseType, muscle, equipment, genres, muscleType) {
    const userData = {
        userID: id,
        preferredTime: time,
        preferredWeather: weather,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        exerciseCategory: exerciseType,
        exerciseMuscle: muscle,
        exerciseEquipment: equipment,
        meditationTag: genre,   // if user prefers multiple tags: meditationTags: genres
        duration: time
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}


// UNNECESSARY TO SEPARATE OUT PREFERENCES IN SUBCOLLECTIONS?
// // Adding document to subcollection DietPreferences
// async function addDietPreferences(userID, allergiesArray, price, minutes) {
//     const dietPreferencesData = {
//         allergies: allergiesArray,
//         priceLimit: price,
//         duration: minutes
//     };
    
//     await addDoc(collection(db, "UserInfo", userID, "DietPreferences"), dietPreferencesData);
// }

// // Adding document to subcollection ExercisePreferences
// async function addExercisePreferences(userID, exerciseType, muscleType, equip) {
//     const exercisePreferencesData = {
//         category: exerciseType,
//         muscleEn: muscleType,
//         equipment: equip
//     };
    
//     await addDoc(collection((db, "UserInfo", userID, "ExercisePreferences"), exercisePreferencesData);
// }

// // Adding document to subcollection MeditationPreferences
// async function addMeditationPreferences(userID, genre, milliseconds) {
//     const meditationPreferencesData = {
//         tag: genre,
//         duration: milliseconds
//     };
    
//     await addDoc(collection((db, "UserInfo", userID, "MeditationPreferences"), meditationPreferencesData);
// }


// Function: Update "isCompleted" field of document in "*Tasks" collection

// Function: Update document in "UserInfo" collection

// Function: Update document in "DietPreferences" collection

// Function: Update document in "ExercisePreferences" collection

// Function: Update document in "MeditationPreferences" collection