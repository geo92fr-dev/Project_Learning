<!--
  Dashboard d'Apprentissage - Phase 4
  Interface de suivi personnalisé et recommandations adaptatives
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { 
		LearnerProfile
	} from '$lib/types/pedagogy';
	import { metacognitionInsights } from '$lib/services/metacognition';

	// Props
	export let userId: string;
	export let profile: LearnerProfile | null = null;
	export let onStartPreEvaluation: (competence: string) => void = () => {};
	export let onStartMetacognition: () => void = () => {};

	// État local
	let selectedTimeRange: '7d' | '30d' | '90d' = '30d';
	let showDetails = false;
	let selectedCompetence = '';

	// Données simulées (à remplacer par vraies données)
	let mockProfile: LearnerProfile = {
		user_id: userId,
		created_at: new Date('2025-01-15'),
		updated_at: new Date(),
		demographics: {
			age: 13,
			grade_level: '4ème',
			language: 'fr',
			timezone: 'Europe/Paris'
		},
		learning_style: {
			visual: 75,
			auditory: 45,
			kinesthetic: 60,
			reading_writing: 55,
			dominant_style: 'visual',
			learning_pace: 'normal',
			attention_span: 'medium',
			complexity_preference: 'moderate'
		},
		competence_levels: {
			'mathematiques': {
				competence_id: 'mathematiques',
				current_level: 'intermediate',
				mastery_percentage: 72,
				last_assessment_date: new Date('2025-08-25'),
				progression_rate: 8.5,
				confidence_level: 4,
				areas_of_strength: ['Géométrie', 'Algèbre simple'],
				areas_for_improvement: ['Probabilités', 'Fonctions'],
				next_milestone: 'Maîtriser les équations du second degré'
			},
			'francais': {
				competence_id: 'francais',
				current_level: 'advanced',
				mastery_percentage: 85,
				last_assessment_date: new Date('2025-08-20'),
				progression_rate: 6.2,
				confidence_level: 5,
				areas_of_strength: ['Analyse littéraire', 'Expression écrite'],
				areas_for_improvement: ['Grammaire avancée'],
				next_milestone: 'Rédiger une dissertation complète'
			},
			'sciences': {
				competence_id: 'sciences',
				current_level: 'beginner',
				mastery_percentage: 45,
				last_assessment_date: new Date('2025-08-30'),
				progression_rate: 12.1,
				confidence_level: 3,
				areas_of_strength: ['Observation', 'Expérimentation'],
				areas_for_improvement: ['Théories', 'Calculs scientifiques'],
				next_milestone: 'Comprendre les lois de Newton'
			}
		},
		learning_paths: [],
		metacognitive_development: {
			self_awareness_level: 3,
			strategy_knowledge: 4,
			monitoring_skills: 3,
			evaluation_skills: 4,
			reflection_depth_trend: [2, 3, 3, 4, 3, 4, 4],
			journal_entries_count: 12,
			strategies_discovered: [],
			metacognitive_vocabulary: ['réflexion', 'stratégie', 'monitoring', 'évaluation']
		},
		motivation_profile: {
			intrinsic_motivation: 4,
			extrinsic_motivation: 3,
			goal_orientation: 'mastery',
			autonomy_preference: 4,
			challenge_seeking: 3,
			persistence_level: 4,
			reward_preferences: ['badges', 'progress_bars', 'certificates'],
			motivational_triggers: ['nouveauté', 'défi personnel', 'reconnaissance']
		},
		achievement_history: [
			{
				id: 'ach_001',
				title: 'Premier pas métacognitif',
				description: 'Première réflexion sur votre apprentissage',
				type: 'competence_mastery',
				difficulty: 'bronze',
				earned_date: new Date('2025-08-15'),
				evidence: 'Réflexion de 150 mots sur les stratégies d\'apprentissage',
				sharing_preference: 'friends'
			},
			{
				id: 'ach_002',
				title: 'Explorateur curieux',
				description: 'Exploration de 3 matières différentes',
				type: 'challenge_completion',
				difficulty: 'silver',
				earned_date: new Date('2025-08-20'),
				evidence: 'Activités complétées en mathématiques, français et sciences',
				sharing_preference: 'public'
			}
		],
		learning_analytics: {
			total_learning_time: 45.5,
			sessions_count: 23,
			average_session_duration: 35,
			streak_current: 5,
			streak_longest: 12,
			completion_rate: 0.78,
			accuracy_rate: 0.73,
			improvement_rate: 0.15,
			engagement_trends: [],
			peak_performance_times: ['14:00-16:00', '20:00-21:00'],
			learning_velocity: 7.8,
			knowledge_retention: 0.82
		}
	};

	// État réactif
	$: currentProfile = profile || mockProfile;
	$: insights = $metacognitionInsights;
	$: competences = Object.entries(currentProfile.competence_levels);
	$: recentAchievements = currentProfile.achievement_history.slice(-3);

	/**
	 * Initialise le dashboard
	 */
	onMount(() => {
		loadUserData();
	});

	/**
	 * Charge les données utilisateur
	 */
	async function loadUserData() {
		// TODO: Implémenter le chargement depuis Firebase
		console.log('Chargement du profil utilisateur:', userId);
	}

	/**
	 * Formate le niveau de compétence pour l'affichage
	 */
	function formatLevel(level: string): string {
		const levels = {
			'beginner': 'Débutant',
			'intermediate': 'Intermédiaire',
			'advanced': 'Avancé',
			'expert': 'Expert'
		};
		return levels[level as keyof typeof levels] || level;
	}

	/**
	 * Obtient la couleur selon le niveau de maîtrise
	 */
	function getMasteryColor(percentage: number): string {
		if (percentage >= 80) return 'text-green-600 bg-green-100';
		if (percentage >= 60) return 'text-blue-600 bg-blue-100';
		if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
		return 'text-red-600 bg-red-100';
	}

	/**
	 * Obtient l'emoji selon le niveau de confiance
	 */
	function getConfidenceEmoji(level: number): string {
		const emojis = ['😰', '😕', '😐', '😊', '😎'];
		return emojis[level - 1] || '😐';
	}

	/**
	 * Démarre une pré-évaluation pour une compétence
	 */
	function startPreEval(competence: string) {
		selectedCompetence = competence;
		onStartPreEvaluation(competence);
	}

	/**
	 * Affiche/masque les détails
	 */
	function toggleDetails() {
		showDetails = !showDetails;
	}
</script>

<!-- Container principal -->
<div class="learning-dashboard max-w-6xl mx-auto p-6 space-y-6">
	<!-- Header avec informations utilisateur -->
	<div class="dashboard-header bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
		<div class="flex justify-between items-start">
			<div>
				<h1 class="text-2xl font-bold mb-2">
					Tableau de bord d'apprentissage
				</h1>
				<p class="text-blue-100">
					{currentProfile.demographics.grade_level} • 
					Style dominant: {currentProfile.learning_style.dominant_style} • 
					{currentProfile.learning_analytics.streak_current} jours consécutifs 🔥
				</p>
			</div>
			<div class="dashboard-stats text-right">
				<div class="text-3xl font-bold">
					{Math.round(currentProfile.learning_analytics.completion_rate * 100)}%
				</div>
				<div class="text-blue-100 text-sm">Taux de completion</div>
			</div>
		</div>
	</div>

	<!-- Métriques rapides -->
	<div class="quick-metrics grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="metric-card bg-white rounded-lg p-4 shadow-sm border">
			<div class="flex items-center space-x-3">
				<div class="metric-icon text-2xl">⏱️</div>
				<div>
					<div class="metric-value text-xl font-bold text-gray-800">
						{currentProfile.learning_analytics.total_learning_time}h
					</div>
					<div class="metric-label text-sm text-gray-600">Temps total</div>
				</div>
			</div>
		</div>

		<div class="metric-card bg-white rounded-lg p-4 shadow-sm border">
			<div class="flex items-center space-x-3">
				<div class="metric-icon text-2xl">🎯</div>
				<div>
					<div class="metric-value text-xl font-bold text-gray-800">
						{Math.round(currentProfile.learning_analytics.accuracy_rate * 100)}%
					</div>
					<div class="metric-label text-sm text-gray-600">Précision</div>
				</div>
			</div>
		</div>

		<div class="metric-card bg-white rounded-lg p-4 shadow-sm border">
			<div class="flex items-center space-x-3">
				<div class="metric-icon text-2xl">📈</div>
				<div>
					<div class="metric-value text-xl font-bold text-gray-800">
						{Math.round(currentProfile.learning_analytics.improvement_rate * 100)}%
					</div>
					<div class="metric-label text-sm text-gray-600">Amélioration</div>
				</div>
			</div>
		</div>

		<div class="metric-card bg-white rounded-lg p-4 shadow-sm border">
			<div class="flex items-center space-x-3">
				<div class="metric-icon text-2xl">🧠</div>
				<div>
					<div class="metric-value text-xl font-bold text-gray-800">
						{insights.totalReflections}
					</div>
					<div class="metric-label text-sm text-gray-600">Réflexions</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Compétences principales -->
	<div class="competences-section bg-white rounded-xl p-6 shadow-sm border">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-bold text-gray-800">Mes compétences</h2>
			<button 
				on:click={toggleDetails}
				class="details-toggle text-sm text-blue-600 hover:text-blue-800 transition-colors"
			>
				{showDetails ? 'Masquer détails' : 'Voir détails'}
			</button>
		</div>

		<div class="competences-grid space-y-4">
			{#each competences as [competenceId, competence]}
				<div class="competence-card border rounded-lg p-4 hover:shadow-md transition-shadow">
					<div class="flex justify-between items-start mb-3">
						<div>
							<h3 class="font-semibold text-gray-800 capitalize">
								{competenceId}
							</h3>
							<div class="flex items-center space-x-2 mt-1">
								<span class="level-badge px-2 py-1 rounded-full text-xs font-medium {getMasteryColor(competence.mastery_percentage)}">
									{formatLevel(competence.current_level)}
								</span>
								<span class="confidence text-lg">
									{getConfidenceEmoji(competence.confidence_level)}
								</span>
							</div>
						</div>
						<div class="text-right">
							<div class="mastery-percentage text-2xl font-bold {getMasteryColor(competence.mastery_percentage).split(' ')[0]}">
								{competence.mastery_percentage}%
							</div>
							<div class="text-xs text-gray-500">
								+{competence.progression_rate}% récemment
							</div>
						</div>
					</div>

					<!-- Barre de progression -->
					<div class="progress-bar bg-gray-200 rounded-full h-2 mb-3">
						<div 
							class="progress-fill rounded-full h-2 transition-all duration-500"
							class:bg-green-500={competence.mastery_percentage >= 80}
							class:bg-blue-500={competence.mastery_percentage >= 60 && competence.mastery_percentage < 80}
							class:bg-yellow-500={competence.mastery_percentage >= 40 && competence.mastery_percentage < 60}
							class:bg-red-500={competence.mastery_percentage < 40}
							style="width: {competence.mastery_percentage}%"
						></div>
					</div>

					<!-- Détails étendus -->
					{#if showDetails}
						<div class="competence-details mt-4 pt-4 border-t border-gray-100" transition:slide>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<h4 class="font-medium text-green-700 mb-2">💪 Points forts:</h4>
									<ul class="text-gray-600 space-y-1">
										{#each competence.areas_of_strength as strength}
											<li class="flex items-center space-x-2">
												<span class="text-green-500">•</span>
												<span>{strength}</span>
											</li>
										{/each}
									</ul>
								</div>
								<div>
									<h4 class="font-medium text-orange-700 mb-2">🎯 À améliorer:</h4>
									<ul class="text-gray-600 space-y-1">
										{#each competence.areas_for_improvement as improvement}
											<li class="flex items-center space-x-2">
												<span class="text-orange-500">•</span>
												<span>{improvement}</span>
											</li>
										{/each}
									</ul>
								</div>
							</div>
							<div class="mt-4 p-3 bg-blue-50 rounded-lg">
								<h4 class="font-medium text-blue-800 mb-1">🏁 Prochain objectif:</h4>
								<p class="text-blue-700 text-sm">{competence.next_milestone}</p>
							</div>
							<div class="mt-3 flex space-x-2">
								<button 
									on:click={() => startPreEval(competenceId)}
									class="eval-btn px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
								>
									📋 Évaluation
								</button>
								<button 
									on:click={onStartMetacognition}
									class="metacog-btn px-3 py-2 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors"
								>
									💭 Réflexion
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Développement métacognitif -->
	<div class="metacognition-section bg-white rounded-xl p-6 shadow-sm border">
		<h2 class="text-xl font-bold text-gray-800 mb-4">🧠 Développement métacognitif</h2>
		
		<div class="metacog-grid grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class="metacog-skill text-center">
				<div class="skill-circle mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
					<span class="text-2xl font-bold text-blue-600">
						{currentProfile.metacognitive_development.self_awareness_level}
					</span>
				</div>
				<div class="skill-label text-sm text-gray-600">Auto-conscience</div>
			</div>

			<div class="metacog-skill text-center">
				<div class="skill-circle mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
					<span class="text-2xl font-bold text-green-600">
						{currentProfile.metacognitive_development.strategy_knowledge}
					</span>
				</div>
				<div class="skill-label text-sm text-gray-600">Stratégies</div>
			</div>

			<div class="metacog-skill text-center">
				<div class="skill-circle mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
					<span class="text-2xl font-bold text-orange-600">
						{currentProfile.metacognitive_development.monitoring_skills}
					</span>
				</div>
				<div class="skill-label text-sm text-gray-600">Monitoring</div>
			</div>

			<div class="metacog-skill text-center">
				<div class="skill-circle mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
					<span class="text-2xl font-bold text-purple-600">
						{currentProfile.metacognitive_development.evaluation_skills}
					</span>
				</div>
				<div class="skill-label text-sm text-gray-600">Évaluation</div>
			</div>
		</div>

		<div class="mt-4 p-4 bg-gray-50 rounded-lg">
			<div class="flex justify-between items-center text-sm">
				<span class="text-gray-600">Réflexions dans le journal:</span>
				<span class="font-semibold">{currentProfile.metacognitive_development.journal_entries_count}</span>
			</div>
			<div class="flex justify-between items-center text-sm mt-2">
				<span class="text-gray-600">Vocabulaire métacognitif:</span>
				<span class="font-semibold">{currentProfile.metacognitive_development.metacognitive_vocabulary.length} mots</span>
			</div>
		</div>
	</div>

	<!-- Réalisations récentes -->
	<div class="achievements-section bg-white rounded-xl p-6 shadow-sm border">
		<h2 class="text-xl font-bold text-gray-800 mb-4">🏆 Réalisations récentes</h2>
		
		<div class="achievements-grid grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each recentAchievements as achievement}
				<div class="achievement-card border rounded-lg p-4 hover:shadow-md transition-shadow">
					<div class="flex items-start space-x-3">
						<div class="achievement-badge text-2xl">
							{achievement.difficulty === 'bronze' ? '🥉' :
							 achievement.difficulty === 'silver' ? '🥈' :
							 achievement.difficulty === 'gold' ? '🥇' : '💎'}
						</div>
						<div class="flex-1">
							<h3 class="font-semibold text-gray-800 text-sm">
								{achievement.title}
							</h3>
							<p class="text-gray-600 text-xs mt-1">
								{achievement.description}
							</p>
							<div class="text-xs text-gray-500 mt-2">
								{achievement.earned_date.toLocaleDateString('fr-FR')}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Recommandations personnalisées -->
	<div class="recommendations-section bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border">
		<h2 class="text-xl font-bold text-gray-800 mb-4">💡 Recommandations personnalisées</h2>
		
		<div class="recommendations-list space-y-3">
			<div class="recommendation-item flex items-start space-x-3 p-3 bg-white rounded-lg">
				<span class="text-xl">📚</span>
				<div>
					<h3 class="font-medium text-gray-800">Renforcer les mathématiques</h3>
					<p class="text-sm text-gray-600">Vos probabilités peuvent s'améliorer. Essayez les exercices interactifs.</p>
				</div>
			</div>

			<div class="recommendation-item flex items-start space-x-3 p-3 bg-white rounded-lg">
				<span class="text-xl">🎯</span>
				<div>
					<h3 class="font-medium text-gray-800">Développer l'auto-réflexion</h3>
					<p class="text-sm text-gray-600">Votre métacognition progresse bien. Continuez vos réflexions quotidiennes.</p>
				</div>
			</div>

			<div class="recommendation-item flex items-start space-x-3 p-3 bg-white rounded-lg">
				<span class="text-xl">⚡</span>
				<div>
					<h3 class="font-medium text-gray-800">Optimiser vos horaires</h3>
					<p class="text-sm text-gray-600">Vous êtes plus performant entre 14h-16h. Planifiez les tâches difficiles à ce moment.</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.learning-dashboard {
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.metric-card,
	.competence-card,
	.achievement-card,
	.recommendation-item {
		transition: all 0.2s ease;
	}

	.metric-card:hover,
	.competence-card:hover,
	.achievement-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.progress-fill {
		transition: width 0.8s ease-out;
	}

	.eval-btn,
	.metacog-btn {
		transition: all 0.2s ease;
	}

	.eval-btn:hover,
	.metacog-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.skill-circle {
		transition: all 0.3s ease;
	}

	.skill-circle:hover {
		transform: scale(1.1);
	}

	/* Style pour les badges de niveau */
	.level-badge {
		transition: all 0.2s ease;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.learning-dashboard {
			padding: 1rem;
		}

		.dashboard-header {
			flex-direction: column;
			gap: 0.75rem;
		}

		.dashboard-stats {
			text-align: left;
			margin-top: 1rem;
		}

		.quick-metrics {
			grid-template-columns: 1fr 1fr;
		}

		.metacog-grid {
			grid-template-columns: 1fr 1fr;
		}

		.competence-details .grid {
			grid-template-columns: 1fr;
		}
	}

	/* Accessibilité */
	@media (prefers-reduced-motion: reduce) {
		.learning-dashboard,
		.metric-card,
		.competence-card,
		.achievement-card,
		.progress-fill,
		.skill-circle {
			animation: none;
			transition: none;
		}
	}

	/* Focus states pour l'accessibilité */
	.eval-btn:focus,
	.metacog-btn:focus,
	.details-toggle:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
</style>
