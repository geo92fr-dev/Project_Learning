/**
 * Course Card Component
 * Phase 5B: Frontend Integration - Course Display
 * 
 * @description Composant Svelte pour afficher une carte de cours
 * @follows MyDevFramework CoPilot Best Practices
 */

<script lang="ts">
  import { userProgressStore, updateUserProgress } from '$lib/firebase/stores/firebase-stores';
  import type { Course } from '$lib/firebase/collections';
  
  // Props
  export let course: Course;
  export let userId: string | null = null;
  export let compact = false;
  
  // Support pour les attributs de test
  let className = '';
  export { className as class };
  
  // Accept all other props (including data-testid)
  export let dataTestid: string | undefined = undefined;
  
  // State
  let enrolling = false;
  
  // Reactive statements
  $: progress = userId ? $userProgressStore.get(course.id) : null;
  $: isEnrolled = progress !== undefined;
  $: completionPercentage = progress ? (progress.score || 0) : 0;
  $: statusText = getStatusText(progress?.status);
  
  // Functions
  function getStatusText(status?: string) {
    switch (status) {
      case 'not_started': return 'Non commencé';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'paused': return 'En pause';
      default: return 'Disponible';
    }
  }
  
  function getLevelText(level: string) {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  }
  
  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  }
  
  async function enrollInCourse() {
    if (!userId || enrolling) return;
    
    enrolling = true;
    
    try {
      await updateUserProgress({
        userId,
        courseId: course.id,
        status: 'not_started',
        score: 0,
        completed: false
      });
    } catch (error) {
      console.error('Erreur inscription cours:', error);
    } finally {
      enrolling = false;
    }
  }
  
  async function startCourse() {
    if (!userId || !progress) return;
    
    try {
      await updateUserProgress({
        userId,
        courseId: course.id,
        status: 'in_progress',
        score: progress.score || 0,
        completed: false
      });
    } catch (error) {
      console.error('Erreur démarrage cours:', error);
    }
  }
  
  function handleCourseClick() {
    // Émettre un événement pour la navigation
    const event = new CustomEvent('courseSelect', {
      detail: { course, progress }
    });
    dispatchEvent(event);
  }
</script>

<div 
  class="course-card {className}"
  class:compact
  data-testid={dataTestid || "course-card"}
  data-course-id={course.id}
>
  <div class="course-header">
    <h3 
      class="course-title" 
      data-testid="course-title"
      on:click={handleCourseClick}
      on:keydown={(e) => e.key === 'Enter' && handleCourseClick()}
      role="button"
      tabindex="0"
    >
      {course.title}
    </h3>
    
    {#if !compact}
      <div class="course-meta">
        <span class="level" data-testid="course-level">
          {getLevelText(course.level)}
        </span>
        <span class="duration" data-testid="course-duration">
          {formatDuration(course.estimatedDuration)}
        </span>
        <span class="category" data-testid="course-category">
          {course.category}
        </span>
      </div>
    {/if}
  </div>
  
  <p class="course-description" data-testid="course-description">
    {course.description}
  </p>
  
  {#if !compact}
    <div class="course-tags">
      {#each course.tags.slice(0, 3) as tag}
        <span class="tag" data-testid="course-tag">{tag}</span>
      {/each}
      {#if course.tags.length > 3}
        <span class="tag-more">+{course.tags.length - 3}</span>
      {/if}
    </div>
  {/if}
  
  <!-- Progress section -->
  {#if isEnrolled && progress}
    <div class="progress-section" data-testid="progress-section">
      <div class="progress-info">
        <span class="status" data-testid="course-status">{statusText}</span>
        <span class="score" data-testid="course-score">{completionPercentage}%</span>
      </div>
      
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          style="width: {completionPercentage}%"
          data-testid="progress-bar"
        ></div>
      </div>
      
      {#if progress.status === 'not_started'}
        <button 
          class="btn btn-primary"
          on:click={startCourse}
          data-testid="start-course-button"
        >
          Commencer le cours
        </button>
      {:else if progress.status === 'in_progress'}
        <button 
          class="btn btn-primary"
          on:click={handleCourseClick}
          data-testid="continue-course-button"
        >
          Continuer le cours
        </button>
      {:else if progress.completed}
        <button 
          class="btn btn-success"
          on:click={handleCourseClick}
          data-testid="review-course-button"
        >
          Revoir le cours
        </button>
      {/if}
    </div>
  {:else if userId}
    <!-- Enrollment section -->
    <div class="enrollment-section">
      <button 
        class="btn btn-outline"
        on:click={enrollInCourse}
        disabled={enrolling}
        data-testid="enroll-button"
      >
        {enrolling ? 'Inscription...' : "S'inscrire"}
      </button>
    </div>
  {/if}
  
  {#if !compact}
    <!-- Analytics section -->
    <div class="analytics-section">
      <div class="analytics-grid">
        <div class="metric">
          <span class="metric-value" data-testid="total-enrollments">
            {course.analytics.totalEnrollments}
          </span>
          <span class="metric-label">inscrits</span>
        </div>
        
        <div class="metric">
          <span class="metric-value" data-testid="completion-rate">
            {Math.round(course.analytics.completionRate * 100)}%
          </span>
          <span class="metric-label">terminé</span>
        </div>
        
        {#if course.analytics.averageRating}
          <div class="metric">
            <span class="metric-value" data-testid="average-rating">
              {course.analytics.averageRating.toFixed(1)}
            </span>
            <span class="metric-label">note</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .course-card {
    background: var(--surface-color, white);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .course-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .course-card.compact {
    padding: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .course-header {
    margin-bottom: 1rem;
  }
  
  .course-title {
    color: var(--text-primary, #333);
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .course-title:hover {
    color: var(--primary-color, #007bff);
  }
  
  .course-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .level, .duration, .category {
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
    background: var(--background-light, #f8f9fa);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }
  
  .level {
    background: var(--info-color-light, #e3f2fd);
    color: var(--info-color, #0288d1);
  }
  
  .course-description {
    color: var(--text-secondary, #666);
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .compact .course-description {
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .course-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  
  .tag {
    background: var(--primary-color-light, #e3f2fd);
    color: var(--primary-color, #007bff);
    padding: 0.25rem 0.5rem;
    border-radius: 16px;
    font-size: 0.75rem;
  }
  
  .tag-more {
    background: var(--secondary-color-light, #f5f5f5);
    color: var(--text-secondary, #666);
    padding: 0.25rem 0.5rem;
    border-radius: 16px;
    font-size: 0.75rem;
  }
  
  .progress-section, .enrollment-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light, #f0f0f0);
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .status {
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
    text-transform: capitalize;
  }
  
  .score {
    font-weight: 600;
    color: var(--success-color, #28a745);
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--background-light, #f8f9fa);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--success-color, #28a745), var(--primary-color, #007bff));
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }
  
  .btn-primary {
    background: var(--primary-color, #007bff);
    color: white;
  }
  
  .btn-success {
    background: var(--success-color, #28a745);
    color: white;
  }
  
  .btn-outline {
    background: transparent;
    color: var(--primary-color, #007bff);
    border: 1px solid var(--primary-color, #007bff);
  }
  
  .btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .analytics-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light, #f0f0f0);
  }
  
  .analytics-grid {
    display: flex;
    gap: 2rem;
    justify-content: space-around;
  }
  
  .metric {
    text-align: center;
  }
  
  .metric-value {
    display: block;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--primary-color, #007bff);
    margin-bottom: 0.25rem;
  }
  
  .metric-label {
    font-size: 0.75rem;
    color: var(--text-secondary, #666);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 768px) {
    .course-card {
      padding: 1rem;
    }
    
    .course-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .analytics-grid {
      gap: 1rem;
    }
    
    .btn {
      width: 100%;
    }
  }
</style>
