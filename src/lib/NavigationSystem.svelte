<!-- Phase 7.B - Navigation System Component -->
<!-- Advanced routing with user experience optimization -->

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fade, slide, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  // Props
  export let currentRoute = '/';
  export let userProgress = { level: 'beginner', completedCourses: [] };
  export let breadcrumbs = [];
  export let transitionEnabled = true;
  export let persistentState = true;
  export let expandedSections = [];
  export let keyboardNavigationEnabled = true;
  export let progressiveEnhancement = true;
  export let fallbackNavigation = false;
  export let enhancedNavigation = true;

  // State
  let isNavigating = false;
  let currentFocusIndex = 0;
  let navigationContainer;
  let navigationItems = [];
  let isTransitionActive = false;

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Navigation structure adaptée au niveau utilisateur
  $: adaptiveNavigation = generateAdaptiveNavigation(userProgress);
  $: isAdvancedUser = userProgress.level === 'advanced' || userProgress.completedCourses.length > 5;

  // Navigation items configuration
  const baseNavigationItems = [
    { 
      id: 'dashboard', 
      label: 'Tableau de bord', 
      path: '/dashboard', 
      icon: '📊',
      requiredLevel: 'beginner'
    },
    { 
      id: 'courses', 
      label: 'Cours', 
      path: '/courses', 
      icon: '📚',
      requiredLevel: 'beginner',
      hasSubMenu: true,
      subItems: [
        { id: 'js-basics', label: 'JavaScript Basics', path: '/course/js-basics' },
        { id: 'advanced-js', label: 'JavaScript Avancé', path: '/course/advanced-js' },
        { id: 'react-intro', label: 'React Introduction', path: '/course/react-intro' }
      ]
    },
    { 
      id: 'app-interface', 
      label: 'Interface Dynamique', 
      path: '/app-interface', 
      icon: '🎛️',
      requiredLevel: 'intermediate'
    },
    { 
      id: 'profile', 
      label: 'Profil', 
      path: '/profile', 
      icon: '👤',
      requiredLevel: 'beginner'
    },
    { 
      id: 'settings', 
      label: 'Paramètres', 
      path: '/settings', 
      icon: '⚙️',
      requiredLevel: 'beginner'
    }
  ];

  // Advanced navigation items pour utilisateurs expérimentés
  const advancedNavigationItems = [
    { 
      id: 'advanced-projects', 
      label: 'Projets Avancés', 
      path: '/advanced-projects', 
      icon: '🚀',
      requiredLevel: 'advanced'
    },
    { 
      id: 'mentorship', 
      label: 'Mentorat', 
      path: '/mentorship', 
      icon: '🎓',
      requiredLevel: 'advanced'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      path: '/analytics', 
      icon: '📈',
      requiredLevel: 'expert'
    }
  ];

  function generateAdaptiveNavigation(progress) {
    const userLevel = progress.level || 'beginner';
    const completedCount = progress.completedCourses?.length || 0;
    
    let availableItems = baseNavigationItems.filter(item => {
      const levelHierarchy = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
      const userLevelValue = levelHierarchy[userLevel] || 0;
      const requiredLevelValue = levelHierarchy[item.requiredLevel] || 0;
      
      return userLevelValue >= requiredLevelValue;
    });

    // Ajouter les items avancés si l'utilisateur est qualifié
    if (userLevel === 'advanced' || completedCount > 5) {
      availableItems = [...availableItems, ...advancedNavigationItems.filter(item => {
        const levelHierarchy = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
        const userLevelValue = levelHierarchy[userLevel] || 0;
        const requiredLevelValue = levelHierarchy[item.requiredLevel] || 0;
        
        return userLevelValue >= requiredLevelValue;
      })];
    }

    return availableItems;
  }

  async function handleNavigation(path, options = {}) {
    if (!enhancedNavigation) {
      // Fallback pour navigation standard
      window.location.href = path;
      return;
    }

    isNavigating = true;
    
    try {
      // Animation de transition
      if (transitionEnabled) {
        isTransitionActive = true;
      }

      dispatch('navigationStart', { path, from: currentRoute });

      await goto(path, {
        replaceState: options.replace || false,
        keepFocus: options.keepFocus !== false,
        noScroll: options.noScroll || false
      });

      dispatch('navigationComplete', { path, from: currentRoute });
      
    } catch (error) {
      console.error('Navigation error:', error);
      dispatch('navigationError', { error, path });
    } finally {
      isNavigating = false;
      
      if (transitionEnabled) {
        setTimeout(() => {
          isTransitionActive = false;
        }, 300);
      }
    }
  }

  function handleKeyboardNavigation(event) {
    if (!keyboardNavigationEnabled) return;

    const { key } = event;
    
    if (key === 'Tab') {
      // Géré naturellement par le navigateur
      return;
    }
    
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      const activeElement = document.activeElement;
      const path = activeElement.getAttribute('data-path');
      
      if (path) {
        handleNavigation(path);
      }
    }
    
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      navigateWithArrows(key === 'ArrowDown' ? 1 : -1);
    }
  }

  function navigateWithArrows(direction) {
    const focusableElements = navigationContainer.querySelectorAll('[data-focusable="true"]');
    currentFocusIndex = Math.max(0, Math.min(focusableElements.length - 1, currentFocusIndex + direction));
    
    if (focusableElements[currentFocusIndex]) {
      focusableElements[currentFocusIndex].focus();
    }
  }

  function toggleSection(sectionId) {
    if (persistentState) {
      if (expandedSections.includes(sectionId)) {
        expandedSections = expandedSections.filter(id => id !== sectionId);
      } else {
        expandedSections = [...expandedSections, sectionId];
      }
    }
  }

  function isCurrentRoute(path) {
    return currentRoute === path || currentRoute.startsWith(path + '/');
  }

  function isSectionExpanded(sectionId) {
    return expandedSections.includes(sectionId);
  }

  onMount(() => {
    // Configuration des éléments de navigation
    navigationItems = Array.from(navigationContainer.querySelectorAll('[data-focusable="true"]'));
    
    // Event listeners pour l'accessibilité
    if (keyboardNavigationEnabled) {
      navigationContainer.addEventListener('keydown', handleKeyboardNavigation);
    }

    return () => {
      if (navigationContainer) {
        navigationContainer.removeEventListener('keydown', handleKeyboardNavigation);
      }
    };
  });
</script>

<!-- Navigation Container -->
<nav 
  class="navigation-system"
  class:enhanced={enhancedNavigation}
  class:fallback={fallbackNavigation}
  class:transition-active={isTransitionActive}
  data-testid="navigation-container"
  bind:this={navigationContainer}
  aria-label="Navigation principale"
>
  <!-- Breadcrumb Navigation -->
  {#if breadcrumbs.length > 0}
    <ol class="breadcrumb" role="list">
      {#each breadcrumbs as crumb, index}
        <li class="breadcrumb-item" role="listitem">
          {#if index < breadcrumbs.length - 1}
            <a 
              href={progressiveEnhancement ? crumb.path : '#'}
              on:click|preventDefault={() => handleNavigation(crumb.path)}
              data-focusable="true"
              data-path={crumb.path}
            >
              {crumb.label}
            </a>
            <span class="breadcrumb-separator" aria-hidden="true">→</span>
          {:else}
            <span class="breadcrumb-current" aria-current="page">{crumb.label}</span>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}

  <!-- Main Navigation -->
  <div class="nav-content">
    <!-- Loading indicator -->
    {#if isNavigating}
      <div class="navigation-loading" transition:fade={{ duration: 200 }}>
        <div class="loading-spinner"></div>
        <span>Navigation en cours...</span>
      </div>
    {/if}

    <!-- Primary Navigation -->
    <ul class="nav-primary" role="menubar">
      {#each adaptiveNavigation as item}
        <li 
          class="nav-item"
          class:active={isCurrentRoute(item.path)}
          role="none"
        >
          {#if item.hasSubMenu}
            <!-- Navigation item with submenu -->
            <div class="nav-item-with-submenu">
              <button
                class="nav-link nav-toggle"
                class:expanded={isSectionExpanded(item.id)}
                on:click={() => toggleSection(item.id)}
                data-focusable="true"
                data-testid="nav-section-{item.id}"
                role="menuitem"
                aria-expanded={isSectionExpanded(item.id)}
                aria-haspopup="true"
              >
                <span class="nav-icon" aria-hidden="true">{item.icon}</span>
                <span class="nav-label">{item.label}</span>
                <span class="nav-arrow" aria-hidden="true">
                  {isSectionExpanded(item.id) ? '▼' : '▶'}
                </span>
              </button>

              {#if isSectionExpanded(item.id)}
                <ul 
                  class="nav-submenu" 
                  role="menu"
                  transition:slide={{ duration: 300, easing: cubicOut }}
                >
                  {#each item.subItems as subItem}
                    <li role="none">
                      <a
                        href={progressiveEnhancement ? subItem.path : '#'}
                        class="nav-sublink"
                        class:active={isCurrentRoute(subItem.path)}
                        on:click|preventDefault={() => handleNavigation(subItem.path)}
                        data-focusable="true"
                        data-path={subItem.path}
                        data-testid="course-link-{subItem.id}"
                        role="menuitem"
                      >
                        {subItem.label}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {:else}
            <!-- Simple navigation item -->
            <a
              href={progressiveEnhancement ? item.path : '#'}
              class="nav-link"
              class:active={isCurrentRoute(item.path)}
              on:click|preventDefault={() => handleNavigation(item.path, { keepFocus: true })}
              data-focusable="true"
              data-path={item.path}
              data-testid="nav-link-{item.id}"
              role="menuitem"
            >
              <span class="nav-icon" aria-hidden="true">{item.icon}</span>
              <span class="nav-label">{item.label}</span>
            </a>
          {/if}
        </li>
      {/each}
    </ul>

    <!-- Advanced Navigation Section -->
    {#if isAdvancedUser}
      <div 
        class="nav-advanced" 
        data-testid="advanced-navigation"
        transition:fly={{ y: 20, duration: 400 }}
      >
        <h3 class="nav-section-title">Navigation Avancée</h3>
        <ul class="nav-advanced-list" role="menubar">
          {#each advancedNavigationItems as item}
            <li class="nav-advanced-item" role="none">
              <a
                href={progressiveEnhancement ? item.path : '#'}
                class="nav-advanced-link"
                class:active={isCurrentRoute(item.path)}
                on:click|preventDefault={() => handleNavigation(item.path)}
                data-focusable="true"
                data-path={item.path}
                data-testid="enhanced-nav-link"
                role="menuitem"
              >
                <span class="nav-icon" aria-hidden="true">{item.icon}</span>
                <span class="nav-label">{item.label}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</nav>

<style>
  .navigation-system {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--nav-bg, #f8f9fa);
    border-right: 1px solid var(--nav-border, #e9ecef);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .navigation-system.enhanced {
    --nav-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .navigation-system.fallback {
    --nav-bg: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .navigation-system.transition-active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    animation: shimmer 0.6s ease-in-out;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* Breadcrumb Styles */
  .breadcrumb {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 1rem;
    background: var(--breadcrumb-bg, rgba(255,255,255,0.1));
    border-bottom: 1px solid var(--nav-border, #e9ecef);
    flex-wrap: wrap;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
  }

  .breadcrumb-item a {
    color: var(--breadcrumb-link, #6c757d);
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .breadcrumb-item a:hover,
  .breadcrumb-item a:focus {
    background: var(--breadcrumb-hover, rgba(255,255,255,0.2));
    color: var(--breadcrumb-link-hover, #495057);
  }

  .breadcrumb-separator {
    margin: 0 0.5rem;
    color: var(--breadcrumb-separator, #6c757d);
  }

  .breadcrumb-current {
    font-weight: 600;
    color: var(--breadcrumb-current, #212529);
  }

  /* Navigation Content */
  .nav-content {
    flex: 1;
    padding: 1rem 0;
    position: relative;
  }

  .navigation-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: var(--loading-bg, rgba(255,255,255,0.9));
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 2;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--spinner-bg, #e9ecef);
    border-top: 2px solid var(--spinner-color, #007bff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Primary Navigation */
  .nav-primary {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    margin-bottom: 0.25rem;
  }

  .nav-link,
  .nav-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: var(--nav-link-color, #495057);
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 0 25px 25px 0;
    margin-right: 1rem;
    font-size: 0.9rem;
  }

  .nav-link:hover,
  .nav-link:focus,
  .nav-toggle:hover,
  .nav-toggle:focus {
    background: var(--nav-link-hover, rgba(255,255,255,0.2));
    color: var(--nav-link-hover-color, #212529);
    transform: translateX(4px);
  }

  .nav-link.active,
  .nav-toggle.expanded {
    background: var(--nav-link-active, rgba(255,255,255,0.3));
    color: var(--nav-link-active-color, #212529);
    font-weight: 600;
  }

  .nav-icon {
    font-size: 1.2rem;
    min-width: 1.5rem;
    text-align: center;
  }

  .nav-label {
    flex: 1;
  }

  .nav-arrow {
    font-size: 0.8rem;
    transition: transform 0.2s ease;
  }

  .nav-toggle.expanded .nav-arrow {
    transform: rotate(90deg);
  }

  /* Submenu */
  .nav-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--submenu-bg, rgba(0,0,0,0.1));
    border-radius: 0 15px 15px 0;
    margin-right: 1rem;
    overflow: hidden;
  }

  .nav-sublink {
    display: block;
    padding: 0.5rem 1rem 0.5rem 3rem;
    color: var(--nav-sublink-color, #6c757d);
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 0.85rem;
  }

  .nav-sublink:hover,
  .nav-sublink:focus {
    background: var(--nav-sublink-hover, rgba(255,255,255,0.2));
    color: var(--nav-sublink-hover-color, #495057);
  }

  .nav-sublink.active {
    background: var(--nav-sublink-active, rgba(255,255,255,0.3));
    color: var(--nav-sublink-active-color, #212529);
    font-weight: 500;
  }

  /* Advanced Navigation */
  .nav-advanced {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--nav-border, rgba(255,255,255,0.2));
  }

  .nav-section-title {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--nav-section-title, #6c757d);
    margin: 0 0 0.5rem 1rem;
  }

  .nav-advanced-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-advanced-item {
    margin-bottom: 0.25rem;
  }

  .nav-advanced-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    color: var(--nav-advanced-link, #6c757d);
    text-decoration: none;
    transition: all 0.2s ease;
    border-radius: 0 20px 20px 0;
    margin-right: 1rem;
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .nav-advanced-link:hover,
  .nav-advanced-link:focus {
    background: var(--nav-advanced-hover, rgba(255,255,255,0.15));
    color: var(--nav-advanced-hover-color, #495057);
    opacity: 1;
    transform: translateX(4px);
  }

  .nav-advanced-link.active {
    background: var(--nav-advanced-active, rgba(255,255,255,0.25));
    color: var(--nav-advanced-active-color, #212529);
    font-weight: 500;
    opacity: 1;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .navigation-system {
      min-height: auto;
      border-right: none;
      border-bottom: 1px solid var(--nav-border, #e9ecef);
    }

    .breadcrumb {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .nav-content {
      padding: 0.5rem 0;
    }

    .nav-link,
    .nav-toggle {
      padding: 0.6rem 0.8rem;
      font-size: 0.85rem;
    }

    .nav-advanced {
      margin-top: 1rem;
      padding-top: 0.5rem;
    }
  }

  /* Focus Management */
  .nav-link:focus,
  .nav-toggle:focus,
  .nav-sublink:focus,
  .nav-advanced-link:focus {
    outline: 2px solid var(--focus-color, #007bff);
    outline-offset: 2px;
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .navigation-system {
      border-right: 2px solid;
    }
    
    .nav-link,
    .nav-toggle,
    .nav-sublink,
    .nav-advanced-link {
      border: 1px solid transparent;
    }
    
    .nav-link:focus,
    .nav-toggle:focus,
    .nav-sublink:focus,
    .nav-advanced-link:focus {
      border-color: currentColor;
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .navigation-system,
    .nav-link,
    .nav-toggle,
    .nav-sublink,
    .nav-advanced-link,
    .nav-arrow {
      transition: none;
    }
    
    .navigation-system.transition-active::before {
      animation: none;
    }
  }
</style>
