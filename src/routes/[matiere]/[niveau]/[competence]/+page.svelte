<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  export let data;
  
  $: competence = data.competence;
  $: cours = data.cours;
  $: matiere = data.matiere;
  $: niveau = data.niveau;
  
  // État d'animation
  let visible = false;
  
  onMount(() => {
    visible = true;
  });
  
  // Grouper les cours par type
  $: coursByType = groupCoursByType(cours);
  
  function groupCoursByType(courseList: any[]) {
    return [
      {
        type: 'introduction',
        title: '🚀 Introduction',
        description: 'Découvrez les bases et concepts fondamentaux',
        courses: courseList.filter(c => c.type === 'introduction'),
        color: '#3b82f6'
      },
      {
        type: 'theorie',
        title: '📚 Théorie',
        description: 'Approfondissez vos connaissances théoriques',
        courses: courseList.filter(c => c.type === 'théorie'),
        color: '#8b5cf6'
      },
      {
        type: 'methodes',
        title: '🔧 Méthodes',
        description: 'Maîtrisez les techniques et méthodes',
        courses: courseList.filter(c => c.type === 'méthodes'),
        color: '#f59e0b'
      },
      {
        type: 'exercices',
        title: '💪 Exercices',
        description: 'Entraînez-vous avec des exercices pratiques',
        courses: courseList.filter(c => c.type === 'exercices'),
        color: '#10b981'
      },
      {
        type: 'applications',
        title: '🎯 Applications',
        description: 'Appliquez vos connaissances à des cas concrets',
        courses: courseList.filter(c => c.type === 'applications'),
        color: '#ef4444'
      }
    ].filter(section => section.courses.length > 0);
  }
  
  // Calculer la progression globale
  $: progression = calculateProgression(cours);
  
  function calculateProgression(courseList: any[]) {
    if (!courseList.length) return 0;
    const completed = courseList.filter(c => c.isCompleted).length;
    return Math.round((completed / courseList.length) * 100);
  }
  
  // Formatage de la durée
  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
</script>

<svelte:head>
  <title>{competence.title} - Parcours d'apprentissage</title>
</svelte:head>

<div class="competence-parcours">
  {#if visible}
    <!-- Vue d'ensemble de la progression -->
    <section class="progression-overview" in:fade={{ duration: 600, delay: 200 }}>
      <div class="progression-content">
        <h2 class="progression-title">📈 Votre progression</h2>
        
        <div class="progression-stats">
          <div class="stat-card">
            <div class="stat-value">{progression}%</div>
            <div class="stat-label">Complété</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{cours.filter(c => c.isCompleted).length}/{cours.length}</div>
            <div class="stat-label">Cours terminés</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{cours.reduce((sum, c) => sum + c.duration, 0)} min</div>
            <div class="stat-label">Temps total</div>
          </div>
        </div>
        
        <!-- Barre de progression globale -->
        <div class="progression-bar-container">
          <div class="progression-bar">
            <div 
              class="progression-fill" 
              style="width: {progression}%; background: var(--matiere-color, #3b82f6);"
            ></div>
          </div>
          <span class="progression-text">{progression}% du parcours complété</span>
        </div>
      </div>
    </section>
    
    <!-- Sections de cours par type -->
    {#each coursByType as section, sectionIndex}
      <section 
        class="course-section" 
        in:fly={{ y: 50, duration: 600, delay: 400 + (sectionIndex * 200) }}
      >
        <div class="section-header">
          <h3 class="section-title" style="color: {section.color};">
            {section.title}
          </h3>
          <p class="section-description">{section.description}</p>
          
          <div class="section-stats">
            <span class="section-progress">
              {section.courses.filter(c => c.isCompleted).length}/{section.courses.length} complétés
            </span>
            <span class="section-duration">
              {formatDuration(section.courses.reduce((sum, c) => sum + c.duration, 0))}
            </span>
          </div>
        </div>
        
        <div class="courses-grid">
          {#each section.courses as course, courseIndex}
            <div 
              class="course-card"
              class:completed={course.isCompleted}
              in:fly={{ y: 30, duration: 400, delay: 600 + (sectionIndex * 200) + (courseIndex * 100) }}
            >
              <a 
                href="/{matiere}/{niveau}/{competence.slug}/{course.slug}"
                class="course-link"
              >
                <div class="course-header">
                  <div class="course-status">
                    {#if course.isCompleted}
                      <span class="status-icon completed">✅</span>
                    {:else if course.progress > 0}
                      <span class="status-icon in-progress">📚</span>
                    {:else}
                      <span class="status-icon new">🚀</span>
                    {/if}
                  </div>
                  
                  <div class="course-order">#{course.ordre}</div>
                </div>
                
                <div class="course-content">
                  <h4 class="course-title">{course.title}</h4>
                  <p class="course-description">{course.description}</p>
                  
                  <div class="course-meta">
                    <span class="course-duration">⏱️ {formatDuration(course.duration)}</span>
                    <span class="course-type" style="background-color: {section.color}20; color: {section.color};">
                      {course.type}
                    </span>
                  </div>
                </div>
                
                {#if course.progress > 0 && !course.isCompleted}
                  <div class="course-progress">
                    <div class="progress-bar-small">
                      <div 
                        class="progress-fill-small" 
                        style="width: {course.progress}%; background-color: {section.color};"
                      ></div>
                    </div>
                    <span class="progress-percentage">{course.progress}%</span>
                  </div>
                {/if}
                
                <div class="course-action">
                  {#if course.isCompleted}
                    <span class="action-text">👁️ Réviser</span>
                  {:else if course.progress > 0}
                    <span class="action-text">📖 Continuer</span>
                  {:else}
                    <span class="action-text">🚀 Commencer</span>
                  {/if}
                </div>
              </a>
            </div>
          {/each}
        </div>
      </section>
    {/each}
    
    <!-- Conseils et encouragements -->
    <section class="tips-section" in:fly={{ y: 50, duration: 600, delay: 800 }}>
      <div class="tips-content">
        <h3 class="tips-title">💡 Conseils pour réussir</h3>
        
        <div class="tips-grid">
          <div class="tip-card">
            <div class="tip-icon">📝</div>
            <h4 class="tip-title">Prenez des notes</h4>
            <p class="tip-text">Notez les concepts importants pour mieux les retenir.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">🔄</div>
            <h4 class="tip-title">Pratiquez régulièrement</h4>
            <p class="tip-text">Un peu chaque jour vaut mieux qu'une longue session.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">❓</div>
            <h4 class="tip-title">Posez des questions</h4>
            <p class="tip-text">N'hésitez jamais à demander de l'aide si vous êtes bloqué.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">🎯</div>
            <h4 class="tip-title">Fixez-vous des objectifs</h4>
            <p class="tip-text">Définissez ce que vous voulez accomplir chaque session.</p>
          </div>
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  .competence-parcours {
    padding: 1rem 0;
  }
  
  .progression-overview {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
  }
  
  .progression-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
  }
  
  .progression-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .stat-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--matiere-color, #3b82f6);
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .progression-bar-container {
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
  
  .course-section {
    margin-bottom: 3rem;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .section-description {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 0.75rem;
  }
  
  .section-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #374151;
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .course-card {
    background: white;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  
  .course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .course-card.completed {
    border-color: #22c55e;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  }
  
  .course-link {
    display: block;
    padding: 1.5rem;
    text-decoration: none;
    color: inherit;
  }
  
  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .course-status .status-icon {
    font-size: 1.25rem;
  }
  
  .course-order {
    background: #f1f5f9;
    color: #374151;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .course-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 0.5rem 0;
  }
  
  .course-description {
    font-size: 0.925rem;
    color: #4a5568;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
  
  .course-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  
  .course-type {
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .course-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .progress-bar-small {
    flex: 1;
    height: 0.375rem;
    background: #f1f5f9;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  
  .progress-fill-small {
    height: 100%;
    border-radius: 0.25rem;
    transition: width 0.6s ease;
  }
  
  .progress-percentage {
    font-size: 0.8rem;
    font-weight: 500;
    color: #374151;
  }
  
  .course-action {
    text-align: center;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f5f9;
  }
  
  .action-text {
    font-size: 0.925rem;
    font-weight: 500;
    color: var(--matiere-color, #3b82f6);
  }
  
  .tips-section {
    background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid #e2e8f0;
  }
  
  .tips-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  .tip-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s ease;
  }
  
  .tip-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .tip-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .tip-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .tip-text {
    font-size: 0.925rem;
    color: #4a5568;
    margin: 0;
    line-height: 1.5;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .courses-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .progression-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .progression-bar-container {
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }
    
    .tips-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .competence-parcours {
      padding: 0.5rem 0;
    }
    
    .progression-overview,
    .tips-section {
      padding: 1.5rem;
    }
    
    .progression-stats {
      grid-template-columns: 1fr;
    }
    
    .tips-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
