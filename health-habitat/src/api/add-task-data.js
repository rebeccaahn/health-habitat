// ALREADY RAN (by running `node add-task-data.js`, make sure to first upload api-data folder with all json files) 
// RUN ONE MORE TIME WITH UPDATED PARAMETERS BUT DO NOT RUN AGAIN AFTERWARDS!!

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

// Adding document to collection ExerciseTasks
async function addExerciseTask(id, title, desc, type, equip, completed=false) {
    const exerciseTaskData = {
        task_id: id,
        name: title,
        description: desc,
        category: type,
        equipment: equip,
        isCompleted: completed
    };

    await addDoc(collection(db, "ExerciseTasks"), exerciseTaskData);
}

// Adding document to collection MeditationTasks
async function addMeditationTask(title, desc, name, genre, duration, completed=false) {
    const meditationTaskData = {
        track: title,
        url: desc,
        artist: name,
        tag: genre,
        time: duration,
        isCompleted: completed
    };
    
    await addDoc(collection(db, "MeditationTasks"), meditationTaskData);
}

// Convert exercise category ID to its name
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

// Convert exercise equipment ID to its name
function exerciseEquipmentIdToString(number) {
    if (number == 1) {
        return "Barbell";
    }
    else if (number == 8) {
        return "Bench";
    }
    else if (number == 3) {
        return "Dumbbell";
    }
    else if (number == 4) {
        return "Gym mat";
    }
    else if (number == 9) {
        return "Incline bench";
    }
    else if (number == 10) {
        return "Kettlebell";
    }
    else if (number == 6) {
        return "Pull-up bar";
    }
    else if (number == 2) {
        return "SZ-Bar";
    }
    else if (number == 5) {
        return "Swiss Ball";
    }
    else if (number == 7) {
        return "none (bodyweight exercise)";
    }
}

// Adding all tasks from json files
// Exercise
// TODO: replace # with position of equipment
Object.entries(exerciseData).forEach(([key, value]) => {
    addExerciseTask(key, value[1], value[2], exerciseCategoryIdToString(value[0]), exerciseEquipmentIdToString(value[#]));
});


// Meditation
// TODO: replace # with position of time and copy&paste to rest of calls
Object.entries(blues).forEach(([key, value]) => {
  addMeditationTask(value[0], key, value[1], "blues", value[#]);
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