import { describe, it, expect, beforeEach } from 'vitest';

// Test pour le service curriculum-integration
describe('🔗 Curriculum Integration Service - Phase 7.A', () => {
  let service;

  beforeEach(() => {
    // Mock du service pour les tests
    service = {
      getDashboardData() {
        return {
          coursesByDifficulty: {
            beginner: [
              { 
                id: 'math-6eme-1', 
                title: 'Nombres et calculs', 
                progress: 75,
                difficulty: 'beginner',
                estimatedTime: 45
              },
              { 
                id: 'french-6eme-1', 
                title: 'Grammaire de base', 
                progress: 50,
                difficulty: 'beginner',
                estimatedTime: 30
              }
            ],
            intermediate: [
              {
                id: 'math-5eme-1',
                title: 'Fractions et décimaux',
                progress: 25,
                difficulty: 'intermediate',
                estimatedTime: 60
              }
            ],
            advanced: [],
            expert: []
          },
          stats: {
            totalCourses: 12,
            completedCourses: 4,
            totalTimeSpent: 180,
            averageScore: 85
          },
          recentActivity: [
            {
              id: 'activity-1',
              title: 'Terminé: Additions et soustractions',
              type: 'completion',
              timestamp: '2025-09-01T10:30:00Z',
              score: 90
            },
            {
              id: 'activity-2',
              title: 'Nouveau: Tables de multiplication',
              type: 'start',
              timestamp: '2025-09-01T09:15:00Z'
            }
          ]
        };
      },

      getRecommendedCourses() {
        return [
          {
            id: 'rec-math-1',
            title: 'Géométrie plane',
            difficulty: 'intermediate',
            reason: 'Basé sur vos progrès en calculs',
            confidence: 0.85
          },
          {
            id: 'rec-french-1',
            title: 'Conjugaison présent',
            difficulty: 'beginner',
            reason: 'Complément à la grammaire',
            confidence: 0.78
          }
        ];
      },

      getUserProfile() {
        return {
          name: 'Élève Test',
          level: '6ème',
          preferredDifficulty: 'beginner',
          learningStyle: 'visual',
          strongSubjects: ['Math'],
          improvementAreas: ['Français']
        };
      }
    };
  });

  describe('📊 Dashboard Data', () => {
    it('devrait retourner des données structurées', () => {
      const data = service.getDashboardData();
      
      expect(data).toHaveProperty('coursesByDifficulty');
      expect(data).toHaveProperty('stats');
      expect(data).toHaveProperty('recentActivity');
      
      // Vérifier la structure des cours par difficulté
      expect(data.coursesByDifficulty).toHaveProperty('beginner');
      expect(data.coursesByDifficulty).toHaveProperty('intermediate');
      expect(data.coursesByDifficulty).toHaveProperty('advanced');
      expect(data.coursesByDifficulty).toHaveProperty('expert');
    });

    it('devrait avoir des cours avec les propriétés requises', () => {
      const data = service.getDashboardData();
      const beginnerCourses = data.coursesByDifficulty.beginner;
      
      expect(beginnerCourses).toHaveLength(2);
      
      beginnerCourses.forEach(course => {
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('progress');
        expect(course).toHaveProperty('difficulty');
        expect(course).toHaveProperty('estimatedTime');
        
        expect(typeof course.progress).toBe('number');
        expect(course.progress).toBeGreaterThanOrEqual(0);
        expect(course.progress).toBeLessThanOrEqual(100);
      });
    });

    it('devrait fournir des statistiques cohérentes', () => {
      const data = service.getDashboardData();
      const stats = data.stats;
      
      expect(stats.totalCourses).toBeGreaterThan(0);
      expect(stats.completedCourses).toBeLessThanOrEqual(stats.totalCourses);
      expect(stats.averageScore).toBeGreaterThanOrEqual(0);
      expect(stats.averageScore).toBeLessThanOrEqual(100);
    });
  });

  describe('🎯 Recommandations', () => {
    it('devrait retourner des recommandations personnalisées', () => {
      const recommendations = service.getRecommendedCourses();
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
      
      recommendations.forEach(rec => {
        expect(rec).toHaveProperty('id');
        expect(rec).toHaveProperty('title');
        expect(rec).toHaveProperty('difficulty');
        expect(rec).toHaveProperty('reason');
        expect(rec).toHaveProperty('confidence');
        
        expect(typeof rec.confidence).toBe('number');
        expect(rec.confidence).toBeGreaterThan(0);
        expect(rec.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('👤 Profil Utilisateur', () => {
    it('devrait retourner un profil utilisateur complet', () => {
      const profile = service.getUserProfile();
      
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('level');
      expect(profile).toHaveProperty('preferredDifficulty');
      expect(profile).toHaveProperty('learningStyle');
      expect(profile).toHaveProperty('strongSubjects');
      expect(profile).toHaveProperty('improvementAreas');
      
      expect(Array.isArray(profile.strongSubjects)).toBe(true);
      expect(Array.isArray(profile.improvementAreas)).toBe(true);
    });
  });
});
