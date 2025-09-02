<!--
  📱 PWA Status Component - Phase 10
  Affichage et contrôle des fonctionnalités PWA
-->

<script lang="ts">
  import { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    isOfflineMode,
    pwaStatus,
    cacheSize,
    notificationQueue,
    installApp,
    activateUpdate,
    clearCache,
    formatCacheSize,
    getConnectionInfo,
    removeNotification
  } from '$lib/stores/pwa';
  
  let showDetails = false;
  let installing = false;
  let clearingCache = false;
  
  // Informations de connexion
  $: connectionInfo = getConnectionInfo();
  
  async function handleInstall() {
    if (installing) return;
    
    installing = true;
    try {
      await installApp();
    } catch (error) {
      console.error('Erreur installation:', error);
      alert('Impossible d\'installer l\'application');
    } finally {
      installing = false;
    }
  }
  
  async function handleClearCache() {
    if (clearingCache) return;
    
    if (!confirm('Vider le cache supprimera les données offline. Continuer ?')) {
      return;
    }
    
    clearingCache = true;
    try {
      await clearCache();
    } catch (error) {
      console.error('Erreur vidage cache:', error);
      alert('Impossible de vider le cache');
    } finally {
      clearingCache = false;
    }
  }
</script>

<!-- Status bar PWA -->
<div class="pwa-status-bar" class:offline={!$isOnline} class:installed={$isInstalled}>
  <!-- Indicateur de statut -->
  <div class="status-indicator">
    <div class="status-dot" class:online={$isOnline} class:offline={!$isOnline}></div>
    <span class="status-text">
      {#if $isOfflineMode}
        🔌 Mode hors ligne
      {:else if !$isOnline}
        📶 Connexion limitée
      {:else}
        ✅ En ligne
      {/if}
    </span>
  </div>
  
  <!-- Actions PWA -->
  <div class="pwa-actions">
    {#if $isInstallable}
      <button 
        class="btn-install"
        on:click={handleInstall}
        disabled={installing}
      >
        {#if installing}
          ⏳ Installation...
        {:else}
          📱 Installer l'app
        {/if}
      </button>
    {/if}
    
    {#if $isInstalled}
      <span class="installed-badge">
        ✅ Installée
      </span>
    {/if}
    
    <button 
      class="btn-details"
      on:click={() => showDetails = !showDetails}
    >
      ⚙️ Détails
    </button>
  </div>
</div>

<!-- Panneau détails PWA -->
{#if showDetails}
  <div class="pwa-details-panel">
    <div class="details-header">
      <h3>📱 État PWA</h3>
      <button 
        class="btn-close"
        on:click={() => showDetails = false}
      >
        ✕
      </button>
    </div>
    
    <div class="details-content">
      <!-- Statut général -->
      <div class="detail-section">
        <h4>📊 Statut général</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">Application :</span>
            <span class="value" class:success={$isInstalled} class:pending={!$isInstalled}>
              {$isInstalled ? '✅ Installée' : '📱 Web'}
            </span>
          </div>
          
          <div class="detail-item">
            <span class="label">Mode offline :</span>
            <span class="value" class:success={$pwaStatus.offline} class:error={!$pwaStatus.offline}>
              {$pwaStatus.offline ? '✅ Disponible' : '❌ Non disponible'}
            </span>
          </div>
          
          <div class="detail-item">
            <span class="label">Cache :</span>
            <span class="value">
              {formatCacheSize($cacheSize)}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Informations réseau -->
      <div class="detail-section">
        <h4>🌐 Réseau</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">État :</span>
            <span class="value" class:success={$isOnline} class:error={!$isOnline}>
              {$isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
            </span>
          </div>
          
          <div class="detail-item">
            <span class="label">Type :</span>
            <span class="value">{connectionInfo.type}</span>
          </div>
          
          {#if connectionInfo.speed > 0}
            <div class="detail-item">
              <span class="label">Vitesse :</span>
              <span class="value">{connectionInfo.speed} Mbps</span>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Actions avancées -->
      <div class="detail-section">
        <h4>🔧 Actions</h4>
        <div class="actions-grid">
          <button 
            class="btn-action danger"
            on:click={handleClearCache}
            disabled={clearingCache}
          >
            {#if clearingCache}
              ⏳ Vidage...
            {:else}
              🗑️ Vider le cache
            {/if}
          </button>
          
          <button 
            class="btn-action"
            on:click={() => window.location.reload()}
          >
            🔄 Recharger
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Notifications PWA -->
{#if $notificationQueue.length > 0}
  <div class="pwa-notifications">
    {#each $notificationQueue as notification (notification.id)}
      <div class="notification" class:update={notification.type === 'update'}>
        <div class="notification-content">
          <span class="notification-message">{notification.message}</span>
          
          {#if notification.action}
            <button 
              class="btn-notification-action"
              on:click={() => {
                notification.action?.();
                removeNotification(notification.id);
              }}
            >
              Activer
            </button>
          {/if}
        </div>
        
        <button 
          class="btn-close-notification"
          on:click={() => removeNotification(notification.id)}
        >
          ✕
        </button>
      </div>
    {/each}
  </div>
{/if}

<style>
  .pwa-status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 1000;
    font-size: 0.85rem;
    transition: all 0.3s ease;
  }
  
  .pwa-status-bar.offline {
    background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  }
  
  .pwa-status-bar.installed {
    background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  .status-dot.online {
    background: #ffffff;
  }
  
  .status-dot.offline {
    background: #fbbf24;
  }
  
  .pwa-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .btn-install, .btn-details, .btn-action {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-install:hover, .btn-details:hover, .btn-action:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  .btn-install:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .btn-action.danger {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
  }
  
  .btn-action.danger:hover {
    background: rgba(239, 68, 68, 0.3);
  }
  
  .installed-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
  }
  
  .pwa-details-panel {
    position: fixed;
    top: 40px;
    right: 0;
    width: 350px;
    max-height: 80vh;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0 0 0 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 999;
    overflow-y: auto;
  }
  
  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  
  .details-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #374151;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
    border-radius: 4px;
  }
  
  .btn-close:hover {
    background: #e5e7eb;
  }
  
  .details-content {
    padding: 1rem;
  }
  
  .detail-section {
    margin-bottom: 1.5rem;
  }
  
  .detail-section:last-child {
    margin-bottom: 0;
  }
  
  .detail-section h4 {
    font-size: 0.9rem;
    color: #374151;
    margin: 0 0 0.75rem 0;
    font-weight: 600;
  }
  
  .detail-grid {
    display: grid;
    gap: 0.5rem;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 6px;
  }
  
  .detail-item .label {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .detail-item .value {
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .detail-item .value.success {
    color: #10b981;
  }
  
  .detail-item .value.error {
    color: #ef4444;
  }
  
  .detail-item .value.pending {
    color: #f59e0b;
  }
  
  .actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .pwa-notifications {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 350px;
  }
  
  .notification {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .notification.update {
    border-color: #6366f1;
    background: #f0f9ff;
  }
  
  .notification-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  
  .notification-message {
    font-size: 0.9rem;
    color: #374151;
  }
  
  .btn-notification-action {
    background: #6366f1;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    align-self: flex-start;
  }
  
  .btn-notification-action:hover {
    background: #4f46e5;
  }
  
  .btn-close-notification {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    margin-left: 0.5rem;
  }
  
  .btn-close-notification:hover {
    background: #e5e7eb;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    .pwa-details-panel {
      width: 100%;
      right: 0;
      border-radius: 0;
    }
    
    .pwa-notifications {
      left: 1rem;
      right: 1rem;
      max-width: none;
    }
    
    .pwa-status-bar {
      font-size: 0.75rem;
      padding: 0 0.5rem;
    }
    
    .pwa-actions {
      gap: 0.5rem;
    }
    
    .btn-install, .btn-details {
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
    }
  }
</style>
