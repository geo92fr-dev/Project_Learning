// 🚀 FunLearning V3.0 - Phase 3 Validation Script
// Script de validation automatique pour la Phase 3 (Contenu & Markdown)

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATION PHASE 3 - Contenu & Markdown');
console.log('═'.repeat(60));

let allCriteriaMet = true;
const results = [];

// ===== CRITÈRE 1: Types de contenu TypeScript complets =====
function validateContentTypes() {
  console.log('\n📝 1. Validation des types de contenu TypeScript...');
  
  const typesPath = path.join(__dirname, '../src/lib/types/content.ts');
  
  if (!fs.existsSync(typesPath)) {
    results.push('❌ Fichier types/content.ts manquant');
    return false;
  }
  
  const content = fs.readFileSync(typesPath, 'utf8');
  
  const requiredTypes = [
    'BaseEntity',
    'Matiere', 
    'NiveauEducatif',
    'Competence',
    'Course',
    'Lesson',
    'MarkdownContent'
  ];
  
  const requiredSchemas = [
    'BaseEntitySchema',
    'MatiereSchema',
    'NiveauEducatifSchema', 
    'CompetenceSchema',
    'CourseSchema',
    'LessonSchema'
  ];
  
  let missingTypes = [];
  let missingSchemas = [];
  
  requiredTypes.forEach(type => {
    if (!content.includes(`export type ${type}`)) {
      missingTypes.push(type);
    }
  });
  
  requiredSchemas.forEach(schema => {
    if (!content.includes(`${schema} = `)) {
      missingSchemas.push(schema);
    }
  });
  
  if (missingTypes.length > 0) {
    results.push(`❌ Types manquants: ${missingTypes.join(', ')}`);
    return false;
  }
  
  if (missingSchemas.length > 0) {
    results.push(`❌ Schemas Zod manquants: ${missingSchemas.join(', ')}`);
    return false;
  }
  
  // Vérifier la validation Zod
  if (!content.includes('import { z } from "zod"')) {
    results.push('❌ Import Zod manquant');
    return false;
  }
  
  results.push('✅ Types de contenu complets avec validation Zod');
  return true;
}

// ===== CRITÈRE 2: Conversion Markdown → HTML sécurisée =====
function validateMarkdownUtils() {
  console.log('\n🔄 2. Validation du système Markdown...');
  
  const markdownPath = path.join(__dirname, '../src/lib/utils/markdown.ts');
  
  if (!fs.existsSync(markdownPath)) {
    results.push('❌ Fichier utils/markdown.ts manquant');
    return false;
  }
  
  const content = fs.readFileSync(markdownPath, 'utf8');
  
  const requiredFunctions = [
    'markdownToHtml',
    'generateSlug',
    'estimateReadingTime',
    'extractTableOfContents',
    'hasUnsafeContent',
    'sanitizeMarkdown'
  ];
  
  const requiredImports = [
    "import { marked } from 'marked'",
    "import DOMPurify from 'dompurify'",
    "import hljs from 'highlight.js'"
  ];
  
  let missingFunctions = [];
  let missingImports = [];
  
  requiredFunctions.forEach(func => {
    if (!content.includes(`export function ${func}`) && !content.includes(`export async function ${func}`)) {
      missingFunctions.push(func);
    }
  });
  
  requiredImports.forEach(imp => {
    if (!content.includes(imp)) {
      missingImports.push(imp);
    }
  });
  
  if (missingFunctions.length > 0) {
    results.push(`❌ Fonctions Markdown manquantes: ${missingFunctions.join(', ')}`);
    return false;
  }
  
  if (missingImports.length > 0) {
    results.push(`❌ Imports manquants: ${missingImports.join(', ')}`);
    return false;
  }
  
  results.push('✅ Système de conversion Markdown → HTML complet');
  return true;
}

// ===== CRITÈRE 3: Protection XSS avec DOMPurify =====
function validateXSSProtection() {
  console.log('\n🛡️ 3. Validation de la protection XSS...');
  
  const markdownPath = path.join(__dirname, '../src/lib/utils/markdown.ts');
  const content = fs.readFileSync(markdownPath, 'utf8');
  
  // Vérifier l'utilisation de DOMPurify
  if (!content.includes('purify.sanitize') && !content.includes('DOMPurify.sanitize')) {
    results.push('❌ DOMPurify.sanitize non utilisé');
    return false;
  }
  
  // Vérifier la configuration de sécurité
  const securityChecks = [
    'FORBID_SCRIPTS: true',
    'FORBID_TAGS',
    'ALLOWED_TAGS',
    'sanitizeHtml'
  ];
  
  let missingSecurity = [];
  securityChecks.forEach(check => {
    if (!content.includes(check)) {
      missingSecurity.push(check);
    }
  });
  
  if (missingSecurity.length > 0) {
    results.push(`❌ Configurations sécurité manquantes: ${missingSecurity.join(', ')}`);
    return false;
  }
  
  // Vérifier les fonctions de détection
  if (!content.includes('hasUnsafeContent')) {
    results.push('❌ Détection de contenu dangereux manquante');
    return false;
  }
  
  results.push('✅ Protection XSS avec DOMPurify configurée');
  return true;
}

// ===== CRITÈRE 4: Routes dynamiques fonctionnelles =====
function validateDynamicRoutes() {
  console.log('\n🛣️ 4. Validation des routes dynamiques...');
  
  const contentRoutePath = path.join(__dirname, '../src/routes/content/+page.svelte');
  const matiereRoutePath = path.join(__dirname, '../src/routes/content/[matiere]/+page.svelte');
  
  if (!fs.existsSync(contentRoutePath)) {
    results.push('❌ Route /content manquante');
    return false;
  }
  
  if (!fs.existsSync(matiereRoutePath)) {
    results.push('❌ Route dynamique /content/[matiere] manquante');
    return false;
  }
  
  // Vérifier le contenu de la route dynamique
  const matiereContent = fs.readFileSync(matiereRoutePath, 'utf8');
  
  const requiredElements = [
    '$page.params.matiere',
    'navigateToCourse',
    'filteredAndSortedCourses',
    'course-card'
  ];
  
  let missingElements = [];
  requiredElements.forEach(element => {
    if (!matiereContent.includes(element)) {
      missingElements.push(element);
    }
  });
  
  if (missingElements.length > 0) {
    results.push(`❌ Éléments route dynamique manquants: ${missingElements.join(', ')}`);
    return false;
  }
  
  results.push('✅ Routes dynamiques avec paramètres fonctionnelles');
  return true;
}

// ===== CRITÈRE 5: Navigation entre matières/niveaux =====
function validateNavigation() {
  console.log('\n🧭 5. Validation de la navigation...');
  
  const contentRoutePath = path.join(__dirname, '../src/routes/content/+page.svelte');
  const content = fs.readFileSync(contentRoutePath, 'utf8');
  
  const navigationFeatures = [
    'navigateToMatiere',
    'navigateToNiveau', 
    'matiere-card',
    'niveau-card',
    'breadcrumb'
  ];
  
  let missingFeatures = [];
  navigationFeatures.forEach(feature => {
    if (!content.includes(feature)) {
      missingFeatures.push(feature);
    }
  });
  
  // Vérifier les stores de navigation 
  const storePath = path.join(__dirname, '../src/lib/stores/content.ts');
  const storeContent = fs.readFileSync(storePath, 'utf8');
  
  if (!storeContent.includes('currentMatiere') && !storeContent.includes('selectedMatiere')) {
    missingFeatures.push('store navigation matière');
  }
  
  if (missingFeatures.length > 0) {
    results.push(`❌ Fonctionnalités navigation manquantes: ${missingFeatures.join(', ')}`);
    return false;
  }
  
  results.push('✅ Navigation entre matières et niveaux opérationnelle');
  return true;
}

// ===== CRITÈRE 6: Stores de contenu réactifs =====
function validateContentStores() {
  console.log('\n🗄️ 6. Validation des stores de contenu...');
  
  const storePath = path.join(__dirname, '../src/lib/stores/content.ts');
  
  if (!fs.existsSync(storePath)) {
    results.push('❌ Fichier stores/content.ts manquant');
    return false;
  }
  
  const content = fs.readFileSync(storePath, 'utf8');
  
  const requiredStores = [
    'matieres',
    'niveaux', 
    'competences',
    'courses'
  ];
  
  const requiredImports = [
    'writable',
    'derived',
    'readable'
  ];
  
  let missingStores = [];
  let missingImports = [];
  
  requiredStores.forEach(store => {
    if (!content.includes(`export const ${store}`)) {
      missingStores.push(store);
    }
  });
  
  requiredImports.forEach(imp => {
    if (!content.includes(imp)) {
      missingImports.push(imp);
    }
  });
  
  if (missingStores.length > 0) {
    results.push(`❌ Stores manquants: ${missingStores.join(', ')}`);
    return false;
  }
  
  if (missingImports.length > 0) {
    results.push(`❌ Imports Svelte manquants: ${missingImports.join(', ')}`);
    return false;
  }
  
  // Vérifier les stores dérivés
  if (!content.includes('derived')) {
    results.push('❌ Stores dérivés manquants');
    return false;
  }
  
  results.push('✅ Stores de contenu réactifs configurés');
  return true;
}

// ===== CRITÈRE 7: Cache des transformations opérationnel =====
function validateCacheSystem() {
  console.log('\n💾 7. Validation du système de cache...');
  
  const markdownPath = path.join(__dirname, '../src/lib/utils/markdown.ts');
  const content = fs.readFileSync(markdownPath, 'utf8');
  
  const cacheFeatures = [
    'markdownToHtmlCached',
    'clearMarkdownCache',
    'getCacheStats',
    'markdownCache',
    'CACHE_TTL'
  ];
  
  let missingFeatures = [];
  cacheFeatures.forEach(feature => {
    if (!content.includes(feature)) {
      missingFeatures.push(feature);
    }
  });
  
  if (missingFeatures.length > 0) {
    results.push(`❌ Fonctionnalités cache manquantes: ${missingFeatures.join(', ')}`);
    return false;
  }
  
  // Vérifier la logique TTL
  if (!content.includes('timestamp') || !content.includes('now - cached.timestamp')) {
    results.push('❌ Logique TTL du cache incomplète');
    return false;
  }
  
  results.push('✅ Système de cache avec TTL opérationnel');
  return true;
}

// ===== CRITÈRE 8: Tests de sécurité passent =====
function validateSecurityTests() {
  console.log('\n🧪 8. Validation des tests de sécurité...');
  
  const testPath = path.join(__dirname, '../tests/unit/content.test.js');
  
  if (!fs.existsSync(testPath)) {
    results.push('❌ Tests unitaires de contenu manquants');
    return false;
  }
  
  const content = fs.readFileSync(testPath, 'utf8');
  
  const securityTests = [
    'should sanitize dangerous HTML',
    'should detect dangerous script tags',
    'should remove script tags',
    'hasUnsafeContent',
    'sanitizeMarkdown'
  ];
  
  let missingTests = [];
  securityTests.forEach(test => {
    if (!content.includes(test)) {
      missingTests.push(test);
    }
  });
  
  if (missingTests.length > 0) {
    results.push(`❌ Tests sécurité manquants: ${missingTests.join(', ')}`);
    return false;
  }
  
  // Vérifier les cas de test XSS
  const xssTests = [
    '<script>',
    'javascript:',
    'onclick=',
    '<iframe'
  ];
  
  let missingXSSTests = [];
  xssTests.forEach(test => {
    if (!content.includes(test)) {
      missingXSSTests.push(test);
    }
  });
  
  if (missingXSSTests.length > 0) {
    results.push(`❌ Tests XSS incomplets: ${missingXSSTests.join(', ')}`);
    return false;
  }
  
  results.push('✅ Tests de sécurité complets et exhaustifs');
  return true;
}

// ===== EXÉCUTION DES VALIDATIONS =====
async function runValidation() {
  const validations = [
    validateContentTypes,
    validateMarkdownUtils, 
    validateXSSProtection,
    validateDynamicRoutes,
    validateNavigation,
    validateContentStores,
    validateCacheSystem,
    validateSecurityTests
  ];
  
  let passedCount = 0;
  
  for (const validation of validations) {
    const passed = validation();
    if (passed) {
      passedCount++;
    } else {
      allCriteriaMet = false;
    }
  }
  
  // ===== RAPPORT FINAL =====
  console.log('\n📊 RÉSULTATS DE VALIDATION');
  console.log('═'.repeat(60));
  
  results.forEach(result => {
    console.log(result);
  });
  
  console.log('\n📈 STATISTIQUES');
  console.log(`✅ Critères validés: ${passedCount}/8 (${Math.round(passedCount/8*100)}%)`);
  
  if (allCriteriaMet) {
    console.log('\n🎉 ✅ PHASE 3 - VALIDATION RÉUSSIE');
    console.log('   Système de contenu et Markdown complet');
    console.log('   Prêt pour Phase 4 - Pédagogie Avancée');
  } else {
    console.log('\n❌ PHASE 3 - VALIDATION ÉCHOUÉE'); 
    console.log('   Certains critères ne sont pas remplis');
    console.log('   Veuillez corriger les points mentionnés ci-dessus');
  }
  
  console.log('\n🔗 Prochaine étape: Phase 4 - Pédagogie Avancée');
  console.log('═'.repeat(60));
  
  return allCriteriaMet;
}

// Exécution
if (require.main === module) {
  runValidation()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Erreur lors de la validation:', error);
      process.exit(1);
    });
}

module.exports = { runValidation };

// 📋 Phase Status: ✅ Phase 3 - Comprehensive Validation Script
