import { describe, it, expect, beforeEach } from 'vitest';
import { 
  generateCurriculum, 
  validateCurriculumData,
  sanitizeCurriculumInput,
  CurriculumSchema
} from '../../src/lib/curriculum/generator.js';

/**
 * 🧪 Tests TDD pour le système de génération de curriculum
 * Suivant DOC_CoPilot_Practices.md - Section TDD + Sécurité
 */

// Test data sécurisée et déterministe (pas de randomisation)
const validCurriculumConfig = {
  matiere: 'mathematiques',
  niveau: '6eme',
  competences: ['calcul-mental', 'geometrie-base'],
  difficulte: 'standard',
  dureeEstimee: 45,
  objectifs: ['Maîtriser les opérations de base', 'Comprendre les formes géométriques']
};

describe('Curriculum Generator - TDD Phase Rouge', () => {
  beforeEach(() => {
    // Reset state pour tests déterministes
  });

  describe('🔒 Validation et Sécurité (Zod + Sanitisation)', () => {
    it('should validate curriculum config with Zod schema', () => {
      // Test validation avec données valides
      const validation = CurriculumSchema.safeParse(validCurriculumConfig);
      expect(validation.success).toBe(true);
      
      if (validation.success) {
        expect(validation.data.matiere).toBe('mathematiques');
        expect(validation.data.niveau).toBe('6eme');
        expect(validation.data.competences).toHaveLength(2);
      }
    });

    it('should reject invalid curriculum data', () => {
      const invalidConfigs = [
        // Matière non autorisée
        { ...validCurriculumConfig, matiere: 'hacking101' },
        // Niveau invalide
        { ...validCurriculumConfig, niveau: 'niveau-inexistant' },
        // Compétences vides
        { ...validCurriculumConfig, competences: [] },
        // Durée négative
        { ...validCurriculumConfig, dureeEstimee: -10 }
        // Note: Objectifs avec scripts sera sanitisé, pas rejeté par validation
      ];

      invalidConfigs.forEach((config, index) => {
        const validation = CurriculumSchema.safeParse(config);
        expect(validation.success).toBe(false);
        console.log(`Invalid config ${index}:`, validation.success ? 'PASSED' : validation.error?.issues[0]?.message);
      });
    });

    it('should sanitize user inputs against XSS', () => {
      const maliciousInputs = [
        '<img src=x onerror=alert(1)>',
        'javascript:alert(1)',
        '${7*7}', // Template injection
        '\u0000', // Null byte injection
        '<script>document.cookie</script>',
        'onload=alert(document.domain)'
      ];

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeCurriculumInput(input);
        expect(sanitized).not.toContain('script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
        expect(sanitized).not.toContain('\u0000');
      });
    });

    it('should validate URL inputs for curriculum resources', () => {
      const testUrls = [
        { url: 'https://example.com/resource', shouldPass: true },
        { url: 'http://localhost:3000', shouldPass: false }, // HTTP localhost non sécurisé
        { url: 'javascript:alert(1)', shouldPass: false },
        { url: 'ftp://malicious.com', shouldPass: false },
        { url: 'https://' + 'a'.repeat(2048), shouldPass: false }, // URL trop longue
      ];

      testUrls.forEach(({ url, shouldPass }) => {
        const result = validateCurriculumData('resource_url', url);
        expect(result.success).toBe(shouldPass);
      });
    });
  });

  describe('📚 Génération de Curriculum (Logique Métier)', () => {
    it('should generate complete curriculum structure', async () => {
      const curriculum = await generateCurriculum(validCurriculumConfig);
      
      // Structure attendue
      expect(curriculum).toBeDefined();
      expect(curriculum.id).toMatch(/^curriculum_[a-zA-Z0-9]+$/);
      expect(curriculum.matiere).toBe('mathematiques');
      expect(curriculum.niveau).toBe('6eme');
      expect(curriculum.modules).toBeInstanceOf(Array);
      expect(curriculum.modules.length).toBeGreaterThan(0);
      
      // Chaque module doit avoir la structure requise
      curriculum.modules.forEach((module, index) => {
        expect(module.id).toMatch(/^module_\d+$/);
        expect(module.titre).toBeTruthy();
        expect(module.description).toBeTruthy();
        expect(module.competences).toBeInstanceOf(Array);
        expect(module.activites).toBeInstanceOf(Array);
        expect(module.evaluation).toBeDefined();
        expect(module.dureeEstimee).toBeGreaterThan(0);
        
        console.log(`Module ${index}: ${module.titre} (${module.dureeEstimee}min)`);
      });
    });

    it('should generate appropriate modules for skill level', async () => {
      const beginnerConfig = { ...validCurriculumConfig, difficulte: 'facile' };
      const advancedConfig = { ...validCurriculumConfig, difficulte: 'difficile' };
      
      const beginnerCurriculum = await generateCurriculum(beginnerConfig);
      const advancedCurriculum = await generateCurriculum(advancedConfig);
      
      // Le curriculum difficile devrait avoir plus de modules ou des activités plus complexes
      expect(advancedCurriculum.modules.length).toBeGreaterThanOrEqual(beginnerCurriculum.modules.length);
      
      // Vérification des niveaux de difficulté dans les activités
      const beginnerActivities = beginnerCurriculum.modules.flatMap(m => m.activites);
      const advancedActivities = advancedCurriculum.modules.flatMap(m => m.activites);
      
      expect(beginnerActivities.some(a => a.difficulte === 'facile')).toBe(true);
      expect(advancedActivities.some(a => a.difficulte === 'difficile')).toBe(true);
    });

    it('should include all requested competences', async () => {
      const curriculum = await generateCurriculum(validCurriculumConfig);
      
      const allCompetences = curriculum.modules.flatMap(m => m.competences);
      
      validCurriculumConfig.competences.forEach(competence => {
        expect(allCompetences).toContain(competence);
      });
    });

    it('should respect time constraints', async () => {
      const curriculum = await generateCurriculum(validCurriculumConfig);
      
      const totalDuration = curriculum.modules.reduce((total, module) => total + module.dureeEstimee, 0);
      
      // La durée totale ne devrait pas dépasser significativement la durée estimée
      expect(totalDuration).toBeLessThanOrEqual(validCurriculumConfig.dureeEstimee * 1.2);
      expect(totalDuration).toBeGreaterThanOrEqual(validCurriculumConfig.dureeEstimee * 0.8);
    });
  });

  describe('🛡️ Tests de Sécurité Avancés (Anti-Patterns)', () => {
    it('should prevent code injection in curriculum content', async () => {
      const maliciousConfig = {
        ...validCurriculumConfig,
        objectifs: [
          'Apprendre ${process.env.SECRET_KEY}',
          'Cours de `rm -rf /`',
          'Module eval("dangerous_code")'
        ]
      };

      // Ne doit pas lever d'exception mais sanitiser
      expect(async () => {
        await generateCurriculum(maliciousConfig);
      }).not.toThrow();

      const curriculum = await generateCurriculum(maliciousConfig);
      const allContent = JSON.stringify(curriculum);
      
      expect(allContent).not.toContain('process.env');
      expect(allContent).not.toContain('rm -rf');
      expect(allContent).not.toContain('eval(');
    });

    it('should handle edge cases gracefully', async () => {
      const edgeCases = [
        // Configuration minimale
        {
          matiere: 'mathematiques',
          niveau: '6eme',
          competences: ['calcul-mental'],
          difficulte: 'standard',
          dureeEstimee: 1, // Très courte durée
          objectifs: ['Test minimal']
        },
        // Très long curriculum
        {
          ...validCurriculumConfig,
          dureeEstimee: 500, // Très long
          competences: ['calcul-mental', 'geometrie-base', 'fractions', 'decimaux', 'mesures']
        }
      ];

      for (const config of edgeCases) {
        const curriculum = await generateCurriculum(config);
        expect(curriculum).toBeDefined();
        expect(curriculum.modules.length).toBeGreaterThan(0);
      }
    });

    it('should validate Firebase data structure before saving', () => {
      const testCurriculumData = {
        id: 'curriculum_test123',
        matiere: 'mathematiques',
        niveau: '6eme',
        modules: [
          {
            id: 'module_1',
            titre: 'Test Module',
            description: 'Description du module test',
            competences: ['test-competence'],
            activites: [],
            evaluation: { type: 'quiz', questions: [] },
            dureeEstimee: 30
          }
        ],
        metadonnees: {
          dateCreation: new Date(),
          version: '1.0.0',
          auteur: 'system'
        }
      };

      const validation = validateCurriculumData('curriculums', testCurriculumData);
      
      // Debug en cas d'échec
      if (!validation.success) {
        console.log('Validation error:', validation.error);
        console.log('Test data structure:', JSON.stringify(testCurriculumData, null, 2));
      }
      
      expect(validation.success).toBe(true);
    });
  });

  describe('⚡ Tests de Performance et Edge Cases', () => {
    it('should generate curriculum within reasonable time', async () => {
      const startTime = Date.now();
      
      await generateCurriculum(validCurriculumConfig);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Génération ne doit pas prendre plus de 2 secondes
      expect(duration).toBeLessThan(2000);
    });

    it('should handle concurrent generation requests', async () => {
      const configs = Array(5).fill(0).map((_, i) => ({
        ...validCurriculumConfig,
        matiere: i % 2 === 0 ? 'mathematiques' : 'francais'
      }));

      const promises = configs.map(config => generateCurriculum(config));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(curriculum => {
        expect(curriculum).toBeDefined();
        expect(curriculum.modules.length).toBeGreaterThan(0);
      });
    });
  });
});

/**
 * 🔍 Tests d'auto-critique IA - Vérification des biais potentiels
 * Comme recommandé dans DOC_CoPilot_Practices.md
 */
describe('🤖 Anti-Bias IA Tests - Auto-Critique', () => {
  it('should not favor popular subjects over others', async () => {
    const subjects = ['mathematiques', 'francais', 'sciences', 'histoire'];
    const curriculums = await Promise.all(
      subjects.map(matiere => 
        generateCurriculum({ ...validCurriculumConfig, matiere })
      )
    );

    // Tous les sujets devraient avoir un nombre similaire de modules
    const moduleCounts = curriculums.map(c => c.modules.length);
    const maxCount = Math.max(...moduleCounts);
    const minCount = Math.min(...moduleCounts);
    
    // Écart ne doit pas être trop important (biais de popularité)
    expect(maxCount - minCount).toBeLessThanOrEqual(2);
  });

  it('should generate diverse activity types', async () => {
    const curriculum = await generateCurriculum(validCurriculumConfig);
    
    const activityTypes = curriculum.modules
      .flatMap(m => m.activites)
      .map(a => a.type);
    
    const uniqueTypes = [...new Set(activityTypes)];
    
    // Doit proposer au moins 3 types d'activités différents
    expect(uniqueTypes.length).toBeGreaterThanOrEqual(3);
    expect(uniqueTypes).toContain('exercice');
    expect(uniqueTypes).toContain('quiz');
  });
});
