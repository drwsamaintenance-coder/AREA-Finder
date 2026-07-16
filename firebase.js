import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD1D2xYJ5egUk13q-bRs7OaejQhIHTKr7Q",
    authDomain: "area-finder-540ae.firebaseapp.com",
    projectId: "area-finder-540ae",
    storageBucket: "area-finder-540ae.firebasestorage.app",
    messagingSenderId: "908056736195",
    appId: "1:908056736195:web:97e8af6311c511bdf4cd76"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const residentCollection = collection(db, "residents");

window.db = db;
window.residentCollection = residentCollection;

window.firebaseFunctions = {
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
};

console.log("✅ Firebase Connected!");