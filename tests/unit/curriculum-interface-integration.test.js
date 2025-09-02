/**
 * 🔗 Tests d'intégration Curriculum → Interface - Phase 7.A
 * Tests complets d'intégration entre le service curriculum et l'interface
 */

import { describe, it, expect, beforeEach } from 'vitest';
import CurriculumIntegrationService from '../../src/lib/curriculum-integration.js';

console.log('🔗 Tests d\'intégration Curriculum → Interface configurés !');

describe('🔗 Intégration Curriculum → Interface', () => {
  let service;

  beforeEach(() => {
    service = new CurriculumIntegrationService();
  });

  describe('📊 Dashboard Data Integration', () => {
    it('should load complete dashboard data', () => {
      const dashboardData = service.getDashboardData();
      
      // Structure de base
      expect(dashboardData).toHaveProperty('user');
      expect(dashboardData).toHaveProperty('stats');
      expect(dashboardData).toHaveProperty('coursesByDifficulty');
      expect(dashboardData).toHaveProperty('difficulties');
      expect(dashboardData).toHaveProperty('subjects');
      expect(dashboardData).toHaveProperty('recentActivity');

      // Vérifications de contenu
      expect(dashboardData.user.name).toBe('Utilisateur Demo');
      expect(dashboardData.stats.totalCourses).toBeGreaterThan(0);
      expect(Object.keys(dashboardData.coursesByDifficulty)).toContain('beginner');
      expect(Object.keys(dashboardData.coursesByDifficulty)).toContain('intermediate');
      expect(Array.isArray(dashboardData.recentActivity)).toBe(true);
    });

    it('should provide real course statistics', () => {
      const dashboardData = service.getDashboardData();
      const stats = dashboardData.stats;

      // Vérifier que toutes les stats requises sont présentes
      expect(stats.totalCourses).toBeGreaterThanOrEqual(0);
      expect(stats.completedCourses).toBeGreaterThanOrEqual(0);
      expect(stats.inProgressCourses).toBeGreaterThanOrEqual(0);
      expect(stats.totalTimeSpent).toBeGreaterThan(0);
      expect(stats.totalExercises).toBeGreaterThan(0);
      expect(stats.averageScore).toBeGreaterThan(0);
    });

    it('should organize courses by difficulty correctly', () => {
      const dashboardData = service.getDashboardData();
      const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
      
      difficulties.forEach(difficulty => {
        expect(dashboardData.coursesByDifficulty).toHaveProperty(difficulty);
        expect(Array.isArray(dashboardData.coursesByDifficulty[difficulty])).toBe(true);
      });
    });
  });

  describe('🎯 Recommendations System', () => {
    it('should provide relevant course recommendations', () => {
      const recommendations = service.getRecommendedCourses();
      
      expect(recommendations).toHaveProperty('continue');
      expect(recommendations).toHaveProperty('suggested');
      expect(Array.isArray(recommendations.continue)).toBe(true);
      expect(Array.isArray(recommendations.suggested)).toBe(true);
      expect(recommendations.continue.length).toBeGreaterThanOrEqual(0);
      expect(recommendations.suggested.length).toBeGreaterThanOrEqual(0);

      if (recommendations.continue.length > 0) {
        const firstRec = recommendations.continue[0];
        expect(firstRec).toHaveProperty('id');
        expect(firstRec).toHaveProperty('title');
        expect(firstRec).toHaveProperty('difficulty');
        expect(firstRec).toHaveProperty('reason');
      }
    });
  });

  describe('🔄 Progress Updates', () => {
    it('should update course progress correctly', () => {
      const courseId = 'math_6eme_base';
      const newProgress = 85;
      
      const updatedCourse = service.updateCourseProgress(courseId, newProgress);
      
      expect(updatedCourse).not.toBeNull();
      expect(updatedCourse.progress).toBe(newProgress);
      expect(updatedCourse.lastAccessed).toBeInstanceOf(Date);
      expect(updatedCourse.completed).toBeGreaterThan(0);
    });

    it('should log activity when progress is updated', () => {
      const initialActivityCount = service.userProgress.userData.recentActivity.length;
      
      service.updateCourseProgress('math_6eme_base', 75, 'Grammar Lesson');
      
      const newActivityCount = service.userProgress.userData.recentActivity.length;
      expect(newActivityCount).toBe(initialActivityCount + 1);

      const latestActivity = service.userProgress.userData.recentActivity[0];
      expect(latestActivity.type).toBe('completion');
      expect(latestActivity.lesson).toBe('Grammar Lesson');
    });
  });

  describe('🎨 Design System Integration', () => {
    it('should provide consistent difficulty colors', () => {
      const beginnerColor = service.getDifficultyColor('beginner');
      const intermediateColor = service.getDifficultyColor('intermediate');
      const advancedColor = service.getDifficultyColor('advanced');
      const expertColor = service.getDifficultyColor('expert');

      expect(beginnerColor).toBe('#10b981');
      expect(intermediateColor).toBe('#f59e0b');
      expect(advancedColor).toBe('#ef4444');
      expect(expertColor).toBe('#8b5cf6');
    });

    it('should format activity timeline correctly', () => {
      const activities = service.getRecentActivity(5);
      
      expect(Array.isArray(activities)).toBe(true);
      activities.forEach(activity => {
        expect(activity).toHaveProperty('timeAgo');
        expect(activity).toHaveProperty('icon');
        expect(activity.timeAgo).toMatch(/\d+\s*(min|h|j)\s*ago/);
      });
    });
  });

  describe('🏆 Achievement System', () => {
    it('should check and award achievements', () => {
      const achievements = service.checkAchievements('test-user');
      
      expect(Array.isArray(achievements)).toBe(true);
      achievements.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('title');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement).toHaveProperty('xpBonus');
      });
    });
  });

  describe('💾 User Preferences', () => {
    it('should save and load user preferences', () => {
      const testPrefs = {
        theme: 'dark',
        difficulty: 'intermediate',
        notifications: false
      };
      
      const savedPrefs = service.userProgress.updateUserPreferences(testPrefs);
      expect(savedPrefs.theme).toBe('dark');
      expect(savedPrefs.difficulty).toBe('intermediate');
      expect(savedPrefs.notifications).toBe(false);

      const loadedPrefs = service.userProgress.getUserPreferences();
      expect(loadedPrefs.theme).toBe('dark');
    });
  });

  describe('📚 Course Content Integration', () => {
    it('should provide detailed course information', () => {
      const dashboardData = service.getDashboardData();
      const beginnerCourses = dashboardData.coursesByDifficulty.beginner;
      
      if (beginnerCourses.length > 0) {
        const course = beginnerCourses[0];
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('description');
        expect(course).toHaveProperty('skills');
        expect(course).toHaveProperty('progress');
        expect(course).toHaveProperty('difficulty');
        expect(course.statistics).toHaveProperty('totalExercises');
        expect(course.statistics).toHaveProperty('exercisesCompleted');
        expect(course.statistics).toHaveProperty('averageScore');
        expect(course.statistics).toHaveProperty('streak');
      }
    });

    it('should link courses to subjects correctly', () => {
      const dashboardData = service.getDashboardData();
      const subjects = dashboardData.subjects;

      expect(subjects).toHaveProperty('mathematiques');
      expect(subjects).toHaveProperty('francais');
      
      const mathSubject = subjects.mathematiques;
      expect(mathSubject).toHaveProperty('id');
      expect(mathSubject).toHaveProperty('title');
      expect(mathSubject).toHaveProperty('label');
      expect(mathSubject).toHaveProperty('color');
      expect(mathSubject).toHaveProperty('description');
      expect(mathSubject).toHaveProperty('coursesCount');
    });
  });

  describe('🔗 End-to-End Integration', () => {
    it('should simulate complete user learning flow', async () => {
      // 1. Charger le dashboard
      const dashboardData = service.getDashboardData();
      expect(dashboardData).toBeDefined();

      // 2. Obtenir le profil utilisateur
      const userProfile = service.getUserProfile();
      expect(userProfile).toBeDefined();
      expect(userProfile.name).toBeDefined();

      // 3. Mettre à jour la progression d'un cours
      const testCourseId = 'integration-test-course';
      const testProgress = 60;
      const updatedCourse = service.updateCourseProgress(testCourseId, testProgress, 'Test Integration Lesson');
      expect(updatedCourse).toBeDefined();

      // 4. Vérifier l'activité récente
      const recentActivity = service.getRecentActivity(1);
      expect(recentActivity.length).toBeGreaterThan(0);
      expect(recentActivity[0].lesson).toBe('Test Integration Lesson');

      // 5. Vérifier les achievements
      const achievements = service.checkAchievements();
      expect(Array.isArray(achievements)).toBe(true);

      // 6. Obtenir de nouvelles recommandations
      const recommendations = service.getRecommendedCourses();
      expect(recommendations.continue.length).toBeGreaterThan(0);
    });
  });
});
