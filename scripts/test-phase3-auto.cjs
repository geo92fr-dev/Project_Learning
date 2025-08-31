#!/usr/bin/env node
// 🧪 Script de test automatisé avec serveur intégré
// Conformément à DOC_CoPilot_Practices : validation complète URL

const { spawn } = require('child_process');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

console.log('🧪 TESTS AUTOMATISÉS PHASE 3 - DOC_CoPilot_Practices');
console.log('═══════════════════════════════════════════════════════');

async function runAutomatedTests() {
  console.log('\n🚀 1. VÉRIFICATION SERVEUR');
  
  // Vérifier si le serveur est actif
  try {
    const { execSync } = require('child_process');
    const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/', { 
      encoding: 'utf8',
      timeout: 5000 
    });
    
    if (response.trim() === '200') {
      console.log('✅ Serveur actif sur http://localhost:5173/');
    } else {
      console.log('❌ Serveur non actif, code:', response);
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Impossible de contacter le serveur:', error.message);
    process.exit(1);
  }

  console.log('\n🧪 2. TESTS PLAYWRIGHT AUTOMATIQUES');
  
  try {
    // Lancer les tests Playwright
    const testProcess = spawn('npx', ['playwright', 'test', 'tests/e2e/test-exercises.spec.js', '--reporter=line'], {
      stdio: 'inherit',
      shell: true
    });
    
    testProcess.on('close', (code) => {
      console.log('\n📊 3. RAPPORT FINAL TESTS');
      console.log('─────────────────────────');
      
      if (code === 0) {
        console.log('🎉 ✅ TOUS LES TESTS PASSENT');
        console.log('    Page test-exercises validée selon DOC_CoPilot_Practices');
        console.log('    Aucune page blanche détectée');
      } else {
        console.log('⚠️ ❌ TESTS ÉCHOUÉS');
        console.log('    Problèmes détectés dans la validation URL');
        console.log('    Vérifier les erreurs ci-dessus');
      }
      
      process.exit(code);
    });
    
  } catch (error) {
    console.log('❌ Erreur lors des tests:', error.message);
    process.exit(1);
  }
}

// Attendre un peu pour que le serveur soit prêt
setTimeout(runAutomatedTests, 2000);
