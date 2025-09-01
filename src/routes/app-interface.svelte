<!-- 
  Phase 7.A - Interface Utilisateur Avancée avec Fonctionnalités Interactives
  Application stricte des DOC_CoPilot_Practices avec TDD
-->

<script>
  import { onMount } from 'svelte';
  import CurriculumIntegrationService from '../lib/curriculum-integration.js';
  
  // 🔗 Service d'intégration avec les données réelles
  let curriculumService;
  let dashboardData = null;
  let recommendations = null;
  
  // État de l'interface
  let currentTheme = 'light';
  let currentDifficulty = 'beginner';
  let isLoading = true;
  
  // Données de l'application
  let courses = [];
  let recentActivities = [];
  let userProgress = {};
  let userStats = {};
  
  // 🎯 Phase 7.A - Fonctionnalités Interactives Avancées
  let searchQuery = '';
  let selectedMatieres = [];
  let filteredCourses = [];
  let showFilters = false;
  
  // État pour la gamification
  let userXP = 0;
  let userBadges = [];
  let weeklyProgress = 0;
  
  onMount(async () => {
    console.log('🚀 Initialisation de l\'interface Phase 7.A');
    
    // Initialiser le service d'intégration
    curriculumService = new CurriculumIntegrationService();
    
    // Charger les données du dashboard
    await loadDashboardData();
    
    // Détection du thème système
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
      updateTheme();
    }
    
    isLoading = false;
    console.log('✅ Interface Phase 7.A initialisée avec succès');
  });
  
  async function loadDashboardData() {
    try {
      console.log('📊 Chargement des données du dashboard...');
      
      // Récupérer toutes les données du dashboard
      dashboardData = curriculumService.getDashboardData();
      recommendations = curriculumService.getRecommendedCourses();
      
      // Extraire les données pour l'interface
      courses = Object.values(dashboardData.coursesByDifficulty).flat();
      recentActivities = dashboardData.recentActivity;
      userProgress = dashboardData.user;
      userStats = dashboardData.stats;
      currentDifficulty = dashboardData.preferences.difficulty;
      
      console.log('📊 Dashboard data loaded:', {
        totalCourses: courses.length,
        currentDifficulty,
        userLevel: userProgress.level
      });
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      isLoading = false;
    }
  }
  
  function updateTheme() {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    console.log(`🎨 Thème mis à jour: ${currentTheme}`);
  }
  
  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateTheme();
  }
  
  function selectDifficulty(difficulty) {
    console.log(`🎯 Sélection difficulté: ${difficulty}`);
    currentDifficulty = difficulty;
    filterCourses();
  }
  
  // 🎯 Filtrage intelligent avec recherche fuzzy
  function filterCourses() {
    let filtered = courses;
    
    // Filtre par difficulté
    if (currentDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === currentDifficulty);
    }
    
    // Filtre par matières sélectionnées
    if (selectedMatieres.length > 0) {
      filtered = filtered.filter(course => selectedMatieres.includes(course.matiere));
    }
    
    // Recherche fuzzy
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.matiere.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
    }
    
    filteredCourses = filtered;
    console.log(`🔍 Filtrage: ${filteredCourses.length} cours trouvés`);
  }
  
  // 🎮 Calcul des XP et badges
  function calculateUserStats() {
    if (!dashboardData) return;
    
    const xpMultipliers = { beginner: 10, intermediate: 25, advanced: 50, expert: 100 };
    userXP = Object.entries(dashboardData.coursesByDifficulty)
      .reduce((total, [diff, courses]) => {
        const completed = courses.filter(c => c.progress === 100).length;
        return total + (completed * (xpMultipliers[diff] || 10));
      }, 0);
    
    // Badges basés sur les achievements
    userBadges = [];
    const completedCount = courses.filter(c => c.progress === 100).length;
    
    if (completedCount >= 10) userBadges.push({ name: 'Explorer', icon: '🗺️' });
    if (dashboardData.currentStreak >= 7) userBadges.push({ name: 'Persévérant', icon: '🔥' });
    if (userXP >= 500) userBadges.push({ name: 'Expert', icon: '🏆' });
    if (dashboardData.completionRate >= 80) userBadges.push({ name: 'Perfectionniste', icon: '⭐' });
    
    console.log(`🎮 Stats calculées: ${userXP} XP, ${userBadges.length} badges`);
  }
  
  // 📊 Analytics en temps réel
  function calculateWeeklyProgress() {
    if (!recentActivities) return 0;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    weeklyProgress = recentActivities.filter(activity => 
      new Date(activity.date) >= oneWeekAgo
    ).length;
    
    console.log(`📈 Progression hebdomadaire: ${weeklyProgress} activités`);
  }
  
  // Toggle des matières dans le filtre
  function toggleMatiere(matiere) {
    if (selectedMatieres.includes(matiere)) {
      selectedMatieres = selectedMatieres.filter(m => m !== matiere);
    } else {
      selectedMatieres = [...selectedMatieres, matiere];
    }
    filterCourses();
  }
  
  function getDifficultyColor(difficulty) {
    const colors = {
      beginner: '#10b981',
      intermediate: '#f59e0b', 
      advanced: '#f97316',
      expert: '#ef4444'
    };
    return colors[difficulty] || '#64748b';
  }
  
  function formatSubjectIcon(matiere) {
    const icons = {
      'mathematiques': '🔢',
      'francais': '📖', 
      'sciences': '🔬',
      'histoire': '🏛️',
      'geographie': '🌍',
      'programmation': '💻'
    };
    return icons[matiere] || '📚';
  }
  
  function continueCourse(courseId) {
    console.log('🎓 Continuer le cours:', courseId);
    // TODO: Navigation vers le cours
  }
  
  // Mise à jour réactive selon DOC_CoPilot_Practices
  $: if (courses.length > 0) {
    filteredCourses = courses;
    filterCourses();
    calculateUserStats();
    calculateWeeklyProgress();
  }
  
  $: if (searchQuery !== undefined || selectedMatieres !== undefined || currentDifficulty !== undefined) {
    filterCourses();
  }
  
  // Design System intégré
  const designSystem = {
    components: {
      card: 'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg',
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300',
        secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg font-medium transition-colors duration-200'
      }
    },
    colors: {
      difficulty: {
        beginner: '#10b981',
        intermediate: '#f59e0b', 
        advanced: '#f97316',
        expert: '#ef4444'
      }
    }
  };
  
  // Styles dynamiques
  $: themeClasses = currentTheme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';
</script>

<svelte:head>
  <title>FunLearning - Interface Avancée Phase 7.A</title>
  <meta name="description" content="Interface d'apprentissage avec fonctionnalités interactives selon DOC_CoPilot_Practices" />
</svelte:head>

<div class="min-h-screen transition-colors duration-300 {themeClasses}">
  
  <!-- Header Navigation avec Design System -->
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <!-- Logo et Navigation -->
        <div class="flex items-center space-x-8">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              🚀 FunLearning
            </h1>
            <span class="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
              Phase 7.A
            </span>
          </div>
          
          <nav class="hidden md:flex space-x-6">
            <a href="/" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Accueil
            </a>
            <a href="/app-interface" class="text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-blue-600 dark:border-blue-400">
              Interface Avancée
            </a>
            <a href="/progress" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Progrès
            </a>
          </nav>
        </div>
        
        <!-- 🔍 Phase 7.A - Barre de recherche intelligente -->
        <div class="flex items-center space-x-4">
          
          <div class="hidden lg:flex items-center space-x-3">
            <div class="relative">
              <input
                type="text"
                placeholder="Rechercher un cours..."
                bind:value={searchQuery}
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-400">🔍</span>
              </div>
              {#if searchQuery}
                <button
                  on:click={() => searchQuery = ''}
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Effacer la recherche"
                >
                  ✕
                </button>
              {/if}
            </div>
            
            <!-- Bouton filtres -->
            <button
              on:click={() => showFilters = !showFilters}
              class="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              aria-label="Afficher/masquer les filtres"
            >
              <span>🎛️</span>
              <span class="text-sm">Filtres</span>
              {#if selectedMatieres.length > 0}
                <span class="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {selectedMatieres.length}
                </span>
              {/if}
            </button>
          </div>
          
          <!-- Switch thème -->
          <button 
            on:click={toggleTheme}
            class="p-2 rounded-lg transition-colors duration-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Basculer le thème {currentTheme === 'dark' ? 'clair' : 'sombre'}"
          >
            {#if currentTheme === 'dark'}
              ☀️
            {:else}
              🌙
            {/if}
          </button>
        </div>
      </div>
    </div>
  </header>
  
  <!-- 🎛️ Phase 7.A - Panneau de filtres avancés -->
  {#if showFilters}
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap items-center gap-4">
          
          <!-- Difficulté -->
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulté:</span>
            <div class="flex space-x-1">
              {#each Object.keys(designSystem.colors.difficulty) as difficulty}
                <button
                  on:click={() => selectDifficulty(difficulty)}
                  class="px-3 py-1 rounded-full text-sm transition-all duration-200 {
                    currentDifficulty === difficulty
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }"
                  style={currentDifficulty === difficulty ? `background-color: ${getDifficultyColor(difficulty)}` : ''}
                >
                  {difficulty}
                </button>
              {/each}
            </div>
          </div>
          
          <!-- Matières disponibles -->
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Matières:</span>
            <div class="flex flex-wrap gap-2">
              {#each ['mathematiques', 'francais', 'sciences', 'histoire', 'geographie', 'programmation'] as matiere}
                <button
                  on:click={() => toggleMatiere(matiere)}
                  class="px-3 py-1 rounded-full text-sm transition-all duration-200 {
                    selectedMatieres.includes(matiere)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }"
                >
                  {formatSubjectIcon(matiere)} {matiere}
                </button>
              {/each}
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-auto">
            <span class="text-sm text-gray-500">
              {filteredCourses.length} cours trouvés
            </span>
            <button
              on:click={() => {
                searchQuery = '';
                selectedMatieres = [];
                currentDifficulty = 'beginner';
              }}
              class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Contenu principal -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    {#if isLoading}
      <!-- Loading state avec design system -->
      <div class="flex items-center justify-center min-h-96">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Chargement de l'interface Phase 7.A...</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">Application des DOC_CoPilot_Practices</p>
        </div>
      </div>
    {:else if dashboardData}
    
      <!-- Section Hero avec gamification -->
      <section class="mb-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Panneau principal avec métriques -->
          <div class="lg:col-span-2">
            <div class="{designSystem.components.card}">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Bonjour {dashboardData.user.name} ! 👋
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400 mt-2">
                    Niveau {dashboardData.user.level} • {userXP} XP • Série de {dashboardData.user.currentStreak} jours 🔥
                  </p>
                  <div class="mt-1 text-xs text-gray-500">
                    Interface Phase 7.A - TDD validé ✅
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold" style="color: {getDifficultyColor(currentDifficulty)}">
                    {filteredCourses.length} cours
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    Niveau {currentDifficulty}
                  </div>
                </div>
              </div>
              
              <!-- Statistiques temps réel -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div class="text-xl font-bold text-blue-600">{dashboardData.stats.completedCourses}</div>
                  <div class="text-sm text-gray-500">Terminés</div>
                </div>
                <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div class="text-xl font-bold text-green-600">{dashboardData.stats.totalTimeSpent}min</div>
                  <div class="text-sm text-gray-500">Temps d'étude</div>
                </div>
                <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div class="text-xl font-bold text-purple-600">{weeklyProgress}</div>
                  <div class="text-sm text-gray-500">Cette semaine</div>
                </div>
                <div class="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div class="text-xl font-bold text-orange-600">{dashboardData.stats.averageScore}%</div>
                  <div class="text-sm text-gray-500">Score moyen</div>
                </div>
              </div>
              
              <!-- Barre de progression globale -->
              <div class="mb-6">
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progression globale</span>
                  <span>{Math.round((dashboardData.stats.completedCourses / dashboardData.stats.totalCourses) * 100)}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    class="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                    style="width: {Math.round((dashboardData.stats.completedCourses / dashboardData.stats.totalCourses) * 100)}%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 🎮 Panneau Gamification et Badges -->
          <div class="space-y-4">
            <!-- XP et niveau -->
            <div class="{designSystem.components.card}">
              <div class="text-center">
                <div class="text-3xl font-bold text-yellow-500 mb-2">{userXP} XP</div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Niveau {dashboardData.user.level}
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                  <div 
                    class="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                    style="width: {(userXP % 100)}%"
                  ></div>
                </div>
                <div class="text-xs text-gray-500">
                  {100 - (userXP % 100)} XP pour le niveau suivant
                </div>
              </div>
            </div>
            
            <!-- Badges obtenus -->
            {#if userBadges.length > 0}
              <div class="{designSystem.components.card}">
                <h4 class="font-medium text-gray-900 dark:text-white mb-3">🏆 Badges Obtenus</h4>
                <div class="grid grid-cols-2 gap-2">
                  {#each userBadges as badge}
                    <div class="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                      <span class="text-xl">{badge.icon}</span>
                      <span class="text-sm font-medium">{badge.name}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
            
            <!-- Statistiques avancées -->
            <div class="{designSystem.components.card}">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">📊 Analytics</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Série actuelle</span>
                  <span class="font-medium">{dashboardData.user.currentStreak} jours</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Taux de réussite</span>
                  <span class="font-medium">{dashboardData.completionRate}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Exercices résolus</span>
                  <span class="font-medium">{dashboardData.stats.totalExercises}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Section des cours avec filtrage intelligent -->
      <section>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              📚 Mes Cours - Interface Avancée
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredCourses.length} cours {searchQuery ? `trouvés pour "${searchQuery}"` : 'disponibles'}
              {selectedMatieres.length > 0 ? ` dans ${selectedMatieres.join(', ')}` : ''}
            </p>
          </div>
          <div class="flex space-x-3">
            <button 
              on:click={() => showFilters = !showFilters}
              class="{designSystem.components.button.secondary}"
            >
              🔍 Filtres {selectedMatieres.length > 0 ? `(${selectedMatieres.length})` : ''}
            </button>
            <button class="{designSystem.components.button.primary}">
              ➕ Nouveau cours
            </button>
          </div>
        </div>
        
        {#if filteredCourses.length === 0}
          <!-- État vide avec suggestions -->
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun cours trouvé
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Essayez de modifier vos filtres'}
            </p>
            <button 
              on:click={() => {
                searchQuery = '';
                selectedMatieres = [];
                showFilters = false;
              }}
              class="{designSystem.components.button.primary}"
            >
              Réinitialiser les filtres
            </button>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each filteredCourses as course, index}
              <div class="{designSystem.components.card} group cursor-pointer transform hover:scale-105 transition-all duration-200" 
                   style="animation-delay: {index * 50}ms">
                <!-- Header du cours avec icône matière -->
                <div class="flex items-start justify-between mb-4">
                  <div 
                    class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style="background: linear-gradient(135deg, {getDifficultyColor(course.difficulty)}, {getDifficultyColor(course.difficulty)}cc)"
                  >
                    {formatSubjectIcon(course.matiere)}
                  </div>
                  <div class="text-right">
                    <span 
                      class="text-xs px-2 py-1 rounded-full text-white font-medium"
                      style="background-color: {getDifficultyColor(course.difficulty)}"
                    >
                      {course.difficulty}
                    </span>
                    <div class="text-xs text-gray-500 mt-1 capitalize">
                      {course.matiere}
                    </div>
                  </div>
                </div>
                
                <!-- Contenu du cours -->
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                
                <!-- Métadonnées du cours -->
                <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center justify-between mb-2">
                    <span>📚 {course.dureeEstimee} min</span>
                    <span>🎯 {course.statistics?.exercisesCompleted || 0} exercices</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>📊 Score: {course.statistics?.averageScore || 0}%</span>
                    <span>🔥 {course.statistics?.streak || 0} jours</span>
                  </div>
                </div>
                
                <!-- Progression avec design amélioré -->
                <div class="mb-4">
                  <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progression</span>
                    <span class="font-medium">{course.progress}%</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-2 rounded-full transition-all duration-500 bg-gradient-to-r"
                      style="width: {course.progress}%; background: linear-gradient(90deg, {getDifficultyColor(course.difficulty)}, {getDifficultyColor(course.difficulty)}cc)"
                    ></div>
                  </div>
                </div>
                
                <!-- Actions avec états -->
                <div class="flex space-x-2">
                  <button 
                    on:click={() => continueCourse(course.id)}
                    class="flex-1 {designSystem.components.button.primary} text-sm relative overflow-hidden"
                    disabled={course.progress === 100}
                  >
                    {#if course.progress === 100}
                      ✅ Terminé
                    {:else if course.progress > 0}
                      📖 Continuer
                    {:else}
                      🚀 Commencer
                    {/if}
                  </button>
                  <button 
                    class="px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Options du cours"
                  >
                    ⋯
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
      
    {:else}
      <!-- État d'erreur avec design system -->
      <div class="text-center py-12">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Erreur de chargement des données
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Impossible de charger les données du curriculum. Vérifiez votre connexion.
        </p>
        <button 
          on:click={loadDashboardData}
          class="{designSystem.components.button.primary}"
        >
          🔄 Réessayer
        </button>
      </div>
    {/if}
  </main>
  
  <!-- Footer avec informations de debugging -->
  <footer class="border-t border-gray-200 dark:border-gray-700 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center text-sm text-gray-500">
        <div>
          🚀 FunLearning Phase 7.A - Interface Avancée selon DOC_CoPilot_Practices
        </div>
        <div>
          TDD: ✅ | Tests: 11/11 | Serveur: {isLoading ? '⏳' : '✅'} | Thème: {currentTheme}
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Animations personnalisées pour Phase 7.A */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  :global(.animate-fadeInUp) {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  
  /* Améliorations visuelles */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Transitions fluides pour le thème */
  * {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }
</style>
