<!--
  🔍 NavigationSearch Component - Phase 8.A Navigation System
  Recherche intelligente dans la navigation avec intégration curriculum service
-->
<script>
  export let placeholder = 'Rechercher...';
  export let maxResults = 10;
  export let showShortcuts = true;

  import { createEventDispatcher, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade, slide } from 'svelte/transition';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  
  // 🔗 Intégration curriculum service - Phase 8
  import { curriculumService } from '../../services/curriculumService';

  const dispatch = createEventDispatcher();

  // États de la recherche
  let searchQuery = '';
  let isOpen = false;
  let searchResults = [];
  let selectedIndex = -1;
  let searchInput;
  let curriculumData = { competences: [], courses: [] };

  // Charger les données du curriculum
  async function loadCurriculumData() {
    try {
      const [competences, courses] = await Promise.all([
        curriculumService.getAllCompetences(),
        curriculumService.getAllCourses()
      ]);
      
      curriculumData = { competences, courses };
      console.log('📚 Curriculum data loaded for search:', {
        competences: competences.length,
        courses: courses.length
      });
    } catch (error) {
      console.error('❌ Error loading curriculum data:', error);
    }
  }

  onMount(() => {
    loadCurriculumData();
  });

  // Base de données de recherche
  const searchData = [
    // Pages principales
    { type: 'page', title: 'Accueil', path: '/', description: 'Page d\'accueil', icon: '🏠' },
    { type: 'page', title: 'Profil', path: '/profil', description: 'Mon profil utilisateur', icon: '👤' },
    { type: 'page', title: 'Paramètres', path: '/parametres', description: 'Configuration de l\'app', icon: '⚙️' },
    
    // Cours
    { type: 'course', title: 'Mathématiques', path: '/cours/mathematiques', description: 'Cours de mathématiques', icon: '🔢' },
    { type: 'course', title: 'Français', path: '/cours/francais', description: 'Cours de français', icon: '📝' },
    { type: 'course', title: 'Sciences', path: '/cours/sciences', description: 'Cours de sciences', icon: '🔬' },
    { type: 'course', title: 'Histoire', path: '/cours/histoire', description: 'Cours d\'histoire', icon: '📚' },
    
    // Niveaux
    { type: 'level', title: 'CP', path: '/cours/mathematiques/cp', description: 'Mathématiques CP', icon: '1️⃣' },
    { type: 'level', title: 'CE1', path: '/cours/mathematiques/ce1', description: 'Mathématiques CE1', icon: '2️⃣' },
    { type: 'level', title: 'CE2', path: '/cours/mathematiques/ce2', description: 'Mathématiques CE2', icon: '3️⃣' },
    
    // Exercices
    { type: 'exercise', title: 'Additions simples', path: '/exercices/additions', description: 'Exercices d\'addition', icon: '➕' },
    { type: 'exercise', title: 'Tables de multiplication', path: '/exercices/multiplication', description: 'Apprendre les tables', icon: '✖️' },
    { type: 'exercise', title: 'Lecture compréhension', path: '/exercices/lecture', description: 'Exercices de lecture', icon: '📖' },
    
    // Fonctionnalités
    { type: 'feature', title: 'Mes progrès', path: '/progres', description: 'Suivi des performances', icon: '📊' },
    { type: 'feature', title: 'Mes badges', path: '/badges', description: 'Récompenses obtenues', icon: '🏆' },
    { type: 'feature', title: 'Planning', path: '/planning', description: 'Organisation des cours', icon: '📅' }
  ];

  // Raccourcis clavier populaires
  const shortcuts = [
    { label: 'Accueil', key: 'Alt+H', path: '/' },
    { label: 'Cours', key: 'Alt+C', path: '/cours' },
    { label: 'Exercices', key: 'Alt+E', path: '/exercices' },
    { label: 'Progrès', key: 'Alt+P', path: '/progres' }
  ];

  // Types de résultats avec styles
  const resultTypes = {
    page: { label: 'Page', color: 'blue' },
    course: { label: 'Cours', color: 'green' },
    level: { label: 'Niveau', color: 'yellow' },
    exercise: { label: 'Exercice', color: 'purple' },
    feature: { label: 'Fonction', color: 'gray' }
  };

  // Fonction de recherche intelligente avec curriculum
  function performSearch(query) {
    if (!query || !query.trim()) {
      searchResults = [];
      return;
    }

    const queryLower = query.toLowerCase().trim();
    let results = [];

    // 1. Recherche dans les pages statiques
    const staticResults = searchData.filter(item => 
      item.title.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower)
    ).map(item => ({
      ...item,
      score: calculateRelevanceScore(item, queryLower)
    }));

    results.push(...staticResults);

    // 2. Recherche dans le curriculum (compétences)
    const competenceResults = curriculumData.competences
      .filter(comp => 
        comp.name.toLowerCase().includes(queryLower) ||
        comp.description.toLowerCase().includes(queryLower) ||
        comp.matiereDisplay.toLowerCase().includes(queryLower)
      )
      .map(comp => ({
        type: 'competence',
        title: comp.name,
        path: `/curriculum/competence/${comp.id}`,
        description: `${comp.matiereDisplay} - ${comp.niveau} (${comp.difficulty})`,
        icon: getMatiereIcon(comp.matiere),
        score: calculateRelevanceScore(comp, queryLower)
      }));

    results.push(...competenceResults);

    // 3. Recherche dans les cours du curriculum
    const courseResults = curriculumData.courses
      .filter(course => 
        course.title.toLowerCase().includes(queryLower) ||
        course.description.toLowerCase().includes(queryLower)
      )
      .map(course => ({
        type: 'curriculum_course',
        title: course.title,
        path: `/curriculum/course/${course.id}`,
        description: `${course.matiere} - ${course.niveau} (${course.duration}min)`,
        icon: getMatiereIcon(course.matiere),
        score: calculateRelevanceScore(course, queryLower)
      }));

    results.push(...courseResults);

    // Trier par pertinence et limiter les résultats
    searchResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  // Calcul du score de pertinence
  function calculateRelevanceScore(item, query) {
    let score = 0;
    const title = (item.title || item.name || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    
    // Score basé sur la correspondance exacte du titre
    if (title.includes(query)) {
      score += title.startsWith(query) ? 100 : 50;
    }
    
    // Score basé sur la description
    if (description.includes(query)) {
      score += 25;
    }
    
    // Bonus pour les types prioritaires
    if (item.type === 'competence' || item.type === 'curriculum_course') {
      score += 10;
    }
    
    return score;
  }

  // Icônes des matières
  function getMatiereIcon(matiere) {
    const icons = {
      mathematiques: '🔢',
      francais: '📚',
      sciences: '🔬',
      histoire: '🏛️'
    };
    return icons[matiere] || '📖';
  }

  // Fonction de recherche intelligente (legacy)
  function performSearchLegacy(query) {
    if (!query || !query.trim()) {
      searchResults = [];
      return;
    }

    const queryLower = query.toLowerCase();
    const words = queryLower.split(' ').filter(w => w.length > 0);
    
    const scored = searchData.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      
      // Score exact match du titre
      if (titleLower === queryLower) score += 100;
      
      // Score début du titre
      if (titleLower.startsWith(queryLower)) score += 50;
      
      // Score inclusion dans le titre
      if (titleLower.includes(queryLower)) score += 30;
      
      // Score pour chaque mot trouvé
      words.forEach(word => {
        if (titleLower.includes(word)) score += 20;
        if (descLower.includes(word)) score += 10;
      });
      
      // Bonus selon le type
      if (item.type === 'page') score += 5;
      if (item.type === 'course') score += 3;
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

    searchResults = scored;
    selectedIndex = -1; // Reset selection
  }

  // Réactivité pour la recherche
  $: performSearch(searchQuery);

  // Gestion des événements
  function handleFocus() {
    isOpen = true;
    dispatch('focus');
  }

  function handleBlur(event) {
    // Délai pour permettre les clics sur les résultats
    setTimeout(() => {
      if (!event.currentTarget.contains(document.activeElement)) {
        isOpen = false;
        dispatch('blur');
      }
    }, 150);
  }

  function handleKeydown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          selectResult(searchResults[selectedIndex]);
        } else if (searchResults.length > 0) {
          selectResult(searchResults[0]);
        }
        break;
      
      case 'Escape':
        isOpen = false;
        searchInput?.blur();
        break;
    }
  }

  function selectResult(result) {
    goto(result.path);
    searchQuery = '';
    isOpen = false;
    dispatch('select', result);
  }

  function handleShortcut(shortcut) {
    goto(shortcut.path);
    dispatch('shortcut', shortcut);
  }

  // Gestion des raccourcis clavier globaux
  function handleGlobalKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      searchInput?.focus();
    }
    
    // Raccourcis Alt+Key
    if (event.altKey) {
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase().endsWith(event.key.toLowerCase())
      );
      if (shortcut) {
        event.preventDefault();
        handleShortcut(shortcut);
      }
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleGlobalKeydown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeydown);
    };
  });
</script>

<div class="navigation-search" role="search" aria-label="Recherche de navigation">
  <!-- Input de recherche -->
  <div class="search-input-container">
    <Input
      bind:value={searchQuery}
      bind:inputElement={searchInput}
      {placeholder}
      icon="🔍"
      class="search-input"
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeydown}
    />
    
    {#if showShortcuts}
      <div class="search-shortcut">
        <Badge variant="secondary" size="sm">Ctrl+K</Badge>
      </div>
    {/if}
  </div>

  <!-- Résultats de recherche -->
  {#if isOpen && (searchResults.length > 0 || searchQuery.trim())}
    <div 
      class="search-results" 
      transition:slide={{ duration: 200 }}
    >
      {#if searchResults.length > 0}
        <div class="results-header">
          <span class="results-count">{searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}</span>
        </div>
        
        <ul class="results-list">
          {#each searchResults as result, index}
            <li class="result-item">
              <Button
                variant="ghost"
                size="sm"
                class="result-button {selectedIndex === index ? 'selected' : ''}"
                on:click={() => selectResult(result)}
                fullWidth
              >
                <div class="result-content">
                  <div class="result-icon">{result.icon}</div>
                  <div class="result-text">
                    <div class="result-title">{result.title}</div>
                    <div class="result-description">{result.description}</div>
                  </div>
                  <div class="result-type">
                    <Badge 
                      variant={resultTypes[result.type].color} 
                      size="xs"
                    >
                      {resultTypes[result.type].label}
                    </Badge>
                  </div>
                </div>
              </Button>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <div class="no-results-text">
            Aucun résultat pour "<strong>{searchQuery}</strong>"
          </div>
        </div>
      {/if}
      
      {#if showShortcuts}
        <div class="shortcuts-section">
          <div class="shortcuts-header">Raccourcis rapides</div>
          <div class="shortcuts-list">
            {#each shortcuts as shortcut}
              <Button
                variant="ghost"
                size="xs"
                class="shortcut-button"
                on:click={() => handleShortcut(shortcut)}
              >
                <span class="shortcut-label">{shortcut.label}</span>
                <Badge variant="secondary" size="xs">{shortcut.key}</Badge>
              </Button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* ===== CONTAINER PRINCIPAL ===== */
  .navigation-search {
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .navigation-search :global(.search-input) {
    flex: 1;
    padding-right: 4rem; /* Espace pour le shortcut */
  }

  .search-shortcut {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  /* ===== RÉSULTATS ===== */
  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-top: none;
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    z-index: 50;
    max-height: 400px;
    overflow-y: auto;
  }

  .results-header {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    background: #f9fafb;
  }

  .results-count {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }

  /* ===== LISTE DES RÉSULTATS ===== */
  .results-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .result-item {
    margin: 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .result-item:last-child {
    border-bottom: none;
  }

  .navigation-search :global(.result-button) {
    padding: 0.75rem;
    text-align: left;
    border-radius: 0;
    border: none;
  }

  .navigation-search :global(.result-button:hover),
  .navigation-search :global(.result-button.selected) {
    background-color: #f3f4f6;
  }

  .result-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .result-icon {
    font-size: 1.25rem;
    width: 1.5rem;
    text-align: center;
    flex-shrink: 0;
  }

  .result-text {
    flex: 1;
    min-width: 0;
  }

  .result-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.125rem;
  }

  .result-description {
    font-size: 0.75rem;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .result-type {
    flex-shrink: 0;
  }

  /* ===== AUCUN RÉSULTAT ===== */
  .no-results {
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .no-results-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  .no-results-text {
    font-size: 0.875rem;
  }

  /* ===== RACCOURCIS ===== */
  .shortcuts-section {
    border-top: 1px solid #e5e7eb;
    padding: 0.75rem;
    background: #f9fafb;
  }

  .shortcuts-header {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .shortcuts-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .navigation-search :global(.shortcut-button) {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .shortcut-label {
    font-size: 0.75rem;
  }

  /* ===== MODE SOMBRE ===== */
  :global(.dark) .search-results {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark) .results-header {
    background: #111827;
    border-bottom-color: #374151;
  }

  :global(.dark) .results-count {
    color: #9ca3af;
  }

  :global(.dark) .result-item {
    border-bottom-color: #374151;
  }

  :global(.dark) .navigation-search :global(.result-button:hover),
  :global(.dark) .navigation-search :global(.result-button.selected) {
    background-color: #374151;
  }

  :global(.dark) .result-title {
    color: #f9fafb;
  }

  :global(.dark) .result-description {
    color: #9ca3af;
  }

  :global(.dark) .no-results {
    color: #9ca3af;
  }

  :global(.dark) .shortcuts-section {
    background: #111827;
    border-top-color: #374151;
  }

  :global(.dark) .shortcuts-header {
    color: #d1d5db;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 640px) {
    .navigation-search {
      max-width: 100%;
    }
    
    .search-results {
      max-height: 300px;
    }
    
    .shortcuts-list {
      flex-direction: column;
    }
    
    .navigation-search :global(.shortcut-button) {
      justify-content: space-between;
    }
  }

  /* ===== SCROLLBAR ===== */
  .search-results::-webkit-scrollbar {
    width: 6px;
  }

  .search-results::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  .search-results::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .search-results::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
