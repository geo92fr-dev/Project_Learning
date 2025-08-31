<script lang="ts">
  import { onMount } from "svelte";
  import { pedagogy, pedagogyState } from "$lib/stores/pedagogy.js";
  import AssessmentWidget from "$lib/components/pedagogy/AssessmentWidget.svelte";
  import MetacognitionWidget from "$lib/components/pedagogy/MetacognitionWidget.svelte";

  // État local
  let currentDemo = "assessment"; // 'assessment', 'metacognition', 'adaptive'
  let userId = "demo-user-" + Date.now();

  // Lifecycle
  onMount(() => {
    // Initialiser le système pédagogique
    pedagogy.initializeForUser(userId);
  });

  // Stores réactifs  
  $: currentPedagogyState = $pedagogyState;
  $: insights = currentPedagogyState.recentInsights;

  // Fonctions de démonstration
  function switchDemo(demoType: string) {
    currentDemo = demoType;
    // Réinitialiser l'état pour la nouvelle démo
    pedagogy.reset();
    pedagogy.initializeForUser(userId);
  }

  function simulateProgress() {
    // Simuler du progrès d'apprentissage
    pedagogy.adaptive.updateProgress({
      courseId: "javascript-basics",
      conceptsMastered: ["variables"],
      conceptsInProgress: ["functions"],
      conceptsNotStarted: ["arrays", "objects"],
      totalTimeSpent: 120,
      completionRate: 0.3,
      strugglingConcepts: ["arrays"],
      confidenceLevels: {
        variables: 4,
        functions: 2,
        arrays: 1
      }
    });

    // Générer des insights de démonstration
    pedagogy.metacognition.generateInsights();
  }

  function generateDemoInsights() {
    // Simuler la génération d'insights
    setTimeout(() => {
      pedagogy.metacognition.generateInsights();
    }, 1000);
  }
</script>

<svelte:head>
  <title>Phase 2.5 : Pédagogie Avancée - Démo</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <!-- En-tête -->
  <header class="text-center mb-12">
    <div class="mb-4">
      <span class="text-6xl">🧠</span>
    </div>
    <h1 class="text-4xl font-bold mb-4">
      Phase 2.5 : Pédagogie Avancée
    </h1>
    <p class="text-xl text-base-content/70 max-w-2xl mx-auto">
      Découvrez les fonctionnalités d'apprentissage adaptatif : pré-évaluation, métacognition et ressources personnalisées
    </p>
  </header>

  <!-- Navigation des démos -->
  <div class="tabs tabs-boxed justify-center mb-8">
    <button 
      class="tab {currentDemo === 'assessment' ? 'tab-active' : ''}"
      on:click={() => switchDemo('assessment')}
    >
      🎯 Pré-évaluation
    </button>
    <button 
      class="tab {currentDemo === 'metacognition' ? 'tab-active' : ''}"
      on:click={() => switchDemo('metacognition')}
    >
      💭 Métacognition
    </button>
    <button 
      class="tab {currentDemo === 'adaptive' ? 'tab-active' : ''}"
      on:click={() => switchDemo('adaptive')}
    >
      🎓 Ressources Adaptatives
    </button>
  </div>

  <!-- Contenu des démos -->
  <div class="demo-content">
    {#if currentDemo === 'assessment'}
      <!-- Démo Pré-évaluation -->
      <div class="mb-8">
        <div class="bg-base-200 rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-bold mb-4">🎯 Système de Pré-évaluation</h2>
          <p class="text-base-content/70 mb-4">
            Le système évalue automatiquement le niveau de l'apprenant et adapte le contenu en conséquence.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4 mb-6">
            <div class="stat bg-base-100 rounded-lg">
              <div class="stat-figure text-primary">
                <span class="text-2xl">📊</span>
              </div>
              <div class="stat-title">Questions</div>
              <div class="stat-value text-lg">Adaptatives</div>
              <div class="stat-desc">Niveau ajusté automatiquement</div>
            </div>
            
            <div class="stat bg-base-100 rounded-lg">
              <div class="stat-figure text-secondary">
                <span class="text-2xl">🎯</span>
              </div>
              <div class="stat-title">Recommandations</div>
              <div class="stat-value text-lg">Personnalisées</div>
              <div class="stat-desc">Basées sur les résultats</div>
            </div>
            
            <div class="stat bg-base-100 rounded-lg">
              <div class="stat-figure text-accent">
                <span class="text-2xl">📈</span>
              </div>
              <div class="stat-title">Parcours</div>
              <div class="stat-value text-lg">Optimisé</div>
              <div class="stat-desc">Séquence adaptée</div>
            </div>
          </div>
        </div>

        <!-- Widget d'évaluation -->
        <AssessmentWidget domain="javascript" questionCount={3} />
      </div>

    {:else if currentDemo === 'metacognition'}
      <!-- Démo Métacognition -->
      <div class="mb-8">
        <div class="bg-base-200 rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-bold mb-4">💭 Système de Métacognition</h2>
          <p class="text-base-content/70 mb-4">
            Aide les apprenants à réfléchir sur leur processus d'apprentissage à travers des questions de réflexion.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4 mb-6">
            <div class="card bg-base-100">
              <div class="card-body p-4 text-center">
                <span class="text-3xl mb-2">🎯</span>
                <h3 class="font-semibold">Avant</h3>
                <p class="text-sm text-base-content/70">
                  Objectifs et stratégies
                </p>
              </div>
            </div>
            
            <div class="card bg-base-100">
              <div class="card-body p-4 text-center">
                <span class="text-3xl mb-2">🧠</span>
                <h3 class="font-semibold">Pendant</h3>
                <p class="text-sm text-base-content/70">
                  Auto-évaluation continue
                </p>
              </div>
            </div>
            
            <div class="card bg-base-100">
              <div class="card-body p-4 text-center">
                <span class="text-3xl mb-2">🎉</span>
                <h3 class="font-semibold">Après</h3>
                <p class="text-sm text-base-content/70">
                  Bilan et planification
                </p>
              </div>
            </div>
          </div>

          <!-- Boutons de démonstration -->
          <div class="flex flex-wrap gap-2 justify-center">
            <MetacognitionWidget courseId="demo-course" phase="before" />
            <MetacognitionWidget courseId="demo-course" phase="during" />
            <MetacognitionWidget courseId="demo-course" phase="after" />
          </div>
        </div>

        <!-- Simulation d'insights -->
        <div class="card bg-base-100 mb-6">
          <div class="card-body">
            <h3 class="card-title">💡 Insights Générés</h3>
            <p class="text-base-content/70 mb-4">
              Le système analyse les réflexions pour identifier des patterns et générer des conseils personnalisés.
            </p>
            
            <button 
              class="btn btn-primary btn-sm"
              on:click={generateDemoInsights}
            >
              Générer des insights de démonstration
            </button>

            {#if insights.length > 0}
              <div class="mt-4 space-y-2">
                {#each insights as insight}
                  <div class="alert alert-info">
                    <span class="text-lg">💡</span>
                    <div>
                      <h4 class="font-semibold">{insight.title}</h4>
                      <p class="text-sm">{insight.description}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>

    {:else if currentDemo === 'adaptive'}
      <!-- Démo Ressources Adaptatives -->
      <div class="mb-8">
        <div class="bg-base-200 rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-bold mb-4">🎓 Ressources Adaptatives</h2>
          <p class="text-base-content/70 mb-4">
            Le contenu s'adapte automatiquement au style d'apprentissage, au niveau et aux difficultés de l'apprenant.
          </p>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="stat bg-base-100 rounded-lg">
              <div class="stat-figure text-primary">
                <span class="text-2xl">👁️</span>
              </div>
              <div class="stat-title text-xs">Style</div>
              <div class="stat-value text-sm">Visuel</div>
            </div>
            
            <div class="stat bg-base-100 rounded-lg">
              <div class="stat-figure text-secondary">
                <span class="text-2xl">✋</span>
              </div>
              <div class="stat-title text-xs">Style</div>
              <div class="stat-value text-sm">Kinesthésique</div>
            </div>
            
            <div class="stat bg-base-100 rounded-lg">
              <div class="stat-figure text-accent">
                <span class="text-2xl">👂</span>
              </div>
              <div class="stat-title text-xs">Style</div>
              <div class="stat-value text-sm">Auditif</div>
            </div>
            
            <div class="stat bg-base-100 rounded-lg">
              <div class="stat-figure text-warning">
                <span class="text-2xl">📖</span>
              </div>
              <div class="stat-title text-xs">Style</div>
              <div class="stat-value text-sm">Lecture</div>
            </div>
          </div>

          <button 
            class="btn btn-primary"
            on:click={simulateProgress}
          >
            Simuler un profil d'apprentissage
          </button>
        </div>

        <!-- Affichage du progrès simulé -->
        {#if currentPedagogyState.currentProgress}
          <div class="card bg-base-100 mb-6">
            <div class="card-body">
              <h3 class="card-title">📊 Profil d'Apprentissage Actuel</h3>
              
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Progression -->
                <div>
                  <h4 class="font-semibold mb-2">🎯 Progression</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span>Concepts maîtrisés</span>
                      <span class="badge badge-success">{currentPedagogyState.currentProgress.conceptsMastered.length}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>En cours</span>
                      <span class="badge badge-warning">{currentPedagogyState.currentProgress.conceptsInProgress.length}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Difficultés</span>
                      <span class="badge badge-error">{currentPedagogyState.currentProgress.strugglingConcepts.length}</span>
                    </div>
                    <progress 
                      class="progress progress-primary w-full" 
                      value={currentPedagogyState.currentProgress.completionRate * 100} 
                      max="100"
                    ></progress>
                  </div>
                </div>

                <!-- Niveaux de confiance -->
                <div>
                  <h4 class="font-semibold mb-2">💪 Niveaux de Confiance</h4>
                  <div class="space-y-2">
                    {#each Object.entries(currentPedagogyState.currentProgress.confidenceLevels) as [concept, level]}
                      <div class="flex justify-between items-center">
                        <span class="capitalize">{concept}</span>
                        <div class="flex gap-1">
                          {#each Array(5) as _, i}
                            <span class="text-lg">
                              {i < level ? '⭐' : '☆'}
                            </span>
                          {/each}
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- Ressources recommandées -->
        <div class="card bg-base-100">
          <div class="card-body">
            <h3 class="card-title">📚 Ressources Adaptées</h3>
            <p class="text-base-content/70 mb-4">
              Basées sur votre profil, voici les ressources recommandées :
            </p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Ressource visuelle -->
              <div class="card bg-base-200">
                <div class="card-body p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">👁️</span>
                    <span class="badge badge-primary">Visuel</span>
                  </div>
                  <h4 class="font-semibold text-sm">Diagrammes interactifs</h4>
                  <p class="text-xs text-base-content/70">
                    Visualisations pour mieux comprendre les concepts
                  </p>
                </div>
              </div>

              <!-- Ressource pratique -->
              <div class="card bg-base-200">
                <div class="card-body p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">✋</span>
                    <span class="badge badge-secondary">Pratique</span>
                  </div>
                  <h4 class="font-semibold text-sm">Exercices interactifs</h4>
                  <p class="text-xs text-base-content/70">
                    Apprentissage par la pratique et l'expérimentation
                  </p>
                </div>
              </div>

              <!-- Support supplémentaire -->
              <div class="card bg-base-200">
                <div class="card-body p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">🆘</span>
                    <span class="badge badge-warning">Support</span>
                  </div>
                  <h4 class="font-semibold text-sm">Aide pour les tableaux</h4>
                  <p class="text-xs text-base-content/70">
                    Ressources supplémentaires pour les concepts difficiles
                  </p>
                </div>
              </div>

              <!-- Défi avancé -->
              <div class="card bg-base-200">
                <div class="card-body p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">🚀</span>
                    <span class="badge badge-accent">Défi</span>
                  </div>
                  <h4 class="font-semibold text-sm">Projets avancés</h4>
                  <p class="text-xs text-base-content/70">
                    Pour les concepts déjà maîtrisés
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Retour à l'accueil -->
  <div class="text-center mt-12">
    <a href="/" class="btn btn-outline">
      ← Retour à l'accueil
    </a>
  </div>
</div>

<style>
  .tabs {
    margin: 0 auto;
    max-width: fit-content;
  }

  .demo-content {
    min-height: 60vh;
  }

  .stat {
    padding: 1rem;
    box-shadow: none;
  }

  .card {
    box-shadow: none;
    border: 1px solid hsl(var(--b3));
  }

  .alert {
    padding: 0.75rem;
  }

  /* Animations */
  .demo-content > div {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .tabs {
      width: 100%;
    }
    
    .tab {
      flex: 1;
      font-size: 0.875rem;
    }
  }
</style>
