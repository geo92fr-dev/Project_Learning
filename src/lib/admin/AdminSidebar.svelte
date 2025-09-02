<!--
  🧭 Admin Sidebar - Phase 11.1
  Navigation latérale sécurisée avec permissions
  Conformité DOC_CoPilot_Practices : Accessibilité + UX
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/stores';
  
  // Props
  export let isOpen = true;
  export let currentView = 'dashboard';
  export let canManageUsers = false;
  export let canManageContent = false;
  export let canViewAnalytics = false;
  export let canManageSystem = false;

  // Dispatcher pour communication parent
  const dispatch = createEventDispatcher<{
    navigate: { view: string };
    toggle: void;
  }>();

  // Menu principal avec permissions
  $: menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: '📊',
      path: '/admin/dashboard',
      enabled: true,
      description: 'Vue d\'ensemble du système'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: '👥',
      path: '/admin/users',
      enabled: canManageUsers,
      description: 'Gestion des comptes utilisateurs'
    },
    {
      id: 'content',
      label: 'Contenu',
      icon: '📚',
      path: '/admin/content',
      enabled: canManageContent,
      description: 'Gestion cours et exercices'
    },
    {
      id: 'analytics',
      label: 'Analyses',
      icon: '📈',
      path: '/admin/analytics',
      enabled: canViewAnalytics,
      description: 'Statistiques et rapports'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: '⚙️',
      path: '/admin/settings',
      enabled: canManageSystem,
      description: 'Configuration système'
    }
  ];

  // Navigation sécurisée
  function handleNavigation(item: typeof menuItems[0]) {
    if (!item.enabled) return;
    
    dispatch('navigate', { view: item.id });
  }

  // Gestion clavier pour accessibilité
  function handleKeydown(event: KeyboardEvent, item: typeof menuItems[0]) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(item);
    }
  }

  // Toggle sidebar responsive
  function handleToggle() {
    dispatch('toggle');
  }
</script>

<nav 
  class="admin-sidebar" 
  class:collapsed={!isOpen}
  aria-label="Navigation administration"
>
  <!-- Header Sidebar -->
  <div class="sidebar-header">
    <div class="logo-section">
      {#if isOpen}
        <div class="logo-full">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">FunLearning</span>
          <span class="admin-badge">Admin</span>
        </div>
      {:else}
        <div class="logo-collapsed">
          <span class="logo-icon">🎓</span>
        </div>
      {/if}
    </div>
    
    <button 
      class="toggle-btn"
      on:click={handleToggle}
      aria-label={isOpen ? 'Réduire le menu' : 'Étendre le menu'}
      title={isOpen ? 'Réduire le menu' : 'Étendre le menu'}
    >
      <span class="toggle-icon" class:rotated={!isOpen}>
        ◀
      </span>
    </button>
  </div>

  <!-- Menu Principal -->
  <div class="sidebar-menu">
    <ul class="menu-list" role="menubar">
      {#each menuItems as item (item.id)}
        <li class="menu-item" role="none">
          <button
            class="menu-link"
            class:active={currentView === item.id}
            class:disabled={!item.enabled}
            disabled={!item.enabled}
            role="menuitem"
            tabindex={item.enabled ? 0 : -1}
            aria-current={currentView === item.id ? 'page' : undefined}
            aria-describedby={isOpen ? `desc-${item.id}` : undefined}
            title={!isOpen ? item.label : ''}
            on:click={() => handleNavigation(item)}
            on:keydown={(e) => handleKeydown(e, item)}
          >
            <span class="menu-icon" role="img" aria-label={item.label}>
              {item.icon}
            </span>
            
            {#if isOpen}
              <span class="menu-text">{item.label}</span>
              
              {#if !item.enabled}
                <span class="permission-lock" title="Permissions insuffisantes">
                  🔒
                </span>
              {/if}
            {/if}
          </button>
          
          {#if isOpen}
            <div class="menu-description" id="desc-{item.id}">
              {item.description}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  <!-- Section Infos -->
  {#if isOpen}
    <div class="sidebar-footer">
      <div class="version-info">
        <span class="version-label">Version</span>
        <span class="version-number">2.0.0</span>
      </div>
      
      <div class="status-indicator">
        <span class="status-dot online"></span>
        <span class="status-text">Système en ligne</span>
      </div>
    </div>
  {/if}
</nav>

<style>
  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }

  .collapsed {
    width: 60px;
  }

  /* Header */
  .sidebar-header {
    padding: 1.5rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80px;
  }

  .logo-full {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-collapsed {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .logo-icon {
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }

  .logo-text {
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
  }

  .admin-badge {
    background: rgba(255,255,255,0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .toggle-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.05);
  }

  .toggle-icon {
    font-size: 0.875rem;
    transition: transform 0.3s ease;
  }

  .toggle-icon.rotated {
    transform: rotate(180deg);
  }

  /* Menu */
  .sidebar-menu {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
  }

  .menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .menu-item {
    margin-bottom: 0.5rem;
  }

  .menu-link {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: none;
    border: none;
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    gap: 1rem;
    font-size: 0.95rem;
    position: relative;
  }

  .collapsed .menu-link {
    padding: 0.875rem;
    justify-content: center;
  }

  .menu-link:hover:not(.disabled) {
    background: rgba(255,255,255,0.1);
    color: white;
    transform: translateX(4px);
  }

  .menu-link.active {
    background: rgba(255,255,255,0.15);
    color: white;
    font-weight: 600;
  }

  .menu-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 60%;
    background: #fbbf24;
    border-radius: 0 2px 2px 0;
  }

  .menu-link.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-icon {
    font-size: 1.2rem;
    min-width: 1.5rem;
    text-align: center;
  }

  .menu-text {
    flex: 1;
    text-align: left;
    white-space: nowrap;
  }

  .permission-lock {
    font-size: 0.875rem;
    opacity: 0.7;
  }

  .menu-description {
    padding: 0 1.5rem 0.5rem 4rem;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.3;
  }

  .collapsed .menu-description {
    display: none;
  }

  /* Footer */
  .sidebar-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    background: rgba(0,0,0,0.1);
  }

  .version-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .version-label {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.7);
  }

  .version-number {
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(255,255,255,0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
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
    background: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  }

  .status-text {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.8);
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .admin-sidebar {
      transform: translateX(-100%);
    }
    
    .admin-sidebar:not(.collapsed) {
      transform: translateX(0);
    }

    .collapsed {
      transform: translateX(-100%);
    }
  }

  /* Mode accessibilité */
  @media (prefers-reduced-motion: reduce) {
    .admin-sidebar,
    .menu-link,
    .toggle-btn,
    .toggle-icon,
    .status-dot {
      transition: none;
      animation: none;
    }
  }

  /* Focus visible pour accessibilité */
  .menu-link:focus-visible,
  .toggle-btn:focus-visible {
    outline: 2px solid #fbbf24;
    outline-offset: 2px;
  }

  /* Scrollbar custom pour webkit */
  .sidebar-menu::-webkit-scrollbar {
    width: 4px;
  }

  .sidebar-menu::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
  }

  .sidebar-menu::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 2px;
  }

  .sidebar-menu::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.5);
  }
</style>
