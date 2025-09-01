<!--
  Composant de Prompts Métacognitifs - Phase 4
  Interface pour la réflexion guidée et le développement de la métacognition
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import type { MetacognitionPrompt, MetacognitionResponse } from '$lib/types/pedagogy';
	import {
		metacognitionService,
		activePrompt,
		currentResponse,
		metacognitionInsights
	} from '$lib/services/metacognition';

	// Props
	export let userId: string;
	export let sessionId: string;
	export let competence: string;
	export let trigger: 'before_lesson' | 'during_lesson' | 'after_lesson' | 'after_exercise';
	export let userLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'intermediate';
	export let onResponse: (response: MetacognitionResponse) => void = () => {};
	export let onSkip: () => void = () => {};
	export let autoShow: boolean = true;

	// État local
	let isVisible = false;
	let isExpanded = false;
	let responseText = '';
	let isSubmitting = false;
	let showGuidance = false;
	let wordCount = 0;
	let estimatedDepth = 1;
	let showInsights = false;

	// État réactif
	$: prompt = $activePrompt;
	$: insights = $metacognitionInsights;
	$: canSubmit = responseText.trim().length >= 10; // Minimum 10 caractères
	$: {
		// Calculer le nombre de mots et estimer la profondeur
		const words = responseText.trim().split(/\s+/).filter(w => w.length > 0);
		wordCount = words.length;
		estimatedDepth = Math.min(5, Math.max(1, Math.floor(wordCount / 25) + 1));
	}

	/**
	 * Initialise le composant et propose un prompt
	 */
	onMount(async () => {
		if (autoShow) {
			await proposePrompt();
		}
	});

	/**
	 * Propose un nouveau prompt métacognitif
	 */
	async function proposePrompt() {
		try {
			const newPrompt = await metacognitionService.proposePrompt(
				trigger,
				competence,
				userId,
				userLevel
			);
			
			if (newPrompt) {
				isVisible = true;
				responseText = '';
				showGuidance = false;
			}
		} catch (error) {
			console.error('Erreur lors de la proposition de prompt:', error);
		}
	}

	/**
	 * Soumet la réponse métacognitive
	 */
	async function submitResponse() {
		if (!canSubmit || isSubmitting) return;

		try {
			isSubmitting = true;
			const response = await metacognitionService.submitResponse(
				userId,
				sessionId,
				responseText
			);

			if (response) {
				onResponse(response);
				responseText = '';
				isVisible = false;
				isExpanded = false;
			}
		} catch (error) {
			console.error('Erreur lors de la soumission:', error);
		} finally {
			isSubmitting = false;
		}
	}

	/**
	 * Passe le prompt (skip)
	 */
	function skipPrompt() {
		metacognitionService.resetActivePrompt();
		responseText = '';
		isVisible = false;
		isExpanded = false;
		onSkip();
	}

	/**
	 * Expand/collapse le composant
	 */
	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	/**
	 * Affiche/masque les conseils
	 */
	function toggleGuidance() {
		showGuidance = !showGuidance;
	}

	/**
	 * Affiche/masque les insights métacognitifs
	 */
	function toggleInsights() {
		showInsights = !showInsights;
	}

	/**
	 * Ferme le composant
	 */
	function close() {
		isVisible = false;
		isExpanded = false;
		responseText = '';
	}

	/**
	 * Obtient la couleur selon le type de prompt
	 */
	function getPromptTypeColor(type: string): string {
		switch (type) {
			case 'self_assessment': return 'bg-blue-100 text-blue-800';
			case 'reflection': return 'bg-purple-100 text-purple-800';
			case 'strategy': return 'bg-green-100 text-green-800';
			case 'monitoring': return 'bg-orange-100 text-orange-800';
			case 'evaluation': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	/**
	 * Obtient l'icône selon le type de prompt
	 */
	function getPromptTypeIcon(type: string): string {
		switch (type) {
			case 'self_assessment': return '🔍';
			case 'reflection': return '💭';
			case 'strategy': return '🎯';
			case 'monitoring': return '📊';
			case 'evaluation': return '✅';
			default: return '💡';
		}
	}
</script>

{#if isVisible && prompt}
	<!-- Container principal -->
	<div 
		class="metacognition-prompt fixed bottom-4 right-4 max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
		transition:slide={{ duration: 300 }}
	>
		<!-- Header compacte -->
		{#if !isExpanded}
			<button type="button" class="prompt-header flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors w-full text-left"
				 on:click={toggleExpanded}
				 aria-label="Développer le prompt de métacognition"
				 aria-expanded={isExpanded}>
				<div class="flex items-center space-x-3">
					<div class="prompt-icon text-2xl">
						{getPromptTypeIcon(prompt.type)}
					</div>
					<div>
						<h4 class="font-medium text-gray-800">Moment de réflexion</h4>
						<p class="text-sm text-gray-600">Cliquez pour réfléchir...</p>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<span class="prompt-type px-2 py-1 rounded-full text-xs font-medium {getPromptTypeColor(prompt.type)}">
						Réflexion
					</span>
					<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</button>
		{/if}

		<!-- Interface expanded -->
		{#if isExpanded}
			<div class="prompt-expanded" transition:fade={{ duration: 200 }}>
				<!-- Header expanded -->
				<div class="prompt-header-expanded flex items-center justify-between p-4 border-b border-gray-100">
					<div class="flex items-center space-x-3">
						<div class="prompt-icon text-2xl">
							{getPromptTypeIcon(prompt.type)}
						</div>
						<div>
							<h4 class="font-medium text-gray-800">Temps de réflexion</h4>
							<span class="prompt-type px-2 py-1 rounded-full text-xs font-medium {getPromptTypeColor(prompt.type)}">
								{prompt.type === 'self_assessment' ? 'Auto-évaluation' :
								 prompt.type === 'reflection' ? 'Réflexion' :
								 prompt.type === 'strategy' ? 'Stratégie' :
								 prompt.type === 'monitoring' ? 'Monitoring' :
								 prompt.type === 'evaluation' ? 'Évaluation' : 'Réflexion'}
							</span>
						</div>
					</div>
					<div class="flex items-center space-x-2">
						<button 
							on:click={toggleInsights}
							class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
							title="Voir mes progrès métacognitifs"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</button>
						<button 
							on:click={close}
							class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<!-- Insights métacognitifs -->
				{#if showInsights}
					<div class="insights-panel p-4 bg-gray-50 border-b border-gray-100" transition:slide>
						<h5 class="text-sm font-medium text-gray-700 mb-2">Vos progrès métacognitifs</h5>
						<div class="insights-grid grid grid-cols-2 gap-2 text-xs">
							<div class="insight-item bg-white p-2 rounded">
								<div class="font-medium text-blue-600">{insights.totalReflections}</div>
								<div class="text-gray-600">Réflexions</div>
							</div>
							<div class="insight-item bg-white p-2 rounded">
								<div class="font-medium text-green-600">{insights.averageDepth.toFixed(1)}/5</div>
								<div class="text-gray-600">Profondeur moy.</div>
							</div>
							<div class="insight-item bg-white p-2 rounded">
								<div class="font-medium text-purple-600">{insights.strategiesCount}</div>
								<div class="text-gray-600">Stratégies</div>
							</div>
							<div class="insight-item bg-white p-2 rounded">
								<div class="font-medium text-orange-600">
									{insights.reflectionTrend.length > 0 ? 
									  insights.reflectionTrend[insights.reflectionTrend.length - 1] : 0}/5
								</div>
								<div class="text-gray-600">Dernier niveau</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Question principale -->
				<div class="prompt-question p-4">
					<h5 class="text-lg font-semibold text-gray-800 mb-3 leading-relaxed">
						{prompt.question}
					</h5>

					<!-- Questions de suivi -->
					{#if prompt.sub_questions && prompt.sub_questions.length > 0}
						<div class="sub-questions mb-4">
							<p class="text-sm text-gray-600 mb-2">Pour vous aider à réfléchir :</p>
							<ul class="text-sm text-gray-700 space-y-1">
								{#each prompt.sub_questions as subQuestion}
									<li class="flex items-start space-x-2">
										<span class="text-gray-400 mt-1">•</span>
										<span>{subQuestion}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Zone de réponse -->
					<div class="response-area">
						<textarea
							bind:value={responseText}
							placeholder="Prenez le temps de réfléchir et partagez vos pensées..."
							class="response-textarea w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							maxlength="1000"
						></textarea>

						<!-- Métadonnées de la réponse -->
						<div class="response-meta flex justify-between items-center mt-2 text-xs text-gray-500">
							<div class="flex items-center space-x-4">
								<span>{wordCount} mots</span>
								<span>Profondeur estimée: {estimatedDepth}/5</span>
							</div>
							<span>{responseText.length}/1000</span>
						</div>
					</div>

					<!-- Conseils -->
					<div class="guidance-section mt-4">
						<button 
							on:click={toggleGuidance}
							class="guidance-toggle flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
									d="{showGuidance ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}" />
							</svg>
							Conseils pour réfléchir
						</button>

						{#if showGuidance}
							<div class="guidance-content mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800" transition:slide>
								<p>{prompt.guidance}</p>
								{#if prompt.expected_elements.length > 0}
									<div class="mt-2">
										<p class="font-medium mb-1">Éléments à considérer :</p>
										<ul class="text-blue-700 space-y-1">
											{#each prompt.expected_elements as element}
												<li class="flex items-start space-x-2">
													<span class="text-blue-400 mt-1">•</span>
													<span>{element.replace('_', ' ')}</span>
												</li>
											{/each}
										</ul>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<!-- Actions -->
				<div class="prompt-actions flex justify-between items-center p-4 bg-gray-50 rounded-b-xl">
					<button
						on:click={skipPrompt}
						class="skip-btn px-4 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
					>
						Passer pour l'instant
					</button>

					<button
						on:click={submitResponse}
						disabled={!canSubmit || isSubmitting}
						class="submit-btn px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSubmitting ? 'Envoi...' : 'Partager ma réflexion'}
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.metacognition-prompt {
		animation: slideInUp 0.4s ease-out;
	}

	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.response-textarea {
		font-family: inherit;
		line-height: 1.5;
	}

	.response-textarea:focus {
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.prompt-header:hover {
		background: linear-gradient(135deg, #f9fafb, #f3f4f6);
	}

	.submit-btn {
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
	}

	.submit-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #1d4ed8, #1e40af);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.insight-item {
		transition: all 0.2s ease;
	}

	.insight-item:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	/* Responsive design */
	@media (max-width: 640px) {
		.metacognition-prompt {
			position: fixed;
			bottom: 0;
			right: 0;
			left: 0;
			max-width: none;
			margin: 0;
			border-radius: 1rem 1rem 0 0;
		}

		.insights-grid {
			grid-template-columns: 1fr 1fr;
		}

		.response-textarea {
			height: 6rem;
		}

		.prompt-actions {
			flex-direction: column;
			gap: 0.5rem;
		}

		.prompt-actions button {
			width: 100%;
		}
	}

	/* Accessibilité */
	@media (prefers-reduced-motion: reduce) {
		.metacognition-prompt,
		.insight-item,
		.submit-btn {
			animation: none;
			transition: none;
		}
	}

	/* Focus states pour l'accessibilité */
	.response-textarea:focus,
	.submit-btn:focus,
	.skip-btn:focus,
	.guidance-toggle:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	/* Indicateur de profondeur visuelle */
	.response-textarea {
		background-image: 
			linear-gradient(transparent 1.4em, #f3f4f6 1.4em, #f3f4f6 1.5em, transparent 1.5em),
			linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px);
		background-size: 100% 1.5em, 3em 100%;
		background-position: 0 0, 2em 0;
		line-height: 1.5em;
	}
</style>
