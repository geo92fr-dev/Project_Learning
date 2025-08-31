#!/usr/bin/env node

/**
 * Script de rollback pour la conformité Phase 1
 * Supprime tous les éléments qui dépassent les spécifications de la Phase 1
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 ROLLBACK PHASE 1 - Nettoyage conformité roadmap');

// Éléments à supprimer (dépassent Phase 1)
const elementsToRemove = [
  // Routes avancées (Phase 3, 4, 8)
  'src/routes/dashboard',
  'src/routes/pedagogy', 
  'src/routes/[matiere]',
  'src/routes/cours',
  
  // Lib avancés (Phase 3, 4, 8)
  'src/lib/pedagogy',
  'src/lib/components/pedagogy',
  'src/lib/components/navigation',
  'src/lib/stores/content.ts',
  'src/lib/stores/pedagogy.ts', 
  'src/lib/stores/auth.ts',
  'src/lib/types',
  
  // Fichiers temporaires/build
  '.svelte-kit/types/src/routes/dashboard',
  '.svelte-kit/types/src/routes/pedagogy',
  '.svelte-kit/types/src/routes/[matiere]',
  '.svelte-kit/types/src/routes/cours'
];

function removeRecursive(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Suppression: ${dirPath}`);
    
    if (fs.lstatSync(fullPath).isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
    
    return true;
  }
  
  return false;
}

// Suppression des éléments non conformes
console.log('\n📁 Suppression des éléments avancés...');
let removedCount = 0;

elementsToRemove.forEach(element => {
  if (removeRecursive(element)) {
    removedCount++;
  }
});

// Nettoyage du src/lib/index.js pour le rendre conforme Phase 1
const indexPath = 'src/lib/index.js';
const indexFullPath = path.join(process.cwd(), indexPath);

if (fs.existsSync(indexFullPath)) {
  console.log('🔧 Nettoyage src/lib/index.js');
  
  const phase1Index = `// 🚀 FunLearning V2.0 - Phase 1 Export Index
// Configuration centralisée des exports pour la Phase 1 uniquement

// === FIREBASE CONFIG ===
export { auth, db } from './firebase.js';

// === PHASE 1 COMPONENTS ===
// Note: Les composants avancés seront ajoutés dans les phases ultérieures
// export { default as LoginForm } from './components/auth/LoginForm.svelte';

// === UTILS ===
// À enrichir au fur et à mesure des phases

// 📋 Phase Status: ✅ Phase 1 - Setup basique conforme roadmap
`;

  fs.writeFileSync(indexFullPath, phase1Index);
}

// Nettoyage stores basiques conformes Phase 1
const authStorePath = 'src/lib/stores/auth.js';
const authStoreFullPath = path.join(process.cwd(), authStorePath);

if (fs.existsSync(authStoreFullPath)) {
  console.log('🔧 Nettoyage src/lib/stores/auth.js');
  
  const phase1AuthStore = `// 🚀 FunLearning V2.0 - Phase 1 Auth Store
// Store d'authentification basique conforme Phase 1

import { writable } from 'svelte/store';
import { auth } from '../firebase.js';

// === USER STATE ===
export const user = writable(null);
export const loading = writable(true);

// === BASIC AUTH FUNCTIONS ===
export function initAuth() {
  // Configuration basique auth Firebase
  // Sera enrichi dans les phases ultérieures
  loading.set(false);
}

// 📋 Phase Status: ✅ Phase 1 - Auth basique conforme roadmap
`;

  fs.writeFileSync(authStoreFullPath, phase1AuthStore);
}

// Nettoyage de la page d'accueil pour la Phase 1
const homePath = 'src/routes/+page.svelte';
const homeFullPath = path.join(process.cwd(), homePath);

if (fs.existsSync(homeFullPath)) {
  console.log('🔧 Nettoyage src/routes/+page.svelte');
  
  const phase1Home = `<script>
  // 🚀 FunLearning V2.0 - Phase 1 Home Page
  // Page d'accueil basique conforme roadmap Phase 1
  
  import { user } from '$lib/stores/auth.js';
</script>

<svelte:head>
  <title>FunLearning V2.0 - Plateforme Éducative</title>
  <meta name="description" content="Plateforme d'apprentissage personnalisée" />
</svelte:head>

<main class="container">
  <header class="hero">
    <h1>🚀 FunLearning V2.0</h1>
    <p>Plateforme d'apprentissage personnalisée et adaptive</p>
    <p class="phase-status">📋 Phase 1 : Setup & Architecture ✅</p>
  </header>

  <section class="status">
    <h2>🏗️ État du Projet</h2>
    <div class="status-grid">
      <div class="status-card">
        <h3>✅ Phase 1 - Setup</h3>
        <p>SvelteKit + TypeScript + Tests configurés</p>
      </div>
      
      <div class="status-card pending">
        <h3>⏳ Phase 2 - Auth Firebase</h3>
        <p>Authentification complète (à venir)</p>
      </div>
      
      <div class="status-card pending">
        <h3>⏳ Phase 3 - Contenus</h3>
        <p>Structure des cours (à venir)</p>
      </div>
    </div>
  </section>

  <footer>
    <p>🎯 Développement méthodique selon roadmap 12 phases</p>
  </footer>
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .hero {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .hero h1 {
    font-size: 3rem;
    color: #2563eb;
    margin-bottom: 1rem;
  }
  
  .phase-status {
    background: #10b981;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    display: inline-block;
    margin-top: 1rem;
  }
  
  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .status-card {
    border: 2px solid #10b981;
    border-radius: 8px;
    padding: 1.5rem;
    background: #f0fdf4;
  }
  
  .status-card.pending {
    border-color: #f59e0b;
    background: #fffbeb;
  }
  
  .status-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }
  
  footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
  }
</style>`;

  fs.writeFileSync(homeFullPath, phase1Home);
}

// Suppression des imports avancés du app.html si nécessaire
const appHtmlPath = 'src/app.html';
const appHtmlFullPath = path.join(process.cwd(), appHtmlPath);

if (fs.existsSync(appHtmlFullPath)) {
  let appHtmlContent = fs.readFileSync(appHtmlFullPath, 'utf8');
  
  // Nettoyage des éléments non Phase 1
  if (appHtmlContent.includes('pedagogy') || appHtmlContent.includes('navigation')) {
    console.log('🔧 Nettoyage src/app.html');
    
    const phase1AppHtml = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width" />
    <title>FunLearning V2.0</title>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`;
    
    fs.writeFileSync(appHtmlFullPath, phase1AppHtml);
  }
}

console.log(`\n✅ Rollback Phase 1 terminé!`);
console.log(`📊 Éléments supprimés: ${removedCount}`);
console.log(`\n🎯 État: Projet conforme Phase 1 - Setup & Architecture`);
console.log(`📋 Prochaine étape: Phase 2 - Authentification Firebase`);
