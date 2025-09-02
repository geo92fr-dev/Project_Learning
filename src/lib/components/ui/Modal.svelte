<!--
  🪟 Modal Component - Atomic Design System
  Composant modal selon DOC_CoPilot_Practices
-->
<script>
  export let open = false;
  export let size = 'md'; // sm, md, lg, xl, full
  export let closeable = true;
  export let backdrop = true; // Fermeture en cliquant sur le backdrop
  export let title = '';
  export let maxWidth = '';

  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { trapFocus } from '$lib/utils/focus-trap.js';

  const dispatch = createEventDispatcher();

  // Classes de taille
  $: sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
  }[size];

  function closeModal() {
    if (closeable) {
      open = false;
      dispatch('close');
    }
  }

  function handleBackdropClick() {
    if (backdrop) {
      closeModal();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && closeable) {
      closeModal();
    }
  }

  // Focus trap quand le modal est ouvert
  $: if (open && typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
  } else if (typeof window !== 'undefined') {
    document.body.style.overflow = '';
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
    on:click={handleBackdropClick}
    on:keydown={(e) => { if (e.key === 'Escape') close(); }}
    role="button"
    tabindex="-1"
    aria-label="Fermer la modal"
  >
    <!-- Modal Container -->
    <div 
      class="relative w-full {sizeClasses} {maxWidth ? maxWidth : ''} bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]"
      style={maxWidth ? `max-width: ${maxWidth}` : ''}
      transition:scale={{ duration: 200, start: 0.95 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      use:trapFocus
    >
      <!-- Header -->
      {#if title || closeable || $$slots.header}
        <header class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div class="flex-1">
            {#if $$slots.header}
              <slot name="header" />
            {:else if title}
              <h2 id="modal-title" class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            {/if}
          </div>
          
          {#if closeable}
            <button
              type="button"
              class="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              on:click={closeModal}
              aria-label="Fermer"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          {/if}
        </header>
      {/if}

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>

      <!-- Footer -->
      {#if $$slots.footer}
        <footer class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <slot name="footer" />
        </footer>
      {/if}
    </div>
  </div>
{/if}
