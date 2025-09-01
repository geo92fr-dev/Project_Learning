/**
 * Dashboard Page - Firebase Integration Example
 * Phase 5B: Frontend Integration - Complete Example
 * 
 * @description Page de tableau de bord utilisant les stores Firebase
 * @follows MyDevFramework CoPilot Best Practices
 */

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { 
    userProfileStore, 
    coursesStore, 
    userProgressStore,
    currentCoursesStore,
    completedCoursesStore,
    userStatsStore,
    authInfoStore,
    initializeFirebaseStores,
    getUserCourses,
    getCompetences
  } from '$lib/firebase/stores/firebase-stores';
  
  import UserProfileCard from '$lib/components/UserProfileCard.svelte';
  import CourseCard from '$lib/components/CourseCard.svelte';
  
  // State
  let loading = true;
  let error = '';
  let unsubscribe: (() => void) | null = null;
  
  // Reactive statements
  $: profile = $userProfileStore;
  $: authInfo = $authInfoStore;
  $: courses = $coursesStore;
  $: currentCourses = $currentCoursesStore;
  $: completedCourses = $completedCoursesStore;
  $: stats = $userStatsStore;
  
  // Lifecycle
  onMount(async () => {
    try {
      // Initialiser Firebase stores
      unsubscribe = initializeFirebaseStores();
      
      // Attendre que l'authentification soit résolue
      await new Promise(resolve => {
        const unsubAuth = authInfoStore.subscribe(authInfo => {
          if (authInfo.isAuthenticated !== null) {
            unsubAuth();
            resolve(authInfo);
          }
        });
      });
      
      // Charger les données si l'utilisateur est connecté
      if ($authInfoStore.isAuthenticated && $authInfoStore.user) {
        await loadUserData($authInfoStore.user.uid);
      }
      
    } catch (err) {
      console.error('Erreur initialisation dashboard:', err);
      error = 'Erreur lors du chargement du tableau de bord';
    } finally {
      loading = false;
    }
  });
  
  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  // Functions
  async function loadUserData(userId: string) {
    try {
      // Charger les cours et compétences en parallèle
      await Promise.all([
        getUserCourses(userId),
        getCompetences()
      ]);
    } catch (err) {
      console.error('Erreur chargement données utilisateur:', err);
      error = 'Erreur lors du chargement des données';
    }
  }
  
  function handleCourseSelect(event: CustomEvent) {
    const { course, progress } = event.detail;
    console.log('Cours sélectionné:', course.title, progress);
    // Ici on pourrait naviguer vers la page du cours
    // goto(`/courses/${course.id}`);
  }
</script>

<svelte:head>
  <title>Tableau de bord - FunLearning</title>
  <meta name="description" content="Votre tableau de bord d'apprentissage personnalisé" />
</svelte:head>

<div class="dashboard" data-testid="dashboard">
  {#if loading}
    <div class="loading-container" data-testid="loading">
      <div class="loading-spinner"></div>
      <p>Chargement de votre tableau de bord...</p>
    </div>
  
  {:else if error}
    <div class="error-container" data-testid="error">
      <h2>Erreur</h2>
      <p>{error}</p>
      <button class="btn btn-primary" on:click={() => window.location.reload()}>
        Recharger la page
      </button>
    </div>
  
  {:else if !$authInfoStore.isAuthenticated}
    <div class="auth-required" data-testid="auth-required">
      <h2>Connexion requise</h2>
      <p>Vous devez être connecté pour accéder à votre tableau de bord.</p>
    </div>
  
  {:else}
    <!-- User Profile Section -->
    <section class="profile-section" data-testid="profile-section">
      <UserProfileCard editable={true} showPreferences={true} />
    </section>
    
    <!-- Statistics Overview -->
    {#if stats}
      <section class="stats-section" data-testid="stats-section">
        <h2>Votre progression</h2>
        <div class="stats-grid">
          <div class="stat-card" data-testid="total-courses-stat">
            <h3>{stats.totalCourses}</h3>
            <p>Cours au total</p>
          </div>
          <div class="stat-card" data-testid="completed-courses-stat">
            <h3>{stats.completedCourses}</h3>
            <p>Cours terminés</p>
          </div>
          <div class="stat-card" data-testid="in-progress-courses-stat">
            <h3>{stats.inProgressCourses}</h3>
            <p>En cours</p>
          </div>
          <div class="stat-card" data-testid="average-score-stat">
            <h3>{stats.averageScore}%</h3>
            <p>Score moyen</p>
          </div>
          <div class="stat-card" data-testid="total-time-stat">
            <h3>{Math.floor(stats.totalTimeSpent / 60)}h</h3>
            <p>Temps d'étude</p>
          </div>
        </div>
      </section>
    {/if}
    
    <!-- Current Courses Section -->
    {#if currentCourses.length > 0}
      <section class="current-courses-section" data-testid="current-courses-section">
        <h2>Cours en cours ({currentCourses.length})</h2>
        <div class="courses-grid">
          {#each currentCourses as course (course.id)}
            <CourseCard 
              {course} 
              userId={$authInfoStore.user?.uid}
              dataTestid="current-course-card"
              on:courseSelect={handleCourseSelect}
            />
          {/each}
        </div>
      </section>
    {/if}
    
    <!-- Available Courses Section -->
    {#if courses.length > 0}
      <section class="available-courses-section" data-testid="available-courses-section">
        <h2>Cours disponibles ({courses.length})</h2>
        <div class="courses-grid">
          {#each courses.slice(0, 6) as course (course.id)}
            <CourseCard 
              {course} 
              userId={$authInfoStore.user?.uid}
              compact={true}
              dataTestid="available-course-card"
              on:courseSelect={handleCourseSelect}
            />
          {/each}
        </div>
        {#if courses.length > 6}
          <div class="view-more">
            <button class="btn btn-outline" data-testid="view-all-courses">
              Voir tous les cours ({courses.length})
            </button>
          </div>
        {/if}
      </section>
    {/if}
    
    <!-- Completed Courses Section -->
    {#if completedCourses.length > 0}
      <section class="completed-courses-section" data-testid="completed-courses-section">
        <h2>Cours terminés ({completedCourses.length})</h2>
        <div class="courses-grid">
          {#each completedCourses.slice(0, 3) as course (course.id)}
            <CourseCard 
              {course} 
              userId={$authInfoStore.user?.uid}
              compact={true}
              dataTestid="completed-course-card"
              on:courseSelect={handleCourseSelect}
            />
          {/each}
        </div>
      </section>
    {/if}
    
    <!-- Empty State -->
    {#if courses.length === 0 && currentCourses.length === 0}
      <section class="empty-state" data-testid="empty-state">
        <div class="empty-content">
          <h2>Bienvenue sur FunLearning !</h2>
          <p>Vous n'avez pas encore de cours. Explorez notre catalogue pour commencer votre apprentissage.</p>
          <button class="btn btn-primary" data-testid="explore-courses">
            Explorer les cours
          </button>
        </div>
      </section>
    {/if}
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
  }
  
  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--background-light, #f3f3f3);
    border-top: 4px solid var(--primary-color, #007bff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-container, .auth-required {
    text-align: center;
    padding: 2rem;
    background: var(--surface-color, white);
    border-radius: 12px;
    border: 1px solid var(--border-color, #e0e0e0);
  }
  
  .error-container h2, .auth-required h2 {
    color: var(--error-color, #dc3545);
    margin-bottom: 1rem;
  }
  
  .profile-section {
    margin-bottom: 3rem;
  }
  
  .stats-section {
    margin-bottom: 3rem;
  }
  
  .stats-section h2 {
    margin-bottom: 1.5rem;
    color: var(--text-primary, #333);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: var(--surface-color, white);
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid var(--border-color, #e0e0e0);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .stat-card h3 {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--primary-color, #007bff);
    margin: 0 0 0.5rem 0;
  }
  
  .stat-card p {
    color: var(--text-secondary, #666);
    margin: 0;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .current-courses-section,
  .available-courses-section,
  .completed-courses-section {
    margin-bottom: 3rem;
  }
  
  .current-courses-section h2,
  .available-courses-section h2,
  .completed-courses-section h2 {
    margin-bottom: 1.5rem;
    color: var(--text-primary, #333);
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .view-more {
    text-align: center;
    margin-top: 2rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .empty-content {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .empty-content h2 {
    color: var(--text-primary, #333);
    margin-bottom: 1rem;
  }
  
  .empty-content p {
    color: var(--text-secondary, #666);
    margin-bottom: 2rem;
    line-height: 1.6;
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
  }
  
  .btn-primary {
    background: var(--primary-color, #007bff);
    color: white;
  }
  
  .btn-outline {
    background: transparent;
    color: var(--primary-color, #007bff);
    border: 1px solid var(--primary-color, #007bff);
  }
  
  .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .dashboard {
      padding: 1rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .stat-card {
      padding: 1.5rem;
    }
    
    .stat-card h3 {
      font-size: 2rem;
    }
    
    .courses-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
