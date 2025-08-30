// 🚨 TEST CRITIQUE - Firebase Integration - FunLearning Phase 1
// Exécution OBLIGATOIRE - Échec = Blocage commit
import { describe, it, expect } from "vitest";
import { auth, db, firebaseConfig } from "../../src/lib/firebase.js";

describe("🔴 CRITICAL: Firebase Integration", () => {
  describe("Configuration Validation", () => {
    it("should have valid production Firebase config", () => {
      expect(firebaseConfig).toBeDefined();
      expect(firebaseConfig.apiKey).toBeTruthy();
      expect(firebaseConfig.authDomain).toBe("revision-a7a12.firebaseapp.com");
      expect(firebaseConfig.projectId).toBe("revision-a7a12");
      expect(firebaseConfig.storageBucket).toBe(
        "revision-a7a12.firebasestorage.app"
      );
    });

    it("should reject placeholder values", () => {
      // Vérification anti-regression : pas de valeurs demo
      expect(firebaseConfig.apiKey).not.toContain("demo");
      expect(firebaseConfig.authDomain).not.toContain("demo");
      expect(firebaseConfig.projectId).not.toContain("demo");
    });
  });

  describe("Service Initialization", () => {
    it("should initialize Firebase Auth service", () => {
      expect(auth).toBeDefined();
      expect(auth.app.options.projectId).toBe("revision-a7a12");
    });

    it("should initialize Firestore service", () => {
      expect(db).toBeDefined();
      expect(db.app.options.projectId).toBe("revision-a7a12");
    });
  });

  describe("Security Baseline", () => {
    it("should use production project ID", () => {
      const projectId = auth.app.options.projectId;
      expect(projectId).toBe("revision-a7a12");
      expect(projectId).not.toContain("test");
      expect(projectId).not.toContain("dev");
    });
  });
});
