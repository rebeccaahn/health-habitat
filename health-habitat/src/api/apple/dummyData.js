function dummyInitialize() {
    return;
}


function getDummyHeight() {
    // Return total height in inches
    // This is 5' 10"
    return 70.0;
}

function getDummyWeight() {
    // Return total weight in lbs
    return 150;
}

function getDummyAge() {
    // Return age in years
    return 20;
}

function getDummySex() {
    // Return sex (unknown, female, male, other)
    return 'other';
}

function getDummyHeartRateCurrent() {
    return 74;
}

function getDummyHeartRateResting() {
    return 68;
}

function getDummyHeartRateWalking() {
    return 78;
}

function getDummySteps() {
    return 250;
}

function getDummyCarbs() {
    return 8;
}

function saveDummyCarbs(carbsVal) {
    return "Carbs saved";
}

function getDummyLocation() {
    return {"accuracy": 5, "altitude": 0, "altitudeAccuracy": -1, "heading": -1, "latitude": 30.0000, "longitude": -120.000000, "speed": -1};
}


export { dummyInitialize, getDummyHeight, getDummyAge, getDummyWeight, getDummySex, 
         getDummyHeartRateCurrent, getDummyHeartRateResting, getDummyHeartRateWalking,
         getDummySteps, getDummyCarbs, saveDummyCarbs, getDummyLocation };
