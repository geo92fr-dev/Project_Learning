<!-- Page de test pour Phase 7.B Navigation System -->

<script>
  import NavigationSystem from '../lib/NavigationSystem.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let currentRoute = '/navigation-test';
  let userProgress = {
    level: 'advanced',
    completedCourses: ['js-basics', 'react-intro', 'svelte-intro']
  };

  let expandedSections = ['courses'];
  let transitionEnabled = true;
  let keyboardNavigationEnabled = true;
  let enhancedNavigation = true;

  const breadcrumbs = [
    { label: 'Accueil', path: '/' },
    { label: 'Tests', path: '/tests' },
    { label: 'Navigation System', path: '/navigation-test' }
  ];

  // Simuler quelques événements de navigation pour la démonstration
  function handleNavigationStart(event) {
    console.log('Navigation started:', event.detail);
  }

  function handleNavigationComplete(event) {
    console.log('Navigation completed:', event.detail);
  }

  function handleNavigationError(event) {
    console.error('Navigation error:', event.detail);
  }

  // Simuler un changement de niveau utilisateur
  function toggleUserLevel() {
    if (userProgress.level === 'beginner') {
      userProgress = {
        level: 'advanced',
        completedCourses: ['js-basics', 'react-intro', 'svelte-intro']
      };
    } else {
      userProgress = {
        level: 'beginner',
        completedCourses: []
      };
    }
  }

  function toggleTransitions() {
    transitionEnabled = !transitionEnabled;
  }

  function toggleKeyboardNav() {
    keyboardNavigationEnabled = !keyboardNavigationEnabled;
  }

  onMount(() => {
    console.log('Navigation Test Page loaded');
  });
</script>

<svelte:head>
  <title>Phase 7.B - Navigation System Test</title>
</svelte:head>

<div class="navigation-test-page">
  <!-- Sidebar avec NavigationSystem -->
  <aside class="sidebar">
    <NavigationSystem
      {currentRoute}
      {userProgress}
      {breadcrumbs}
      {transitionEnabled}
      persistentState={true}
      {expandedSections}
      {keyboardNavigationEnabled}
      progressiveEnhancement={true}
      fallbackNavigation={false}
      {enhancedNavigation}
      on:navigationStart={handleNavigationStart}
      on:navigationComplete={handleNavigationComplete}
      on:navigationError={handleNavigationError}
    />
  </aside>

  <!-- Contenu principal -->
  <main class="main-content">
    <header class="content-header">
      <h1>🧪 Phase 7.B - Navigation System Test</h1>
      <p class="subtitle">Test interactif du système de navigation adaptatif</p>
    </header>

    <section class="demo-controls">
      <h2>Contrôles de Démonstration</h2>
      
      <div class="control-group">
        <h3>Configuration Utilisateur</h3>
        <button on:click={toggleUserLevel} class="demo-button">
          Basculer Niveau: <strong>{userProgress.level}</strong>
        </button>
        <p class="control-description">
          Cours complétés: {userProgress.completedCourses.length}
        </p>
      </div>

      <div class="control-group">
        <h3>Options de Navigation</h3>
        
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            bind:checked={transitionEnabled}
          />
          Transitions activées
        </label>

        <label class="checkbox-label">
          <input 
            type="checkbox" 
            bind:checked={keyboardNavigationEnabled}
          />
          Navigation clavier
        </label>

        <label class="checkbox-label">
          <input 
            type="checkbox" 
            bind:checked={enhancedNavigation}
          />
          Navigation améliorée (SPA)
        </label>
      </div>
    </section>

    <section class="features-demo">
      <h2>✨ Fonctionnalités Phase 7.B</h2>
      
      <div class="feature-grid">
        <div class="feature-card">
          <h3>🎯 Routage Adaptatif</h3>
          <ul>
            <li>Navigation basée sur le niveau utilisateur</li>
            <li>Menu contextuel selon la progression</li>
            <li>Liens avancés pour utilisateurs expérimentés</li>
          </ul>
        </div>

        <div class="feature-card">
          <h3>🎨 Expérience Utilisateur</h3>
          <ul>
            <li>Transitions fluides entre les routes</li>
            <li>État de navigation persistant</li>
            <li>Support complet du clavier</li>
            <li>Indicateurs de progression</li>
          </ul>
        </div>

        <div class="feature-card">
          <h3>♿ Progressive Enhancement</h3>
          <ul>
            <li>Fonctionne sans JavaScript</li>
            <li>Amélioration progressive</li>
            <li>Accessibilité WCAG</li>
            <li>Navigation responsive</li>
          </ul>
        </div>

        <div class="feature-card">
          <h3>🧭 Navigation Avancée</h3>
          <ul>
            <li>Fil d'Ariane dynamique</li>
            <li>Raccourcis clavier</li>
            <li>Focus management</li>
            <li>Thème adaptatif</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="test-info">
      <h2>📊 Informations de Test</h2>
      
      <div class="info-grid">
        <div class="info-item">
          <strong>Tests TDD:</strong> 8/8 passent ✅
        </div>
        <div class="info-item">
          <strong>Couverture:</strong> Navigation adaptative complète
        </div>
        <div class="info-item">
          <strong>Performance:</strong> Transitions optimisées
        </div>
        <div class="info-item">
          <strong>Accessibilité:</strong> ARIA labels, focus management
        </div>
      </div>

      <div class="technical-details">
        <h3>Détails Techniques</h3>
        <pre><code>{JSON.stringify({
          currentRoute,
          userLevel: userProgress.level,
          completedCourses: userProgress.completedCourses.length,
          transitionEnabled,
          keyboardNavigationEnabled,
          enhancedNavigation
        }, null, 2)}</code></pre>
      </div>
    </section>
  </main>
</div>

<style>
  .navigation-test-page {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  .sidebar {
    width: 280px;
    flex-shrink: 0;
    background: white;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    border-radius: 0 15px 15px 0;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .content-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .content-header h1 {
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #6c757d;
    margin: 0;
  }

  .demo-controls {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
  }

  .demo-controls h2 {
    margin: 0 0 2rem 0;
    color: #333;
  }

  .control-group {
    margin-bottom: 2rem;
  }

  .control-group h3 {
    margin: 0 0 1rem 0;
    color: #555;
    font-size: 1.1rem;
  }

  .demo-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s ease;
    margin-bottom: 1rem;
  }

  .demo-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    cursor: pointer;
    font-size: 0.95rem;
  }

  .checkbox-label input {
    margin-right: 0.5rem;
  }

  .control-description {
    font-size: 0.9rem;
    color: #6c757d;
    margin: 0.5rem 0;
  }

  .features-demo {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
  }

  .features-demo h2 {
    margin: 0 0 2rem 0;
    color: #333;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .feature-card {
    background: linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%);
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 4px solid #667eea;
  }

  .feature-card h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
  }

  .feature-card ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  .feature-card li {
    margin: 0.5rem 0;
    color: #555;
    font-size: 0.9rem;
  }

  .test-info {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .test-info h2 {
    margin: 0 0 2rem 0;
    color: #333;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .info-item {
    background: linear-gradient(135deg, #e8f5e8 0%, #f0fdf0 100%);
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #22c55e;
    font-size: 0.9rem;
  }

  .technical-details {
    margin-top: 2rem;
  }

  .technical-details h3 {
    margin: 0 0 1rem 0;
    color: #555;
  }

  .technical-details pre {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.85rem;
  }

  .technical-details code {
    color: #495057;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .navigation-test-page {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      order: 2;
    }

    .main-content {
      order: 1;
      padding: 1rem;
    }

    .content-header h1 {
      font-size: 2rem;
    }

    .feature-grid {
      grid-template-columns: 1fr;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .demo-controls,
  .features-demo,
  .test-info {
    animation: fadeIn 0.6s ease-out;
  }

  .feature-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
</style>
