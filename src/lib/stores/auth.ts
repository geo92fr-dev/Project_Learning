/**
 * @criticality HIGH
 * @depends ../firebase.js, firebase/auth, svelte/store
 * @description Store réactif pour l'authentification Firebase avec TypeScript strict
 * @phase 1
 * @category auth
 */

// Store d'authentification TypeScript - FunLearning Phase 1
import { writable } from "svelte/store";
import { auth } from "../firebase.js";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";

// Interface pour l'état d'authentification
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Store réactif avec typage strict
function createAuthStore() {
  // État initial typé
  const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
  };

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,

    // Initialisation du store avec surveillance de l'état
    init() {
      onAuthStateChanged(auth, (user: User | null) => {
        set({
          user: user,
          loading: false,
          error: null,
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
          error: null,
        });

        return result.user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur de connexion";
        set({
          user: null,
          loading: false,
          error: errorMessage,
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
          error: null,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur de déconnexion";
        update((state) => ({
          ...state,
          loading: false,
          error: errorMessage,
        }));
        throw err;
      }
    },

    // Clear erreur
    clearError() {
      update((state) => ({ ...state, error: null }));
    },
  };
}

export const authStore = createAuthStore();
