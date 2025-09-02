<!--
  📈 ProgressNavigation Component - Phase 8.A Navigation System
  Navigation avec indicateurs de progression et intégration curriculum service
-->
<script>
  export let currentChapter = 1;
  export let totalChapters = 10;
  export let completedChapters = [];
  export let courseTitle = 'Cours de Mathématiques';
  export let courseLevel = 'CE1';
  export let showDetailedProgress = true;
  export let allowSkipAhead = false;
  export let userId = 'demo-user';

  import { createEventDispatcher, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { slide, fade } from 'svelte/transition';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  
  // 🔗 Intégration curriculum service et progress tracker - Phase 8
  import { curriculumService } from '../../services/curriculumService';
  import { progressTracker } from '../../services/progressTracker';

  const dispatch = createEventDispatcher();

  // États locaux avec données curriculum
  let showProgressDetails = false;
  let expandedChapter = null;
  let realProgressData = null;
  let userStats = null;
  let coursesData = [];

  // Charger les données de progression réelles
  async function loadProgressData() {
    try {
      const [userProgress, userStatistics, courses] = await Promise.all([
        progressTracker.getUserProgress(userId),
        progressTracker.getUserStats(userId),
        curriculumService.getAllCourses()
      ]);
      
      realProgressData = userProgress;
      userStats = userStatistics;
      coursesData = courses;
      
      console.log('📊 Progress data loaded:', {
        completedCourses: userStats?.completedCourses || 0,
        averageScore: userStats?.averageScore || 0,
        totalCourses: courses.length
      });
      
      // Mettre à jour les données locales avec les vraies données
      if (userStats) {
        completedChapters = Array.from(
          { length: userStats.completedCourses }, 
          (_, i) => i + 1
        );
      }
      
    } catch (error) {
      console.error('❌ Error loading progress data:', error);
    }
  }

  onMount(() => {
    loadProgressData();
  });

  // Données simulées des chapitres
  const chapters = Array.from({ length: totalChapters }, (_, i) => ({
    id: i + 1,
    title: `Chapitre ${i + 1}`,
    subtitle: getChapterSubtitle(i + 1),
    duration: `${Math.floor(Math.random() * 20) + 10} min`,
    difficulty: getDifficultyLevel(i + 1),
    lessons: Math.floor(Math.random() * 5) + 3,
    exercises: Math.floor(Math.random() * 8) + 5
  }));

  // Fonctions utilitaires
  function getChapterSubtitle(chapterNum) {
    const subtitles = [
      'Les nombres de 0 à 10',
      'Addition simple',
      'Soustraction simple', 
      'Les nombres de 10 à 20',
      'Doubles et moitiés',
      'Les dizaines',
      'Addition avec retenue',
      'Soustraction avec emprunt',
      'Les nombres jusqu\'à 100',
      'Révisions générales'
    ];
    return subtitles[chapterNum - 1] || `Leçon ${chapterNum}`;
  }

  function getDifficultyLevel(chapterNum) {
    if (chapterNum <= 3) return 'Facile';
    if (chapterNum <= 7) return 'Moyen';
    return 'Difficile';
  }

  function getDifficultyColor(difficulty) {
    switch (difficulty) {
      case 'Facile': return 'green';
      case 'Moyen': return 'yellow';
      case 'Difficile': return 'red';
      default: return 'gray';
    }
  }

  // Calculs de progression
  $: progressPercentage = Math.round((completedChapters.length / totalChapters) * 100);
  $: currentProgress = Math.round(((currentChapter - 1) / totalChapters) * 100);
  $: isChapterCompleted = (chapterId) => completedChapters.includes(chapterId);
  $: isChapterAccessible = (chapterId) => allowSkipAhead || chapterId <= currentChapter;
  $: nextChapter = currentChapter < totalChapters ? currentChapter + 1 : null;
  $: previousChapter = currentChapter > 1 ? currentChapter - 1 : null;

  // Gestion des événements
  function navigateToChapter(chapterId) {
    if (!isChapterAccessible(chapterId)) return;
    
    const path = `/cours/${courseLevel.toLowerCase()}/chapitre-${chapterId}`;
    goto(path);
    
    dispatch('chapterChange', {
      fromChapter: currentChapter,
      toChapter: chapterId,
      chapter: chapters.find(c => c.id === chapterId)
    });
  }

  function toggleProgressDetails() {
    showProgressDetails = !showProgressDetails;
  }

  function toggleChapterDetails(chapterId) {
    expandedChapter = expandedChapter === chapterId ? null : chapterId;
  }

  function handleNextChapter() {
    if (nextChapter) {
      navigateToChapter(nextChapter);
    }
  }

  function handlePreviousChapter() {
    if (previousChapter) {
      navigateToChapter(previousChapter);
    }
  }

  function markChapterComplete() {
    if (!isChapterCompleted(currentChapter)) {
      completedChapters = [...completedChapters, currentChapter];
      dispatch('chapterCompleted', {
        chapter: currentChapter,
        completedChapters: completedChapters
      });
    }
  }
</script>

<div class="progress-navigation">
  <!-- En-tête du cours -->
  <div class="course-header">
    <div class="course-info">
      <h2 class="course-title">{courseTitle}</h2>
      <div class="course-meta">
        <Badge variant="primary" size="sm">{courseLevel}</Badge>
        <span class="chapter-indicator">
          Chapitre {currentChapter} sur {totalChapters}
        </span>
      </div>
    </div>
    
    <Button
      variant="ghost"
      size="sm"
      on:click={toggleProgressDetails}
      aria-label={showProgressDetails ? 'Masquer les détails' : 'Afficher les détails'}
    >
      <span class="expand-icon {showProgressDetails ? 'expanded' : ''}">📊</span>
    </Button>
  </div>

  <!-- Barre de progression principale -->
  <div class="main-progress">
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          style="width: {currentProgress}%"
        ></div>
        <div 
          class="progress-completed" 
          style="width: {progressPercentage}%"
        ></div>
      </div>
      <div class="progress-text">
        {completedChapters.length} / {totalChapters} chapitres terminés ({progressPercentage}%)
      </div>
    </div>
  </div>

  <!-- Navigation rapide -->
  <div class="quick-navigation">
    <Button
      variant="secondary"
      size="sm"
      disabled={!previousChapter}
      on:click={handlePreviousChapter}
    >
      ← Précédent
    </Button>

    <Button
      variant="primary"
      size="sm"
      on:click={markChapterComplete}
      disabled={isChapterCompleted(currentChapter)}
    >
      {isChapterCompleted(currentChapter) ? '✓ Terminé' : 'Marquer terminé'}
    </Button>

    <Button
      variant="secondary"
      size="sm"
      disabled={!nextChapter}
      on:click={handleNextChapter}
    >
      Suivant →
    </Button>
  </div>

  <!-- Détails de progression -->
  {#if showProgressDetails && showDetailedProgress}
    <div class="progress-details" transition:slide={{ duration: 300 }}>
      <div class="chapters-list">
        {#each chapters as chapter}
          <div class="chapter-item {isChapterCompleted(chapter.id) ? 'completed' : ''} {chapter.id === currentChapter ? 'current' : ''} {!isChapterAccessible(chapter.id) ? 'locked' : ''}">
            <!-- En-tête du chapitre -->
            <Button
              variant="ghost"
              class="chapter-button"
              disabled={!isChapterAccessible(chapter.id)}
              on:click={() => navigateToChapter(chapter.id)}
              fullWidth
            >
              <div class="chapter-content">
                <div class="chapter-status">
                  {#if isChapterCompleted(chapter.id)}
                    <span class="status-icon completed">✓</span>
                  {:else if chapter.id === currentChapter}
                    <span class="status-icon current">📍</span>
                  {:else if isChapterAccessible(chapter.id)}
                    <span class="status-icon available">○</span>
                  {:else}
                    <span class="status-icon locked">🔒</span>
                  {/if}
                </div>
                
                <div class="chapter-text">
                  <div class="chapter-title">{chapter.title}</div>
                  <div class="chapter-subtitle">{chapter.subtitle}</div>
                </div>
                
                <div class="chapter-meta">
                  <Badge 
                    variant={getDifficultyColor(chapter.difficulty)} 
                    size="xs"
                  >
                    {chapter.difficulty}
                  </Badge>
                  <span class="chapter-duration">{chapter.duration}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="xs"
                  class="expand-button"
                  on:click={(e) => { e.stopPropagation(); toggleChapterDetails(chapter.id); }}
                >
                  <span class="expand-icon {expandedChapter === chapter.id ? 'expanded' : ''}">
                    ▼
                  </span>
                </Button>
              </div>
            </Button>

            <!-- Détails étendus du chapitre -->
            {#if expandedChapter === chapter.id}
              <div class="chapter-details" transition:slide={{ duration: 200 }}>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-icon">📚</span>
                    <span class="detail-text">{chapter.lessons} leçons</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">✏️</span>
                    <span class="detail-text">{chapter.exercises} exercices</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">⏱️</span>
                    <span class="detail-text">{chapter.duration}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📊</span>
                    <span class="detail-text">{chapter.difficulty}</span>
                  </div>
                </div>
                
                {#if isChapterAccessible(chapter.id)}
                  <div class="chapter-actions">
                    <Button
                      variant="primary"
                      size="xs"
                      on:click={() => navigateToChapter(chapter.id)}
                    >
                      {chapter.id === currentChapter ? 'Continuer' : 'Commencer'}
                    </Button>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* ===== CONTAINER PRINCIPAL ===== */
  .progress-navigation {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  /* ===== EN-TÊTE DU COURS ===== */
  .course-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .course-info {
    flex: 1;
  }

  .course-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .course-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .chapter-indicator {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .expand-icon {
    font-size: 1rem;
    transition: transform 0.2s ease;
  }

  .expand-icon.expanded {
    transform: rotate(180deg);
  }

  /* ===== BARRE DE PROGRESSION ===== */
  .main-progress {
    margin-bottom: 1rem;
  }

  .progress-bar-container {
    margin-bottom: 0.5rem;
  }

  .progress-bar {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-completed {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 4px;
    transition: width 0.3s ease;
    z-index: 1;
  }

  .progress-text {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
  }

  /* ===== NAVIGATION RAPIDE ===== */
  .quick-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  /* ===== DÉTAILS DE PROGRESSION ===== */
  .progress-details {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }

  .chapters-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* ===== ITEM CHAPITRE ===== */
  .chapter-item {
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .chapter-item.current {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  .chapter-item.completed {
    background-color: #f0fdf4;
    border-color: #10b981;
  }

  .chapter-item.locked {
    opacity: 0.5;
    background-color: #f9fafb;
  }

  .progress-navigation :global(.chapter-button) {
    padding: 0.75rem;
    text-align: left;
    border-radius: 0;
    background: transparent;
  }

  .progress-navigation :global(.chapter-button:hover:not(:disabled)) {
    background-color: #f9fafb;
  }

  .chapter-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .chapter-status {
    flex-shrink: 0;
  }

  .status-icon {
    font-size: 1rem;
    width: 1.5rem;
    text-align: center;
  }

  .status-icon.completed {
    color: #10b981;
  }

  .status-icon.current {
    color: #3b82f6;
  }

  .status-icon.available {
    color: #6b7280;
  }

  .status-icon.locked {
    color: #9ca3af;
  }

  .chapter-text {
    flex: 1;
    min-width: 0;
  }

  .chapter-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.125rem;
  }

  .chapter-subtitle {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .chapter-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .chapter-duration {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .progress-navigation :global(.expand-button) {
    padding: 0.25rem;
  }

  /* ===== DÉTAILS ÉTENDUS ===== */
  .chapter-details {
    padding: 0.75rem;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .detail-icon {
    font-size: 0.875rem;
  }

  .detail-text {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .chapter-actions {
    display: flex;
    justify-content: flex-end;
  }

  /* ===== MODE SOMBRE ===== */
  :global(.dark) .progress-navigation {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark) .course-title {
    color: #f9fafb;
  }

  :global(.dark) .chapter-indicator,
  :global(.dark) .progress-text,
  :global(.dark) .chapter-subtitle,
  :global(.dark) .chapter-duration,
  :global(.dark) .detail-text {
    color: #9ca3af;
  }

  :global(.dark) .progress-bar {
    background-color: #374151;
  }

  :global(.dark) .chapter-item {
    border-color: #374151;
    background-color: #1f2937;
  }

  :global(.dark) .chapter-item.completed {
    background-color: #064e3b;
    border-color: #10b981;
  }

  :global(.dark) .chapter-item.locked {
    background-color: #111827;
  }

  :global(.dark) .chapter-title {
    color: #f9fafb;
  }

  :global(.dark) .chapter-details {
    background-color: #111827;
    border-top-color: #374151;
  }

  :global(.dark) .progress-navigation :global(.chapter-button:hover:not(:disabled)) {
    background-color: #374151;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 640px) {
    .course-header {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .quick-navigation {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .quick-navigation :global(button) {
      width: 100%;
    }
    
    .details-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .chapter-content {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .chapter-meta {
      order: 1;
      width: 100%;
      justify-content: flex-start;
    }
  }
</style>
