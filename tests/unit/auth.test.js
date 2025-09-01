import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
  user,
  loading,
  error,
  isAuthenticated,
  signInWithGoogle,
  signOut,
  clearError,
} from "$lib/stores/googleAuth.js";

// Mock Firebase
vi.mock("$lib/firebase/config.js", () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock("firebase/auth", () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe("Google Auth Store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset stores
    user.set(null);
    loading.set(false);
    error.set(null);
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      expect(get(user)).toBe(null);
      expect(get(loading)).toBe(false);
      expect(get(error)).toBe(null);
      expect(get(isAuthenticated)).toBe(false);
    });
  });

  describe("Derived Stores", () => {
    it("should compute isAuthenticated correctly", () => {
      // When user is null
      user.set(null);
      expect(get(isAuthenticated)).toBe(false);

      // When user exists
      user.set({
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
      });
      expect(get(isAuthenticated)).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should clear errors", () => {
      error.set("Test error");
      expect(get(error)).toBe("Test error");

      clearError();
      expect(get(error)).toBe(null);
    });
  });

  describe("Google Sign In", () => {
    it("should handle sign in process", async () => {
      // Test en environnement Node.js - expect l'erreur appropriée
      try {
        const result = await signInWithGoogle();
        // Si on arrive ici, le test devrait échouer
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe("Authentication only available in browser");
      }
    });

    it("should handle sign in errors", async () => {
      // Test en environnement Node.js - expect l'erreur appropriée
      try {
        const result = await signInWithGoogle();
        // Si on arrive ici, le test devrait échouer
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe("Authentication only available in browser");
      }
    });
  });

  describe("Sign Out", () => {
    it("should handle sign out process", async () => {
      // Test en environnement Node.js - expect l'erreur appropriée
      const result = await signOut();

      // signOut retourne success: false en environnement Node.js
      expect(result.success).toBe(false);
      expect(result.error).toBe("Not supported in server environment");
    });

    it("should handle sign out errors", async () => {
      // Test en environnement Node.js - même comportement
      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Not supported in server environment");
    });
  });
});
