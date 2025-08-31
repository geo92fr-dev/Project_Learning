// Mock Firebase Auth pour les tests
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(null);
    return () => {}; // unsubscribe function
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    return {
      user: {
        uid: "test-uid",
        email,
        displayName: email.split("@")[0],
      },
    };
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    return {
      user: {
        uid: "test-uid",
        email,
        displayName: email.split("@")[0],
      },
    };
  },
  signOut: async () => {
    return Promise.resolve();
  },
  GoogleAuthProvider: class {
    static credential() {
      return {};
    }
  },
  signInWithPopup: async () => {
    return {
      user: {
        uid: "google-test-uid",
        email: "test@gmail.com",
        displayName: "Test User",
      },
    };
  },
};

// Mock Firebase
export const firebase = {
  auth: () => mockAuth,
  initializeApp: () => ({}),
  getApps: () => [],
  apps: [],
};

// Export par défaut pour compatibilité
export default firebase;
