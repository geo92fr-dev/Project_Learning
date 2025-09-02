<script lang="ts">
  /**
   * 🎨 Curriculum Generator Component - Phase 6
   * Interface utilisateur pour la gestion et génération du curriculum
   */
  
  import { onMount } from 'svelte';
  import { curriculumService } from '../services/curriculumService';
  import { progressTracker } from '../services/progressTracker';
  import type { 
    Competence, 
    Course, 
    CurriculumStats,
    UserCurriculumStats,
    CurriculumFilter 
  } from '../types/curriculum';
  
  // Props
  export let userId: string = 'demo-user';
  export let showGenerationTools: boolean = false;
  export let allowFiltering: boolean = true;
  
  // État local
  let competences: Competence[] = [];
  let courses: Course[] = [];
  let filteredCompetences: Competence[] = [];
  let filteredCourses: Course[] = [];
  let curriculumStats: CurriculumStats | null = null;
  let userStats: UserCurriculumStats | null = null;
  let loading = false;
  let error: string | null = null;
  
  // Filtres
  let filters: CurriculumFilter = {};
  let searchQuery = '';
  let selectedMatiere = '';
  let selectedNiveau = '';
  let selectedDifficulty = '';
  let selectedType = '';
  
  // UI État
  let activeTab: 'competences' | 'courses' | 'stats' | 'generation' = 'competences';
  let showFilters = false;
  
  // Options de filtrage
  const matieres = [
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'francais', label: 'Français' },
    { value: 'sciences', label: 'Sciences et Technologie' },
    { value: 'histoire', label: 'Histoire-Géographie' }
  ];
  
  const niveaux = [
    { value: '6eme', label: '6ème' },
    { value: '5eme', label: '5ème' },
    { value: '4eme', label: '4ème' },
    { value: '3eme', label: '3ème' }
  ];
  
  const difficulties = [
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' },
    { value: 'expert', label: 'Expert' }
  ];
  
  const courseTypes = [
    { value: 'lesson', label: 'Cours' },
    { value: 'exercises', label: 'Exercices' }
  ];
  
  // Fonctions
  onMount(async () => {
    await loadData();
  });
  
  async function loadData() {
    loading = true;
    error = null;
    
    try {
      // Charger les données du curriculum
      const [competencesData, coursesData, statsData, userStatsData] = await Promise.all([
        curriculumService.getAllCompetences(),
        curriculumService.getAllCourses(),
        curriculumService.getStats(),
        progressTracker.getUserStats(userId)
      ]);
      
      competences = competencesData;
      courses = coursesData;
      curriculumStats = statsData;
      userStats = userStatsData;
      
      // Appliquer les filtres initiaux
      applyFilters();
      
      console.log('📚 Curriculum data loaded:', {
        competences: competences.length,
        courses: courses.length
      });
      
    } catch (err) {
      error = `Erreur lors du chargement: ${err}`;
      console.error('❌ Error loading curriculum data:', err);
    } finally {
      loading = false;
    }
  }
  
  function applyFilters() {
    // Construire l'objet de filtres
    const currentFilters: CurriculumFilter = {};
    
    if (selectedMatiere) currentFilters.matiere = selectedMatiere as any;
    if (selectedNiveau) currentFilters.niveau = selectedNiveau as any;
    if (selectedDifficulty) currentFilters.difficulty = selectedDifficulty as any;
    
    // Filtrer les compétences
    filteredCompetences = competences.filter(comp => {
      // Filtres par catégorie
      if (currentFilters.matiere && comp.matiere !== currentFilters.matiere) return false;
      if (currentFilters.niveau && comp.niveau !== currentFilters.niveau) return false;
      if (currentFilters.difficulty && comp.difficulty !== currentFilters.difficulty) return false;
      
      // Recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return comp.name.toLowerCase().includes(query) ||
               comp.description.toLowerCase().includes(query) ||
               comp.matiereDisplay.toLowerCase().includes(query);
      }
      
      return true;
    });
    
    // Filtrer les cours
    const courseFilters = { ...currentFilters };
    if (selectedType) courseFilters.type = selectedType as any;
    
    filteredCourses = courses.filter(course => {
      if (courseFilters.matiere && course.matiere !== courseFilters.matiere) return false;
      if (courseFilters.niveau && course.niveau !== courseFilters.niveau) return false;
      if (courseFilters.difficulty && course.difficulty !== courseFilters.difficulty) return false;
      if (courseFilters.type && course.type !== courseFilters.type) return false;
      
      // Recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return course.title.toLowerCase().includes(query) ||
               course.description.toLowerCase().includes(query);
      }
      
      return true;
    });
  }
  
  function clearFilters() {
    selectedMatiere = '';
    selectedNiveau = '';
    selectedDifficulty = '';
    selectedType = '';
    searchQuery = '';
    applyFilters();
  }
  
  function getDifficultyColor(difficulty: string): string {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }
  
  function getMatiereIcon(matiere: string): string {
    const icons = {
      mathematiques: '🔢',
      francais: '📚',
      sciences: '🔬',
      histoire: '🏛️'
    };
    return icons[matiere as keyof typeof icons] || '📖';
  }
  
  async function regenerateCurriculum() {
    if (!confirm('Êtes-vous sûr de vouloir régénérer tout le curriculum ? Cette action est irréversible.')) {
      return;
    }
    
    loading = true;
    try {
      // Ici on pourrait appeler le générateur
      // Pour la démo, on recharge simplement les données
      await loadData();
      alert('✅ Curriculum régénéré avec succès !');
    } catch (err) {
      error = `Erreur lors de la régénération: ${err}`;
    } finally {
      loading = false;
    }
  }
  
  // Réactivité
  $: if (selectedMatiere || selectedNiveau || selectedDifficulty || selectedType || searchQuery) {
    applyFilters();
  }
</script>

<div class="curriculum-generator">
  <!-- Header -->
  <div class="header mb-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      🎓 Gestionnaire de Curriculum
    </h1>
    <p class="text-gray-600">
      Gérez et explorez le curriculum de {competences.length} compétences et {courses.length} cours
    </p>
  </div>

  <!-- Loading/Error States -->
  {#if loading}
    <div class="loading text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement du curriculum...</p>
    </div>
  {:else if error}
    <div class="error bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h3 class="text-red-800 font-semibold mb-2">Erreur</h3>
      <p class="text-red-600">{error}</p>
      <button 
        on:click={loadData}
        class="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>
  {:else}
    <!-- Statistiques rapides -->
    {#if userStats}
      <div class="user-stats grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-600">{userStats.completedCourses}</div>
          <div class="text-sm text-blue-600">Cours terminés</div>
        </div>
        <div class="stat-card bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600">{userStats.averageScore}%</div>
          <div class="text-sm text-green-600">Moyenne générale</div>
        </div>
        <div class="stat-card bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600">{userStats.totalTimeSpent}min</div>
          <div class="text-sm text-purple-600">Temps d'étude</div>
        </div>
        <div class="stat-card bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
          <div class="text-sm text-orange-600">Jours consécutifs</div>
        </div>
      </div>
    {/if}

    <!-- Onglets -->
    <div class="tabs border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button
          class="tab {activeTab === 'competences' ? 'active' : ''}"
          on:click={() => activeTab = 'competences'}
        >
          📋 Compétences ({filteredCompetences.length})
        </button>
        <button
          class="tab {activeTab === 'courses' ? 'active' : ''}"
          on:click={() => activeTab = 'courses'}
        >
          📚 Cours ({filteredCourses.length})
        </button>
        <button
          class="tab {activeTab === 'stats' ? 'active' : ''}"
          on:click={() => activeTab = 'stats'}
        >
          📊 Statistiques
        </button>
        {#if showGenerationTools}
          <button
            class="tab {activeTab === 'generation' ? 'active' : ''}"
            on:click={() => activeTab = 'generation'}
          >
            ⚙️ Génération
          </button>
        {/if}
      </nav>
    </div>

    <!-- Filtres -->
    {#if allowFiltering && (activeTab === 'competences' || activeTab === 'courses')}
      <div class="filters mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Filtres</h3>
          <button
            on:click={() => showFilters = !showFilters}
            class="text-blue-600 hover:text-blue-700"
          >
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </button>
        </div>

        {#if showFilters}
          <div class="filter-grid grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <!-- Recherche -->
            <div class="col-span-full">
              <input
                type="text"
                bind:value={searchQuery}
                placeholder="Rechercher..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Matière -->
            <select
              bind:value={selectedMatiere}
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les matières</option>
              {#each matieres as matiere}
                <option value={matiere.value}>{matiere.label}</option>
              {/each}
            </select>

            <!-- Niveau -->
            <select
              bind:value={selectedNiveau}
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les niveaux</option>
              {#each niveaux as niveau}
                <option value={niveau.value}>{niveau.label}</option>
              {/each}
            </select>

            <!-- Difficulté -->
            <select
              bind:value={selectedDifficulty}
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les difficultés</option>
              {#each difficulties as difficulty}
                <option value={difficulty.value}>{difficulty.label}</option>
              {/each}
            </select>

            <!-- Type (pour les cours) -->
            {#if activeTab === 'courses'}
              <select
                bind:value={selectedType}
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les types</option>
                {#each courseTypes as type}
                  <option value={type.value}>{type.label}</option>
                {/each}
              </select>
            {/if}

            <!-- Clear filters -->
            <button
              on:click={clearFilters}
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Effacer
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Contenu des onglets -->
    <div class="tab-content">
      {#if activeTab === 'competences'}
        <!-- Liste des compétences -->
        <div class="competences-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each filteredCompetences as competence}
            <div class="competence-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center">
                  <span class="text-2xl mr-2">{getMatiereIcon(competence.matiere)}</span>
                  <div>
                    <h4 class="font-semibold text-gray-900">{competence.name}</h4>
                    <p class="text-sm text-gray-600">{competence.matiereDisplay} - {competence.niveau}</p>
                  </div>
                </div>
                <span class="badge {getDifficultyColor(competence.difficulty)} px-2 py-1 rounded text-xs">
                  {competence.difficulty}
                </span>
              </div>
              
              <p class="text-sm text-gray-700 mb-3">{competence.description}</p>
              
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>⏱️ {competence.estimatedTime}min</span>
                <span>🎯 {competence.objectifs.length} objectifs</span>
              </div>
            </div>
          {/each}
        </div>

      {:else if activeTab === 'courses'}
        <!-- Liste des cours -->
        <div class="courses-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each filteredCourses as course}
            <div class="course-card bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 mb-1">{course.title}</h4>
                  <p class="text-sm text-gray-600">{course.matiere} - {course.niveau}</p>
                </div>
                <div class="flex flex-col items-end space-y-1">
                  <span class="badge {getDifficultyColor(course.difficulty)} px-2 py-1 rounded text-xs">
                    {course.difficulty}
                  </span>
                  <span class="badge bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {course.type}
                  </span>
                </div>
              </div>
              
              <p class="text-sm text-gray-700 mb-4">{course.description}</p>
              
              <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>⏱️ {course.duration}min</span>
                <span>📝 {course.exerciseCount} exercices</span>
                {#if course.featured}
                  <span class="text-yellow-600">⭐ Mis en avant</span>
                {/if}
              </div>
              
              {#if course.tags?.length}
                <div class="tags flex flex-wrap gap-1">
                  {#each course.tags.slice(0, 3) as tag}
                    <span class="tag bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>

      {:else if activeTab === 'stats'}
        <!-- Statistiques -->
        {#if curriculumStats}
          <div class="stats-dashboard space-y-6">
            <!-- Statistiques générales -->
            <div class="general-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="stat-card bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-blue-900 mb-2">Compétences</h3>
                <div class="text-3xl font-bold text-blue-600">{curriculumStats.competences.total}</div>
              </div>
              <div class="stat-card bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-green-900 mb-2">Cours</h3>
                <div class="text-3xl font-bold text-green-600">{curriculumStats.courses.total}</div>
              </div>
              <div class="stat-card bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-purple-900 mb-2">Temps total</h3>
                <div class="text-3xl font-bold text-purple-600">{Math.round(curriculumStats.courses.totalEstimatedTime / 60)}h</div>
              </div>
              <div class="stat-card bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-orange-900 mb-2">Durée moyenne</h3>
                <div class="text-3xl font-bold text-orange-600">{Math.round(curriculumStats.courses.averageDuration)}min</div>
              </div>
            </div>

            <!-- Répartition par matière -->
            <div class="matiere-stats bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par matière</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each Object.entries(curriculumStats.competences.byMatiere) as [matiere, count]}
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center">
                      <span class="text-xl mr-2">{getMatiereIcon(matiere)}</span>
                      <span class="font-medium">{matieres.find(m => m.value === matiere)?.label || matiere}</span>
                    </div>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{count}</span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Répartition par niveau -->
            <div class="niveau-stats bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par niveau</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each Object.entries(curriculumStats.competences.byNiveau) as [niveau, count]}
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-900">{count}</div>
                    <div class="text-sm text-gray-600">{niveau}</div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}

      {:else if activeTab === 'generation'}
        <!-- Outils de génération -->
        <div class="generation-tools bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Outils de génération</h3>
          
          <div class="space-y-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 class="font-semibold text-yellow-800 mb-2">⚠️ Attention</h4>
              <p class="text-yellow-700 text-sm">
                La régénération du curriculum supprimera toutes les données existantes et les remplacera par de nouvelles données générées automatiquement.
              </p>
            </div>
            
            <button
              on:click={regenerateCurriculum}
              class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Génération...' : '🔄 Régénérer le curriculum'}
            </button>
            
            <div class="text-sm text-gray-600 space-y-1">
              <p>• Génération automatique de 64 compétences</p>
              <p>• Création de 128 cours associés</p>
              <p>• Répartition équilibrée sur 4 matières et 4 niveaux</p>
              <p>• Attribution automatique des difficultés et prérequis</p>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .curriculum-generator {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .tab {
    padding: 0.75rem 1rem;
    border-bottom: 2px solid transparent;
    color: #6b7280;
    transition: all 0.2s;
  }

  .tab:hover {
    color: #374151;
  }

  .tab.active {
    color: #2563eb;
    border-bottom-color: #2563eb;
  }

  .badge {
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .competence-card,
  .course-card {
    transition: all 0.2s ease-in-out;
  }

  .competence-card:hover,
  .course-card:hover {
    transform: translateY(-2px);
  }

  .loading {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .filter-grid {
      grid-template-columns: 1fr;
    }
    
    .competences-grid {
      grid-template-columns: 1fr;
    }
    
    .courses-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
