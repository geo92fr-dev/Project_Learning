<!--
  🏷️ Badge Component - Atomic Design System
  Système d'étiquettes selon DOC_CoPilot_Practices
-->
<script>
  export let variant = 'default'; // default, primary, secondary, success, warning, error
  export let size = 'md'; // sm, md, lg
  export let pill = false; // Forme pill (coins arrondis)
  export let outline = false; // Style outline
  export let dismissible = false; // Peut être fermé
  export let icon = ''; // Icône optionnelle
  export let clickable = false; // Peut être cliqué

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Classes de base
  $: baseClasses = [
    'inline-flex',
    'items-center',
    'gap-1',
    'font-medium',
    'transition-all',
    'duration-200',
    'select-none'
  ].join(' ');

  // Classes de taille
  $: sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }[size];

  // Classes de forme
  $: shapeClasses = pill ? 'rounded-full' : 'rounded-md';

  // Classes de variant et outline
  $: variantClasses = outline ? getOutlineVariantClasses(variant) : getVariantClasses(variant);

  // Classes de clicabilité
  $: interactionClasses = clickable ? 'cursor-pointer hover:scale-105 active:scale-95' : '';

  function getVariantClasses(variant) {
    const variants = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      secondary: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
    };
    return variants[variant] || variants.default;
  }

  function getOutlineVariantClasses(variant) {
    const variants = {
      default: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
      primary: 'border border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300',
      secondary: 'border border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300',
      success: 'border border-green-300 text-green-700 dark:border-green-600 dark:text-green-300',
      warning: 'border border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300',
      error: 'border border-red-300 text-red-700 dark:border-red-600 dark:text-red-300'
    };
    return variants[variant] || variants.default;
  }

  function handleClick() {
    if (clickable) {
      dispatch('click');
    }
  }

  function handleDismiss() {
    dispatch('dismiss');
  }
</script>

<span 
  class="{baseClasses} {sizeClasses} {shapeClasses} {variantClasses} {interactionClasses}"
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : undefined}
  on:click={handleClick}
  on:keydown={(e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }}
>
  {#if icon}
    <span class="flex-shrink-0" aria-hidden="true">
      {icon}
    </span>
  {/if}
  
  <slot />
  
  {#if dismissible}
    <button
      type="button"
      class="flex-shrink-0 ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
      on:click|stopPropagation={handleDismiss}
      aria-label="Supprimer"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  {/if}
</span>
