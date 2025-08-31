// 🔐 Google Authentication Store - TDD Implementation
// Store selon DOC_CoPilot_Practices avec gestion SSR

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// === STORES PRINCIPAUX ===
export const user = writable(null);
export const loading = writable(false);
export const error = writable(null);

// === STORES DÉRIVÉS ===
export const isAuthenticated = derived(
  user, 
  ($user) => $user !== null
);

// === HELPER FUNCTIONS ===
function updateLoadingState(isLoading) {
  loading.set(isLoading);
}

function updateErrorState(errorMessage) {
  error.set(errorMessage);
}

function updateUserState(userData) {
  user.set(userData);
}

export function clearError() {
  error.set(null);
}

// === GOOGLE SIGN IN ===
export async function signInWithGoogle() {
  if (!browser) {
    throw new Error('Authentication only available in browser');
  }

  updateLoadingState(true);
  updateErrorState(null);

  try {
    // Dynamic import pour éviter les erreurs SSR
    const { auth } = await import('../firebase/config.js');
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }

    // Configure Google provider
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    // Sign in with popup
    const result = await signInWithPopup(auth, provider);
    
    // Extract user data
    const userData = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
      createdAt: result.user.metadata.creationTime,
      lastLoginAt: result.user.metadata.lastSignInTime
    };
    
    updateUserState(userData);
    
    console.log('✅ Google authentication successful:', userData.email);
    return { success: true, user: userData };
    
  } catch (error) {
    const errorMessage = getAuthErrorMessage(error);
    updateErrorState(errorMessage);
    
    console.error('❌ Google authentication failed:', error);
    return { success: false, error: errorMessage };
    
  } finally {
    updateLoadingState(false);
  }
}

// === SIGN OUT ===
export async function signOut() {
  if (!browser) {
    return;
  }

  updateLoadingState(true);
  updateErrorState(null);

  try {
    const { auth } = await import('../firebase/config.js');
    const { signOut: firebaseSignOut } = await import('firebase/auth');
    
    if (auth) {
      await firebaseSignOut(auth);
    }
    
    updateUserState(null);
    
    console.log('👋 User signed out successfully');
    return { success: true };
    
  } catch (error) {
    const errorMessage = 'Erreur lors de la déconnexion';
    updateErrorState(errorMessage);
    
    console.error('❌ Sign out failed:', error);
    return { success: false, error: errorMessage };
    
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
    const { auth } = await import('../firebase/config.js');
    const { onAuthStateChanged } = await import('firebase/auth');
    
    if (!auth) {
      console.warn('⚠️ Firebase auth not available for state listener');
      return;
    }

    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          createdAt: firebaseUser.metadata.creationTime,
          lastLoginAt: firebaseUser.metadata.lastSignInTime
        };
        updateUserState(userData);
        console.log('🔄 Auth state changed: user signed in');
      } else {
        updateUserState(null);
        console.log('🔄 Auth state changed: user signed out');
      }
    });
    
  } catch (error) {
    console.error('❌ Auth listener setup failed:', error);
  }
}

// === ERROR HANDLING ===
function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Connexion annulée par l\'utilisateur';
    case 'auth/popup-blocked':
      return 'Popup bloquée par le navigateur. Veuillez autoriser les popups.';
    case 'auth/cancelled-popup-request':
      return 'Demande de connexion annulée';
    case 'auth/network-request-failed':
      return 'Erreur réseau. Vérifiez votre connexion internet.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard.';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    default:
      return error.message || 'Erreur d\'authentification inconnue';
  }
}

// === INITIALIZATION ===
// Initialize auth listener when module loads
if (browser) {
  initAuthListener();
}
