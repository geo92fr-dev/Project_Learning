/**
 * Service de pré-évaluation adaptative - Phase 4
 * Algorithme d'évaluation du niveau et adaptation de la difficulté
 */

import type {
	PreEvaluationQuestion,
	PreEvaluationResponse,
	PreEvaluationResult,
	AdaptiveLearningPath,
	LearningStyle
} from '$lib/types/pedagogy';
import { writable, derived, get } from 'svelte/store';

// ==================== STORES ====================

export const currentPreEvaluation = writable<PreEvaluationResult | null>(null);
export const currentQuestion = writable<PreEvaluationQuestion | null>(null);
export const responses = writable<PreEvaluationResponse[]>([]);
export const evaluationProgress = writable<number>(0);

// Store dérivé pour l'état de l'évaluation
export const evaluationState = derived(
	[currentPreEvaluation, currentQuestion, evaluationProgress],
	([$preEval, $question, $progress]) => ({
		isActive: $preEval !== null,
		currentQuestion: $question,
		progress: $progress,
		isComplete: $progress >= 100
	})
);

// ==================== CONFIGURATION ÉVALUATION ====================

interface EvaluationConfig {
	minQuestions: number;
	maxQuestions: number;
	targetAccuracy: number; // Seuil de précision pour arrêter
	adaptiveThreshold: number; // Seuil pour adapter la difficulté
	timeoutPerQuestion: number; // Temps limite par question (ms)
	difficultyProgression: number[]; // Progression de la difficulté
}

const DEFAULT_CONFIG: EvaluationConfig = {
	minQuestions: 5,
	maxQuestions: 15,
	targetAccuracy: 0.8, // 80% de précision
	adaptiveThreshold: 0.3, // Adapter si <30% ou >70%
	timeoutPerQuestion: 180000, // 3 minutes
	difficultyProgression: [1, 2, 2, 3, 3, 3, 4, 4, 5] // Progression intelligente
};

// ==================== ALGORITHME D'ADAPTATION ====================

class AdaptiveAlgorithm {
	private static instance: AdaptiveAlgorithm;
	private difficultyHistory: number[] = [];
	private accuracyHistory: number[] = [];

	static getInstance(): AdaptiveAlgorithm {
		if (!AdaptiveAlgorithm.instance) {
			AdaptiveAlgorithm.instance = new AdaptiveAlgorithm();
		}
		return AdaptiveAlgorithm.instance;
	}

	/**
	 * Calcule la prochaine difficulté basée sur les performances
	 * Utilise un algorithme inspiré de l'Item Response Theory (IRT)
	 */
	calculateNextDifficulty(
		currentResponses: PreEvaluationResponse[],
		questionHistory: PreEvaluationQuestion[]
	): number {
		if (currentResponses.length === 0) {
			return 2; // Commencer par difficulté moyenne
		}

		// Calcul de la précision récente (3 dernières questions)
		const recentResponses = currentResponses.slice(-3);
		const recentQuestions = questionHistory.slice(-3);
		const recentAccuracy = this.calculateAccuracy(recentResponses, recentQuestions);

		// Calcul de la précision globale
		const globalAccuracy = this.calculateAccuracy(currentResponses, questionHistory);

		// Facteur temps - pénalise les réponses trop longues
		const timeFactor = this.calculateTimeFactor(recentResponses);

		// Algorithme d'adaptation adaptatif
		let difficultyAdjustment = 0;

		if (recentAccuracy > 0.8 && timeFactor > 0.7) {
			// Performance excellente -> augmenter difficulté
			difficultyAdjustment = +1;
		} else if (recentAccuracy > 0.6 && timeFactor > 0.5) {
			// Performance bonne -> légère augmentation
			difficultyAdjustment = +0.5;
		} else if (recentAccuracy < 0.4 || timeFactor < 0.3) {
			// Performance faible -> diminuer difficulté
			difficultyAdjustment = -1;
		} else if (recentAccuracy < 0.6) {
			// Performance modérée -> légère diminution
			difficultyAdjustment = -0.5;
		}

		// Calcul de la difficulté cible
		const currentDifficulty = questionHistory[questionHistory.length - 1]?.difficulty || 2;
		const targetDifficulty = Math.max(1, Math.min(5, currentDifficulty + difficultyAdjustment));

		// Lissage pour éviter les variations brutales
		return this.smoothDifficultyTransition(targetDifficulty, currentDifficulty);
	}

	/**
	 * Calcule la précision des réponses
	 */
	private calculateAccuracy(
		responses: PreEvaluationResponse[],
		questions: PreEvaluationQuestion[]
	): number {
		if (responses.length === 0) return 0;

		let correct = 0;
		responses.forEach((response, index) => {
			const question = questions[index];
			if (question && this.isCorrectAnswer(response.answer, question.correct_answer)) {
				correct++;
			}
		});

		return correct / responses.length;
	}

	/**
	 * Calcule un facteur basé sur le temps de réponse
	 */
	private calculateTimeFactor(responses: PreEvaluationResponse[]): number {
		if (responses.length === 0) return 1;

		const avgTime = responses.reduce((sum, r) => sum + r.time_taken, 0) / responses.length;
		const optimalTime = 60000; // 1 minute considérée comme optimale

		// Facteur entre 0 et 1, optimal autour de 1 minute
		if (avgTime <= optimalTime) {
			return Math.min(1, avgTime / optimalTime);
		} else {
			return Math.max(0.2, optimalTime / avgTime);
		}
	}

	/**
	 * Lisse les transitions de difficulté pour éviter les sauts brutaux
	 */
	private smoothDifficultyTransition(target: number, current: number): number {
		const maxChange = 1; // Changement maximum par question
		const change = target - current;

		if (Math.abs(change) <= maxChange) {
			return Math.round(target);
		} else {
			return current + (change > 0 ? maxChange : -maxChange);
		}
	}

	/**
	 * Vérifie si une réponse est correcte
	 */
	private isCorrectAnswer(userAnswer: string | string[], correctAnswer: string | string[]): boolean {
		if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
			// Réponses multiples (tri, matching)
			if (userAnswer.length !== correctAnswer.length) return false;
			return userAnswer.every((answer, index) => answer === correctAnswer[index]);
		} else if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
			// Réponse simple
			return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
		}
		return false;
	}

	/**
	 * Détermine le niveau de compétence basé sur les performances
	 */
	determineCompetenceLevel(result: PreEvaluationResult): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
		const { percentage, adjusted_score } = result.score;
		const avgDifficulty = result.questions.reduce((sum, q) => sum + q.difficulty, 0) / result.questions.length;

		// Algorithme de classification basé sur le score et la difficulté
		if (percentage >= 80 && avgDifficulty >= 4) {
			return 'expert';
		} else if (percentage >= 70 && avgDifficulty >= 3) {
			return 'advanced';
		} else if (percentage >= 60 && avgDifficulty >= 2) {
			return 'intermediate';
		} else {
			return 'beginner';
		}
	}
}

// ==================== GÉNÉRATION DE QUESTIONS ====================

class QuestionGenerator {
	private static instance: QuestionGenerator;
	private questionBank: Map<string, PreEvaluationQuestion[]> = new Map();

	static getInstance(): QuestionGenerator {
		if (!QuestionGenerator.instance) {
			QuestionGenerator.instance = new QuestionGenerator();
		}
		return QuestionGenerator.instance;
	}

	/**
	 * Génère une question adaptée à la difficulté et compétence
	 */
	generateQuestion(
		competence: string,
		targetDifficulty: number,
		excludeIds: string[] = []
	): PreEvaluationQuestion | null {
		const questions = this.getQuestionsForCompetence(competence);
		
		// Filtrer par difficulté (±1 niveau de tolérance)
		const suitableQuestions = questions.filter(
			q => 
				Math.abs(q.difficulty - targetDifficulty) <= 1 && 
				!excludeIds.includes(q.id)
		);

		if (suitableQuestions.length === 0) {
			return null;
		}

		// Sélection pondérée par la difficulté exacte
		const weightedQuestions = suitableQuestions.map(q => ({
			question: q,
			weight: 1 - Math.abs(q.difficulty - targetDifficulty) * 0.2
		}));

		return this.selectWeightedRandom(weightedQuestions);
	}

	/**
	 * Sélectionne une question avec pondération
	 */
	private selectWeightedRandom(
		weightedQuestions: { question: PreEvaluationQuestion; weight: number }[]
	): PreEvaluationQuestion {
		const totalWeight = weightedQuestions.reduce((sum, item) => sum + item.weight, 0);
		let random = Math.random() * totalWeight;

		for (const item of weightedQuestions) {
			random -= item.weight;
			if (random <= 0) {
				return item.question;
			}
		}

		return weightedQuestions[0].question;
	}

	/**
	 * Récupère les questions pour une compétence (simulation)
	 */
	private getQuestionsForCompetence(competence: string): PreEvaluationQuestion[] {
		// TODO: Remplacer par appel à Firebase/API
		return this.generateMockQuestions(competence);
	}

	/**
	 * Génère des questions de test (à remplacer par vraies données)
	 */
	private generateMockQuestions(competence: string): PreEvaluationQuestion[] {
		const baseQuestions: PreEvaluationQuestion[] = [
			{
				id: `${competence}_q1`,
				type: 'multiple_choice',
				competence,
				difficulty: 1,
				question: "Quelle est la valeur de 5 + 3 ?",
				options: ["6", "7", "8", "9"],
				correct_answer: "8",
				explanation: "5 + 3 = 8, c'est une addition simple.",
				skill_indicators: ["addition_simple"]
			},
			{
				id: `${competence}_q2`,
				type: 'multiple_choice',
				competence,
				difficulty: 2,
				question: "Combien fait 15 × 4 ?",
				options: ["45", "50", "60", "65"],
				correct_answer: "60",
				explanation: "15 × 4 = 60. On peut calculer 15 × 4 = (10 + 5) × 4 = 40 + 20 = 60.",
				skill_indicators: ["multiplication", "decomposition"]
			},
			{
				id: `${competence}_q3`,
				type: 'multiple_choice',
				competence,
				difficulty: 3,
				question: "Quelle est la fraction équivalente à 3/6 ?",
				options: ["1/2", "2/3", "1/3", "3/4"],
				correct_answer: "1/2",
				explanation: "3/6 peut être simplifiée en divisant le numérateur et le dénominateur par 3 : 3÷3 = 1 et 6÷3 = 2, donc 1/2.",
				skill_indicators: ["fractions", "simplification"]
			},
			{
				id: `${competence}_q4`,
				type: 'multiple_choice',
				competence,
				difficulty: 4,
				question: "Résolvez l'équation : 2x + 5 = 13",
				options: ["x = 3", "x = 4", "x = 5", "x = 6"],
				correct_answer: "x = 4",
				explanation: "2x + 5 = 13 → 2x = 13 - 5 → 2x = 8 → x = 4",
				skill_indicators: ["equation_lineaire", "algebra"]
			},
			{
				id: `${competence}_q5`,
				type: 'multiple_choice',
				competence,
				difficulty: 5,
				question: "Quelle est la dérivée de f(x) = x³ + 2x² - 5x + 3 ?",
				options: ["3x² + 4x - 5", "x² + 4x - 5", "3x² + 2x - 5", "3x² + 4x + 5"],
				correct_answer: "3x² + 4x - 5",
				explanation: "La dérivée de x³ est 3x², de 2x² est 4x, de -5x est -5, et la dérivée d'une constante est 0.",
				skill_indicators: ["derivation", "polynomes", "calcul_differentiel"]
			}
		];

		return baseQuestions;
	}
}

// ==================== SERVICE PRINCIPAL ====================

export class PreEvaluationService {
	private static instance: PreEvaluationService;
	private adaptiveAlgorithm: AdaptiveAlgorithm;
	private questionGenerator: QuestionGenerator;
	private config: EvaluationConfig;

	constructor() {
		this.adaptiveAlgorithm = AdaptiveAlgorithm.getInstance();
		this.questionGenerator = QuestionGenerator.getInstance();
		this.config = DEFAULT_CONFIG;
	}

	static getInstance(): PreEvaluationService {
		if (!PreEvaluationService.instance) {
			PreEvaluationService.instance = new PreEvaluationService();
		}
		return PreEvaluationService.instance;
	}

	/**
	 * Démarre une nouvelle pré-évaluation
	 */
	async startPreEvaluation(userId: string, competence: string): Promise<void> {
		const sessionId = this.generateSessionId();
		
		const evaluation: PreEvaluationResult = {
			user_id: userId,
			competence,
			session_id: sessionId,
			start_time: new Date(),
			end_time: new Date(), // Sera mis à jour à la fin
			total_duration: 0,
			questions: [],
			responses: [],
			score: {
				raw_score: 0,
				percentage: 0,
				adjusted_score: 0,
				competence_level: 'beginner'
			},
			analytics: {
				average_time_per_question: 0,
				confidence_correlation: 0,
				difficulty_progression: [],
				recommendations: []
			},
			adaptive_path: this.createInitialLearningPath(competence)
		};

		currentPreEvaluation.set(evaluation);
		responses.set([]);
		evaluationProgress.set(0);

		// Générer la première question
		await this.generateNextQuestion();
	}

	/**
	 * Soumet une réponse et passe à la question suivante
	 */
	async submitResponse(
		answer: string | string[],
		timeTaken: number,
		confidenceLevel?: 1 | 2 | 3 | 4 | 5
	): Promise<void> {
		const evaluation = get(currentPreEvaluation);
		const question = get(currentQuestion);
		
		if (!evaluation || !question) {
			throw new Error('No active evaluation or question');
		}

		// Créer la réponse
		const response: PreEvaluationResponse = {
			question_id: question.id,
			answer,
			time_taken: timeTaken,
			timestamp: new Date(),
			confidence_level: confidenceLevel
		};

		// Mettre à jour les stores
		const currentResponses = get(responses);
		currentResponses.push(response);
		responses.set(currentResponses);

		evaluation.responses = currentResponses;
		evaluation.questions.push(question);

		// Calculer le progrès
		const progress = Math.min(100, (currentResponses.length / this.config.maxQuestions) * 100);
		evaluationProgress.set(progress);

		// Vérifier si l'évaluation doit continuer
		if (await this.shouldContinueEvaluation()) {
			await this.generateNextQuestion();
		} else {
			await this.completeEvaluation();
		}
	}

	/**
	 * Génère la prochaine question adaptée
	 */
	private async generateNextQuestion(): Promise<void> {
		const evaluation = get(currentPreEvaluation);
		if (!evaluation) return;

		const targetDifficulty = this.adaptiveAlgorithm.calculateNextDifficulty(
			evaluation.responses,
			evaluation.questions
		);

		const excludeIds = evaluation.questions.map(q => q.id);
		const nextQuestion = this.questionGenerator.generateQuestion(
			evaluation.competence,
			targetDifficulty,
			excludeIds
		);

		if (nextQuestion) {
			currentQuestion.set(nextQuestion);
		} else {
			// Plus de questions disponibles
			await this.completeEvaluation();
		}
	}

	/**
	 * Détermine si l'évaluation doit continuer
	 */
	private async shouldContinueEvaluation(): Promise<boolean> {
		const evaluation = get(currentPreEvaluation);
		if (!evaluation) return false;

		const responseCount = evaluation.responses.length;
		
		// Conditions d'arrêt
		if (responseCount < this.config.minQuestions) {
			return true; // Minimum pas atteint
		}

		if (responseCount >= this.config.maxQuestions) {
			return false; // Maximum atteint
		}

		// Calcul de la précision récente
		const recentAccuracy = this.calculateRecentAccuracy(evaluation);
		
		// Arrêter si la précision est stable et élevée
		if (responseCount >= 8 && recentAccuracy >= this.config.targetAccuracy) {
			return false;
		}

		return true;
	}

	/**
	 * Calcule la précision récente
	 */
	private calculateRecentAccuracy(evaluation: PreEvaluationResult): number {
		const recentCount = Math.min(5, evaluation.responses.length);
		if (recentCount === 0) return 0;

		const recentResponses = evaluation.responses.slice(-recentCount);
		const recentQuestions = evaluation.questions.slice(-recentCount);

		let correct = 0;
		recentResponses.forEach((response, index) => {
			const question = recentQuestions[index];
			if (this.isCorrectAnswer(response.answer, question.correct_answer)) {
				correct++;
			}
		});

		return correct / recentCount;
	}

	/**
	 * Complète l'évaluation et calcule les résultats
	 */
	private async completeEvaluation(): Promise<void> {
		const evaluation = get(currentPreEvaluation);
		if (!evaluation) return;

		evaluation.end_time = new Date();
		evaluation.total_duration = evaluation.end_time.getTime() - evaluation.start_time.getTime();

		// Calculer les scores
		this.calculateScores(evaluation);
		
		// Générer les analytics
		this.generateAnalytics(evaluation);
		
		// Créer le chemin d'apprentissage adaptatif
		evaluation.adaptive_path = this.createAdaptiveLearningPath(evaluation);

		// Finaliser
		currentQuestion.set(null);
		evaluationProgress.set(100);
		currentPreEvaluation.set(evaluation);

		// TODO: Sauvegarder en base de données
		console.log('Pré-évaluation complétée:', evaluation);
	}

	/**
	 * Calcule les scores finaux
	 */
	private calculateScores(evaluation: PreEvaluationResult): void {
		const totalQuestions = evaluation.questions.length;
		if (totalQuestions === 0) return;

		let correctAnswers = 0;
		let weightedScore = 0;
		let totalWeight = 0;

		evaluation.responses.forEach((response, index) => {
			const question = evaluation.questions[index];
			const isCorrect = this.isCorrectAnswer(response.answer, question.correct_answer);
			
			if (isCorrect) {
				correctAnswers++;
				weightedScore += question.difficulty;
			}
			totalWeight += question.difficulty;
		});

		evaluation.score = {
			raw_score: correctAnswers,
			percentage: (correctAnswers / totalQuestions) * 100,
			adjusted_score: totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0,
			competence_level: this.adaptiveAlgorithm.determineCompetenceLevel(evaluation)
		};
	}

	/**
	 * Génère les analytics détaillées
	 */
	private generateAnalytics(evaluation: PreEvaluationResult): void {
		const responses = evaluation.responses;
		const questions = evaluation.questions;

		if (responses.length === 0) return;

		// Temps moyen par question
		const avgTime = responses.reduce((sum, r) => sum + r.time_taken, 0) / responses.length;

		// Corrélation confiance/justesse (si confiance fournie)
		const confidenceCorrelation = this.calculateConfidenceCorrelation(responses, questions);

		// Progression de difficulté
		const difficultyProgression = questions.map(q => q.difficulty);

		// Recommandations
		const recommendations = this.generateRecommendations(evaluation);

		evaluation.analytics = {
			average_time_per_question: avgTime,
			confidence_correlation: confidenceCorrelation,
			difficulty_progression: difficultyProgression,
			recommendations
		};
	}

	/**
	 * Calcule la corrélation entre confiance et justesse
	 */
	private calculateConfidenceCorrelation(
		responses: PreEvaluationResponse[],
		questions: PreEvaluationQuestion[]
	): number {
		const pairs = responses
			.map((response, index) => ({
				confidence: response.confidence_level || 3,
				correct: this.isCorrectAnswer(response.answer, questions[index].correct_answer) ? 1 : 0
			}))
			.filter(pair => pair.confidence !== undefined);

		if (pairs.length < 3) return 0;

		// Calcul de corrélation simplifiée
		const avgConfidence = pairs.reduce((sum, p) => sum + p.confidence, 0) / pairs.length;
		const avgCorrect = pairs.reduce((sum, p) => sum + p.correct, 0) / pairs.length;

		let numerator = 0;
		let denominator1 = 0;
		let denominator2 = 0;

		pairs.forEach(pair => {
			const diffConf = pair.confidence - avgConfidence;
			const diffCorr = pair.correct - avgCorrect;
			numerator += diffConf * diffCorr;
			denominator1 += diffConf * diffConf;
			denominator2 += diffCorr * diffCorr;
		});

		const denominator = Math.sqrt(denominator1 * denominator2);
		return denominator === 0 ? 0 : numerator / denominator;
	}

	/**
	 * Génère des recommandations pédagogiques
	 */
	private generateRecommendations(evaluation: PreEvaluationResult): string[] {
		const recommendations: string[] = [];
		const score = evaluation.score;

		if (score.percentage < 50) {
			recommendations.push("Commencer par les concepts fondamentaux");
			recommendations.push("Utiliser des ressources visuelles et interactives");
		} else if (score.percentage < 70) {
			recommendations.push("Renforcer les bases avec des exercices ciblés");
			recommendations.push("Pratiquer régulièrement pour consolider");
		} else if (score.percentage < 85) {
			recommendations.push("Approfondir avec des défis plus complexes");
			recommendations.push("Explorer les applications concrètes");
		} else {
			recommendations.push("Passer aux concepts avancés");
			recommendations.push("Mentorer d'autres apprenants");
		}

		// Recommandations basées sur les analytics
		if (evaluation.analytics.average_time_per_question > 120000) {
			recommendations.push("Travailler la rapidité de calcul");
		}

		if (evaluation.analytics.confidence_correlation < 0.3) {
			recommendations.push("Développer l'auto-évaluation et la métacognition");
		}

		return recommendations;
	}

	/**
	 * Crée un chemin d'apprentissage adaptatif initial
	 */
	private createInitialLearningPath(competence: string): AdaptiveLearningPath {
		// Chemin d'apprentissage par défaut - sera personnalisé après évaluation
		return {
			user_id: '',
			competence,
			current_level: 'beginner',
			target_level: 'intermediate',
			estimated_completion_time: 20,
			learning_style: {
				visual: 50,
				auditory: 25,
				kinesthetic: 15,
				reading_writing: 10,
				dominant_style: 'visual',
				learning_pace: 'normal',
				attention_span: 'medium',
				complexity_preference: 'simple'
			},
			recommended_resources: [],
			milestones: [],
			adaptation_triggers: [],
			personalization_factors: []
		};
	}

	/**
	 * Crée un chemin d'apprentissage adaptatif personnalisé
	 */
	private createAdaptiveLearningPath(evaluation: PreEvaluationResult): AdaptiveLearningPath {
		// TODO: Implémenter la logique complète basée sur les résultats
		const path = this.createInitialLearningPath(evaluation.competence);
		path.user_id = evaluation.user_id;
		path.current_level = evaluation.score.competence_level;
		
		return path;
	}

	/**
	 * Vérifie si une réponse est correcte
	 */
	private isCorrectAnswer(userAnswer: string | string[], correctAnswer: string | string[]): boolean {
		if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
			if (userAnswer.length !== correctAnswer.length) return false;
			return userAnswer.every((answer, index) => answer === correctAnswer[index]);
		} else if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
			return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
		}
		return false;
	}

	/**
	 * Génère un ID de session unique
	 */
	private generateSessionId(): string {
		return `preeval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	/**
	 * Obtient les résultats de l'évaluation actuelle
	 */
	getCurrentEvaluation(): PreEvaluationResult | null {
		return get(currentPreEvaluation);
	}

	/**
	 * Réinitialise l'évaluation
	 */
	resetEvaluation(): void {
		currentPreEvaluation.set(null);
		currentQuestion.set(null);
		responses.set([]);
		evaluationProgress.set(0);
	}
}

// Export de l'instance singleton
export const preEvaluationService = PreEvaluationService.getInstance();
