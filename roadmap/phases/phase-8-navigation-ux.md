# 🧭 Phase 8 : Navigation UX (3 jours) - v1.6

## 📋 **Vue d'Ensemble**

**Objectif** : Navigation intelligente et contextuelle avec UX optimisée pour l'apprentissage  
**Version cible** : v1.6 (navigation adaptative)  
**Groupe** : 🎨 UX/UI - Interface & Navigation  
**Prérequis** : Phase 7 (Dynamic Interface) validée ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### 🧭 **Architecture de Navigation Intelligente**

**Patterns de Navigation :**

- **Contextual Navigation** : Adaptation selon phase d'apprentissage
- **Progressive Navigation** : Révélation progressive des options
- **Predictive Navigation** : Suggestions basées sur comportement
- **Breadcrumb Intelligence** : Chemin d'apprentissage visualisé
- **Quick Actions** : Raccourcis contextuels intelligents

**Structure Hiérarchique :**

- **Dashboard** → **Curriculum** → **Module** → **Lesson** → **Exercise**
- **Lateral Navigation** : Contenu connexe et recommandations
- **Vertical Navigation** : Progression séquentielle optimisée
- **Modal Navigation** : Tâches focalisées sans interruption
- **Gesture Navigation** : Support tactile et raccourcis clavier

### 🎨 **UX Patterns Éducatifs**

**Learning-Centered Design :**

- **Cognitive Load Reduction** : Information hiérarchisée et contextuelle
- **Flow State Maintenance** : Minimisation des interruptions
- **Progress Visualization** : Feedback visuel de progression
- **Error Recovery** : Navigation corrective intelligente
- **Accessibility First** : Navigation inclusive et universelle

**Micro-Interactions :**

- **Hover States** : Prévisualisation de contenu
- **Loading States** : Feedback immédiat et informatif
- **Transition States** : Continuité visuelle fluide
- **Success States** : Célébration des accomplissements
- **Error States** : Guidance constructive et rassurante

### 🔬 **Approche Qualité & Analytics**

**Métriques UX Navigation :**

- **Task Success Rate** : Taux de réussite des tâches > 90%
- **Time to Find Information** : < 3 clics pour contenu principal
- **Navigation Abandonment** : < 5% abandon en navigation
- **User Flow Efficiency** : Optimisation parcours critiques
- **Accessibility Score** : Navigation 100% accessible

---

## 📚 **Références Modulaires**

### **[REF]** Navigation Patterns : **[navigation-patterns.md](../references/ux/navigation-patterns.md)**

- ✅ Patterns adaptatifs selon contexte d'apprentissage
- ✅ Système de breadcrumbs intelligent
- ✅ Quick actions et raccourcis contextuels
- ✅ Navigation gesture et keyboard

### **[REF]** UX Analytics : **[ux-analytics.md](../references/ux/ux-analytics.md)**

- ✅ Tracking comportement navigation
- ✅ Heatmaps et user flows
- ✅ A/B testing navigation patterns
- ✅ Optimisation continue UX

---

## 📝 **Instructions d'Implémentation**

### 🧭 **Étape 8.1 : Navigation Context Manager**

**[FILE]** Créer `src/lib/navigation/navigationContext.ts` :

```ts
import { writable, derived, readable } from "svelte/store";
import { page } from "$app/stores";
import type { UserProfile } from "$lib/firebase/collections";

// ===== TYPES DE NAVIGATION =====
export interface NavigationContext {
  currentPath: string;
  breadcrumbs: Breadcrumb[];
  availableActions: NavigationAction[];
  recommendations: NavigationRecommendation[];
  userProgress: ProgressContext;
  accessibility: AccessibilityContext;
}

export interface Breadcrumb {
  id: string;
  label: string;
  href: string;
  type: "dashboard" | "course" | "module" | "lesson" | "exercise";
  isActive: boolean;
  progress?: number; // 0-1
  metadata?: {
    difficulty: string;
    estimatedTime: number;
    completionDate?: string;
  };
}

export interface NavigationAction {
  id: string;
  label: string;
  icon: string;
  action: () => void | string;
  shortcut?: string;
  context: "primary" | "secondary" | "contextual";
  visibility: "always" | "hover" | "focus" | "conditional";
  condition?: () => boolean;
}

export interface NavigationRecommendation {
  id: string;
  type: "next_lesson" | "review" | "similar_content" | "help";
  title: string;
  description: string;
  href: string;
  priority: number; // 1-10
  reasoning: string;
  estimatedTime?: number;
}

export interface ProgressContext {
  currentModule: string;
  currentLesson: string;
  overallProgress: number;
  moduleProgress: number;
  lessonProgress: number;
  nextRecommended: string;
  completedToday: number;
  streak: number;
}

export interface AccessibilityContext {
  screenReader: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  keyboardOnly: boolean;
  fontSize: "small" | "medium" | "large";
}

// ===== NAVIGATION STORE =====
class NavigationContextManager {
  private context = writable<NavigationContext>({
    currentPath: "/",
    breadcrumbs: [],
    availableActions: [],
    recommendations: [],
    userProgress: {
      currentModule: "",
      currentLesson: "",
      overallProgress: 0,
      moduleProgress: 0,
      lessonProgress: 0,
      nextRecommended: "",
      completedToday: 0,
      streak: 0,
    },
    accessibility: {
      screenReader: false,
      reducedMotion: false,
      highContrast: false,
      keyboardOnly: false,
      fontSize: "medium",
    },
  });

  public readonly state = readable(this.context);

  /**
   * Met à jour le contexte de navigation
   */
  updateContext(updates: Partial<NavigationContext>): void {
    this.context.update((current) => ({
      ...current,
      ...updates,
    }));
  }

  /**
   * Génère les breadcrumbs intelligents
   */
  async generateBreadcrumbs(
    currentPath: string,
    userProfile: UserProfile
  ): Promise<Breadcrumb[]> {
    const pathSegments = currentPath.split("/").filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];

    // Breadcrumb racine
    breadcrumbs.push({
      id: "dashboard",
      label: "Tableau de bord",
      href: "/dashboard",
      type: "dashboard",
      isActive: pathSegments.length === 1 && pathSegments[0] === "dashboard",
    });

    // Construire breadcrumbs hiérarchiques
    let currentHref = "";
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentHref += `/${segment}`;

      const breadcrumb = await this.createBreadcrumbFromSegment(
        segment,
        currentHref,
        i === pathSegments.length - 1,
        userProfile
      );

      if (breadcrumb) {
        breadcrumbs.push(breadcrumb);
      }
    }

    return breadcrumbs;
  }

  /**
   * Génère les actions disponibles selon le contexte
   */
  generateActions(context: NavigationContext): NavigationAction[] {
    const actions: NavigationAction[] = [];

    // Actions universelles
    actions.push(
      {
        id: "search",
        label: "Rechercher",
        icon: "search",
        action: () => this.openSearch(),
        shortcut: "Ctrl+K",
        context: "primary",
        visibility: "always",
      },
      {
        id: "help",
        label: "Aide",
        icon: "help-circle",
        action: () => this.openHelp(),
        shortcut: "F1",
        context: "secondary",
        visibility: "always",
      }
    );

    // Actions contextuelles selon la page
    const pathType = this.getPathType(context.currentPath);

    switch (pathType) {
      case "lesson":
        actions.push(
          {
            id: "prev_lesson",
            label: "Leçon précédente",
            icon: "arrow-left",
            action: () => this.navigateToPreviousLesson(),
            shortcut: "ArrowLeft",
            context: "contextual",
            visibility: "always",
            condition: () => this.hasPreviousLesson(),
          },
          {
            id: "next_lesson",
            label: "Leçon suivante",
            icon: "arrow-right",
            action: () => this.navigateToNextLesson(),
            shortcut: "ArrowRight",
            context: "primary",
            visibility: "always",
            condition: () => this.hasNextLesson(),
          },
          {
            id: "bookmark",
            label: "Marquer",
            icon: "bookmark",
            action: () => this.toggleBookmark(),
            shortcut: "B",
            context: "secondary",
            visibility: "hover",
          }
        );
        break;

      case "exercise":
        actions.push(
          {
            id: "hint",
            label: "Indice",
            icon: "lightbulb",
            action: () => this.showHint(),
            shortcut: "H",
            context: "secondary",
            visibility: "always",
          },
          {
            id: "solution",
            label: "Solution",
            icon: "eye",
            action: () => this.showSolution(),
            shortcut: "S",
            context: "contextual",
            visibility: "conditional",
            condition: () => this.canShowSolution(),
          }
        );
        break;
    }

    return actions.filter((action) => !action.condition || action.condition());
  }

  /**
   * Génère des recommandations intelligentes
   */
  async generateRecommendations(
    context: NavigationContext,
    userProfile: UserProfile
  ): Promise<NavigationRecommendation[]> {
    const recommendations: NavigationRecommendation[] = [];

    // Recommandation de progression
    if (context.userProgress.nextRecommended) {
      recommendations.push({
        id: "next_recommended",
        type: "next_lesson",
        title: "Continuer votre apprentissage",
        description: "Leçon recommandée selon votre progression",
        href: `/lesson/${context.userProgress.nextRecommended}`,
        priority: 10,
        reasoning: "Algorithme de progression optimale",
        estimatedTime: 15,
      });
    }

    // Recommandation de révision
    const reviewNeeded = await this.getContentNeedingReview(userProfile);
    if (reviewNeeded.length > 0) {
      recommendations.push({
        id: "review_content",
        type: "review",
        title: "Révision recommandée",
        description: `${reviewNeeded.length} concepts à réviser`,
        href: "/review",
        priority: 8,
        reasoning: "Optimisation de la rétention à long terme",
      });
    }

    // Contenu similaire
    const similarContent = await this.getSimilarContent(context.currentPath);
    if (similarContent.length > 0) {
      recommendations.push({
        id: "similar_content",
        type: "similar_content",
        title: "Contenu connexe",
        description: "Approfondissez avec du contenu similaire",
        href: similarContent[0].href,
        priority: 6,
        reasoning: "Renforcement des concepts liés",
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Détecte les préférences d'accessibilité
   */
  detectAccessibilityPreferences(): AccessibilityContext {
    const mediaQueries = {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      highContrast: window.matchMedia("(prefers-contrast: high)").matches,
      screenReader: this.detectScreenReader(),
    };

    return {
      screenReader: mediaQueries.screenReader,
      reducedMotion: mediaQueries.reducedMotion,
      highContrast: mediaQueries.highContrast,
      keyboardOnly: false, // Détecté dynamiquement
      fontSize: this.detectFontSizePreference(),
    };
  }

  /**
   * Navigation programmatique avec analytics
   */
  async navigateTo(
    href: string,
    options: NavigationOptions = {}
  ): Promise<void> {
    // Analytics de navigation
    this.trackNavigation({
      from: this.getCurrentPath(),
      to: href,
      method: options.method || "programmatic",
      context: options.context,
    });

    // Préchargement si nécessaire
    if (options.preload) {
      await this.preloadRoute(href);
    }

    // Navigation
    if (options.replace) {
      history.replaceState(null, "", href);
    } else {
      history.pushState(null, "", href);
    }

    // Mise à jour contexte
    await this.updateNavigationContext(href);
  }

  // ===== MÉTHODES PRIVÉES =====

  private async createBreadcrumbFromSegment(
    segment: string,
    href: string,
    isActive: boolean,
    userProfile: UserProfile
  ): Promise<Breadcrumb | null> {
    // Résolution du segment vers métadonnées
    const metadata = await this.resolveSegmentMetadata(segment);

    if (!metadata) return null;

    return {
      id: segment,
      label: metadata.title,
      href,
      type: metadata.type as any,
      isActive,
      progress: metadata.progress,
      metadata: {
        difficulty: metadata.difficulty,
        estimatedTime: metadata.estimatedTime,
        completionDate: metadata.completionDate,
      },
    };
  }

  private getPathType(path: string): string {
    if (path.includes("/lesson/")) return "lesson";
    if (path.includes("/exercise/")) return "exercise";
    if (path.includes("/module/")) return "module";
    if (path.includes("/course/")) return "course";
    return "dashboard";
  }

  private detectScreenReader(): boolean {
    // Heuristiques pour détecter un lecteur d'écran
    return Boolean(
      navigator.userAgent.includes("NVDA") ||
        navigator.userAgent.includes("JAWS") ||
        (window as any).speechSynthesis ||
        document.body.classList.contains("screen-reader")
    );
  }

  private detectFontSizePreference(): "small" | "medium" | "large" {
    const fontSize = parseInt(
      getComputedStyle(document.documentElement).fontSize
    );
    if (fontSize >= 20) return "large";
    if (fontSize <= 14) return "small";
    return "medium";
  }

  private trackNavigation(event: NavigationEvent): void {
    // Envoi analytics
    console.log("Navigation tracking:", event);
  }

  private async preloadRoute(href: string): Promise<void> {
    // Préchargement intelligent des ressources
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    document.head.appendChild(link);
  }

  private async updateNavigationContext(path: string): Promise<void> {
    // Mise à jour complète du contexte après navigation
    const context = await this.buildNavigationContext(path);
    this.updateContext(context);
  }
}

// ===== TYPES SUPPLÉMENTAIRES =====
interface NavigationOptions {
  replace?: boolean;
  preload?: boolean;
  method?: "click" | "keyboard" | "programmatic";
  context?: string;
}

interface NavigationEvent {
  from: string;
  to: string;
  method: string;
  context?: string;
  timestamp?: string;
}

// Instance globale
export const navigationManager = new NavigationContextManager();

// Stores dérivés
export const currentBreadcrumbs = derived(
  navigationManager.state,
  ($state) => $state.breadcrumbs
);

export const availableActions = derived(
  navigationManager.state,
  ($state) => $state.availableActions
);

export const navigationRecommendations = derived(
  navigationManager.state,
  ($state) => $state.recommendations
);
```

### 🎨 **Étape 8.2 : Composants de Navigation**

**[FILE]** Créer `src/lib/components/navigation/SmartBreadcrumb.svelte` :

```svelte
<script lang="ts">
  import { slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import type { Breadcrumb } from "$lib/navigation/navigationContext";

  // ===== PROPS =====
  export let breadcrumbs: Breadcrumb[] = [];
  export let maxVisible = 4;
  export let showProgress = true;
  export let compact = false;

  // ===== STATE =====
  let showAll = false;

  // ===== COMPUTED =====
  $: visibleBreadcrumbs = showAll
    ? breadcrumbs
    : breadcrumbs.slice(-maxVisible);
  $: hasOverflow = breadcrumbs.length > maxVisible;
  $: hiddenCount = breadcrumbs.length - maxVisible;

  // ===== METHODS =====
  function toggleShowAll() {
    showAll = !showAll;
  }

  function handleKeyboardNavigation(event: KeyboardEvent, href: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = href;
    }
  }
</script>

<!-- ===== TEMPLATE ===== -->
<nav
  aria-label="Fil d'Ariane"
  class="breadcrumb"
  class:breadcrumb--compact={compact}
>
  <ol class="breadcrumb__list">
    <!-- Overflow indicator -->
    {#if hasOverflow && !showAll}
      <li class="breadcrumb__item breadcrumb__overflow">
        <button
          class="breadcrumb__overflow-btn"
          on:click={toggleShowAll}
          aria-label="Afficher tous les éléments du fil d'Ariane"
          title="Afficher {hiddenCount} éléments cachés"
        >
          <svg class="breadcrumb__icon" aria-hidden="true">
            <use href="#more-horizontal" />
          </svg>
          <span class="breadcrumb__overflow-count">+{hiddenCount}</span>
        </button>

        <span class="breadcrumb__separator" aria-hidden="true">
          <svg class="breadcrumb__separator-icon">
            <use href="#chevron-right" />
          </svg>
        </span>
      </li>
    {/if}

    <!-- Visible breadcrumbs -->
    {#each visibleBreadcrumbs as breadcrumb, index (breadcrumb.id)}
      <li
        class="breadcrumb__item"
        class:breadcrumb__item--active={breadcrumb.isActive}
        transition:slide={{ duration: 200, easing: quintOut }}
      >
        {#if breadcrumb.isActive}
          <!-- Current page -->
          <span class="breadcrumb__current" aria-current="page">
            <span class="breadcrumb__label">{breadcrumb.label}</span>

            {#if showProgress && breadcrumb.progress !== undefined}
              <span class="breadcrumb__progress">
                <span
                  class="breadcrumb__progress-bar"
                  style="width: {breadcrumb.progress * 100}%"
                  aria-label="Progression: {Math.round(
                    breadcrumb.progress * 100
                  )}%"
                />
              </span>
            {/if}
          </span>
        {:else}
          <!-- Clickable breadcrumb -->
          <a
            href={breadcrumb.href}
            class="breadcrumb__link"
            on:keydown={(e) => handleKeyboardNavigation(e, breadcrumb.href)}
          >
            <span class="breadcrumb__label">{breadcrumb.label}</span>

            {#if breadcrumb.metadata}
              <span class="breadcrumb__metadata">
                {#if breadcrumb.metadata.difficulty}
                  <span
                    class="breadcrumb__difficulty breadcrumb__difficulty--{breadcrumb
                      .metadata.difficulty}"
                    title="Difficulté: {breadcrumb.metadata.difficulty}"
                  />
                {/if}

                {#if breadcrumb.metadata.estimatedTime}
                  <span
                    class="breadcrumb__time"
                    title="Temps estimé: {breadcrumb.metadata.estimatedTime}min"
                  >
                    {breadcrumb.metadata.estimatedTime}min
                  </span>
                {/if}

                {#if breadcrumb.metadata.completionDate}
                  <span
                    class="breadcrumb__completed"
                    title="Complété le {new Date(
                      breadcrumb.metadata.completionDate
                    ).toLocaleDateString()}"
                  >
                    <svg class="breadcrumb__completed-icon" aria-hidden="true">
                      <use href="#check-circle" />
                    </svg>
                  </span>
                {/if}
              </span>
            {/if}

            {#if showProgress && breadcrumb.progress !== undefined}
              <span class="breadcrumb__progress">
                <span
                  class="breadcrumb__progress-bar"
                  style="width: {breadcrumb.progress * 100}%"
                  aria-label="Progression: {Math.round(
                    breadcrumb.progress * 100
                  )}%"
                />
              </span>
            {/if}
          </a>

          <!-- Separator -->
          {#if index < visibleBreadcrumbs.length - 1}
            <span class="breadcrumb__separator" aria-hidden="true">
              <svg class="breadcrumb__separator-icon">
                <use href="#chevron-right" />
              </svg>
            </span>
          {/if}
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<!-- ===== STYLES ===== -->
<style>
  .breadcrumb {
    /* Base */
    background: var(--color-surface-card);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-border);
    margin-bottom: var(--space-4);

    /* Responsive */
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .breadcrumb--compact {
    padding: var(--space-2) var(--space-3);
    margin-bottom: var(--space-2);
  }

  .breadcrumb__list {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    list-style: none;
    min-width: fit-content;
  }

  .breadcrumb__item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    white-space: nowrap;

    &--active {
      .breadcrumb__current {
        font-weight: 600;
        color: var(--color-text-primary);
      }
    }
  }

  .breadcrumb__link {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    text-decoration: none;
    color: var(--color-text-secondary);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast) var(--easing-easeOut);

    &:hover {
      background: var(--color-surface-bg);
      color: var(--color-text-primary);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
  }

  .breadcrumb__current {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
  }

  .breadcrumb__label {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-tight);
  }

  .breadcrumb__metadata {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
  }

  .breadcrumb__difficulty {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &--beginner {
      background: var(--color-success);
    }
    &--intermediate {
      background: var(--color-warning);
    }
    &--advanced {
      background: var(--color-error);
    }
  }

  .breadcrumb__time {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .breadcrumb__completed-icon {
    width: 12px;
    height: 12px;
    fill: var(--color-success);
  }

  .breadcrumb__progress {
    height: 2px;
    background: var(--color-surface-bg);
    border-radius: var(--radius-full);
    overflow: hidden;
    width: 100%;
  }

  .breadcrumb__progress-bar {
    height: 100%;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    transition: width var(--duration-normal) var(--easing-easeOut);
  }

  .breadcrumb__separator {
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
  }

  .breadcrumb__separator-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .breadcrumb__overflow {
    .breadcrumb__overflow-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      background: none;
      border: none;
      color: var(--color-text-secondary);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--duration-fast) var(--easing-easeOut);

      &:hover {
        background: var(--color-surface-bg);
        color: var(--color-text-primary);
      }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }
  }

  .breadcrumb__icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .breadcrumb__overflow-count {
    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 640px) {
    .breadcrumb {
      padding: var(--space-2) var(--space-3);
    }

    .breadcrumb__list {
      gap: var(--space-1);
    }

    .breadcrumb__metadata {
      display: none;
    }

    .breadcrumb__label {
      font-size: var(--font-size-xs);
    }
  }

  /* ===== REDUCED MOTION ===== */
  @media (prefers-reduced-motion: reduce) {
    .breadcrumb__link:hover {
      transform: none;
    }

    .breadcrumb__progress-bar {
      transition: none;
    }
  }
</style>
```

### 🚀 **Étape 8.3 : Navigation Actions & Shortcuts**

**[FILE]** Créer `src/lib/components/navigation/QuickActions.svelte` :

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import type { NavigationAction } from '$lib/navigation/navigationContext';
  import { availableActions } from '$lib/navigation/navigationContext';

  // ===== PROPS =====
  export let position: 'top' | 'bottom' | 'left' | 'right' | 'floating' = 'floating';
  export let trigger: 'always' | 'hover' | 'keyboard' | 'contextmenu' = 'always';
  export let maxVisible = 6;

  // ===== STATE =====
  let isVisible = false;
  let actions: NavigationAction[] = [];
  let keyboardShortcuts = new Map<string, NavigationAction>();

  // ===== LIFECYCLE =====
  onMount(() => {
    // Subscribe to available actions
    const unsubscribe = availableActions.subscribe(currentActions => {
      actions = currentActions;
      updateKeyboardShortcuts(currentActions);
    });

    // Keyboard event listeners
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Visibility logic
    if (trigger === 'always') {
      isVisible = true;
    } else if (trigger === 'hover') {
      setupHoverTrigger();
    }

    return () => {
      unsubscribe();
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  // ===== COMPUTED =====
  $: visibleActions = actions
    .filter(action => shouldShowAction(action))
    .slice(0, maxVisible);

  $: primaryActions = visibleActions.filter(a => a.context === 'primary');
  $: secondaryActions = visibleActions.filter(a => a.context === 'secondary');
  $: contextualActions = visibleActions.filter(a => a.context === 'contextual');

  // ===== METHODS =====
  function shouldShowAction(action: NavigationAction): boolean {
    switch (action.visibility) {
      case 'always':
        return true;
      case 'hover':
        return isVisible;
      case 'focus':
        return document.hasFocus();
      case 'conditional':
        return action.condition ? action.condition() : true;
      default:
        return true;
    }
  }

  function updateKeyboardShortcuts(actions: NavigationAction[]): void {
    keyboardShortcuts.clear();
    actions.forEach(action => {
      if (action.shortcut) {
        keyboardShortcuts.set(action.shortcut.toLowerCase(), action);
      }
    });
  }

  function handleKeydown(event: KeyboardEvent): void {
    const shortcut = buildShortcutString(event);
    const action = keyboardShortcuts.get(shortcut);

    if (action) {
      event.preventDefault();
      executeAction(action);

      // Visual feedback
      showShortcutFeedback(action);
    }

    // Toggle visibility with specific key combinations
    if (event.key === 'Escape') {
      if (trigger === 'keyboard') {
        isVisible = false;
      }
    } else if (event.ctrlKey && event.key === '.') {
      if (trigger === 'keyboard') {
        isVisible = !isVisible;
      }
    }
  }

  function handleContextMenu(event: MouseEvent): void {
    if (trigger === 'contextmenu') {
      event.preventDefault();
      isVisible = true;

      // Position near cursor
      positionNearCursor(event.clientX, event.clientY);
    }
  }

  function buildShortcutString(event: KeyboardEvent): string {
    const parts: string[] = [];

    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');

    parts.push(event.key.toLowerCase());

    return parts.join('+');
  }

  function executeAction(action: NavigationAction): void {
    if (typeof action.action === 'function') {
      action.action();
    } else if (typeof action.action === 'string') {
      window.location.href = action.action;
    }

    // Analytics
    trackActionUsage(action);
  }

  function showShortcutFeedback(action: NavigationAction): void {
    // Visual feedback for keyboard shortcuts
    const feedback = document.createElement('div');
    feedback.className = 'shortcut-feedback';
    feedback.textContent = `${action.label} (${action.shortcut})`;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }

  function trackActionUsage(action: NavigationAction): void {
    console.log('Action used:', action.id);
    // Send analytics
  }

  function setupHoverTrigger(): void {
    let hoverTimeout: number;

    document.addEventListener('mousemove', () => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        isVisible = true;
      }, 1000); // Show after 1s of no movement
    });

    document.addEventListener('scroll', () => {
      isVisible = false;
    });
  }

  function positionNearCursor(x: number, y: number): void {
    // Implementation for context menu positioning
    // Would set CSS custom properties for positioning
  }
</script>

<!-- ===== TEMPLATE ===== -->
{#if isVisible && visibleActions.length > 0}
  <div
    class="quick-actions quick-actions--{position}"
    transition:fade={{ duration: 200, easing: quintOut }}
    role="toolbar"
    aria-label="Actions rapides"
  >
    <!-- Primary Actions -->
    {#if primaryActions.length > 0}
      <div class="quick-actions__group quick-actions__group--primary">
        {#each primaryActions as action (action.id)}
          <button
            class="quick-actions__btn quick-actions__btn--primary"
            on:click={() => executeAction(action)}
            title="{action.label}{action.shortcut ? ` (${action.shortcut})` : ''}"
            aria-label={action.label}
            transition:scale={{ duration: 150, easing: quintOut }}
          >
            <svg class="quick-actions__icon" aria-hidden="true">
              <use href="#{action.icon}" />
            </svg>

            <span class="quick-actions__label">{action.label}</span>

            {#if action.shortcut}
              <span class="quick-actions__shortcut" aria-hidden="true">
                {action.shortcut}
              </span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}

    <!-- Secondary Actions -->
    {#if secondaryActions.length > 0}
      <div class="quick-actions__group quick-actions__group--secondary">
        {#each secondaryActions as action (action.id)}
          <button
            class="quick-actions__btn quick-actions__btn--secondary"
            on:click={() => executeAction(action)}
            title="{action.label}{action.shortcut ? ` (${action.shortcut})` : ''}"
            aria-label={action.label}
            transition:scale={{ duration: 150, easing: quintOut }}
          >
            <svg class="quick-actions__icon" aria-hidden="true">
              <use href="#{action.icon}" />
            </svg>

            <span class="quick-actions__label">{action.label}</span>

            {#if action.shortcut}
              <span class="quick-actions__shortcut" aria-hidden="true">
                {action.shortcut}
              </span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}

    <!-- Contextual Actions -->
    {#if contextualActions.length > 0}
      <div class="quick-actions__group quick-actions__group--contextual">
        {#each contextualActions as action (action.id)}
          <button
            class="quick-actions__btn quick-actions__btn--contextual"
            on:click={() => executeAction(action)}
            title="{action.label}{action.shortcut ? ` (${action.shortcut})` : ''}"
            aria-label={action.label}
            transition:scale={{ duration: 150, easing: quintOut }}
          >
            <svg class="quick-actions__icon" aria-hidden="true">
              <use href="#{action.icon}" />
            </svg>

            {#if position === 'floating'}
              <span class="quick-actions__label">{action.label}</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}

    <!-- Keyboard Hint -->
    {#if trigger === 'keyboard'}
      <div class="quick-actions__hint">
        Appuyez sur <kbd>Ctrl</kbd> + <kbd>.</kbd> pour masquer
      </div>
    {/if}
  </div>
{/if}

<!-- ===== STYLES ===== -->
<style>
  .quick-actions {
    position: fixed;
    z-index: var(--z-popover);
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-4);
    backdrop-filter: blur(8px);

    display: flex;
    gap: var(--space-1);
    padding: var(--space-2);

    /* Default floating position */
    bottom: var(--space-6);
    right: var(--space-6);
  }

  /* ===== POSITION VARIANTS ===== */
  .quick-actions--top {
    top: var(--space-4);
    left: 50%;
    transform: translateX(-50%);
    bottom: auto;
    right: auto;
  }

  .quick-actions--bottom {
    bottom: var(--space-4);
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }

  .quick-actions--left {
    left: var(--space-4);
    top: 50%;
    transform: translateY(-50%);
    flex-direction: column;
    bottom: auto;
    right: auto;
  }

  .quick-actions--right {
    right: var(--space-4);
    top: 50%;
    transform: translateY(-50%);
    flex-direction: column;
    bottom: auto;
  }

  .quick-actions--floating {
    /* Default styles already applied */
  }

  /* ===== GROUPS ===== */
  .quick-actions__group {
    display: flex;
    gap: var(--space-1);

    &:not(:last-child)::after {
      content: '';
      width: 1px;
      background: var(--color-border);
      margin: 0 var(--space-1);
    }
  }

  .quick-actions--left .quick-actions__group,
  .quick-actions--right .quick-actions__group {
    flex-direction: column;

    &:not(:last-child)::after {
      width: auto;
      height: 1px;
      margin: var(--space-1) 0;
    }
  }

  /* ===== BUTTONS ===== */
  .quick-actions__btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: none;
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing-easeOut);
    white-space: nowrap;

    &:hover {
      background: var(--color-surface-bg);
      color: var(--color-text-primary);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &:active {
      transform: translateY(0);
    }
  }

  .quick-actions__btn--primary {
    background: var(--color-primary);
    color: white;

    &:hover {
      background: var(--color-primary-600);
      color: white;
    }
  }

  .quick-actions__btn--secondary {
    border: 1px solid var(--color-border);

    &:hover {
      border-color: var(--color-primary);
    }
  }

  .quick-actions__btn--contextual {
    padding: var(--space-2);
    min-width: 36px;
    justify-content: center;
  }

  /* ===== BUTTON ELEMENTS ===== */
  .quick-actions__icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
    flex-shrink: 0;
  }

  .quick-actions__label {
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .quick-actions__shortcut {
    font-size: var(--font-size-xs);
    opacity: 0.7;
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 4px;
    border-radius: var(--radius-sm);
    margin-left: auto;
  }

  /* ===== HINT ===== */
  .quick-actions__hint {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  kbd {
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 2px 4px;
    font-family: var(--font-mono);
    font-size: 0.75em;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .quick-actions {
      bottom: var(--space-4);
      right: var(--space-4);
      left: var(--space-4);
      width: auto;
      justify-content: center;
    }

    .quick-actions__label {
      display: none;
    }

    .quick-actions__btn {
      padding: var(--space-2);
      min-width: 44px;
      justify-content: center;
    }
  }

  /* ===== REDUCED MOTION ===== */
  @media (prefers-reduced-motion: reduce) {
    .quick-actions__btn:hover {
      transform: none;
    }
  }
</style>

<!-- Global styles for shortcut feedback -->
<style>
  :global(.shortcut-feedback) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-primary);
    box-shadow: var(--shadow-4);
    z-index: var(--z-toast);
    pointer-events: none;
    animation: shortcut-feedback 2s ease-out forwards;
  }

  @keyframes shortcut-feedback {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    10% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    90% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }
</style>
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:navigation       # Tests composants navigation
[TEST] npm run test:accessibility    # Tests navigation accessible
[TEST] npm run test:keyboard         # Tests raccourcis clavier
[TEST] npm run validate 8           # Validation complète Phase 8
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Navigation contextuelle et intelligente
- [ ] **[CHECK]** Breadcrumbs avec progression visuelle
- [ ] **[CHECK]** Raccourcis clavier complets et cohérents
- [ ] **[CHECK]** Actions rapides adaptatives
- [ ] **[CHECK]** Navigation 100% accessible (WCAG 2.1 AA)
- [ ] **[CHECK]** Performance navigation < 100ms
- [ ] **[CHECK]** Support multi-platform (desktop/mobile/tablet)
- [ ] **[CHECK]** Analytics navigation intégrées

---

## 🏷️ **Processus de Release v1.6**

```bash
[CMD] npm run validate 8              # Validation complète Phase 8
[CMD] git add . && git commit -m "feat: Phase 8 - Navigation UX complete"
[CMD] git tag v1.6                   # Tag release navigation
```

**🚫 STOP** : Ne pas passer à Phase 9 sans validation UX et accessibilité.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [💪 Phase 9 : Exercises System](phase-9-exercises-system.md)  
**Groupe suivant** : 🏗️ ÉCOSYSTÈME - Exercices & PWA  
**Dépendance** : Phase 8 (Navigation UX) validée ✅
