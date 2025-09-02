// 🔥 Firebase Configuration - FunLearning V2.0
// Configuration SSR-Safe selon DOC_CoPilot_Practices
// Version sans top-level await pour compatibilité build

import { browser } from "$app/environment";

// Configuration Firebase depuis variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

let app = null;
let auth = null;
let db = null;
let initializationPromise = null;

// Firestore mock pour développement et tests
function createMockFirestore() {
  return {
    collection: () => ({
      add: async () => ({ id: 'mock-doc-' + Date.now() }),
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => ({}),
        update: async () => ({}),
        delete: async () => ({})
      }),
      where: () => ({
        orderBy: () => ({
          get: async () => ({ empty: true, docs: [] })
        }),
        get: async () => ({ empty: true, docs: [] })
      }),
      orderBy: () => ({
        get: async () => ({ empty: true, docs: [] })
      }),
      get: async () => ({ empty: true, docs: [] })
    }),
    doc: () => ({
      get: async () => ({ exists: false, data: () => null }),
      set: async () => ({}),
      update: async () => ({}),
      delete: async () => ({})
    })
  };
}

// Auth mock pour développement et tests
function createMockAuth() {
  return {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {}; // unsubscribe
    },
    signInWithEmailAndPassword: async (email, password) => {
      return {
        user: {
          uid: "demo-uid",
          email,
          displayName: email.split("@")[0],
        },
      };
    },
    createUserWithEmailAndPassword: async (email, password) => {
      return {
        user: {
          uid: "demo-uid",
          email,
          displayName: email.split("@")[0],
        },
      };
    },
    signOut: async () => {
      return Promise.resolve();
    },
  };
}

// Initialisation différée de Firebase
async function initializeFirebase() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    if (!browser) {
      // Mode simulation pour SSR
      return { app: null, auth: createMockAuth(), db: createMockFirestore() };
    }

    try {
      const { initializeApp } = await import("firebase/app");
      const { getAuth, connectAuthEmulator } = await import("firebase/auth");
      const { getFirestore, connectFirestoreEmulator } = await import("firebase/firestore");

      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);

      // Connect to auth emulator in development
      if (
        import.meta.env.DEV &&
        import.meta.env.VITE_FIREBASE_EMULATOR_AUTH === "true"
      ) {
        if (!auth._delegate?._config?.emulator) {
          try {
            connectAuthEmulator(auth, "http://localhost:9099");
            console.log("🔥 Firebase Auth Emulator connecté");
          } catch (error) {
            console.warn(
              "🔥 Firebase Auth Emulator non disponible, utilisation production"
            );
          }
        }
      }

      // Connect to Firestore emulator in development
      if (
        import.meta.env.DEV &&
        import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE === "true"
      ) {
        try {
          connectFirestoreEmulator(db, "localhost", 8080);
          console.log("🔥 Firebase Firestore Emulator connecté");
        } catch (error) {
          console.warn(
            "🔥 Firebase Firestore Emulator non disponible, utilisation production"
          );
        }
      }

      console.log("🔥 Firebase initialisé avec succès");
      return { app, auth, db };
    } catch (error) {
      console.warn("🔥 Firebase non disponible, mode simulation:", error);
      return { app: null, auth: createMockAuth(), db: createMockFirestore() };
    }
  })();

  return initializationPromise;
}

// Getter pour auth (initialise si nécessaire)
async function getAuthInstance() {
  const { auth } = await initializeFirebase();
  return auth;
}

// Getter pour Firestore (initialise si nécessaire)
async function getFirestoreInstance() {
  const { db } = await initializeFirebase();
  return db;
}

// Exports
export { firebaseConfig, initializeFirebase, getAuthInstance, getFirestoreInstance };
export { auth, db };
