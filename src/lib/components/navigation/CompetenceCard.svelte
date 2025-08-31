<script lang="ts">
  export let competence: {
    id: string;
    title: string;
    description: string;
    slug: string;
    difficulty: 'facile' | 'moyen' | 'difficile';
    duration: string;
    objectives: string[];
    prerequisites?: string[];
    tags?: string[];
    progress?: number;
    isUnlocked?: boolean;
    lastAccessed?: Date;
  };
  export let matiere: string;
  export let niveau: string;
  export let href: string;
  
  // Configuration par difficulté
  $: difficultyConfig = getDifficultyConfig(competence.difficulty);
  
  function getDifficultyConfig(difficulty: string) {
    const configs = {
      facile: {
        color: '#22c55e',
        bgColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        icon: '🟢',
        label: 'Essentiel'
      },
      moyen: {
        color: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fed7aa',
        icon: '🟡',
        label: 'Intermédiaire'
      },
      difficile: {
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        icon: '🔴',
        label: 'Avancé'
      }
    };
    
    return configs[difficulty] || configs.moyen;
  }
  
  // Status de la compétence
  $: isLocked = competence.isUnlocked === false;
  $: hasProgress = competence.progress && competence.progress > 0;
  $: isCompleted = competence.progress && competence.progress >= 100;
  $: isInProgress = hasProgress && !isCompleted;
  
  // Texte du status
  $: statusText = getStatusText();
  
  function getStatusText() {
    if (isLocked) return '🔒 Verrouillé';
    if (isCompleted) return '✅ Terminé';
    if (isInProgress) return `📚 En cours (${competence.progress}%)`;
    return '🚀 Nouveau';
  }
  
  // Formatage de la durée
  $: formattedDuration = competence.duration || '30-45 min';
  
  // Estimation du temps basée sur le niveau
  $: estimatedSessions = getEstimatedSessions();
  
  function getEstimatedSessions() {
    const sessionCounts = {
      facile: '2-3 séances',
      moyen: '3-4 séances', 
      difficile: '4-6 séances'
    };
    return sessionCounts[competence.difficulty] || '3-4 séances';
  }
</script>

<a 
  {href} 
  class="competence-card" 
  class:locked={isLocked}
  class:completed={isCompleted}
  class:in-progress={isInProgress}
  tabindex={isLocked ? -1 : 0}
  aria-label="Compétence {competence.title} - {statusText}"
>
  <div class="card-header">
    <div class="difficulty-badge" style="background-color: {difficultyConfig.bgColor}; border-color: {difficultyConfig.borderColor}; color: {difficultyConfig.color};">
      <span class="difficulty-icon">{difficultyConfig.icon}</span>
      <span class="difficulty-label">{difficultyConfig.label}</span>
    </div>
    
    <div class="status-badge" class:locked-status={isLocked}>
      {statusText}
    </div>
  </div>
  
  <div class="card-content">
    <h4 class="competence-title">{competence.title}</h4>
    <p class="competence-description">{competence.description}</p>
    
    <!-- Objectifs d'apprentissage -->
    {#if competence.objectives && competence.objectives.length > 0}
      <div class="objectives-section">
        <h5 class="objectives-title">🎯 Objectifs</h5>
        <ul class="objectives-list">
          {#each competence.objectives.slice(0, 2) as objective}
            <li class="objective-item">{objective}</li>
          {/each}
          {#if competence.objectives.length > 2}
            <li class="objective-more">+{competence.objectives.length - 2} autres objectifs</li>
          {/if}
        </ul>
      </div>
    {/if}
    
    <!-- Prérequis si applicable -->
    {#if competence.prerequisites && competence.prerequisites.length > 0}
      <div class="prerequisites-section">
        <h5 class="prerequisites-title">📋 Prérequis</h5>
        <div class="prerequisites-tags">
          {#each competence.prerequisites.slice(0, 2) as prerequisite}
            <span class="prerequisite-tag">{prerequisite}</span>
          {/each}
          {#if competence.prerequisites.length > 2}
            <span class="prerequisite-more">+{competence.prerequisites.length - 2}</span>
          {/if}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Barre de progression -->
  {#if hasProgress && !isLocked}
    <div class="progress-section">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          style="width: {competence.progress}%; background-color: {difficultyConfig.color};"
        ></div>
      </div>
      <span class="progress-text">{competence.progress}% complété</span>
    </div>
  {/if}
  
  <div class="card-footer">
    <div class="time-info">
      <span class="duration">⏱️ {formattedDuration}</span>
      <span class="sessions">📅 {estimatedSessions}</span>
    </div>
    
    {#if competence.tags && competence.tags.length > 0}
      <div class="tags">
        {#each competence.tags.slice(0, 3) as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
    
    <div class="action-hint">
      {#if isLocked}
        <span class="lock-hint">🔒 Complétez les prérequis</span>
      {:else}
        <span class="start-hint">
          {isCompleted ? '👁️ Réviser' : isInProgress ? '📖 Continuer' : '🚀 Commencer'}
        </span>
      {/if}
    </div>
  </div>
</a>

<style>
  .competence-card {
    display: block;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    padding: 1.5rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .competence-card:hover:not(.locked) {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--matiere-color, #3b82f6);
  }
  
  .competence-card:focus {
    outline: 2px solid var(--matiere-color, #3b82f6);
    outline-offset: 2px;
  }
  
  .competence-card.locked {
    opacity: 0.6;
    background: #f8fafc;
    cursor: not-allowed;
  }
  
  .competence-card.completed {
    border-color: #22c55e;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  }
  
  .competence-card.in-progress {
    border-color: var(--matiere-color, #3b82f6);
    background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  
  .difficulty-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    border: 1px solid;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .difficulty-icon {
    font-size: 0.75rem;
  }
  
  .status-badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }
  
  .status-badge.locked-status {
    background: #fef2f2;
    color: #991b1b;
    border-color: #fecaca;
  }
  
  .card-content {
    margin-bottom: 1.5rem;
  }
  
  .competence-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 0.75rem 0;
    line-height: 1.3;
  }
  
  .competence-description {
    font-size: 0.925rem;
    color: #4a5568;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }
  
  .objectives-section,
  .prerequisites-section {
    margin-bottom: 1rem;
  }
  
  .objectives-title,
  .prerequisites-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }
  
  .objectives-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .objective-item {
    font-size: 0.8rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
    position: relative;
    padding-left: 1rem;
  }
  
  .objective-item::before {
    content: '•';
    color: var(--matiere-color, #3b82f6);
    position: absolute;
    left: 0;
  }
  
  .objective-more {
    font-size: 0.8rem;
    color: #9ca3af;
    font-style: italic;
    padding-left: 1rem;
  }
  
  .prerequisites-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .prerequisite-tag {
    font-size: 0.75rem;
    background: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
  }
  
  .prerequisite-more {
    font-size: 0.75rem;
    color: #9ca3af;
    padding: 0.25rem 0.5rem;
  }
  
  .progress-section {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }
  
  .progress-bar {
    height: 0.5rem;
    background: #f1f5f9;
    border-radius: 0.25rem;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .progress-fill {
    height: 100%;
    border-radius: 0.25rem;
    transition: width 0.6s ease;
  }
  
  .progress-text {
    font-size: 0.8rem;
    font-weight: 500;
    color: #374151;
  }
  
  .card-footer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .time-info {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #6b7280;
  }
  
  .duration,
  .sessions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  
  .tag {
    font-size: 0.7rem;
    background: #e0f2fe;
    color: #0369a1;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #bae6fd;
  }
  
  .action-hint {
    text-align: center;
    margin-top: 0.5rem;
  }
  
  .start-hint,
  .lock-hint {
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    display: inline-block;
  }
  
  .start-hint {
    background: linear-gradient(135deg, var(--matiere-color, #3b82f6) 0%, var(--matiere-color-dark, #1e40af) 100%);
    color: white;
  }
  
  .lock-hint {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .competence-card {
      padding: 1.25rem;
    }
    
    .card-header {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .time-info {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
