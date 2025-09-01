<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { signIn, signUp } from '$lib/stores/auth';
  import { signInWithGoogle } from '$lib/stores/googleAuth';
  import type { LoginCredentials, RegisterCredentials } from '$lib/types/auth';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let mode: 'login' | 'register' = 'login';
  export let loading = false;
  export let error: string | null = null;
  
  // Form data
  let email = '';
  let password = '';
  let confirmPassword = '';
  let displayName = '';
  
  // Simple validation
  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email);
  }
  
  function isValidPassword(password: string) {
    return password && password.length >= 6;
  }
  
  function passwordsMatch() {
    return password === confirmPassword;
  }
  
  function isFormValid() {
    const baseValid = isValidEmail(email) && isValidPassword(password);
    if (mode === 'register') {
      return baseValid && confirmPassword && passwordsMatch();
    }
    return baseValid;
  }
  
  async function handleSubmit() {
    if (!isFormValid() || loading) return;
    
    try {
      if (mode === 'login') {
        const credentials: LoginCredentials = { email, password };
        await signIn(credentials);
        dispatch('success', { type: 'login', email });
      } else {
        const credentials: RegisterCredentials = { 
          email, 
          password, 
          confirmPassword,
          displayName: displayName || undefined 
        };
        await signUp(credentials);
        dispatch('success', { type: 'register', email });
      }
    } catch (err: any) {
      dispatch('error', err.message);
    }
  }
  
  async function handleGoogleLogin() {
    if (loading) return;
    
    try {
      await signInWithGoogle();
      dispatch('success', { type: 'google-login' });
    } catch (err: any) {
      dispatch('error', err.message);
    }
  }
  
  function toggleMode() {
    mode = mode === 'login' ? 'register' : 'login';
    // Reset form
    email = '';
    password = '';
    confirmPassword = '';
    displayName = '';
    dispatch('modeChange', mode);
  }
</script>

<div class="auth-form">
  <div class="form-header">
    <h2>
      {mode === 'login' ? '🔐 Connexion' : '🚀 Inscription'}
    </h2>
    <p>
      {mode === 'login' 
        ? 'Connectez-vous à votre compte FunLearning' 
        : 'Créez votre compte FunLearning'
      }
    </p>
  </div>

  <!-- Erreur globale -->
  {#if error}
    <div class="error-banner" role="alert">
      <span class="error-icon">❌</span>
      <span>{error}</span>
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <!-- Email -->
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="votre.email@example.com"
        class:error={email && !isValidEmail(email)}
        disabled={loading}
        required
      />
      {#if email && !isValidEmail(email)}
        <span class="field-error">Email invalide</span>
      {/if}
    </div>

    <!-- Nom d'affichage (inscription uniquement) -->
    {#if mode === 'register'}
      <div class="form-group">
        <label for="displayName">Nom d'affichage (optionnel)</label>
        <input
          id="displayName"
          type="text"
          bind:value={displayName}
          placeholder="Votre nom"
          disabled={loading}
        />
      </div>
    {/if}

    <!-- Mot de passe -->
    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="••••••••"
        class:error={password && !isValidPassword(password)}
        disabled={loading}
        required
      />
      {#if password && !isValidPassword(password)}
        <span class="field-error">Minimum 6 caractères</span>
      {/if}
    </div>

    <!-- Confirmation mot de passe (inscription uniquement) -->
    {#if mode === 'register'}
      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          placeholder="••••••••"
          class:error={confirmPassword && !passwordsMatch()}
          disabled={loading}
          required
        />
        {#if confirmPassword && !passwordsMatch()}
          <span class="field-error">Mots de passe différents</span>
        {/if}
      </div>
    {/if}

    <!-- Boutons -->
    <div class="form-actions">
      <button
        type="submit"
        class="primary-btn"
        disabled={!isFormValid() || loading}
      >
        {#if loading}
          ⏳ {mode === 'login' ? 'Connexion...' : 'Inscription...'}
        {:else}
          {mode === 'login' ? 'Se connecter' : "S'inscrire"}
        {/if}
      </button>

      <div class="divider">
        <span>ou</span>
      </div>

      <button
        type="button"
        class="google-btn"
        on:click={handleGoogleLogin}
        disabled={loading}
      >
        🌐 Continuer avec Google
      </button>
    </div>
  </form>

  <!-- Toggle mode -->
  <div class="form-footer">
    <p>
      {mode === 'login' ? "Pas encore de compte ?" : "Déjà inscrit ?"}
      <button type="button" class="link-btn" on:click={toggleMode} disabled={loading}>
        {mode === 'login' ? "S'inscrire" : "Se connecter"}
      </button>
    </p>
  </div>
</div>

<style>
  .auth-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .form-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .form-header h2 {
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .form-header p {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fef2f2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #fecaca;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input.error {
    border-color: #ef4444;
  }

  input:disabled {
    background: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .field-error {
    display: block;
    color: #dc2626;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  .form-actions {
    margin-bottom: 1.5rem;
  }

  .primary-btn {
    width: 100%;
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .primary-btn:hover:not(:disabled) {
    background: #2563eb;
  }

  .primary-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .divider {
    margin: 1rem 0;
    text-align: center;
    position: relative;
  }

  .divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }

  .divider span {
    background: white;
    padding: 0 1rem;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .google-btn {
    width: 100%;
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .google-btn:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-footer {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .form-footer p {
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
  }

  .link-btn {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.9rem;
    padding: 0;
    margin-left: 0.25rem;
  }

  .link-btn:hover:not(:disabled) {
    color: #2563eb;
  }

  .link-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .auth-form {
      margin: 1rem;
      padding: 1.5rem;
    }
  }
</style>
