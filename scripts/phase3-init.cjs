#!/usr/bin/env node
// 🎯 Script d'initialisation Phase 3 - Exercices & Progression
// Commande: npm run phase3:init

const fs = require('fs');
const path = require('path');

console.log('🎯 INITIALISATION PHASE 3 - EXERCICES & PROGRESSION');
console.log('═══════════════════════════════════════════════════════');

// Validation de la structure Phase 3
const phase3Structure = {
  'src/lib/types/exercise.ts': 'Types exercices et QCM',
  'src/lib/types/progress.ts': 'Types progression utilisateur', 
  'src/lib/stores/exercises.ts': 'Store exercices réactif',
  'src/lib/components/exercises/QCMCard.svelte': 'Composant QCM interactif',
  'src/routes/test-exercises/+page.svelte': 'Page test exercices',
  'PHASE3-INIT.md': 'Plan d\'initialisation Phase 3'
};

let initResults = {
  structure: true,
  typescript: true,
  dependencies: true
};

// 1. Vérification structure Phase 3
console.log('\n📁 1. VÉRIFICATION STRUCTURE PHASE 3');
console.log('───────────────────────────────────────');

for (const [filePath, description] of Object.entries(phase3Structure)) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  
  if (!exists) {
    initResults.structure = false;
  }
}

// 2. Vérification TypeScript
console.log('\n🔧 2. VÉRIFICATION TYPESCRIPT');
console.log('──────────────────────────────');

try {
  const { execSync } = require('child_process');
  const tscResult = execSync('npm run check', { encoding: 'utf8', stdio: 'pipe' });
  console.log('✅ TypeScript: 0 erreurs détectées');
  initResults.typescript = true;
} catch (error) {
  console.log('❌ TypeScript: Erreurs détectées');
  console.log(error.stdout);
  initResults.typescript = false;
}

// 3. Métriques Phase 3
console.log('\n📊 3. MÉTRIQUES PHASE 3');
console.log('─────────────────────');

// Calcul des métriques de fichiers
const exerciseStoreFile = path.join(process.cwd(), 'src/lib/stores/exercises.ts');
if (fs.existsSync(exerciseStoreFile)) {
  const content = fs.readFileSync(exerciseStoreFile, 'utf8');
  const lines = content.split('\n').length;
  const functions = (content.match(/export (async )?function|function \w+|const \w+ = \(/g) || []).length;
  const exports = (content.match(/^export /gm) || []).length;
  
  console.log(`📈 Store exercises: ${lines} lignes, ${functions} fonctions, ${exports} exports`);
}

// Vérification composants exercices
const exercisesPath = path.join(process.cwd(), 'src/lib/components/exercises');
if (fs.existsSync(exercisesPath)) {
  const components = fs.readdirSync(exercisesPath).filter(f => f.endsWith('.svelte'));
  console.log(`🎨 Composants exercices: ${components.length} créés`);
}

// Vérification types
const typesPath = path.join(process.cwd(), 'src/lib/types');
if (fs.existsSync(typesPath)) {
  const typeFiles = fs.readdirSync(typesPath).filter(f => f.endsWith('.ts'));
  console.log(`📝 Fichiers types: ${typeFiles.length} créés`);
}

// 4. Validation des dépendances
console.log('\n📦 4. DÉPENDANCES PHASE 3');
console.log('─────────────────────────');

const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = [
    'svelte',
    '@sveltejs/kit', 
    'firebase',
    'typescript'
  ];
  
  for (const dep of requiredDeps) {
    const hasDepDev = packageJson.devDependencies && packageJson.devDependencies[dep];
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    const exists = hasDepDev || hasDep;
    
    console.log(`${exists ? '✅' : '❌'} ${dep}: ${exists ? 'Installé' : 'Manquant'}`);
    
    if (!exists) {
      initResults.dependencies = false;
    }
  }
}

// 5. Conformité Phase 3
console.log('\n📋 5. CONFORMITÉ PHASE 3');
console.log('─────────────────────────');

const phase3Checks = {
  'Structure complète': initResults.structure,
  'TypeScript valide': initResults.typescript,
  'Dépendances OK': initResults.dependencies,
  'Types exercices': fs.existsSync(path.join(process.cwd(), 'src/lib/types/exercise.ts')),
  'Store exercices': fs.existsSync(path.join(process.cwd(), 'src/lib/stores/exercises.ts')),
  'Composant QCM': fs.existsSync(path.join(process.cwd(), 'src/lib/components/exercises/QCMCard.svelte')),
  'Page de test': fs.existsSync(path.join(process.cwd(), 'src/routes/test-exercises/+page.svelte'))
};

for (const [check, passed] of Object.entries(phase3Checks)) {
  console.log(`${passed ? '✅' : '❌'} ${check}`);
}

// 6. Rapport final
console.log('\n🎯 6. RAPPORT FINAL PHASE 3');
console.log('──────────────────────────');

const allPassed = Object.values(phase3Checks).every(Boolean);
const score = Object.values(phase3Checks).filter(Boolean).length;
const total = Object.keys(phase3Checks).length;

console.log(`📊 Score Phase 3: ${score}/${total} (${Math.round(score/total*100)}%)`);
console.log(`🏗️ Architecture: ${initResults.structure ? 'CONFORME' : 'NON-CONFORME'}`);
console.log(`⚡ TypeScript: ${initResults.typescript ? 'VALIDÉ' : 'ERREURS'}`);
console.log(`📦 Dépendances: ${initResults.dependencies ? 'COMPLÈTES' : 'MANQUANTES'}`);

if (allPassed) {
  console.log('\n🎉 ✅ PHASE 3 - INITIALISATION RÉUSSIE');
  console.log('    Système d\'exercices opérationnel');
  console.log('    URL de test: http://localhost:5173/test-exercises');
  console.log('    Commande: npm run dev');
  process.exit(0);
} else {
  console.log('\n⚠️ ❌ PHASE 3 - INITIALISATION INCOMPLÈTE'); 
  console.log('    Corrections requises avant tests');
  process.exit(1);
}
