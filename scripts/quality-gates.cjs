#!/usr/bin/env node
/**
 * 🛡️ Quality Gates - Validation automatisée multi-domaines
 * @description Tests de qualité complets selon standards FunLearning
 * @criticality HIGH - Garde-fou qualité avant progression
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class QualityGates {
  constructor() {
    this.gates = {
      'lint': { command: 'npm run lint', description: 'Code style et syntaxe' },
      'build': { command: 'npm run build', description: 'Compilation TypeScript' },
      'test:unit': { command: 'npm run test:unit', description: 'Tests unitaires' },
      'test:critical': { command: 'npm run test:critical', description: 'Tests critiques' },
      'security': { command: 'npm audit --audit-level moderate', description: 'Audit sécurité' }
    };
  }

  async runAllGates(options = {}) {
    console.log('🛡️ Quality Gates - Validation complète...');
    console.log(`📋 ${Object.keys(this.gates).length} gates à valider\n`);

    const results = [];
    let allPassed = true;

    for (const [gateName, gate] of Object.entries(this.gates)) {
      if (options.skip && options.skip.includes(gateName)) {
        console.log(`⏭️ ${gateName}: IGNORÉ`);
        continue;
      }

      const result = await this.runGate(gateName, gate);
      results.push(result);
      
      if (!result.success) {
        allPassed = false;
        if (options.failFast) {
          console.log('🚨 Arrêt sur premier échec (--fail-fast)');
          break;
        }
      }
    }

    this.generateQualityReport(results, allPassed);
    return { success: allPassed, results };
  }

  async runGate(name, gate) {
    console.log(`🔍 ${name}: ${gate.description}...`);
    
    try {
      const startTime = Date.now();
      await execAsync(gate.command);
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${name}: PASSÉ (${duration}ms)`);
      return { name, success: true, duration, message: 'Succès' };
      
    } catch (error) {
      console.log(`❌ ${name}: ÉCHEC`);
      console.log(`   Error: ${error.message.split('\n')[0]}`);
      
      return { 
        name, 
        success: false, 
        duration: 0, 
        message: error.message.split('\n')[0] 
      };
    }
  }

  generateQualityReport(results, success) {
    console.log('\n📊 RAPPORT QUALITY GATES:');
    console.log(`Status Global: ${success ? '✅ TOUS PASSÉS' : '❌ ÉCHECS DÉTECTÉS'}`);
    console.log('─'.repeat(60));
    
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration ? `(${result.duration}ms)` : '';
      console.log(`${status} ${result.name.padEnd(15)} ${duration.padEnd(10)} ${result.message}`);
    });

    if (!success) {
      console.log('\n💡 ACTIONS RECOMMANDÉES:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`🔧 ${result.name}: Vérifier et corriger les erreurs reportées`);
      });
    }

    console.log('\n📈 MÉTRIQUES:');
    const successCount = results.filter(r => r.success).length;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    console.log(`📊 Réussite: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);
    console.log(`⏱️ Temps total: ${totalDuration}ms`);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    failFast: args.includes('--fail-fast'),
    skip: args.includes('--skip') ? 
      args[args.indexOf('--skip') + 1]?.split(',') || [] : []
  };

  const gates = new QualityGates();
  gates.runAllGates(options)
    .then(result => {
      console.log(`\n🎯 Résultat Quality Gates: ${result.success ? 'VALIDÉ' : 'ÉCHECS DÉTECTÉS'}`);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('🚨 Erreur lors des Quality Gates:', error);
      process.exit(1);
    });
}

module.exports = QualityGates;
