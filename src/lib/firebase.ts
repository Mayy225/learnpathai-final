
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-0lOzABQNkJ6UYueP6KGKxUVAuYslw_A",
  authDomain: "learnpath-ai.firebaseapp.com",
  projectId: "learnpath-ai",
  storageBucket: "learnpath-ai.firebasestorage.app",
  messagingSenderId: "1025747415168",
  appId: "1:1025747415168:web:e534439e83f1aae367b665",
  measurementId: "G-49LNZVSVF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, analytics };
