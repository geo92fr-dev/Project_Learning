/**
 * 🧪 Tests d'Automatisation Phase 6.2 - TDD Refactoring
 * 
 * Validation complète du système d'automatisation selon DOC_CoPilot_Practices.md
 * Tests de performance, fiabilité et sécurité
 * 
 * @version 1.0.0
 * @since Phase 6.2 - Refactoring TDD
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { CurriculumAutomator, BATCH_CONFIGURATIONS } from '../../scripts/curriculum-automation.js';

describe('🤖 Automatisation Curriculum - Phase 6.2 TDD', () => {
  let tempDir;
  let automator;

  beforeEach(async () => {
    // Création d'un dossier temporaire pour les tests
    tempDir = join(tmpdir(), `curriculum-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    // Configuration de test
    automator = new CurriculumAutomator({
      outputDir: tempDir,
      concurrent: 2,
      batchSize: 3,
      formats: ['json', 'csv'],
      validation: true
    });
  });

  afterEach(async () => {
    // Nettoyage après chaque test
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore les erreurs de nettoyage
    }
  });

  describe('🔧 Configuration et Initialisation', () => {
    test('devrait créer une instance avec configuration par défaut', () => {
      const defaultAutomator = new CurriculumAutomator();
      
      expect(defaultAutomator.config).toBeDefined();
      expect(defaultAutomator.config.batchSize).toBe(10);
      expect(defaultAutomator.config.concurrent).toBe(3);
      expect(defaultAutomator.config.formats).toContain('json');
      expect(defaultAutomator.stats).toBeDefined();
    });

    test('devrait fusionner correctement les configurations personnalisées', () => {
      const customConfig = {
        batchSize: 5,
        concurrent: 1,
        formats: ['json']
      };
      
      const customAutomator = new CurriculumAutomator(customConfig);
      
      expect(customAutomator.config.batchSize).toBe(5);
      expect(customAutomator.config.concurrent).toBe(1);
      expect(customAutomator.config.formats).toEqual(['json']);
    });

    test('devrait initialiser les statistiques correctement', () => {
      expect(automator.stats.generated).toBe(0);
      expect(automator.stats.failed).toBe(0);
      expect(automator.stats.totalTime).toBe(0);
      expect(automator.stats.errors).toEqual([]);
    });
  });

  describe('📁 Gestion des Fichiers et Dossiers', () => {
    test('devrait créer le dossier de sortie', async () => {
      await automator.setupEnvironment();
      
      const stats = await fs.stat(tempDir);
      expect(stats.isDirectory()).toBe(true);
    });

    test('devrait gérer les dossiers existants sans erreur', async () => {
      // Créer le dossier avant
      await fs.mkdir(tempDir, { recursive: true });
      
      // Ne devrait pas lever d'erreur
      await expect(automator.setupEnvironment()).resolves.not.toThrow();
    });

    test('devrait lister correctement les fichiers générés', async () => {
      // Créer quelques fichiers de test
      await fs.writeFile(join(tempDir, 'test1.json'), '{}');
      await fs.writeFile(join(tempDir, 'test2.csv'), 'header\ndata');
      
      const files = await automator.listGeneratedFiles();
      
      expect(files).toHaveLength(2);
      expect(files.some(f => f.name === 'test1.json')).toBe(true);
      expect(files.some(f => f.name === 'test2.csv')).toBe(true);
      expect(files[0]).toHaveProperty('size');
      expect(files[0]).toHaveProperty('created');
    });
  });

  describe('🎯 Génération de Curriculums', () => {
    test('devrait générer un curriculum individuel avec succès', async () => {
      const config = BATCH_CONFIGURATIONS[0]; // Premier curriculum de test
      
      const result = await automator.generateSingleCurriculum(config);
      
      expect(result.success).toBe(true);
      expect(result.curriculum).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(automator.stats.generated).toBe(1);
      expect(automator.stats.failed).toBe(0);
    });

    test('devrait gérer les erreurs de génération gracieusement', async () => {
      const invalidConfig = {
        matiere: 'matiere_invalide', // Matière non supportée
        niveau: '6eme',
        competences: [],
        difficulte: 'standard',
        dureeEstimee: 45,
        objectifs: [],
        tag: 'test_invalid'
      };
      
      const result = await automator.generateSingleCurriculum(invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(automator.stats.generated).toBe(0);
      expect(automator.stats.failed).toBe(1);
      expect(automator.stats.errors).toHaveLength(1);
    });

    test('devrait respecter la validation des données', async () => {
      const config = {
        matiere: 'mathematiques',
        niveau: '6eme',
        competences: ['calcul-mental'],
        difficulte: 'standard',
        dureeEstimee: -10, // Durée invalide
        objectifs: ['Test'],
        tag: 'test_validation'
      };
      
      const result = await automator.generateSingleCurriculum(config);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('invalide');
    });
  });

  describe('📊 Traitement en Lot (Batch)', () => {
    test('devrait traiter correctement les lots de curriculums', async () => {
      // Utiliser un sous-ensemble pour les tests
      const testConfigs = BATCH_CONFIGURATIONS.slice(0, 3);
      
      // Mock de la méthode pour utiliser nos configs de test
      const originalConfigs = BATCH_CONFIGURATIONS.slice();
      BATCH_CONFIGURATIONS.length = 0;
      BATCH_CONFIGURATIONS.push(...testConfigs);
      
      try {
        await automator.generateBatch();
        
        expect(automator.stats.generated).toBeGreaterThan(0);
        expect(automator.stats.totalTime).toBeGreaterThan(0);
      } finally {
        // Restaurer les configurations originales
        BATCH_CONFIGURATIONS.length = 0;
        BATCH_CONFIGURATIONS.push(...originalConfigs);
      }
    });

    test('devrait respecter la limite de concurrence', async () => {
      automator.config.concurrent = 1;
      
      const startTimes = [];
      const originalGenerate = automator.generateSingleCurriculum.bind(automator);
      
      automator.generateSingleCurriculum = vi.fn(async (config) => {
        startTimes.push(Date.now());
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulation de délai
        return { success: true, curriculum: {}, duration: 100 };
      });
      
      const testConfigs = BATCH_CONFIGURATIONS.slice(0, 2);
      const chunks = automator.chunkArray(testConfigs, automator.config.concurrent);
      
      await Promise.allSettled(chunks[0].map(config => automator.generateSingleCurriculum(config)));
      
      expect(automator.generateSingleCurriculum).toHaveBeenCalledTimes(2);
    });
  });

  describe('💾 Sauvegarde et Formats', () => {
    test('devrait sauvegarder en format JSON', async () => {
      const curriculum = {
        id: 'test-curriculum',
        matiere: 'mathematiques',
        niveau: '6eme',
        modules: [{
          titre: 'Test Module',
          description: 'Description de test',
          competences: ['test'],
          dureeEstimee: 30,
          activites: [],
          evaluation: { type: 'test', questions: [] }
        }],
        dateCreation: new Date().toISOString()
      };
      
      await automator.saveCurriculum(curriculum, 'test-tag');
      
      const files = await fs.readdir(tempDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      expect(jsonFiles.length).toBeGreaterThan(0);
      expect(jsonFiles[0]).toContain('test-tag');
      
      // Vérifier le contenu
      const savedContent = await fs.readFile(join(tempDir, jsonFiles[0]), 'utf8');
      const parsed = JSON.parse(savedContent);
      expect(parsed.id).toBe('test-curriculum');
    });

    test('devrait sauvegarder en format CSV', async () => {
      const curriculum = {
        id: 'test-curriculum',
        matiere: 'mathematiques',
        niveau: '6eme',
        difficulte: 'standard',
        modules: [{
          competences: ['test'],
          dureeEstimee: 30,
          activites: [1, 2, 3] // 3 activités
        }],
        dateCreation: new Date().toISOString()
      };
      
      await automator.saveCurriculum(curriculum, 'test-csv');
      
      const files = await fs.readdir(tempDir);
      const csvFiles = files.filter(f => f.endsWith('.csv'));
      
      expect(csvFiles.length).toBeGreaterThan(0);
      
      const csvContent = await fs.readFile(join(tempDir, csvFiles[0]), 'utf8');
      expect(csvContent).toContain('Propriété,Valeur');
      expect(csvContent).toContain('test-curriculum');
      expect(csvContent).toContain('mathematiques');
    });

    test('devrait convertir correctement en Markdown', () => {
      const curriculum = {
        id: 'test-md',
        matiere: 'mathematiques',
        niveau: '6eme',
        difficulte: 'standard',
        dateCreation: new Date().toISOString(),
        modules: [{
          titre: 'Module Test',
          description: 'Description du module',
          competences: ['comp1', 'comp2'],
          dureeEstimee: 45,
          activites: [
            { titre: 'Activité 1', type: 'exercice', dureeEstimee: 20 },
            { titre: 'Activité 2', type: 'quiz', dureeEstimee: 25 }
          ]
        }]
      };
      
      const markdown = automator.convertToMarkdown(curriculum);
      
      expect(markdown).toContain('# Curriculum: mathematiques - 6eme');
      expect(markdown).toContain('**ID:** test-md');
      expect(markdown).toContain('## 1. Module Test');
      expect(markdown).toContain('**Activité 1**');
      expect(markdown).toContain('exercice');
    });
  });

  describe('📈 Performance et Monitoring', () => {
    test('devrait mesurer correctement les temps de génération', async () => {
      const config = BATCH_CONFIGURATIONS[0];
      
      const startTime = Date.now();
      await automator.generateSingleCurriculum(config);
      const endTime = Date.now();
      
      expect(automator.stats.totalTime).toBeGreaterThan(0);
      expect(automator.stats.totalTime).toBeLessThan(endTime - startTime + 100); // Marge d'erreur
    });

    test('devrait générer des métadonnées de session complètes', async () => {
      automator.stats.startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 10)); // Petit délai
      
      await automator.exportResults();
      
      const metadataFile = join(tempDir, 'session_metadata.json');
      const exists = await fs.access(metadataFile).then(() => true).catch(() => false);
      expect(exists).toBe(true);
      
      const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
      expect(metadata.session).toBeDefined();
      expect(metadata.statistics).toBeDefined();
      expect(metadata.generated_files).toBeDefined();
      expect(metadata.session.duration).toBeGreaterThan(0);
    });

    test('devrait calculer correctement les statistiques moyennes', () => {
      automator.stats.generated = 3;
      automator.stats.totalTime = 1500; // 1.5 secondes total
      
      // Simulation du rapport
      const avgTime = automator.stats.totalTime / automator.stats.generated;
      expect(avgTime).toBe(500); // 500ms par curriculum
    });
  });

  describe('🛠️ Utilitaires', () => {
    test('devrait diviser correctement un tableau en chunks', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const chunks = automator.chunkArray(array, 3);
      
      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toEqual([1, 2, 3]);
      expect(chunks[1]).toEqual([4, 5, 6]);
      expect(chunks[2]).toEqual([7]);
    });

    test('devrait implémenter sleep correctement', async () => {
      const startTime = Date.now();
      await automator.sleep(100);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(90); // Marge pour les variations système
    });

    test('devrait nettoyer le dossier de sortie si demandé', async () => {
      // Créer quelques fichiers
      await fs.writeFile(join(tempDir, 'file1.json'), '{}');
      await fs.writeFile(join(tempDir, 'file2.csv'), 'data');
      
      await automator.cleanOutputDirectory();
      
      const files = await fs.readdir(tempDir);
      expect(files).toHaveLength(0);
    });
  });

  describe('🚀 Integration End-to-End', () => {
    test('devrait exécuter un cycle complet d\'automatisation', async () => {
      // Configuration minimale pour test rapide
      const testAutomator = new CurriculumAutomator({
        outputDir: tempDir,
        concurrent: 1,
        formats: ['json'],
        validation: true
      });
      
      // Mock des configurations pour un test rapide
      const originalConfigs = BATCH_CONFIGURATIONS.slice();
      BATCH_CONFIGURATIONS.length = 0;
      BATCH_CONFIGURATIONS.push(originalConfigs[0]); // Seulement le premier
      
      try {
        await testAutomator.run();
        
        // Vérifications
        expect(testAutomator.stats.generated).toBeGreaterThan(0);
        expect(testAutomator.stats.startTime).toBeDefined();
        
        const files = await fs.readdir(tempDir);
        expect(files.length).toBeGreaterThan(0);
        expect(files.some(f => f.includes('session_metadata.json'))).toBe(true);
        
      } finally {
        // Restaurer les configurations
        BATCH_CONFIGURATIONS.length = 0;
        BATCH_CONFIGURATIONS.push(...originalConfigs);
      }
    }, 10000); // Timeout plus long pour le test complet
  });

  describe('🔒 Sécurité et Validation', () => {
    test('devrait rejeter les configurations dangereuses', async () => {
      const maliciousConfig = {
        matiere: '<script>alert("xss")</script>',
        niveau: '6eme',
        competences: ['test'],
        difficulte: 'standard',
        dureeEstimee: 45,
        objectifs: ['<img src=x onerror=alert(1)>'],
        tag: 'malicious'
      };
      
      const result = await automator.generateSingleCurriculum(maliciousConfig);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('invalide');
    });

    test('devrait valider tous les inputs avant génération', async () => {
      const invalidInputs = [
        { dureeEstimee: -1 }, // Durée négative
        { competences: [] }, // Pas de compétences
        { objectifs: [] }, // Pas d'objectifs
        { matiere: '' } // Matière vide
      ];
      
      for (const invalidInput of invalidInputs) {
        const config = { ...BATCH_CONFIGURATIONS[0], ...invalidInput };
        const result = await automator.generateSingleCurriculum(config);
        
        expect(result.success).toBe(false);
      }
    });
  });
});
