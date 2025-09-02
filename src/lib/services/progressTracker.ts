/**
 * 📊 Progress Tracker Service - Phase 6
 * Service pour le suivi et la gestion de la progression utilisateur
 */

import type { 
  UserProgress, 
  Course, 
  Competence, 
  UserCurriculumStats,
  Exercise 
} from '../types/curriculum';

export interface ProgressUpdate {
  courseId: string;
  competenceId?: string;
  score?: number;
  timeSpent: number;
  exercisesCompleted?: number;
  completed?: boolean;
}

export interface LearningSession {
  id: string;
  userId: string;
  courseId: string;
  startedAt: string;
  endedAt?: string;
  timeSpent: number;
  exercisesCompleted: number;
  score?: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  points: number;
  unlockedAt?: string;
}

class ProgressTracker {
  private userProgress: Map<string, UserProgress[]> = new Map();
  private userStats: Map<string, UserCurriculumStats> = new Map();
  private sessions: Map<string, LearningSession[]> = new Map();
  private achievements: Achievement[] = [];

  constructor() {
    this.initializeAchievements();
  }

  /**
   * Démarre une nouvelle session d'apprentissage
   */
  async startLearningSession(
    userId: string, 
    courseId: string, 
    competenceId?: string
  ): Promise<LearningSession> {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session: LearningSession = {
      id: sessionId,
      userId,
      courseId,
      startedAt: new Date().toISOString(),
      timeSpent: 0,
      exercisesCompleted: 0,
      completed: false
    };

    // Ajouter à la liste des sessions
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, []);
    }
    this.sessions.get(userId)!.push(session);

    console.log(`🚀 Session démarrée: ${sessionId} pour le cours ${courseId}`);
    return session;
  }

  /**
   * Met à jour une session en cours
   */
  async updateLearningSession(
    sessionId: string,
    updates: Partial<LearningSession>
  ): Promise<LearningSession | null> {
    for (const [userId, sessions] of this.sessions.entries()) {
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        const session = sessions[sessionIndex];
        Object.assign(session, updates);
        
        // Si la session est terminée, mettre à jour la progression
        if (updates.completed || updates.endedAt) {
          await this.updateProgressFromSession(session);
        }
        
        return session;
      }
    }
    return null;
  }

  /**
   * Termine une session d'apprentissage
   */
  async endLearningSession(
    sessionId: string,
    finalUpdates?: Partial<LearningSession>
  ): Promise<LearningSession | null> {
    const updates = {
      ...finalUpdates,
      endedAt: new Date().toISOString(),
      completed: true
    };

    const session = await this.updateLearningSession(sessionId, updates);
    
    if (session) {
      console.log(`✅ Session terminée: ${sessionId} - Temps: ${session.timeSpent}min, Score: ${session.score || 'N/A'}`);
      
      // Vérifier les achievements
      await this.checkAchievements(session.userId);
    }
    
    return session;
  }

  /**
   * Met à jour la progression d'un utilisateur
   */
  async updateProgress(
    userId: string, 
    progressUpdate: ProgressUpdate
  ): Promise<UserProgress> {
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, []);
    }

    const userProgressList = this.userProgress.get(userId)!;
    
    // Chercher la progression existante ou en créer une nouvelle
    let existingProgress = userProgressList.find(p => p.courseId === progressUpdate.courseId);
    
    if (!existingProgress) {
      existingProgress = {
        id: `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        courseId: progressUpdate.courseId,
        competenceId: progressUpdate.competenceId,
        startedAt: new Date().toISOString(),
        completed: false,
        timeSpent: 0,
        exercisesCompleted: 0,
        totalExercises: 10, // Valeur par défaut
        lastAccessedAt: new Date().toISOString(),
        progress: 0,
        attempts: 0
      };
      userProgressList.push(existingProgress);
    }

    // Mettre à jour les champs
    existingProgress.lastAccessedAt = new Date().toISOString();
    existingProgress.attempts += 1;
    
    if (progressUpdate.timeSpent !== undefined) {
      existingProgress.timeSpent += progressUpdate.timeSpent;
    }
    
    if (progressUpdate.exercisesCompleted !== undefined) {
      existingProgress.exercisesCompleted = Math.max(
        existingProgress.exercisesCompleted, 
        progressUpdate.exercisesCompleted
      );
    }
    
    if (progressUpdate.score !== undefined) {
      if (!existingProgress.bestScore || progressUpdate.score > existingProgress.bestScore) {
        existingProgress.bestScore = progressUpdate.score;
      }
      existingProgress.score = progressUpdate.score;
    }
    
    if (progressUpdate.completed !== undefined) {
      existingProgress.completed = progressUpdate.completed;
      if (progressUpdate.completed) {
        existingProgress.completedAt = new Date().toISOString();
      }
    }

    // Calculer le pourcentage de progression
    existingProgress.progress = this.calculateProgressPercentage(existingProgress);

    // Mettre à jour les statistiques globales
    await this.updateUserStats(userId);

    console.log(`📈 Progression mise à jour: ${existingProgress.courseId} - ${existingProgress.progress}%`);
    
    return existingProgress;
  }

  /**
   * Récupère la progression d'un utilisateur pour un cours
   */
  async getUserProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    const userProgressList = this.userProgress.get(userId);
    if (!userProgressList) return null;
    
    return userProgressList.find(p => p.courseId === courseId) || null;
  }

  /**
   * Récupère toute la progression d'un utilisateur
   */
  async getAllUserProgress(userId: string): Promise<UserProgress[]> {
    return this.userProgress.get(userId) || [];
  }

  /**
   * Récupère les statistiques globales d'un utilisateur
   */
  async getUserStats(userId: string): Promise<UserCurriculumStats> {
    return this.userStats.get(userId) || this.createDefaultStats();
  }

  /**
   * Récupère l'historique des sessions
   */
  async getUserSessions(userId: string): Promise<LearningSession[]> {
    return this.sessions.get(userId) || [];
  }

  /**
   * Calcule les statistiques d'apprentissage
   */
  async getLearningAnalytics(userId: string): Promise<{
    dailyProgress: { date: string; timeSpent: number; score: number }[];
    weeklyStats: { week: string; coursesCompleted: number; averageScore: number }[];
    competencesMastery: { competenceId: string; masteryLevel: number }[];
    recommendations: string[];
  }> {
    const sessions = await this.getUserSessions(userId);
    const progress = await this.getAllUserProgress(userId);

    // Analyse quotidienne (7 derniers jours)
    const dailyProgress = this.calculateDailyProgress(sessions, 7);

    // Analyse hebdomadaire (4 dernières semaines)
    const weeklyStats = this.calculateWeeklyStats(progress, 4);

    // Maîtrise des compétences
    const competencesMastery = this.calculateCompetencesMastery(progress);

    // Recommandations personnalisées
    const recommendations = this.generateRecommendations(progress, sessions);

    return {
      dailyProgress,
      weeklyStats,
      competencesMastery,
      recommendations
    };
  }

  /**
   * Génère un rapport de progression
   */
  async generateProgressReport(userId: string): Promise<{
    summary: UserCurriculumStats;
    recentActivity: LearningSession[];
    achievements: Achievement[];
    nextGoals: string[];
    recommendations: string[];
  }> {
    const summary = await this.getUserStats(userId);
    const recentActivity = (await this.getUserSessions(userId))
      .slice(-10)
      .reverse(); // 10 dernières sessions

    const achievements = this.achievements.filter(a => a.unlockedAt);
    const { recommendations } = await this.getLearningAnalytics(userId);
    
    const nextGoals = this.generateNextGoals(summary, await this.getAllUserProgress(userId));

    return {
      summary,
      recentActivity,
      achievements,
      nextGoals,
      recommendations
    };
  }

  // Méthodes privées

  private async updateProgressFromSession(session: LearningSession): Promise<void> {
    const progressUpdate: ProgressUpdate = {
      courseId: session.courseId,
      timeSpent: session.timeSpent,
      exercisesCompleted: session.exercisesCompleted,
      score: session.score,
      completed: session.completed
    };

    await this.updateProgress(session.userId, progressUpdate);
  }

  private calculateProgressPercentage(progress: UserProgress): number {
    const factors = [
      { weight: 0.4, value: progress.exercisesCompleted / progress.totalExercises },
      { weight: 0.3, value: progress.completed ? 1 : 0 },
      { weight: 0.2, value: (progress.score || 0) / 100 },
      { weight: 0.1, value: Math.min(progress.timeSpent / 60, 1) } // Normalisé sur 60min
    ];

    const weightedSum = factors.reduce((sum, factor) => 
      sum + (factor.weight * Math.min(factor.value, 1)), 0
    );

    return Math.round(weightedSum * 100);
  }

  private async updateUserStats(userId: string): Promise<void> {
    const userProgressList = await this.getAllUserProgress(userId);
    const sessions = await this.getUserSessions(userId);

    const completedCourses = userProgressList.filter(p => p.completed).length;
    const totalTimeSpent = userProgressList.reduce((sum, p) => sum + p.timeSpent, 0);
    const scores = userProgressList.filter(p => p.score).map(p => p.score!);
    const averageScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

    // Calculer la streak (jours consécutifs)
    const currentStreak = this.calculateCurrentStreak(sessions);

    // Calculer les points totaux
    const totalPoints = userProgressList.reduce((sum, p) => {
      return sum + ((p.score || 0) * (p.completed ? 2 : 1));
    }, 0);

    // Déterminer le niveau
    const level = this.determineUserLevel(totalPoints, completedCourses);
    const progressToNextLevel = this.calculateProgressToNextLevel(totalPoints, level);

    const stats: UserCurriculumStats = {
      completedCompetences: new Set(userProgressList.filter(p => p.completed).map(p => p.competenceId)).size,
      completedCourses,
      totalTimeSpent,
      averageScore: Math.round(averageScore),
      currentStreak,
      totalPoints: Math.round(totalPoints),
      level,
      progressToNextLevel
    };

    this.userStats.set(userId, stats);
  }

  private createDefaultStats(): UserCurriculumStats {
    return {
      completedCompetences: 0,
      completedCourses: 0,
      totalTimeSpent: 0,
      averageScore: 0,
      currentStreak: 0,
      totalPoints: 0,
      level: 'beginner',
      progressToNextLevel: 0
    };
  }

  private calculateCurrentStreak(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 0;

    const completedSessions = sessions
      .filter(s => s.completed)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    if (completedSessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of completedSessions) {
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private determineUserLevel(points: number, coursesCompleted: number): string {
    if (points < 500 || coursesCompleted < 5) return 'beginner';
    if (points < 1500 || coursesCompleted < 15) return 'intermediate';
    if (points < 3000 || coursesCompleted < 30) return 'advanced';
    return 'expert';
  }

  private calculateProgressToNextLevel(points: number, currentLevel: string): number {
    const thresholds = {
      'beginner': 500,
      'intermediate': 1500,
      'advanced': 3000,
      'expert': Infinity
    };

    const currentThreshold = thresholds[currentLevel as keyof typeof thresholds];
    if (currentThreshold === Infinity) return 100;

    const nextThreshold = Object.values(thresholds).find(t => t > points) || Infinity;
    if (nextThreshold === Infinity) return 100;

    const previousThreshold = currentLevel === 'beginner' ? 0 : thresholds[currentLevel as keyof typeof thresholds];
    const progress = ((points - previousThreshold) / (nextThreshold - previousThreshold)) * 100;

    return Math.min(Math.round(progress), 100);
  }

  private calculateDailyProgress(sessions: LearningSession[], days: number): any[] {
    // Implémentation simplifiée
    const result = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const daySession = sessions.filter(s => {
        const sessionDate = new Date(s.startedAt);
        return sessionDate.toDateString() === date.toDateString();
      });

      const timeSpent = daySession.reduce((sum, s) => sum + s.timeSpent, 0);
      const scores = daySession.filter(s => s.score).map(s => s.score!);
      const averageScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

      result.unshift({
        date: date.toISOString().split('T')[0],
        timeSpent,
        score: Math.round(averageScore)
      });
    }

    return result;
  }

  private calculateWeeklyStats(progress: UserProgress[], weeks: number): any[] {
    // Implémentation simplifiée
    return Array.from({ length: weeks }, (_, i) => ({
      week: `Semaine ${weeks - i}`,
      coursesCompleted: Math.floor(Math.random() * 5),
      averageScore: Math.floor(Math.random() * 40) + 60
    }));
  }

  private calculateCompetencesMastery(progress: UserProgress[]): any[] {
    const competenceProgress = new Map();
    
    progress.forEach(p => {
      if (p.competenceId) {
        const existing = competenceProgress.get(p.competenceId) || [];
        existing.push(p);
        competenceProgress.set(p.competenceId, existing);
      }
    });

    return Array.from(competenceProgress.entries()).map(([competenceId, progressList]) => {
      const avgProgress = progressList.reduce((sum: number, p: UserProgress) => sum + p.progress, 0) / progressList.length;
      return {
        competenceId,
        masteryLevel: Math.round(avgProgress)
      };
    });
  }

  private generateRecommendations(progress: UserProgress[], sessions: LearningSession[]): string[] {
    const recommendations = [];

    // Analyse du temps d'étude
    const avgSessionTime = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.timeSpent, 0) / sessions.length 
      : 0;

    if (avgSessionTime < 20) {
      recommendations.push("Essayez d'étudier un peu plus longtemps pour améliorer la rétention");
    }

    // Analyse des scores
    const recentScores = progress.filter(p => p.score).slice(-5).map(p => p.score!);
    const avgScore = recentScores.length > 0 
      ? recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length 
      : 0;

    if (avgScore < 70) {
      recommendations.push("Révisions recommandées sur les chapitres récents");
    }

    // Autres recommandations génériques
    if (sessions.length > 0) {
      recommendations.push("Continuez sur cette lancée, vous progressez bien !");
    }

    return recommendations;
  }

  private generateNextGoals(stats: UserCurriculumStats, progress: UserProgress[]): string[] {
    const goals = [];

    // Objectifs basés sur les statistiques
    if (stats.completedCourses < 10) {
      goals.push(`Terminer ${10 - stats.completedCourses} cours supplémentaires`);
    }

    if (stats.averageScore < 80) {
      goals.push("Améliorer la moyenne générale à 80%");
    }

    if (stats.currentStreak < 7) {
      goals.push("Maintenir une série de 7 jours consécutifs");
    }

    // Objectifs par niveau
    const nextLevelGoals = {
      'beginner': "Atteindre le niveau intermédiaire",
      'intermediate': "Accéder au niveau avancé", 
      'advanced': "Devenir un expert",
      'expert': "Maintenir l'excellence"
    };

    goals.push(nextLevelGoals[stats.level as keyof typeof nextLevelGoals]);

    return goals;
  }

  private initializeAchievements(): void {
    this.achievements = [
      {
        id: 'first-course',
        name: 'Premier pas',
        description: 'Terminer votre premier cours',
        icon: '🎓',
        condition: 'complete_1_course',
        points: 100
      },
      {
        id: 'week-streak',
        name: 'Régularité',
        description: 'Étudier 7 jours consécutifs',
        icon: '🔥',
        condition: 'streak_7_days',
        points: 200
      },
      {
        id: 'perfect-score',
        name: 'Excellence',
        description: 'Obtenir 100% à un cours',
        icon: '⭐',
        condition: 'score_100_percent',
        points: 150
      }
    ];
  }

  private async checkAchievements(userId: string): Promise<void> {
    const stats = await this.getUserStats(userId);
    const progress = await this.getAllUserProgress(userId);

    // Vérification simple des achievements
    this.achievements.forEach(achievement => {
      if (achievement.unlockedAt) return; // Déjà débloqué

      let shouldUnlock = false;

      switch (achievement.condition) {
        case 'complete_1_course':
          shouldUnlock = stats.completedCourses >= 1;
          break;
        case 'streak_7_days':
          shouldUnlock = stats.currentStreak >= 7;
          break;
        case 'score_100_percent':
          shouldUnlock = progress.some(p => p.score === 100);
          break;
      }

      if (shouldUnlock) {
        achievement.unlockedAt = new Date().toISOString();
        console.log(`🏆 Achievement débloqué: ${achievement.name} pour ${userId}`);
      }
    });
  }
}

// Instance singleton
export const progressTracker = new ProgressTracker();

export default ProgressTracker;
