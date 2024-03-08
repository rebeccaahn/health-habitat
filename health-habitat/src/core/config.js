import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyAw3Iei3abF7CEXLgIKgvtaJPSOZzqjY-s",
    authDomain: "health-habitat.firebaseapp.com",
    projectId: "health-habitat",
    storageBucket: "health-habitat.appspot.com",
    messagingSenderId: "412945215603",
    appId: "1:412945215603:web:2a005d7babf6f9000cba06",
    measurementId: "G-QSPYM7V3Y6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

// Initialize Firebase Firestore and get a reference to the service
export const db = getFirestore(app);
