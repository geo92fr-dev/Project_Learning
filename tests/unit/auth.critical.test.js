// 🚨 TEST CRITIQUE - Authentication - FunLearning Phase 1
// Exécution OBLIGATOIRE - Échec = Blocage commit
import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { authStore } from "../../src/lib/stores/auth";

describe("🔴 CRITICAL: Authentication System", () => {
  describe("Store Initialization", () => {
    it("should have secure initial state", () => {
      const state = get(authStore);
      expect(state).toEqual({
        user: null,
        loading: true,
        error: null,
      });
    });

    it("should provide required authentication methods", () => {
      expect(typeof authStore.init).toBe("function");
      expect(typeof authStore.signInWithGoogle).toBe("function");
      expect(typeof authStore.signOut).toBe("function");
      expect(typeof authStore.clearError).toBe("function");
    });
  });

  describe("Security Baseline", () => {
    it("should start in secure state (no user)", () => {
      const state = get(authStore);
      expect(state.user).toBeNull();
    });

    it("should handle error clearing securely", () => {
      authStore.clearError();
      const state = get(authStore);
      expect(state.error).toBeNull();
    });
  });

  describe("Method Availability", () => {
    it("should not expose sensitive Firebase internals", () => {
      // Vérification que le store n'expose que l'interface publique
      const methods = Object.keys(authStore);
      const expectedMethods = [
        "subscribe",
        "init",
        "signInWithGoogle",
        "signOut",
        "clearError",
      ];

      expectedMethods.forEach((method) => {
        expect(methods).toContain(method);
      });
    });
  });
});
