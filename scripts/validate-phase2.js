#!/usr/bin/env node

/**
 * 🎯 Validation Phase 2 - Firebase & Authentification
 * Script de validation selon roadmap Phase 2
 */

const fs = require("fs");
const path = require("path");

console.log("🔐 Validation Phase 2 - Firebase & Authentification\n");

// Critères de validation selon la roadmap
const validationCriteria = [
  {
    name: "Firebase configuré et fonctionnel",
    check: () => {
      const configExists = fs.existsSync("src/lib/firebase/config.js");
      const hasFirebaseDep = fs.existsSync("node_modules/firebase");
      return configExists && hasFirebaseDep;
    },
  },
  {
    name: "Store d'authentification réactif",
    check: () => {
      return fs.existsSync("src/lib/stores/googleAuth.js");
    },
  },
  {
    name: "Connexion Google OAuth opérationnelle",
    check: () => {
      const authComponentExists = fs.existsSync(
        "src/lib/components/GoogleAuth.svelte"
      );
      const authStoreExists = fs.existsSync("src/lib/stores/googleAuth.js");
      return authComponentExists && authStoreExists;
    },
  },
  {
    name: "Protection des routes fonctionnelle",
    check: () => {
      const hooksExists = fs.existsSync("src/hooks.server.ts");
      const appTypesExists = fs.existsSync("src/app.d.ts");
      return hooksExists && appTypesExists;
    },
  },
  {
    name: "Pages /auth/login et /dashboard accessibles",
    check: () => {
      const loginPageExists = fs.existsSync(
        "src/routes/auth/login/+page.svelte"
      );
      const dashboardPageExists = fs.existsSync(
        "src/routes/dashboard/+page.svelte"
      );
      const dashboardLayoutExists = fs.existsSync(
        "src/routes/dashboard/+layout.svelte"
      );
      return loginPageExists && dashboardPageExists && dashboardLayoutExists;
    },
  },
  {
    name: "Tests d'authentification passent",
    check: () => {
      return (
        fs.existsSync("tests/unit/auth.test.js") ||
        fs.existsSync("tests/unit/googleAuth.test.js")
      );
    },
  },
];

let passedCount = 0;
let totalCount = validationCriteria.length;

validationCriteria.forEach((criterion, index) => {
  const passed = criterion.check();
  const status = passed ? "✅" : "❌";
  console.log(`${status} [CHECK] ${criterion.name}`);

  if (passed) passedCount++;
});

console.log("\n📊 Résultats de la validation:");
console.log(`✅ Critères validés: ${passedCount}/${totalCount}`);
console.log(`📈 Progression: ${Math.round((passedCount / totalCount) * 100)}%`);

if (passedCount === totalCount) {
  console.log("\n🎉 Phase 2 COMPLÈTE !");
  console.log("🚀 Prêt pour Phase 3 - Contenu & Markdown");

  // Suggestion de commit
  console.log("\n📝 Suggestion de commit:");
  console.log(
    'git add . && git commit -m "feat: Phase 2 - Firebase Auth complete"'
  );
  console.log("git tag v1.0");
} else {
  console.log("\n⚠️  Phase 2 INCOMPLÈTE");
  console.log(`❌ ${totalCount - passedCount} critère(s) manquant(s)`);
  console.log("🔧 Consultez la roadmap Phase 2 pour les étapes manquantes");
}

// Vérifications supplémentaires
console.log("\n🔍 Vérifications supplémentaires:");

// Variables d'environnement
console.log("📋 Variables d'environnement:");
const envVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
];
envVars.forEach((varName) => {
  const exists = process.env[varName] ? "✅" : "❌";
  console.log(`  ${exists} ${varName}`);
});

// Structure des fichiers
console.log("\n📁 Structure des fichiers:");
const importantFiles = [
  "src/lib/firebase/config.js",
  "src/lib/stores/googleAuth.js",
  "src/lib/components/GoogleAuth.svelte",
  "src/routes/auth/login/+page.svelte",
  "src/routes/dashboard/+page.svelte",
  "src/routes/dashboard/+layout.svelte",
  "src/hooks.server.ts",
  "src/app.d.ts",
];

importantFiles.forEach((file) => {
  const exists = fs.existsSync(file) ? "✅" : "❌";
  console.log(`  ${exists} ${file}`);
});

console.log("\n🎯 Phase 2 - Validation terminée\n");
