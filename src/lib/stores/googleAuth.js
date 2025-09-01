// 🔐 Google Authentication Store - Clean Version
// Store pour l'authentification Google avec Firebase

import { writable, derived, get } from "svelte/store";
import { browser } from "$app/environment";
import { authInfoStore } from "$lib/firebase/stores/firebase-stores";

// === STORES PRINCIPAUX ===
export const user = writable(null);
export const loading = writable(false);
export const error = writable(null);

// === STORES DÉRIVÉS ===
export const isAuthenticated = derived(user, ($user) => $user !== null);

// === HELPER FUNCTIONS ===
function updateLoadingState(isLoading) {
  loading.set(isLoading);
}

function updateErrorState(errorMessage) {
  error.set(errorMessage);
}

function updateUserState(userData) {
  user.set(userData);

  // Synchroniser avec authInfoStore pour éviter la boucle infinie du dashboard
  authInfoStore.set({
    isAuthenticated: true,
    user: {
      uid: userData.uid,
      email: userData.email,
    },
  });

  console.log("🔄 authInfoStore mis à jour:", userData.email);
}

export function clearError() {
  error.set(null);
}

// Initialiser authInfoStore à l'état non-authentifié SEULEMENT si non défini
export function initializeAuthState() {
  // Ne pas écraser un état déjà défini
  const currentState = get(authInfoStore);
  if (currentState.isAuthenticated !== null) {
    console.log(
      "🔄 authInfoStore déjà initialisé:",
      currentState.isAuthenticated ? "authentifié" : "non-authentifié"
    );
    return;
  }

  authInfoStore.set({
    isAuthenticated: false,
    user: null,
  });
  console.log("🔄 authInfoStore initialisé: non-authentifié");
}

// === GOOGLE SIGN IN ===
export async function signInWithGoogle() {
  if (!browser) {
    throw new Error("Authentication only available in browser");
  }

  updateLoadingState(true);
  updateErrorState(null);

  try {
    console.log("🚀 Début authentification Google...");

    // Import dynamique pour éviter les erreurs SSR
    const firebaseAuth = await import("firebase/auth");
    const configModule = await import("../firebase/config");

    console.log("📋 Config module importé:", Object.keys(configModule));

    // FORCER l'initialisation
    console.log("🔧 Force initialisation Firebase...");
    configModule.initializeFirebase();

    // Attendre que Firebase soit vraiment initialisé
    let auth = configModule.auth;
    let attempts = 0;

    while (!auth && attempts < 10) {
      console.log(
        `⏳ Attente initialisation Firebase (tentative ${attempts + 1}/10)...`
      );
      await new Promise((resolve) => setTimeout(resolve, 200));
      auth = configModule.auth;
      attempts++;
    }

    console.log("🔐 Auth instance récupérée:", auth);
    console.log("🔐 Type auth:", typeof auth);

    if (!auth) {
      throw new Error(
        "Firebase auth not initialized après plusieurs tentatives"
      );
    }

    // Configure Google provider
    const provider = new firebaseAuth.GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");

    console.log("🚀 Tentative de connexion popup...");

    // Sign in with popup
    const result = await firebaseAuth.signInWithPopup(auth, provider);

    // Extract user data
    const userData = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
    };

    updateUserState(userData);

    console.log("✅ Authentification réussie:", userData.email);
    return { success: true, user: userData };
  } catch (error) {
    console.error("❌ Erreur authentification Google:", error);
    updateErrorState(error.message);
    return { success: false, error: error.message };
  } finally {
    updateLoadingState(false);
  }
}

// === SIGN OUT ===
export async function signOut() {
  if (!browser) {
    console.log("⚠️ SignOut called in non-browser environment");
    return { success: false, error: "Not supported in server environment" };
  }

  updateLoadingState(true);
  updateErrorState(null);

  try {
    const firebaseAuth = await import("firebase/auth");
    const { getAuthInstance } = await import("../firebase/config");

    const auth = getAuthInstance();
    if (auth && firebaseAuth.signOut) {
      await firebaseAuth.signOut(auth);
    } else {
      throw new Error("Firebase auth not available or signOut not supported");
    }

    updateUserState(null);

    console.log("👋 Déconnexion réussie");
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur déconnexion:", error);
    updateErrorState(error.message);
    return { success: false, error: error.message };
  } finally {
    updateLoadingState(false);
  }
}

// === AUTH STATE LISTENER ===
export async function initAuthListener() {
  if (!browser) {
    return;
  }

  try {
    console.log("🔍 Initialisation listener auth...");

    const firebaseAuth = await import("firebase/auth");
    const { getAuthInstance } = await import("../firebase/config");

    // Attendre un moment pour l'initialisation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const auth = getAuthInstance();
    if (!auth) {
      console.warn("⚠️ Firebase auth not available for state listener");
      return;
    }

    console.log("✅ Setting up auth state listener");

    firebaseAuth.onAuthStateChanged(auth, (firebaseUser) => {
      console.log(
        "🔄 Auth state changed:",
        firebaseUser ? "Connecté" : "Déconnecté"
      );

      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        updateUserState(userData);
      } else {
        updateUserState(null);
      }
    });

    console.log("✅ Auth listener configuré");
  } catch (error) {
    console.error("❌ Erreur setup auth listener:", error);
  }
}
