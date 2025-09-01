/**
 * Service de gestion du tableau de bord d'apprentissage - Phase 4
 * Orchestration des données utilisateur et recommandations personnalisées
 */

import { writable, derived, type Writable } from 'svelte/store';
import type { 
	LearnerProfile, 
	AdaptiveLearningPath,
	Achievement,
	EngagementTrend,
	CompetenceLevel,
	LearningRecommendation,
	LearningSession,
	ProgressAnalytics
} from '../types/pedagogy';

/**
 * Interface pour les métriques de performance
 */
interface PerformanceMetrics {
	weekly_progress: number;
	monthly_progress: number;
	accuracy_trend: number[];
	engagement_score: number;
	difficulty_adaptation: number;
	learning_velocity: number;
	retention_rate: number;
	session_quality: number;
}

/**
 * Interface pour les insights comportementaux
 */
interface BehavioralInsights {
	optimal_learning_times: string[];
	attention_patterns: {
		peak_focus_duration: number;
		decline_indicators: string[];
		recovery_strategies: string[];
	};
	learning_style_evolution: {
		visual_tendency: number;
		auditory_tendency: number;
		kinesthetic_tendency: number;
		reading_tendency: number;
	};
	motivation_drivers: string[];
	challenge_preference: 'low' | 'moderate' | 'high' | 'adaptive';
}

/**
 * Interface pour les recommandations contextuelles
 */
interface ContextualRecommendations {
	immediate_actions: LearningRecommendation[];
	weekly_goals: LearningRecommendation[];
	long_term_objectives: LearningRecommendation[];
	skill_building: LearningRecommendation[];
	metacognitive_development: LearningRecommendation[];
}

/**
 * Classe principale du service Dashboard
 */
class DashboardService {
	private static instance: DashboardService;
	
	// Stores réactifs
	public readonly currentProfile: Writable<LearnerProfile | null>;
	public readonly performanceMetrics: Writable<PerformanceMetrics>;
	public readonly behavioralInsights: Writable<BehavioralInsights>;
	public readonly recommendations: Writable<ContextualRecommendations>;
	public readonly learningStreaks: Writable<{ current: number; longest: number; }>;
	public readonly recentSessions: Writable<LearningSession[]>;

	// Stores dérivés pour l'analyse
	public readonly overallProgress: Writable<number>;
	public readonly competenceRadar: Writable<{ [key: string]: number }>;
	public readonly motivationLevel: Writable<number>;
	public readonly nextMilestones: Writable<string[]>;

	private constructor() {
		// Initialisation des stores
		this.currentProfile = writable<LearnerProfile | null>(null);
		this.performanceMetrics = writable<PerformanceMetrics>({
			weekly_progress: 0,
			monthly_progress: 0,
			accuracy_trend: [],
			engagement_score: 0,
			difficulty_adaptation: 0,
			learning_velocity: 0,
			retention_rate: 0,
			session_quality: 0
		});

		this.behavioralInsights = writable<BehavioralInsights>({
			optimal_learning_times: [],
			attention_patterns: {
				peak_focus_duration: 0,
				decline_indicators: [],
				recovery_strategies: []
			},
			learning_style_evolution: {
				visual_tendency: 0,
				auditory_tendency: 0,
				kinesthetic_tendency: 0,
				reading_tendency: 0
			},
			motivation_drivers: [],
			challenge_preference: 'moderate'
		});

		this.recommendations = writable<ContextualRecommendations>({
			immediate_actions: [],
			weekly_goals: [],
			long_term_objectives: [],
			skill_building: [],
			metacognitive_development: []
		});

		this.learningStreaks = writable({ current: 0, longest: 0 });
		this.recentSessions = writable<LearningSession[]>([]);
		this.overallProgress = writable(0);
		this.competenceRadar = writable({});
		this.motivationLevel = writable(0);
		this.nextMilestones = writable([]);

		// Configuration des stores dérivés
		this.setupDerivedStores();
	}

	/**
	 * Obtient l'instance singleton
	 */
	public static getInstance(): DashboardService {
		if (!DashboardService.instance) {
			DashboardService.instance = new DashboardService();
		}
		return DashboardService.instance;
	}

	/**
	 * Configure les stores dérivés pour l'analyse automatique
	 */
	private setupDerivedStores(): void {
		// Calcul du progrès global
		this.currentProfile.subscribe(profile => {
			if (profile) {
				const competences = Object.values(profile.competence_levels);
				const averageProgress = competences.reduce((sum, comp) => 
					sum + comp.mastery_percentage, 0) / competences.length;
				this.overallProgress.set(averageProgress);

				// Radar des compétences
				const radar = Object.fromEntries(
					Object.entries(profile.competence_levels).map(([key, comp]) => 
						[key, comp.mastery_percentage]
					)
				);
				this.competenceRadar.set(radar);

				// Niveau de motivation
				const motivationScore = (
					profile.motivation_profile.intrinsic_motivation * 0.6 +
					profile.motivation_profile.extrinsic_motivation * 0.4
				) * 20; // Conversion sur 100
				this.motivationLevel.set(motivationScore);

				// Prochains jalons
				const milestones = competences.map(comp => comp.next_milestone);
				this.nextMilestones.set(milestones);
			}
		});
	}

	/**
	 * Charge le profil utilisateur
	 */
	async loadUserProfile(userId: string): Promise<void> {
		try {
			// TODO: Implémenter la récupération depuis Firebase
			console.log('Chargement du profil pour:', userId);
			
			// Simulation de données en attendant l'implémentation Firebase
			const mockProfile = this.generateMockProfile(userId);
			this.currentProfile.set(mockProfile);

			// Analyse des performances
			await this.analyzePerformance(mockProfile);
			
			// Génération des insights comportementaux
			await this.generateBehavioralInsights(mockProfile);
			
			// Création des recommandations
			await this.generateRecommendations(mockProfile);

		} catch (error) {
			console.error('Erreur lors du chargement du profil:', error);
			throw error;
		}
	}

	/**
	 * Analyse les métriques de performance
	 */
	private async analyzePerformance(profile: LearnerProfile): Promise<void> {
		const analytics = profile.learning_analytics;
		
		// Calcul des tendances
		const weeklyProgress = this.calculateWeeklyProgress(profile);
		const monthlyProgress = this.calculateMonthlyProgress(profile);
		const accuracyTrend = this.calculateAccuracyTrend(profile);
		const engagementScore = this.calculateEngagementScore(profile);

		this.performanceMetrics.set({
			weekly_progress: weeklyProgress,
			monthly_progress: monthlyProgress,
			accuracy_trend: accuracyTrend,
			engagement_score: engagementScore,
			difficulty_adaptation: analytics.improvement_rate,
			learning_velocity: analytics.learning_velocity,
			retention_rate: analytics.knowledge_retention,
			session_quality: this.calculateSessionQuality(profile)
		});

		// Mise à jour des streaks
		this.learningStreaks.set({
			current: analytics.streak_current,
			longest: analytics.streak_longest
		});
	}

	/**
	 * Génère les insights comportementaux
	 */
	private async generateBehavioralInsights(profile: LearnerProfile): Promise<void> {
		const insights: BehavioralInsights = {
			optimal_learning_times: profile.learning_analytics.peak_performance_times,
			attention_patterns: {
				peak_focus_duration: profile.learning_analytics.average_session_duration,
				decline_indicators: this.identifyDeclineIndicators(profile),
				recovery_strategies: this.suggestRecoveryStrategies(profile)
			},
			learning_style_evolution: {
				visual_tendency: profile.learning_style.visual,
				auditory_tendency: profile.learning_style.auditory,
				kinesthetic_tendency: profile.learning_style.kinesthetic,
				reading_tendency: profile.learning_style.reading_writing
			},
			motivation_drivers: profile.motivation_profile.motivational_triggers,
			challenge_preference: this.assessChallengePreference(profile)
		};

		this.behavioralInsights.set(insights);
	}

	/**
	 * Génère les recommandations personnalisées
	 */
	private async generateRecommendations(profile: LearnerProfile): Promise<void> {
		const recommendations: ContextualRecommendations = {
			immediate_actions: this.generateImmediateActions(profile),
			weekly_goals: this.generateWeeklyGoals(profile),
			long_term_objectives: this.generateLongTermObjectives(profile),
			skill_building: this.generateSkillBuildingRecommendations(profile),
			metacognitive_development: this.generateMetacognitiveRecommendations(profile)
		};

		this.recommendations.set(recommendations);
	}

	/**
	 * Calcule le progrès hebdomadaire
	 */
	private calculateWeeklyProgress(profile: LearnerProfile): number {
		// Simulation basée sur les données disponibles
		const completionRate = profile.learning_analytics.completion_rate;
		const improvementRate = profile.learning_analytics.improvement_rate;
		return (completionRate * 0.7 + improvementRate * 0.3) * 100;
	}

	/**
	 * Calcule le progrès mensuel
	 */
	private calculateMonthlyProgress(profile: LearnerProfile): number {
		const competences = Object.values(profile.competence_levels);
		const averageProgression = competences.reduce((sum, comp) => 
			sum + comp.progression_rate, 0) / competences.length;
		return averageProgression;
	}

	/**
	 * Calcule la tendance de précision
	 */
	private calculateAccuracyTrend(profile: LearnerProfile): number[] {
		// Simulation d'une tendance sur 7 jours
		const baseAccuracy = profile.learning_analytics.accuracy_rate;
		return Array.from({ length: 7 }, (_, i) => 
			baseAccuracy + (Math.random() - 0.5) * 0.1
		);
	}

	/**
	 * Calcule le score d'engagement
	 */
	private calculateEngagementScore(profile: LearnerProfile): number {
		const streak = profile.learning_analytics.streak_current;
		const sessionCount = profile.learning_analytics.sessions_count;
		const completionRate = profile.learning_analytics.completion_rate;
		
		// Formule d'engagement pondérée
		return Math.min(100, (streak * 10 + sessionCount * 2 + completionRate * 50));
	}

	/**
	 * Calcule la qualité des sessions
	 */
	private calculateSessionQuality(profile: LearnerProfile): number {
		const accuracy = profile.learning_analytics.accuracy_rate;
		const completion = profile.learning_analytics.completion_rate;
		const retention = profile.learning_analytics.knowledge_retention;
		
		return (accuracy * 0.4 + completion * 0.3 + retention * 0.3) * 100;
	}

	/**
	 * Identifie les indicateurs de déclin
	 */
	private identifyDeclineIndicators(profile: LearnerProfile): string[] {
		const indicators: string[] = [];
		
		if (profile.learning_analytics.accuracy_rate < 0.7) {
			indicators.push('Baisse de précision détectée');
		}
		if (profile.learning_analytics.streak_current === 0) {
			indicators.push('Interruption de la routine');
		}
		if (profile.learning_analytics.average_session_duration < 25) {
			indicators.push('Sessions trop courtes');
		}
		
		return indicators;
	}

	/**
	 * Suggère des stratégies de récupération
	 */
	private suggestRecoveryStrategies(profile: LearnerProfile): string[] {
		const strategies: string[] = [];
		
		if (profile.learning_style.dominant_style === 'visual') {
			strategies.push('Utiliser plus de diagrammes et schémas');
		}
		if (profile.motivation_profile.autonomy_preference > 3) {
			strategies.push('Permettre plus de choix dans les activités');
		}
		
		strategies.push('Faire des pauses régulières de 5 minutes');
		strategies.push('Varier les types d\'exercices');
		
		return strategies;
	}

	/**
	 * Évalue la préférence de défi
	 */
	private assessChallengePreference(profile: LearnerProfile): 'low' | 'moderate' | 'high' | 'adaptive' {
		const challengeSeeking = profile.motivation_profile.challenge_seeking;
		const confidence = Object.values(profile.competence_levels)
			.reduce((sum, comp) => sum + comp.confidence_level, 0) / 
			Object.keys(profile.competence_levels).length;
		
		if (challengeSeeking >= 4 && confidence >= 4) return 'high';
		if (challengeSeeking <= 2 || confidence <= 2) return 'low';
		if (challengeSeeking === 3 && confidence === 3) return 'adaptive';
		return 'moderate';
	}

	/**
	 * Génère les actions immédiates recommandées
	 */
	private generateImmediateActions(profile: LearnerProfile): LearningRecommendation[] {
		const actions: LearningRecommendation[] = [];
		
		// Analyse des compétences nécessitant attention
		Object.entries(profile.competence_levels).forEach(([competenceId, competence]) => {
			if (competence.mastery_percentage < 50) {
				actions.push({
					id: `immediate_${competenceId}`,
					title: `Renforcer ${competenceId}`,
					description: `Votre niveau en ${competenceId} nécessite attention immédiate`,
					priority: 'high',
					estimated_duration: 30,
					competence_targeted: competenceId,
					type: 'skill_building',
					adaptive_parameters: {
						difficulty_level: 'easy',
						learning_style_adaptation: profile.learning_style.dominant_style,
						motivation_boosters: ['progress_tracking', 'small_wins']
					}
				});
			}
		});

		// Recommandation métacognitive si nécessaire
		if (profile.metacognitive_development.self_awareness_level < 3) {
			actions.push({
				id: 'immediate_metacog',
				title: 'Développer l\'auto-réflexion',
				description: 'Prenez 10 minutes pour réfléchir à votre apprentissage',
				priority: 'medium',
				estimated_duration: 10,
				competence_targeted: 'metacognition',
				type: 'metacognitive_reflection',
				adaptive_parameters: {
					difficulty_level: 'beginner',
					learning_style_adaptation: profile.learning_style.dominant_style,
					motivation_boosters: ['curiosity', 'self_discovery']
				}
			});
		}

		return actions;
	}

	/**
	 * Génère les objectifs hebdomadaires
	 */
	private generateWeeklyGoals(profile: LearnerProfile): LearningRecommendation[] {
		const goals: LearningRecommendation[] = [];
		
		// Objectif de progression par compétence
		Object.entries(profile.competence_levels).forEach(([competenceId, competence]) => {
			const targetImprovement = Math.min(15, 100 - competence.mastery_percentage);
			goals.push({
				id: `weekly_${competenceId}`,
				title: `Progresser en ${competenceId}`,
				description: `Objectif: +${targetImprovement}% de maîtrise cette semaine`,
				priority: 'medium',
				estimated_duration: 120,
				competence_targeted: competenceId,
				type: 'skill_building',
				adaptive_parameters: {
					difficulty_level: competence.current_level,
					learning_style_adaptation: profile.learning_style.dominant_style,
					motivation_boosters: profile.motivation_profile.reward_preferences
				}
			});
		});

		return goals;
	}

	/**
	 * Génère les objectifs à long terme
	 */
	private generateLongTermObjectives(profile: LearnerProfile): LearningRecommendation[] {
		const objectives: LearningRecommendation[] = [];
		
		// Objectif de développement métacognitif
		objectives.push({
			id: 'longterm_metacog',
			title: 'Devenir un apprenant autonome',
			description: 'Développer vos compétences métacognitives pour un apprentissage plus efficace',
			priority: 'high',
			estimated_duration: 300,
			competence_targeted: 'metacognition',
			type: 'metacognitive_development',
			adaptive_parameters: {
				difficulty_level: 'progressive',
				learning_style_adaptation: profile.learning_style.dominant_style,
				motivation_boosters: ['autonomy', 'mastery', 'purpose']
			}
		});

		return objectives;
	}

	/**
	 * Génère les recommandations de développement de compétences
	 */
	private generateSkillBuildingRecommendations(profile: LearnerProfile): LearningRecommendation[] {
		const recommendations: LearningRecommendation[] = [];
		
		// Identifier les compétences à renforcer
		Object.entries(profile.competence_levels).forEach(([competenceId, competence]) => {
			competence.areas_for_improvement.forEach(area => {
				recommendations.push({
					id: `skill_${competenceId}_${area.replace(/\s+/g, '_')}`,
					title: `Maîtriser ${area}`,
					description: `Approfondir vos connaissances en ${area}`,
					priority: 'medium',
					estimated_duration: 60,
					competence_targeted: competenceId,
					type: 'skill_building',
					adaptive_parameters: {
						difficulty_level: competence.current_level,
						learning_style_adaptation: profile.learning_style.dominant_style,
						motivation_boosters: ['achievement', 'progress_visualization']
					}
				});
			});
		});

		return recommendations;
	}

	/**
	 * Génère les recommandations métacognitives
	 */
	private generateMetacognitiveRecommendations(profile: LearnerProfile): LearningRecommendation[] {
		const recommendations: LearningRecommendation[] = [];
		
		// Développement de l'auto-conscience
		if (profile.metacognitive_development.self_awareness_level < 4) {
			recommendations.push({
				id: 'metacog_self_awareness',
				title: 'Développer l\'auto-conscience',
				description: 'Apprendre à mieux connaître vos forces et faiblesses',
				priority: 'high',
				estimated_duration: 45,
				competence_targeted: 'metacognition',
				type: 'metacognitive_reflection',
				adaptive_parameters: {
					difficulty_level: 'progressive',
					learning_style_adaptation: profile.learning_style.dominant_style,
					motivation_boosters: ['self_discovery', 'insight']
				}
			});
		}

		// Développement des stratégies
		if (profile.metacognitive_development.strategy_knowledge < 4) {
			recommendations.push({
				id: 'metacog_strategies',
				title: 'Enrichir votre boîte à outils',
				description: 'Découvrir de nouvelles stratégies d\'apprentissage',
				priority: 'medium',
				estimated_duration: 30,
				competence_targeted: 'metacognition',
				type: 'strategy_learning',
				adaptive_parameters: {
					difficulty_level: 'intermediate',
					learning_style_adaptation: profile.learning_style.dominant_style,
					motivation_boosters: ['variety', 'effectiveness']
				}
			});
		}

		return recommendations;
	}

	/**
	 * Génère un profil mock pour les tests
	 */
	private generateMockProfile(userId: string): LearnerProfile {
		return {
			user_id: userId,
			created_at: new Date('2025-01-15'),
			updated_at: new Date(),
			demographics: {
				age: 14,
				grade_level: '3ème',
				language: 'fr',
				timezone: 'Europe/Paris'
			},
			learning_style: {
				visual: 80,
				auditory: 40,
				kinesthetic: 65,
				reading_writing: 55,
				dominant_style: 'visual',
				learning_pace: 'fast',
				attention_span: 'long',
				complexity_preference: 'complex'
			},
			competence_levels: {
				'mathematiques': {
					competence_id: 'mathematiques',
					current_level: 'intermediate',
					mastery_percentage: 75,
					last_assessment_date: new Date('2025-08-25'),
					progression_rate: 10.2,
					confidence_level: 4,
					areas_of_strength: ['Géométrie', 'Algèbre'],
					areas_for_improvement: ['Probabilités', 'Analyse'],
					next_milestone: 'Maîtriser les fonctions'
				},
				'francais': {
					competence_id: 'francais',
					current_level: 'advanced',
					mastery_percentage: 88,
					last_assessment_date: new Date('2025-08-20'),
					progression_rate: 5.8,
					confidence_level: 5,
					areas_of_strength: ['Analyse littéraire', 'Expression'],
					areas_for_improvement: ['Grammaire complexe'],
					next_milestone: 'Analyser des œuvres classiques'
				}
			},
			learning_paths: [],
			metacognitive_development: {
				self_awareness_level: 3,
				strategy_knowledge: 4,
				monitoring_skills: 3,
				evaluation_skills: 4,
				reflection_depth_trend: [2, 3, 3, 4, 3, 4, 4],
				journal_entries_count: 15,
				strategies_discovered: [
					{
						type: 'planning',
						description: 'Prise de notes structurées',
						effectiveness: 4,
						context: 'Cours magistraux'
					},
					{
						type: 'reviewing',
						description: 'Résumés et synthèses',
						effectiveness: 4,
						context: 'Révisions'
					}
				],
				metacognitive_vocabulary: ['stratégie', 'monitoring', 'métacognition', 'réflexion']
			},
			motivation_profile: {
				intrinsic_motivation: 4,
				extrinsic_motivation: 3,
				goal_orientation: 'mastery',
				autonomy_preference: 4,
				challenge_seeking: 4,
				persistence_level: 4,
				reward_preferences: ['badges', 'progress_bars'],
				motivational_triggers: ['curiosité', 'défi', 'autonomie']
			},
			achievement_history: [],
			learning_analytics: {
				total_learning_time: 52.3,
				sessions_count: 28,
				average_session_duration: 42,
				streak_current: 7,
				streak_longest: 15,
				completion_rate: 0.82,
				accuracy_rate: 0.76,
				improvement_rate: 0.18,
				engagement_trends: [],
				peak_performance_times: ['15:00-17:00', '19:30-21:00'],
				learning_velocity: 8.5,
				knowledge_retention: 0.85
			}
		};
	}

	/**
	 * Met à jour le profil utilisateur
	 */
	async updateProfile(updates: Partial<LearnerProfile>): Promise<void> {
		this.currentProfile.update(profile => {
			if (!profile) return null;
			return { ...profile, ...updates, updated_at: new Date() };
		});
	}

	/**
	 * Enregistre une nouvelle session d'apprentissage
	 */
	async recordLearningSession(session: LearningSession): Promise<void> {
		this.recentSessions.update(sessions => {
			const newSessions = [session, ...sessions].slice(0, 10); // Garde les 10 dernières
			return newSessions;
		});

		// Mise à jour du profil basée sur la session
		await this.updateProfileFromSession(session);
	}

	/**
	 * Met à jour le profil basé sur une session d'apprentissage
	 */
	private async updateProfileFromSession(session: LearningSession): Promise<void> {
		this.currentProfile.update(profile => {
			if (!profile) return null;

			// Mise à jour des analytics
			const analytics = profile.learning_analytics;
			analytics.total_learning_time += session.duration_minutes;
			analytics.sessions_count += 1;
			analytics.average_session_duration = analytics.total_learning_time / analytics.sessions_count;

			// Mise à jour du streak si la session est récente
			const today = new Date().toDateString();
			const sessionDate = session.start_time.toDateString();
			if (sessionDate === today) {
				analytics.streak_current += 1;
				analytics.streak_longest = Math.max(analytics.streak_longest, analytics.streak_current);
			}

			return { ...profile, learning_analytics: analytics, updated_at: new Date() };
		});
	}

	/**
	 * Obtient les recommandations pour aujourd'hui
	 */
	getTodayRecommendations(): LearningRecommendation[] {
		let todayRecommendations: LearningRecommendation[] = [];
		
		this.recommendations.subscribe(recs => {
			todayRecommendations = [
				...recs.immediate_actions.slice(0, 2),
				...recs.weekly_goals.slice(0, 1),
				...recs.metacognitive_development.slice(0, 1)
			];
		})();

		return todayRecommendations;
	}

	/**
	 * Calcule le score de bien-être d'apprentissage
	 */
	calculateLearningWellness(): number {
		let wellness = 0;
		
		this.currentProfile.subscribe(profile => {
			if (profile) {
				const engagement = this.calculateEngagementScore(profile);
				const progress = Object.values(profile.competence_levels)
					.reduce((sum, comp) => sum + comp.mastery_percentage, 0) / 
					Object.keys(profile.competence_levels).length;
				const motivation = (profile.motivation_profile.intrinsic_motivation + 
					profile.motivation_profile.extrinsic_motivation) * 10;
				const metacognition = (profile.metacognitive_development.self_awareness_level + 
					profile.metacognitive_development.strategy_knowledge) * 12.5;

				wellness = (engagement * 0.3 + progress * 0.3 + motivation * 0.2 + metacognition * 0.2);
			}
		})();

		return Math.round(wellness);
	}
}

// Instance singleton
export const dashboardService = DashboardService.getInstance();

// Exports des stores pour l'utilisation dans les composants
export const {
	currentProfile,
	performanceMetrics,
	behavioralInsights,
	recommendations,
	learningStreaks,
	recentSessions,
	overallProgress,
	competenceRadar,
	motivationLevel,
	nextMilestones
} = dashboardService;
