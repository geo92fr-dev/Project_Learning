<!--
  📱 MobileNavigation Component - Phase 8.A Navigation System
  Navigation mobile avec menu hamburger selon DOC_CoPilot_Practices
-->
<script>
  export let isOpen = false;
  export let currentRoute = '/';

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade, slide } from 'svelte/transition';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';

  // Structure de navigation mobile
  const mobileNavStructure = [
    { label: 'Accueil', path: '/', icon: '🏠' },
    { 
      label: 'Cours', 
      icon: '📚',
      submenu: [
        { label: 'Mathématiques', path: '/cours/mathematiques', icon: '🔢' },
        { label: 'Français', path: '/cours/francais', icon: '📝' },
        { label: 'Sciences', path: '/cours/sciences', icon: '🔬' }
      ]
    },
    { label: 'Exercices', path: '/exercices', icon: '✏️' },
    { label: 'Progrès', path: '/progres', icon: '📊' },
    { label: 'Profil', path: '/profil', icon: '👤' }
  ];

  let expandedSection = null;

  // Gestion des clics
  function toggleMenu() {
    isOpen = !isOpen;
    if (!isOpen) {
      expandedSection = null; // Fermer tous les sous-menus
    }
  }

  function handleNavClick(path) {
    if (path) {
      goto(path);
      isOpen = false; // Fermer le menu après navigation
      expandedSection = null;
    }
  }

  function toggleSection(label) {
    expandedSection = expandedSection === label ? null : label;
  }

  // Fermer le menu quand on clique à l'extérieur
  function handleOutsideClick(event) {
    const menu = event.target.closest('.mobile-navigation');
    if (!menu && isOpen) {
      isOpen = false;
      expandedSection = null;
    }
  }

  // Gestion des touches clavier
  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      isOpen = false;
      expandedSection = null;
    }
  }

  // Déterminer si une route est active
  $: isActiveRoute = (path) => currentRoute === path || ($page?.url?.pathname === path);
  $: isActiveSection = (section) => currentRoute.startsWith(`/${section.toLowerCase()}`) || 
                                   ($page?.url?.pathname?.startsWith(`/${section.toLowerCase()}`));

  onMount(() => {
    // Mise à jour de la route courante
    if ($page?.url?.pathname) {
      currentRoute = $page.url.pathname;
    }

    // Ajouter les event listeners
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  // Empêcher le scroll du body quand le menu est ouvert
  $: if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
</script>

<div class="mobile-navigation">
  <!-- Bouton Hamburger -->
  <Button
    variant="ghost"
    size="md"
    class="hamburger-button {isOpen ? 'open' : ''}"
    on:click={toggleMenu}
    aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
    aria-expanded={isOpen}
  >
    <div class="hamburger-icon">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </div>
    <span class="sr-only">Menu</span>
  </Button>

  <!-- Overlay -->
  {#if isOpen}
    <div 
      class="mobile-overlay" 
      transition:fade={{ duration: 200 }}
      on:click={toggleMenu}
      on:keydown={(e) => { if (e.key === 'Escape') toggleMenu(); }}
      role="button"
      tabindex="0"
      aria-label="Fermer le menu"
    ></div>
  {/if}

  <!-- Menu mobile -->
  {#if isOpen}
    <nav 
      class="mobile-menu" 
      transition:slide={{ duration: 300, axis: 'x' }}
      aria-label="Navigation mobile"
    >
      <!-- Header du menu -->
      <div class="mobile-menu-header">
        <div class="mobile-brand">
          <span class="brand-icon">🎓</span>
          <span class="brand-text">FunLearning</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          on:click={toggleMenu}
          aria-label="Fermer le menu"
        >
          ✕
        </Button>
      </div>

      <!-- Navigation items -->
      <ul class="mobile-menu-list">
        {#each mobileNavStructure as item}
          <li class="mobile-menu-item">
            {#if item.submenu}
              <!-- Item avec sous-menu -->
              <Button
                variant="ghost"
                class="mobile-nav-button {isActiveSection(item.label) ? 'active' : ''}"
                on:click={() => toggleSection(item.label)}
                fullWidth
              >
                <div class="nav-content">
                  <span class="nav-icon">{item.icon}</span>
                  <span class="nav-label">{item.label}</span>
                  <span class="expand-icon {expandedSection === item.label ? 'expanded' : ''}">
                    ▼
                  </span>
                </div>
              </Button>

              <!-- Sous-menu -->
              {#if expandedSection === item.label}
                <ul class="mobile-submenu" transition:slide={{ duration: 200 }}>
                  {#each item.submenu as subitem}
                    <li class="mobile-submenu-item">
                      <Button
                        variant="ghost"
                        size="sm"
                        class="mobile-subnav-button {isActiveRoute(subitem.path) ? 'active' : ''}"
                        on:click={() => handleNavClick(subitem.path)}
                        fullWidth
                      >
                        <div class="subnav-content">
                          <span class="subnav-icon">{subitem.icon}</span>
                          <span class="subnav-label">{subitem.label}</span>
                        </div>
                      </Button>
                    </li>
                  {/each}
                </ul>
              {/if}
            {:else}
              <!-- Item simple -->
              <Button
                variant="ghost"
                class="mobile-nav-button {isActiveRoute(item.path) ? 'active' : ''}"
                on:click={() => handleNavClick(item.path)}
                fullWidth
              >
                <div class="nav-content">
                  <span class="nav-icon">{item.icon}</span>
                  <span class="nav-label">{item.label}</span>
                </div>
              </Button>
            {/if}
          </li>
        {/each}
      </ul>

      <!-- Footer du menu -->
      <div class="mobile-menu-footer">
        <div class="footer-info">
          <Badge variant="primary" size="sm">Version 1.0</Badge>
          <span class="footer-text">Phase 8.A Navigation</span>
        </div>
      </div>
    </nav>
  {/if}
</div>

<style>
  /* ===== BOUTON HAMBURGER ===== */
  .mobile-navigation :global(.hamburger-button) {
    position: relative;
    padding: 0.5rem;
    border-radius: 0.375rem;
  }

  .hamburger-icon {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 20px;
    height: 16px;
  }

  .hamburger-line {
    width: 100%;
    height: 2px;
    background-color: currentColor;
    border-radius: 1px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  /* Animation hamburger -> X */
  .mobile-navigation :global(.hamburger-button.open .hamburger-line:nth-child(1)) {
    transform: translateY(5px) rotate(45deg);
  }

  .mobile-navigation :global(.hamburger-button.open .hamburger-line:nth-child(2)) {
    opacity: 0;
  }

  .mobile-navigation :global(.hamburger-button.open .hamburger-line:nth-child(3)) {
    transform: translateY(-5px) rotate(-45deg);
  }

  /* ===== OVERLAY ===== */
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }

  /* ===== MENU MOBILE ===== */
  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: white;
    border-right: 1px solid #e5e7eb;
    box-shadow: 4px 0 6px -1px rgb(0 0 0 / 0.1);
    z-index: 50;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  /* ===== HEADER MENU ===== */
  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .brand-icon {
    font-size: 1.5rem;
  }

  .brand-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #3b82f6;
  }

  /* ===== LISTE NAVIGATION ===== */
  .mobile-menu-list {
    flex: 1;
    padding: 1rem 0;
    list-style: none;
    margin: 0;
  }

  .mobile-menu-item {
    margin: 0;
  }

  .mobile-navigation :global(.mobile-nav-button) {
    padding: 0.75rem 1rem;
    text-align: left;
    border-radius: 0;
    border: none;
    background: transparent;
  }

  .mobile-navigation :global(.mobile-nav-button:hover) {
    background-color: #f3f4f6;
  }

  .mobile-navigation :global(.mobile-nav-button.active) {
    background-color: #eff6ff;
    color: #1d4ed8;
  }

  .nav-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .nav-icon {
    font-size: 1.25rem;
    width: 1.5rem;
    text-align: center;
  }

  .nav-label {
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
  }

  .expand-icon {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  .expand-icon.expanded {
    transform: rotate(180deg);
  }

  /* ===== SOUS-MENU ===== */
  .mobile-submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }

  .mobile-submenu-item {
    margin: 0;
  }

  .mobile-navigation :global(.mobile-subnav-button) {
    padding: 0.5rem 1rem 0.5rem 3rem;
    text-align: left;
    border-radius: 0;
    background: transparent;
  }

  .mobile-navigation :global(.mobile-subnav-button:hover) {
    background-color: #e5e7eb;
  }

  .mobile-navigation :global(.mobile-subnav-button.active) {
    background-color: #dbeafe;
    color: #1d4ed8;
  }

  .subnav-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .subnav-icon {
    font-size: 1rem;
    width: 1.25rem;
    text-align: center;
  }

  .subnav-label {
    font-size: 0.875rem;
    font-weight: 400;
  }

  /* ===== FOOTER MENU ===== */
  .mobile-menu-footer {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .footer-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .footer-text {
    font-size: 0.75rem;
    color: #6b7280;
  }

  /* ===== SCREEN READER ===== */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ===== MODE SOMBRE ===== */
  :global(.dark) .mobile-menu {
    background: #1f2937;
    border-right-color: #374151;
  }

  :global(.dark) .mobile-menu-header,
  :global(.dark) .mobile-menu-footer {
    background: #111827;
    border-color: #374151;
  }

  :global(.dark) .brand-text {
    color: #60a5fa;
  }

  :global(.dark) .mobile-navigation :global(.mobile-nav-button:hover) {
    background-color: #374151;
  }

  :global(.dark) .mobile-navigation :global(.mobile-nav-button.active) {
    background-color: #1e40af;
    color: #bfdbfe;
  }

  :global(.dark) .mobile-submenu {
    background: #111827;
    border-top-color: #374151;
  }

  :global(.dark) .mobile-navigation :global(.mobile-subnav-button:hover) {
    background-color: #374151;
  }

  :global(.dark) .mobile-navigation :global(.mobile-subnav-button.active) {
    background-color: #1e40af;
    color: #bfdbfe;
  }

  :global(.dark) .footer-text {
    color: #9ca3af;
  }
</style>
