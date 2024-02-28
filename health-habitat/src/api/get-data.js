import { db } from '../../App'
import { collection, query, where, getDocs } from "firebase/firestore";

// Finding user's document
async function getUserDocument(id) {
    const userQ = query(collection(db, "UserInfo"), where("userID", "==", id));
    const userSnapshot = await getDocs(userQ);
    return userSnapshot.docs[0];
}

// Getting user's preferred exercise category
function getCategory(userDoc) {
    return userDoc.get("exerciseCategory");
}

// Getting user's preferred exercise muscle
function getMuscle(userDoc) {
    return userDoc.get("exerciseMuscle");
}

// Getting user's preferred exercise equipment
function getEquipment(userDoc) {
    return userDoc.get("exerciseEquipment");
}

// Getting user's preferred meditation tag
function getTag(userDoc) {
    return userDoc.get("meditationTag");
}

// if user prefers multiple tags
// // Getting user's preferred meditation tags
// function getTags(userDoc) {
//     return userDoc.get("meditationTags");
// }

// Getting user's preferred meditation duration
function getDuration(userDoc) {
    return userDoc.get("duration");
}