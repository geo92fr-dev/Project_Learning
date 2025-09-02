<!--
  👥 User Management Table - Phase 11.1
  Table avancée de gestion des utilisateurs admin
  Conformité DOC_CoPilot_Practices : Sécurité + UX + Performance
-->

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { AdminUser } from '$lib/admin/adminStore';

  // Props
  export let users: AdminUser[] = [];
  export let currentUser: AdminUser | null = null;
  export let loading = false;
  export let pageSize = 10;

  // Dispatcher
  const dispatch = createEventDispatcher<{
    edit: { user: AdminUser };
    delete: { userId: string };
    'toggle-active': { userId: string; active: boolean };
    'change-role': { userId: string; role: string };
    'view-profile': { userId: string };
    'create-user': {};
  }>();

  // État local
  let currentPage = 1;
  let sortBy: keyof AdminUser = 'name';
  let sortDirection: 'asc' | 'desc' = 'asc';
  let searchQuery = '';
  let selectedUsers: Set<string> = new Set();
  let filterRole = 'all';
  let filterStatus = 'all';

  // Rôles disponibles
  const availableRoles = [
    { value: 'super_admin', label: 'Super Administrateur', color: 'red' },
    { value: 'admin', label: 'Administrateur', color: 'blue' },
    { value: 'instructor', label: 'Instructeur', color: 'green' },
    { value: 'moderator', label: 'Modérateur', color: 'yellow' },
    { value: 'viewer', label: 'Lecteur', color: 'gray' }
  ];

  // Dérivés réactifs
  $: filteredUsers = filterAndSortUsers(users, searchQuery, filterRole, filterStatus, sortBy, sortDirection);
  $: paginatedUsers = paginateUsers(filteredUsers, currentPage, pageSize);
  $: totalPages = Math.ceil(filteredUsers.length / pageSize);
  $: canModifyUsers = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  $: allSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.has(u.id));
  $: someSelected = paginatedUsers.some(u => selectedUsers.has(u.id));

  // Filtrage et tri
  function filterAndSortUsers(
    userList: AdminUser[],
    query: string,
    roleFilter: string,
    statusFilter: string,
    sortField: keyof AdminUser,
    direction: 'asc' | 'desc'
  ): AdminUser[] {
    let filtered = [...userList];

    // Recherche textuelle
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.role.toLowerCase().includes(lowerQuery)
      );
    }

    // Filtre par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtre par statut
    if (statusFilter === 'active') {
      filtered = filtered.filter(user => user.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(user => !user.isActive);
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Traitement spécial pour les dates
      if (aVal instanceof Date && bVal instanceof Date) {
        aVal = aVal.getTime();
        bVal = bVal.getTime();
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        // Tentative de conversion en date si c'est une chaîne de date
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          aVal = aDate.getTime();
          bVal = bDate.getTime();
        } else {
          // Traitement spécial pour les chaînes
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
      }

      // Protection contre les valeurs null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }

  // Pagination
  function paginateUsers(userList: AdminUser[], page: number, size: number): AdminUser[] {
    const start = (page - 1) * size;
    const end = start + size;
    return userList.slice(start, end);
  }

  // Actions de tri
  function handleSort(field: keyof AdminUser) {
    if (sortBy === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = field;
      sortDirection = 'asc';
    }
    currentPage = 1; // Reset à la première page
  }

  // Sélection
  function toggleUserSelection(userId: string) {
    if (selectedUsers.has(userId)) {
      selectedUsers.delete(userId);
    } else {
      selectedUsers.add(userId);
    }
    selectedUsers = new Set(selectedUsers); // Trigger reactivity
  }

  function toggleAllSelection() {
    if (allSelected) {
      paginatedUsers.forEach(user => selectedUsers.delete(user.id));
    } else {
      paginatedUsers.forEach(user => selectedUsers.add(user.id));
    }
    selectedUsers = new Set(selectedUsers);
  }

  // Actions utilisateur
  function handleEdit(user: AdminUser) {
    if (!canModifyUsers) return;
    dispatch('edit', { user });
  }

  function handleDelete(user: AdminUser) {
    if (!canModifyUsers || user.id === currentUser?.id) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?`)) {
      dispatch('delete', { userId: user.id });
    }
  }

  function handleToggleActive(user: AdminUser) {
    if (!canModifyUsers || user.id === currentUser?.id) return;
    
    dispatch('toggle-active', { 
      userId: user.id, 
      active: !user.isActive 
    });
  }

  function handleRoleChange(user: AdminUser, newRole: string) {
    if (!canModifyUsers || user.id === currentUser?.id) return;
    
    const roleLabel = availableRoles.find(r => r.value === newRole)?.label || newRole;
    if (confirm(`Changer le rôle de "${user.name}" vers "${roleLabel}" ?`)) {
      dispatch('change-role', { 
        userId: user.id, 
        role: newRole 
      });
    }
  }

  function handleViewProfile(user: AdminUser) {
    dispatch('view-profile', { userId: user.id });
  }

  // Pagination
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  // Actions en lot
  function handleBulkAction(action: string) {
    if (selectedUsers.size === 0) return;

    const selectedUsersList = paginatedUsers.filter(u => selectedUsers.has(u.id));
    
    switch (action) {
      case 'delete':
        if (confirm(`Supprimer ${selectedUsers.size} utilisateur${selectedUsers.size > 1 ? 's' : ''} sélectionné${selectedUsers.size > 1 ? 's' : ''} ?`)) {
          selectedUsersList.forEach(user => {
            if (user.id !== currentUser?.id) {
              dispatch('delete', { userId: user.id });
            }
          });
          selectedUsers.clear();
          selectedUsers = new Set(selectedUsers);
        }
        break;
      case 'activate':
        selectedUsersList.forEach(user => {
          if (user.id !== currentUser?.id) {
            dispatch('toggle-active', { userId: user.id, active: true });
          }
        });
        selectedUsers.clear();
        selectedUsers = new Set(selectedUsers);
        break;
      case 'deactivate':
        selectedUsersList.forEach(user => {
          if (user.id !== currentUser?.id) {
            dispatch('toggle-active', { userId: user.id, active: false });
          }
        });
        selectedUsers.clear();
        selectedUsers = new Set(selectedUsers);
        break;
    }
  }

  // Formatage
  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function formatRole(role: string): { label: string; color: string } {
    const roleData = availableRoles.find(r => r.value === role);
    return {
      label: roleData?.label || role,
      color: roleData?.color || 'gray'
    };
  }

  function getPermissionsSummary(permissions: AdminUser['permissions']): string {
    if (!permissions) return 'Aucune';
    
    const resourceCount = Object.keys(permissions).length;
    const totalActions = Object.values(permissions).reduce((sum: number, actions) => {
      if (Array.isArray(actions)) {
        return sum + actions.length;
      }
      return sum;
    }, 0);
    
    return `${resourceCount} ressource${resourceCount > 1 ? 's' : ''}, ${totalActions} action${totalActions > 1 ? 's' : ''}`;
  }

  // Reset search/filters
  function resetFilters() {
    searchQuery = '';
    filterRole = 'all';
    filterStatus = 'all';
    currentPage = 1;
    selectedUsers.clear();
    selectedUsers = new Set(selectedUsers);
  }
</script>

<div class="user-management-table">
  <!-- En-tête avec contrôles -->
  <div class="table-header">
    <div class="header-left">
      <h2>Gestion des Utilisateurs</h2>
      <p class="subtitle">{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} 
        {filteredUsers.length !== users.length ? `(filtré${filteredUsers.length > 1 ? 's' : ''} sur ${users.length})` : ''}
      </p>
    </div>
    
    <div class="header-actions">
      <button class="btn-secondary" on:click={resetFilters}>
        🔄 Réinitialiser
      </button>
      
      {#if canModifyUsers}
        <button class="btn-primary" on:click={() => dispatch('create-user', {})}>
          + Nouvel Utilisateur
        </button>
      {/if}
    </div>
  </div>

  <!-- Contrôles de recherche et filtres -->
  <div class="table-controls">
    <div class="search-section">
      <div class="search-input">
        <span class="search-icon">🔍</span>
        <input 
          type="text"
          placeholder="Rechercher par nom, email ou rôle..."
          bind:value={searchQuery}
          aria-label="Rechercher des utilisateurs"
        />
        {#if searchQuery}
          <button 
            class="clear-search"
            on:click={() => searchQuery = ''}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        {/if}
      </div>
    </div>

    <div class="filters-section">
      <select 
        bind:value={filterRole}
        aria-label="Filtrer par rôle"
        class="filter-select"
      >
        <option value="all">Tous les rôles</option>
        {#each availableRoles as role}
          <option value={role.value}>{role.label}</option>
        {/each}
      </select>

      <select 
        bind:value={filterStatus}
        aria-label="Filtrer par statut"
        class="filter-select"
      >
        <option value="all">Tous les statuts</option>
        <option value="active">Actifs uniquement</option>
        <option value="inactive">Inactifs uniquement</option>
      </select>
    </div>
  </div>

  <!-- Actions en lot -->
  {#if selectedUsers.size > 0 && canModifyUsers}
    <div class="bulk-actions">
      <div class="selection-info">
        <span>{selectedUsers.size} utilisateur{selectedUsers.size > 1 ? 's' : ''} sélectionné{selectedUsers.size > 1 ? 's' : ''}</span>
        <button 
          class="clear-selection"
          on:click={() => { selectedUsers.clear(); selectedUsers = new Set(selectedUsers); }}
        >
          Désélectionner tout
        </button>
      </div>
      
      <div class="bulk-buttons">
        <button 
          class="bulk-btn activate"
          on:click={() => handleBulkAction('activate')}
        >
          ✅ Activer
        </button>
        <button 
          class="bulk-btn deactivate"
          on:click={() => handleBulkAction('deactivate')}
        >
          ⏸️ Désactiver
        </button>
        <button 
          class="bulk-btn delete"
          on:click={() => handleBulkAction('delete')}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  {/if}

  <!-- Table -->
  <div class="table-container">
    {#if loading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    {:else if paginatedUsers.length === 0}
      <div class="empty-state">
        <span class="empty-icon">👤</span>
        <h3>Aucun utilisateur trouvé</h3>
        <p>
          {#if searchQuery || filterRole !== 'all' || filterStatus !== 'all'}
            Essayez de modifier vos critères de recherche.
          {:else}
            Aucun utilisateur n'est encore configuré.
          {/if}
        </p>
        {#if canModifyUsers}
          <button class="btn-primary" on:click={() => dispatch('create-user', {})}>
            Ajouter le premier utilisateur
          </button>
        {/if}
      </div>
    {:else}
      <table class="users-table">
        <thead>
          <tr>
            {#if canModifyUsers}
              <th class="checkbox-col">
                <input 
                  type="checkbox"
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  on:change={toggleAllSelection}
                  aria-label="Sélectionner tous les utilisateurs"
                />
              </th>
            {/if}
            
            <th 
              class="sortable"
              class:sorted={sortBy === 'name'}
              class:desc={sortBy === 'name' && sortDirection === 'desc'}
              on:click={() => handleSort('name')}
              role="columnheader"
              tabindex="0"
              aria-sort={sortBy === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Utilisateur
              <span class="sort-indicator" aria-hidden="true">
                {sortBy === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </th>
            
            <th 
              class="sortable"
              class:sorted={sortBy === 'role'}
              class:desc={sortBy === 'role' && sortDirection === 'desc'}
              on:click={() => handleSort('role')}
              role="columnheader"
              tabindex="0"
              aria-sort={sortBy === 'role' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Rôle
              <span class="sort-indicator" aria-hidden="true">
                {sortBy === 'role' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </th>
            
            <th>Permissions</th>
            
            <th 
              class="sortable"
              class:sorted={sortBy === 'lastLogin'}
              class:desc={sortBy === 'lastLogin' && sortDirection === 'desc'}
              on:click={() => handleSort('lastLogin')}
              role="columnheader"
              tabindex="0"
              aria-sort={sortBy === 'lastLogin' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Dernière connexion
              <span class="sort-indicator" aria-hidden="true">
                {sortBy === 'lastLogin' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </th>
            
            <th 
              class="sortable"
              class:sorted={sortBy === 'isActive'}
              class:desc={sortBy === 'isActive' && sortDirection === 'desc'}
              on:click={() => handleSort('isActive')}
              role="columnheader"
              tabindex="0"
              aria-sort={sortBy === 'isActive' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Statut
              <span class="sort-indicator" aria-hidden="true">
                {sortBy === 'isActive' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </th>
            
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {#each paginatedUsers as user (user.id)}
            {@const roleInfo = formatRole(user.role)}
            <tr 
              class="user-row"
              class:selected={selectedUsers.has(user.id)}
              class:current-user={user.id === currentUser?.id}
              class:inactive={!user.isActive}
            >
              {#if canModifyUsers}
                <td class="checkbox-col">
                  <input 
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    on:change={() => toggleUserSelection(user.id)}
                    disabled={user.id === currentUser?.id}
                    aria-label="Sélectionner {user.name}"
                  />
                </td>
              {/if}
              
              <td class="user-info">
                <div class="user-avatar">
                  <span class="avatar-text">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div class="user-details">
                  <div class="user-name">
                    {user.name}
                    {#if user.id === currentUser?.id}
                      <span class="current-badge" title="C'est vous">Vous</span>
                    {/if}
                  </div>
                  <div class="user-email">{user.email}</div>
                </div>
              </td>
              
              <td class="role-col">
                {#if canModifyUsers && user.id !== currentUser?.id}
                  <select 
                    class="role-select role-{roleInfo.color}"
                    value={user.role}
                    on:change={(e) => handleRoleChange(user, e.currentTarget.value)}
                    aria-label="Changer le rôle de {user.name}"
                  >
                    {#each availableRoles as role}
                      <option value={role.value}>{role.label}</option>
                    {/each}
                  </select>
                {:else}
                  <span class="role-badge role-{roleInfo.color}">
                    {roleInfo.label}
                  </span>
                {/if}
              </td>
              
              <td class="permissions-col">
                <span class="permissions-summary" title={JSON.stringify(user.permissions, null, 2)}>
                  {getPermissionsSummary(user.permissions)}
                </span>
              </td>
              
              <td class="last-login-col">
                {#if user.lastLogin}
                  <time datetime={user.lastLogin}>
                    {formatDate(new Date(user.lastLogin))}
                  </time>
                {:else}
                  <span class="no-login">Jamais connecté</span>
                {/if}
              </td>
              
              <td class="status-col">
                <button 
                  class="status-toggle"
                  class:active={user.isActive}
                  disabled={!canModifyUsers || user.id === currentUser?.id}
                  on:click={() => handleToggleActive(user)}
                  aria-label="Basculer le statut de {user.name}"
                  title={user.isActive ? 'Désactiver' : 'Activer'}
                >
                  <span class="status-indicator"></span>
                  <span class="status-text">
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </button>
              </td>
              
              <td class="actions-col">
                <div class="action-buttons">
                  <button 
                    class="action-btn view"
                    on:click={() => handleViewProfile(user)}
                    aria-label="Voir le profil de {user.name}"
                    title="Voir le profil"
                  >
                    👁️
                  </button>
                  
                  {#if canModifyUsers}
                    <button 
                      class="action-btn edit"
                      on:click={() => handleEdit(user)}
                      aria-label="Modifier {user.name}"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    
                    <button 
                      class="action-btn delete"
                      disabled={user.id === currentUser?.id}
                      on:click={() => handleDelete(user)}
                      aria-label="Supprimer {user.name}"
                      title={user.id === currentUser?.id ? 'Impossible de se supprimer soi-même' : 'Supprimer'}
                    >
                      🗑️
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="pagination">
      <div class="pagination-info">
        Page {currentPage} sur {totalPages} 
        ({filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''})
      </div>
      
      <div class="pagination-controls">
        <button 
          class="page-btn"
          disabled={currentPage === 1}
          on:click={() => goToPage(1)}
          aria-label="Première page"
        >
          ⏮️
        </button>
        
        <button 
          class="page-btn"
          disabled={currentPage === 1}
          on:click={() => goToPage(currentPage - 1)}
          aria-label="Page précédente"
        >
          ◀️
        </button>
        
        {#each Array.from({length: Math.min(5, totalPages)}, (_, i) => {
          const start = Math.max(1, currentPage - 2);
          const end = Math.min(totalPages, start + 4);
          return start + i;
        }).filter(p => p <= totalPages) as page}
          <button 
            class="page-btn"
            class:active={page === currentPage}
            on:click={() => goToPage(page)}
            aria-label="Page {page}"
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        {/each}
        
        <button 
          class="page-btn"
          disabled={currentPage === totalPages}
          on:click={() => goToPage(currentPage + 1)}
          aria-label="Page suivante"
        >
          ▶️
        </button>
        
        <button 
          class="page-btn"
          disabled={currentPage === totalPages}
          on:click={() => goToPage(totalPages)}
          aria-label="Dernière page"
        >
          ⏭️
        </button>
      </div>
    </div>
  {/if}
</div>

<!-- Styles dans le fichier suivant pour éviter la limite de longueur -->
<style>
  /* Styles sera dans la partie suivante */
  @import './UserManagementTable.css';
</style>
