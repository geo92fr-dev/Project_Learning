import { writable, type Writable } from "svelte/store";
import type { LoginCredentials, RegisterCredentials } from "$lib/types/auth";

export interface User {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  name?: string;
  photoURL?: string;
  provider?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Store principal d'authentification
export const authStore: Writable<AuthState> = writable({
  user: null,
  loading: false,
  error: null,
});

// Store pour l'utilisateur actuel (raccourci)
export const currentUser: Writable<User | null> = writable(null);

// Store pour le statut de connexion
export const isAuthenticated: Writable<boolean> = writable(false);

// Synchronisation des stores
authStore.subscribe((state) => {
  currentUser.set(state.user);
  isAuthenticated.set(!!state.user);
});

// Actions pour l'authentification
export const authActions = {
  signIn: (user: User) => {
    authStore.update((state) => ({
      ...state,
      user,
      loading: false,
      error: null,
    }));
  },

  signOut: () => {
    authStore.update((state) => ({
      ...state,
      user: null,
      loading: false,
      error: null,
    }));
  },

  setLoading: (loading: boolean) => {
    authStore.update((state) => ({
      ...state,
      loading,
    }));
  },

  setError: (error: string | null) => {
    authStore.update((state) => ({
      ...state,
      error,
      loading: false,
    }));
  },
};

// Authentication functions
export async function signIn(credentials: LoginCredentials): Promise<void> {
  authActions.setLoading(true);
  authActions.setError(null);

  try {
    // Simulate authentication - replace with actual Firebase auth
    const now = new Date().toISOString();
    const mockUser: User = {
      id: `user_${Date.now()}`,
      uid: `user_${Date.now()}`,
      email: credentials.email,
      displayName: credentials.email.split("@")[0],
      name: credentials.email.split("@")[0],
      emailVerified: true,
      createdAt: now,
      lastLoginAt: now,
    };

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    authActions.signIn(mockUser);
  } catch (error: any) {
    authActions.setError(error.message || "Login failed");
    throw error;
  }
}

export async function signUp(credentials: RegisterCredentials): Promise<void> {
  authActions.setLoading(true);
  authActions.setError(null);

  try {
    // Simulate authentication - replace with actual Firebase auth
    const now = new Date().toISOString();
    const mockUser: User = {
      id: `user_${Date.now()}`,
      uid: `user_${Date.now()}`,
      email: credentials.email,
      displayName: credentials.displayName || credentials.email.split("@")[0],
      name: credentials.displayName || credentials.email.split("@")[0],
      emailVerified: false, // New users need to verify email
      createdAt: now,
      lastLoginAt: now,
    };

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    authActions.signIn(mockUser);
  } catch (error: any) {
    authActions.setError(error.message || "Registration failed");
    throw error;
  }
}

export async function signOut(): Promise<void> {
  authActions.setLoading(true);

  try {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    authActions.signOut();
  } catch (error: any) {
    authActions.setError(error.message || "Sign out failed");
    throw error;
  }
}

export async function initAuth(): Promise<void> {
  authActions.setLoading(true);

  try {
    // Simulate checking for existing session
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just clear loading state
    authActions.setLoading(false);
  } catch (error: any) {
    authActions.setError(error.message || "Auth initialization failed");
  }
}

// Export individual stores for convenience
export const user = currentUser;
export const loading = writable(false);

// Sync loading state with authStore
authStore.subscribe((state) => {
  loading.set(state.loading);
});
