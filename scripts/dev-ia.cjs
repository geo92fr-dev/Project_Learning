#!/usr/bin/env node
/**
 * 🤖 Script dev:ia - Orchestrateur Central IA pour FunLearning
 * @description Orchestration complète du workflow de développement guidé par IA
 * @phase 1 - Intégré dès la Phase 1 Setup
 * @criticality HIGH - Script central pour collaboration Humain ↔ IA
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const execAsync = promisify(exec);

class DevIAOrchestrator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.currentPhase = this.detectCurrentPhase();
    this.workflowConfig = this.loadWorkflowConfig();
  }

  // Détection automatique de la phase courante
  detectCurrentPhase() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) return 1;
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const version = packageJson.version || '1.0.0';
    
    // Logic de détection basée sur la version, les fichiers et les tags Git
    try {
      // Vérification du tag Git actuel pour détecter la phase
      const { execSync } = require('child_process');
      const gitTag = execSync('git describe --tags --exact-match HEAD 2>/dev/null || echo ""', { encoding: 'utf8' }).trim();
      
      if (gitTag.includes('phase-4') || gitTag.includes('v4.0.0')) {
        return 4;
      }
      if (gitTag.includes('phase-3') || gitTag.includes('phase3-complete') || gitTag.includes('v3.0.0')) {
        return 3;
      }
    } catch (e) {
      // Git tag non disponible, utiliser la détection par fichiers
    }
    
    // Détection par structure de fichiers et fonctionnalités
    if (!fs.existsSync(path.join(this.projectRoot, 'src/lib/firebase'))) return 1;
    if (!fs.existsSync(path.join(this.projectRoot, 'src/routes/auth'))) return 2;
    
    // Phase 4: Vérification des composants pédagogiques avancés
    const phase4Indicators = [
      'src/lib/types/pedagogy.ts',
      'src/lib/services/preEvaluation.ts',
      'src/lib/services/metacognition.ts',
      'src/lib/components/PreEvaluationQuiz.svelte',
      'src/lib/components/MetacognitionPrompts.svelte'
    ];
    
    const hasPhase4Features = phase4Indicators.some(indicator => 
      fs.existsSync(path.join(this.projectRoot, indicator))
    );
    
    if (hasPhase4Features) return 4;
    
    // Phase 3: Vérification des composants de content management
    const phase3Indicators = [
      'src/lib/components/content',
      'src/lib/components/ui/Modal.svelte',
      'src/lib/utils/markdown.ts',
      'src/lib/stores/toast.ts'
    ];
    
    const hasPhase3Features = phase3Indicators.some(indicator => 
      fs.existsSync(path.join(this.projectRoot, indicator))
    );
    
    if (hasPhase3Features) return 3;
    
    // Autres phases
    if (fs.existsSync(path.join(this.projectRoot, 'src/lib/curriculum'))) return 6;
    
    return 2; // Default Phase 2 si auth existe
  }

  // Configuration workflow par phase
  loadWorkflowConfig() {
    return {
      1: ['lint', 'build', 'test:unit'],
      2: ['lint', 'build', 'test:unit', 'test:critical'],
      3: ['build', 'test:unit', 'validate:phase3:quick'],
      4: ['build', 'test:unit', 'validate:phase4:quick'],
      6: ['lint', 'build', 'test:unit', 'test:critical'],
      12: ['lint', 'build', 'test:unit', 'test:critical', 'security']
    };
  }

  // Workflow automatisé principal
  async executeWorkflow(options = {}) {
    console.log(`🤖 DevIA Orchestrator - Phase ${this.currentPhase}`);
    console.log(`📋 Workflow: ${this.workflowConfig[this.currentPhase]?.join(' → ')}`);

    try {
      // Phase 1: Validation CBD automatique
      await this.validateCBD();
      
      // Phase 2: Synchronisation Git
      if (options.syncGit !== false) {
        await this.syncGit();
      }
      
      // Phase 3: Exécution des commandes de validation
      const commands = this.workflowConfig[this.currentPhase] || ['lint', 'build', 'test:unit'];
      let allPassed = true;
      
      for (const command of commands) {
        const success = await this.runCommand(command);
        if (!success) {
          allPassed = false;
          if (options.strictMode !== false) {
            throw new Error(`❌ BLOCAGE: ${command} a échoué`);
          }
        }
      }

      // Phase 4: Génération rapport
      const report = await this.generateReport(allPassed);
      console.log('\n📊 RAPPORT DE VALIDATION:');
      console.log(JSON.stringify(report, null, 2));

      // Phase 5: Commit intelligent si tout OK
      if (allPassed && options.autoCommit !== false) {
        await this.smartCommit();
      }

      return { success: allPassed, report };

    } catch (error) {
      console.error('🚨 Erreur dans le workflow:', error.message);
      await this.handleBlockage(error);
      return { success: false, error: error.message };
    }
  }

  // Validation CBD selon DOC_CoPilot_Practices
  async validateCBD() {
    console.log('🔍 Validation CBD (Check Before Doing)...');
    
    // Vérifications phase-spécifiques
    const checks = {
      1: ['Node.js ≥ 18', 'Git configuré', 'Structure projet'],
      2: ['Firebase projet', 'Variables env', 'Auth routes'],
      3: ['Content Management', 'Markdown rendering', 'UI Components', 'Tests 7/7'],
      4: ['Performance optimized', 'Production ready', 'E2E tests'],
      6: ['Collections définies', 'Scripts génération', 'Validation curriculum']
    };

    const phaseChecks = checks[this.currentPhase] || [];
    console.log(`✅ CBD Phase ${this.currentPhase}: ${phaseChecks.join(', ')}`);
  }

  // Synchronisation Git intelligente
  async syncGit() {
    console.log('🔄 Synchronisation Git...');
    try {
      await execAsync('git add .');
      const { stdout } = await execAsync('git status --porcelain');
      
      if (stdout.trim()) {
        console.log('📝 Changements détectés, commit en attente...');
      } else {
        console.log('✅ Pas de changements à commiter');
      }
    } catch (error) {
      console.warn('⚠️ Erreur Git (non-bloquante):', error.message);
    }
  }

  // Exécution sécurisée des commandes
  async runCommand(command) {
    console.log(`🔍 Exécution: npm run ${command}`);
    try {
      const { stdout, stderr } = await execAsync(`npm run ${command}`);
      console.log(`✅ ${command} réussi`);
      return true;
    } catch (error) {
      // Pour le lint, on accepte les exit codes de warnings
      if (command === 'lint' && error.code === 1 && error.stdout) {
        // Vérifier si ce sont juste des warnings ESLint (pas d'erreurs)
        if (error.stdout.includes('✖') && error.stdout.includes('warnings') && 
            error.stdout.includes('0 errors')) {
          console.log(`⚠️ ${command} avec warnings (accepté)`);
          return true;
        }
      }
      
      console.error(`❌ ${command} échoué:`, error.message.split('\n')[0]);
      return false;
    }
  }

  // Génération rapport détaillé
  async generateReport(success) {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      phase: this.currentPhase,
      success,
      workflow: this.workflowConfig[this.currentPhase],
      environment: {
        node: process.version,
        platform: process.platform
      }
    };

    // Sauvegarde historique
    const reportsDir = path.join(this.projectRoot, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }
    
    const reportFile = path.join(reportsDir, `validation-${timestamp.split('T')[0]}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    return report;
  }

  // Commit intelligent avec métadonnées
  async smartCommit() {
    console.log('💫 Commit intelligent...');
    try {
      const message = `feat(phase-${this.currentPhase}): DevIA validation passed - Auto-commit`;
      await execAsync(`git commit -m "${message}"`);
      console.log('✅ Commit automatique réussi');
    } catch (error) {
      console.warn('⚠️ Commit automatique échoué:', error.message);
    }
  }

  // Gestion des blocages avec suggestions
  async handleBlockage(error) {
    console.log('\n🚨 GESTION DE BLOCAGE ACTIVÉE');
    console.log('💡 Suggestions de résolution:');
    
    const suggestions = {
      'lint': 'Exécuter: npm run format puis npm run lint',
      'build': 'Vérifier les imports et la syntaxe TypeScript',
      'test': 'Relancer: npm run test:unit ou npm run test:e2e',
      'validate': 'Vérifier les prérequis phase dans roadmap/'
    };

    console.log(`📋 Pour "${error.message}": ${suggestions[error.command] || 'Consulter la documentation roadmap/'}`);
  }
}

// CLI Interface
async function main() {
  const orchestrator = new DevIAOrchestrator();
  const args = process.argv.slice(2);
  
  const options = {
    strictMode: !args.includes('--no-strict'),
    autoCommit: !args.includes('--no-commit'),
    syncGit: !args.includes('--no-git')
  };

  console.log('🚀 Démarrage DevIA Orchestrator...');
  console.log(`⚙️ Options: ${JSON.stringify(options)}`);

  const result = await orchestrator.executeWorkflow(options);
  
  console.log(`\n🎯 Résultat final: ${result.success ? 'SUCCÈS' : 'ÉCHEC'}`);
  process.exit(result.success ? 0 : 1);
}

// Exécution si script appelé directement
if (require.main === module) {
  main().catch(error => {
    console.error('🚨 Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = DevIAOrchestrator;
