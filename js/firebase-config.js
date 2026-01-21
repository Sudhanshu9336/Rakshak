// 🔥 COMPLETE WORKING FIREBASE CONFIGURATION
console.log("🚀 Loading Firebase...");

// YOUR FIREBASE CONFIG - COPY PASTE FROM ABOVE
const firebaseConfig = {
  apiKey: "AIzaSyCn4WIijaIevYiXRu2GKcSBWS_qIy-ND0Q",
  authDomain: "rakshak-a8b3c.firebaseapp.com",
  projectId: "rakshak-a8b3c",
  storageBucket: "rakshak-a8b3c.firebasestorage.app",
  messagingSenderId: "592645878142",
  appId: "1:592645878142:web:65dc6429d70d970906832f",
  measurementId: "G-YKP8X71F10"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase Initialized Successfully!");
} else {
    firebase.app(); // if already initialized
}

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Make available globally
window.firebase = firebase;
window.auth = auth;
window.db = db;

console.log("🎯 Firebase Services Ready!");
console.log("📧 Project ID:", firebaseConfig.projectId);