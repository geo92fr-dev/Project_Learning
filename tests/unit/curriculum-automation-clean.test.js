/**
 * Tests d'Automatisation Phase 6.2 - TDD Refactoring
 * 
 * Validation complete du systeme d'automatisation selon DOC_CoPilot_Practices.md
 * Tests de performance, fiabilite et securite
 * 
 * @version 1.0.0
 * @since Phase 6.2 - Refactoring TDD
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { CurriculumAutomator, BATCH_CONFIGURATIONS } from '../../scripts/curriculum-automation.js';

describe('Automatisation Curriculum - Phase 6.2 TDD', () => {
  let tempDir;
  let automator;

  beforeEach(async () => {
    // Creation d'un dossier temporaire pour les tests
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
    // Nettoyage apres chaque test
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore les erreurs de nettoyage
    }
  });

  describe('Configuration et Initialisation', () => {
    test('devrait creer une instance avec configuration par defaut', () => {
      const defaultAutomator = new CurriculumAutomator();
      
      expect(defaultAutomator.config).toBeDefined();
      expect(defaultAutomator.config.batchSize).toBe(10);
      expect(defaultAutomator.config.concurrent).toBe(3);
      expect(defaultAutomator.config.formats).toContain('json');
      expect(defaultAutomator.stats).toBeDefined();
    });

    test('devrait fusionner correctement les configurations personnalisees', () => {
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

  describe('Gestion des Fichiers et Dossiers', () => {
    test('devrait creer le dossier de sortie', async () => {
      await automator.setupEnvironment();
      
      const stats = await fs.stat(tempDir);
      expect(stats.isDirectory()).toBe(true);
    });

    test('devrait gerer les dossiers existants sans erreur', async () => {
      // Creer le dossier avant
      await fs.mkdir(tempDir, { recursive: true });
      
      // Ne devrait pas lever d'erreur
      await expect(automator.setupEnvironment()).resolves.not.toThrow();
    });

    test('devrait lister correctement les fichiers generes', async () => {
      // Creer quelques fichiers de test
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

  describe('Generation de Curriculums', () => {
    test('devrait generer un curriculum individuel avec succes', async () => {
      const config = BATCH_CONFIGURATIONS[0]; // Premier curriculum de test
      
      const result = await automator.generateSingleCurriculum(config);
      
      expect(result.success).toBe(true);
      expect(result.curriculum).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(automator.stats.generated).toBe(1);
      expect(automator.stats.failed).toBe(0);
    });

    test('devrait gerer les erreurs de generation gracieusement', async () => {
      const invalidConfig = {
        matiere: 'matiere_invalide', // Matiere non supportee
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

    test('devrait respecter la validation des donnees', async () => {
      const config = {
        matiere: 'mathematiques',
        niveau: '6eme',
        competences: ['calcul-mental'],
        difficulte: 'standard',
        dureeEstimee: -10, // Duree invalide
        objectifs: ['Test'],
        tag: 'test_validation'
      };
      
      const result = await automator.generateSingleCurriculum(config);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('invalide');
    });
  });

  describe('Sauvegarde et Formats', () => {
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
      
      // Verifier le contenu
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
          activites: [1, 2, 3] // 3 activites
        }],
        dateCreation: new Date().toISOString()
      };
      
      await automator.saveCurriculum(curriculum, 'test-csv');
      
      const files = await fs.readdir(tempDir);
      const csvFiles = files.filter(f => f.endsWith('.csv'));
      
      expect(csvFiles.length).toBeGreaterThan(0);
      
      const csvContent = await fs.readFile(join(tempDir, csvFiles[0]), 'utf8');
      expect(csvContent).toContain('Propriete,Valeur');
      expect(csvContent).toContain('test-curriculum');
      expect(csvContent).toContain('mathematiques');
    });
  });

  describe('Performance et Monitoring', () => {
    test('devrait mesurer correctement les temps de generation', async () => {
      const config = BATCH_CONFIGURATIONS[0];
      
      const startTime = Date.now();
      await automator.generateSingleCurriculum(config);
      const endTime = Date.now();
      
      expect(automator.stats.totalTime).toBeGreaterThan(0);
      expect(automator.stats.totalTime).toBeLessThan(endTime - startTime + 100); // Marge d'erreur
    });

    test('devrait generer des metadonnees de session completes', async () => {
      automator.stats.startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 10)); // Petit delai
      
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
  });

  describe('Utilitaires', () => {
    test('devrait diviser correctement un tableau en chunks', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const chunks = automator.chunkArray(array, 3);
      
      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toEqual([1, 2, 3]);
      expect(chunks[1]).toEqual([4, 5, 6]);
      expect(chunks[2]).toEqual([7]);
    });

    test('devrait implementer sleep correctement', async () => {
      const startTime = Date.now();
      await automator.sleep(100);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(90); // Marge pour les variations systeme
    });
  });

  describe('Securite et Validation', () => {
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

    test('devrait valider tous les inputs avant generation', async () => {
      const invalidInputs = [
        { dureeEstimee: -1 }, // Duree negative
        { competences: [] }, // Pas de competences
        { objectifs: [] }, // Pas d'objectifs
        { matiere: '' } // Matiere vide
      ];
      
      for (const invalidInput of invalidInputs) {
        const config = { ...BATCH_CONFIGURATIONS[0], ...invalidInput };
        const result = await automator.generateSingleCurriculum(config);
        
        expect(result.success).toBe(false);
      }
    });
  });
});
