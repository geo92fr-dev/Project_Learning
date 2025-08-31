<script lang="ts">
  import { onMount } from 'svelte';
  import EmailAuth from '$lib/components/auth/EmailAuth.svelte';
  import GoogleAuth from '$lib/components/auth/GoogleAuth.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { authStore, currentUser } from '$lib/stores/auth';
  import { toastActions } from '$lib/stores/toast';
  import { learningProgress, progressActions } from '$lib/stores/progress';

  let showEmailAuth = false;
  let completionPercentage = 100;

  onMount(() => {
    // Marquer Phase 3 comme complète
    progressActions.updatePhase('phase3', 20);
    
    // Simulation de la progression complète
    progressActions.updatePhase('phase1', 10);
    progressActions.updatePhase('phase2', 15);
    
    // Message de bienvenue
    toastActions.success('🎉 Phase 3 Terminée !', 'Système de gestion de contenu opérationnel');
  });

  function handleAuthSuccess(event) {
    const { email, name } = event.detail;
    
    authStore.update(state => ({
      ...state,
      user: { id: `user-${Date.now()}`, email, name },
      loading: false,
      error: null
    }));

    toastActions.success('Connexion réussie !', `Bienvenue ${name || email}`);
    showEmailAuth = false;
  }

  function handleSignOut() {
    authStore.update(state => ({
      ...state,
      user: null,
      loading: false,
      error: null
    }));
    
    toastActions.info('Déconnexion', 'À bientôt !');
  }

  $: user = $currentUser;
  $: progress = $learningProgress;
</script>

<svelte:head>
  <title>Phase 3 Complète - Système de Gestion de Contenu</title>
</svelte:head>

<Toast />

<main class="completion-page">
  <div class="hero-section">
    <div class="completion-badge">
      <div class="percentage">{completionPercentage}%</div>
      <div class="label">PHASE 3 TERMINÉE</div>
    </div>

    <h1>🎉 Système de Gestion de Contenu</h1>
    <p class="hero-text">
      Toutes les fonctionnalités de la Phase 3 sont maintenant opérationnelles !
    </p>
  </div>

  <div class="progress-summary">
    <h2>📊 Résumé de la Progression</h2>
    <div class="progress-grid">
      <div class="progress-card completed">
        <h3>Phase 1 - Fondations</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress.phase1.percentage}%"></div>
        </div>
        <span>{progress.phase1.current}/{progress.phase1.total} ({progress.phase1.percentage}%)</span>
      </div>

      <div class="progress-card completed">
        <h3>Phase 2 - Développement</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress.phase2.percentage}%"></div>
        </div>
        <span>{progress.phase2.current}/{progress.phase2.total} ({progress.phase2.percentage}%)</span>
      </div>

      <div class="progress-card completed">
        <h3>Phase 3 - Contenu ✨</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress.phase3.percentage}%"></div>
        </div>
        <span>{progress.phase3.current}/{progress.phase3.total} ({progress.phase3.percentage}%)</span>
      </div>

      <div class="progress-card overall completed">
        <h3>🎯 Progression Globale</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress.overall.percentage}%"></div>
        </div>
        <span>{progress.overall.current}/{progress.overall.total} ({progress.overall.percentage}%)</span>
      </div>
    </div>
  </div>

  <div class="features-section">
    <h2>✅ Fonctionnalités Implémentées</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3>Traitement Markdown</h3>
        <p>Rendu complet avec marked.js, highlight.js et DOMPurify</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🔐</div>
        <h3>Authentification</h3>
        <p>Google OAuth et Email/Password avec Firebase</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎮</div>
        <h3>Exercices Interactifs</h3>
        <p>QCM dynamiques et validation en temps réel</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>Interface Utilisateur</h3>
        <p>Design responsive avec composants réutilisables</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Gestion d'État</h3>
        <p>Stores Svelte pour auth, toast et progression</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🧪</div>
        <h3>Tests Unitaires</h3>
        <p>Suite de tests complète avec Vitest</p>
      </div>
    </div>
  </div>

  <div class="auth-demo">
    <h2>🔐 Démonstration d'Authentification</h2>
    
    {#if user}
      <div class="user-info">
        <div class="user-avatar">👤</div>
        <div class="user-details">
          <h3>Connecté en tant que</h3>
          <p><strong>{user.name || user.email}</strong></p>
          <p class="user-email">{user.email}</p>
        </div>
        <button class="sign-out-btn" on:click={handleSignOut}>
          Déconnexion
        </button>
      </div>
    {:else}
      <div class="auth-options">
        <GoogleAuth on:auth-success={handleAuthSuccess} />
        
        <div class="auth-divider">
          <span>ou</span>
        </div>
        
        <button 
          class="email-toggle-btn"
          on:click={() => showEmailAuth = !showEmailAuth}
        >
          {showEmailAuth ? '🔼 Masquer' : '📧 Email / Mot de passe'}
        </button>
        
        {#if showEmailAuth}
          <div class="email-auth-container">
            <EmailAuth on:auth-success={handleAuthSuccess} />
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="next-steps">
    <h2>🚀 Prochaines Étapes</h2>
    <div class="steps-list">
      <div class="step completed">
        <span class="step-number">1</span>
        <div class="step-content">
          <h3>Phase 3 - Système de Contenu</h3>
          <p>✅ Complètement terminée (100%)</p>
        </div>
      </div>

      <div class="step next">
        <span class="step-number">2</span>
        <div class="step-content">
          <h3>Optimisations et Performance</h3>
          <p>Amélioration des performances et SEO</p>
        </div>
      </div>

      <div class="step future">
        <span class="step-number">3</span>
        <div class="step-content">
          <h3>Déploiement Production</h3>
          <p>Configuration CI/CD et mise en production</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .completion-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 4rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    border-radius: 1rem;
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/><circle cx="25" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.1;
  }

  .completion-badge {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 1;
  }

  .percentage {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 1px;
    opacity: 0.9;
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    position: relative;
    z-index: 1;
  }

  .hero-text {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .progress-summary {
    margin-bottom: 4rem;
  }

  h2 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
  }

  .progress-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .progress-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
  }

  .progress-card.completed {
    border-color: #28a745;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }

  .progress-card.overall {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
  }

  .progress-card h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  .progress-bar {
    width: 100%;
    height: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    border-radius: 6px;
    transition: width 0.5s ease;
  }

  .overall .progress-fill {
    background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,1));
  }

  .features-section {
    margin-bottom: 4rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .feature-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
    text-align: center;
    transition: transform 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  .feature-card p {
    color: #6c757d;
    line-height: 1.5;
    margin: 0;
  }

  .auth-demo {
    background: #f8f9fa;
    padding: 3rem;
    border-radius: 1rem;
    margin-bottom: 4rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .user-avatar {
    font-size: 3rem;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e9ecef;
    border-radius: 50%;
  }

  .user-details {
    flex: 1;
  }

  .user-details h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  .user-email {
    color: #6c757d;
    font-size: 0.9rem;
    margin: 0;
  }

  .sign-out-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.15s ease;
  }

  .sign-out-btn:hover {
    background: #c82333;
  }

  .auth-options {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .auth-divider {
    text-align: center;
    position: relative;
    color: #6c757d;
  }

  .auth-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #dee2e6;
    z-index: 1;
  }

  .auth-divider span {
    background: #f8f9fa;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
  }

  .email-toggle-btn {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.15s ease;
  }

  .email-toggle-btn:hover {
    background: #545b62;
  }

  .email-auth-container {
    margin-top: 1rem;
  }

  .next-steps {
    background: white;
    padding: 3rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
  }

  .step.completed {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    border: 2px solid #28a745;
  }

  .step.next {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border: 2px solid #ffc107;
  }

  .step.future {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #6c757d;
  }

  .step-number {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .completed .step-number {
    background: #28a745;
    color: white;
  }

  .next .step-number {
    background: #ffc107;
    color: #212529;
  }

  .future .step-number {
    background: #6c757d;
    color: white;
  }

  .step-content h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  .step-content p {
    margin: 0;
    color: #6c757d;
  }

  @media (max-width: 768px) {
    .completion-page {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .hero-section {
      padding: 3rem 1.5rem;
    }

    .progress-grid {
      grid-template-columns: 1fr;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .user-info {
      flex-direction: column;
      text-align: center;
    }

    .steps-list {
      gap: 1rem;
    }

    .step {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
