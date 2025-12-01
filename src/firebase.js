// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtkdDDM9LrjxYiE2JqHNJL_Mw0KmJIh34",
  authDomain: "jeevam-tkm.firebaseapp.com",
  projectId: "jeevam-tkm",
  storageBucket: "jeevam-tkm.firebasestorage.app",
  messagingSenderId: "361808928640",
  appId: "1:361808928640:web:2dd5520f9638c6a97d2b65"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);