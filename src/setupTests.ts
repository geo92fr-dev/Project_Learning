import { vi } from "vitest";

// Mock Firebase pour tous les tests
vi.mock("$lib/firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return vi.fn(); // unsubscribe
    }),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    signInWithPopup: vi.fn(),
  },
  googleProvider: {},
}));

// Mock stores Svelte
vi.mock("$lib/stores/auth", () => ({
  authStore: {
    subscribe: vi.fn(),
    update: vi.fn(),
    set: vi.fn(),
  },
  currentUser: {
    subscribe: vi.fn(),
    set: vi.fn(),
  },
  isAuthenticated: {
    subscribe: vi.fn(),
    set: vi.fn(),
  },
  authActions: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
  },
}));

// Mock des APIs du navigateur
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();
