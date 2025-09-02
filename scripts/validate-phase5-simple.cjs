#!/usr/bin/env node

/**
 * Script de validation Phase 5 - Firebase Data Layer (Version simplifiée)
 * Diagnostic rapide des composants Firebase
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

// Critères simplifiés pour la Phase 5
const PHASE5_FILES = {
  "🔥 Firebase Config": "src/lib/firebase.js",
  "📚 Collections": "src/lib/firebase/collections.ts", 
  "🛠️ Utils": "src/lib/firebase/utils.ts",
  "🏪 Stores": "src/lib/firebase/stores.ts",
  "🔐 Auth Store": "src/lib/stores/googleAuth.js",
  "🛡️ Security Rules": "src/lib/firebase/security-rules.ts"
};

const FIREBASE_TESTS = {
  "🧪 Collections Test": "src/lib/firebase/__tests__/collections.test.ts",
  "🧪 Utils Test": "src/lib/firebase/__tests__/utils.test.ts",
  "🧪 Stores Test": "src/lib/firebase/__tests__/stores.test.ts",
  "🧪 Security Test": "src/lib/firebase/__tests__/security-rules.test.ts",
  "🧪 Auth Test": "tests/firebase/auth.test.js"
};

console.log("\n🔥 DIAGNOSTIC PHASE 5 - FIREBASE DATA LAYER");
console.log("=".repeat(50));

let issuesFound = 0;

// Vérification des fichiers principaux
console.log("\n📁 Fichiers principaux:");
for (const [name, filePath] of Object.entries(PHASE5_FILES)) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${name}: ${filePath} (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${name}: ${filePath} - MANQUANT`);
    issuesFound++;
  }
}

// Vérification des tests
console.log("\n🧪 Tests Firebase:");
for (const [name, filePath] of Object.entries(FIREBASE_TESTS)) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${name}: ${filePath}`);
  } else {
    console.log(`❌ ${name}: ${filePath} - MANQUANT`);
    issuesFound++;
  }
}

// Analyse de la configuration Firebase
console.log("\n🔧 Configuration Firebase:");
const firebaseConfigPath = path.join(PROJECT_ROOT, "src/lib/firebase.js");
if (fs.existsSync(firebaseConfigPath)) {
  const content = fs.readFileSync(firebaseConfigPath, 'utf8');
  
  const checks = [
    { name: "Import Firebase", pattern: /import.*firebase/i },
    { name: "Configuration", pattern: /apiKey|authDomain/i },
    { name: "Auth Init", pattern: /getAuth|auth/i },
    { name: "Export", pattern: /export.*auth/i }
  ];
  
  checks.forEach(check => {
    const found = check.pattern.test(content);
    console.log(`${found ? '✅' : '❌'} ${check.name}`);
    if (!found) issuesFound++;
  });
} else {
  console.log("❌ Fichier de configuration Firebase manquant");
  issuesFound++;
}

// Structures de données alternatives
console.log("\n📂 Alternatives détectées:");
const alternatives = [
  "src/lib/firebase/config.ts",
  "src/lib/firebase/config.js", 
  "src/lib/firebase/stores/firebase-stores.ts"
];

alternatives.forEach(alt => {
  const exists = fs.existsSync(path.join(PROJECT_ROOT, alt));
  if (exists) {
    console.log(`📋 Alternative trouvée: ${alt}`);
  }
});

// Résultat final
console.log("\n" + "=".repeat(50));

if (issuesFound === 0) {
  console.log("🎉 PHASE 5 - CONFIGURATION COMPLÈTE !");
  console.log("   Tous les composants Firebase sont présents");
} else if (issuesFound <= 3) {
  console.log("⚠️ PHASE 5 - PARTIELLEMENT CONFIGURÉE");
  console.log(`   ${issuesFound} éléments manquants à corriger`);
} else {
  console.log("❌ PHASE 5 - CONFIGURATION INCOMPLÈTE");
  console.log(`   ${issuesFound} éléments manquants - configuration requise`);
}

console.log("=".repeat(50));

// Code de sortie
process.exit(issuesFound > 5 ? 1 : 0);
