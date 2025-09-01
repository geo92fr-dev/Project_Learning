<!--
  🎯 Button Component - Atomique
  Composant bouton réutilisable selon DOC_CoPilot_Practices
-->
<script>
  import { createEventDispatcher } from 'svelte';

  // Props
  export let variant = 'primary'; // primary, secondary, outline, ghost
  export let size = 'md'; // sm, md, lg
  export let disabled = false;
  export let loading = false;
  export let fullWidth = false;
  export let href = undefined;
  export let type = 'button';
  
  // Accessibilité
  export let ariaLabel = undefined;
  
  // Events
  const dispatch = createEventDispatcher();
  
  function handleClick(event) {
    if (!disabled && !loading) {
      dispatch('click', event);
    }
  }
  
  // Classes dynamiques
  $: buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    fullWidth && 'btn--full',
  ].filter(Boolean).join(' ');
</script>

{#if href}
  <a 
    {href}
    class={buttonClasses}
    aria-label={ariaLabel}
    class:disabled
    on:click={handleClick}
  >
    <span class="btn__content">
      {#if loading}
        <span class="btn__spinner" aria-hidden="true">
          <div class="spinner"></div>
        </span>
      {/if}
      
      <span class="btn__text" class:sr-only={loading}>
        <slot />
      </span>
    </span>
  </a>
{:else}
  <button
    class={buttonClasses}
    {type}
    {disabled}
    aria-label={ariaLabel}
    on:click={handleClick}
  >
    <span class="btn__content">
      {#if loading}
        <span class="btn__spinner" aria-hidden="true">
          <div class="spinner"></div>
        </span>
      {/if}
      
      <span class="btn__text" class:sr-only={loading}>
        <slot />
      </span>
    </span>
  </button>
{/if}

<style>
  /* ===== BASE BUTTON ===== */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    user-select: none;
    outline: none;
    outline-offset: 2px;
    position: relative;
    overflow: hidden;
  }
  
  .btn:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .btn--loading {
    cursor: wait;
  }
  
  .btn--full {
    width: 100%;
  }
  
  /* ===== SIZES ===== */
  .btn--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    min-height: 2rem;
  }
  
  .btn--md {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    min-height: 2.5rem;
  }
  
  .btn--lg {
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
    min-height: 3rem;
  }
  
  /* ===== VARIANTS ===== */
  .btn--primary {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .btn--primary:hover:not(.btn--disabled) {
    background-color: #2563eb;
    border-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  
  .btn--secondary {
    background-color: #6b7280;
    color: white;
    border-color: #6b7280;
  }
  
  .btn--secondary:hover:not(.btn--disabled) {
    background-color: #4b5563;
    border-color: #4b5563;
  }
  
  .btn--outline {
    background-color: transparent;
    color: #3b82f6;
    border-color: #3b82f6;
  }
  
  .btn--outline:hover:not(.btn--disabled) {
    background-color: #3b82f6;
    color: white;
  }
  
  .btn--ghost {
    background-color: transparent;
    color: #374151;
    border-color: transparent;
  }
  
  .btn--ghost:hover:not(.btn--disabled) {
    background-color: #f3f4f6;
  }
  
  /* ===== CONTENT ===== */
  .btn__content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn__text {
    transition: opacity 200ms ease;
  }
  
  .btn__spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  /* ===== SPINNER ===== */
  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* ===== UTILITY ===== */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
