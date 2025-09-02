#!/usr/bin/env node

/**
 * Script de validation Phase 6 - Curriculum Generation
 * Valide la génération automatique du curriculum complet
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

const PHASE6_FILES = {
  "📚 Curriculum Generator": "scripts/curriculum/curriculum-generator.cjs",
  "🎯 Competences Data": "src/lib/data/competences.json",
  "📋 Courses Data": "src/lib/data/courses.json", 
  "🔄 Curriculum Service": "src/lib/services/curriculumService.ts",
  "📊 Progress Tracker": "src/lib/services/progressTracker.ts",
  "🎨 Curriculum UI": "src/lib/components/CurriculumGenerator.svelte"
};

const PHASE6_TESTS = {
  "🧪 Curriculum Test": "tests/unit/curriculum-generator.test.js",
  "🧪 Integration Test": "tests/unit/curriculum-integration.test.js"
};

console.log("\n📚 DIAGNOSTIC PHASE 6 - CURRICULUM GENERATION");
console.log("=".repeat(50));

let issuesFound = 0;

// Vérification des fichiers
console.log("\n📁 Fichiers Phase 6:");
for (const [name, filePath] of Object.entries(PHASE6_FILES)) {
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
console.log("\n🧪 Tests Phase 6:");
for (const [name, filePath] of Object.entries(PHASE6_TESTS)) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${name}: ${filePath}`);
  } else {
    console.log(`❌ ${name}: ${filePath} - MANQUANT`);
    issuesFound++;
  }
}

// Check data generation capability
console.log("\n🔍 Capacités de génération:");
const scriptsDir = path.join(PROJECT_ROOT, "scripts/curriculum");
if (fs.existsSync(scriptsDir)) {
  const files = fs.readdirSync(scriptsDir);
  console.log(`✅ Scripts curriculum: ${files.length} fichiers`);
  files.forEach(file => console.log(`   📜 ${file}`));
} else {
  console.log("❌ Dossier scripts/curriculum manquant");
  issuesFound++;
}

console.log("\n" + "=".repeat(50));

if (issuesFound === 0) {
  console.log("🎉 PHASE 6 - PRÊTE À DÉMARRER !");
} else if (issuesFound <= 4) {
  console.log("⚠️ PHASE 6 - PARTIELLEMENT PRÊTE");
  console.log(`   ${issuesFound} éléments à implémenter`);
} else {
  console.log("❌ PHASE 6 - IMPLÉMENTATION REQUISE");
  console.log(`   ${issuesFound} éléments manquants`);
}

console.log("=".repeat(50));
process.exit(issuesFound > 6 ? 1 : 0);
