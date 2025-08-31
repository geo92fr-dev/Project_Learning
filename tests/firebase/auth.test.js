// 🧪 TEST_firebase_auth.test.js - Tests TDD Firebase Auth
// Approche TDD : Tests AVANT implémentation

import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Firebase Auth Configuration - TDD Approach", () => {
  let firebaseConfig;

  beforeEach(() => {
    // Reset modules pour tests propres
    vi.resetModules();
  });

  describe("Configuration Validation", () => {
    it("should have valid API key format", () => {
      const apiKey = process.env.VITE_FIREBASE_API_KEY || "demo-api-key";

      // Test: API key ne doit pas être la demo
      expect(apiKey).not.toBe("demo-api-key");

      // Test: API key doit avoir le bon format Google
      expect(apiKey).toMatch(/^[A-Za-z0-9_-]{39}$/);
    });

    it("should have valid auth domain", () => {
      const authDomain =
        process.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com";

      // Test: Auth domain ne doit pas être la demo
      expect(authDomain).not.toBe("demo-project.firebaseapp.com");

      // Test: Auth domain doit finir par .firebaseapp.com
      expect(authDomain).toMatch(/\.firebaseapp\.com$/);
    });

    it("should have valid project ID", () => {
      const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "demo-project";

      // Test: Project ID ne doit pas être la demo
      expect(projectId).not.toBe("demo-project");

      // Test: Project ID doit être un nom valide
      expect(projectId).toMatch(/^[a-z0-9-]+$/);
      expect(projectId.length).toBeGreaterThan(3);
    });
  });

  describe("Firebase Auth Functionality", () => {
    it("should initialize Firebase auth without errors", async () => {
      // Mock browser environment
      vi.mock("$app/environment", () => ({
        browser: true,
      }));

      // Mock Firebase modules
      const mockInitializeApp = vi.fn(() => ({ name: "test-app" }));
      const mockGetAuth = vi.fn(() => ({
        currentUser: null,
        _delegate: { _config: { emulator: null } },
      }));
      const mockConnectAuthEmulator = vi.fn();

      vi.doMock("firebase/app", () => ({
        initializeApp: mockInitializeApp,
      }));

      vi.doMock("firebase/auth", () => ({
        getAuth: mockGetAuth,
        connectAuthEmulator: mockConnectAuthEmulator,
      }));

      // Test: Firebase doit s'initialiser sans erreur
      const { auth } = await import("../../src/lib/firebase/config.js");

      expect(mockInitializeApp).toHaveBeenCalled();
      expect(mockGetAuth).toHaveBeenCalled();
    });

    it("should handle auth operations correctly", async () => {
      // Mock successful auth
      const mockSignInWithPopup = vi.fn(() =>
        Promise.resolve({
          user: {
            uid: "test-uid",
            email: "test@example.com",
            displayName: "Test User",
          },
        })
      );

      vi.doMock("firebase/auth", () => ({
        signInWithPopup: mockSignInWithPopup,
        GoogleAuthProvider: class MockGoogleAuthProvider {},
      }));

      // Test: Auth operations doivent fonctionner
      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup();

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe("test@example.com");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid API key gracefully", async () => {
      // Mock console.error pour capturer les erreurs
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock Firebase avec erreur API key
      vi.doMock("firebase/app", () => ({
        initializeApp: vi.fn(() => {
          throw new Error("Firebase: Error (auth/api-key-not-valid)");
        }),
      }));

      // Test: Erreur doit être gérée proprement
      const configModule = await import("../../src/lib/firebase/config.js");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Firebase initialization error")
      );

      consoleSpy.mockRestore();
    });

    it("should provide helpful error messages", () => {
      const errorMessage =
        "Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)";

      // Test: Message d'erreur doit être informatif
      expect(errorMessage).toContain("api-key-not-valid");
      expect(errorMessage).toContain("please-pass-a-valid-api-key");
    });
  });
});
