import { db } from '../../App'
import { doc, addDoc } from "firebase/firestore"; 

// Adding document to collection ExerciseTasks
async function addExerciseTask(title, desc, type, equip, completed) {
    const exerciseTaskData = {
        name: title,
        description: desc,
        category: type,
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
async function addUser(id, time, weather, cuisines, diets, allergies, priceLimit, time, exerciseTypes, equipments, genres, time) {
    const userData = {
        userID: id,
        preferredWeather: weather,
        dietCuisines: cuisines,
        dietDiets: diets,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        exerciseCategories: exerciseTypes,
        exerciseEquipments: equipments,
        meditationTags: genres,
        duration: time
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}

// TODO?
// Function: Update "isCompleted" field of document in "*Tasks" collection

// Function: Update document in "UserInfo" collection