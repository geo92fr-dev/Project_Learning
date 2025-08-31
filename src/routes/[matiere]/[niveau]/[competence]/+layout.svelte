<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Breadcrumbs from '$lib/components/navigation/Breadcrumbs.svelte';
  
  export let data;
  
  $: competence = data.competence;
  $: cours = data.cours;
  $: matiere = data.matiere;
  $: niveau = data.niveau;
  
  // Configuration par difficulté
  $: difficultyConfig = getDifficultyConfig(competence.difficulty);
  
  function getDifficultyConfig(difficulty: string) {
    const configs = {
      facile: {
        color: '#22c55e',
        bgColor: '#f0fdf4',
        icon: '🟢',
        label: 'Essentiel'
      },
      moyen: {
        color: '#f59e0b',
        bgColor: '#fffbeb',
        icon: '🟡',
        label: 'Intermédiaire'
      },
      difficile: {
        color: '#ef4444',
        bgColor: '#fef2f2',
        icon: '🔴',
        label: 'Avancé'
      }
    };
    
    return configs[difficulty] || configs.moyen;
  }
  
  // Animation d'apparition
  let visible = false;
  
  onMount(() => {
    visible = true;
  });
  
  // Grouper les cours par type
  $: coursByType = groupCoursByType(cours);
  
  function groupCoursByType(courseList: any[]) {
    return {
      introduction: courseList.filter(c => c.type === 'introduction'),
      theorie: courseList.filter(c => c.type === 'théorie'),
      methodes: courseList.filter(c => c.type === 'méthodes'), 
      exercices: courseList.filter(c => c.type === 'exercices'),
      applications: courseList.filter(c => c.type === 'applications')
    };
  }
</script>

<svelte:head>
  <title>{competence.title} - {niveau} {matiere} - FunLearning</title>
</svelte:head>

<div class="competence-layout">
  <!-- Header avec breadcrumbs -->
  <header class="competence-header">
    <Breadcrumbs items={data.breadcrumbs} />
  </header>
  
  {#if visible}
    <!-- Titre et informations de la compétence -->
    <section class="competence-info" in:fade={{ duration: 600, delay: 200 }}>
      <div class="info-content">
        <div class="competence-badge" style="background-color: {difficultyConfig.bgColor}; color: {difficultyConfig.color};">
          <span class="badge-icon">{difficultyConfig.icon}</span>
          <span class="badge-text">{difficultyConfig.label}</span>
        </div>
        
        <h1 class="competence-title">{competence.title}</h1>
        <p class="competence-description">{competence.description}</p>
        
        <div class="competence-meta">
          <div class="meta-item">
            <span class="meta-icon">⏱️</span>
            <span class="meta-text">Durée estimée : {competence.duration}</span>
          </div>
          
          <div class="meta-item">
            <span class="meta-icon">📚</span>
            <span class="meta-text">{cours.length} cours disponibles</span>
          </div>
          
          {#if competence.progress > 0}
            <div class="meta-item">
              <span class="meta-icon">📈</span>
              <span class="meta-text">Progression : {competence.progress}%</span>
            </div>
          {/if}
        </div>
      </div>
    </section>
    
    <!-- Objectifs d'apprentissage -->
    {#if competence.objectives && competence.objectives.length > 0}
      <section class="objectives-section" in:fly={{ y: 30, duration: 600, delay: 400 }}>
        <h2 class="section-title">🎯 Objectifs d'apprentissage</h2>
        <div class="objectives-grid">
          {#each competence.objectives as objective, index}
            <div 
              class="objective-card"
              in:fly={{ y: 20, duration: 400, delay: 600 + (index * 100) }}
            >
              <div class="objective-number">{index + 1}</div>
              <p class="objective-text">{objective}</p>
            </div>
          {/each}
        </div>
      </section>
    {/if}
    
    <!-- Prérequis -->
    {#if competence.prerequisites && competence.prerequisites.length > 0}
      <section class="prerequisites-section" in:fly={{ y: 30, duration: 600, delay: 600 }}>
        <h2 class="section-title">📋 Prérequis</h2>
        <div class="prerequisites-list">
          {#each competence.prerequisites as prerequisite}
            <div class="prerequisite-item">
              <span class="prerequisite-icon">✓</span>
              <span class="prerequisite-text">{prerequisite}</span>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  {/if}
  
  <!-- Contenu principal (slot pour les pages enfants) -->
  <main class="competence-content">
    <slot />
  </main>
</div>

<style>
  .competence-layout {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
  
  .competence-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }
  
  .competence-info {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .info-content {
    max-width: 800px;
  }
  
  .competence-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.925rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
  
  .badge-icon {
    font-size: 0.875rem;
  }
  
  .competence-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }
  
  .competence-description {
    font-size: 1.25rem;
    color: #4a5568;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }
  
  .competence-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.925rem;
    color: #6b7280;
  }
  
  .meta-icon {
    font-size: 1.125rem;
  }
  
  .objectives-section,
  .prerequisites-section {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 1.5rem 0;
  }
  
  .objectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .objective-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: transform 0.2s ease;
  }
  
  .objective-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .objective-number {
    background: var(--matiere-color, #3b82f6);
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
  
  .objective-text {
    margin: 0;
    color: #374151;
    line-height: 1.5;
  }
  
  .prerequisites-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .prerequisite-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.5rem;
  }
  
  .prerequisite-icon {
    color: #22c55e;
    font-weight: 600;
  }
  
  .prerequisite-text {
    color: #374151;
  }
  
  .competence-content {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-height: 60vh;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .competence-info,
    .objectives-section,
    .prerequisites-section,
    .competence-content {
      padding: 1.5rem;
    }
    
    .competence-title {
      font-size: 2rem;
    }
    
    .competence-description {
      font-size: 1.125rem;
    }
    
    .competence-meta {
      flex-direction: column;
      gap: 1rem;
    }
    
    .objectives-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 480px) {
    .competence-layout {
      padding: 0.5rem;
    }
    
    .competence-info,
    .objectives-section,
    .prerequisites-section,
    .competence-content {
      padding: 1rem;
    }
    
    .competence-title {
      font-size: 1.75rem;
    }
  }
</style>
