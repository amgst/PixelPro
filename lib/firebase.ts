// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEk9rtGb4wIUstkoBsc_rD65orAPBAuuM",
    authDomain: "wbify-869a4.firebaseapp.com",
    projectId: "wbify-869a4",
    storageBucket: "wbify-869a4.firebasestorage.app",
    messagingSenderId: "750324593224",
    appId: "1:750324593224:web:e07543786e367d79bf1e7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Messaging (only in supported environments)
let messaging: any = null;
isSupported().then(supported => {
    if (supported) {
        messaging = getMessaging(app);
    }
}).catch(console.error);

export { app, db, storage, messaging };
