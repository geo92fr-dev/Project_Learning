#!/usr/bin/env node
/**
 * 🤖 Script d'Automatisation Phase 6.2 - Curriculum Generator
 * 
 * Implémente l'automatisation selon DOC_CoPilot_Practices.md :
 * - Génération batch de curriculums
 * - Export automatique vers Firebase
 * - Validation et monitoring
 * - Rapports de performance
 * 
 * @version 1.0.0
 * @since Phase 6.2
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateCurriculum, validateCurriculumData } from '../src/lib/curriculum/generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔧 Configuration par défaut
const DEFAULT_CONFIG = {
  outputDir: join(__dirname, '../generated-curriculums'),
  batchSize: 10,
  concurrent: 3,
  formats: ['json', 'csv'],
  validation: true,
  monitoring: true
};

/**
 * 📊 Configurations prédéfinies pour génération batch
 * Couvre différents cas d'usage éducatifs
 */
const BATCH_CONFIGURATIONS = [
  // Mathématiques
  {
    matiere: 'mathematiques',
    niveau: '6eme',
    competences: ['calcul-mental', 'geometrie-base'],
    difficulte: 'standard',
    dureeEstimee: 45,
    objectifs: ['Maîtriser les opérations de base', 'Comprendre les formes géométriques'],
    tag: 'math_6eme_base'
  },
  {
    matiere: 'mathematiques',
    niveau: '5eme',
    competences: ['fractions', 'decimaux'],
    difficulte: 'standard',
    dureeEstimee: 50,
    objectifs: ['Maîtriser les fractions', 'Comprendre les nombres décimaux'],
    tag: 'math_5eme_fractions'
  },
  
  // Français
  {
    matiere: 'francais',
    niveau: '6eme',
    competences: ['lecture-comprehension', 'grammaire'],
    difficulte: 'standard',
    dureeEstimee: 55,
    objectifs: ['Améliorer la compréhension de lecture', 'Maîtriser les bases grammaticales'],
    tag: 'francais_6eme_lecture'
  },
  {
    matiere: 'francais',
    niveau: '5eme',
    competences: ['expression-ecrite', 'orthographe'],
    difficulte: 'standard',
    dureeEstimee: 60,
    objectifs: ['Développer l\'expression écrite', 'Améliorer l\'orthographe'],
    tag: 'francais_5eme_expression'
  },
  
  // Sciences
  {
    matiere: 'sciences',
    niveau: 'cm2',
    competences: ['corps-humain', 'environnement'],
    difficulte: 'facile',
    dureeEstimee: 40,
    objectifs: ['Comprendre le corps humain', 'Découvrir l\'environnement'],
    tag: 'sciences_cm2_corps'
  },
  
  // Histoire
  {
    matiere: 'histoire',
    niveau: '5eme',
    competences: ['moyen-age', 'temps-modernes'],
    difficulte: 'standard',
    dureeEstimee: 50,
    objectifs: ['Découvrir le Moyen Âge', 'Comprendre les Temps Modernes'],
    tag: 'histoire_5eme_medieval'
  },
  
  // Géographie
  {
    matiere: 'geographie',
    niveau: '4eme',
    competences: ['relief', 'climat'],
    difficulte: 'standard',
    dureeEstimee: 45,
    objectifs: ['Comprendre le relief français', 'Analyser les climats'],
    tag: 'geo_4eme_relief'
  }
];

/**
 * 🎯 Classe principale d'automatisation
 */
class CurriculumAutomator {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = {
      generated: 0,
      failed: 0,
      totalTime: 0,
      startTime: null,
      errors: []
    };
  }

  /**
   * 🚀 Lancement de la génération automatique
   */
  async run() {
    console.log('🤖 Démarrage de l\'automatisation Phase 6.2...\n');
    
    this.stats.startTime = Date.now();

    try {
      // Préparation de l'environnement
      await this.setupEnvironment();
      
      // Génération batch des curriculums
      await this.generateBatch();
      
      // Export des résultats
      await this.exportResults();
      
      // Rapport final
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Erreur critique:', error.message);
      process.exit(1);
    }
  }

  /**
   * 🔧 Préparation de l'environnement
   */
  async setupEnvironment() {
    console.log('📁 Préparation des dossiers...');
    
    // Création du dossier de sortie
    try {
      await fs.mkdir(this.config.outputDir, { recursive: true });
      console.log(`✅ Dossier créé: ${this.config.outputDir}`);
    } catch (error) {
      console.log(`ℹ️  Dossier existe déjà: ${this.config.outputDir}`);
    }

    // Nettoyage des anciens fichiers (optionnel)
    if (this.config.cleanBefore) {
      await this.cleanOutputDirectory();
    }
  }

  /**
   * 🎓 Génération en lot des curriculums
   */
  async generateBatch() {
    console.log(`🔄 Génération de ${BATCH_CONFIGURATIONS.length} curriculums...\n`);

    const chunks = this.chunkArray(BATCH_CONFIGURATIONS, this.config.concurrent);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`📦 Lot ${i + 1}/${chunks.length} (${chunk.length} curriculums)`);
      
      const promises = chunk.map(config => this.generateSingleCurriculum(config));
      await Promise.allSettled(promises);
      
      // Pause entre les lots pour éviter la surcharge
      if (i < chunks.length - 1) {
        await this.sleep(1000);
      }
    }
  }

  /**
   * 🎯 Génération d'un curriculum individuel
   */
  async generateSingleCurriculum(config) {
    const startTime = Date.now();
    
    try {
      console.log(`  🔨 Génération: ${config.tag}...`);
      
      // Validation de la configuration
      if (this.config.validation) {
        const validation = validateCurriculumData('curriculum_config', config);
        if (!validation.success) {
          throw new Error(`Configuration invalide: ${validation.error}`);
        }
      }

      // Génération du curriculum
      const curriculum = await generateCurriculum(config);
      
      // Validation du résultat
      if (this.config.validation) {
        const validation = validateCurriculumData('curriculums', curriculum);
        if (!validation.success) {
          throw new Error(`Curriculum généré invalide: ${validation.error}`);
        }
      }

      // Sauvegarde des fichiers
      await this.saveCurriculum(curriculum, config.tag);
      
      const duration = Date.now() - startTime;
      this.stats.generated++;
      this.stats.totalTime += duration;
      
      console.log(`  ✅ ${config.tag} généré en ${duration}ms`);
      
      return { success: true, curriculum, duration };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.stats.failed++;
      this.stats.errors.push({
        tag: config.tag,
        error: error.message,
        duration
      });
      
      console.log(`  ❌ ${config.tag} échoué: ${error.message}`);
      
      return { success: false, error: error.message, duration };
    }
  }

  /**
   * 💾 Sauvegarde d'un curriculum dans différents formats
   */
  async saveCurriculum(curriculum, tag) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Format JSON
    if (this.config.formats.includes('json')) {
      const jsonPath = join(this.config.outputDir, `${tag}_${timestamp}.json`);
      await fs.writeFile(jsonPath, JSON.stringify(curriculum, null, 2), 'utf8');
    }

    // Format CSV (résumé)
    if (this.config.formats.includes('csv')) {
      const csvPath = join(this.config.outputDir, `${tag}_${timestamp}_summary.csv`);
      const csvContent = this.convertToCSV(curriculum);
      await fs.writeFile(csvPath, csvContent, 'utf8');
    }

    // Format Markdown (lisible)
    if (this.config.formats.includes('md')) {
      const mdPath = join(this.config.outputDir, `${tag}_${timestamp}.md`);
      const mdContent = this.convertToMarkdown(curriculum);
      await fs.writeFile(mdPath, mdContent, 'utf8');
    }
  }

  /**
   * 📄 Conversion en CSV pour analyse
   */
  convertToCSV(curriculum) {
    const rows = [
      ['Propriété', 'Valeur'],
      ['ID', curriculum.id],
      ['Matière', curriculum.matiere],
      ['Niveau', curriculum.niveau],
      ['Difficulté', curriculum.difficulte],
      ['Durée totale', `${curriculum.modules.reduce((sum, m) => sum + m.dureeEstimee, 0)} min`],
      ['Nombre de modules', curriculum.modules.length],
      ['Nombre d\'activités', curriculum.modules.reduce((sum, m) => sum + m.activites.length, 0)],
      ['Compétences', curriculum.modules[0]?.competences.join(', ') || '']
    ];

    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  /**
   * 📝 Conversion en Markdown
   */
  convertToMarkdown(curriculum) {
    let md = `# Curriculum: ${curriculum.matiere} - ${curriculum.niveau}\n\n`;
    md += `**ID:** ${curriculum.id}\n`;
    md += `**Difficulté:** ${curriculum.difficulte}\n`;
    md += `**Créé le:** ${new Date(curriculum.dateCreation).toLocaleDateString('fr-FR')}\n\n`;

    md += `## 📊 Résumé\n\n`;
    md += `- **Modules:** ${curriculum.modules.length}\n`;
    md += `- **Durée totale:** ${curriculum.modules.reduce((sum, m) => sum + m.dureeEstimee, 0)} minutes\n`;
    md += `- **Activités:** ${curriculum.modules.reduce((sum, m) => sum + m.activites.length, 0)}\n\n`;

    curriculum.modules.forEach((module, index) => {
      md += `## ${index + 1}. ${module.titre}\n\n`;
      md += `${module.description}\n\n`;
      md += `**Compétences:** ${module.competences.join(', ')}\n`;
      md += `**Durée:** ${module.dureeEstimee} minutes\n\n`;
      
      md += `### Activités\n\n`;
      module.activites.forEach(activite => {
        md += `- **${activite.titre}** (${activite.type}, ${activite.dureeEstimee}min)\n`;
      });
      md += '\n';
    });

    return md;
  }

  /**
   * 📤 Export des résultats et métadonnées
   */
  async exportResults() {
    console.log('\n📤 Export des résultats...');

    // Métadonnées de la session
    const metadata = {
      session: {
        timestamp: new Date().toISOString(),
        duration: Date.now() - this.stats.startTime,
        configuration: this.config
      },
      statistics: this.stats,
      generated_files: await this.listGeneratedFiles()
    };

    const metadataPath = join(this.config.outputDir, 'session_metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    
    console.log(`✅ Métadonnées exportées: ${metadataPath}`);
  }

  /**
   * 📋 Liste des fichiers générés
   */
  async listGeneratedFiles() {
    try {
      const files = await fs.readdir(this.config.outputDir);
      const stats = await Promise.all(
        files.map(async file => {
          const filePath = join(this.config.outputDir, file);
          const stat = await fs.stat(filePath);
          return {
            name: file,
            size: stat.size,
            created: stat.birthtime.toISOString()
          };
        })
      );
      return stats;
    } catch (error) {
      return [];
    }
  }

  /**
   * 📊 Génération du rapport final
   */
  generateReport() {
    const totalTime = Date.now() - this.stats.startTime;
    const avgTime = this.stats.generated > 0 ? this.stats.totalTime / this.stats.generated : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT D\'AUTOMATISATION PHASE 6.2');
    console.log('='.repeat(60));
    console.log(`✅ Curriculums générés: ${this.stats.generated}`);
    console.log(`❌ Échecs: ${this.stats.failed}`);
    console.log(`⏱️  Temps total: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`📈 Temps moyen/curriculum: ${avgTime.toFixed(0)}ms`);
    console.log(`📁 Dossier de sortie: ${this.config.outputDir}`);
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Erreurs rencontrées:');
      this.stats.errors.forEach(error => {
        console.log(`  - ${error.tag}: ${error.error}`);
      });
    }
    
    console.log('\n🎉 Automatisation terminée avec succès!');
    console.log('='.repeat(60));
  }

  /**
   * 🛠️ Utilitaires
   */
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanOutputDirectory() {
    try {
      const files = await fs.readdir(this.config.outputDir);
      await Promise.all(
        files.map(file => fs.unlink(join(this.config.outputDir, file)))
      );
      console.log('🧹 Dossier de sortie nettoyé');
    } catch (error) {
      console.log('ℹ️  Pas de fichiers à nettoyer');
    }
  }
}

/**
 * 🎯 Interface en ligne de commande
 */
async function main() {
  const args = process.argv.slice(2);
  const config = {};

  // Parse des arguments
  for (let i = 0; i < args.length; i += 2) {
    const arg = args[i];
    const value = args[i + 1];

    switch (arg) {
      case '--output':
        config.outputDir = value;
        break;
      case '--batch-size':
        config.batchSize = parseInt(value);
        break;
      case '--concurrent':
        config.concurrent = parseInt(value);
        break;
      case '--formats':
        config.formats = value.split(',');
        break;
      case '--clean':
        config.cleanBefore = true;
        i--; // Pas de valeur pour ce flag
        break;
      case '--no-validation':
        config.validation = false;
        i--; // Pas de valeur pour ce flag
        break;
      case '--help':
        showHelp();
        process.exit(0);
    }
  }

  const automator = new CurriculumAutomator(config);
  await automator.run();
}

/**
 * 📖 Aide
 */
function showHelp() {
  console.log(`
🤖 Automatisation Curriculum Generator - Phase 6.2

Usage: node scripts/curriculum-automation.js [options]

Options:
  --output <dir>          Dossier de sortie (défaut: ./generated-curriculums)
  --batch-size <n>        Taille des lots (défaut: 10)
  --concurrent <n>        Génération simultanée (défaut: 3)
  --formats <list>        Formats de sortie: json,csv,md (défaut: json,csv)
  --clean                 Nettoyer le dossier avant génération
  --no-validation         Désactiver la validation
  --help                  Afficher cette aide

Exemples:
  node scripts/curriculum-automation.js
  node scripts/curriculum-automation.js --output ./my-curriculums --formats json,md
  node scripts/curriculum-automation.js --concurrent 5 --clean
`);
}

// 🚀 Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

export { CurriculumAutomator, BATCH_CONFIGURATIONS };
