<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { exercisesStore } from '$lib/stores/exercises';
  import { isOnline } from '$lib/stores/pwa';
  import { indexedDBStore } from '$lib/stores/indexeddb';
  
  export let showOfflineIndicator = true;
  
  interface OfflineExercise {
    id: string;
    title: string;
    difficulty: number;
    cached: boolean;
    lastAccessed: string;
    size?: number;
  }
  
  let offlineExercises: OfflineExercise[] = [];
  let totalCacheSize = 0;
  let loading = false;
  let downloadingId: string | null = null;
  let isClientSide = false;
  
  onMount(async () => {
    isClientSide = true;
    if (browser) {
      await loadOfflineExercises();
      await calculateCacheSize();
    }
  });
  
  async function loadOfflineExercises() {
    if (!browser) return;
    
    loading = true;
    try {
      const cached = await indexedDBStore.getAllExercises();
      offlineExercises = cached.map((ex: any) => ({
        id: ex.id,
        title: ex.title,
        difficulty: ex.difficulty,
        cached: true,
        lastAccessed: ex.lastAccessed || new Date().toISOString(),
        size: JSON.stringify(ex).length
      }));
    } catch (error) {
      console.error('Erreur chargement exercices offline:', error);
    } finally {
      loading = false;
    }
  }
  
  async function calculateCacheSize() {
    if (!browser) return;
    
    try {
      const stats = await indexedDBStore.getCacheStats();
      totalCacheSize = stats?.size || 0;
    } catch (error) {
      console.error('Erreur calcul taille cache:', error);
    }
  }
  
  async function removeExercise(exerciseId: string) {
    if (!browser) return;
    
    try {
      await indexedDBStore.deleteExercise(exerciseId);
      await loadOfflineExercises();
      await calculateCacheSize();
    } catch (error) {
      console.error('Erreur suppression exercice:', error);
    }
  }
  
  async function clearAllCache() {
    if (!browser) return;
    
    if (confirm('Supprimer tous les exercices en cache ?')) {
      try {
        await indexedDBStore.clearCache();
        await loadOfflineExercises();
        await calculateCacheSize();
      } catch (error) {
        console.error('Erreur suppression cache:', error);
      }
    }
  }
  
  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
  
  function getDifficultyColor(difficulty: number): string {
    if (difficulty <= 2) return 'text-green-600';
    if (difficulty <= 4) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  function getDifficultyLabel(difficulty: number): string {
    if (difficulty <= 2) return 'Facile';
    if (difficulty <= 4) return 'Moyen';
    return 'Difficile';
  }
</script>

{#if isClientSide}
<div class="offline-exercises">
  <!-- En-tête avec indicateur de statut -->
  <div class="header">
    <h3 class="title">
      📱 Exercices Offline
      {#if showOfflineIndicator}
        <span class="status-badge" class:online={$isOnline} class:offline={!$isOnline}>
          {$isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
        </span>
      {/if}
    </h3>
    
    <div class="cache-info">
      <span class="cache-size">
        📦 Cache: {formatSize(totalCacheSize)}
      </span>
      <button 
        class="clear-btn"
        on:click={clearAllCache}
        disabled={offlineExercises.length === 0}
      >
        🗑️ Vider
      </button>
    </div>
  </div>
  
  <!-- Zone de chargement -->
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <span>Chargement des exercices...</span>
    </div>
  {/if}
  
  <!-- Liste des exercices offline -->
  {#if offlineExercises.length > 0}
    <div class="exercises-list">
      {#each offlineExercises as exercise (exercise.id)}
        <div class="exercise-card">
          <div class="exercise-info">
            <h4 class="exercise-title">{exercise.title}</h4>
            <div class="exercise-meta">
              <span class="difficulty {getDifficultyColor(exercise.difficulty)}">
                ⭐ {getDifficultyLabel(exercise.difficulty)}
              </span>
              <span class="size">
                {exercise.size ? formatSize(exercise.size) : 'N/A'}
              </span>
              <span class="last-access">
                📅 {new Date(exercise.lastAccessed).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div class="exercise-actions">
            <button 
              class="play-btn"
              on:click={() => window.location.href = `/exercises/${exercise.id}`}
            >
              ▶️ Jouer
            </button>
            <button 
              class="remove-btn"
              on:click={() => removeExercise(exercise.id)}
            >
              ❌
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else if !loading}
    <div class="empty-state">
      <div class="empty-icon">📱</div>
      <h4>Aucun exercice en cache</h4>
      <p>Téléchargez des exercices pour les utiliser hors ligne</p>
    </div>
  {/if}
</div>
{:else}
<div class="offline-exercises">
  <div class="loading">
    <div class="spinner"></div>
    <span>Initialisation des fonctionnalités offline...</span>
  </div>
</div>
{/if}

<style>
  .offline-exercises {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .status-badge {
    font-size: 0.85rem;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
  }
  
  .status-badge.online {
    background: #dcfce7;
    color: #166534;
  }
  
  .status-badge.offline {
    background: #fecaca;
    color: #991b1b;
  }
  
  .cache-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .cache-size {
    font-size: 0.9rem;
    color: #6b7280;
  }
  
  .clear-btn {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .clear-btn:hover:not(:disabled) {
    background: #fecaca;
  }
  
  .clear-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
    justify-content: center;
    color: #6b7280;
  }
  
  .exercises-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .exercise-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
    transition: all 0.2s;
  }
  
  .exercise-card:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
  
  .exercise-info {
    flex: 1;
  }
  
  .exercise-title {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 8px 0;
    color: #1f2937;
  }
  
  .exercise-meta {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    flex-wrap: wrap;
  }
  
  .difficulty {
    font-weight: 500;
  }
  
  .size, .last-access {
    color: #6b7280;
  }
  
  .exercise-actions {
    display: flex;
    gap: 8px;
  }
  
  .play-btn, .remove-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid;
  }
  
  .play-btn {
    background: #dbeafe;
    color: #1d4ed8;
    border-color: #93c5fd;
  }
  
  .play-btn:hover {
    background: #bfdbfe;
  }
  
  .remove-btn {
    background: #fee2e2;
    color: #dc2626;
    border-color: #fecaca;
  }
  
  .remove-btn:hover {
    background: #fecaca;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }
  
  .empty-state h4 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 8px 0;
    color: #374151;
  }
  
  .empty-state p {
    margin: 0 0 20px 0;
    font-size: 0.9rem;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 640px) {
    .offline-exercises {
      padding: 16px;
    }
    
    .header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .exercise-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .exercise-actions {
      align-self: flex-end;
    }
  }
</style>