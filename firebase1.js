// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3WJO0D6ie6dOl2Ska4v9NhhCiVQip4WU",
  authDomain: "trippingchat.firebaseapp.com",
  projectId: "trippingchat",
  storageBucket: "trippingchat.firebasestorage.app",
  messagingSenderId: "688894548206",
  appId: "1:688894548206:web:9d2599c7924807b66ebbff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
