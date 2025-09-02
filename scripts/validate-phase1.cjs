#!/usr/bin/env node

/**
 * Script de validation Phase 1 - Setup & Architecture
 * Valide la base technique SvelteKit + TypeScript + Tests
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

const PHASE1_FILES = {
  "⚡ SvelteKit Config": "svelte.config.js",
  "📦 Package.json": "package.json",
  "🔧 Vite Config": "vite.config.js", 
  "📝 TypeScript Config": "tsconfig.json",
  "🎯 App Entry": "src/app.html",
  "🏠 Main Route": "src/routes/+page.svelte",
  "🧪 Test Setup": "vitest.config.js"
};

const PHASE1_TESTS = {
  "🧪 Basic Tests": "tests/unit/setup.test.js",
  "🧪 App Interface": "tests/unit/app-interface.test.js"
};

const PHASE1_DEPS = [
  "@sveltejs/kit", "svelte", "vite", "vitest", 
  "@testing-library/svelte", "typescript"
];

console.log("\n⚡ DIAGNOSTIC PHASE 1 - SETUP & ARCHITECTURE");
console.log("=".repeat(50));

let issuesFound = 0;

// Vérification des fichiers de configuration
console.log("\n📁 Configuration de base:");
for (const [name, filePath] of Object.entries(PHASE1_FILES)) {
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
console.log("\n🧪 Tests Phase 1:");
for (const [name, filePath] of Object.entries(PHASE1_TESTS)) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${name}: ${filePath}`);
  } else {
    console.log(`❌ ${name}: ${filePath} - MANQUANT`);
    issuesFound++;
  }
}

// Vérification des dépendances
console.log("\n📦 Dépendances critiques:");
const packageJsonPath = path.join(PROJECT_ROOT, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const allDeps = {
    ...packageJson.dependencies || {}, 
    ...packageJson.devDependencies || {}
  };
  
  PHASE1_DEPS.forEach(dep => {
    const exists = allDeps[dep];
    console.log(`${exists ? '✅' : '❌'} ${dep}${exists ? ` (${exists})` : ' - MANQUANT'}`);
    if (!exists) issuesFound++;
  });
} else {
  console.log("❌ package.json manquant");
  issuesFound += PHASE1_DEPS.length;
}

// Vérification de la structure SvelteKit
console.log("\n🏗️ Structure SvelteKit:");
const svelteStructure = [
  "src/lib", "src/routes", "static"
];

svelteStructure.forEach(dir => {
  const exists = fs.existsSync(path.join(PROJECT_ROOT, dir));
  console.log(`${exists ? '✅' : '❌'} Dossier ${dir}`);
  if (!exists) issuesFound++;
});

console.log("\n" + "=".repeat(50));

if (issuesFound === 0) {
  console.log("🎉 PHASE 1 - SETUP COMPLET !");
  console.log("   Architecture SvelteKit opérationnelle");
} else if (issuesFound <= 3) {
  console.log("⚠️ PHASE 1 - PARTIELLEMENT CONFIGURÉE");
  console.log(`   ${issuesFound} éléments à corriger`);
} else {
  console.log("❌ PHASE 1 - SETUP INCOMPLET");
  console.log(`   ${issuesFound} éléments manquants`);
}

console.log("=".repeat(50));
process.exit(issuesFound > 5 ? 1 : 0);
