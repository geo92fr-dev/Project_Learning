// 🔐 FunLearning V2.0 - Phase 2 Firebase Configuration
// Configuration sécurisée et optimisée pour la production

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth as initAuth, type Auth } from "firebase/auth";
import { getFirestore as initFirestore, type Firestore } from "firebase/firestore";
import { browser } from "$app/environment";

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validation de la configuration
function validateConfig() {
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
  ];
  const missing = requiredKeys.filter((key) => !firebaseConfig[key]);

  if (missing.length > 0) {
    throw new Error(
      `Configuration Firebase incomplète. Clés manquantes: ${missing.join(
        ", "
      )}`
    );
  }
}

// Initialisation Firebase (côté client uniquement)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (browser) {
  try {
    validateConfig();
    app = initializeApp(firebaseConfig);
    auth = initAuth(app);
    db = initFirestore(app);

    console.log("🔥 Firebase initialisé avec succès");
  } catch (error) {
    console.error("❌ Erreur initialisation Firebase:", error);
    throw error;
  }
}

export { app, auth, db };

// Fonctions d'accès sécurisées
export function getAuth(): Auth {
  if (!auth) {
    throw new Error("Firebase Auth not initialized. Ensure Firebase is initialized in browser.");
  }
  return auth;
}

export function getDb(): Firestore {
  if (!db) {
    throw new Error("Firebase Firestore not initialized. Ensure Firebase is initialized in browser.");
  }
  return db;
}

export function getApp(): FirebaseApp {
  if (!app) {
    throw new Error("Firebase App not initialized. Ensure Firebase is initialized in browser.");
  }
  return app;
}

// 📋 Phase Status: ✅ Phase 2 - Configuration Firebase TypeScript sécurisée
