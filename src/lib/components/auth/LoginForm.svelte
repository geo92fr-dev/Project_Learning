<!--
@criticality HIGH
@depends ../../stores/auth, ../../firebase.js, firebase/auth
@description Interface de connexion Google OAuth avec gestion d'erreurs complète
@phase 1
@category auth
-->

<!-- 🔐 Composant de Connexion - FunLearning Phase 1 -->
<script lang="ts">
  import { authStore } from "../../stores/auth";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth } from "../../firebase.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let loading = false;
  let error = "";

  async function signInWithGoogle() {
    try {
      loading = true;
      error = "";

      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);

      dispatch("success", {
        user: result.user,
        message: "Connexion réussie !",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur de connexion";
      error = getErrorMessage(errorMessage);
      console.error("Erreur connexion Google:", err);

      dispatch("error", {
        error: errorMessage,
        code: (err as any)?.code,
      });
    } finally {
      loading = false;
    }
  }

  function getErrorMessage(errorCode: string): string {
    const messages: Record<string, string> = {
      "auth/popup-closed-by-user": "Connexion annulée",
      "auth/popup-blocked": "Popup bloquée. Veuillez autoriser les popups.",
      "auth/network-request-failed": "Erreur réseau. Vérifiez votre connexion.",
      "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
      "auth/user-disabled": "Compte désactivé. Contactez le support.",
      "auth/operation-not-allowed": "Connexion Google non activée.",
    };

    return messages[errorCode] || "Erreur de connexion inattendue";
  }

  // État de l'auth store
  $: ({ user, loading: authLoading } = $authStore);
</script>

<div class="login-container">
  <div class="login-card">
    <header class="login-header">
      <h1>🎓 FunLearning</h1>
      <p>Connectez-vous pour accéder à vos cours</p>
    </header>

    {#if error}
      <div class="error-banner" role="alert">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{error}</span>
        <button
          class="error-close"
          on:click={() => (error = "")}
          aria-label="Fermer l'erreur"
        >
          ✕
        </button>
      </div>
    {/if}

    <div class="login-form">
      <button
        class="google-button"
        on:click={signInWithGoogle}
        disabled={loading || authLoading}
        aria-label="Se connecter avec Google"
      >
        {#if loading}
          <div class="loading-spinner" />
          <span>Connexion...</span>
        {:else}
          <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
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
          <span>Continuer avec Google</span>
        {/if}
      </button>

      <div class="login-divider">
        <span>ou</span>
      </div>

      <div class="demo-info">
        <p class="demo-text">
          <span class="demo-icon">💡</span>
          Version de démonstration - Utilisez Google pour vous connecter
        </p>
      </div>
    </div>

    <footer class="login-footer">
      <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
    </footer>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .login-header {
    text-align: center;
    padding: 2rem 2rem 1rem;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }

  .login-header h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    font-weight: 700;
  }

  .login-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 1rem;
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    margin: 1rem 2rem;
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
  }

  .error-icon {
    font-size: 1.25rem;
  }

  .error-text {
    flex: 1;
    font-weight: 500;
  }

  .error-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
    color: #dc2626;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-close:hover {
    background: rgba(220, 38, 38, 0.1);
    border-radius: 4px;
  }

  .login-form {
    padding: 2rem;
  }

  .google-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    color: #374151;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .google-button:hover:not(:disabled) {
    border-color: #d1d5db;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  .google-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .google-icon {
    flex-shrink: 0;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f4f6;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .login-divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    color: #6b7280;
  }

  .login-divider::before,
  .login-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  .login-divider span {
    padding: 0 1rem;
    font-size: 0.875rem;
  }

  .demo-info {
    text-align: center;
  }

  .demo-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 0;
    padding: 1rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    color: #075985;
    font-size: 0.875rem;
  }

  .demo-icon {
    font-size: 1rem;
  }

  .login-footer {
    padding: 1rem 2rem 2rem;
    text-align: center;
  }

  .login-footer p {
    margin: 0;
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.4;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .login-container {
      padding: 0.5rem;
    }

    .login-header,
    .login-form,
    .login-footer {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    .login-header h1 {
      font-size: 1.75rem;
    }
  }
</style>
