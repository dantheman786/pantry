// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAceFk8XqYKG00Hj6P-rAwJcgYMDUO0aj8",
  authDomain: "pantry-tracker-17fb4.firebaseapp.com",
  projectId: "pantry-tracker-17fb4",
  storageBucket: "pantry-tracker-17fb4.appspot.com",
  messagingSenderId: "211416472014",
  appId: "1:211416472014:web:0cd2f848cdddaa0b27339f",
  measurementId: "G-1HD2NSGLMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {firestore}