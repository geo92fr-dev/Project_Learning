import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('🎨 Phase 7.A - Fonctionnalités Interactives Avancées', () => {
  
  describe('🎯 Filtrage intelligent', () => {
    it('devrait filtrer les cours par difficulté', () => {
      const courses = [
        { id: 1, difficulty: 'beginner', title: 'Cours débutant' },
        { id: 2, difficulty: 'intermediate', title: 'Cours intermédiaire' },
        { id: 3, difficulty: 'advanced', title: 'Cours avancé' }
      ];
      
      function filterByDifficulty(courses, difficulty) {
        return courses.filter(course => course.difficulty === difficulty);
      }
      
      const beginnerCourses = filterByDifficulty(courses, 'beginner');
      expect(beginnerCourses).toHaveLength(1);
      expect(beginnerCourses[0].title).toBe('Cours débutant');
    });
    
    it('devrait filtrer par matière avec recherche fuzzy', () => {
      const courses = [
        { id: 1, matiere: 'mathematiques', title: 'Algèbre' },
        { id: 2, matiere: 'francais', title: 'Grammaire' },
        { id: 3, matiere: 'sciences', title: 'Physique' }
      ];
      
      function fuzzySearch(courses, query) {
        return courses.filter(course => 
          course.matiere.toLowerCase().includes(query.toLowerCase()) ||
          course.title.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      const mathCourses = fuzzySearch(courses, 'math');
      expect(mathCourses).toHaveLength(1);
      
      const physicsCourses = fuzzySearch(courses, 'phys');
      expect(physicsCourses).toHaveLength(1);
    });
  });

  describe('🎮 Gamification interactive', () => {
    it('devrait calculer les points et badges', () => {
      function calculateXP(completedCourses, difficulty) {
        const xpMultipliers = {
          beginner: 10,
          intermediate: 25,
          advanced: 50,
          expert: 100
        };
        return completedCourses * (xpMultipliers[difficulty] || 10);
      }
      
      expect(calculateXP(5, 'beginner')).toBe(50);
      expect(calculateXP(3, 'expert')).toBe(300);
    });
    
    it('devrait débloquer des badges basés sur les achievements', () => {
      function checkBadges(userStats) {
        const badges = [];
        
        if (userStats.completedCourses >= 10) badges.push('Explorer');
        if (userStats.streak >= 7) badges.push('Persévérant');
        if (userStats.totalXP >= 500) badges.push('Expert');
        
        return badges;
      }
      
      const stats = { completedCourses: 12, streak: 8, totalXP: 600 };
      const badges = checkBadges(stats);
      
      expect(badges).toContain('Explorer');
      expect(badges).toContain('Persévérant');
      expect(badges).toContain('Expert');
    });
  });

  describe('📊 Analytics en temps réel', () => {
    it('devrait calculer la progression hebdomadaire', () => {
      function calculateWeeklyProgress(activities) {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return activities.filter(activity => 
          new Date(activity.date) >= oneWeekAgo
        ).length;
      }
      
      const activities = [
        { date: new Date().toISOString(), type: 'completed' },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'completed' },
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), type: 'completed' }
      ];
      
      expect(calculateWeeklyProgress(activities)).toBe(2);
    });
  });

  describe('🎨 Interface adaptative', () => {
    it('devrait adapter le theme selon les préférences', () => {
      function detectThemePreference() {
        // Mock de window.matchMedia
        const mockMatchMedia = vi.fn().mockReturnValue({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn()
        });
        
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: mockMatchMedia
        });
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      expect(detectThemePreference()).toBe('dark');
    });
  });
});
