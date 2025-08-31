#!/usr/bin/env node
/**
 * 🛡️ Quality Gates Phase 1 - Validation adaptée à la phase de setup
 * @description Tests de qualité complets adaptés aux contraintes Phase 1
 * @criticality HIGH - Garde-fou qualité avant progression
 * @phase Phase 1 - Setup & Architecture (vulnérabilités dev acceptables)
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class QualityGatesPhase1 {
  constructor() {
    this.gates = {
      'lint': { 
        command: 'npm run lint', 
        description: 'Code style et syntaxe',
        critical: true
      },
      'build': { 
        command: 'npm run build', 
        description: 'Compilation TypeScript',
        critical: true
      },
      'test:unit': { 
        command: 'npm run test:unit', 
        description: 'Tests unitaires',
        critical: true
      },
      'test:critical': { 
        command: 'npm run test:critical', 
        description: 'Tests critiques',
        critical: true
      },
      'security:prod': { 
        command: 'npm audit --audit-level high --production', 
        description: 'Audit sécurité production uniquement',
        critical: false
      }
    };
  }

  async runAllGates(options = {}) {
    console.log('🛡️ Quality Gates Phase 1 - Validation complète...');
    console.log(`📋 ${Object.keys(this.gates).length} gates à valider (Phase 1 - Setup)\n`);

    const results = [];
    let criticalFailed = false;

    for (const [gateName, gateConfig] of Object.entries(this.gates)) {
      const startTime = Date.now();
      console.log(`🔍 ${gateName}: ${gateConfig.description}...`);

      try {
        const { stdout, stderr } = await execAsync(gateConfig.command, {
          cwd: process.cwd(),
          timeout: 120000
        });

        const duration = Date.now() - startTime;
        console.log(`✅ ${gateName}: PASSÉ (${duration}ms)`);
        
        results.push({
          gate: gateName,
          status: 'PASSED',
          duration,
          output: stdout,
          critical: gateConfig.critical
        });

      } catch (error) {
        const duration = Date.now() - startTime;
        
        if (gateConfig.critical) {
          console.log(`❌ ${gateName}: ÉCHEC`);
          console.log(`   Error: ${error.message}`);
          criticalFailed = true;
        } else {
          console.log(`⚠️ ${gateName}: NON-CRITIQUE`);
          console.log(`   Warning: ${error.message}`);
        }

        results.push({
          gate: gateName,
          status: gateConfig.critical ? 'FAILED' : 'WARNING',
          duration,
          error: error.message,
          critical: gateConfig.critical
        });
      }
    }

    this.generateReport(results, criticalFailed);
    return criticalFailed ? 1 : 0;
  }

  generateReport(results, criticalFailed) {
    console.log('\n📊 RAPPORT QUALITY GATES PHASE 1:');
    
    const criticalPassed = results.filter(r => r.critical && r.status === 'PASSED').length;
    const criticalTotal = results.filter(r => r.critical).length;
    const overallPassed = results.filter(r => r.status === 'PASSED').length;
    const totalGates = results.length;

    if (criticalFailed) {
      console.log('Status Global: ❌ ÉCHECS CRITIQUES DÉTECTÉS');
    } else {
      console.log('Status Global: ✅ TOUS LES TESTS CRITIQUES PASSÉS');
    }

    console.log('────────────────────────────────────────────────────────────');
    
    results.forEach(result => {
      const icon = result.status === 'PASSED' ? '✅' : 
                   result.status === 'FAILED' ? '❌' : '⚠️';
      const duration = result.duration ? `(${result.duration}ms)` : '';
      const status = result.status === 'PASSED' ? 'Succès' : 
                     result.status === 'FAILED' ? result.error : 'Avertissement';
      
      console.log(`${icon} ${result.gate.padEnd(15)} ${duration.padEnd(10)} ${status}`);
    });

    if (!criticalFailed && results.some(r => r.status === 'WARNING')) {
      console.log('\n💡 AVERTISSEMENTS PHASE 1:');
      results.filter(r => r.status === 'WARNING').forEach(result => {
        console.log(`⚠️ ${result.gate}: ${result.error}`);
      });
      console.log('\n📋 Ces avertissements sont acceptables en Phase 1 (développement)');
    }

    if (criticalFailed) {
      console.log('\n💡 ACTIONS RECOMMANDÉES:');
      results.filter(r => r.status === 'FAILED').forEach(result => {
        console.log(`🔧 ${result.gate}: Vérifier et corriger les erreurs reportées`);
      });
    }

    console.log('\n📈 MÉTRIQUES:');
    console.log(`📊 Tests critiques: ${criticalPassed}/${criticalTotal} (${Math.round(criticalPassed/criticalTotal*100)}%)`);
    console.log(`📊 Réussite globale: ${overallPassed}/${totalGates} (${Math.round(overallPassed/totalGates*100)}%)`);
    console.log(`⏱️ Temps total: ${results.reduce((sum, r) => sum + (r.duration || 0), 0)}ms`);

    console.log(`\n🎯 Résultat Quality Gates Phase 1: ${criticalFailed ? 'ÉCHECS CRITIQUES' : 'VALIDÉ'}`);
  }
}

// Exécution
if (require.main === module) {
  const gates = new QualityGatesPhase1();
  
  gates.runAllGates()
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('💥 Erreur lors de l\'exécution des Quality Gates:', error);
      process.exit(1);
    });
}

module.exports = QualityGatesPhase1;
