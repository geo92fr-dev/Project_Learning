<script>
  import { createEventDispatcher } from "svelte";
  import {
    signInWithGoogle,
    signOut,
    user,
    loading,
    error,
    clearError,
  } from "$lib/stores/googleAuth.js";

  const dispatch = createEventDispatcher();

  // Props
  export let buttonText = "Se connecter avec Google";
  export let showUserInfo = true;
  export let size = "medium"; // 'small', 'medium', 'large'

  // Reactive state
  $: currentUser = $user;
  $: isLoading = $loading;
  $: authError = $error;
  $: isAuthenticated = currentUser !== null;

  // Event handlers
  async function handleGoogleSignIn() {
    clearError();

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        dispatch("success", {
          type: "google-signin",
          user: result.user,
        });
      } else {
        dispatch("error", {
          type: "google-signin-failed",
          error: result.error,
        });
      }
    } catch (error) {
      dispatch("error", {
        type: "google-signin-exception",
        error: error.message,
      });
    }
  }

  async function handleSignOut() {
    try {
      const result = await signOut();

      if (result.success) {
        dispatch("success", {
          type: "signout",
          message: "Déconnexion réussie",
        });
      }
    } catch (error) {
      dispatch("error", {
        type: "signout-failed",
        error: error.message,
      });
    }
  }

  function handleErrorDismiss() {
    clearError();
  }
</script>

<div class="google-auth-component" data-testid="google-auth">
  {#if authError}
    <div class="error-banner" data-testid="error-banner">
      <span class="error-text">{authError}</span>
      <button
        class="error-dismiss"
        on:click={handleErrorDismiss}
        aria-label="Fermer l'erreur"
      >
        ✕
      </button>
    </div>
  {/if}

  {#if !isAuthenticated}
    <!-- Google Sign-In Button -->
    <button
      class="google-signin-btn {size}"
      class:loading={isLoading}
      on:click={handleGoogleSignIn}
      disabled={isLoading}
      data-testid="google-signin-btn"
    >
      {#if isLoading}
        <div class="spinner" data-testid="loading-spinner" />
        <span>Connexion en cours...</span>
      {:else}
        <div class="google-icon">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>
        <span>{buttonText}</span>
      {/if}
    </button>
  {:else if showUserInfo}
    <!-- User Info -->
    <div class="user-info" data-testid="user-info">
      <div class="user-avatar">
        {#if currentUser.photoURL}
          <img src={currentUser.photoURL} alt="Avatar" />
        {:else}
          <div class="avatar-placeholder">
            {currentUser.displayName?.charAt(0) ||
              currentUser.email?.charAt(0) ||
              "👤"}
          </div>
        {/if}
      </div>

      <div class="user-details">
        <div class="user-name">
          {currentUser.displayName || "Utilisateur"}
        </div>
        <div class="user-email">
          {currentUser.email}
        </div>
      </div>

      <button
        class="signout-btn"
        on:click={handleSignOut}
        disabled={isLoading}
        data-testid="signout-btn"
      >
        {isLoading ? "..." : "Déconnexion"}
      </button>
    </div>
  {/if}
</div>

<style>
  .google-auth-component {
    width: 100%;
    max-width: 400px;
  }

  .error-banner {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .error-dismiss {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.25rem;
    border-radius: 3px;
  }

  .error-dismiss:hover {
    background: #fee2e2;
  }

  .google-signin-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: white;
    border: 2px solid #dadce0;
    border-radius: 8px;
    color: #3c4043;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .google-signin-btn:hover:not(:disabled) {
    border-color: #c4c7ca;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .google-signin-btn:active:not(:disabled) {
    background: #f8f9fa;
  }

  .google-signin-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .google-signin-btn.small {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .google-signin-btn.large {
    padding: 1rem 1.25rem;
    font-size: 1.1rem;
  }

  .google-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #4285f4;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    background: #4285f4;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .user-details {
    flex: 1;
  }

  .user-name {
    font-weight: 600;
    color: #202124;
    margin-bottom: 0.25rem;
  }

  .user-email {
    font-size: 0.9rem;
    color: #5f6368;
  }

  .signout-btn {
    background: #ea4335;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .signout-btn:hover:not(:disabled) {
    background: #d33b2c;
  }

  .signout-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
