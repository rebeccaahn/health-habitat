// ALREADY RAN (by running `node add-task-data.js`, make sure to first upload api-data folder with all json files) 
// DO NOT RUN AGAIN!!

import  { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from '../core/config.js'
import { collection, addDoc } from "firebase/firestore"; 
import exerciseData from "../../../api-data/fitness_results.json" assert { type: 'json' };
import blues from "../../../api-data/blues_songs_results.json" assert { type: 'json' };
import chill from "../../../api-data/chill_songs_results.json" assert { type: 'json' };
import classic from "../../../api-data/classic_songs_results.json" assert { type: 'json' };
import ambient from "../../../api-data/dark ambient_songs_results.json" assert { type: 'json' };
import listening from "../../../api-data/easy listening_songs_results.json" assert { type: 'json' };
import fi from "../../../api-data/lo-fi_songs_results.json" assert { type: 'json' };
import piano from "../../../api-data/piano_songs_results.json" assert { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function exerciseCategoryIdToString(number) {
    if (number == 10) {
        return "Abs";
    }
    else if (number == 8) {
        return "Arms";
    }
    else if (number == 12) {
        return "Back";
    }
    else if (number == 14) {
        return "Calves";
    }
    else if (number == 15) {
        return "Cardio";
    }
    else if (number == 11) {
        return "Chest";
    }
    else if (number == 9) {
        return "Legs";
    }
    else if (number == 13) {
        return "Shoulders";
    }
}

// Adding document to collection ExerciseTasks
async function addExerciseTask(id, title, desc, type, completed=false) {
    const exerciseTaskData = {
        task_id: id,
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

// Adding all tasks from json files
// Exercise
Object.entries(exerciseData).forEach(([key, value]) => {
    addExerciseTask(key, value[1], value[2], exerciseCategoryIdToString(value[0]));
});


// Meditation
Object.entries(blues).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "blues");
});

Object.entries(chill).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "chill");
});

Object.entries(classic).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "classic");
});

Object.entries(ambient).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "dark ambient");
});

Object.entries(listening).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "easy listening");
});

Object.entries(fi).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "lo-fi");
});

Object.entries(piano).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "piano");
});