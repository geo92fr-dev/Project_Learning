#!/usr/bin/env node

/**
 * Script de validation Phase 5 - Firebase Data Layer
 * Valide l'intégration complète Firebase et le data layer
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync, statSync } from "fs";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

// Configuration des critères de validation Phase 5
const PHASE5_CRITERIA = {
  firebaseConfig: {
    name: "🔥 Configuration Firebase",
    path: "src/lib/firebase.js",
    minSize: 2000,
    required: true,
  },
  firebaseCollections: {
    name: "📚 Collections Firebase",
    path: "src/lib/firebase/collections.ts",
    minSize: 3000,
    required: true,
  },
  firebaseUtils: {
    name: "🛠️ Utilitaires Firebase",
    path: "src/lib/firebase/utils.ts",
    minSize: 5000,
    required: true,
  },
  firebaseStores: {
    name: "🏪 Stores Firebase",
    path: "src/lib/firebase/stores.ts",
    minSize: 8000,
    required: true,
  },
  firebaseAuth: {
    name: "🔐 Firebase Auth",
    path: "src/lib/stores/googleAuth.js",
    minSize: 5000,
    required: true,
  },
  securityRules: {
    name: "🛡️ Règles de sécurité Firebase",
    path: "src/lib/firebase/security-rules.ts",
    minSize: 3000,
    required: true,
  },
  dataModels: {
    name: "📋 Modèles de données",
    path: "src/lib/types/firebase.ts",
    minSize: 2000,
    required: false,
  },
  emailAuth: {
    name: "📧 Authentification Email",
    path: "src/lib/components/auth/EmailAuth.svelte",
    minSize: 3000,
    required: false,
  },
};

// Tests Firebase requis
const FIREBASE_TESTS = [
  "src/lib/firebase/__tests__/collections.test.ts",
  "src/lib/firebase/__tests__/utils.test.ts", 
  "src/lib/firebase/__tests__/stores.test.ts",
  "src/lib/firebase/__tests__/security-rules.test.ts",
  "tests/firebase/auth.test.js",
  "src/lib/components/auth/EmailAuth.test.ts"
];

// Couleurs pour l'affichage
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

/**
 * Affiche un message coloré
 */
function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Vérifie l'existence et la taille d'un fichier
 */
function validateFile(criteria) {
  const filePath = join(PROJECT_ROOT, criteria.path);

  if (!existsSync(filePath)) {
    return {
      exists: false,
      size: 0,
      valid: false,
      message: `Fichier manquant: ${criteria.path}`,
    };
  }

  const stats = statSync(filePath);
  const isValidSize = stats.size >= criteria.minSize;

  return {
    exists: true,
    size: stats.size,
    valid: isValidSize,
    message: isValidSize 
      ? `✅ ${criteria.name} (${stats.size} bytes)`
      : `⚠️ ${criteria.name} trop petit (${stats.size}/${criteria.minSize} bytes)`,
  };
}

/**
 * Vérifie les tests Firebase
 */
function validateFirebaseTests() {
  const results = [];
  
  for (const testPath of FIREBASE_TESTS) {
    const fullPath = join(PROJECT_ROOT, testPath);
    const exists = existsSync(fullPath);
    
    results.push({
      path: testPath,
      exists,
      valid: exists,
      message: exists 
        ? `✅ Test Firebase: ${testPath}`
        : `❌ Test manquant: ${testPath}`
    });
  }
  
  return results;
}

/**
 * Exécute les tests Firebase
 */
function runFirebaseTests() {
  try {
    colorLog("blue", "\n🧪 Exécution des tests Firebase...");
    
    // Tests Firebase spécifiques
    const testCommand = "npm run test:unit -- --reporter=basic src/lib/firebase tests/firebase";
    const output = execSync(testCommand, { 
      cwd: PROJECT_ROOT, 
      encoding: 'utf8',
      timeout: 60000 
    });
    
    const passedTests = (output.match(/✓/g) || []).length;
    const failedTests = (output.match(/✗|❌/g) || []).length;
    
    return {
      success: failedTests === 0,
      passed: passedTests,
      failed: failedTests,
      output: output
    };
  } catch (error) {
    return {
      success: false,
      passed: 0,
      failed: -1,
      error: error.message
    };
  }
}

/**
 * Vérifie la configuration Firebase
 */
function validateFirebaseConfig() {
  try {
    const configPath = join(PROJECT_ROOT, "src/lib/firebase.js");
    if (!existsSync(configPath)) {
      return { valid: false, message: "❌ Configuration Firebase manquante" };
    }
    
    const content = readFileSync(configPath, 'utf8');
    
    // Vérifications essentielles
    const checks = [
      { name: "Import Firebase", pattern: /import.*firebase/i },
      { name: "Configuration API", pattern: /apiKey|authDomain|projectId/ },
      { name: "Initialisation Auth", pattern: /getAuth|initializeAuth/ },
      { name: "Export Auth", pattern: /export.*auth/ }
    ];
    
    const results = checks.map(check => ({
      name: check.name,
      valid: check.pattern.test(content),
      message: check.pattern.test(content) 
        ? `✅ ${check.name}` 
        : `❌ ${check.name} manquant`
    }));
    
    const allValid = results.every(r => r.valid);
    
    return {
      valid: allValid,
      checks: results,
      message: allValid 
        ? "✅ Configuration Firebase valide"
        : "⚠️ Configuration Firebase incomplète"
    };
  } catch (error) {
    return {
      valid: false,
      message: `❌ Erreur validation config: ${error.message}`
    };
  }
}

/**
 * Script principal de validation
 */
function main() {
  colorLog("bold", "\n🔥 VALIDATION PHASE 5 - FIREBASE DATA LAYER");
  colorLog("blue", "=".repeat(50));

  let overallValid = true;
  const results = [];

  // 1. Validation des fichiers
  colorLog("cyan", "\n📁 Validation des fichiers...");
  for (const [key, criteria] of Object.entries(PHASE5_CRITERIA)) {
    const result = validateFile(criteria);
    results.push(result);
    
    if (criteria.required && !result.valid) {
      overallValid = false;
    }
    
    colorLog(result.valid ? "green" : (criteria.required ? "red" : "yellow"), result.message);
  }

  // 2. Validation de la configuration Firebase
  colorLog("cyan", "\n🔧 Validation configuration Firebase...");
  const configResult = validateFirebaseConfig();
  results.push(configResult);
  
  if (!configResult.valid) {
    overallValid = false;
  }
  
  colorLog(configResult.valid ? "green" : "red", configResult.message);
  
  if (configResult.checks) {
    configResult.checks.forEach(check => {
      colorLog(check.valid ? "green" : "red", `  ${check.message}`);
    });
  }

  // 3. Validation des tests Firebase
  colorLog("cyan", "\n🧪 Validation des tests Firebase...");
  const testFiles = validateFirebaseTests();
  testFiles.forEach(test => {
    colorLog(test.valid ? "green" : "red", test.message);
    if (!test.valid) overallValid = false;
  });

  // 4. Exécution des tests
  const testResults = runFirebaseTests();
  if (testResults.success) {
    colorLog("green", `✅ Tests Firebase: ${testResults.passed} tests passés`);
  } else {
    colorLog("red", `❌ Tests Firebase échoués: ${testResults.failed || 'erreur'}`);
    if (testResults.error) {
      colorLog("red", `   Erreur: ${testResults.error}`);
    }
    overallValid = false;
  }

  // 5. Résultat final
  colorLog("blue", "\n" + "=".repeat(50));
  
  if (overallValid) {
    colorLog("green", "🎉 PHASE 5 - VALIDATION RÉUSSIE !");
    colorLog("green", "   Firebase Data Layer opérationnel");
    colorLog("green", "   Prêt pour Phase 6 - Curriculum Generation");
  } else {
    colorLog("red", "❌ PHASE 5 - VALIDATION ÉCHOUÉE");
    colorLog("yellow", "🔧 Actions requises:");
    
    // Suggestions d'actions
    const missingFiles = results.filter(r => r.exists === false && r.path);
    if (missingFiles.length > 0) {
      colorLog("yellow", "   • Créer les fichiers manquants");
    }
    
    if (!configResult.valid) {
      colorLog("yellow", "   • Corriger la configuration Firebase");
    }
    
    if (!testResults.success) {
      colorLog("yellow", "   • Corriger les tests Firebase");
    }
  }

  colorLog("blue", "=".repeat(50));
  
  process.exit(overallValid ? 0 : 1);
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateFile, validateFirebaseConfig, validateFirebaseTests };
