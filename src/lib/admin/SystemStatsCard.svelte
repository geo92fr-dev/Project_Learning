<!--
  📊 System Stats Card - Phase 11.1
  Carte de statistiques système avec indicateurs visuels
  Conformité DOC_CoPilot_Practices : Performance + UX
-->

<script lang="ts">
  import { onMount } from 'svelte';
  
  // Props avec validation Zod-style
  export let title: string;
  export let value: string | number;
  export let subtitle: string = '';
  export let icon: string = '📊';
  export let trend: string = '';
  export let color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' = 'blue';
  export let loading: boolean = false;
  export let clickable: boolean = false;

  // État interne
  let mounted = false;
  let animationDelay = Math.random() * 200; // Animation échelonnée

  // Couleurs par thème
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      trend: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200', 
      text: 'text-green-700',
      icon: 'text-green-600',
      trend: 'text-green-500'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700', 
      icon: 'text-yellow-600',
      trend: 'text-yellow-500'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-600', 
      trend: 'text-red-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'text-purple-600',
      trend: 'text-purple-500'
    }
  };

  // Dérivés réactifs
  $: scheme = colorSchemes[color];
  $: isPositiveTrend = trend.startsWith('+');
  $: isNegativeTrend = trend.startsWith('-');
  $: trendColor = isPositiveTrend ? 'text-green-600' : isNegativeTrend ? 'text-red-600' : 'text-gray-600';
  $: formattedValue = formatValue(value);
  $: tabindex = clickable ? 0 : undefined;

  // Formatage intelligent des valeurs
  function formatValue(val: string | number): string {
    if (typeof val === 'string') return val;
    
    // Formatage numérique avec séparateurs
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    
    return val.toLocaleString('fr-FR');
  }

  // Animation d'entrée
  onMount(() => {
    setTimeout(() => {
      mounted = true;
    }, animationDelay);
  });

  // Gestion du clic
  function handleClick() {
    if (clickable) {
      // Dispatch custom event pour le parent
      const event = new CustomEvent('card-click', {
        detail: { title, value, subtitle }
      });
      document.dispatchEvent(event);
    }
  }

  // Gestion clavier pour accessibilité
  function handleKeydown(event: KeyboardEvent) {
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick();
    }
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<svelte:element 
  this={clickable ? 'button' : 'div'}
  class="stats-card"
  class:mounted
  class:clickable
  class:loading
  style="--animation-delay: {animationDelay}ms"
  role={clickable ? 'button' : 'article'}
  tabindex={clickable ? 0 : -1}
  aria-label="{title}: {formattedValue}. {subtitle}. {trend}"
  on:click={clickable ? handleClick : undefined}
  on:keydown={clickable ? handleKeydown : undefined}
>
  <!-- Loading State -->
  {#if loading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <span class="loading-text">Chargement...</span>
    </div>
  {:else}
    <!-- Header avec icône et trend -->
    <div class="stats-header">
      <div class="icon-container">
        <span class="stats-icon" role="img" aria-label={title}>
          {icon}
        </span>
      </div>
      
      {#if trend}
        <div class="trend-indicator" class:positive={isPositiveTrend} class:negative={isNegativeTrend}>
          <span class="trend-arrow" aria-hidden="true">
            {isPositiveTrend ? '↗' : isNegativeTrend ? '↘' : '→'}
          </span>
          <span class="trend-value">{trend}</span>
        </div>
      {/if}
    </div>

    <!-- Contenu principal -->
    <div class="stats-content">
      <div class="stats-title">
        <h3>{title}</h3>
      </div>
      
      <div class="stats-value" aria-label="Valeur: {formattedValue}">
        <span class="value-number">{formattedValue}</span>
      </div>
      
      {#if subtitle}
        <div class="stats-subtitle">
          <p>{subtitle}</p>
        </div>
      {/if}
    </div>

    <!-- Barre de progression décorative -->
    <div class="progress-bar">
      <div class="progress-fill" class:animate={mounted}></div>
    </div>

    <!-- Effet de brillance au hover -->
    {#if clickable}
      <div class="shine-effect"></div>
    {/if}
  {/if}
</svelte:element>

<style>
  .stats-card {
    position: relative;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    min-height: 140px;
    display: flex;
    flex-direction: column;
  }

  /* Styles pour button.stats-card quand clickable */
  button.stats-card {
    width: 100%;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    cursor: pointer;
  }

  button.stats-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .stats-card.mounted {
    opacity: 1;
    transform: translateY(0);
    transition-delay: var(--animation-delay);
  }

  .stats-card.clickable {
    cursor: pointer;
  }

  .stats-card.clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border-color: #d1d5db;
  }

  .stats-card.loading {
    opacity: 0.7;
    pointer-events: none;
  }

  /* Loading State */
  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.95);
    gap: 0.75rem;
    z-index: 10;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Header */
  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border-radius: 12px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  }

  .stats-icon {
    font-size: 1.5rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
  }

  .trend-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    background: #f3f4f6;
    color: #6b7280;
  }

  .trend-indicator.positive {
    background: #dcfce7;
    color: #166534;
  }

  .trend-indicator.negative {
    background: #fee2e2;
    color: #dc2626;
  }

  .trend-arrow {
    font-size: 0.9rem;
  }

  /* Contenu */
  .stats-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .stats-title h3 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.2;
  }

  .stats-value {
    margin: 0.5rem 0;
  }

  .value-number {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .stats-subtitle p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.3;
  }

  /* Barre de progression */
  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #f3f4f6;
    overflow: hidden;
  }

  .progress-fill {
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: calc(var(--animation-delay) + 500ms);
  }

  .progress-fill.animate {
    width: 100%;
  }

  /* Effet de brillance */
  .shine-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.3),
      transparent
    );
    opacity: 0;
    transition: all 0.6s ease;
  }

  .stats-card.clickable:hover .shine-effect {
    left: 100%;
    opacity: 1;
  }

  /* Responsive Design */
  @media (max-width: 640px) {
    .stats-card {
      padding: 1.25rem;
      min-height: 120px;
    }

    .value-number {
      font-size: 1.875rem;
    }

    .stats-title h3 {
      font-size: 0.8rem;
    }

    .trend-indicator {
      font-size: 0.75rem;
      padding: 0.2rem 0.4rem;
    }
  }

  /* Mode sombre */
  @media (prefers-color-scheme: dark) {
    .stats-card {
      background: #1f2937;
      border-color: #374151;
      color: #f9fafb;
    }

    .stats-title h3 {
      color: #d1d5db;
    }

    .value-number {
      color: #f9fafb;
    }

    .stats-subtitle p {
      color: #9ca3af;
    }

    .icon-container {
      background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    }

    .progress-bar {
      background: #374151;
    }

    .loading-overlay {
      background: rgba(31, 41, 55, 0.95);
    }

    .loading-text {
      color: #d1d5db;
    }
  }

  /* Accessibilité */
  @media (prefers-reduced-motion: reduce) {
    .stats-card,
    .progress-fill,
    .shine-effect {
      transition: none;
      animation: none;
    }

    .stats-card.mounted {
      opacity: 1;
      transform: none;
    }

    .loading-spinner {
      animation: none;
    }
  }

  /* Focus visible pour accessibilité */
  .stats-card.clickable:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Impression */
  @media print {
    .stats-card {
      box-shadow: none;
      border: 1px solid #000;
      break-inside: avoid;
    }

    .shine-effect,
    .progress-bar {
      display: none;
    }
  }
</style>
