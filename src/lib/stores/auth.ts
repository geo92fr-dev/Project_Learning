import { writable, type Writable } from 'svelte/store';

export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  provider?: string;
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
  error: null
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
    authStore.update(state => ({
      ...state,
      user,
      loading: false,
      error: null
    }));
  },

  signOut: () => {
    authStore.update(state => ({
      ...state,
      user: null,
      loading: false,
      error: null
    }));
  },

  setLoading: (loading: boolean) => {
    authStore.update(state => ({
      ...state,
      loading
    }));
  },

  setError: (error: string | null) => {
    authStore.update(state => ({
      ...state,
      error,
      loading: false
    }));
  }
};
