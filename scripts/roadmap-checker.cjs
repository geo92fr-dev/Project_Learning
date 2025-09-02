#!/usr/bin/env node
/**
 * 🔍 Roadmap Checker - Validation de cohérence multi-niveaux
 * @description Vérifie l'alignement entre ROADMAP principal, automation et phases
 * @criticality HIGH - Assure la cohérence documentaire
 */

const fs = require('fs');
const path = require('path');

class RoadmapChecker {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.roadmapMain = this.loadRoadmap('roadmap/ROADMAP_LEARNING.md');
    this.roadmapAuto = this.loadRoadmap('roadmap/ROADMAP_AUTOMATISATIONS_TECHNIQUES.md');
    this.roadmapSummary = this.loadRoadmap('roadmap/ROADMAP_LEARNING_SUMMARY.md');
    this.phases = this.loadPhases();
  }

  // Validation de cohérence multi-niveaux
  async validateAlignment() {
    console.log('🔍 Validation cohérence roadmap multi-niveaux...');
    
    const checks = [
      this.checkPhaseConsistency(),
      this.checkCommandsConsistency(),
      this.checkAutomationAlignment(),
      this.checkSummarySync()
    ];

    const results = await Promise.all(checks);
    const allPassed = results.every(r => r.success);

    this.generateAlignmentReport(results, allPassed);
    return allPassed;
  }

  // Vérification cohérence des phases
  checkPhaseConsistency() {
    console.log('📋 Vérification cohérence phases...');
    
    // Phases réellement existantes dans le projet
    const actualPhases = this.getActualPhases();
    const documentedPhases = this.getDocumentedPhases();
    
    // Phases actuellement en développement (phases 1-6 prioritaires)
    const currentPhases = documentedPhases.filter(p => {
      const num = parseInt(p.replace('phase', ''));
      return num >= 1 && num <= 6;
    });
    
    // Vérifier seulement les phases prioritaires
    const missingCurrent = currentPhases.filter(p => !actualPhases.includes(p));
    const extraPhases = actualPhases.filter(p => !documentedPhases.includes(p));
    
    // Les phases 7-12 sont futures, donc pas d'erreur si manquantes
    const futurePhases = documentedPhases.filter(p => {
      const num = parseInt(p.replace('phase', ''));
      return num > 6;
    });
    
    let details = 'Phases prioritaires alignées correctement';
    let success = missingCurrent.length === 0;
    
    if (missingCurrent.length > 0) {
      details = `Phases prioritaires manquantes: ${missingCurrent.join(', ')}`;
    } else if (extraPhases.length > 0) {
      details = `Phases supplémentaires détectées: ${extraPhases.join(', ')}`;
      success = true; // Pas une erreur, juste informatif
    } else if (actualPhases.length > 0) {
      details = `Phases implémentées: ${actualPhases.join(', ')} (${futurePhases.length} phases futures documentées)`;
    }
    
    return {
      name: 'Phase Consistency',
      success: success,
      details: details
    };
  }

  // Vérification cohérence des commandes npm
  checkCommandsConsistency() {
    console.log('⚙️ Vérification commandes npm...');
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return {
        name: 'Commands Consistency',
        success: false,
        details: 'package.json introuvable'
      };
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = Object.keys(packageJson.scripts || {});
    
    // Scripts essentiels pour le workflow
    const essentialScripts = ['dev', 'build', 'test', 'validate'];
    const missing = essentialScripts.filter(s => !scripts.includes(s));
    
    // Scripts de validation de phases existants
    const phaseValidationScripts = scripts.filter(s => s.startsWith('validate:phase'));
    
    let details = 'Tous les scripts essentiels présents';
    if (missing.length > 0) {
      details = `Scripts essentiels manquants: ${missing.join(', ')}`;
    } else if (phaseValidationScripts.length > 0) {
      details = `Scripts présents (${phaseValidationScripts.length} validations de phases)`;
    }
    
    return {
      name: 'Commands Consistency',
      success: missing.length === 0,
      details: details
    };
  }

  // Vérification alignement automation
  checkAutomationAlignment() {
    console.log('🤖 Vérification alignement automation...');
    const hasAutomationRoadmap = this.roadmapAuto.length > 0;
    const hasDevIaScript = this.roadmapMain.includes('npm run dev:ia') || this.roadmapSummary.includes('npm run dev:ia');
    
    return {
      name: 'Automation Alignment',
      success: hasAutomationRoadmap && hasDevIaScript,
      details: hasAutomationRoadmap && hasDevIaScript ? 
        'Roadmap automation aligné avec roadmap principal' : 
        'Alignement automation incomplet'
    };
  }

  // Vérification synchronisation summary
  checkSummarySync() {
    console.log('📄 Vérification synchronisation summary...');
    const hasSummary = this.roadmapSummary.length > 0;
    const hasOrchestration = this.roadmapSummary.includes('Orchestration Workflow');
    
    return {
      name: 'Summary Sync',
      success: hasSummary && hasOrchestration,
      details: hasSummary && hasOrchestration ? 
        'Summary synchronisé avec orchestration documentée' : 
        'Summary nécessite mise à jour orchestration'
    };
  }

  generateAlignmentReport(results, success) {
    console.log('\n📊 RAPPORT DE COHÉRENCE ROADMAP:');
    console.log(`Status Global: ${success ? '✅ CONFORME' : '❌ NON-CONFORME'}`);
    console.log('─'.repeat(50));
    
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.details}`);
    });

    if (!success) {
      console.log('\n💡 ACTIONS RECOMMANDÉES:');
      console.log('🔧 Vérifier la cohérence entre les différents niveaux de roadmap');
      console.log('🔧 Compléter les scripts manquants dans package.json');
      console.log('🔧 Mettre à jour la documentation d\'orchestration');
    }
  }

  // Utilitaires
  loadRoadmap(filePath) {
    const fullPath = path.join(this.projectRoot, filePath);
    return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : '';
  }

  loadPhases() {
    const phasesDir = path.join(this.projectRoot, 'roadmap/phases');
    if (!fs.existsSync(phasesDir)) return [];
    
    return fs.readdirSync(phasesDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
  }

  // Nouvelles méthodes pour une validation plus précise
  getActualPhases() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return [];
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = Object.keys(packageJson.scripts || {});
    
    // Extraire les phases des scripts validate:phase*
    const phaseScripts = scripts
      .filter(script => script.startsWith('validate:phase'))
      .map(script => script.replace('validate:phase', '').replace(':quick', ''))
      .filter(phase => /^\d+$/.test(phase)) // Seulement les numéros
      .map(phase => `phase${phase}`);
    
    // Ajouter les phases détectées dans les fichiers scripts
    const scriptsDir = path.join(this.projectRoot, 'scripts');
    if (fs.existsSync(scriptsDir)) {
      const scriptFiles = fs.readdirSync(scriptsDir)
        .filter(file => file.startsWith('validate-phase') && (file.endsWith('.js') || file.endsWith('.cjs')))
        .map(file => {
          const match = file.match(/validate-phase(\d+)/);
          return match ? `phase${match[1]}` : null;
        })
        .filter(Boolean);
      
      phaseScripts.push(...scriptFiles);
    }
    
    return [...new Set(phaseScripts)].sort();
  }
  
  getDocumentedPhases() {
    // Phases officiellement documentées dans la roadmap summary
    const knownPhases = [
      'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6',
      'phase7', 'phase8', 'phase9', 'phase10', 'phase11', 'phase12'
    ];
    
    // Vérifier quelles phases sont réellement mentionnées dans la documentation
    const summaryContent = this.roadmapSummary.toLowerCase();
    const documentedPhases = knownPhases.filter(phase => {
      const phaseNum = phase.replace('phase', '');
      // Chercher des patterns comme "Phase 1", "**1**", "| **1** |"
      const patterns = [
        `phase ${phaseNum}`,
        `\\*\\*${phaseNum}\\*\\*`,
        `\\| \\*\\*${phaseNum}\\*\\* \\|`,
        `phase-${phaseNum}`,
        `phases/${phase}`
      ];
      
      return patterns.some(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(summaryContent);
      });
    });
    
    return documentedPhases;
  }
  
  extractPhases(content) {
    // Méthode simplifiée - non utilisée maintenant
    const phaseRegex = /phase[- ]?(\d+)/gi;
    const matches = content.match(phaseRegex) || [];
    return [...new Set(matches)];
  }
}

// CLI Interface
if (require.main === module) {
  const checker = new RoadmapChecker();
  checker.validateAlignment()
    .then(success => {
      console.log(`\n🎯 Résultat: ${success ? 'COHÉRENCE VALIDÉE' : 'CORRECTIONS NÉCESSAIRES'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('🚨 Erreur lors de la validation:', error);
      process.exit(1);
    });
}

module.exports = RoadmapChecker;
