<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let email = '';
  let password = '';
  let confirmPassword = '';
  let isSignUp = false;
  let loading = false;
  let error = '';

  async function handleEmailAuth() {
    if (!email || !password) {
      error = 'Veuillez remplir tous les champs';
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (password.length < 6) {
      error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    loading = true;
    error = '';

    try {
      // Simulation d'authentification (à remplacer par Firebase)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        email,
        name: email.split('@')[0],
        method: isSignUp ? 'signup' : 'signin'
      };

      dispatch('auth-success', userData);
    } catch (err) {
      error = isSignUp ? 'Erreur lors de l\'inscription' : 'Erreur lors de la connexion';
      console.error('Auth error:', err);
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isSignUp = !isSignUp;
    error = '';
    confirmPassword = '';
  }
</script>

<div class="email-auth">
  <form on:submit|preventDefault={handleEmailAuth} class="auth-form">
    <h3>{isSignUp ? 'Créer un compte' : 'Se connecter'}</h3>
    
    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        placeholder="votre@email.com"
        disabled={loading}
      />
    </div>

    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        placeholder="••••••••"
        minlength="6"
        disabled={loading}
      />
    </div>

    {#if isSignUp}
      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          required
          placeholder="••••••••"
          minlength="6"
          disabled={loading}
        />
      </div>
    {/if}

    <button type="submit" class="auth-button" disabled={loading}>
      {#if loading}
        <span class="loading-spinner"></span>
        {isSignUp ? 'Inscription...' : 'Connexion...'}
      {:else}
        {isSignUp ? '✉️ Créer mon compte' : '🔐 Se connecter'}
      {/if}
    </button>

    <div class="toggle-mode">
      <button type="button" class="toggle-button" on:click={toggleMode} disabled={loading}>
        {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
      </button>
    </div>
  </form>
</div>

<style>
  .email-auth {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
  }

  h3 {
    margin: 0 0 1rem 0;
    text-align: center;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #f5c6cb;
    font-size: 0.9rem;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
    color: #495057;
    font-size: 0.95rem;
  }

  input {
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.15s ease;
    background: white;
  }

  input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  input:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .auth-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .auth-button:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .auth-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .toggle-mode {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
  }

  .toggle-button {
    background: none;
    border: none;
    color: #007bff;
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.15s ease;
  }

  .toggle-button:hover:not(:disabled) {
    color: #0056b3;
  }

  .toggle-button:disabled {
    color: #6c757d;
    cursor: not-allowed;
    text-decoration: none;
  }

  @media (max-width: 480px) {
    .auth-form {
      padding: 1.5rem;
      margin: 1rem;
    }

    h3 {
      font-size: 1.3rem;
    }

    input, .auth-button {
      font-size: 0.95rem;
    }
  }
</style>
