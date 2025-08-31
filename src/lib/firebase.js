// Configuration Firebase simplifiée pour la Phase 3
let app = null;
let auth = null;

export const firebaseConfig = {
  // Configuration de démonstration
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
};

// Initialisation différée de Firebase
export async function initializeFirebase() {
  if (!app) {
    try {
      const { initializeApp } = await import("firebase/app");
      const { getAuth } = await import("firebase/auth");

      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
    } catch (error) {
      console.warn("Firebase non disponible en mode démo:", error);
      // Mode simulation pour les tests et développement
      auth = createMockAuth();
    }
  }
  return { app, auth };
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

// Exports par défaut pour compatibilité
export { auth };
export default { initializeFirebase, firebaseConfig };
