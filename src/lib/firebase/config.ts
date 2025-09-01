// 🔐 FunLearning V2.0 - Phase 2 Firebase Configuration
// Configuration sécurisée et optimisée pour la production

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth as initAuth, type Auth } from "firebase/auth";
import {
  getFirestore as initFirestore,
  type Firestore,
} from "firebase/firestore";
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
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Fonction d'initialisation
function initializeFirebase() {
  console.log("🔧 Début initialisation Firebase, browser:", browser);

  if (!browser) {
    console.log("⚠️ Pas côté browser, initialisation ignorée");
    return { app: null, auth: null, db: null };
  }

  if (auth) {
    console.log("✅ Firebase déjà initialisé");
    return { app, auth, db };
  }

  try {
    console.log("📋 Validation config...");
    validateConfig();
    console.log("✅ Config validée");

    console.log("🚀 Initialisation app...");
    app = initializeApp(firebaseConfig);
    console.log("✅ App initialisée:", !!app);

    console.log("🔐 Initialisation auth...");
    auth = initAuth(app);
    console.log("✅ Auth initialisée:", !!auth);

    console.log("💾 Initialisation firestore...");
    db = initFirestore(app);
    console.log("✅ Firestore initialisé:", !!db);

    console.log("🔥 Firebase initialisé avec succès");
    return { app, auth, db };
  } catch (error) {
    console.error("❌ Erreur initialisation Firebase:", error);
    if (error instanceof Error) {
      console.error("❌ Détails erreur:", error.message);
      console.error("❌ Stack:", error.stack);
    }
    // NE PAS throw pour éviter de casser l'app
    return { app: null, auth: null, db: null };
  }
}

// Initialisation immédiate si côté browser
initializeFirebase();

// Fonctions d'accès sécurisées
export function getAuthInstance(): Auth {
  if (!auth) {
    console.log("⚠️ Auth pas encore initialisé, tentative d'initialisation...");
    initializeFirebase();
    if (!auth) {
      throw new Error(
        "Firebase Auth not initialized. Ensure Firebase is initialized in browser."
      );
    }
  }
  console.log("✅ Retour auth instance:", auth);
  return auth;
}

// Version asynchrone pour s'assurer que l'initialisation est terminée
export async function getAuthInstanceAsync(): Promise<Auth> {
  if (!auth) {
    console.log("⚠️ Auth pas encore initialisé, initialisation...");
    initializeFirebase();
    // Attendre que l'initialisation soit terminée
    let attempts = 0;
    while (!auth && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
    if (!auth) {
      throw new Error("Firebase Auth not initialized after multiple attempts.");
    }
  }
  console.log("✅ Retour auth instance async:", auth);
  return auth;
}

export function getDatabase(): Firestore {
  if (!db) {
    throw new Error(
      "Firebase Firestore not initialized. Ensure Firebase is initialized in browser."
    );
  }
  return db;
}

export function getApp(): FirebaseApp {
  if (!app) {
    throw new Error(
      "Firebase App not initialized. Ensure Firebase is initialized in browser."
    );
  }
  return app;
}

// Export de toutes les fonctions et variables
export { app, auth, db, firebaseConfig, initializeFirebase };

// 📋 Phase Status: ✅ Phase 2 - Configuration Firebase TypeScript sécurisée
