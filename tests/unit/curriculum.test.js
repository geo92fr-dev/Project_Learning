// 🧪 Tests du Système de Curriculum Generation - Phase 6
// Tests complets pour valider l'architecture et le fonctionnement

import { describe, test, expect, beforeEach } from 'vitest';
import { KnowledgeGraph, RecommendationEngine, curriculumEngine } from '$lib/curriculum/engine.js';
import { mathematiques6eme, validationFunctions } from '$lib/curriculum/data/mathematiques-6eme.js';

describe('🤖 Curriculum Generation Engine', () => {
  
  describe('📊 KnowledgeGraph', () => {
    let graph;
    
    beforeEach(() => {
      graph = new KnowledgeGraph();
    });

    test('devrait créer un graphe vide', () => {
      expect(graph.nodes.size).toBe(0);
      expect(graph.edges.size).toBe(0);
    });

    test('devrait ajouter une compétence', () => {
      const competence = {
        title: 'Test Competence',
        description: 'Une compétence de test',
        level: '6eme',
        subject: 'mathematiques',
        type: 'fondamentale',
        difficulty: 2,
        estimatedTime: 60
      };

      graph.addCompetence('test-comp-1', competence);
      
      expect(graph.nodes.size).toBe(1);
      const stored = graph.nodes.get('test-comp-1');
      expect(stored.title).toBe(competence.title);
      expect(stored.id).toBe('test-comp-1');
    });

    test('devrait créer une relation entre compétences', () => {
      // Ajouter deux compétences
      graph.addCompetence('comp-a', {
        title: 'Compétence A', description: 'Test', level: '6eme',
        subject: 'mathematiques', type: 'fondamentale', difficulty: 1
      });
      graph.addCompetence('comp-b', {
        title: 'Compétence B', description: 'Test', level: '6eme',
        subject: 'mathematiques', type: 'fondamentale', difficulty: 2
      });

      // Créer une relation
      graph.addRelation('comp-a', 'comp-b', 'prerequis', 0.8);
      
      expect(graph.edges.size).toBe(1);
      const relation = graph.edges.get('comp-a->comp-b');
      expect(relation.type).toBe('prerequis');
      expect(relation.weight).toBe(0.8);
    });

    test('devrait trouver les compétences suivantes', () => {
      // Setup compétences
      graph.addCompetence('start', {
        title: 'Start', description: 'Test', level: '6eme',
        subject: 'mathematiques', type: 'fondamentale', difficulty: 1
      });
      graph.addCompetence('next1', {
        title: 'Next 1', description: 'Test', level: '6eme',
        subject: 'mathematiques', type: 'fondamentale', difficulty: 2
      });
      graph.addCompetence('next2', {
        title: 'Next 2', description: 'Test', level: '6eme',
        subject: 'mathematiques', type: 'fondamentale', difficulty: 2
      });

      // Relations
      graph.addRelation('start', 'next1', 'prerequis', 0.9);
      graph.addRelation('start', 'next2', 'complement', 0.7);

      const nextCompetences = graph.getNextCompetences('start');
      
      expect(nextCompetences).toHaveLength(2);
      expect(nextCompetences[0].id).toBe('next1'); // Plus haut poids en premier
      expect(nextCompetences[1].id).toBe('next2');
    });

    test('devrait calculer les statistiques du graphe', () => {
      // Ajouter quelques compétences avec différentes difficultés
      for (let i = 1; i <= 5; i++) {
        graph.addCompetence(`comp-${i}`, {
          title: `Compétence ${i}`, description: 'Test', level: '6eme',
          subject: 'mathematiques', type: 'fondamentale', difficulty: i
        });
      }

      // Ajouter quelques relations
      graph.addRelation('comp-1', 'comp-2', 'prerequis', 0.8);
      graph.addRelation('comp-2', 'comp-3', 'prerequis', 0.8);

      const stats = graph.getGraphStats();
      
      expect(stats.totalCompetences).toBe(5);
      expect(stats.totalRelations).toBe(2);
      expect(stats.avgConnections).toBe(0.4); // 2 relations / 5 compétences
      expect(stats.subjectDistribution.mathematiques).toBe(5);
    });
  });

  describe('💡 RecommendationEngine', () => {
    let engine;
    let graph;
    
    beforeEach(() => {
      graph = new KnowledgeGraph();
      engine = new RecommendationEngine(graph);
      
      // Setup graphe de test
      setupTestGraph(graph);
    });

    function setupTestGraph(graph) {
      // Compétences de test
      const competences = [
        { id: 'math-basic', title: 'Math Basic', subject: 'mathematiques', difficulty: 1 },
        { id: 'math-inter', title: 'Math Intermediate', subject: 'mathematiques', difficulty: 3 },
        { id: 'math-adv', title: 'Math Advanced', subject: 'mathematiques', difficulty: 5 },
        { id: 'french-basic', title: 'French Basic', subject: 'francais', difficulty: 2 }
      ];

      competences.forEach(comp => {
        graph.addCompetence(comp.id, {
          title: comp.title, description: 'Test', level: '6eme',
          subject: comp.subject, type: 'fondamentale', 
          difficulty: comp.difficulty, estimatedTime: 60
        });
      });

      // Relations
      graph.addRelation('math-basic', 'math-inter', 'prerequis', 0.9);
      graph.addRelation('math-inter', 'math-adv', 'prerequis', 0.8);
    }

    test('devrait générer des recommandations vides pour utilisateur inconnu', () => {
      const recommendations = engine.generateRecommendations('unknown-user');
      expect(recommendations).toHaveLength(0);
    });

    test('devrait générer des recommandations basées sur le contenu', () => {
      const userProfile = {
        preferredDifficulty: 2,
        favoriteSubjects: ['mathematiques'],
        availableTime: 90
      };
      
      engine.userProfiles.set('user1', userProfile);
      
      const recommendations = engine.generateRecommendations('user1');
      
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Vérifier que les recommandations respectent les préférences
      const mathRecs = recommendations.filter(r => r.competence.subject === 'mathematiques');
      expect(mathRecs.length).toBeGreaterThan(0);
    });

    test('devrait calculer la similarité de Jaccard', () => {
      const setA = new Set(['a', 'b', 'c']);
      const setB = new Set(['b', 'c', 'd']);
      
      const similarity = engine.calculateJaccardSimilarity(setA, setB);
      
      // Intersection: {b, c} = 2 éléments
      // Union: {a, b, c, d} = 4 éléments
      // Similarité = 2/4 = 0.5
      expect(similarity).toBe(0.5);
    });

    test('devrait filtrer les recommandations par options', () => {
      const userProfile = {
        preferredDifficulty: 3,
        favoriteSubjects: ['mathematiques']
      };
      
      engine.userProfiles.set('user1', userProfile);
      
      const recommendations = engine.generateRecommendations('user1', {
        maxDifficulty: 2,
        subject: 'mathematiques',
        limit: 3
      });
      
      // Toutes les recommandations doivent respecter les filtres
      recommendations.forEach(rec => {
        expect(rec.competence.difficulty).toBeLessThanOrEqual(2);
        expect(rec.competence.subject).toBe('mathematiques');
      });
      
      expect(recommendations.length).toBeLessThanOrEqual(3);
    });
  });

  describe('📚 Données Mathématiques 6ème', () => {
    
    test('devrait avoir une structure valide', () => {
      expect(mathematiques6eme.subject).toBe('mathematiques');
      expect(mathematiques6eme.level).toBe('6eme');
      expect(mathematiques6eme.competences).toBeDefined();
      expect(mathematiques6eme.relations).toBeDefined();
      expect(mathematiques6eme.parcours).toBeDefined();
    });

    test('devrait avoir 5 compétences pilotes', () => {
      const competenceIds = Object.keys(mathematiques6eme.competences);
      expect(competenceIds).toHaveLength(5);
      
      // Vérifier les IDs attendus
      const expectedIds = [
        'math6-nombres-entiers',
        'math6-nombres-decimaux',
        'math6-geometrie-plane',
        'math6-mesures-grandeurs',
        'math6-resolution-problemes'
      ];
      
      expectedIds.forEach(id => {
        expect(competenceIds).toContain(id);
      });
    });

    test('chaque compétence devrait avoir les champs requis', () => {
      Object.values(mathematiques6eme.competences).forEach(competence => {
        expect(competence.id).toBeDefined();
        expect(competence.title).toBeDefined();
        expect(competence.description).toBeDefined();
        expect(competence.type).toBeDefined();
        expect(competence.difficulty).toBeDefined();
        expect(competence.estimatedTime).toBeDefined();
        expect(competence.learningObjectives).toBeDefined();
        expect(competence.subCompetences).toBeDefined();
        expect(competence.assessmentCriteria).toBeDefined();
        expect(competence.resources).toBeDefined();
        
        // Vérifications de types
        expect(typeof competence.difficulty).toBe('number');
        expect(competence.difficulty).toBeGreaterThanOrEqual(1);
        expect(competence.difficulty).toBeLessThanOrEqual(5);
        
        expect(typeof competence.estimatedTime).toBe('number');
        expect(competence.estimatedTime).toBeGreaterThan(0);
        
        expect(Array.isArray(competence.learningObjectives)).toBe(true);
        expect(Array.isArray(competence.subCompetences)).toBe(true);
        expect(Array.isArray(competence.assessmentCriteria)).toBe(true);
        expect(Array.isArray(competence.resources)).toBe(true);
      });
    });

    test('les relations devraient pointer vers des compétences existantes', () => {
      const competenceIds = Object.keys(mathematiques6eme.competences);
      
      mathematiques6eme.relations.forEach(relation => {
        expect(competenceIds).toContain(relation.from);
        expect(competenceIds).toContain(relation.to);
        expect(relation.type).toBeDefined();
        expect(typeof relation.weight).toBe('number');
        expect(relation.weight).toBeGreaterThan(0);
        expect(relation.weight).toBeLessThanOrEqual(1);
      });
    });

    test('les parcours devraient référencer des compétences existantes', () => {
      const competenceIds = Object.keys(mathematiques6eme.competences);
      
      Object.values(mathematiques6eme.parcours).forEach(parcours => {
        expect(parcours.name).toBeDefined();
        expect(parcours.description).toBeDefined();
        expect(Array.isArray(parcours.ordre)).toBe(true);
        
        parcours.ordre.forEach(competenceId => {
          expect(competenceIds).toContain(competenceId);
        });
      });
    });
  });

  describe('🔍 Fonctions de Validation', () => {
    
    test('devrait valider un curriculum correct', () => {
      const result = validationFunctions.validateCurriculum(mathematiques6eme);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('devrait détecter les relations invalides', () => {
      const badCurriculum = {
        competences: {
          'comp-1': { id: 'comp-1', title: 'Test' }
        },
        relations: [
          { from: 'comp-1', to: 'comp-inexistante', type: 'prerequis', weight: 0.8 }
        ]
      };
      
      const result = validationFunctions.validateCurriculum(badCurriculum);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('comp-inexistante');
    });

    test('devrait calculer les statistiques correctement', () => {
      const stats = validationFunctions.getStatistics(mathematiques6eme);
      
      expect(stats.totalCompetences).toBe(5);
      expect(stats.totalDuration).toBeGreaterThan(0);
      expect(stats.difficultyDistribution).toBeDefined();
      expect(stats.typeDistribution).toBeDefined();
      expect(stats.averageDifficulty).toBeGreaterThan(0);
      expect(stats.relationCount).toBe(mathematiques6eme.relations.length);
      expect(stats.connectivityScore).toBeGreaterThan(0);
    });

    test('devrait calculer la distribution de difficulté', () => {
      const competences = Object.values(mathematiques6eme.competences);
      const distribution = validationFunctions.getDifficultyDistribution(competences);
      
      // Vérifier que chaque niveau de difficulté est compté
      Object.values(distribution).forEach(count => {
        expect(count).toBeGreaterThan(0);
      });
      
      // Le total doit correspondre au nombre de compétences
      const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
      expect(total).toBe(competences.length);
    });
  });

  describe('🚀 Intégration Complète', () => {
    
    test('devrait charger les données dans le moteur', () => {
      // Initialiser le moteur
      curriculumEngine.init();
      
      // Charger les compétences
      Object.entries(mathematiques6eme.competences).forEach(([id, competence]) => {
        curriculumEngine.knowledgeGraph.addCompetence(id, competence);
      });
      
      // Charger les relations
      mathematiques6eme.relations.forEach(relation => {
        curriculumEngine.knowledgeGraph.addRelation(
          relation.from,
          relation.to,
          relation.type,
          relation.weight
        );
      });
      
      // Vérifier que tout est chargé
      const stats = curriculumEngine.knowledgeGraph.getGraphStats();
      expect(stats.totalCompetences).toBe(5);
      expect(stats.totalRelations).toBe(mathematiques6eme.relations.length);
    });

    test('devrait générer un parcours d\'apprentissage', () => {
      // Setup moteur
      curriculumEngine.init();
      
      // Charger données
      Object.entries(mathematiques6eme.competences).forEach(([id, competence]) => {
        curriculumEngine.knowledgeGraph.addCompetence(id, competence);
      });
      
      mathematiques6eme.relations.forEach(relation => {
        curriculumEngine.knowledgeGraph.addRelation(
          relation.from,
          relation.to,
          relation.type,
          relation.weight
        );
      });
      
      // Générer parcours
      const userProfile = {
        preferredDifficulty: 3,
        availableTime: 90
      };
      
      const path = curriculumEngine.knowledgeGraph.findLearningPath(
        'math6-nombres-entiers',
        'math6-resolution-problemes',
        userProfile
      );
      
      expect(path).toBeDefined();
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBeGreaterThan(0);
      
      // Le chemin doit commencer par la compétence de départ
      expect(path[0].id).toBe('math6-nombres-entiers');
      
      // Et finir par la compétence cible
      expect(path[path.length - 1].id).toBe('math6-resolution-problemes');
    });

    test('devrait adapter le parcours selon le profil utilisateur', () => {
      curriculumEngine.init();
      
      // Charger données
      Object.entries(mathematiques6eme.competences).forEach(([id, competence]) => {
        curriculumEngine.knowledgeGraph.addCompetence(id, competence);
      });
      
      // Test avec profil exigeant
      const restrictiveProfile = {
        preferredDifficulty: 2,
        availableTime: 30,
        learningStyle: 'visual'
      };
      
      const path = curriculumEngine.knowledgeGraph.findLearningPath(
        'math6-nombres-entiers',
        'math6-nombres-decimaux',
        restrictiveProfile
      );
      
      if (path && path.length > 0) {
        // Vérifier que les adaptations sont appliquées
        path.forEach(step => {
          if (step.adaptedDifficulty) {
            expect(step.adaptedDifficulty).toBeLessThanOrEqual(restrictiveProfile.preferredDifficulty);
          }
          if (step.adaptedTime) {
            expect(step.adaptedTime).toBeLessThanOrEqual(restrictiveProfile.availableTime);
          }
        });
      }
    });
  });

  describe('⚡ Performance et Optimisation', () => {
    
    test('devrait traiter rapidement un grand nombre de compétences', () => {
      const graph = new KnowledgeGraph();
      
      const startTime = performance.now();
      
      // Ajouter 100 compétences
      for (let i = 0; i < 100; i++) {
        graph.addCompetence(`comp-${i}`, {
          title: `Compétence ${i}`,
          description: 'Test performance',
          level: '6eme',
          subject: 'mathematiques',
          type: 'fondamentale',
          difficulty: (i % 5) + 1,
          estimatedTime: 60
        });
      }
      
      // Ajouter 200 relations
      for (let i = 0; i < 99; i++) {
        graph.addRelation(`comp-${i}`, `comp-${i + 1}`, 'prerequis', 0.8);
        if (i < 98) {
          graph.addRelation(`comp-${i}`, `comp-${i + 2}`, 'complement', 0.6);
        }
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1000); // Moins d'1 seconde
      expect(graph.nodes.size).toBe(100);
      expect(graph.edges.size).toBe(197); // 99 + 98 relations
    });

    test('recherche de chemin devrait être efficace', () => {
      const graph = new KnowledgeGraph();
      
      // Créer un graphe linéaire de 50 compétences
      for (let i = 0; i < 50; i++) {
        graph.addCompetence(`comp-${i}`, {
          title: `Compétence ${i}`,
          description: 'Test',
          level: '6eme',
          subject: 'mathematiques',
          type: 'fondamentale',
          difficulty: (i % 5) + 1,
          estimatedTime: 60
        });
        
        if (i > 0) {
          graph.addRelation(`comp-${i-1}`, `comp-${i}`, 'prerequis', 0.8);
        }
      }
      
      const startTime = performance.now();
      
      const path = graph.findLearningPath('comp-0', 'comp-49', {});
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100); // Moins de 100ms
      expect(path).toBeDefined();
      expect(path.length).toBe(50);
    });
  });
});

// Tests d'intégration avec l'interface utilisateur
describe('🎨 Interface Curriculum Dashboard', () => {
  
  test('devrait exposer les bonnes propriétés dans les stores', () => {
    // Ces tests seraient exécutés dans un environnement avec accès aux stores Svelte
    // Pour le moment, on vérifie juste que les modules s'importent correctement
    
    expect(curriculumEngine).toBeDefined();
    expect(curriculumEngine.knowledgeGraph).toBeDefined();
    expect(curriculumEngine.init).toBeDefined();
    expect(typeof curriculumEngine.generateCurriculum).toBe('function');
  });
});

console.log('🧪 Tests du Curriculum Generation Engine configurés');
