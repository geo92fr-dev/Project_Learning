/**
 * Svelte Component for User Profile Display
 * Phase 5B: Frontend Integration - UI Components
 * 
 * @description Composant Svelte pour afficher et modifier le profil utilisateur
 * @follows MyDevFramework CoPilot Best Practices
 */

<script lang="ts">
  import { userProfileStore, authInfoStore, updateUserProfile } from '$lib/firebase/stores/firebase-stores';
  import type { UserProfile } from '$lib/firebase/collections';
  import { validateURL } from '$lib/firebase/utils';
  
  // Props
  export let editable = false;
  export let showPreferences = true;
  
  // State
  let editMode = false;
  let editForm: Partial<UserProfile> = {};
  let saving = false;
  let error = '';
  
  // Reactive statements
  $: profile = $userProfileStore;
  $: authInfo = $authInfoStore;
  $: isPhotoURLSafe = profile?.photoURL ? validateURL(profile.photoURL, { 
    allowedProtocols: ['https:'], 
    allowedDomains: ['lh3.googleusercontent.com', 'graph.facebook.com', 'avatars.githubusercontent.com'] 
  }).isValid : false;
  
  // Functions
  async function toggleEditMode() {
    if (editMode && profile) {
      // Save changes
      await saveChanges();
    } else {
      // Enter edit mode
      editForm = {
        displayName: profile?.displayName || '',
        preferences: profile?.preferences ? { ...profile.preferences } : { 
          language: 'fr',
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            marketing: false
          },
          accessibility: {
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false
          }
        }
      };
      editMode = true;
    }
  }
  
  async function saveChanges() {
    if (!profile?.id || !editForm) return;
    
    saving = true;
    error = '';
    
    try {
      const result = await updateUserProfile(profile.id, editForm);
      
      if (result.success) {
        editMode = false;
        editForm = {};
      } else {
        error = result.error || 'Erreur lors de la sauvegarde';
      }
    } catch (err) {
      error = 'Erreur inattendue lors de la sauvegarde';
      console.error('Erreur sauvegarde profil:', err);
    } finally {
      saving = false;
    }
  }
  
  function cancelEdit() {
    editMode = false;
    editForm = {};
    error = '';
  }
</script>

<div class="user-profile" data-testid="user-profile">
  {#if profile}
    <div class="profile-header">
      <div class="avatar">
        {#if profile.photoURL && isPhotoURLSafe}
          <img src={profile.photoURL} alt="" />
        {:else}
          <div class="avatar-placeholder">
            {profile.displayName?.charAt(0).toUpperCase() || '?'}
          </div>
        {/if}
      </div>
      
      <div class="profile-info">
        {#if editMode}
          <input 
            bind:value={editForm.displayName}
            placeholder="Nom d'affichage"
            class="edit-input"
            data-testid="display-name-input"
          />
        {:else}
          <h2 data-testid="display-name">{profile.displayName}</h2>
        {/if}
        
        <p class="email" data-testid="email">{profile.email}</p>
        <span class="role" data-testid="role">{profile.role}</span>
      </div>
      
      {#if editable}
        <div class="actions">
          {#if editMode}
            <button 
              on:click={saveChanges} 
              disabled={saving}
              class="btn btn-primary"
              data-testid="save-button"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button 
              on:click={cancelEdit}
              class="btn btn-secondary"
              data-testid="cancel-button"
            >
              Annuler
            </button>
          {:else}
            <button 
              on:click={toggleEditMode}
              class="btn btn-outline"
              data-testid="edit-button"
            >
              Modifier
            </button>
          {/if}
        </div>
      {/if}
    </div>
    
    {#if error}
      <div class="error" data-testid="error-message">
        {error}
      </div>
    {/if}
    
    {#if showPreferences && profile.preferences}
      <div class="preferences-section">
        <h3>Préférences</h3>
        
        <div class="preference-group">
          <label for="theme-select">Thème</label>
          {#if editMode && editForm.preferences}
            <select 
              id="theme-select"
              bind:value={editForm.preferences.theme}
              data-testid="theme-select"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="auto">Automatique</option>
            </select>
          {:else}
            <span data-testid="theme-display">{profile.preferences.theme}</span>
          {/if}
        </div>
        
        <div class="preference-group">
          <label for="language-select">Langue</label>
          {#if editMode && editForm.preferences}
            <select 
              id="language-select"
              bind:value={editForm.preferences.language}
              data-testid="language-select"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          {:else}
            <span data-testid="language-display">{profile.preferences.language}</span>
          {/if}
        </div>
      </div>
    {/if}
    
    <!-- Progress tracking section -->
    <div class="progress-section">
      <h3>Progression</h3>
      <div class="stats-grid">
        <div class="stat-item" data-testid="total-time">
          <span class="stat-label">Temps total</span>
          <span class="stat-value">{profile.progressTracking.totalTimeSpent} min</span>
        </div>
        <div class="stat-item" data-testid="courses-completed">
          <span class="stat-label">Cours terminés</span>
          <span class="stat-value">{profile.progressTracking.coursesCompleted}</span>
        </div>
        <div class="stat-item" data-testid="current-streak">
          <span class="stat-label">Série actuelle</span>
          <span class="stat-value">{profile.progressTracking.currentStreak} jours</span>
        </div>
      </div>
    </div>
  {:else}
    <div class="loading" data-testid="loading">
      Chargement du profil...
    </div>
  {/if}
</div>

<style>
  .user-profile {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: var(--surface-color, white);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--primary-color, #007bff);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    color: white;
    font-size: 2rem;
    font-weight: bold;
  }
  
  .profile-info {
    flex: 1;
  }
  
  .profile-info h2 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary, #333);
  }
  
  .email {
    color: var(--text-secondary, #666);
    margin: 0 0 0.5rem 0;
  }
  
  .role {
    background: var(--primary-color-light, #e3f2fd);
    color: var(--primary-color, #007bff);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    text-transform: capitalize;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }
  
  .btn-primary {
    background: var(--primary-color, #007bff);
    color: white;
  }
  
  .btn-secondary {
    background: var(--secondary-color, #6c757d);
    color: white;
  }
  
  .btn-outline {
    background: transparent;
    color: var(--primary-color, #007bff);
    border: 1px solid var(--primary-color, #007bff);
  }
  
  .btn:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .edit-input {
    padding: 0.5rem;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 4px;
    font-size: 1.25rem;
    font-weight: bold;
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .error {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    border: 1px solid #fcc;
  }
  
  .preferences-section, .progress-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color, #eee);
  }
  
  .preferences-section h3, .progress-section h3 {
    margin: 0 0 1rem 0;
    color: var(--text-primary, #333);
  }
  
  .preference-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .preference-group label {
    min-width: 80px;
    font-weight: 500;
  }
  
  .preference-group select {
    padding: 0.5rem;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 4px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .stat-item {
    text-align: center;
    padding: 1rem;
    background: var(--background-light, #f8f9fa);
    border-radius: 8px;
  }
  
  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color, #007bff);
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary, #666);
  }
  
  @media (max-width: 768px) {
    .user-profile {
      padding: 1rem;
    }
    
    .profile-header {
      flex-direction: column;
      text-align: center;
    }
    
    .actions {
      flex-direction: row;
      justify-content: center;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
