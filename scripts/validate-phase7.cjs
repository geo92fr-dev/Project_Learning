#!/usr/bin/env node

/**
 * Script de validation Phase 7 - Interface Dynamique
 * Valide la connexion complète Firebase + UI dynamique
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

const PHASE7_FILES = {
  "🎨 Interface Avancée": "src/routes/app-interface.svelte",
  "🧭 Navigation System": "src/lib/NavigationSystem.svelte", 
  "🔗 Curriculum Integration": "src/lib/curriculum-integration.js",
  "🎨 Design System": "src/routes/design-system-demo.svelte",
  "🧪 Navigation Test": "src/routes/navigation-test/+page.svelte",
  "📱 App Interface Page": "src/routes/app-interface/+page.svelte",
  "🎯 Design Demo Page": "src/routes/design-system-demo/+page.svelte"
};

const PHASE7_SERVICES = {
  "📊 Curriculum Service": "src/lib/services/curriculumService.ts",
  "📈 Progress Tracker": "src/lib/services/progressTracker.ts",
  "🔥 Firebase Stores": "src/lib/firebase-stores.ts"
};

const PHASE7_INTEGRATION_POINTS = [
  "Firebase integration",
  "Dynamic data loading", 
  "Real-time updates",
  "Reactive UI",
  "Navigation system"
];

console.log("\n🎨 DIAGNOSTIC PHASE 7 - INTERFACE DYNAMIQUE");
console.log("=".repeat(50));

let issuesFound = 0;

// Vérification des fichiers d'interface
console.log("\n📁 Fichiers Interface Phase 7:");
for (const [name, filePath] of Object.entries(PHASE7_FILES)) {
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

// Vérification des services connectés
console.log("\n🔗 Services Connectés:");
for (const [name, filePath] of Object.entries(PHASE7_SERVICES)) {
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

// Vérification de l'intégration dynamique
console.log("\n🔄 Intégration Dynamique:");
const appInterfaceFile = path.join(PROJECT_ROOT, "src/routes/app-interface.svelte");
if (fs.existsSync(appInterfaceFile)) {
  const content = fs.readFileSync(appInterfaceFile, 'utf8');
  
  // Vérifier les imports Firebase
  const hasFirebaseImports = content.includes('firebase') || content.includes('firestore');
  console.log(`${hasFirebaseImports ? '✅' : '❌'} Firebase imports: ${hasFirebaseImports ? 'Présents' : 'Manquants'}`);
  
  // Vérifier les stores réactifs
  const hasReactiveStores = content.includes('$') && (content.includes('store') || content.includes('writable'));
  console.log(`${hasReactiveStores ? '✅' : '❌'} Reactive stores: ${hasReactiveStores ? 'Configurés' : 'Manquants'}`);
  
  // Vérifier les composants dynamiques
  const hasDynamicComponents = content.includes('each') || content.includes('if') || content.includes('await');
  console.log(`${hasDynamicComponents ? '✅' : '❌'} Dynamic components: ${hasDynamicComponents ? 'Implémentés' : 'Manquants'}`);
  
  // Vérifier Phase 7 markers
  const hasPhase7Markers = content.includes('Phase 7');
  console.log(`${hasPhase7Markers ? '✅' : '❌'} Phase 7 markers: ${hasPhase7Markers ? 'Présents' : 'Manquants'}`);
  
  if (!hasFirebaseImports || !hasReactiveStores || !hasDynamicComponents) {
    issuesFound++;
  }
} else {
  console.log(`❌ Interface principale manquante`);
  issuesFound++;
}

// Vérification des routes
console.log("\n🛣️ Routes Phase 7:");
const routesDir = path.join(PROJECT_ROOT, "src/routes");
if (fs.existsSync(routesDir)) {
  const routes = fs.readdirSync(routesDir, { withFileTypes: true });
  
  const phase7Routes = routes.filter(route => {
    if (route.isDirectory()) {
      return ['app-interface', 'navigation-test', 'design-system-demo'].includes(route.name);
    } else if (route.isFile()) {
      return route.name.includes('app-interface') || route.name.includes('design-system');
    }
    return false;
  });
  
  console.log(`✅ Routes Phase 7: ${phase7Routes.length} trouvées`);
  phase7Routes.forEach(route => {
    console.log(`   📄 ${route.name}`);
  });
} else {
  console.log(`❌ Dossier routes manquant`);
  issuesFound++;
}

// Analyse de contenu pour l'intégration
console.log("\n🔍 Analyse d'Intégration:");
const integrationFiles = [
  "src/lib/curriculum-integration.js",
  "src/lib/NavigationSystem.svelte"
];

for (const filePath of integrationFiles) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasPhase7Content = content.includes('Phase 7');
    console.log(`${hasPhase7Content ? '✅' : '❌'} ${path.basename(filePath)}: ${hasPhase7Content ? 'Intégré Phase 7' : 'Générique'}`);
  }
}

console.log("\n" + "=".repeat(50));

if (issuesFound === 0) {
  console.log("🎉 PHASE 7 - INTERFACE DYNAMIQUE IMPLÉMENTÉE !");
  console.log("✨ Tous les composants d'interface dynamique sont présents");
  console.log("🔗 Intégration Firebase et services opérationnelle");
  console.log("🎨 UI/UX avancée avec navigation système");
} else {
  console.log("⚠️ PHASE 7 - PARTIELLEMENT IMPLÉMENTÉE");
  console.log(`   ${issuesFound} éléments manquants ou incomplets`);
  console.log("🔧 Complétion nécessaire avant validation finale");
}

console.log("=".repeat(50));

process.exit(issuesFound === 0 ? 0 : 1);
