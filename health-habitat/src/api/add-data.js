import { db } from '../../App'
import { doc, addDoc } from "firebase/firestore"; 

// Adding document to collection ExerciseTasks
async function addExerciseTask(title, desc, type, completed=false) {
    const exerciseTaskData = {
        name: title,
        description: desc,
        category: type,
        // equipment: equip,
        isCompleted: completed
    };

    await addDoc(collection(db, "ExerciseTasks"), exerciseTaskData);
}

// Adding document to collection MeditationTasks
async function addMeditationTask(title, desc, name, genre, completed=false) {
    const meditationTaskData = {
        track: title,
        url: desc,
        // duration: time,
        artist: name,
        tag: genre,
        isCompleted: completed
    };
    
    await addDoc(collection(db, "MeditationTasks"), meditationTaskData);
}

// Adding document to collection UserInfo
async function addUser(id, time, weather, cuisines, diets, allergies, priceLimit, time, exerciseType, genres, time) {
    const userData = {
        userID: id,
        preferredWeather: weather,
        dietCuisines: cuisines,
        dietDiets: diets,
        dietAllergies: allergies,
        dietPriceLimit: priceLimit,
        exerciseCategory: exerciseType,
        // exerciseEquipments: equipments,
        meditationTags: genres,
        dietDuration: time
    };
    
    await addDoc(collection(db, "UserInfo"), userData);
}

// TODO?
// Function: Update "isCompleted" field of document in "*Tasks" collection

// Function: Update document in "UserInfo" collection


// Exercise
fetch("./exercise.json")
  .then((response) => response.json())
  .then((exerciseData) => {
    for (const list of exerciseData) {
        addExerciseTask(list[1], list[2], list[0]);
    }
  });