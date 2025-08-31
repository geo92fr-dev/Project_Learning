// 🚨 TEST CRITIQUE - Authentication - FunLearning Phase 1
// Exécution OBLIGATOIRE - Échec = Blocage commit
import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { user, loading, initAuth } from "../../src/lib/stores/auth.js";

describe("🔴 CRITICAL: Authentication System - Phase 1", () => {
  describe("Store Initialization", () => {
    it("should have secure initial state for user store", () => {
      const userValue = get(user);
      const loadingValue = get(loading);

      expect(userValue).toBeNull();
      expect(typeof loadingValue).toBe("boolean");
    });

    it("should provide required authentication methods", () => {
      expect(typeof initAuth).toBe("function");
      // Phase 1: Méthodes avancées seront ajoutées en Phase 2
    });
  });

  describe("Security Baseline", () => {
    it("should start in secure state (no user)", () => {
      const userValue = get(user);
      expect(userValue).toBeNull();
    });

    it("should have basic store structure", () => {
      // Phase 1: Vérification structure basique uniquement
      expect(user).toBeDefined();
      expect(loading).toBeDefined();
      expect(initAuth).toBeDefined();
    });
  });

  describe("Method Availability", () => {
    it("should provide Phase 1 interface only", () => {
      // Phase 1: Interface minimale conforme roadmap
      expect(typeof initAuth).toBe("function");

      // Vérification que les stores sont des stores Svelte valides
      expect(typeof user.subscribe).toBe("function");
      expect(typeof loading.subscribe).toBe("function");
    });
  });
});
