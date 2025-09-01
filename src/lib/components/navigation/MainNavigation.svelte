<!--
  🧭 MainNavigation Component - Phase 8.A Navigation System
  Navigation principale selon DOC_CoPilot_Practices
-->
<script>
  export let darkMode = false;
  export let currentRoute = '/';
  
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';

  // État de la navigation
  let isCoursOpen = false;
  let isExercicesOpen = false;
  let activeMathLevel = '';
  let activeFrancaisLevel = '';

  // Structure de navigation
  const navigationStructure = {
    accueil: { label: 'Accueil', path: '/', icon: '🏠' },
    cours: {
      label: 'Cours',
      icon: '📚',
      submenu: {
        mathematiques: {
          label: 'Mathématiques',
          icon: '🔢',
          levels: {
            cp: { label: 'CP', path: '/cours/mathematiques/cp' },
            ce1: { label: 'CE1', path: '/cours/mathematiques/ce1' },
            ce2: { label: 'CE2', path: '/cours/mathematiques/ce2' },
            cm1: { label: 'CM1', path: '/cours/mathematiques/cm1' },
            cm2: { label: 'CM2', path: '/cours/mathematiques/cm2' }
          }
        },
        francais: {
          label: 'Français',
          icon: '📝',
          levels: {
            cp: { label: 'CP', path: '/cours/francais/cp' },
            ce1: { label: 'CE1', path: '/cours/francais/ce1' },
            ce2: { label: 'CE2', path: '/cours/francais/ce2' },
            cm1: { label: 'CM1', path: '/cours/francais/cm1' },
            cm2: { label: 'CM2', path: '/cours/francais/cm2' }
          }
        },
        sciences: {
          label: 'Sciences',
          icon: '🔬',
          levels: {
            cp: { label: 'CP', path: '/cours/sciences/cp' },
            ce1: { label: 'CE1', path: '/cours/sciences/ce1' },
            ce2: { label: 'CE2', path: '/cours/sciences/ce2' },
            cm1: { label: 'CM1', path: '/cours/sciences/cm1' },
            cm2: { label: 'CM2', path: '/cours/sciences/cm2' }
          }
        }
      }
    },
    exercices: { label: 'Exercices', path: '/exercices', icon: '✏️' },
    progres: { label: 'Progrès', path: '/progres', icon: '📊' },
    profil: { label: 'Profil', path: '/profil', icon: '👤' }
  };

  // Gestion des clics de navigation
  function handleNavClick(path) {
    if (path) {
      goto(path);
    }
  }

  function toggleCours() {
    isCoursOpen = !isCoursOpen;
    isExercicesOpen = false; // Fermer les autres menus
  }

  function toggleMathematiques() {
    activeMathLevel = activeMathLevel ? '' : 'active';
    activeFrancaisLevel = ''; // Fermer l'autre matière
  }

  function toggleFrancais() {
    activeFrancaisLevel = activeFrancaisLevel ? '' : 'active';
    activeMathLevel = ''; // Fermer l'autre matière
  }

  // Déterminer l'état actif selon la route
  $: isCurrentRoute = (path) => currentRoute === path || ($page?.url?.pathname === path);
  $: isCurrentSection = (section) => currentRoute.startsWith(`/${section}`) || ($page?.url?.pathname?.startsWith(`/${section}`));

  onMount(() => {
    // Mise à jour de la route courante
    if ($page?.url?.pathname) {
      currentRoute = $page.url.pathname;
    }
  });
</script>

<nav class="main-navigation" class:dark={darkMode}>
  <div class="nav-container">
    <!-- Logo/Branding -->
    <div class="nav-brand">
      <Button 
        variant="ghost" 
        on:click={() => handleNavClick('/')}
        class="brand-button"
      >
        🎓 FunLearning
      </Button>
    </div>

    <!-- Navigation principale -->
    <ul class="nav-menu">
      <!-- Accueil -->
      <li class="nav-item">
        <Button
          variant="ghost"
          class="nav-button {isCurrentRoute('/') ? 'active' : ''}"
          on:click={() => handleNavClick('/')}
        >
          {navigationStructure.accueil.icon} {navigationStructure.accueil.label}
        </Button>
      </li>

      <!-- Cours avec sous-menus -->
      <li class="nav-item nav-item--dropdown">
        <Button
          variant="ghost"
          class="nav-button {isCurrentSection('cours') ? 'active' : ''}"
          on:click={toggleCours}
        >
          {navigationStructure.cours.icon} {navigationStructure.cours.label}
          <span class="dropdown-arrow {isCoursOpen ? 'open' : ''}">▼</span>
        </Button>

        {#if isCoursOpen}
          <ul class="nav-submenu">
            <!-- Mathématiques -->
            <li class="nav-subitem">
              <Button
                variant="ghost"
                size="sm"
                class="nav-subbutton {isCurrentSection('cours/mathematiques') ? 'active' : ''}"
                on:click={toggleMathematiques}
              >
                {navigationStructure.cours.submenu.mathematiques.icon} 
                {navigationStructure.cours.submenu.mathematiques.label}
                <span class="dropdown-arrow {activeMathLevel ? 'open' : ''}">▼</span>
              </Button>

              {#if activeMathLevel}
                <ul class="nav-subsubmenu">
                  {#each Object.entries(navigationStructure.cours.submenu.mathematiques.levels) as [key, level]}
                    <li>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="nav-sublevel {isCurrentRoute(level.path) ? 'active' : ''}"
                        on:click={() => handleNavClick(level.path)}
                      >
                        {level.label}
                      </Button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>

            <!-- Français -->
            <li class="nav-subitem">
              <Button
                variant="ghost"
                size="sm"
                class="nav-subbutton {isCurrentSection('cours/francais') ? 'active' : ''}"
                on:click={toggleFrancais}
              >
                {navigationStructure.cours.submenu.francais.icon} 
                {navigationStructure.cours.submenu.francais.label}
                <span class="dropdown-arrow {activeFrancaisLevel ? 'open' : ''}">▼</span>
              </Button>

              {#if activeFrancaisLevel}
                <ul class="nav-subsubmenu">
                  {#each Object.entries(navigationStructure.cours.submenu.francais.levels) as [key, level]}
                    <li>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="nav-sublevel {isCurrentRoute(level.path) ? 'active' : ''}"
                        on:click={() => handleNavClick(level.path)}
                      >
                        {level.label}
                      </Button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>

            <!-- Sciences -->
            <li class="nav-subitem">
              <Button
                variant="ghost"
                size="sm"
                class="nav-subbutton {isCurrentSection('cours/sciences') ? 'active' : ''}"
                on:click={() => handleNavClick('/cours/sciences')}
              >
                {navigationStructure.cours.submenu.sciences.icon} 
                {navigationStructure.cours.submenu.sciences.label}
              </Button>
            </li>
          </ul>
        {/if}
      </li>

      <!-- Exercices -->
      <li class="nav-item">
        <Button
          variant="ghost"
          class="nav-button {isCurrentSection('exercices') ? 'active' : ''}"
          on:click={() => handleNavClick('/exercices')}
        >
          {navigationStructure.exercices.icon} {navigationStructure.exercices.label}
        </Button>
      </li>

      <!-- Progrès -->
      <li class="nav-item">
        <Button
          variant="ghost"
          class="nav-button {isCurrentSection('progres') ? 'active' : ''}"
          on:click={() => handleNavClick('/progres')}
        >
          {navigationStructure.progres.icon} {navigationStructure.progres.label}
        </Button>
      </li>

      <!-- Profil -->
      <li class="nav-item">
        <Button
          variant="ghost"
          class="nav-button {isCurrentSection('profil') ? 'active' : ''}"
          on:click={() => handleNavClick('/profil')}
        >
          {navigationStructure.profil.icon} {navigationStructure.profil.label}
        </Button>
      </li>
    </ul>
  </div>
</nav>

<style>
  /* ===== CONTAINER ===== */
  .main-navigation {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    position: sticky;
    top: 0;
    z-index: 40;
    transition: all 0.2s ease;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 64px;
  }

  /* ===== BRAND ===== */
  .nav-brand {
    flex-shrink: 0;
  }

  .nav-brand :global(.brand-button) {
    font-size: 1.25rem;
    font-weight: 700;
    color: #3b82f6;
  }

  /* ===== MENU PRINCIPAL ===== */
  .nav-menu {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.5rem;
  }

  .nav-item {
    position: relative;
  }

  .nav-item :global(.nav-button) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }

  .nav-item :global(.nav-button.active) {
    background-color: #dbeafe;
    color: #1d4ed8;
  }

  .nav-item :global(.nav-button:hover) {
    background-color: #f3f4f6;
  }

  /* ===== DROPDOWNS ===== */
  .nav-item--dropdown {
    position: relative;
  }

  .dropdown-arrow {
    margin-left: 0.5rem;
    transition: transform 0.2s ease;
    font-size: 0.75rem;
  }

  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  /* ===== SOUS-MENUS ===== */
  .nav-submenu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    min-width: 200px;
    padding: 0.5rem;
    list-style: none;
    margin: 0;
    z-index: 50;
  }

  .nav-subitem {
    position: relative;
  }

  .nav-subitem :global(.nav-subbutton) {
    width: 100%;
    justify-content: space-between;
    text-align: left;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }

  .nav-subitem :global(.nav-subbutton.active) {
    background-color: #dbeafe;
    color: #1d4ed8;
  }

  /* ===== SOUS-SOUS-MENUS ===== */
  .nav-subsubmenu {
    position: absolute;
    top: 0;
    left: 100%;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    min-width: 120px;
    padding: 0.25rem;
    list-style: none;
    margin: 0;
    z-index: 60;
  }

  .nav-subsubmenu li {
    margin: 0;
  }

  .nav-subsubmenu :global(.nav-sublevel) {
    width: 100%;
    text-align: left;
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .nav-subsubmenu :global(.nav-sublevel.active) {
    background-color: #dbeafe;
    color: #1d4ed8;
  }

  /* ===== MODE SOMBRE ===== */
  .main-navigation.dark {
    background: #1f2937;
    border-bottom-color: #374151;
  }

  .main-navigation.dark .nav-brand :global(.brand-button) {
    color: #60a5fa;
  }

  .main-navigation.dark .nav-item :global(.nav-button:hover) {
    background-color: #374151;
  }

  .main-navigation.dark .nav-item :global(.nav-button.active) {
    background-color: #1e40af;
    color: #bfdbfe;
  }

  .main-navigation.dark .nav-submenu,
  .main-navigation.dark .nav-subsubmenu {
    background: #1f2937;
    border-color: #374151;
  }

  .main-navigation.dark .nav-subitem :global(.nav-subbutton.active),
  .main-navigation.dark .nav-subsubmenu :global(.nav-sublevel.active) {
    background-color: #1e40af;
    color: #bfdbfe;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .nav-menu {
      gap: 0.25rem;
    }

    .nav-item :global(.nav-button) {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .nav-submenu {
      min-width: 180px;
    }
  }
</style>
