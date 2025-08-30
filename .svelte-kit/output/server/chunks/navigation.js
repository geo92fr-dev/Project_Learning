import { w as writable } from "./index.js";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
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
const auth = getAuth(app);
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
function createAuthStore() {
  const initialState = {
    user: null,
    loading: true,
    error: null
  };
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    // Initialisation du store avec surveillance de l'état
    init() {
      onAuthStateChanged(auth, (user) => {
        set({
          user,
          loading: false,
          error: null
        });
      });
    },
    // Connexion avec Google
    async signInWithGoogle() {
      try {
        set({ user: null, loading: true, error: null });
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        set({
          user: result.user,
          loading: false,
          error: null
        });
        return result.user;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur de connexion";
        set({
          user: null,
          loading: false,
          error: errorMessage
        });
        throw err;
      }
    },
    // Déconnexion
    async signOut() {
      try {
        update((state) => ({ ...state, loading: true, error: null }));
        await signOut(auth);
        set({
          user: null,
          loading: false,
          error: null
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur de déconnexion";
        update((state) => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
        throw err;
      }
    },
    // Clear erreur
    clearError() {
      update((state) => ({ ...state, error: null }));
    }
  };
}
const authStore = createAuthStore();
const goto = /* @__PURE__ */ client_method("goto");
export {
  authStore as a,
  goto as g
};
