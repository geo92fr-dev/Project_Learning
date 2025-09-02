#!/usr/bin/env node

/**
 * Script de validation Phase 9 - Exercices & Progression
 * Valide le système d'exercices interactifs et la gamification
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();

const PHASE9_EXERCISE_COMPONENTS = {
  "🧪 QCM Component": "src/lib/components/exercises/QCMCard.svelte",
  "💪 Interactive Exercise": "src/lib/components/exercises/InteractiveExercise.svelte",
  "🎯 Exercise Engine": "src/lib/components/exercises/ExerciseEngine.svelte",
  "📊 Progress Tracker UI": "src/lib/components/exercises/ProgressTracker.svelte",
  "🏆 Gamification Panel": "src/lib/components/exercises/GamificationPanel.svelte",
  "📈 Score Display": "src/lib/components/exercises/ScoreDisplay.svelte"
};

const PHASE9_SERVICES = {
  "📋 Exercise Service": "src/lib/services/exerciseService.ts",
  "🎮 Gamification Service": "src/lib/services/gamificationService.ts",
  "📊 Scoring Engine": "src/lib/services/scoringEngine.ts",
  "🔄 Adaptive System": "src/lib/services/adaptiveSystem.ts"
};

const PHASE9_TYPES = {
  "🏷️ Exercise Types": "src/lib/types/exercise.ts",
  "📈 Progress Types": "src/lib/types/progress.ts",
  "🎮 Gamification Types": "src/lib/types/gamification.ts",
  "📊 Score Types": "src/lib/types/scoring.ts"
};

const PHASE9_STORES = {
  "🗃️ Exercise Store": "src/lib/stores/exercises.ts",
  "🏆 Gamification Store": "src/lib/stores/gamification.ts",
  "📊 Progress Store": "src/lib/stores/progress.ts"
};

const PHASE9_ROUTES = {
  "🧪 Test Exercises": "src/routes/test-exercises",
  "💪 Exercise Hub": "src/routes/exercises",
  "🏆 Achievements": "src/routes/achievements",
  "📊 Progress Dashboard": "src/routes/progress"
};

console.log("\n💪 DIAGNOSTIC PHASE 9 - EXERCICES & PROGRESSION");
console.log("=".repeat(50));

let issuesFound = 0;
let foundElements = 0;
let totalElements = 0;

// Fonction helper pour vérifier les fichiers
function checkFileCategory(categoryName, files) {
  console.log(`\n${categoryName}:`);
  for (const [name, filePath] of Object.entries(files)) {
    totalElements++;
    const fullPath = path.join(PROJECT_ROOT, filePath);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      const stats = fs.statSync(fullPath);
      console.log(`✅ ${name}: ${filePath} (${stats.size} bytes)`);
      foundElements++;
    } else {
      console.log(`❌ ${name}: ${filePath} - MANQUANT`);
      issuesFound++;
    }
  }
}

// Vérification des composants
checkFileCategory("📁 Composants Exercices", PHASE9_EXERCISE_COMPONENTS);

// Vérification des services
checkFileCategory("⚙️ Services Phase 9", PHASE9_SERVICES);

// Vérification des types
checkFileCategory("🏷️ Types TypeScript", PHASE9_TYPES);

// Vérification des stores
checkFileCategory("🗃️ Stores Svelte", PHASE9_STORES);

// Vérification des routes
checkFileCategory("🛣️ Routes Exercices", PHASE9_ROUTES);

// Vérification fonctionnelle des exercices existants
console.log("\n🔍 Analyse Fonctionnelle:");
const exerciseTypesFile = path.join(PROJECT_ROOT, "src/lib/types/exercise.ts");
if (fs.existsSync(exerciseTypesFile)) {
  const content = fs.readFileSync(exerciseTypesFile, 'utf8');
  
  // Vérifier les types d'exercices
  const hasQCM = content.includes('QCMExercise');
  const hasTrueFalse = content.includes('TrueFalseExercise');
  const hasFillBlanks = content.includes('FillBlanksExercise');
  const hasExerciseResult = content.includes('ExerciseResult');
  
  console.log(`${hasQCM ? '✅' : '❌'} QCM Exercises: ${hasQCM ? 'Définis' : 'Manquants'}`);
  console.log(`${hasTrueFalse ? '✅' : '❌'} True/False Exercises: ${hasTrueFalse ? 'Définis' : 'Manquants'}`);
  console.log(`${hasFillBlanks ? '✅' : '❌'} Fill Blanks Exercises: ${hasFillBlanks ? 'Définis' : 'Manquants'}`);
  console.log(`${hasExerciseResult ? '✅' : '❌'} Exercise Results: ${hasExerciseResult ? 'Définis' : 'Manquants'}`);
} else {
  console.log(`❌ Types d'exercices non définis`);
  issuesFound++;
}

// Vérification des stores existants
const exerciseStoreFile = path.join(PROJECT_ROOT, "src/lib/stores/exercises.ts");
if (fs.existsSync(exerciseStoreFile)) {
  const content = fs.readFileSync(exerciseStoreFile, 'utf8');
  
  const hasCurrentExercise = content.includes('currentExercise');
  const hasExerciseProgress = content.includes('exerciseProgress');
  const hasExerciseActions = content.includes('exerciseActions') || content.includes('submitQCMAnswer');
  
  console.log(`${hasCurrentExercise ? '✅' : '❌'} Current Exercise State: ${hasCurrentExercise ? 'Géré' : 'Manquant'}`);
  console.log(`${hasExerciseProgress ? '✅' : '❌'} Exercise Progress: ${hasExerciseProgress ? 'Tracké' : 'Manquant'}`);
  console.log(`${hasExerciseActions ? '✅' : '❌'} Exercise Actions: ${hasExerciseActions ? 'Implémentés' : 'Manquants'}`);
} else {
  console.log(`❌ Store d'exercices manquant`);
  issuesFound++;
}

// Vérification de la route de test
const testExerciseRoute = path.join(PROJECT_ROOT, "src/routes/test-exercises/+page.svelte");
if (fs.existsSync(testExerciseRoute)) {
  const content = fs.readFileSync(testExerciseRoute, 'utf8');
  
  const hasQCMCard = content.includes('QCMCard');
  const hasExerciseLogic = content.includes('submitQCMAnswer') || content.includes('exerciseActions');
  
  console.log(`${hasQCMCard ? '✅' : '❌'} QCM Card Integration: ${hasQCMCard ? 'Intégré' : 'Manquant'}`);
  console.log(`${hasExerciseLogic ? '✅' : '❌'} Exercise Logic: ${hasExerciseLogic ? 'Fonctionnel' : 'Manquant'}`);
} else {
  console.log(`❌ Route de test d'exercices manquante`);
}

// Calcul du pourcentage de completion
const completionRate = Math.round((foundElements / totalElements) * 100);

console.log("\n" + "=".repeat(50));
console.log(`📊 ÉTAT PHASE 9: ${completionRate}% complète (${foundElements}/${totalElements} éléments)`);

if (completionRate >= 80) {
  console.log("🎉 PHASE 9 - LARGEMENT AVANCÉE !");
  console.log("✨ Fondations solides, finalisation recommandée");
  console.log("🚀 Prêt pour complétion rapide");
} else if (completionRate >= 50) {
  console.log("⚡ PHASE 9 - BIEN DÉMARRÉE");
  console.log(`   ${issuesFound} éléments à implémenter`);
  console.log("🔧 Développement en cours, bonne progression");
} else if (completionRate >= 20) {
  console.log("🌱 PHASE 9 - FONDATIONS POSÉES");
  console.log(`   ${issuesFound} éléments manquants`);
  console.log("💪 Bases disponibles, développement intensif requis");
} else {
  console.log("🎯 PHASE 9 - À DÉVELOPPER");
  console.log(`   ${issuesFound} éléments à créer`);
  console.log("🚀 Démarrage complet de la phase");
}

console.log("=".repeat(50));

process.exit(0);
