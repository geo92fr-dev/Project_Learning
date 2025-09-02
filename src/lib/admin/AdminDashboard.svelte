<!--
  ⚙️ Admin Dashboard - Phase 11.1
  Interface principale d'administration
  Conformité DOC_CoPilot_Practices : Sécurité + UX + Performance
-->

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { 
    adminState,
    currentAdminUser,
    adminUsers,
    systemStats,
    adminNotifications,
    unreadNotificationsCount,
    isAdminLoading,
    adminError,
    adminActions,
    hasPermission,
    cleanup,
    type AdminUser,
    type SystemStats,
    type AdminNotification
  } from '$lib/admin/adminStore';
  import AdminSidebar from './AdminSidebar.svelte';
  import AdminHeader from './AdminHeader.svelte';
  import AdminNotifications from './AdminNotifications.svelte';
  import SystemStatsCard from './SystemStatsCard.svelte';
  import UserManagementTable from './UserManagementTable.svelte';

  // Store admin réactif
  // Les stores sont importés directement depuis adminStore.ts

  // État local du composant
  let sidebarOpen = true;
  let currentView = 'dashboard';
  let error: string | null = null;
  let initializationAttempted = false;

  // Réactivité pour navigation
  $: if ($page.url.pathname.includes('/admin/')) {
    const pathSegments = $page.url.pathname.split('/');
    const view = pathSegments[pathSegments.length - 1];
    if (['dashboard', 'users', 'content', 'analytics', 'settings'].includes(view)) {
      currentView = view;
    }
  }

  // Dérivés pour sécurité et UX
  $: canManageUsers = $currentAdminUser ? hasPermission($currentAdminUser, 'users', 'read') : false;
  $: canManageContent = $currentAdminUser ? hasPermission($currentAdminUser, 'courses', 'read') : false;
  $: canViewAnalytics = $currentAdminUser ? hasPermission($currentAdminUser, 'analytics', 'read') : false;
  $: canManageSystem = $currentAdminUser ? $currentAdminUser.role === 'super_admin' : false;

  // Initialisation sécurisée
  onMount(async () => {
    try {
      initializationAttempted = true;
      
      // Vérifier l'authentification utilisateur
      const userProfile = await getCurrentUserProfile();
      if (!userProfile) {
        await goto('/auth/login?redirect=/admin');
        return;
      }

      // Initialiser la session admin
      const mockUserProfile = {
        id: userProfile.id || 'test-user',
        email: userProfile.email || 'test@admin.com',
        displayName: userProfile.displayName || 'Admin Test',
        role: 'admin' as const,
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-01T00:00:00Z',
        preferences: {
          language: 'fr',
          theme: 'auto' as const,
          notifications: { email: true, push: true, inApp: true },
          accessibility: { highContrast: false, fontSize: 'medium' as const }
        },
        learningProfile: {
          level: 'intermediate' as const,
          interests: [],
          goals: []
        },
        progressTracking: {
          coursesEnrolled: [],
          coursesCompleted: [],
          badges: [],
          totalPoints: 0
        },
        metadata: {
          lastActive: '2024-01-01T00:00:00Z',
          sessionCount: 1,
          feedbackProvided: false
        }
      };
      await adminActions.initialize();
      
      // Navigation par défaut si pas de vue spécifique
      if (currentView === 'dashboard' && $page.url.pathname === '/admin') {
        // Rester sur le dashboard par défaut
      }

    } catch (err) {
      console.error('Erreur initialisation admin:', err);
      error = err instanceof Error ? err.message : 'Erreur d\'initialisation';
      
      // Redirection si pas d'accès admin
      if (err instanceof Error && err.message.includes('non autorisé')) {
        await goto('/?error=admin_access_denied');
      }
    }
  });

  // Nettoyage à la destruction
  onDestroy(() => {
    cleanup();
  });

  // Fonction pour récupérer le profil utilisateur actuel
  async function getCurrentUserProfile() {
    // TODO: Récupérer depuis le store d'authentification
    // Pour l'instant, retourner un profil mock si développement
    if (import.meta.env.DEV) {
      return {
        id: 'dev-admin-1',
        email: 'admin@dev.local',
        displayName: 'Dev Admin'
      };
    }
    
    // En production, récupérer depuis Firebase Auth ou autre
    return null;
  }

  // Gestion navigation sécurisée
  async function navigateTo(view: string) {
    // Vérifier permissions avant navigation
    switch (view) {
      case 'users':
        if (!canManageUsers) {
          error = 'Permissions insuffisantes pour accéder à la gestion des utilisateurs';
          return;
        }
        break;
      case 'content':
        if (!canManageContent) {
          error = 'Permissions insuffisantes pour accéder à la gestion du contenu';
          return;
        }
        break;
      case 'analytics':
        if (!canViewAnalytics) {
          error = 'Permissions insuffisantes pour accéder aux analyses';
          return;
        }
        break;
      case 'settings':
        if (!canManageSystem) {
          error = 'Permissions insuffisantes pour accéder aux paramètres système';
          return;
        }
        break;
    }

    // Navigation sécurisée
    currentView = view;
    await goto(`/admin/${view}`);
    error = null;
  }

  // Gestion responsive sidebar
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  // Auto-fermeture sidebar sur mobile
  function handleResize() {
    if (window.innerWidth < 768) {
      sidebarOpen = false;
    } else {
      sidebarOpen = true;
    }
  }

  // Gestion du focus pour accessibilité
  function handleKeydown(event: KeyboardEvent) {
    // Échapper pour fermer notifications/modals
    if (event.key === 'Escape') {
      // TODO: Fermer modals ouverts
    }
  }

  // Formatage sécurisé des données
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

  function formatSystemHealth(health: number): { color: string; status: string } {
    if (health >= 90) return { color: 'green', status: 'Excellent' };
    if (health >= 70) return { color: 'yellow', status: 'Bon' };
    if (health >= 50) return { color: 'orange', status: 'Moyen' };
    return { color: 'red', status: 'Critique' };
  }
</script>

<svelte:window on:resize={handleResize} on:keydown={handleKeydown} />

<svelte:head>
  <title>Administration - FunLearning</title>
  <meta name="description" content="Interface d'administration FunLearning" />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="error-boundary">
  <div class="admin-layout" class:sidebar-closed={!sidebarOpen}>
    
    <!-- Sidebar Navigation -->
    <AdminSidebar 
      bind:isOpen={sidebarOpen}
      {currentView}
      {canManageUsers}
      {canManageContent}
      {canViewAnalytics}
      {canManageSystem}
      on:navigate={(e) => navigateTo(e.detail.view)}
      on:toggle={toggleSidebar}
    />

    <!-- Main Content Area -->
    <main class="admin-main">
      
      <!-- Header with user info and notifications -->
      <AdminHeader 
        user={$currentAdminUser}
        unreadNotificationsCount={$unreadNotificationsCount}
        on:toggle-sidebar={toggleSidebar}
        on:logout={() => goto('/auth/logout')}
      />

      <!-- Notifications Panel -->
      {#if $adminNotifications.length > 0}
        <AdminNotifications 
          notifications={$adminNotifications}
          on:mark-read={(e) => adminActions.markNotificationRead(e.detail.id)}
          on:dismiss={(e) => adminActions.removeNotification(e.detail.id)}
        />
      {/if}

      <!-- Error Display -->
      {#if error}
        <div class="error-banner" role="alert">
          <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">{error}</span>
            <button 
              class="error-close"
              on:click={() => error = null}
              aria-label="Fermer l'erreur"
            >
              ✕
            </button>
          </div>
        </div>
      {/if}

      <!-- Loading State -->
      {#if $isAdminLoading && !initializationAttempted}
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Chargement de l'interface d'administration...</p>
        </div>
      {:else if !$currentAdminUser && initializationAttempted}
        <!-- Unauthorized State -->
        <div class="unauthorized-container">
          <div class="unauthorized-content">
            <h2>Accès Non Autorisé</h2>
            <p>Vous n'avez pas les permissions nécessaires pour accéder à cette interface.</p>
            <button on:click={() => goto('/')} class="btn-primary">
              Retour à l'accueil
            </button>
          </div>
        </div>
      {:else}
        <!-- Main Dashboard Content -->
        <div class="admin-content">
          
          {#if currentView === 'dashboard'}
            <!-- Dashboard Overview -->
            <div class="dashboard-header">
              <h1>Tableau de Bord</h1>
              <p>Bienvenue {$currentAdminUser?.name || 'Administrateur'}</p>
            </div>

            <!-- System Stats Grid -->
            {#if $systemStats}
              <div class="stats-grid">
                <SystemStatsCard 
                  title="Utilisateurs"
                  value={$systemStats.totalUsers}
                  subtitle="{$systemStats.activeUsers} actifs"
                  icon="👥"
                  trend="+5.2%"
                />
                
                <SystemStatsCard 
                  title="Cours"
                  value={$systemStats.totalCourses}
                  subtitle="Contenu éducatif"
                  icon="📚"
                  trend="+2.1%"
                />
                
                <SystemStatsCard 
                  title="Chiffre d'affaires"
                  value="€{$systemStats.totalRevenue.toLocaleString()}"
                  subtitle="Revenus générés"
                  icon="💰"
                  trend="+8.7%"
                />
                
                <SystemStatsCard 
                  title="Taux d'activité"
                  value="{Math.round(($systemStats.activeUsers / $systemStats.totalUsers) * 100)}%"
                  subtitle="Utilisateurs actifs"
                  icon="🎯"
                  trend="+1.3%"
                />
              </div>

              <!-- Server Health -->
              <div class="health-section">
                <h2>État du Système</h2>
                <div class="health-grid">
                  <div class="health-item">
                    <span class="health-label">CPU</span>
                    <div class="health-bar">
                      <div 
                        class="health-fill" 
                        style="width: {$systemStats.systemLoad}%; background-color: {formatSystemHealth($systemStats.systemLoad).color}"
                      ></div>
                    </div>
                    <span class="health-value">{$systemStats.systemLoad.toFixed(1)}%</span>
                  </div>
                  
                  <div class="health-item">
                    <span class="health-label">Mémoire</span>
                    <div class="health-bar">
                      <div 
                        class="health-fill" 
                        style="width: {$systemStats.memoryUsage}%; background-color: {formatSystemHealth($systemStats.memoryUsage).color}"
                      ></div>
                    </div>
                    <span class="health-value">{$systemStats.memoryUsage.toFixed(1)}%</span>
                  </div>
                  
                  <div class="health-item">
                    <span class="health-label">Disque</span>
                    <div class="health-bar">
                      <div 
                        class="health-fill" 
                        style="width: {$systemStats.diskUsage}%; background-color: {formatSystemHealth($systemStats.diskUsage).color}"
                      ></div>
                    </div>
                    <span class="health-value">{$systemStats.diskUsage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            {/if}

          {:else if currentView === 'users' && canManageUsers}
            <!-- User Management -->
            <div class="section-header">
              <h1>Gestion des Utilisateurs</h1>
              <button class="btn-primary" on:click={() => {/* TODO: Open create user modal */}}>
                + Nouvel Utilisateur
              </button>
            </div>
            
            <UserManagementTable 
              users={$adminUsers}
              currentUser={$currentAdminUser}
              on:edit={(e) => {/* TODO: Edit user */}}
              on:delete={(e) => {/* TODO: Delete user */}}
              on:toggle-active={(e) => {/* TODO: Toggle user active state */}}
            />

          {:else if currentView === 'content' && canManageContent}
            <!-- Content Management -->
            <div class="section-header">
              <h1>Gestion du Contenu</h1>
              <button class="btn-primary">+ Nouveau Contenu</button>
            </div>
            
            <div class="placeholder-content">
              <p>Interface de gestion du contenu à implémenter (Phase 11.2)</p>
            </div>

          {:else if currentView === 'analytics' && canViewAnalytics}
            <!-- Analytics Dashboard -->
            <div class="section-header">
              <h1>Analyses et Statistiques</h1>
            </div>
            
            <div class="placeholder-content">
              <p>Dashboard analytique avancé à implémenter (Phase 11.3)</p>
            </div>

          {:else if currentView === 'settings' && canManageSystem}
            <!-- System Settings -->
            <div class="section-header">
              <h1>Paramètres Système</h1>
            </div>
            
            <div class="placeholder-content">
              <p>Interface de configuration système à implémenter (Phase 11.6)</p>
            </div>

          {:else}
            <!-- Unauthorized View -->
            <div class="unauthorized-view">
              <h2>Accès Refusé</h2>
              <p>Vous n'avez pas les permissions pour accéder à cette section.</p>
              <button on:click={() => navigateTo('dashboard')} class="btn-secondary">
                Retour au tableau de bord
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </main>
  </div>
</div>

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: #f8fafc;
    transition: all 0.3s ease;
  }

  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 280px;
    transition: margin-left 0.3s ease;
  }

  .sidebar-closed .admin-main {
    margin-left: 60px;
  }

  .admin-content {
    flex: 1;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    gap: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .unauthorized-container,
  .unauthorized-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    text-align: center;
    gap: 1rem;
  }

  .error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .error-content {
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 0.5rem;
  }

  .error-icon {
    font-size: 1.2rem;
  }

  .error-message {
    flex: 1;
    color: #dc2626;
    font-weight: 500;
  }

  .error-close {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
  }

  .error-close:hover {
    background: #fee2e2;
  }

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .dashboard-header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .dashboard-header p {
    color: #6b7280;
    font-size: 1.1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .section-header h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .health-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .health-section h2 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .health-grid {
    display: grid;
    gap: 1rem;
  }

  .health-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .health-label {
    width: 80px;
    font-weight: 500;
    color: #374151;
  }

  .health-bar {
    flex: 1;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .health-fill {
    height: 100%;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .health-value {
    width: 60px;
    text-align: right;
    font-weight: 600;
    color: #374151;
  }

  .placeholder-content {
    background: white;
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .placeholder-content p {
    color: #6b7280;
    font-size: 1.1rem;
  }

  .btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .admin-main {
      margin-left: 0;
    }

    .sidebar-closed .admin-main {
      margin-left: 0;
    }

    .admin-content {
      padding: 1rem;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Accessibilité */
  @media (prefers-reduced-motion: reduce) {
    .admin-main,
    .health-fill,
    .btn-primary,
    .btn-secondary {
      transition: none;
    }

    .loading-spinner {
      animation: none;
    }
  }

  /* Mode sombre */
  @media (prefers-color-scheme: dark) {
    .admin-layout {
      background: #111827;
    }

    .health-section,
    .placeholder-content {
      background: #1f2937;
    }

    .dashboard-header h1,
    .section-header h1,
    .health-section h2 {
      color: #f9fafb;
    }

    .dashboard-header p,
    .placeholder-content p {
      color: #d1d5db;
    }

    .health-label,
    .health-value {
      color: #e5e7eb;
    }
  }
</style>
