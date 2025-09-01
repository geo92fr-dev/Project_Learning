<script>
  import { createEventDispatcher } from 'svelte';
  import { signIn, signUp, signInWithGoogle } from '$lib/stores/auth';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let mode = 'login';
  export let loading = false;
  export let error = null;
  
  // Form data
  let email = '';
  let password = '';
  let confirmPassword = '';
  let displayName = '';
  
  // Simple validation
  function isValidEmail(email) {
    return email && email.includes('@') && email.includes('.');
  }
  
  function isValidPassword(password) {
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
      loading = true;
      error = null;
      
      if (mode === 'login') {
        const result = await signIn({ email, password });
        if (result.success) {
          dispatch('success', { type: 'login', email });
        } else {
          error = result.error;
        }
      } else {
        const result = await signUp({ 
          email, 
          password, 
          displayName: displayName || email.split('@')[0] 
        });
        if (result.success) {
          dispatch('success', { type: 'register', email });
        } else {
          error = result.error;
        }
      }
    } catch (err) {
      error = err.message || 'Une erreur est survenue';
      console.error('❌ Erreur formulaire:', err);
    } finally {
      loading = false;
    }
  }
  
  async function handleGoogleAuth() {
    try {
      loading = true;
      error = null;
      
      const result = await signInWithGoogle();
      if (result.success) {
        dispatch('success', { type: 'google', email: result.user.email });
      } else {
        error = result.error;
      }
    } catch (err) {
      error = err.message || 'Erreur connexion Google';
      console.error('❌ Erreur Google:', err);
    } finally {
      loading = false;
    }
  }
  
  function toggleMode() {
    mode = mode === 'login' ? 'register' : 'login';
    error = null;
    // Reset form
    email = '';
    password = '';
    confirmPassword = '';
    displayName = '';
  }
</script>

<div class="auth-form">
  <div class="form-header">
    <h2>
      {mode === 'login' ? '🔐 Connexion' : '📝 Inscription'}
    </h2>
    <p>
      {mode === 'login' 
        ? 'Connectez-vous à votre compte' 
        : 'Créez votre compte FunLearning'
      }
    </p>
  </div>

  {#if error}
    <div class="error-message">
      ❌ {error}
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="auth-form-container">
    {#if mode === 'register'}
      <div class="form-group">
        <label for="displayName">Nom d'affichage</label>
        <input
          id="displayName"
          type="text"
          bind:value={displayName}
          placeholder="Votre nom"
          class="form-input"
        />
      </div>
    {/if}

    <div class="form-group">
      <label for="email">Email *</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="votre@email.com"
        required
        class="form-input"
        class:invalid={email && !isValidEmail(email)}
      />
      {#if email && !isValidEmail(email)}
        <span class="field-error">Email invalide</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="password">Mot de passe *</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="6 caractères minimum"
        required
        class="form-input"
        class:invalid={password && !isValidPassword(password)}
      />
      {#if password && !isValidPassword(password)}
        <span class="field-error">Minimum 6 caractères</span>
      {/if}
    </div>

    {#if mode === 'register'}
      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe *</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          placeholder="Répétez le mot de passe"
          required
          class="form-input"
          class:invalid={confirmPassword && !passwordsMatch()}
        />
        {#if confirmPassword && !passwordsMatch()}
          <span class="field-error">Les mots de passe ne correspondent pas</span>
        {/if}
      </div>
    {/if}

    <button
      type="submit"
      class="submit-button"
      class:loading
      disabled={!isFormValid() || loading}
    >
      {#if loading}
        <span class="spinner"></span>
      {/if}
      {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
    </button>
  </form>

  <div class="divider">
    <span>ou</span>
  </div>

  <button
    type="button"
    on:click={handleGoogleAuth}
    class="google-button"
    disabled={loading}
  >
    <span class="google-icon">🔗</span>
    Continuer avec Google (simulé)
  </button>

  <div class="form-footer">
    <p>
      {mode === 'login' 
        ? 'Pas encore de compte ?' 
        : 'Déjà un compte ?'
      }
      <button type="button" on:click={toggleMode} class="toggle-link">
        {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
      </button>
    </p>
  </div>
</div>

<style>
  .auth-form {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .form-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .form-header h2 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.5rem;
  }

  .form-header p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .auth-form-container {
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #374151;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .form-input.invalid {
    border-color: #ef4444;
  }

  .field-error {
    display: block;
    color: #ef4444;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  .submit-button {
    width: 100%;
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.875rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .submit-button:hover:not(:disabled) {
    background: #2563eb;
  }

  .submit-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .divider {
    text-align: center;
    margin: 1.5rem 0;
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

  .google-button {
    width: 100%;
    background: white;
    border: 2px solid #e5e7eb;
    color: #374151;
    padding: 0.875rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .google-button:hover:not(:disabled) {
    border-color: #d1d5db;
    background: #f9fafb;
  }

  .google-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .google-icon {
    font-size: 1.2rem;
  }

  .form-footer {
    text-align: center;
  }

  .form-footer p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .toggle-link {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.9rem;
  }

  .toggle-link:hover {
    color: #2563eb;
  }
</style>
