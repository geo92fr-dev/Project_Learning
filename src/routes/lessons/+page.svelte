<!-- 📖 Lesson Navigation Page - Phase 8 -->
<script>
  import { onMount } from 'svelte';
  import { curriculumService } from '$lib/services/curriculumService';
  import { progressTracker } from '$lib/services/progressTracker';
  import MainNavigation from '$lib/components/navigation/MainNavigation.svelte';
  import ProgressNavigation from '$lib/components/navigation/ProgressNavigation.svelte';
  
  let lessons = [];
  let userProgress = null;
  let loading = true;
  let selectedMatiere = '';
  let selectedNiveau = '';
  
  const matieres = [
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'francais', label: 'Français' },
    { value: 'sciences', label: 'Sciences' },
    { value: 'histoire', label: 'Histoire' }
  ];
  
  const niveaux = [
    { value: '6eme', label: '6ème' },
    { value: '5eme', label: '5ème' },
    { value: '4eme', label: '4ème' },
    { value: '3eme', label: '3ème' }
  ];
  
  onMount(async () => {
    await loadLessons();
  });
  
  async function loadLessons() {
    try {
      loading = true;
      const [courses, progress] = await Promise.all([
        curriculumService.getAllCourses(),
        progressTracker.getUserProgress('demo-user')
      ]);
      
      lessons = courses.filter(course => {
        if (selectedMatiere && course.matiere !== selectedMatiere) return false;
        if (selectedNiveau && course.niveau !== selectedNiveau) return false;
        return true;
      });
      
      userProgress = progress;
      loading = false;
    } catch (error) {
      console.error('Error loading lessons:', error);
      loading = false;
    }
  }
  
  function getDifficultyColor(difficulty) {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  }
  
  function getMatiereIcon(matiere) {
    const icons = {
      mathematiques: '🔢',
      francais: '📚',
      sciences: '🔬',
      histoire: '🏛️'
    };
    return icons[matiere] || '📖';
  }
  
  // Réactivité pour les filtres
  $: if (selectedMatiere || selectedNiveau) {
    loadLessons();
  }
</script>

<svelte:head>
  <title>📖 Leçons - FunLearning</title>
</svelte:head>

<MainNavigation currentRoute="/lessons" />

<main class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">📖 Catalogue des Leçons</h1>
    <p class="text-gray-600">Découvrez toutes les leçons disponibles par matière et niveau</p>
  </div>

  <!-- Filtres -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-lg font-semibold mb-4">🔍 Filtres</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="matiere-select" class="block text-sm font-medium text-gray-700 mb-2">Matière</label>
        <select 
          id="matiere-select"
          bind:value={selectedMatiere}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les matières</option>
          {#each matieres as matiere}
            <option value={matiere.value}>{matiere.label}</option>
          {/each}
        </select>
      </div>
      
      <div>
        <label for="niveau-select" class="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
        <select 
          id="niveau-select"
          bind:value={selectedNiveau}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les niveaux</option>
          {#each niveaux as niveau}
            <option value={niveau.value}>{niveau.label}</option>
          {/each}
        </select>
      </div>
    </div>
    
    <div class="mt-4 flex space-x-2">
      <button 
        on:click={() => { selectedMatiere = ''; selectedNiveau = ''; }}
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Effacer les filtres
      </button>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement des leçons...</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each lessons as lesson}
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <span class="text-2xl mr-3">{getMatiereIcon(lesson.matiere)}</span>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                <p class="text-sm text-gray-600">{lesson.matiere} - {lesson.niveau}</p>
              </div>
            </div>
            <span class="badge {getDifficultyColor(lesson.difficulty)} px-2 py-1 rounded text-xs">
              {lesson.difficulty}
            </span>
          </div>
          
          <p class="text-sm text-gray-700 mb-4 line-clamp-3">{lesson.description}</p>
          
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>⏱️ {lesson.duration} min</span>
            <span>📝 {lesson.exerciseCount} exercices</span>
            <span class="badge bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {lesson.type}
            </span>
          </div>
          
          {#if lesson.tags?.length}
            <div class="flex flex-wrap gap-1 mb-4">
              {#each lesson.tags.slice(0, 3) as tag}
                <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              {/each}
            </div>
          {/if}
          
          <button 
            class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            on:click={() => window.location.href = `/curriculum/course/${lesson.id}`}
          >
            Commencer la leçon
          </button>
        </div>
      {/each}
    </div>
    
    {#if lessons.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune leçon trouvée</h3>
        <p class="text-gray-600">Essayez de modifier vos filtres pour voir plus de résultats</p>
      </div>
    {/if}
  {/if}
</main>

<style>
  .container {
    max-width: 1200px;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .badge {
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
</style>
