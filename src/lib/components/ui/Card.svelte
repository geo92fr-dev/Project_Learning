<!--
  📋 Card Component - Composant atomique
  Card réutilisable selon DOC_CoPilot_Practices
-->
<script>
  import { createEventDispatcher } from 'svelte';

  // Props
  export let variant = 'default'; // default, elevated, outlined
  export let padding = 'md'; // sm, md, lg
  export let hoverable = false;
  export let clickable = false;
  export let loading = false;
  
  // Events
  const dispatch = createEventDispatcher();
  
  function handleClick(event) {
    if (clickable && !loading) {
      dispatch('click', event);
    }
  }
  
  // Classes dynamiques
  $: cardClasses = [
    'card',
    `card--${variant}`,
    `card--${padding}`,
    hoverable && 'card--hoverable',
    clickable && 'card--clickable',
    loading && 'card--loading',
  ].filter(Boolean).join(' ');
</script>

<div 
  class={cardClasses}
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick(e)}
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : undefined}
>
  {#if loading}
    <div class="card__loading">
      <div class="card__spinner">
        <div class="spinner"></div>
      </div>
      <p class="card__loading-text">Chargement...</p>
    </div>
  {:else}
    <!-- Header slot -->
    {#if $$slots.header}
      <header class="card__header">
        <slot name="header" />
      </header>
    {/if}
    
    <!-- Main content -->
    <div class="card__content">
      <slot />
    </div>
    
    <!-- Footer slot -->
    {#if $$slots.footer}
      <footer class="card__footer">
        <slot name="footer" />
      </footer>
    {/if}
  {/if}
</div>

<style>
  /* ===== BASE CARD ===== */
  .card {
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  /* ===== VARIANTS ===== */
  .card--default {
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }
  
  .card--elevated {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
  
  .card--outlined {
    box-shadow: none;
    border: 2px solid #e5e7eb;
  }
  
  /* ===== STATES ===== */
  .card--hoverable:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  .card--clickable {
    cursor: pointer;
  }
  
  .card--clickable:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .card--clickable:active {
    transform: scale(0.98);
  }
  
  .card--loading {
    pointer-events: none;
  }
  
  /* ===== PADDING VARIANTS ===== */
  .card--sm .card__content {
    padding: 1rem;
  }
  
  .card--md .card__content {
    padding: 1.5rem;
  }
  
  .card--lg .card__content {
    padding: 2rem;
  }
  
  /* ===== SECTIONS ===== */
  .card__header {
    padding: 1.5rem 1.5rem 0;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 1rem;
  }
  
  .card__content {
    padding: 1.5rem;
  }
  
  .card__footer {
    padding: 0 1.5rem 1.5rem;
    border-top: 1px solid #f3f4f6;
    margin-top: 1rem;
  }
  
  /* ===== LOADING STATE ===== */
  .card__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .card__spinner {
    margin-bottom: 1rem;
  }
  
  .card__loading-text {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
  }
  
  /* ===== SPINNER ===== */
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* ===== DARK MODE ===== */
  :global(.dark) .card {
    background-color: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  :global(.dark) .card__header {
    border-bottom-color: #374151;
  }
  
  :global(.dark) .card__footer {
    border-top-color: #374151;
  }
  
  :global(.dark) .card--outlined {
    border-color: #4b5563;
  }
  
  :global(.dark) .card__loading-text {
    color: #9ca3af;
  }
</style>
