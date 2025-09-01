<!--
  Composant de Quiz de Pré-évaluation - Phase 4
  Interface adaptative pour l'évaluation du niveau de compétence
-->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { PreEvaluationQuestion } from '$lib/types/pedagogy';
	import {
		preEvaluationService,
		currentQuestion,
		evaluationProgress,
		evaluationState
	} from '$lib/services/preEvaluation';

	// Props
	export let userId: string;
	export let competence: string;
	export let onComplete: (result: any) => void = () => {};
	export let onCancel: () => void = () => {};

	// État local
	let selectedAnswer: string | string[] = '';
	let confidence: 1 | 2 | 3 | 4 | 5 = 3;
	let startTime: number = 0;
	let isLoading = false;
	let showConfidenceSelector = false;
	let timeRemaining = 180; // 3 minutes par défaut
	let timerInterval: NodeJS.Timeout;

	// État réactif
	$: question = $currentQuestion;
	$: progress = $evaluationProgress;
	$: state = $evaluationState;
	$: isMultipleChoice = question?.type === 'multiple_choice';
	$: isTrueFalse = question?.type === 'true_false';
	$: canSubmit = selectedAnswer !== '' && selectedAnswer !== [];

	/**
	 * Initialise l'évaluation au montage du composant
	 */
	onMount(async () => {
		try {
			isLoading = true;
			await preEvaluationService.startPreEvaluation(userId, competence);
			startQuestionTimer();
		} catch (error) {
			console.error('Erreur lors du démarrage de la pré-évaluation:', error);
		} finally {
			isLoading = false;
		}
	});

	/**
	 * Nettoie les ressources au démontage
	 */
	onDestroy(() => {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
	});

	/**
	 * Démarre le timer pour la question actuelle
	 */
	function startQuestionTimer() {
		startTime = Date.now();
		timeRemaining = question?.time_limit ? question.time_limit / 1000 : 180;
		
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		timerInterval = setInterval(() => {
			timeRemaining--;
			if (timeRemaining <= 0) {
				handleTimeOut();
			}
		}, 1000);
	}

	/**
	 * Gère l'expiration du temps pour une question
	 */
	function handleTimeOut() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		
		// Soumission automatique avec réponse vide
		submitAnswer();
	}

	/**
	 * Soumet la réponse et passe à la question suivante
	 */
	async function submitAnswer() {
		if (!question || isLoading) return;

		try {
			isLoading = true;
			const timeTaken = Date.now() - startTime;
			
			await preEvaluationService.submitResponse(
				selectedAnswer,
				timeTaken,
				showConfidenceSelector ? confidence : undefined
			);

			// Vérifier si l'évaluation est terminée
			if (state.isComplete || !state.isActive) {
				const result = preEvaluationService.getCurrentEvaluation();
				if (timerInterval) {
					clearInterval(timerInterval);
				}
				onComplete(result);
			} else {
				// Réinitialiser pour la prochaine question
				resetQuestionState();
				startQuestionTimer();
			}
		} catch (error) {
			console.error('Erreur lors de la soumission:', error);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Réinitialise l'état pour la prochaine question
	 */
	function resetQuestionState() {
		selectedAnswer = '';
		confidence = 3;
		showConfidenceSelector = false;
	}

	/**
	 * Gère la sélection d'une réponse
	 */
	function handleAnswerSelect(answer: string) {
		selectedAnswer = answer;
	}

	/**
	 * Gère la sélection multiple (pour les questions de type ordering/matching)
	 */
	function handleMultipleSelect(answers: string[]) {
		selectedAnswer = answers;
	}

	/**
	 * Affiche/masque le sélecteur de confiance
	 */
	function toggleConfidenceSelector() {
		showConfidenceSelector = !showConfidenceSelector;
	}

	/**
	 * Annule l'évaluation
	 */
	function cancelEvaluation() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		preEvaluationService.resetEvaluation();
		onCancel();
	}

	/**
	 * Formate le temps restant
	 */
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	/**
	 * Obtient la couleur du timer selon le temps restant
	 */
	function getTimerColor(seconds: number): string {
		if (seconds <= 30) return 'text-red-500';
		if (seconds <= 60) return 'text-orange-500';
		return 'text-gray-600';
	}
</script>

<!-- Container principal -->
<div class="pre-evaluation-container max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
	<!-- Header avec progression -->
	<div class="header mb-8">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-2xl font-bold text-gray-800">
				Pré-évaluation : {competence}
			</h2>
			<button
				on:click={cancelEvaluation}
				class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
			>
				Annuler
			</button>
		</div>

		<!-- Barre de progression -->
		<div class="progress-bar bg-gray-200 rounded-full h-3 mb-2">
			<div
				class="progress-fill bg-blue-500 h-3 rounded-full transition-all duration-500"
				style="width: {progress}%"
			></div>
		</div>
		<div class="text-sm text-gray-600 text-center">
			Progression : {Math.round(progress)}%
		</div>
	</div>

	{#if isLoading}
		<!-- État de chargement -->
		<div class="loading-state flex items-center justify-center py-12" transition:fade>
			<div class="text-center">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<p class="text-gray-600">Préparation de votre évaluation...</p>
			</div>
		</div>
	{:else if question}
		<!-- Question active -->
		<div class="question-container" in:slide={{ duration: 300 }}>
			<!-- Timer et métadonnées -->
			<div class="question-meta flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
				<div class="flex items-center space-x-4">
					<span class="difficulty-badge px-3 py-1 rounded-full text-sm font-medium
						{question.difficulty <= 2 ? 'bg-green-100 text-green-800' :
						  question.difficulty <= 3 ? 'bg-yellow-100 text-yellow-800' :
						  'bg-red-100 text-red-800'}">
						Niveau {question.difficulty}/5
					</span>
					<span class="text-sm text-gray-600">
						{question.type === 'multiple_choice' ? 'QCM' :
						 question.type === 'true_false' ? 'Vrai/Faux' :
						 'Question ouverte'}
					</span>
				</div>
				<div class="timer flex items-center space-x-2">
					<svg class="w-5 h-5 {getTimerColor(timeRemaining)}" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
					</svg>
					<span class="font-mono {getTimerColor(timeRemaining)}">
						{formatTime(timeRemaining)}
					</span>
				</div>
			</div>

			<!-- Question -->
			<div class="question-content mb-8">
				<h3 class="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
					{question.question}
				</h3>

				<!-- Options de réponse -->
				<div class="answers-container space-y-3">
					{#if isMultipleChoice && question.options}
						{#each question.options as option, index}
							<label class="answer-option flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
								{selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}">
								<input
									type="radio"
									name="answer"
									value={option}
									bind:group={selectedAnswer}
									class="sr-only"
								/>
								<div class="option-indicator w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center
									{selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}">
									{#if selectedAnswer === option}
										<div class="w-2 h-2 bg-white rounded-full"></div>
									{/if}
								</div>
								<span class="option-text text-gray-700 font-medium">
									{String.fromCharCode(65 + index)}. {option}
								</span>
							</label>
						{/each}
					{:else if isTrueFalse}
						{#each ['Vrai', 'Faux'] as option}
							<label class="answer-option flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
								{selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}">
								<input
									type="radio"
									name="answer"
									value={option}
									bind:group={selectedAnswer}
									class="sr-only"
								/>
								<div class="option-indicator w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center
									{selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}">
									{#if selectedAnswer === option}
										<div class="w-2 h-2 bg-white rounded-full"></div>
									{/if}
								</div>
								<span class="option-text text-gray-700 font-medium">{option}</span>
							</label>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Sélecteur de confiance -->
			<div class="confidence-section mb-6">
				<button
					on:click={toggleConfidenceSelector}
					class="confidence-toggle flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
							d="{showConfidenceSelector ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}" />
					</svg>
					Indiquer votre niveau de confiance (optionnel)
				</button>

				{#if showConfidenceSelector}
					<div class="confidence-selector mt-3 p-4 bg-gray-50 rounded-lg" transition:slide>
						<p class="text-sm text-gray-600 mb-3">À quel point êtes-vous sûr(e) de votre réponse ?</p>
						<div class="confidence-options flex space-x-2">
							{#each [1, 2, 3, 4, 5] as level}
								<label class="confidence-option flex-1 text-center">
									<input
										type="radio"
										name="confidence"
										value={level}
										bind:group={confidence}
										class="sr-only"
									/>
									<div class="confidence-indicator p-2 border-2 rounded-lg cursor-pointer transition-all
										{confidence === level ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'}">
										<div class="text-xs font-semibold">{level}</div>
										<div class="text-xs">
											{level === 1 ? 'Pas sûr' :
											 level === 2 ? 'Peu sûr' :
											 level === 3 ? 'Moyen' :
											 level === 4 ? 'Assez sûr' :
											 'Très sûr'}
										</div>
									</div>
								</label>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Actions -->
			<div class="actions flex justify-between items-center">
				<button
					on:click={cancelEvaluation}
					class="cancel-btn px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
				>
					Arrêter l'évaluation
				</button>

				<button
					on:click={submitAnswer}
					disabled={!canSubmit || isLoading}
					class="submit-btn px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isLoading ? 'Validation...' : 'Valider ma réponse'}
				</button>
			</div>
		</div>
	{:else}
		<!-- État d'attente ou d'erreur -->
		<div class="waiting-state text-center py-12" transition:fade>
			<div class="text-gray-600">
				<svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="text-lg">Préparation de votre prochaine question...</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.pre-evaluation-container {
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.progress-fill {
		background: linear-gradient(90deg, #3b82f6, #1d4ed8);
	}

	.answer-option:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.confidence-indicator {
		transition: all 0.2s ease;
	}

	.confidence-indicator:hover {
		transform: scale(1.05);
	}

	.submit-btn {
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
	}

	.submit-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #1d4ed8, #1e40af);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	/* Animations pour les transitions d'état */
	.question-container {
		animation: slideInRight 0.4s ease-out;
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.pre-evaluation-container {
			margin: 1rem;
			padding: 1rem;
		}

		.question-meta {
			flex-direction: column;
			space-y: 2;
		}

		.actions {
			flex-direction: column;
			space-y: 3;
		}

		.actions button {
			width: 100%;
		}

		.confidence-options {
			flex-direction: column;
			space-y: 2;
		}
	}

	/* Accessibilité */
	@media (prefers-reduced-motion: reduce) {
		.pre-evaluation-container,
		.question-container,
		.answer-option,
		.confidence-indicator,
		.submit-btn {
			animation: none;
			transition: none;
		}
	}

	/* Focus states pour l'accessibilité */
	.answer-option:focus-within {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	.confidence-indicator:focus-within {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	.submit-btn:focus,
	.cancel-btn:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
</style>
