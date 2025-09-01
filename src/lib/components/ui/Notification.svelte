<!--
  🍞 Toast Component - Atomic Design System  
  Composant de notification selon DOC_CoPilot_Practices
-->
<script>
  export let visible = false;
  export let type = 'info'; // info, success, warning, error
  export let title = '';
  export let message = '';
  export let duration = 5000; // Auto-hide après 5s (0 = pas d'auto-hide)
  export let dismissible = true;
  export let position = 'top-right'; // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center

  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let timeout;

  // Classes de position
  $: positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
    'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'
  }[position];

  // Classes de type
  $: typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200'
  }[type];

  // Icônes par type
  $: typeIcon = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }[type];

  // Direction de l'animation selon la position
  $: flyDirection = position.includes('right') ? { x: 300 } : 
                    position.includes('left') ? { x: -300 } :
                    position.includes('top') ? { y: -100 } : { y: 100 };

  function show() {
    visible = true;
    
    if (duration > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        hide();
      }, duration);
    }
  }

  function hide() {
    visible = false;
    clearTimeout(timeout);
    dispatch('dismiss');
  }

  // Méthodes publiques
  export { show, hide };

  // Auto-hide au montage si visible
  $: if (visible && duration > 0) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      hide();
    }, duration);
  }
</script>

{#if visible}
  <div 
    class="{positionClasses}"
    transition:fly={flyDirection}
    role="alert"
    aria-live="polite"
  >
    <div class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border {typeClasses}">
      <div class="p-4">
        <div class="flex items-start">
          <!-- Icône -->
          <div class="flex-shrink-0">
            <span class="text-lg" aria-hidden="true">{typeIcon}</span>
          </div>
          
          <!-- Contenu -->
          <div class="ml-3 w-0 flex-1">
            {#if title}
              <p class="text-sm font-medium">{title}</p>
            {/if}
            {#if message}
              <p class="text-sm {title ? 'mt-1' : ''}">{message}</p>
            {/if}
            <slot />
          </div>
          
          <!-- Bouton de fermeture -->
          {#if dismissible}
            <div class="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                class="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 transition-colors"
                on:click={hide}
                aria-label="Fermer la notification"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Barre de progression pour l'auto-hide -->
      {#if duration > 0 && visible}
        <div class="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div 
            class="h-full bg-current opacity-50 transition-all ease-linear"
            style="animation: progress {duration}ms linear;"
          ></div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
</style>
