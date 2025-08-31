#!/usr/bin/env node
// 🛠️ Script de validation roadmap Phase 2 selon DOC_CoPilot_Practices
// Vérification conformité architecture et métriques

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATION ROADMAP PHASE 2 - DOC_CoPilot_Practices');
console.log('════════════════════════════════════════════════════════');

// Validation de la structure Phase 2
const phase2Structure = {
  'src/lib/firebase/config.ts': 'Configuration Firebase TypeScript',
  'src/lib/stores/auth.ts': 'Store authentification avancé',
  'src/lib/types/auth.ts': 'Types authentification',
  'src/lib/components/auth/AuthComplete.svelte': 'Interface unifiée',
  'src/lib/components/auth/GoogleAuth.svelte': 'Composant Google OAuth',
  'src/lib/components/auth/EmailAuth.svelte': 'Composant Email/Password',
  'src/routes/test-auth/+page.svelte': 'Page de test Phase 2',
  'docs/decisions/ADR-002-firebase-auth-strategy.md': 'ADR Firebase Auth'
};

let validationResults = {
  structure: true,
  typescript: true,
  tests: true,
  documentation: true,
  metrics: {}
};

// 1. Vérification structure fichiers
console.log('\n📁 1. VÉRIFICATION STRUCTURE PHASE 2');
console.log('───────────────────────────────────────');

for (const [filePath, description] of Object.entries(phase2Structure)) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  
  if (!exists) {
    validationResults.structure = false;
  }
}

// 2. Vérification TypeScript
console.log('\n🔧 2. VÉRIFICATION TYPESCRIPT');
console.log('──────────────────────────────');

try {
  const { execSync } = require('child_process');
  const tscResult = execSync('npm run check', { encoding: 'utf8', stdio: 'pipe' });
  console.log('✅ TypeScript: 0 erreurs détectées');
  validationResults.typescript = true;
} catch (error) {
  console.log('❌ TypeScript: Erreurs détectées');
  console.log(error.stdout);
  validationResults.typescript = false;
}

// 3. Métriques Phase 2
console.log('\n📊 3. MÉTRIQUES PHASE 2');
console.log('─────────────────────');

// Calcul des métriques de fichiers
const authStoreFile = path.join(process.cwd(), 'src/lib/stores/auth.ts');
if (fs.existsSync(authStoreFile)) {
  const content = fs.readFileSync(authStoreFile, 'utf8');
  const lines = content.split('\n').length;
  const functions = (content.match(/export (async )?function/g) || []).length;
  const exports = (content.match(/^export /gm) || []).length;
  
  validationResults.metrics = {
    authStoreLOC: lines,
    authStoreFunctions: functions,
    authStoreExports: exports
  };
  
  console.log(`📈 Store auth: ${lines} lignes, ${functions} fonctions, ${exports} exports`);
}

// Vérification composants
const componentsPath = path.join(process.cwd(), 'src/lib/components/auth');
if (fs.existsSync(componentsPath)) {
  const components = fs.readdirSync(componentsPath).filter(f => f.endsWith('.svelte'));
  console.log(`🎨 Composants auth: ${components.length} créés`);
  validationResults.metrics.authComponents = components.length;
}

// 4. Validation des documents recap
console.log('\n📝 4. VALIDATION DOCUMENTS RECAP');
console.log('─────────────────────────────────────');

const recapDocuments = {
  'phase-2-recap.md': path.join(process.cwd(), 'roadmap/phases/phase-2-recap.md'),
  'PHASE2-README.md': path.join(process.cwd(), 'PHASE2-README.md')
};

let recapValidation = true;
for (const [docName, docPath] of Object.entries(recapDocuments)) {
  const exists = fs.existsSync(docPath);
  console.log(`${exists ? '✅' : '❌'} Document recap: ${docName}`);
  
  if (exists && docName === 'phase-2-recap.md') {
    // Vérifier que le document contient les mises à jour de statut
    const content = fs.readFileSync(docPath, 'utf8');
    const hasCompletedStatus = content.includes('✅ TERMINÉE') || content.includes('SUCCÈS COMPLET');
    const hasValidationScore = content.includes('5/5 (100%)') || content.includes('Score conformité');
    const hasMetrics = content.includes('292 lignes') || content.includes('auth store');
    
    console.log(`${hasCompletedStatus ? '✅' : '❌'} Statut mis à jour: ${hasCompletedStatus ? 'TERMINÉE' : 'EN COURS'}`);
    console.log(`${hasValidationScore ? '✅' : '❌'} Score validation: ${hasValidationScore ? 'Présent' : 'Manquant'}`);
    console.log(`${hasMetrics ? '✅' : '❌'} Métriques incluses: ${hasMetrics ? 'Oui' : 'Non'}`);
    
    if (!hasCompletedStatus || !hasValidationScore || !hasMetrics) {
      recapValidation = false;
    }
  }
  
  if (!exists) {
    recapValidation = false;
  }
}

validationResults.recapDocuments = recapValidation;

// 5. Conformité DOC_CoPilot_Practices
console.log('\n📋 5. CONFORMITÉ DOC_COPILOT_PRACTICES');
console.log('────────────────────────────────────────');

const conformityChecks = {
  'ADR documenté': fs.existsSync(path.join(process.cwd(), 'docs/decisions/ADR-002-firebase-auth-strategy.md')),
  'Structure modulaire': validationResults.structure,
  'TypeScript strict': validationResults.typescript,
  'Tests Phase 2': fs.existsSync(path.join(process.cwd(), 'tests/unit/auth.phase2.test.js')),
  'Page de test': fs.existsSync(path.join(process.cwd(), 'src/routes/test-auth/+page.svelte')),
  'Documents recap': recapValidation
};

for (const [check, passed] of Object.entries(conformityChecks)) {
  console.log(`${passed ? '✅' : '❌'} ${check}`);
}

// 5. Rapport final
console.log('\n🎯 5. RAPPORT FINAL PHASE 2');
console.log('─────────────────────────');

const allPassed = Object.values(conformityChecks).every(Boolean);
const score = Object.values(conformityChecks).filter(Boolean).length;
const total = Object.keys(conformityChecks).length;

console.log(`📊 Score conformité: ${score}/${total} (${Math.round(score/total*100)}%)`);
console.log(`🏗️ Architecture: ${validationResults.structure ? 'CONFORME' : 'NON-CONFORME'}`);
console.log(`⚡ TypeScript: ${validationResults.typescript ? 'VALIDÉ' : 'ERREURS'}`);
console.log(`📚 Documentation: ${conformityChecks['ADR documenté'] ? 'COMPLÈTE' : 'MANQUANTE'}`);

if (allPassed) {
  console.log('\n🎉 ✅ PHASE 2 - VALIDATION RÉUSSIE');
  console.log('    Conforme aux standards DOC_CoPilot_Practices');
  console.log('    Prêt pour Phase 3');
  process.exit(0);
} else {
  console.log('\n⚠️ ❌ PHASE 2 - VALIDATION ÉCHOUÉE'); 
  console.log('    Corrections requises avant Phase 3');
  process.exit(1);
}
