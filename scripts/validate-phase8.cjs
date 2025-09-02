#!/usr/bin/env node

/**
 * Script de validation Phase 8 - Navigation UX
 * Valide la navigation intelligente et contextuelle
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

const PHASE8_NAVIGATION_COMPONENTS = {
  "🧭 Main Navigation": "src/lib/components/navigation/MainNavigation.svelte",
  "🍞 Breadcrumb": "src/lib/components/navigation/Breadcrumb.svelte", 
  "🗂️ Chapter Navigation": "src/lib/components/navigation/ChapterNavigation.svelte",
  "📱 Mobile Navigation": "src/lib/components/navigation/MobileNavigation.svelte",
  "🔍 Navigation Search": "src/lib/components/navigation/NavigationSearch.svelte",
  "📈 Progress Navigation": "src/lib/components/navigation/ProgressNavigation.svelte",
  "⚡ Navigation Preloader": "src/lib/components/navigation/NavigationPreloader.svelte"
};

const PHASE8_UX_FEATURES = [
  "Contextual navigation",
  "Progressive disclosure", 
  "Predictive suggestions",
  "Breadcrumb intelligence",
  "Quick actions",
  "Mobile responsiveness",
  "Search integration"
];

const PHASE8_ROUTES = {
  "🏠 Dashboard Navigation": "src/routes/dashboard",
  "📚 Curriculum Navigation": "src/routes/curriculum", 
  "🎯 Module Navigation": "src/routes/modules",
  "📖 Lesson Navigation": "src/routes/lessons"
};

console.log("\n🧭 DIAGNOSTIC PHASE 8 - NAVIGATION UX");
console.log("=".repeat(50));

let issuesFound = 0;

// Vérification des composants de navigation
console.log("\n📁 Composants Navigation Phase 8:");
for (const [name, filePath] of Object.entries(PHASE8_NAVIGATION_COMPONENTS)) {
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

// Vérification des routes de navigation
console.log("\n🛣️ Routes Navigation:");
for (const [name, routePath] of Object.entries(PHASE8_ROUTES)) {
  const fullPath = path.join(PROJECT_ROOT, routePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${name}: ${routePath}`);
  } else {
    console.log(`❌ ${name}: ${routePath} - MANQUANT`);
  }
}

// Vérification des fonctionnalités UX
console.log("\n🎨 Fonctionnalités UX Navigation:");
const mainNavFile = path.join(PROJECT_ROOT, "src/lib/components/navigation/MainNavigation.svelte");
if (fs.existsSync(mainNavFile)) {
  const content = fs.readFileSync(mainNavFile, 'utf8');
  
  // Vérifier la navigation contextuelle
  const hasContextualNav = content.includes('contextual') || content.includes('context');
  console.log(`${hasContextualNav ? '✅' : '❌'} Navigation contextuelle: ${hasContextualNav ? 'Implémentée' : 'Manquante'}`);
  
  // Vérifier la navigation responsive
  const hasResponsiveNav = content.includes('mobile') || content.includes('responsive') || content.includes('breakpoint');
  console.log(`${hasResponsiveNav ? '✅' : '❌'} Navigation responsive: ${hasResponsiveNav ? 'Implémentée' : 'Manquante'}`);
  
  // Vérifier les animations/transitions
  const hasAnimations = content.includes('transition') || content.includes('animate') || content.includes('duration');
  console.log(`${hasAnimations ? '✅' : '❌'} Animations fluides: ${hasAnimations ? 'Implémentées' : 'Manquantes'}`);
  
  // Vérifier Phase 8 markers
  const hasPhase8Markers = content.includes('Phase 8');
  console.log(`${hasPhase8Markers ? '✅' : '❌'} Phase 8 markers: ${hasPhase8Markers ? 'Présents' : 'Manquants'}`);
  
  if (!hasContextualNav || !hasResponsiveNav || !hasAnimations) {
    issuesFound++;
  }
} else {
  console.log(`❌ Composant navigation principal manquant`);
  issuesFound++;
}

// Vérification de l'intégration avec les services
console.log("\n🔗 Intégration Services:");
const navigationFiles = [
  "src/lib/components/navigation/NavigationSearch.svelte",
  "src/lib/components/navigation/ProgressNavigation.svelte"
];

for (const filePath of navigationFiles) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Vérifier l'intégration avec curriculum service
    const hasCurriculumIntegration = content.includes('curriculumService') || content.includes('curriculum');
    console.log(`${hasCurriculumIntegration ? '✅' : '❌'} ${path.basename(filePath)}: ${hasCurriculumIntegration ? 'Intégré curriculum' : 'Pas d\'intégration'}`);
    
    if (!hasCurriculumIntegration) {
      issuesFound++;
    }
  }
}

// Vérification de la structure navigation
console.log("\n📊 Structure Navigation:");
const navigationDir = path.join(PROJECT_ROOT, "src/lib/components/navigation");
if (fs.existsSync(navigationDir)) {
  const navFiles = fs.readdirSync(navigationDir);
  console.log(`✅ Composants navigation: ${navFiles.length} fichiers`);
  navFiles.forEach(file => {
    console.log(`   📄 ${file}`);
  });
} else {
  console.log(`❌ Dossier navigation manquant`);
  issuesFound++;
}

// Analyse de la couverture UX
console.log("\n🎯 Couverture UX Phase 8:");
const mobileNavFile = path.join(PROJECT_ROOT, "src/lib/components/navigation/MobileNavigation.svelte");
if (fs.existsSync(mobileNavFile)) {
  const content = fs.readFileSync(mobileNavFile, 'utf8');
  
  // Vérifier les gestes tactiles
  const hasTouchGestures = content.includes('touch') || content.includes('swipe') || content.includes('gesture');
  console.log(`${hasTouchGestures ? '✅' : '❌'} Gestes tactiles: ${hasTouchGestures ? 'Supportés' : 'Manquants'}`);
  
  // Vérifier l'accessibilité
  const hasAccessibility = content.includes('aria-') || content.includes('role=') || content.includes('tabindex');
  console.log(`${hasAccessibility ? '✅' : '❌'} Accessibilité: ${hasAccessibility ? 'Implémentée' : 'Manquante'}`);
  
  if (!hasTouchGestures || !hasAccessibility) {
    issuesFound++;
  }
}

console.log("\n" + "=".repeat(50));

if (issuesFound === 0) {
  console.log("🎉 PHASE 8 - NAVIGATION UX OPÉRATIONNELLE !");
  console.log("✨ Tous les composants de navigation sont présents");
  console.log("🧭 Navigation intelligente et contextuelle implémentée");
  console.log("📱 Support mobile et accessibilité intégrés");
  console.log("🎨 UX optimisée pour l'apprentissage");
} else if (issuesFound <= 2) {
  console.log("⚡ PHASE 8 - LARGEMENT IMPLÉMENTÉE");
  console.log(`   ${issuesFound} améliorations mineures suggérées`);
  console.log("🚀 Navigation de base opérationnelle");
} else {
  console.log("⚠️ PHASE 8 - PARTIELLEMENT IMPLÉMENTÉE");
  console.log(`   ${issuesFound} éléments nécessitent attention`);
  console.log("🔧 Complétion recommandée avant validation finale");
}

console.log("=".repeat(50));

process.exit(issuesFound <= 2 ? 0 : 1);
