<!--
  📋 Admin Header - Phase 11.1
  En-tête avec profil admin et notifications
  Conformité DOC_CoPilot_Practices : Sécurité + UX
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { AdminUser } from '$lib/admin/adminStore';
  
  // Props
  export let user: AdminUser | null = null;
  export let unreadNotificationsCount = 0;

  // Dispatcher
  const dispatch = createEventDispatcher<{
    'toggle-sidebar': void;
    'logout': void;
  }>();

  // État local
  let showProfileMenu = false;
  let showNotificationsPanel = false;

  // Formatage sécurisé
  function formatUserRole(role: string): string {
    const roleMap: Record<string, string> = {
      'super_admin': 'Super Administrateur',
      'admin': 'Administrateur', 
      'instructor': 'Instructeur',
      'moderator': 'Modérateur',
      'viewer': 'Lecteur'
    };
    return roleMap[role] || role;
  }

  function formatLastLogin(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR');
  }

  // Gestion des clics extérieurs
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest('.profile-menu-container')) {
      showProfileMenu = false;
    }
    if (!target.closest('.notifications-container')) {
      showNotificationsPanel = false;
    }
  }

  // Gestion clavier pour accessibilité
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showProfileMenu = false;
      showNotificationsPanel = false;
    }
  }

  // Actions
  function toggleSidebar() {
    dispatch('toggle-sidebar');
  }

  function toggleProfileMenu() {
    showProfileMenu = !showProfileMenu;
    showNotificationsPanel = false;
  }

  function toggleNotifications() {
    showNotificationsPanel = !showNotificationsPanel;
    showProfileMenu = false;
  }

  function handleLogout() {
    showProfileMenu = false;
    dispatch('logout');
  }

  // Raccourcis clavier
  function handleProfileKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleProfileMenu();
    }
  }

  function handleNotificationsKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleNotifications();
    }
  }
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<header class="admin-header">
  <!-- Section gauche : Navigation mobile + Titre -->
  <div class="header-left">
    <button 
      class="sidebar-toggle mobile-only"
      on:click={toggleSidebar}
      aria-label="Basculer la navigation"
      title="Ouvrir/fermer le menu"
    >
      <span class="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>

    <div class="page-title">
      <h1>Interface d'Administration</h1>
      <div class="breadcrumb">
        <span class="breadcrumb-item">Administration</span>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">Tableau de bord</span>
      </div>
    </div>
  </div>

  <!-- Section droite : Notifications + Profil -->
  <div class="header-right">
    
    <!-- Bouton Notifications -->
    <div class="notifications-container" class:active={showNotificationsPanel}>
      <button 
        class="notifications-btn"
        class:has-notifications={unreadNotificationsCount > 0}
        on:click={toggleNotifications}
        on:keydown={handleNotificationsKeydown}
        aria-label="Notifications {unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} non lues)` : ''}"
        title="Voir les notifications"
      >
        <span class="notification-icon">🔔</span>
        {#if unreadNotificationsCount > 0}
          <span class="notification-badge" aria-hidden="true">
            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
          </span>
        {/if}
      </button>

      <!-- Panel Notifications (placeholder) -->
      {#if showNotificationsPanel}
        <div class="notifications-panel">
          <div class="panel-header">
            <h3>Notifications</h3>
            <button class="close-panel" on:click={() => showNotificationsPanel = false}>
              ✕
            </button>
          </div>
          <div class="panel-content">
            {#if unreadNotificationsCount > 0}
              <div class="notification-item">
                <span class="notification-dot"></span>
                <div class="notification-text">
                  <p>Nouvelles activités détectées</p>
                  <span class="notification-time">Il y a 5 min</span>
                </div>
              </div>
              <div class="notification-item">
                <span class="notification-dot"></span>
                <div class="notification-text">
                  <p>Maintenance système planifiée</p>
                  <span class="notification-time">Il y a 2h</span>
                </div>
              </div>
            {:else}
              <div class="no-notifications">
                <span class="no-notif-icon">✨</span>
                <p>Aucune nouvelle notification</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- Profil Administrateur -->
    <div class="profile-menu-container" class:active={showProfileMenu}>
      <button 
        class="profile-btn"
        on:click={toggleProfileMenu}
        on:keydown={handleProfileKeydown}
        aria-label="Menu profil utilisateur"
        aria-expanded={showProfileMenu}
        title="Ouvrir le menu profil"
      >
        <div class="profile-avatar">
          <span class="avatar-text">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </span>
          <div class="status-indicator online" title="En ligne"></div>
        </div>
        <div class="profile-info">
          <span class="profile-name">{user?.name || 'Administrateur'}</span>
          <span class="profile-role">{user ? formatUserRole(user.role) : 'Admin'}</span>
        </div>
        <span class="dropdown-arrow" class:rotated={showProfileMenu}>▼</span>
      </button>

      <!-- Menu déroulant profil -->
      {#if showProfileMenu}
        <div class="profile-dropdown" role="menu">
          <div class="dropdown-header">
            <div class="user-details">
              <h4>{user?.name || 'Administrateur'}</h4>
              <p class="user-email">{user?.email || 'admin@funlearning.fr'}</p>
              <p class="user-role-detail">{user ? formatUserRole(user.role) : 'Administrateur'}</p>
              {#if user?.lastLogin}
                <p class="last-login">
                  Dernière connexion : {formatLastLogin(user.lastLogin)}
                </p>
              {/if}
            </div>
            <div class="permissions-summary">
              <h5>Permissions actives :</h5>
              <div class="permission-pills">
                {#if user?.permissions}
                  {#each Object.entries(user.permissions) as [resource, actions]}
                    {#if Array.isArray(actions) && actions.length > 0}
                      <span class="permission-pill">
                        {resource}: {actions.join(', ')}
                      </span>
                    {/if}
                  {/each}
                {:else}
                  <span class="permission-pill">Chargement...</span>
                {/if}
              </div>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <div class="dropdown-actions">
            <button class="dropdown-item" role="menuitem">
              <span class="item-icon">👤</span>
              <span>Mon Profil</span>
            </button>
            
            <button class="dropdown-item" role="menuitem">
              <span class="item-icon">⚙️</span>
              <span>Préférences</span>
            </button>
            
            <button class="dropdown-item" role="menuitem">
              <span class="item-icon">🔐</span>
              <span>Sécurité</span>
            </button>
            
            <button class="dropdown-item" role="menuitem">
              <span class="item-icon">📊</span>
              <span>Activité</span>
            </button>
          </div>

          <div class="dropdown-divider"></div>

          <button 
            class="dropdown-item logout-item"
            role="menuitem"
            on:click={handleLogout}
          >
            <span class="item-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      {/if}
    </div>

    <!-- Indicateur de statut système -->
    <div class="system-status" title="État du système">
      <span class="status-dot healthy"></span>
      <span class="status-text">Système opérationnel</span>
    </div>
  </div>
</header>

<style>
  .admin-header {
    position: sticky;
    top: 0;
    z-index: 900;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    min-height: 70px;
  }

  /* Section gauche */
  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .sidebar-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background 0.2s ease;
  }

  .sidebar-toggle:hover {
    background: #f3f4f6;
  }

  .hamburger-icon {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .hamburger-icon span {
    width: 20px;
    height: 2px;
    background: #374151;
    border-radius: 1px;
    transition: all 0.2s ease;
  }

  .page-title h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .breadcrumb-current {
    font-weight: 500;
    color: #3b82f6;
  }

  /* Section droite */
  .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  /* Notifications */
  .notifications-container {
    position: relative;
  }

  .notifications-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notifications-btn:hover,
  .notifications-container.active .notifications-btn {
    background: #f3f4f6;
    transform: scale(1.05);
  }

  .notification-icon {
    font-size: 1.3rem;
  }

  .notification-badge {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: #ef4444;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.1rem 0.4rem;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    line-height: 1.2;
  }

  .notifications-panel {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 320px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 1000;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .panel-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .close-panel {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
  }

  .close-panel:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .panel-content {
    max-height: 300px;
    overflow-y: auto;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }

  .notification-item:last-child {
    border-bottom: none;
  }

  .notification-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #3b82f6;
    margin-top: 0.5rem;
    flex-shrink: 0;
  }

  .notification-text p {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    color: #374151;
  }

  .notification-time {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .no-notifications {
    text-align: center;
    padding: 2rem 1rem;
    color: #6b7280;
  }

  .no-notif-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  /* Profil */
  .profile-menu-container {
    position: relative;
  }

  .profile-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: none;
    border: 1px solid transparent;
    padding: 0.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .profile-btn:hover,
  .profile-menu-container.active .profile-btn {
    background: #f8fafc;
    border-color: #e5e7eb;
    transform: translateY(-1px);
  }

  .profile-avatar {
    position: relative;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    font-size: 1.1rem;
  }

  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
  }

  .status-indicator.online {
    background: #10b981;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    text-align: left;
    min-width: 0;
  }

  .profile-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  .profile-role {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .dropdown-arrow {
    font-size: 0.8rem;
    color: #6b7280;
    transition: transform 0.2s ease;
  }

  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }

  .profile-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 300px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 1000;
    overflow: hidden;
  }

  .dropdown-header {
    padding: 1.5rem;
    background: #f8fafc;
  }

  .user-details h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .user-email,
  .user-role-detail,
  .last-login {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .permissions-summary {
    margin-top: 1rem;
  }

  .permissions-summary h5 {
    margin: 0 0 0.5rem 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .permission-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .permission-pill {
    font-size: 0.7rem;
    background: #e5e7eb;
    color: #374151;
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-weight: 500;
  }

  .dropdown-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0;
  }

  .dropdown-actions {
    padding: 0.5rem 0;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease;
    color: #374151;
  }

  .dropdown-item:hover {
    background: #f3f4f6;
  }

  .logout-item {
    color: #dc2626;
  }

  .logout-item:hover {
    background: #fef2f2;
  }

  .item-icon {
    font-size: 1.1rem;
  }

  /* Status système */
  .system-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    font-size: 0.8rem;
  }

  .status-dot.healthy {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse 2s infinite;
  }

  .status-text {
    color: #166534;
    font-weight: 500;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .admin-header {
      padding: 1rem;
    }

    .sidebar-toggle.mobile-only {
      display: block;
    }

    .page-title h1 {
      font-size: 1.2rem;
    }

    .breadcrumb {
      display: none;
    }

    .profile-info {
      display: none;
    }

    .system-status {
      display: none;
    }

    .profile-dropdown,
    .notifications-panel {
      width: 280px;
      right: -1rem;
    }
  }

  /* Accessibilité */
  @media (prefers-reduced-motion: reduce) {
    .notifications-btn,
    .profile-btn,
    .dropdown-arrow,
    .status-dot.healthy {
      transition: none;
      animation: none;
    }
  }

  .profile-btn:focus-visible,
  .notifications-btn:focus-visible,
  .dropdown-item:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
</style>
