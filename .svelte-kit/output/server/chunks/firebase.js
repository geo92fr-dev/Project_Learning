import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyA3Mq1EgBB3gDzbzBRIB7WAO9UaHK9UV0Y",
  authDomain: "revision-a7a12.firebaseapp.com",
  projectId: "revision-a7a12",
  storageBucket: "revision-a7a12.firebasestorage.app",
  messagingSenderId: "140539996338",
  appId: "1:140539996338:web:23dfd4c91dcd6d8d3dc1ab",
  measurementId: "G-1W275X2WP0"
};
const app = initializeApp(firebaseConfig);
getAuth(app);
getFirestore(app);
let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.warn("Analytics non disponible:", errorMessage);
  }
}
