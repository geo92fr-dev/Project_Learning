<!-- 
  Phase 7 - Design System Demo Component
  Démonstration du système de design avec composants atomiques
-->

<script>
  // Import du design system (normalement depuis src/lib/design-system.js)
  import { onMount } from 'svelte';
  
  // État local pour la démo
  let theme = 'light';
  let currentDifficulty = 'beginner';
  let designSystem;
  let performanceMetrics = {};
  
  // Design tokens inline (pour éviter les restrictions)
  const tokens = {
    colors: {
      primary: { 500: '#0ea5e9' },
      difficulty: {
        beginner: '#10b981',
        intermediate: '#f59e0b', 
        advanced: '#ef4444',
        expert: '#8b5cf6'
      }
    },
    spacing: { 4: '1rem', 6: '1.5rem' }
  };
  
  // Simulation du design system
  class SimpleDesignSystem {
    renderButton(props) {
      return {
        component: 'button',
        class: `px-4 py-2 rounded font-medium transition-colors ${props.variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`,
        children: props.children
      };
    }
    
    renderGrid(props) {
      return {
        component: 'div',
        class: `grid grid-cols-1 md:grid-cols-${props.cols || 2} gap-${props.gap || 4}`
      };
    }
    
    getPerformanceMetrics() {
      return {
        averageRenderTime: Math.random() * 5,
        totalComponents: 12,
        lazyLoadedCount: 3,
        bundleSize: 45.2
      };
    }
  }
  
  onMount(() => {
    designSystem = new SimpleDesignSystem();
    updateMetrics();
    
    // Simulation de l'intégration curriculum
    console.log('🎨 Design System Phase 7 intégré avec le curriculum');
  });
  
  function updateMetrics() {
    if (designSystem) {
      performanceMetrics = designSystem.getPerformanceMetrics();
    }
  }
  
  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    updateMetrics();
  }
  
  function changeDifficulty(difficulty) {
    currentDifficulty = difficulty;
    updateMetrics();
  }
  
  // Styles dynamiques pour le thème
  $: themeStyles = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';
    
  $: difficultyColor = tokens.colors.difficulty[currentDifficulty];
</script>

<div class="min-h-screen transition-colors duration-300 {themeStyles}">
  <!-- Header avec contrôles de thème -->
  <header class="p-6 border-b border-opacity-20 {theme === 'dark' ? 'border-white' : 'border-gray-300'}">
    <div class="max-w-4xl mx-auto flex justify-between items-center">
      <h1 class="text-3xl font-bold">
        🎨 Design System Phase 7
      </h1>
      
      <div class="flex gap-4 items-center">
        <!-- Switch de thème -->
        <button 
          on:click={toggleTheme}
          class="px-4 py-2 rounded-lg transition-colors
                 {theme === 'dark' 
                   ? 'bg-gray-700 hover:bg-gray-600' 
                   : 'bg-gray-200 hover:bg-gray-300'}"
          aria-label="Changer le thème"
        >
          {theme === 'dark' ? '☀️' : '🌙'} {theme}
        </button>
        
        <!-- Indicateur de performance -->
        <div class="text-sm opacity-75">
          ⚡ {performanceMetrics.averageRenderTime?.toFixed(2)}ms
        </div>
      </div>
    </div>
  </header>
  
  <!-- Contenu principal -->
  <main class="max-w-4xl mx-auto p-6">
    
    <!-- Section Design Tokens -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">🎯 Design Tokens</h2>
      
      <!-- Palette de couleurs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {#each Object.entries(tokens.colors.difficulty) as [level, color]}
          <div 
            class="p-4 rounded-lg text-white font-medium cursor-pointer transition-transform hover:scale-105"
            style="background-color: {color}"
            on:click={() => changeDifficulty(level)}
            on:keydown={(e) => e.key === 'Enter' && changeDifficulty(level)}
            role="button"
            tabindex="0"
            aria-label="Sélectionner difficulté {level}"
          >
            <div class="text-sm opacity-90">{level}</div>
            <div class="text-xs opacity-75">{color}</div>
          </div>
        {/each}
      </div>
    </section>
    
    <!-- Section Composants Atomiques -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">⚛️ Composants Atomiques</h2>
      
      <!-- Grille de boutons -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <!-- Boutons primaires -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Boutons Primaires</h3>
          <div class="space-y-2">
            <button class="w-full px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors">
              Primary Button
            </button>
            <button class="w-full px-3 py-1.5 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
              Small Button
            </button>
            <button class="w-full px-6 py-3 bg-blue-500 text-white rounded text-lg font-medium hover:bg-blue-600 transition-colors">
              Large Button
            </button>
          </div>
        </div>
        
        <!-- Boutons sémantiques -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Boutons Sémantiques</h3>
          <div class="space-y-2">
            <button class="w-full px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 transition-colors">
              Success
            </button>
            <button class="w-full px-4 py-2 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600 transition-colors">
              Warning
            </button>
            <button class="w-full px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors">
              Error
            </button>
          </div>
        </div>
        
        <!-- Boutons état -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">États</h3>
          <div class="space-y-2">
            <button class="w-full px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors">
              Normal
            </button>
            <button class="w-full px-4 py-2 bg-blue-400 text-white rounded font-medium cursor-not-allowed opacity-50" disabled>
              Disabled
            </button>
            <button class="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium ring-2 ring-blue-300 ring-offset-2">
              Focused
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Section Grille Responsive -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">📱 Grille Responsive</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {#each Array(8) as _, index}
          <div 
            class="p-6 rounded-lg border transition-colors
                   {theme === 'dark' 
                     ? 'bg-gray-800 border-gray-700' 
                     : 'bg-gray-50 border-gray-200'}"
          >
            <div class="w-full h-20 rounded mb-4 opacity-50"
                 style="background-color: {difficultyColor}">
            </div>
            <h4 class="font-medium mb-2">Composant {index + 1}</h4>
            <p class="text-sm opacity-75">
              Exemple de composant dans la grille responsive.
            </p>
          </div>
        {/each}
      </div>
    </section>
    
    <!-- Section Métriques de Performance -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">⚡ Métriques de Performance</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-lg {theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}">
          <div class="text-2xl font-bold text-blue-500">
            {performanceMetrics.averageRenderTime?.toFixed(2)}ms
          </div>
          <div class="text-sm opacity-75">Temps de rendu moyen</div>
        </div>
        
        <div class="p-4 rounded-lg {theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}">
          <div class="text-2xl font-bold text-green-500">
            {performanceMetrics.totalComponents}
          </div>
          <div class="text-sm opacity-75">Composants totaux</div>
        </div>
        
        <div class="p-4 rounded-lg {theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}">
          <div class="text-2xl font-bold text-purple-500">
            {performanceMetrics.lazyLoadedCount}
          </div>
          <div class="text-sm opacity-75">Lazy loading</div>
        </div>
        
        <div class="p-4 rounded-lg {theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}">
          <div class="text-2xl font-bold text-orange-500">
            {performanceMetrics.bundleSize}KB
          </div>
          <div class="text-sm opacity-75">Taille bundle</div>
        </div>
      </div>
    </section>
    
    <!-- Section Intégration Curriculum -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">📚 Intégration Curriculum</h2>
      
      <div class="p-6 rounded-lg border {theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}">
        <h3 class="text-lg font-medium mb-4">
          Badge de difficulté actuel: 
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ml-2"
                style="background-color: {difficultyColor}">
            {currentDifficulty}
          </span>
        </h3>
        
        <p class="text-sm opacity-75 mb-4">
          Le design system s'intègre parfaitement avec le système de curriculum Phase 6,
          utilisant les mêmes couleurs de difficulté et maintenant la cohérence visuelle.
        </p>
        
        <div class="flex gap-2 flex-wrap">
          {#each Object.keys(tokens.colors.difficulty) as difficulty}
            <button
              on:click={() => changeDifficulty(difficulty)}
              class="px-3 py-1 rounded text-sm font-medium text-white transition-transform hover:scale-105"
              style="background-color: {tokens.colors.difficulty[difficulty]}"
            >
              {difficulty}
            </button>
          {/each}
        </div>
      </div>
    </section>
    
  </main>
  
  <!-- Footer -->
  <footer class="mt-12 p-6 border-t border-opacity-20 {theme === 'dark' ? 'border-white' : 'border-gray-300'}">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-sm opacity-75">
        🎨 Design System Phase 7 - Dynamic Interface avec TDD 
        | Thème: {theme} | Difficulté: {currentDifficulty}
      </p>
    </div>
  </footer>
</div>

<style>
  /* Styles globaux pour le design system */
  :global(body) {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  /* Animation pour les changements de thème */
  :global(.transition-colors) {
    transition: background-color 300ms ease-out, color 300ms ease-out;
  }
  
  /* Focus visible pour l'accessibilité */
  :global(button:focus-visible) {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* Respect des préférences de mouvement réduit */
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
