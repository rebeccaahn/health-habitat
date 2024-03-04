import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
} from 'react-native-health';
import appleHealthKit from 'react-native-health';


// Permissions
const permissions = {
permissions: {
    read: [
    AppleHealthKit.Constants.Permissions.HeartRate,
    AppleHealthKit.Constants.Permissions.Steps,
    AppleHealthKit.Constants.Permissions.FlightsClimbed,
    AppleHealthKit.Constants.Permissions.MindfulSession,
    AppleHealthKit.Constants.Permissions.Height,
    AppleHealthKit.Constants.Permissions.Weight,
    AppleHealthKit.Constants.Permissions.DateOfBirth,
    AppleHealthKit.Constants.Permissions.BiologicalSex,
    AppleHealthKit.Constants.Permissions.HeartRate,
    AppleHealthKit.Constants.Permissions.RestingHeartRate,
    AppleHealthKit.Constants.Permissions.WalkingHeartRateAverage,
    AppleHealthKit.Constants.Permissions.Carbohydrates,
    ],
    write: [
        AppleHealthKit.Constants.Permissions.Carbohydrates
    ],
},
};


// Options
const optionsGeneral = {
    startDate: new Date(2020, 1, 1).toISOString(),
    date: new Date().toISOString(), // optional; default now
    includeManuallyAdded: true, // optional: default true
};

const optionsWeight = {
    startDate: new Date(2020, 1, 1).toISOString(),
    date: new Date().toISOString(), // optional; default now
    includeManuallyAdded: true, // optional: default true
    unit: 'pound',
};

const optionsHeart = {
    unit: 'bpm', // optional; default 'bpm'
    startDate: new Date(2021, 0, 0).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
    ascending: true, // optional; default false
    includeManuallyAdded: true,
    limit: 10, // optional; default no limit
};

const optionsSteps = {
    date: new Date().toISOString(), // optional; default now
    includeManuallyAdded: true, // optional: default true
};

const optionsCarbs = {
    unit: 'gramUnit', // optional; default 'gram'
    startDate: new Date(2021, 0, 0).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
    ascending: true, // optional; default false
    includeManuallyAdded: true, // optional: default true
    limit: 10, // optional; default no limit
};


// Functionality

function initializeHealthKit() {
    AppleHealthKit.initHealthKit(permissions, (error) => {
        /* Called after we receive a response from the system */
        
        console.log("INIT RAN");
        
        if (error) {
            console.log('[ERROR] Cannot grant permissions!');
        }
    });

    appleHealthKit.initHealthKit(permissions, () => {});
};


function getAppleHeight() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getLatestHeight(optionsGeneral, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result["value"]);
        }
      });
    });
};


function getAppleWeight() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getLatestWeight(optionsWeight, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result["value"]);
        }
      });
    });
};


function getAppleAge() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDateOfBirth(optionsGeneral, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result["age"]);
        }
      });
    });
};


function getAppleSex() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getBiologicalSex(optionsGeneral, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result["value"]);
        }
      });
    });
};


function getAppleHeartRateCurrent() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeartRateSamples(optionsHeart, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result[result.length - 1]["value"]);
        }
      });
    });
};


function getAppleHeartRateResting() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getRestingHeartRateSamples(optionsHeart, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result[result.length - 1]["value"]);
        }
      });
    });
};


function getAppleHeartRateWalking() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getWalkingHeartRateAverage(optionsHeart, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result[result.length - 1]["value"]);
        }
      });
    });
};

function getAppleSteps() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getStepCount(optionsSteps, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result["value"]);
        }
      });
    });
};

function getAppleCarbs() {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getCarbohydratesSamples(optionsCarbs, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result[result.length - 1]["value"]);
        }
      });
    });
};

function saveAppleCarbs(carbsVal) {
    const optionsCarbsSave = {
        value: carbsVal,
        date: new Date().toISOString(),
        unit: 'gramUnit', // Optional, default is gram
        metadata: {
          HKWasUserEntered: true,
        }
      }

    return new Promise((resolve, reject) => {
      AppleHealthKit.saveCarbohydratesSample(optionsCarbsSave, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve("Carbs saved");
        }
      });
    });
};



export { initializeHealthKit, getAppleHeight, getAppleAge, getAppleWeight, getAppleSex,
         getAppleHeartRateCurrent, getAppleHeartRateResting, getAppleHeartRateWalking,
         getAppleSteps, getAppleCarbs, saveAppleCarbs }
