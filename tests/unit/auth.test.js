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
      // Mock successful sign in
      const mockUser = {
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
      };

      const mockResult = {
        user: mockUser,
        credential: {},
      };

      const { signInWithPopup } = await import("firebase/auth");
      vi.mocked(signInWithPopup).mockResolvedValue(mockResult);

      const result = await signInWithGoogle();

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it("should handle sign in errors", async () => {
      const mockError = new Error("Authentication failed");

      const { signInWithPopup } = await import("firebase/auth");
      vi.mocked(signInWithPopup).mockRejectedValue(mockError);

      const result = await signInWithGoogle();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Authentication failed");
    });
  });

  describe("Sign Out", () => {
    it("should handle sign out process", async () => {
      // Set initial user
      user.set({
        uid: "test-uid",
        email: "test@example.com",
        displayName: "Test User",
      });

      const { signOut: firebaseSignOut } = await import("firebase/auth");
      vi.mocked(firebaseSignOut).mockResolvedValue();

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(get(user)).toBe(null);
    });

    it("should handle sign out errors", async () => {
      const mockError = new Error("Sign out failed");

      const { signOut: firebaseSignOut } = await import("firebase/auth");
      vi.mocked(firebaseSignOut).mockRejectedValue(mockError);

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Sign out failed");
    });
  });
});
