import { 
    initializeHealthKit, getAppleHeight, getAppleAge, getAppleWeight, getAppleSex ,
    getAppleHeartRateCurrent, getAppleHeartRateResting, getAppleHeartRateWalking,
    getAppleSteps, getAppleCarbs, saveAppleCarbs
} from "./prodData";
import { 
    dummyInitialize, getDummyHeight, getDummyAge, getDummyWeight, getDummySex,
    getDummyHeartRateCurrent, getDummyHeartRateResting, getDummyHeartRateWalking,
    getDummySteps, getDummyCarbs, saveDummyCarbs
} from "./dummyData";


const isProd = true;

const initHealthApi = () => {
    if (isProd) {
        return initializeHealthKit();
    } else {
        return dummyInitialize();
    }
}


const getHeight = async () => {
    // Get height in inches
    if (isProd) {
        try {
            return await getAppleHeight();
        } catch (error) {
            console.error("Error fetching height data:", error);
        }
    } else {
        return getDummyHeight();
    }
}


const getWeight = async () => {
    // Get weight in lbs
    if (isProd) {
        try {
            return await getAppleWeight();
        } catch (error) {
            console.error("Error fetching weight data:", error);
        }
    } else {
        return getDummyWeight();
    }
}


const getAge = async () => {
    // Get age in years
    if (isProd) {
        try {
            return await getAppleAge();
        } catch (error) {
            console.error("Error fetching age data:", error);
        }
    } else {
        return getDummyAge();
    }
}

const getSex = async () => {
    // Get sex (unknown, female, male, other)
    if (isProd) {
        try {
            return await getAppleSex();
        } catch (error) {
            console.error("Error fetching sex data:", error);
        }
    } else {
        return getDummySex();
    }
}

const getHeartRateCurrent = async () => {
    // Get heart rate in bpm
    if (isProd) {
        try {
            return await getAppleHeartRateCurrent();
        } catch (error) {
            console.error("Error fetching heart rate data:", error);
        }
    } else {
        return getDummyHeartRateCurrent();
    }
}

const getHeartRateResting = async () => {
    // Get resting heart rate in bpm
    if (isProd) {
        try {
            return await getAppleHeartRateResting();
        } catch (error) {
            console.error("Error fetching resting heart rate data:", error);
        }
    } else {
        return getDummyHeartRateResting();
    }
}

const getHeartRateWalking = async () => {
    // Get walking heart rate in bpm
    if (isProd) {
        try {
            return await getAppleHeartRateWalking();
        } catch (error) {
            console.error("Error fetching walking heart rate data:", error);
        }
    } else {
        return getDummyHeartRateWalking();
    }
}

const getSteps = async () => {
    // Get steps
    if (isProd) {
        try {
            return await getAppleSteps();
        } catch (error) {
            console.error("Error fetching steps data:", error);
        }
    } else {
        return getDummySteps();
    }
}

const getCarbs = async () => {
    // Get carbs
    if (isProd) {
        try {
            return await getAppleCarbs();
        } catch (error) {
            console.error("Error fetching carbs data:", error);
        }
    } else {
        return getDummyCarbs();
    }
}

const saveCarbs = async (carbsVal) => {
    // Set carbs to carbsVal
    if (isProd) {
        try {
            return await saveAppleCarbs(carbsVal);
        } catch (error) {
            console.error("Error fetching carbs data:", error);
        }
    } else {
        return saveDummyCarbs(carbsVal);
    }
}


export { initHealthApi, getHeight, getAge, getWeight, getSex, 
         getHeartRateCurrent, getHeartRateResting, getHeartRateWalking,
         getSteps, getCarbs, saveCarbs, isProd };
