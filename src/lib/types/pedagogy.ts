/**
 * Types pour le système pédagogique avancé - Phase 4
 * Innovation pédagogique avec pré-évaluation et métacognition
 */

// ==================== PRÉ-ÉVALUATION ====================

/**
 * Question de pré-évaluation pour calibrer le niveau
 */
export interface PreEvaluationQuestion {
	id: string;
	type: 'multiple_choice' | 'true_false' | 'ordering' | 'matching';
	competence: string; // ID de la compétence évaluée
	difficulty: 1 | 2 | 3 | 4 | 5; // Échelle de difficulté
	question: string;
	options?: string[]; // Pour les QCM
	correct_answer: string | string[]; // Réponse(s) correcte(s)
	explanation: string; // Explication de la réponse
	time_limit?: number; // Temps limite en secondes (optionnel)
	skill_indicators: string[]; // Compétences sous-jacentes testées
}

/**
 * Réponse donnée à une question de pré-évaluation
 */
export interface PreEvaluationResponse {
	question_id: string;
	answer: string | string[];
	time_taken: number; // Temps en millisecondes
	timestamp: Date;
	confidence_level?: 1 | 2 | 3 | 4 | 5; // Niveau de confiance (optionnel)
}

/**
 * Résultat complet d'une pré-évaluation
 */
export interface PreEvaluationResult {
	user_id: string;
	competence: string;
	session_id: string;
	start_time: Date;
	end_time: Date;
	total_duration: number; // Durée totale en millisecondes
	questions: PreEvaluationQuestion[];
	responses: PreEvaluationResponse[];
	score: {
		raw_score: number; // Nombre de bonnes réponses
		percentage: number; // Pourcentage de réussite
		adjusted_score: number; // Score ajusté selon la difficulté
		competence_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	};
	analytics: {
		average_time_per_question: number;
		confidence_correlation: number; // Corrélation confiance/justesse
		difficulty_progression: number[]; // Performance par niveau de difficulté
		recommendations: string[]; // Recommandations pédagogiques
	};
	adaptive_path: AdaptiveLearningPath;
}

// ==================== MÉTACOGNITION ====================

/**
 * Prompt de métacognition pour la réflexion guidée
 */
export interface MetacognitionPrompt {
	id: string;
	type: 'self_assessment' | 'reflection' | 'strategy' | 'monitoring' | 'evaluation';
	trigger: 'before_lesson' | 'during_lesson' | 'after_lesson' | 'after_exercise';
	question: string;
	sub_questions?: string[]; // Questions de suivi
	guidance: string; // Guide pour aider à réfléchir
	expected_elements: string[]; // Éléments attendus dans la réponse
	competence_focus: string; // Compétence principal concernée
}

/**
 * Réponse métacognitive de l'apprenant
 */
export interface MetacognitionResponse {
	prompt_id: string;
	user_id: string;
	session_id: string;
	content: string; // Réponse textuelle de l'élève
	timestamp: Date;
	word_count: number;
	reflection_depth: 1 | 2 | 3 | 4 | 5; // Profondeur de la réflexion (auto-analysée)
	keywords_identified: string[]; // Mots-clés pédagogiques identifiés
	metacognitive_strategies: MetacognitiveStrategy[]; // Stratégies utilisées
}

/**
 * Stratégie métacognitive identifiée
 */
export interface MetacognitiveStrategy {
	type: 'planning' | 'monitoring' | 'evaluating' | 'debugging' | 'reviewing';
	description: string;
	effectiveness: 1 | 2 | 3 | 4 | 5; // Efficacité estimée
	context: string; // Contexte d'application
}

/**
 * Journal d'apprentissage personnel
 */
export interface LearningJournal {
	user_id: string;
	date: Date;
	session_summary: string;
	learning_objectives: string[];
	achievements: string[];
	difficulties_encountered: string[];
	strategies_used: MetacognitiveStrategy[];
	insights: string[];
	next_steps: string[];
	mood_before: 1 | 2 | 3 | 4 | 5; // Humeur avant l'apprentissage
	mood_after: 1 | 2 | 3 | 4 | 5; // Humeur après l'apprentissage
	motivation_level: 1 | 2 | 3 | 4 | 5; // Niveau de motivation
	confidence_change: -2 | -1 | 0 | 1 | 2; // Changement de confiance
}

// ==================== RESSOURCES ADAPTATIVES ====================

/**
 * Chemin d'apprentissage adaptatif
 */
export interface AdaptiveLearningPath {
	user_id: string;
	competence: string;
	current_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	target_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	estimated_completion_time: number; // En heures
	learning_style: LearningStyle;
	recommended_resources: AdaptiveResource[];
	milestones: LearningMilestone[];
	adaptation_triggers: AdaptationTrigger[];
	personalization_factors: PersonalizationFactor[];
}

/**
 * Style d'apprentissage identifié
 */
export interface LearningStyle {
	visual: number; // Score 0-100
	auditory: number; // Score 0-100
	kinesthetic: number; // Score 0-100
	reading_writing: number; // Score 0-100
	dominant_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
	learning_pace: 'slow' | 'normal' | 'fast';
	attention_span: 'short' | 'medium' | 'long'; // En minutes : <15, 15-30, >30
	complexity_preference: 'simple' | 'moderate' | 'complex';
}

/**
 * Ressource adaptative recommandée
 */
export interface AdaptiveResource {
	id: string;
	type: 'lesson' | 'exercise' | 'video' | 'interactive' | 'reading' | 'game';
	title: string;
	description: string;
	difficulty_level: 1 | 2 | 3 | 4 | 5;
	estimated_time: number; // En minutes
	learning_objectives: string[];
	prerequisites: string[]; // Compétences prérequises
	skill_focus: string[]; // Compétences développées
	adaptation_reason: string; // Pourquoi cette ressource est recommandée
	priority: 'low' | 'medium' | 'high' | 'critical';
	content_path: string; // Chemin vers le contenu
	interaction_data?: ResourceInteraction; // Données d'interaction si déjà utilisée
}

/**
 * Étape importante dans le parcours d'apprentissage
 */
export interface LearningMilestone {
	id: string;
	title: string;
	description: string;
	target_date: Date;
	completion_criteria: string[];
	reward_type: 'badge' | 'certificate' | 'unlock' | 'points';
	reward_description: string;
	is_completed: boolean;
	completion_date?: Date;
	effort_required: 'low' | 'medium' | 'high';
	dependencies: string[]; // IDs des prérequis
}

/**
 * Déclencheur d'adaptation du parcours
 */
export interface AdaptationTrigger {
	type: 'performance_drop' | 'mastery_achieved' | 'time_spent' | 'engagement_low' | 'confusion_detected';
	threshold: number; // Seuil de déclenchement
	action: 'increase_difficulty' | 'decrease_difficulty' | 'change_resource_type' | 'add_support' | 'skip_ahead';
	description: string;
	priority: 1 | 2 | 3 | 4 | 5;
}

/**
 * Facteur de personnalisation
 */
export interface PersonalizationFactor {
	factor: 'age' | 'prior_knowledge' | 'interests' | 'goals' | 'time_availability' | 'device_preference';
	value: string | number;
	weight: number; // Importance relative (0-1)
	impact_on_content: string; // Comment ce facteur influence le contenu
}

// ==================== INTERACTION ET ANALYTICS ====================

/**
 * Données d'interaction avec une ressource
 */
export interface ResourceInteraction {
	resource_id: string;
	user_id: string;
	session_id: string;
	start_time: Date;
	end_time?: Date;
	total_time: number; // Temps total en millisecondes
	completion_percentage: number; // Pourcentage de completion
	interactions: InteractionEvent[];
	final_score?: number; // Score final si applicable
	feedback_given?: string; // Feedback donné par l'utilisateur
	difficulty_perceived: 1 | 2 | 3 | 4 | 5; // Difficulté perçue
	engagement_level: 1 | 2 | 3 | 4 | 5; // Niveau d'engagement
	would_recommend: boolean; // Recommanderait à un autre élève
}

/**
 * Événement d'interaction pendant l'apprentissage
 */
export interface InteractionEvent {
	timestamp: Date;
	type: 'click' | 'scroll' | 'pause' | 'replay' | 'skip' | 'answer' | 'hint_request' | 'help_request';
	target: string; // Élément interagi
	value?: string | number; // Valeur associée
	context: string; // Contexte de l'interaction
}

/**
 * Profil d'apprentissage complet
 */
export interface LearnerProfile {
	user_id: string;
	created_at: Date;
	updated_at: Date;
	demographics: {
		age?: number;
		grade_level: string;
		language: string;
		timezone: string;
	};
	learning_style: LearningStyle;
	competence_levels: { [competence: string]: CompetenceLevel };
	learning_paths: AdaptiveLearningPath[];
	metacognitive_development: MetacognitiveDevelopment;
	motivation_profile: MotivationProfile;
	achievement_history: Achievement[];
	learning_analytics: LearningAnalytics;
}

/**
 * Niveau de compétence dans un domaine
 */
export interface CompetenceLevel {
	competence_id: string;
	current_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	mastery_percentage: number; // 0-100
	last_assessment_date: Date;
	progression_rate: number; // Vitesse de progression
	confidence_level: 1 | 2 | 3 | 4 | 5;
	areas_of_strength: string[];
	areas_for_improvement: string[];
	next_milestone: string;
}

/**
 * Développement métacognitif
 */
export interface MetacognitiveDevelopment {
	self_awareness_level: 1 | 2 | 3 | 4 | 5;
	strategy_knowledge: 1 | 2 | 3 | 4 | 5;
	monitoring_skills: 1 | 2 | 3 | 4 | 5;
	evaluation_skills: 1 | 2 | 3 | 4 | 5;
	reflection_depth_trend: number[]; // Évolution dans le temps
	journal_entries_count: number;
	strategies_discovered: MetacognitiveStrategy[];
	metacognitive_vocabulary: string[]; // Vocabulaire métacognitif maîtrisé
}

/**
 * Profil de motivation
 */
export interface MotivationProfile {
	intrinsic_motivation: 1 | 2 | 3 | 4 | 5;
	extrinsic_motivation: 1 | 2 | 3 | 4 | 5;
	goal_orientation: 'mastery' | 'performance' | 'mixed';
	autonomy_preference: 1 | 2 | 3 | 4 | 5;
	challenge_seeking: 1 | 2 | 3 | 4 | 5;
	persistence_level: 1 | 2 | 3 | 4 | 5;
	reward_preferences: ('badges' | 'points' | 'certificates' | 'progress_bars' | 'leaderboards')[];
	motivational_triggers: string[]; // Ce qui motive le plus l'apprenant
}

/**
 * Réalisation/accomplissement
 */
export interface Achievement {
	id: string;
	title: string;
	description: string;
	type: 'competence_mastery' | 'streak' | 'challenge_completion' | 'improvement' | 'collaboration';
	difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
	earned_date: Date;
	associated_competence?: string;
	evidence: string; // Preuve de l'accomplissement
	sharing_preference: 'private' | 'friends' | 'public';
}

/**
 * Analytics d'apprentissage
 */
export interface LearningAnalytics {
	total_learning_time: number; // En heures
	sessions_count: number;
	average_session_duration: number; // En minutes
	streak_current: number; // Jours consécutifs
	streak_longest: number; // Plus longue série
	completion_rate: number; // Taux de completion global
	accuracy_rate: number; // Taux de justesse global
	improvement_rate: number; // Taux d'amélioration
	engagement_trends: EngagementTrend[];
	peak_performance_times: string[]; // Heures optimales de performance
	learning_velocity: number; // Vitesse d'acquisition des compétences
	knowledge_retention: number; // Taux de rétention des connaissances
}

/**
 * Tendance d'engagement
 */
export interface EngagementTrend {
	date: Date;
	engagement_score: number; // 0-100
	time_spent: number; // En minutes
	activities_completed: number;
	mood_reported?: 1 | 2 | 3 | 4 | 5;
	factors: string[]; // Facteurs influençant l'engagement ce jour
}

// ==================== FEEDBACK ET RECOMMANDATIONS ====================

/**
 * Feedback adaptatif généré par le système
 */
export interface AdaptiveFeedback {
	user_id: string;
	context: 'exercise_completion' | 'lesson_end' | 'milestone_reached' | 'difficulty_adjustment';
	type: 'congratulations' | 'encouragement' | 'guidance' | 'challenge' | 'reflection_prompt';
	content: string;
	personalization_elements: string[]; // Éléments personnalisés utilisés
	expected_impact: 'motivation_boost' | 'confidence_building' | 'skill_improvement' | 'engagement_increase';
	delivery_method: 'immediate' | 'delayed' | 'summary' | 'reminder';
	timestamp: Date;
	user_reaction?: 'positive' | 'neutral' | 'negative'; // Réaction de l'utilisateur
}

/**
 * Recommandation de contenu personnalisée
 */
export interface ContentRecommendation {
	user_id: string;
	resource_id: string;
	reason: string;
	confidence_score: number; // 0-1
	personalization_factors: PersonalizationFactor[];
	expected_outcomes: string[];
	alternative_resources: string[]; // Autres options possibles
	time_sensitivity: 'immediate' | 'soon' | 'flexible';
	generated_at: Date;
	accepted?: boolean; // Si l'utilisateur a accepté la recommandation
	feedback?: string; // Feedback sur la recommandation
}
