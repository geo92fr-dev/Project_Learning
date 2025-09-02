<!--
  🔔 Admin Notifications - Phase 11.1
  Système de notifications en temps réel
  Conformité DOC_CoPilot_Practices : UX + Accessibilité
-->

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { AdminNotification } from '$lib/admin/adminStore';

  // Props
  export let notifications: AdminNotification[] = [];
  export let maxVisible: number = 5;
  export let autoHide: boolean = true;
  export let hideDelay: number = 5000;

  // Dispatcher
  const dispatch = createEventDispatcher<{
    'mark-read': { id: string };
    'dismiss': { id: string };
    'action-click': { notificationId: string; actionId: string };
  }>();

  // État local
  let visibleNotifications: AdminNotification[] = [];
  let timers = new Map<string, number>();

  // Types de notifications avec styles
  const notificationStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'ℹ️',
      color: 'text-blue-800'
    },
    success: {
      bg: 'bg-green-50', 
      border: 'border-green-200',
      icon: '✅',
      color: 'text-green-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200', 
      icon: '⚠️',
      color: 'text-yellow-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '❌', 
      color: 'text-red-800'
    },
    system: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: '⚙️',
      color: 'text-purple-800'
    }
  };

  // Réactivité pour nouvelles notifications
  $: {
    updateVisibleNotifications(notifications);
  }

  // Mise à jour des notifications visibles
  function updateVisibleNotifications(newNotifications: AdminNotification[]) {
    // Garder seulement les plus récentes non lues
    const unread = newNotifications
      .filter(n => !n.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, maxVisible);

    visibleNotifications = unread;

    // Gérer les timers d'auto-hide
    if (autoHide) {
      unread.forEach(notification => {
        if (!timers.has(notification.id)) {
          const timer = setTimeout(() => {
            handleDismiss(notification.id);
          }, hideDelay) as any;
          timers.set(notification.id, timer);
        }
      });
    }
  }

  // Actions
  function handleMarkRead(id: string) {
    dispatch('mark-read', { id });
    clearTimer(id);
  }

  function handleDismiss(id: string) {
    dispatch('dismiss', { id });
    clearTimer(id);
    
    // Animation de sortie
    const element = document.querySelector(`[data-notification-id="${id}"]`);
    if (element) {
      element.classList.add('dismissing');
      setTimeout(() => {
        visibleNotifications = visibleNotifications.filter(n => n.id !== id);
      }, 300);
    }
  }

  function handleActionClick(notificationId: string, actionId: string) {
    dispatch('action-click', { notificationId, actionId });
    handleMarkRead(notificationId);
  }

  function clearTimer(id: string) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }

  // Formatage du temps relatif
  function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 30) return 'À l\'instant';
    if (diffSecs < 60) return `Il y a ${diffSecs}s`;
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  }

  // Gestion clavier
  function handleKeydown(event: KeyboardEvent, notificationId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMarkRead(notificationId);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      handleDismiss(notificationId);
    }
  }

  // Nettoyage
  onMount(() => {
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      timers.clear();
    };
  });
</script>

{#if visibleNotifications.length > 0}
  <div 
    class="notifications-container"
    role="region"
    aria-label="Notifications administrateur"
    aria-live="polite"
  >
    <div class="notifications-header">
      <h3>Notifications ({visibleNotifications.length})</h3>
      <div class="header-actions">
        <button 
          class="mark-all-read"
          on:click={() => visibleNotifications.forEach(n => handleMarkRead(n.id))}
          aria-label="Marquer toutes comme lues"
          title="Marquer toutes comme lues"
        >
          ✓ Tout marquer comme lu
        </button>
        <button 
          class="dismiss-all"
          on:click={() => visibleNotifications.forEach(n => handleDismiss(n.id))}
          aria-label="Fermer toutes les notifications"
          title="Fermer toutes les notifications"
        >
          ✕ Tout fermer
        </button>
      </div>
    </div>

    <div class="notifications-list">
      {#each visibleNotifications as notification (notification.id)}
        {@const style = notificationStyles[notification.type]}
        <button 
          class="notification-item {style.bg} {style.border} {style.color}"
          data-notification-id={notification.id}
          aria-label="Notification {notification.type}: {notification.title}"
          on:click={() => handleMarkRead(notification.id)}
          on:keydown={(e) => handleKeydown(e, notification.id)}
        >
          <!-- Indicateur priorité -->
          {#if notification.priority === 'high'}
            <div class="priority-indicator high" title="Priorité élevée">
              🔥
            </div>
          {:else if notification.priority === 'urgent'}
            <div class="priority-indicator urgent" title="Urgent">
              🚨
            </div>
          {/if}

          <!-- Contenu principal -->
          <div class="notification-content">
            <div class="notification-header">
              <span class="notification-icon" role="img" aria-label={notification.type}>
                {style.icon}
              </span>
              <div class="notification-meta">
                <h4 class="notification-title">{notification.title}</h4>
                <time class="notification-time" datetime={notification.createdAt}>
                  {formatRelativeTime(new Date(notification.createdAt))}
                </time>
              </div>
            </div>

            <div class="notification-message">
              <p>{notification.message}</p>
            </div>

            <!-- Actions spécifiques -->
            {#if notification.actions && notification.actions.length > 0}
              <div class="notification-actions" role="group" aria-label="Actions de notification">
                {#each notification.actions as action}
                  <button
                    class="action-btn {action.variant || 'secondary'}"
                    on:click|stopPropagation={() => handleActionClick(notification.id, action.action)}
                    aria-label={action.label}
                  >
                    {#if action.variant === 'primary'}
                      <span class="action-icon">→</span>
                    {/if}
                    {action.label}
                  </button>
                {/each}
              </div>
            {/if}

            <!-- Métadonnées additionnelles -->
            {#if notification.metadata}
              <div class="notification-metadata">
                {#if notification.metadata.category}
                  <span class="metadata-item">
                    <strong>Catégorie:</strong> {notification.metadata.category}
                  </span>
                {/if}
                {#if notification.metadata.userId}
                  <span class="metadata-item">
                    <strong>Utilisateur:</strong> {notification.metadata.userId}
                  </span>
                {/if}
                {#if notification.metadata.url}
                  <a
                    href={notification.metadata.url}
                    class="metadata-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    on:click|stopPropagation
                  >
                    Voir les détails →
                  </a>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Contrôles -->
          <div class="notification-controls">
            <button 
              class="control-btn mark-read"
              on:click|stopPropagation={() => handleMarkRead(notification.id)}
              aria-label="Marquer comme lu"
              title="Marquer comme lu"
            >
              ✓
            </button>
            <button 
              class="control-btn dismiss"
              on:click|stopPropagation={() => handleDismiss(notification.id)}
              aria-label="Fermer la notification"
              title="Fermer la notification"
            >
              ✕
            </button>
          </div>

          <!-- Barre de progression auto-hide -->
          {#if autoHide}
            <div class="auto-hide-progress">
              <div 
                class="progress-bar"
                style="animation-duration: {hideDelay}ms"
              ></div>
            </div>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Footer informatif -->
    <div class="notifications-footer">
      <p class="footer-text">
        {visibleNotifications.length} notification{visibleNotifications.length > 1 ? 's' : ''} 
        {visibleNotifications.length > 1 ? 'affichées' : 'affichée'}
        {#if notifications.length > maxVisible}
          · {notifications.length - maxVisible} autre{notifications.length - maxVisible > 1 ? 's' : ''} masquée{notifications.length - maxVisible > 1 ? 's' : ''}
        {/if}
      </p>
    </div>
  </div>
{/if}

<style>
  .notifications-container {
    position: fixed;
    top: 80px;
    right: 2rem;
    width: 400px;
    max-height: calc(100vh - 120px);
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 1000;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Header */
  .notifications-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f8fafc;
  }

  .notifications-header h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .mark-all-read,
  .dismiss-all {
    background: none;
    border: 1px solid #d1d5db;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mark-all-read {
    color: #059669;
    border-color: #d1fae5;
    background: #ecfdf5;
  }

  .mark-all-read:hover {
    background: #d1fae5;
    border-color: #a7f3d0;
  }

  .dismiss-all {
    color: #dc2626;
    border-color: #fecaca;
    background: #fef2f2;
  }

  .dismiss-all:hover {
    background: #fee2e2;
    border-color: #f87171;
  }

  /* Liste */
  .notifications-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .notification-item {
    position: relative;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: fadeIn 0.3s ease-out;
  }

  .notification-item:last-child {
    border-bottom: none;
  }

  .notification-item:hover {
    opacity: 0.8;
    transform: translateX(-2px);
  }

  .notification-item.dismissing {
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Priorité */
  .priority-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1rem;
    animation: pulse 2s infinite;
  }

  .priority-indicator.urgent {
    animation: urgentPulse 1s infinite;
  }

  @keyframes urgentPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  /* Contenu */
  .notification-content {
    padding-right: 3rem;
  }

  .notification-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .notification-icon {
    font-size: 1.2rem;
    margin-top: 0.1rem;
  }

  .notification-meta {
    flex: 1;
  }

  .notification-title {
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .notification-time {
    font-size: 0.8rem;
    opacity: 0.7;
    font-weight: 500;
  }

  .notification-message p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.9;
  }

  /* Actions */
  .notification-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn.primary {
    background: #3b82f6;
    color: white;
  }

  .action-btn.primary:hover {
    background: #2563eb;
  }

  .action-btn.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .action-btn.secondary:hover {
    background: #e5e7eb;
  }

  .action-btn.danger {
    background: #dc2626;
    color: white;
  }

  .action-btn.danger:hover {
    background: #b91c1c;
  }

  .action-icon {
    font-size: 0.9rem;
  }

  /* Métadonnées */
  .notification-metadata {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0,0,0,0.1);
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  .metadata-item {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .metadata-link {
    font-size: 0.8rem;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .metadata-link:hover {
    text-decoration: underline;
  }

  /* Contrôles */
  .notification-controls {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.25rem;
  }

  .control-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    opacity: 0.6;
  }

  .control-btn:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .control-btn.mark-read {
    background: #ecfdf5;
    color: #059669;
  }

  .control-btn.dismiss {
    background: #fef2f2;
    color: #dc2626;
  }

  /* Barre de progression auto-hide */
  .auto-hide-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .progress-bar {
    width: 100%;
    height: 100%;
    background: #3b82f6;
    transform: translateX(-100%);
    animation: progressSlide linear;
  }

  @keyframes progressSlide {
    from { transform: translateX(-100%); }
    to { transform: translateX(0%); }
  }

  /* Footer */
  .notifications-footer {
    padding: 0.75rem 1.5rem;
    background: #f8fafc;
    border-top: 1px solid #e5e7eb;
  }

  .footer-text {
    margin: 0;
    font-size: 0.8rem;
    color: #6b7280;
    text-align: center;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .notifications-container {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      width: auto;
      height: 100vh;
      max-height: none;
      border-radius: 0;
      border: none;
      animation: slideInMobile 0.3s ease-out;
    }

    @keyframes slideInMobile {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .notifications-list {
      max-height: calc(100vh - 200px);
    }
  }

  /* Accessibilité */
  @media (prefers-reduced-motion: reduce) {
    .notifications-container,
    .notification-item,
    .control-btn,
    .priority-indicator,
    .progress-bar {
      animation: none;
      transition: none;
    }
  }

  .notification-item:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Mode sombre */
  @media (prefers-color-scheme: dark) {
    .notifications-container {
      background: #1f2937;
      border-color: #374151;
    }

    .notifications-header {
      background: #111827;
      border-color: #374151;
    }

    .notifications-header h3 {
      color: #f9fafb;
    }

    .notifications-footer {
      background: #111827;
      border-color: #374151;
    }

    .footer-text {
      color: #d1d5db;
    }

    .notification-item {
      border-color: #374151;
    }

    .notification-title {
      color: #f9fafb;
    }

    .notification-message p {
      color: #e5e7eb;
    }
  }

  /* Scrollbar custom */
  .notifications-list::-webkit-scrollbar {
    width: 6px;
  }

  .notifications-list::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  .notifications-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .notifications-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
