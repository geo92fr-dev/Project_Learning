<script lang="ts">
  import { fade } from 'svelte/transition';
  
  export let niveau: {
    id: string;
    title: string;
    description: string;
    icon: string;
    competences: number;
    progression: number;
    difficulty: 'facile' | 'moyen' | 'difficile';
    isAvailable: boolean;
  };
  
  export let href: string;
  
  // Configuration des difficultés
  $: difficultyConfig = getDifficultyConfig(niveau.difficulty);
  
  function getDifficultyConfig(diff: string) {
    const configs = {
      'facile': {
        color: '#22c55e',
        bgColor: '#dcfce7',
        label: 'Facile',
        icon: '🟢'
      },
      'moyen': {
        color: '#f59e0b',
        bgColor: '#fef3c7',
        label: 'Moyen',
        icon: '🟡'
      },
      'difficile': {
        color: '#ef4444',
        bgColor: '#fee2e2',
        label: 'Difficile',
        icon: '🔴'
      }
    };
    return configs[diff] || configs['moyen'];
  }
  
  // Calculer le statut
  $: status = getStatus(niveau);
  
  function getStatus(niv: typeof niveau) {
    if (!niv.isAvailable) return 'locked';
    if (niv.progression === 0) return 'available';
    if (niv.progression < 100) return 'in-progress';
    return 'completed';
  }
  
  // Configuration des statuts
  $: statusConfig = getStatusConfig(status);
  
  function getStatusConfig(stat: string) {
    const configs = {
      'available': {
        badge: '🎯 Disponible',
        badgeColor: '#3b82f6',
        badgeBg: '#dbeafe',
        actionText: 'Commencer',
        actionIcon: '▶️'
      },
      'in-progress': {
        badge: '⏳ En cours',
        badgeColor: '#f59e0b',
        badgeBg: '#fef3c7',
        actionText: 'Continuer',
        actionIcon: '📚'
      },
      'completed': {
        badge: '✅ Terminé',
        badgeColor: '#22c55e',
        badgeBg: '#dcfce7',
        actionText: 'Réviser',
        actionIcon: '🔄'
      },
      'locked': {
        badge: '🔒 Verrouillé',
        badgeColor: '#6b7280',
        badgeBg: '#f3f4f6',
        actionText: 'Bientôt',
        actionIcon: '⏰'
      }
    };
    return configs[stat] || configs['available'];
  }
  
  let isHovered = false;
</script>

<div class="level-card" class:locked={!niveau.isAvailable}>
  {#if niveau.isAvailable}
    <a 
      {href}
      class="card-link"
      data-sveltekit-preload-data="hover"
      on:mouseenter={() => isHovered = true}
      on:mouseleave={() => isHovered = false}
    >
      <div class="card-content">
        <!-- En-tête -->
        <div class="card-header">
          <div class="level-icon">{niveau.icon}</div>
          <div class="level-info">
            <h3 class="level-title">{niveau.title}</h3>
            <p class="level-description">{niveau.description}</p>
          </div>
          <div class="status-badge" style="color: {statusConfig.badgeColor}; background: {statusConfig.badgeBg}">
            {statusConfig.badge}
          </div>
        </div>
        
        <!-- Statistiques -->
        <div class="card-stats">
          <div class="stat">
            <span class="stat-icon">🧠</span>
            <span class="stat-text">{niveau.competences} compétences</span>
          </div>
          
          <div class="stat">
            <span class="stat-icon">{difficultyConfig.icon}</span>
            <span class="stat-text">{difficultyConfig.label}</span>
          </div>
        </div>
        
        <!-- Progression -->
        {#if niveau.progression > 0}
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Progression</span>
              <span class="progress-value">{niveau.progression}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                style="width: {niveau.progression}%"
                in:fade={{ duration: 500 }}
              ></div>
            </div>
          </div>
        {/if}
        
        <!-- Action -->
        <div class="card-action">
          <span class="action-text">
            {statusConfig.actionIcon} {statusConfig.actionText}
          </span>
          <span class="action-arrow" class:active={isHovered}>→</span>
        </div>
      </div>
    </a>
  {:else}
    <div class="card-content locked-content">
      <!-- En-tête verrouillé -->
      <div class="card-header">
        <div class="level-icon locked-icon">{niveau.icon}</div>
        <div class="level-info">
          <h3 class="level-title locked-title">{niveau.title}</h3>
          <p class="level-description locked-description">{niveau.description}</p>
        </div>
        <div class="status-badge locked-badge" style="color: {statusConfig.badgeColor}; background: {statusConfig.badgeBg}">
          {statusConfig.badge}
        </div>
      </div>
      
      <div class="locked-message">
        <p>Ce niveau sera disponible bientôt !</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .level-card {
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    transition: all 0.3s ease;
    height: 100%;
  }
  
  .level-card:not(.locked):hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: var(--matiere-color, #3b82f6);
  }
  
  .card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }
  
  .card-content {
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    position: relative;
  }
  
  .level-icon {
    font-size: 2.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    flex-shrink: 0;
  }
  
  .level-info {
    flex: 1;
    min-width: 0;
  }
  
  .level-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 0.25rem 0;
  }
  
  .level-description {
    font-size: 0.875rem;
    color: #718096;
    margin: 0;
    line-height: 1.4;
  }
  
  .status-badge {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid currentColor;
    opacity: 0.9;
  }
  
  .card-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #4a5568;
  }
  
  .stat-icon {
    font-size: 1rem;
  }
  
  .progress-section {
    margin-top: auto;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #4a5568;
  }
  
  .progress-value {
    font-weight: 600;
    color: var(--matiere-color, #3b82f6);
  }
  
  .progress-bar {
    height: 0.5rem;
    background: #f1f5f9;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--matiere-color, #3b82f6) 0%, var(--matiere-color-dark, #1e40af) 100%);
    border-radius: 0.25rem;
    transition: width 0.5s ease;
  }
  
  .card-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
    margin-top: auto;
  }
  
  .action-text {
    font-size: 0.925rem;
    font-weight: 600;
    color: var(--matiere-color, #3b82f6);
  }
  
  .action-arrow {
    font-size: 1rem;
    color: var(--matiere-color, #3b82f6);
    transition: transform 0.2s ease;
  }
  
  .action-arrow.active {
    transform: translateX(4px);
  }
  
  /* États verrouillés */
  .locked-content {
    opacity: 0.6;
  }
  
  .locked-icon {
    filter: grayscale(100%);
  }
  
  .locked-title {
    color: #6b7280;
  }
  
  .locked-description {
    color: #9ca3af;
  }
  
  .locked-badge {
    opacity: 1;
  }
  
  .locked-message {
    margin-top: auto;
    text-align: center;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }
  
  .locked-message p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .card-content {
      padding: 1rem;
    }
    
    .card-header {
      flex-direction: column;
      gap: 0.75rem;
      text-align: center;
    }
    
    .status-badge {
      position: static;
      align-self: center;
    }
    
    .level-icon {
      font-size: 2rem;
    }
    
    .card-stats {
      justify-content: center;
    }
  }
</style>
