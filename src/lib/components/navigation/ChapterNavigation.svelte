<!--
  🗂️ ChapterNavigation Component - Phase 8.A Navigation System
  Navigation contextuelle par chapitres selon DOC_CoPilot_Practices
-->
<script>
  export let course = '';
  export let level = '';
  export let currentChapter = '';
  export let isFirst = false;
  export let isLast = false;
  export let chapterIndex = 1;
  export let totalChapters = 1;

  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';

  // Structure des chapitres par cours/niveau
  const chapterStructure = {
    mathematiques: {
      cp: ['nombres-1-10', 'formes-geometriques', 'mesures-simples'],
      ce1: ['nombres-100', 'addition-soustraction', 'geometrie-plans'],
      ce2: ['nombres-1000', 'multiplication', 'mesures-longueur'],
      cm1: ['nombres-grands', 'division', 'geometrie', 'fractions'],
      cm2: ['decimaux', 'proportionnalite', 'volumes', 'problemes']
    },
    francais: {
      cp: ['lecture-syllabes', 'ecriture-lettres', 'sons-simples'],
      ce1: ['lecture-fluide', 'orthographe-base', 'grammaire-simple'],
      ce2: ['comprehension', 'conjugaison-present', 'vocabulaire'],
      cm1: ['textes-longs', 'temps-verbes', 'expression-ecrite'],
      cm2: ['analyse-texte', 'conjugaisons-complexes', 'redaction']
    },
    sciences: {
      cp: ['vivant-non-vivant', 'saisons', 'corps-humain-simple'],
      ce1: ['animaux-plantes', 'matiere-eau', 'hygiene'],
      ce2: ['cycle-vie', 'etats-matiere', 'alimentation'],
      cm1: ['reproduction', 'electricite', 'environnement'],
      cm2: ['systemes-corps', 'energie', 'developpement-durable']
    }
  };

  // Labels des chapitres
  const chapterLabels = {
    'nombres-1-10': 'Les nombres de 1 à 10',
    'formes-geometriques': 'Formes géométriques simples',
    'mesures-simples': 'Mesures et comparaisons',
    'nombres-100': 'Les nombres jusqu\'à 100',
    'addition-soustraction': 'Addition et soustraction',
    'geometrie-plans': 'Géométrie dans le plan',
    'nombres-1000': 'Les nombres jusqu\'à 1000',
    'multiplication': 'La multiplication',
    'mesures-longueur': 'Mesures de longueur',
    'nombres-grands': 'Les grands nombres',
    'division': 'La division',
    'geometrie': 'Géométrie',
    'fractions': 'Les fractions',
    'decimaux': 'Nombres décimaux',
    'proportionnalite': 'Proportionnalité',
    'volumes': 'Volumes et capacités',
    'problemes': 'Résolution de problèmes',
    // Français
    'lecture-syllabes': 'Lecture de syllabes',
    'ecriture-lettres': 'Écriture des lettres',
    'sons-simples': 'Sons simples',
    'lecture-fluide': 'Lecture fluide',
    'orthographe-base': 'Orthographe de base',
    'grammaire-simple': 'Grammaire simple',
    'comprehension': 'Compréhension de texte',
    'conjugaison-present': 'Conjugaison au présent',
    'vocabulaire': 'Enrichissement vocabulaire',
    'textes-longs': 'Textes longs',
    'temps-verbes': 'Temps des verbes',
    'expression-ecrite': 'Expression écrite',
    'analyse-texte': 'Analyse de texte',
    'conjugaisons-complexes': 'Conjugaisons complexes',
    'redaction': 'Rédaction',
    // Sciences
    'vivant-non-vivant': 'Vivant et non-vivant',
    'saisons': 'Les saisons',
    'corps-humain-simple': 'Le corps humain',
    'animaux-plantes': 'Animaux et plantes',
    'matiere-eau': 'La matière : l\'eau',
    'hygiene': 'Hygiène et santé',
    'cycle-vie': 'Cycle de la vie',
    'etats-matiere': 'États de la matière',
    'alimentation': 'Alimentation équilibrée',
    'reproduction': 'Reproduction des êtres vivants',
    'electricite': 'Électricité',
    'environnement': 'Protection environnement',
    'systemes-corps': 'Systèmes du corps humain',
    'energie': 'Sources d\'énergie',
    'developpement-durable': 'Développement durable'
  };

  // Calcul des chapitres précédent et suivant
  $: chapters = chapterStructure[course]?.[level] || [];
  $: currentIndex = chapters.indexOf(currentChapter);
  $: previousChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  $: nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  $: actualIsFirst = currentIndex === 0 || isFirst;
  $: actualIsLast = currentIndex === chapters.length - 1 || isLast;
  // Utilise chapterIndex en fallback si currentIndex n'est pas valide
  $: actualChapterIndex = chapters.length > 0 ? currentIndex + 1 : chapterIndex;
  // Utilise totalChapters en fallback si chapters n'est pas disponible
  $: actualTotalChapters = chapters.length > 0 ? chapters.length : totalChapters;

  function navigateToChapter(chapter) {
    if (chapter && course && level) {
      const path = `/cours/${course}/${level}/${chapter}`;
      goto(path);
    }
  }

  function goToPrevious() {
    if (previousChapter) {
      navigateToChapter(previousChapter);
    }
  }

  function goToNext() {
    if (nextChapter) {
      navigateToChapter(nextChapter);
    }
  }

  // Progression du chapitre (pourrait venir d'un store)
  $: chapterProgress = Math.floor(Math.random() * 100); // Simulé pour la démo
</script>

<nav class="chapter-navigation" aria-label="Navigation par chapitres">
  <div class="chapter-nav-container">
    
    <!-- Informations du chapitre actuel -->
    <div class="chapter-info">
      <div class="chapter-title">
        <h2 class="chapter-name">
          {chapterLabels[currentChapter] || currentChapter}
        </h2>
        <div class="chapter-meta">
          <Badge variant="primary" size="sm">
            Chapitre {actualChapterIndex} sur {actualTotalChapters}
          </Badge>
          {#if chapterProgress > 0}
            <Badge variant="success" size="sm" icon="📊">
              {chapterProgress}% complété
            </Badge>
          {/if}
        </div>
      </div>
      
      <!-- Barre de progression -->
      {#if chapterProgress > 0}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {chapterProgress}%"></div>
        </div>
      {/if}
    </div>

    <!-- Navigation précédent/suivant -->
    <div class="chapter-controls">
      <Button
        variant="outline"
        size="md"
        disabled={actualIsFirst || !previousChapter}
        on:click={goToPrevious}
        class="chapter-nav-button"
      >
        <span class="nav-icon">←</span>
        <span class="nav-text">
          <span class="nav-label">Chapitre précédent</span>
          {#if previousChapter}
            <span class="nav-chapter-name">
              {(chapterLabels[previousChapter] || previousChapter).substring(0, 30)}...
            </span>
          {/if}
        </span>
      </Button>

      <Button
        variant="outline"
        size="md"
        disabled={actualIsLast || !nextChapter}
        on:click={goToNext}
        class="chapter-nav-button"
      >
        <span class="nav-text">
          <span class="nav-label">Chapitre suivant</span>
          {#if nextChapter}
            <span class="nav-chapter-name">
              {(chapterLabels[nextChapter] || nextChapter).substring(0, 30)}...
            </span>
          {/if}
        </span>
        <span class="nav-icon">→</span>
      </Button>
    </div>

    <!-- Liste des chapitres (optionnelle) -->
    <details class="chapter-list-toggle">
      <summary class="chapter-list-summary">
        <Button variant="ghost" size="sm">
          📋 Tous les chapitres
          <span class="toggle-icon">▼</span>
        </Button>
      </summary>
      
      <div class="chapter-list">
        {#each chapters as chapter, index}
          <button
            class="chapter-item {chapter === currentChapter ? 'active' : ''}"
            on:click={() => navigateToChapter(chapter)}
          >
            <span class="chapter-number">{index + 1}</span>
            <span class="chapter-label">
              {chapterLabels[chapter] || chapter}
            </span>
            {#if chapter === currentChapter}
              <Badge variant="primary" size="sm">Actuel</Badge>
            {/if}
          </button>
        {/each}
      </div>
    </details>
  </div>
</nav>

<style>
  /* ===== CONTAINER ===== */
  .chapter-navigation {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin: 1rem 0;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  .chapter-nav-container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* ===== INFORMATIONS CHAPITRE ===== */
  .chapter-info {
    text-align: center;
  }

  .chapter-title {
    margin-bottom: 1rem;
  }

  .chapter-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .chapter-meta {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  /* ===== BARRE DE PROGRESSION ===== */
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 1rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  /* ===== CONTRÔLES NAVIGATION ===== */
  .chapter-controls {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .chapter-controls :global(.chapter-nav-button) {
    flex: 1;
    max-width: 300px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    text-align: left;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .chapter-controls :global(.chapter-nav-button:hover:not(:disabled)) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  .nav-icon {
    font-size: 1.125rem;
    font-weight: bold;
  }

  .nav-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .nav-label {
    font-weight: 500;
    color: #374151;
  }

  .nav-chapter-name {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: normal;
  }

  /* ===== LISTE DES CHAPITRES ===== */
  .chapter-list-toggle {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }

  .chapter-list-summary {
    list-style: none;
    cursor: pointer;
    text-align: center;
  }

  .chapter-list-summary::-webkit-details-marker {
    display: none;
  }

  .toggle-icon {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
  }

  .chapter-list-toggle[open] .toggle-icon {
    transform: rotate(180deg);
  }

  .chapter-list {
    margin-top: 1rem;
    display: grid;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .chapter-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .chapter-item:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
  }

  .chapter-item.active {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }

  .chapter-number {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    border-radius: 50%;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .chapter-item.active .chapter-number {
    background-color: #3b82f6;
    color: white;
  }

  .chapter-label {
    flex: 1;
    font-size: 0.875rem;
  }

  /* ===== MODE SOMBRE ===== */
  :global(.dark) .chapter-navigation {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark) .chapter-name {
    color: #f3f4f6;
  }

  :global(.dark) .nav-label {
    color: #d1d5db;
  }

  :global(.dark) .nav-chapter-name {
    color: #9ca3af;
  }

  :global(.dark) .progress-bar {
    background-color: #374151;
  }

  :global(.dark) .chapter-list-toggle {
    border-top-color: #374151;
  }

  :global(.dark) .chapter-item {
    background: #1f2937;
    border-color: #374151;
  }

  :global(.dark) .chapter-item:hover {
    background-color: #374151;
    border-color: #4b5563;
  }

  :global(.dark) .chapter-item.active {
    border-color: #60a5fa;
    background-color: #1e40af;
  }

  :global(.dark) .chapter-number {
    background-color: #374151;
    color: #d1d5db;
  }

  :global(.dark) .chapter-item.active .chapter-number {
    background-color: #60a5fa;
    color: #1f2937;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .chapter-controls {
      flex-direction: column;
      gap: 0.75rem;
    }

    .chapter-controls :global(.chapter-nav-button) {
      max-width: none;
    }

    .chapter-name {
      font-size: 1.25rem;
    }

    .chapter-meta {
      gap: 0.25rem;
    }
  }
</style>
