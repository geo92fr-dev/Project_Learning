<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Breadcrumbs from '$lib/components/navigation/Breadcrumbs.svelte';
  
  export let data;
  
  $: cours = data.cours;
  $: contenu = data.contenu;
  $: competence = data.competence;
  $: navigation = data.navigation;
  $: matiere = data.matiere;
  $: niveau = data.niveau;
  
  // État d'animation et interface
  let visible = false;
  let activeSection = 0;
  let showResources = false;
  
  onMount(() => {
    visible = true;
  });
  
  // Configuration par type de cours
  $: typeConfig = getTypeConfig(cours.type);
  
  function getTypeConfig(type: string) {
    const configs = {
      introduction: {
        color: '#3b82f6',
        bgColor: '#eff6ff',
        icon: '🚀',
        label: 'Introduction'
      },
      théorie: {
        color: '#8b5cf6',
        bgColor: '#f3e8ff',
        icon: '📚',
        label: 'Théorie'
      },
      méthodes: {
        color: '#f59e0b',
        bgColor: '#fef3c7',
        icon: '🔧',
        label: 'Méthodes'
      },
      exercices: {
        color: '#10b981',
        bgColor: '#ecfdf5',
        icon: '💪',
        label: 'Exercices'
      },
      applications: {
        color: '#ef4444',
        bgColor: '#fef2f2',
        icon: '🎯',
        label: 'Applications'
      }
    };
    
    return configs[type as keyof typeof configs] || configs.théorie;
  }
  
  // Calculer la progression du cours
  $: progressionCours = calculateProgression(contenu);
  
  function calculateProgression(content: any) {
    const totalSections = content.sections.length;
    const completedSections = content.sections.filter((s: any) => s.completed).length;
    
    const totalActivities = content.activities.length;
    const completedActivities = content.activities.filter((a: any) => a.completed).length;
    
    const totalItems = totalSections + totalActivities;
    const completedItems = completedSections + completedActivities;
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }
  
  // Basculer les sections
  function toggleSection(index: number) {
    activeSection = activeSection === index ? -1 : index;
  }
  
  // Marquer une section comme complétée
  function markSectionCompleted(sectionId: string) {
    // En production, cela ferait un appel API
    console.log('Section complétée:', sectionId);
  }
  
  // Basculer l'affichage des ressources
  function toggleResources() {
    showResources = !showResources;
  }
  
  // Formatage de la durée
  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
  
  // Breadcrumbs dynamiques
  $: breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: matiere, href: `/${matiere}` },
    { label: niveau, href: `/${matiere}/${niveau}` },
    { label: competence.title, href: `/${matiere}/${niveau}/${competence.slug}` },
    { label: cours.title, href: `/${matiere}/${niveau}/${competence.slug}/${cours.slug}` }
  ];
</script>

<svelte:head>
  <title>{cours.title} - {competence.title}</title>
</svelte:head>

<div class="cours-page">
  <!-- Header avec breadcrumbs -->
  <header class="cours-header">
    <Breadcrumbs items={breadcrumbs} />
  </header>
  
  {#if visible}
    <!-- Informations du cours -->
    <section class="cours-info" in:fade={{ duration: 600, delay: 200 }}>
      <div class="cours-badge" style="background-color: {typeConfig.bgColor}; color: {typeConfig.color};">
        <span class="badge-icon">{typeConfig.icon}</span>
        <span class="badge-text">{typeConfig.label}</span>
      </div>
      
      <h1 class="cours-title">{cours.title}</h1>
      <p class="cours-description">{cours.description}</p>
      
      <div class="cours-meta">
        <div class="meta-item">
          <span class="meta-icon">⏱️</span>
          <span class="meta-text">Durée : {formatDuration(contenu.totalDuration)}</span>
        </div>
        
        <div class="meta-item">
          <span class="meta-icon">📊</span>
          <span class="meta-text">Progression : {progressionCours}%</span>
        </div>
        
        <div class="meta-item">
          <span class="meta-icon">📝</span>
          <span class="meta-text">{contenu.sections.length} sections</span>
        </div>
        
        <div class="meta-item">
          <span class="meta-icon">🎯</span>
          <span class="meta-text">{contenu.activities.length} activités</span>
        </div>
      </div>
      
      <!-- Barre de progression -->
      <div class="progression-container">
        <div class="progression-bar">
          <div 
            class="progression-fill" 
            style="width: {progressionCours}%; background-color: {typeConfig.color};"
          ></div>
        </div>
        <span class="progression-text">{progressionCours}% complété</span>
      </div>
    </section>
    
    <!-- Contenu principal du cours -->
    <div class="cours-content">
      <!-- Sections du cours -->
      <section class="sections-container" in:fly={{ y: 30, duration: 600, delay: 400 }}>
        <h2 class="content-title">📖 Contenu du cours</h2>
        
        <div class="sections-list">
          {#each contenu.sections as section, index}
            <div 
              class="section-card"
              class:active={activeSection === index}
              class:completed={section.completed}
              in:fly={{ y: 20, duration: 400, delay: 600 + (index * 100) }}
            >
              <button 
                class="section-header"
                on:click={() => toggleSection(index)}
                aria-expanded={activeSection === index}
              >
                <div class="section-info">
                  <div class="section-status">
                    {#if section.completed}
                      <span class="status-icon completed">✅</span>
                    {:else}
                      <span class="status-icon pending">📝</span>
                    {/if}
                  </div>
                  
                  <div class="section-details">
                    <h3 class="section-title">{section.title}</h3>
                    <span class="section-duration">{formatDuration(section.duration)}</span>
                  </div>
                </div>
                
                <div class="section-toggle">
                  <span class="toggle-icon" class:rotated={activeSection === index}>▼</span>
                </div>
              </button>
              
              {#if activeSection === index}
                <div class="section-content" transition:fly={{ y: -20, duration: 300 }}>
                  <p class="section-text">{section.content}</p>
                  
                  {#if !section.completed}
                    <button 
                      class="complete-button"
                      style="background-color: {typeConfig.color};"
                      on:click={() => markSectionCompleted(section.id)}
                    >
                      Marquer comme terminé
                    </button>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>
      
      <!-- Activités -->
      <section class="activities-container" in:fly={{ y: 30, duration: 600, delay: 600 }}>
        <h2 class="content-title">🎯 Activités pratiques</h2>
        
        <div class="activities-grid">
          {#each contenu.activities as activity, index}
            <div 
              class="activity-card"
              class:completed={activity.completed}
              in:fly={{ y: 20, duration: 400, delay: 800 + (index * 100) }}
            >
              <div class="activity-header">
                <div class="activity-status">
                  {#if activity.completed}
                    <span class="status-icon completed">✅</span>
                  {:else}
                    <span class="status-icon pending">🚀</span>
                  {/if}
                </div>
                
                <div class="activity-type" style="background-color: {typeConfig.color}20; color: {typeConfig.color};">
                  {activity.type}
                </div>
              </div>
              
              <h3 class="activity-title">{activity.title}</h3>
              <div class="activity-duration">{formatDuration(activity.duration)}</div>
              
              <button 
                class="activity-button"
                class:completed-button={activity.completed}
                style="background-color: {activity.completed ? '#22c55e' : typeConfig.color};"
              >
                {activity.completed ? '👁️ Réviser' : '🚀 Commencer'}
              </button>
            </div>
          {/each}
        </div>
      </section>
      
      <!-- Ressources -->
      <section class="resources-container" in:fly={{ y: 30, duration: 600, delay: 800 }}>
        <div class="resources-header">
          <h2 class="content-title">📁 Ressources complémentaires</h2>
          <button class="toggle-resources" on:click={toggleResources}>
            {showResources ? 'Masquer' : 'Afficher'} ({contenu.resources.length})
          </button>
        </div>
        
        {#if showResources}
          <div class="resources-grid" transition:fly={{ y: -20, duration: 300 }}>
            {#each contenu.resources as resource}
              <a href={resource.url} class="resource-item" target="_blank" rel="noopener noreferrer">
                <div class="resource-icon">
                  {#if resource.type === 'pdf'}📄
                  {:else if resource.type === 'video'}🎥
                  {:else if resource.type === 'image'}🖼️
                  {:else if resource.type === 'link'}🔗
                  {:else}📋{/if}
                </div>
                <span class="resource-title">{resource.title}</span>
                <span class="resource-type">{resource.type}</span>
              </a>
            {/each}
          </div>
        {/if}
      </section>
    </div>
    
    <!-- Navigation entre cours -->
    <nav class="cours-navigation" in:fly={{ y: 30, duration: 600, delay: 1000 }}>
      <div class="nav-content">
        {#if navigation.previous}
          <a 
            href="/{matiere}/{niveau}/{competence.slug}/{navigation.previous.slug}"
            class="nav-button nav-previous"
          >
            <span class="nav-arrow">←</span>
            <div class="nav-info">
              <span class="nav-label">Cours précédent</span>
              <span class="nav-title">{navigation.previous.title}</span>
            </div>
          </a>
        {:else}
          <div class="nav-spacer"></div>
        {/if}
        
        <a 
          href="/{matiere}/{niveau}/{competence.slug}"
          class="nav-button nav-back"
        >
          <span class="nav-icon">📚</span>
          <span class="nav-text">Retour à la compétence</span>
        </a>
        
        {#if navigation.next}
          <a 
            href="/{matiere}/{niveau}/{competence.slug}/{navigation.next.slug}"
            class="nav-button nav-next"
          >
            <div class="nav-info">
              <span class="nav-label">Cours suivant</span>
              <span class="nav-title">{navigation.next.title}</span>
            </div>
            <span class="nav-arrow">→</span>
          </a>
        {:else}
          <div class="nav-spacer"></div>
        {/if}
      </div>
    </nav>
  {/if}
</div>

<style>
  .cours-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding-bottom: 2rem;
  }
  
  .cours-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }
  
  .cours-info {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .cours-badge {
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
  
  .cours-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }
  
  .cours-description {
    font-size: 1.125rem;
    color: #4a5568;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }
  
  .cours-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
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
  
  .progression-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .progression-bar {
    flex: 1;
    height: 0.75rem;
    background: #f1f5f9;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .progression-fill {
    height: 100%;
    border-radius: 0.375rem;
    transition: width 0.8s ease;
  }
  
  .progression-text {
    font-size: 0.925rem;
    font-weight: 500;
    color: #374151;
    white-space: nowrap;
  }
  
  .cours-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .sections-container,
  .activities-container,
  .resources-container {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .content-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 1.5rem 0;
  }
  
  .sections-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-card {
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  
  .section-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .section-card.completed {
    border-color: #22c55e;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  }
  
  .section-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }
  
  .section-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .section-status .status-icon {
    font-size: 1.25rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.25rem 0;
  }
  
  .section-duration {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .toggle-icon {
    font-size: 0.875rem;
    color: #9ca3af;
    transition: transform 0.2s ease;
  }
  
  .toggle-icon.rotated {
    transform: rotate(180deg);
  }
  
  .section-content {
    padding: 0 1.25rem 1.25rem 1.25rem;
    border-top: 1px solid #f1f5f9;
  }
  
  .section-text {
    color: #4a5568;
    line-height: 1.6;
    margin: 0 0 1rem 0;
  }
  
  .complete-button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .complete-button:hover {
    background-color: #2563eb;
  }
  
  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .activity-card {
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
  }
  
  .activity-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .activity-card.completed {
    border-color: #22c55e;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  }
  
  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .activity-status .status-icon {
    font-size: 1.25rem;
  }
  
  .activity-type {
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .activity-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
  }
  
  .activity-duration {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
  
  .activity-button {
    width: 100%;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  
  .activity-button:hover {
    opacity: 0.9;
  }
  
  .resources-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .toggle-resources {
    background: #f1f5f9;
    color: #374151;
    border: 1px solid #e2e8f0;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .toggle-resources:hover {
    background-color: #e2e8f0;
  }
  
  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .resource-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }
  
  .resource-item:hover {
    background-color: #f8fafc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .resource-icon {
    font-size: 1.5rem;
  }
  
  .resource-title {
    flex: 1;
    font-weight: 500;
    color: #374151;
  }
  
  .resource-type {
    font-size: 0.8rem;
    color: #9ca3af;
    text-transform: uppercase;
  }
  
  .cours-navigation {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-top: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .nav-content {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
  }
  
  .nav-button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }
  
  .nav-button:hover {
    background-color: #f8fafc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .nav-previous {
    justify-self: start;
  }
  
  .nav-next {
    justify-self: end;
  }
  
  .nav-back {
    justify-self: center;
    background-color: var(--matiere-color, #3b82f6);
    color: white;
    border-color: var(--matiere-color, #3b82f6);
  }
  
  .nav-back:hover {
    background-color: var(--matiere-color-dark, #2563eb);
  }
  
  .nav-info {
    display: flex;
    flex-direction: column;
  }
  
  .nav-label {
    font-size: 0.8rem;
    color: #9ca3af;
  }
  
  .nav-title {
    font-weight: 500;
    color: #374151;
  }
  
  .nav-arrow {
    font-size: 1.25rem;
    color: #9ca3af;
  }
  
  .nav-spacer {
    width: 1px;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .cours-content {
      gap: 1.5rem;
    }
    
    .sections-container,
    .activities-container,
    .resources-container {
      padding: 1.25rem;
    }
    
    .cours-title {
      font-size: 1.875rem;
    }
    
    .cours-meta {
      flex-direction: column;
      gap: 1rem;
    }
    
    .activities-grid {
      grid-template-columns: 1fr;
    }
    
    .nav-content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .nav-button {
      justify-self: stretch !important;
    }
  }
  
  @media (max-width: 480px) {
    .cours-page {
      padding-bottom: 1rem;
    }
    
    .cours-info,
    .sections-container,
    .activities-container,
    .resources-container,
    .cours-navigation {
      padding: 1rem;
    }
    
    .cours-title {
      font-size: 1.5rem;
    }
  }
</style>
