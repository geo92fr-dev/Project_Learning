<script lang="ts">
  import { onMount } from "svelte";
  import { pedagogy, pedagogyState, unreadInsights } from "$lib/stores/pedagogy.js";

  // Props
  export let courseId: string = "demo-course";
  export let phase: 'before' | 'during' | 'after' = 'before';
  export let autoStart: boolean = false;

  // État local
  let currentPrompt: any = null;
  let response: string = "";
  let confidence: number = 3;
  let showModal = false;

  // Stores réactifs
  $: currentPedagogyState = $pedagogyState;
  $: activePrompts = currentPedagogyState.activePrompts;
  $: insights = $unreadInsights;

  // Lifecycle
  onMount(() => {
    if (autoStart) {
      startReflection();
    }
  });

  // Fonctions
  async function startReflection() {
    await pedagogy.metacognition.startReflectionSession(courseId, phase);
    showModal = true;
  }

  async function submitResponse() {
    if (currentPrompt && response.trim()) {
      await pedagogy.metacognition.recordMetacognitionResponse(
        currentPrompt.id,
        response,
        confidence
      );
      
      // Réinitialiser pour la prochaine question
      response = "";
      confidence = 3;
      
      // Passer au prompt suivant s'il y en a
      if (activePrompts.length === 0) {
        showModal = false;
      }
    }
  }

  function skipPrompt() {
    if (currentPrompt) {
      pedagogy.metacognition.recordMetacognitionResponse(
        currentPrompt.id,
        "Passé",
        confidence
      );
      response = "";
      confidence = 3;
    }
  }

  function closeModal() {
    showModal = false;
    pedagogy.toggleModal('metacognition');
  }

  // Réactivité - Obtenir le prompt actuel
  $: if (activePrompts.length > 0) {
    currentPrompt = activePrompts[0];
  } else {
    currentPrompt = null;
  }

  // Formater le type de phase
  function formatPhase(phase: string): string {
    const phases = {
      before: "Avant l'apprentissage",
      during: "Pendant l'apprentissage",
      after: "Après l'apprentissage"
    };
    return phases[phase] || phase;
  }

  // Obtenir l'icône selon la phase
  function getPhaseIcon(phase: string): string {
    const icons = {
      before: "🎯",
      during: "🧠", 
      after: "🎉"
    };
    return icons[phase] || "💭";
  }

  // Validation de la réponse
  $: isResponseValid = response.trim().length >= (currentPrompt?.minLength || 10);
</script>

<!-- Déclencheur -->
{#if !showModal && !currentPedagogyState.showMetacognitionModal}
  <div class="metacognition-trigger">
    <button 
      class="btn btn-outline btn-sm gap-2"
      on:click={startReflection}
    >
      <span>{getPhaseIcon(phase)}</span>
      Réflexion {phase}
    </button>
  </div>
{/if}

<!-- Modal de métacognition -->
{#if showModal || currentPedagogyState.showMetacognitionModal}
  <div class="modal modal-open">
    <div class="modal-box max-w-4xl">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="font-bold text-xl flex items-center gap-2">
            <span class="text-2xl">{getPhaseIcon(phase)}</span>
            Réflexion métacognitive
          </h3>
          <p class="text-base-content/70">
            {formatPhase(phase)} • {activePrompts.length} question(s) restante(s)
          </p>
        </div>
        
        <button 
          class="btn btn-sm btn-circle btn-ghost"
          on:click={closeModal}
        >
          ✕
        </button>
      </div>

      {#if currentPrompt}
        <!-- Progression -->
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span>Progression</span>
            <span>{5 - activePrompts.length}/5</span>
          </div>
          <progress 
            class="progress progress-primary w-full" 
            value={5 - activePrompts.length} 
            max="5"
          ></progress>
        </div>

        <!-- Question de réflexion -->
        <div class="bg-base-200 rounded-lg p-6 mb-6">
          <div class="mb-4">
            <span class="badge badge-primary mb-2">
              {currentPrompt.category}
            </span>
            <span class="badge badge-outline">
              {currentPrompt.type}
            </span>
          </div>
          
          <h4 class="text-lg font-semibold mb-4">
            {currentPrompt.question}
          </h4>

          <!-- Zone de réponse -->
          {#if currentPrompt.expectedResponseType === 'text'}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Votre réflexion :</span>
                <span class="label-text-alt text-xs">
                  {response.length}/{currentPrompt.minLength || 50} caractères min.
                </span>
              </label>
              <textarea 
                class="textarea textarea-bordered h-32 resize-none"
                placeholder="Prenez le temps de réfléchir et d'écrire vos pensées..."
                bind:value={response}
                maxlength="1000"
              ></textarea>
            </div>

          {:else if currentPrompt.expectedResponseType === 'scale'}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Évaluez sur une échelle de 1 à 5 :</span>
              </label>
              <div class="flex items-center gap-4">
                <span class="text-sm">Pas du tout</span>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  bind:value={response}
                  class="range range-primary flex-1"
                  step="1"
                />
                <span class="text-sm">Énormément</span>
              </div>
              <div class="flex w-full justify-between text-xs px-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <div class="text-center mt-2">
                <span class="badge badge-primary">Valeur: {response || 3}</span>
              </div>
            </div>

          {:else if currentPrompt.expectedResponseType === 'multiple-choice' && currentPrompt.options}
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Sélectionnez vos réponses :</span>
              </label>
              <div class="space-y-2">
                {#each currentPrompt.options as option, index}
                  <label class="cursor-pointer flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      class="checkbox checkbox-primary"
                      value={option}
                      on:change={(e) => {
                        if (e.target.checked) {
                          response = response ? response + `, ${option}` : option;
                        } else {
                          response = response.split(', ').filter(r => r !== option).join(', ');
                        }
                      }}
                    />
                    <span>{option}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Niveau de confiance -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Niveau de confiance dans votre réponse :</span>
            </label>
            <div class="flex items-center gap-4">
              <span class="text-sm">Peu sûr</span>
              <input 
                type="range" 
                min="1" 
                max="5" 
                bind:value={confidence}
                class="range range-accent flex-1"
                step="1"
              />
              <span class="text-sm">Très sûr</span>
            </div>
            <div class="flex w-full justify-between text-xs px-2">
              <span>😕</span>
              <span>😐</span>
              <span>🙂</span>
              <span>😊</span>
              <span>😄</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between">
          <button 
            class="btn btn-ghost"
            on:click={skipPrompt}
          >
            Passer
          </button>
          
          <div class="flex gap-2">
            <button 
              class="btn btn-outline"
              on:click={closeModal}
            >
              Terminer plus tard
            </button>
            
            <button 
              class="btn btn-primary"
              disabled={!isResponseValid}
              on:click={submitResponse}
            >
              {activePrompts.length === 1 ? 'Terminer' : 'Suivant'}
              →
            </button>
          </div>
        </div>

      {:else}
        <!-- Aucun prompt disponible -->
        <div class="text-center py-8">
          <div class="text-6xl mb-4">✅</div>
          <h4 class="text-xl font-semibold mb-2">Réflexion terminée !</h4>
          <p class="text-base-content/70 mb-6">
            Merci d'avoir pris le temps de réfléchir sur votre apprentissage.
          </p>
          <button 
            class="btn btn-primary"
            on:click={closeModal}
          >
            Continuer l'apprentissage
          </button>
        </div>
      {/if}
    </div>
    
    <!-- Overlay -->
    <label class="modal-backdrop" for="metacognition-modal">
      <button on:click={closeModal}>close</button>
    </label>
  </div>
{/if}

<!-- Widget d'insights (si disponibles) -->
{#if insights.length > 0}
  <div class="insights-widget fixed bottom-4 right-4 z-40">
    <div class="card bg-primary text-primary-content shadow-lg">
      <div class="card-body p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">💡</span>
          <span class="font-semibold text-sm">Nouveau insight</span>
        </div>
        <p class="text-xs mb-3">
          {insights[0].title}
        </p>
        <button 
          class="btn btn-xs btn-primary-content"
          on:click={() => pedagogy.showInsights()}
        >
          Voir détails
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-box {
    max-height: 90vh;
    overflow-y: auto;
  }

  .textarea {
    resize: vertical;
    min-height: 120px;
  }

  .range {
    height: 0.5rem;
  }

  .insights-widget {
    animation: slideInUp 0.3s ease-out;
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

  /* Responsive */
  @media (max-width: 768px) {
    .modal-box {
      margin: 0;
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
    }
    
    .insights-widget {
      bottom: 1rem;
      right: 1rem;
      left: 1rem;
    }
  }
</style>
