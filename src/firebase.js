// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKHC5ZiLgtuIIKBD95CuMfUt_S-HAErAA",
  authDomain: "mountainartgallery-70f52.firebaseapp.com",
  projectId: "mountainartgallery-70f52",
  storageBucket: "mountainartgallery-70f52.appspot.com", // ✅ fix here
  messagingSenderId: "27490042984",
  appId: "1:27490042984:web:fbf616fd55a0ca3c0fe7dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
