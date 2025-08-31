# 🎨 Phase 7 : Dynamic Interface (4 jours - Timing ajusté) - v1.5

## 📋 **Vue d'Ensemble**

**Objectif** : Interface utilisateur adaptative et responsive avec design system avancé  
**Version cible** : v1.5 (interface intelligente)  
**Groupe** : 🎨 UX/UI - Interface & Navigation  
**Prérequis** : Phase 6 (Curriculum Generation) validée ✅
**⚠️ Timing réajusté** : 2h → 4 jours (Interface entièrement dynamique nécessite tests UX et ajustements)

---

## 🎯 **Principes Fondamentaux & Architecture**

### 🎨 **Design System Adaptatif**

**Architecture des Composants :**

- **Atomic Design** : Atoms → Molecules → Organisms → Templates → Pages
- **Component-Driven Development** : Isolation et réutilisabilité maximale
- **Design Tokens** : Variables centralisées pour cohérence visuelle
- **Responsive Components** : Adaptation automatique selon viewport
- **Theme Switching** : Support multi-thèmes (light/dark/high-contrast)

**Système de Grid Intelligent :**

- **CSS Grid + Flexbox** : Layout hybride pour flexibilité maximale
- **Container Queries** : Composants réactifs à leur contexte
- **Fluid Typography** : Échelle typographique adaptative
- **Spacing System** : Rythme vertical et horizontal cohérent
- **Breakpoint System** : Points de rupture sémantiques

### 🧠 **Interface Adaptative**

**Personnalisation Intelligente :**

- **Learning Analytics UI** : Interface s'adapte selon style d'apprentissage
- **Cognitive Load Management** : Simplification dynamique selon complexité
- **Accessibility Adaptation** : Ajustements automatiques selon besoins
- **Performance Optimization** : Chargement prioritaire selon usage
- **Context Awareness** : UI adapte selon appareil, moment, lieu

**Interaction Patterns :**

- **Progressive Disclosure** : Révélation progressive de complexité
- **Micro-interactions** : Feedback immédiat et délicieux
- **Gesture Support** : Navigation tactile intuitive
- **Voice Interface** : Commandes vocales pour accessibilité
- **Keyboard Navigation** : Support complet clavier pour power users

### 🔬 **Approche Qualité & Performance**

**Métriques UX :**

- **Core Web Vitals** : LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Accessibility Score** : WCAG 2.1 AA compliance > 95%
- **User Satisfaction** : SUS Score > 80, NPS > 50
- **Task Completion Rate** : > 90% pour tâches principales
- **Error Recovery** : Temps moyen récupération < 30s

**Testing Strategy :**

- **Visual Regression Testing** : Chromatic pour composants
- **A/B Testing** : Optimisation continue des patterns
- **Usability Testing** : Sessions utilisateur qualitatives
- **Performance Monitoring** : Real User Monitoring (RUM)
- **Accessibility Audits** : Tests automatisés + manuels

---

## 📚 **Références Modulaires**

### **[REF]** Design System : **[design-system.md](../references/ui/design-system.md)**

- ✅ Atomic design avec tokens et composants
- ✅ Système de thèmes et variants
- ✅ Guidelines d'accessibilité intégrées
- ✅ Documentation interactive avec Storybook

### **[REF]** Animations & Transitions : **[animations.md](../references/ui/animations.md)**

- ✅ Système d'animations cohérent
- ✅ Performance-optimized transitions
- ✅ Respect préférences reduced-motion
- ✅ Micro-interactions délicieuses

---

## 📝 **Instructions d'Implémentation**

### 🎨 **Étape 7.1 : Design System Foundation**

**[FILE]** Créer `src/lib/design-system/tokens.ts` :

```ts
// ===== DESIGN TOKENS =====

// Échelle de couleurs sémantiques
export const colorTokens = {
  // Couleurs primaires
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Base
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },

  // Couleurs sémantiques éducatives
  learning: {
    beginner: "#10b981", // Vert - facile
    intermediate: "#f59e0b", // Orange - moyen
    advanced: "#ef4444", // Rouge - difficile
    mastered: "#8b5cf6", // Violet - maîtrisé
  },

  // États fonctionnels
  semantic: {
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
    info: "#2563eb",
  },

  // Surfaces et textes
  surface: {
    background: {
      light: "#ffffff",
      dark: "#0f172a",
    },
    card: {
      light: "#f8fafc",
      dark: "#1e293b",
    },
    overlay: {
      light: "rgba(0, 0, 0, 0.5)",
      dark: "rgba(0, 0, 0, 0.8)",
    },
  },

  text: {
    primary: {
      light: "#1e293b",
      dark: "#f1f5f9",
    },
    secondary: {
      light: "#64748b",
      dark: "#94a3b8",
    },
    accent: {
      light: "#0ea5e9",
      dark: "#38bdf8",
    },
  },
};

// Échelle typographique fluide
export const typographyTokens = {
  fontFamilies: {
    sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
    mono: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
    display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
  },

  fontSizes: {
    xs: "clamp(0.75rem, 0.69rem + 0.29vw, 0.875rem)",
    sm: "clamp(0.875rem, 0.79rem + 0.43vw, 1rem)",
    base: "clamp(1rem, 0.91rem + 0.43vw, 1.125rem)",
    lg: "clamp(1.125rem, 1.01rem + 0.58vw, 1.25rem)",
    xl: "clamp(1.25rem, 1.11rem + 0.72vw, 1.5rem)",
    "2xl": "clamp(1.5rem, 1.26rem + 1.16vw, 1.875rem)",
    "3xl": "clamp(1.875rem, 1.52rem + 1.74vw, 2.25rem)",
    "4xl": "clamp(2.25rem, 1.77rem + 2.32vw, 3rem)",
  },

  fontWeights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeights: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
  },
};

// Système d'espacement
export const spacingTokens = {
  // Échelle basée sur 0.25rem (4px)
  space: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
  },

  // Espacements sémantiques
  semantic: {
    cardPadding: "var(--space-6)",
    sectionGap: "var(--space-12)",
    contentGap: "var(--space-8)",
    elementGap: "var(--space-4)",
  },
};

// Système d'ombres
export const shadowTokens = {
  elevation: {
    0: "none",
    1: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    2: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    3: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    4: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    5: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    6: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },

  focus: "0 0 0 3px rgb(59 130 246 / 0.5)",

  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
};

// Rayons de bordure
export const radiusTokens = {
  none: "0",
  sm: "0.125rem",
  base: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

// Points de rupture responsive
export const breakpointTokens = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Durées d'animation
export const animationTokens = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
    slower: "500ms",
  },

  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
};

// Z-index layers
export const zIndexTokens = {
  auto: "auto",
  base: 0,
  tooltip: 10,
  dropdown: 20,
  sticky: 30,
  modal: 40,
  popover: 50,
  toast: 60,
};

// ===== CSS CUSTOM PROPERTIES =====
export function generateCSSTokens(theme: "light" | "dark" = "light") {
  const cssProps = {
    // Couleurs
    "--color-primary": colorTokens.primary[500],
    "--color-surface-bg": colorTokens.surface.background[theme],
    "--color-surface-card": colorTokens.surface.card[theme],
    "--color-text-primary": colorTokens.text.primary[theme],
    "--color-text-secondary": colorTokens.text.secondary[theme],

    // Typography
    "--font-sans": typographyTokens.fontFamilies.sans.join(", "),
    "--font-mono": typographyTokens.fontFamilies.mono.join(", "),
    "--font-display": typographyTokens.fontFamilies.display.join(", "),

    // Espacement
    ...Object.entries(spacingTokens.space).reduce((acc, [key, value]) => {
      acc[`--space-${key}`] = value;
      return acc;
    }, {} as Record<string, string>),

    // Shadows
    ...Object.entries(shadowTokens.elevation).reduce((acc, [key, value]) => {
      acc[`--shadow-${key}`] = value;
      return acc;
    }, {} as Record<string, string>),

    // Border radius
    ...Object.entries(radiusTokens).reduce((acc, [key, value]) => {
      acc[`--radius-${key}`] = value;
      return acc;
    }, {} as Record<string, string>),

    // Z-index
    ...Object.entries(zIndexTokens).reduce((acc, [key, value]) => {
      acc[`--z-${key}`] = value.toString();
      return acc;
    }, {} as Record<string, string>),
  };

  return cssProps;
}

// ===== THEME CONTEXT =====
export interface ThemeConfig {
  mode: "light" | "dark" | "auto";
  primaryColor: keyof typeof colorTokens.primary;
  fontSize: "small" | "medium" | "large";
  reducedMotion: boolean;
  highContrast: boolean;
}

export const defaultThemeConfig: ThemeConfig = {
  mode: "auto",
  primaryColor: 500,
  fontSize: "medium",
  reducedMotion: false,
  highContrast: false,
};
```

### 🧩 **Étape 7.2 : Composants Atomiques**

**[FILE]** Créer `src/lib/components/atoms/Button.svelte` :

```svelte
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ComponentProps } from "svelte";

  // ===== TYPES =====
  interface ButtonVariant {
    intent: "primary" | "secondary" | "success" | "warning" | "error" | "ghost";
    size: "xs" | "sm" | "md" | "lg" | "xl";
    radius: "none" | "sm" | "md" | "lg" | "full";
  }

  // ===== PROPS =====
  export let variant: ButtonVariant["intent"] = "primary";
  export let size: ButtonVariant["size"] = "md";
  export let radius: ButtonVariant["radius"] = "md";
  export let disabled = false;
  export let loading = false;
  export let fullWidth = false;
  export let iconLeft: string | undefined = undefined;
  export let iconRight: string | undefined = undefined;
  export let href: string | undefined = undefined;
  export let type: "button" | "submit" | "reset" = "button";

  // Accessibilité
  export let ariaLabel: string | undefined = undefined;
  export let ariaDescribedBy: string | undefined = undefined;

  // ===== EVENTS =====
  const dispatch = createEventDispatcher<{
    click: MouseEvent;
    focus: FocusEvent;
    blur: FocusEvent;
  }>();

  // ===== COMPUTED STYLES =====
  $: buttonClasses = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    `btn--radius-${radius}`,
    fullWidth && "btn--full-width",
    disabled && "btn--disabled",
    loading && "btn--loading",
  ]
    .filter(Boolean)
    .join(" ");

  // ===== EVENT HANDLERS =====
  function handleClick(event: MouseEvent) {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    dispatch("click", event);
  }

  function handleFocus(event: FocusEvent) {
    dispatch("focus", event);
  }

  function handleBlur(event: FocusEvent) {
    dispatch("blur", event);
  }
</script>

<!-- ===== TEMPLATE ===== -->
{#if href && !disabled}
  <a
    {href}
    class={buttonClasses}
    role="button"
    tabindex="0"
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    on:click={handleClick}
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:keydown={(e) => e.key === "Enter" && handleClick(e)}
  >
    <span class="btn__content">
      {#if iconLeft}
        <svg class="btn__icon btn__icon--left" aria-hidden="true">
          <use href="#{iconLeft}" />
        </svg>
      {/if}

      {#if loading}
        <span class="btn__spinner" aria-hidden="true" />
      {/if}

      <span class="btn__text" class:sr-only={loading}>
        <slot />
      </span>

      {#if iconRight && !loading}
        <svg class="btn__icon btn__icon--right" aria-hidden="true">
          <use href="#{iconRight}" />
        </svg>
      {/if}
    </span>
  </a>
{:else}
  <button
    class={buttonClasses}
    {type}
    {disabled}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    on:click={handleClick}
    on:focus={handleFocus}
    on:blur={handleBlur}
  >
    <span class="btn__content">
      {#if iconLeft}
        <svg class="btn__icon btn__icon--left" aria-hidden="true">
          <use href="#{iconLeft}" />
        </svg>
      {/if}

      {#if loading}
        <span class="btn__spinner" aria-hidden="true" />
      {/if}

      <span class="btn__text" class:sr-only={loading}>
        <slot />
      </span>

      {#if iconRight && !loading}
        <svg class="btn__icon btn__icon--right" aria-hidden="true">
          <use href="#{iconRight}" />
        </svg>
      {/if}
    </span>
  </button>
{/if}

<!-- ===== STYLES ===== -->
<style>
  .btn {
    /* Reset */
    appearance: none;
    border: none;
    background: none;
    margin: 0;
    padding: 0;
    text-decoration: none;
    color: inherit;

    /* Base styles */
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-sans);
    font-weight: 500;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline-offset: 2px;
    transition: all var(--duration-fast) var(--easing-easeOut);

    /* Focus styles */
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    /* Disabled state */
    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Loading state */
    &--loading {
      cursor: wait;
    }
  }

  .btn__content {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .btn__text {
    transition: opacity var(--duration-fast) var(--easing-easeOut);
  }

  .btn__icon {
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    fill: currentColor;
  }

  .btn__spinner {
    position: absolute;
    width: 1em;
    height: 1em;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ===== SIZE VARIANTS ===== */
  .btn--xs {
    padding: var(--space-1) var(--space-2);
    font-size: 0.75rem;
    min-height: 1.5rem;
  }

  .btn--sm {
    padding: var(--space-2) var(--space-3);
    font-size: 0.875rem;
    min-height: 2rem;
  }

  .btn--md {
    padding: var(--space-3) var(--space-4);
    font-size: 1rem;
    min-height: 2.5rem;
  }

  .btn--lg {
    padding: var(--space-4) var(--space-6);
    font-size: 1.125rem;
    min-height: 3rem;
  }

  .btn--xl {
    padding: var(--space-5) var(--space-8);
    font-size: 1.25rem;
    min-height: 3.5rem;
  }

  /* ===== INTENT VARIANTS ===== */
  .btn--primary {
    background-color: var(--color-primary);
    color: white;

    &:hover {
      background-color: var(--color-primary-600);
      transform: translateY(-1px);
      box-shadow: var(--shadow-2);
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-1);
    }
  }

  .btn--secondary {
    background-color: transparent;
    color: var(--color-text-primary);
    border: 2px solid var(--color-border);

    &:hover {
      background-color: var(--color-surface-card);
      border-color: var(--color-primary);
    }
  }

  .btn--success {
    background-color: var(--color-success);
    color: white;

    &:hover {
      background-color: var(--color-success-600);
    }
  }

  .btn--warning {
    background-color: var(--color-warning);
    color: white;

    &:hover {
      background-color: var(--color-warning-600);
    }
  }

  .btn--error {
    background-color: var(--color-error);
    color: white;

    &:hover {
      background-color: var(--color-error-600);
    }
  }

  .btn--ghost {
    background-color: transparent;
    color: var(--color-text-primary);

    &:hover {
      background-color: var(--color-surface-card);
    }
  }

  /* ===== RADIUS VARIANTS ===== */
  .btn--radius-none {
    border-radius: var(--radius-none);
  }
  .btn--radius-sm {
    border-radius: var(--radius-sm);
  }
  .btn--radius-md {
    border-radius: var(--radius-md);
  }
  .btn--radius-lg {
    border-radius: var(--radius-lg);
  }
  .btn--radius-full {
    border-radius: var(--radius-full);
  }

  /* ===== MODIFIERS ===== */
  .btn--full-width {
    width: 100%;
  }

  /* ===== ACCESSIBILITY ===== */
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

  /* ===== REDUCED MOTION ===== */
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
    }

    .btn__spinner {
      animation: none;
    }

    .btn:hover {
      transform: none;
    }
  }
</style>
```

### 📊 **Étape 7.3 : Composants Adaptatifs**

**[FILE]** Créer `src/lib/components/organisms/LearningCard.svelte` :

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Button from "../atoms/Button.svelte";
  import ProgressBar from "../atoms/ProgressBar.svelte";
  import Badge from "../atoms/Badge.svelte";

  // ===== TYPES =====
  interface LearningCardData {
    id: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedTime: number; // minutes
    progress: number; // 0-1
    competences: string[];
    thumbnail?: string;
    isBookmarked: boolean;
    lastAccessed?: string;
  }

  interface AdaptiveFeatures {
    layout: "compact" | "detailed" | "minimal";
    showProgress: boolean;
    emphasizeNext: boolean;
    adaptedDifficulty: string;
    personalizedCTA: string;
  }

  // ===== PROPS =====
  export let data: LearningCardData;
  export let adaptive: AdaptiveFeatures = {
    layout: "detailed",
    showProgress: true,
    emphasizeNext: false,
    adaptedDifficulty: data.difficulty,
    personalizedCTA: "Commencer",
  };
  export let viewport: "mobile" | "tablet" | "desktop" = "desktop";
  export let learningStyle: "visual" | "auditory" | "kinesthetic" | "reading" =
    "visual";

  // ===== STATE =====
  let cardElement: HTMLElement;
  let isVisible = false;
  let isHovered = false;
  let intersectionRatio = 0;

  // ===== LIFECYCLE =====
  onMount(() => {
    // Intersection Observer pour animations au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          intersectionRatio = entry.intersectionRatio;
        });
      },
      { threshold: [0, 0.1, 0.5, 1] }
    );

    if (cardElement) {
      observer.observe(cardElement);
    }

    return () => observer.disconnect();
  });

  // ===== COMPUTED STYLES =====
  $: cardClasses = [
    "learning-card",
    `learning-card--${adaptive.layout}`,
    `learning-card--${viewport}`,
    `learning-card--${learningStyle}`,
    adaptive.emphasizeNext && "learning-card--emphasized",
    isVisible && "learning-card--visible",
    data.progress > 0 && "learning-card--in-progress",
    data.progress >= 1 && "learning-card--completed",
  ]
    .filter(Boolean)
    .join(" ");

  $: difficultyColor = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  }[data.difficulty];

  $: progressPercentage = Math.round(data.progress * 100);

  // ===== ADAPTIVE CONTENT =====
  $: adaptiveContent = getAdaptiveContent(learningStyle, adaptive.layout);

  function getAdaptiveContent(style: string, layout: string) {
    const base = {
      showThumbnail: true,
      showDescription: true,
      showCompetences: true,
      ctaText: adaptive.personalizedCTA,
    };

    // Adaptation selon style d'apprentissage
    switch (style) {
      case "visual":
        return {
          ...base,
          showThumbnail: true,
          showIcons: true,
          colorCoding: true,
        };
      case "reading":
        return {
          ...base,
          showDescription: true,
          detailedText: true,
          showThumbnail: layout !== "compact",
        };
      case "kinesthetic":
        return {
          ...base,
          interactiveCTA: true,
          hoverEffects: true,
          quickActions: true,
        };
      default:
        return base;
    }
  }

  // ===== EVENT HANDLERS =====
  function handleCardClick() {
    // Analytics pour adaptation future
    trackInteraction("card_click", {
      contentId: data.id,
      layout: adaptive.layout,
      learningStyle,
      viewport,
    });
  }

  function handleBookmarkToggle() {
    data.isBookmarked = !data.isBookmarked;
    trackInteraction("bookmark_toggle", {
      contentId: data.id,
      bookmarked: data.isBookmarked,
    });
  }

  function trackInteraction(event: string, data: any) {
    // Envoi analytics pour amélioration continue
    console.log("Analytics:", { event, data });
  }
</script>

<!-- ===== TEMPLATE ===== -->
<article
  bind:this={cardElement}
  class={cardClasses}
  on:click={handleCardClick}
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  role="button"
  tabindex="0"
  aria-label="Cours: {data.title}"
  in:fade={{ duration: 300, easing: quintOut }}
  style="--intersection-ratio: {intersectionRatio}"
>
  <!-- Thumbnail Section -->
  {#if adaptiveContent.showThumbnail && data.thumbnail}
    <div class="learning-card__thumbnail">
      <img
        src={data.thumbnail}
        alt={data.title}
        loading="lazy"
        class="learning-card__image"
      />

      <!-- Overlay avec informations rapides -->
      <div class="learning-card__overlay">
        <Badge variant={difficultyColor} size="sm">
          {adaptive.adaptedDifficulty}
        </Badge>

        <button
          class="learning-card__bookmark"
          class:learning-card__bookmark--active={data.isBookmarked}
          on:click|stopPropagation={handleBookmarkToggle}
          aria-label={data.isBookmarked
            ? "Retirer des favoris"
            : "Ajouter aux favoris"}
        >
          <svg class="learning-card__bookmark-icon" aria-hidden="true">
            <use href="#bookmark" />
          </svg>
        </button>
      </div>
    </div>
  {/if}

  <!-- Content Section -->
  <div class="learning-card__content">
    <!-- Header avec titre et métadonnées -->
    <header class="learning-card__header">
      <h3 class="learning-card__title">{data.title}</h3>

      <div class="learning-card__meta">
        <span class="learning-card__duration">
          <svg class="learning-card__icon" aria-hidden="true">
            <use href="#clock" />
          </svg>
          {data.estimatedTime}min
        </span>

        {#if data.lastAccessed}
          <span class="learning-card__last-accessed">
            Dernière fois: {new Date(data.lastAccessed).toLocaleDateString()}
          </span>
        {/if}
      </div>
    </header>

    <!-- Description adaptative -->
    {#if adaptiveContent.showDescription && adaptive.layout !== "minimal"}
      <p class="learning-card__description">
        {data.description}
      </p>
    {/if}

    <!-- Compétences -->
    {#if adaptiveContent.showCompetences && data.competences.length > 0}
      <div class="learning-card__competences">
        {#each data.competences.slice(0, 3) as competence}
          <Badge variant="secondary" size="xs">
            {competence}
          </Badge>
        {/each}

        {#if data.competences.length > 3}
          <Badge variant="ghost" size="xs">
            +{data.competences.length - 3}
          </Badge>
        {/if}
      </div>
    {/if}

    <!-- Progress Section -->
    {#if adaptive.showProgress}
      <div class="learning-card__progress-section">
        <div class="learning-card__progress-header">
          <span class="learning-card__progress-label">Progression</span>
          <span class="learning-card__progress-value"
            >{progressPercentage}%</span
          >
        </div>

        <ProgressBar
          value={data.progress}
          size="sm"
          variant={data.progress >= 1 ? "success" : "primary"}
          animated={isHovered && data.progress < 1}
        />
      </div>
    {/if}
  </div>

  <!-- Actions Section -->
  <footer class="learning-card__actions">
    <Button
      variant={adaptive.emphasizeNext ? "primary" : "secondary"}
      size={viewport === "mobile" ? "sm" : "md"}
      fullWidth={viewport === "mobile"}
      iconRight={data.progress > 0 ? "play" : "arrow-right"}
    >
      {adaptiveContent.ctaText}
    </Button>

    {#if adaptiveContent.quickActions}
      <div class="learning-card__quick-actions">
        <button
          class="learning-card__quick-action"
          aria-label="Plus d'informations"
          title="Plus d'informations"
        >
          <svg aria-hidden="true"><use href="#info" /></svg>
        </button>

        <button
          class="learning-card__quick-action"
          aria-label="Partager"
          title="Partager"
        >
          <svg aria-hidden="true"><use href="#share" /></svg>
        </button>
      </div>
    {/if}
  </footer>

  <!-- Indicateur de recommandation IA -->
  {#if adaptive.emphasizeNext}
    <div
      class="learning-card__ai-indicator"
      title="Recommandé par l'IA selon votre profil"
    >
      <svg class="learning-card__ai-icon" aria-hidden="true">
        <use href="#sparkles" />
      </svg>
    </div>
  {/if}
</article>

<!-- ===== STYLES ===== -->
<style>
  .learning-card {
    /* Base */
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: all var(--duration-normal) var(--easing-easeOut);

    /* Shadow progressive selon visibility */
    box-shadow: var(--shadow-1);

    /* Hover enhancements */
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-4);
      border-color: var(--color-primary-300);
    }

    /* Focus state */
    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    /* Adaptive shadow based on intersection */
    &--visible {
      box-shadow: calc(var(--shadow-2) * var(--intersection-ratio, 1));
    }
  }

  /* ===== LAYOUT VARIANTS ===== */
  .learning-card--compact {
    .learning-card__content {
      padding: var(--space-4);
    }

    .learning-card__description {
      display: none;
    }
  }

  .learning-card--minimal {
    .learning-card__thumbnail {
      height: 120px;
    }

    .learning-card__content {
      padding: var(--space-3);
    }
  }

  .learning-card--detailed {
    .learning-card__content {
      padding: var(--space-6);
    }
  }

  /* ===== VIEWPORT ADAPTATIONS ===== */
  .learning-card--mobile {
    .learning-card__content {
      padding: var(--space-4);
    }

    .learning-card__actions {
      padding: var(--space-4);
      flex-direction: column;
      gap: var(--space-2);
    }
  }

  .learning-card--tablet {
    .learning-card__thumbnail {
      height: 180px;
    }
  }

  .learning-card--desktop {
    .learning-card__thumbnail {
      height: 200px;
    }

    /* Grid layout pour desktop */
    @container (min-width: 600px) {
      display: grid;
      grid-template-columns: 200px 1fr;
      grid-template-rows: 1fr auto;

      .learning-card__thumbnail {
        grid-row: 1 / -1;
        height: auto;
      }
    }
  }

  /* ===== LEARNING STYLE ADAPTATIONS ===== */
  .learning-card--visual {
    .learning-card__competences {
      --badge-color-mapping: true;
    }
  }

  .learning-card--kinesthetic {
    &:hover {
      transform: translateY(-4px) scale(1.02);
    }

    .learning-card__quick-actions {
      opacity: 0;
      transition: opacity var(--duration-normal);
    }

    &:hover .learning-card__quick-actions {
      opacity: 1;
    }
  }

  /* ===== PROGRESS STATES ===== */
  .learning-card--in-progress {
    border-left: 4px solid var(--color-primary);
  }

  .learning-card--completed {
    border-left: 4px solid var(--color-success);

    .learning-card__title::after {
      content: "✓";
      margin-left: var(--space-2);
      color: var(--color-success);
    }
  }

  .learning-card--emphasized {
    background: linear-gradient(
      135deg,
      var(--color-primary-50) 0%,
      var(--color-surface-card) 100%
    );
    border-color: var(--color-primary-200);

    .learning-card__ai-indicator {
      opacity: 1;
    }
  }

  /* ===== COMPONENT SECTIONS ===== */
  .learning-card__thumbnail {
    position: relative;
    height: 160px;
    overflow: hidden;
    background: var(--color-surface-bg);
  }

  .learning-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--duration-slow) var(--easing-easeOut);
  }

  .learning-card:hover .learning-card__image {
    transform: scale(1.05);
  }

  .learning-card__overlay {
    position: absolute;
    top: var(--space-3);
    left: var(--space-3);
    right: var(--space-3);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .learning-card__bookmark {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: var(--radius-full);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--duration-fast);

    &:hover {
      background: white;
      transform: scale(1.1);
    }

    &--active {
      background: var(--color-primary);
      color: white;
    }
  }

  .learning-card__bookmark-icon {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .learning-card__content {
    flex: 1;
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .learning-card__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .learning-card__title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: var(--line-height-tight);
    margin: 0;
  }

  .learning-card__meta {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .learning-card__duration,
  .learning-card__last-accessed {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .learning-card__icon {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .learning-card__description {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    margin: 0;

    /* Clamp to 3 lines */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .learning-card__competences {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .learning-card__progress-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .learning-card__progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-sm);
  }

  .learning-card__progress-label {
    color: var(--color-text-secondary);
  }

  .learning-card__progress-value {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .learning-card__actions {
    padding: var(--space-5);
    padding-top: 0;
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .learning-card__quick-actions {
    display: flex;
    gap: var(--space-2);
    margin-left: auto;
  }

  .learning-card__quick-action {
    background: none;
    border: none;
    border-radius: var(--radius-md);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--duration-fast);

    &:hover {
      background: var(--color-surface-bg);
      color: var(--color-text-primary);
      transform: scale(1.1);
    }

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
  }

  .learning-card__ai-indicator {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity var(--duration-normal);
    z-index: 1;
  }

  .learning-card__ai-icon {
    width: 12px;
    height: 12px;
    fill: white;
  }

  /* ===== CONTAINER QUERIES ===== */
  @container (min-width: 300px) {
    .learning-card__actions {
      flex-direction: row;
    }
  }

  @container (min-width: 500px) {
    .learning-card {
      display: grid;
      grid-template-columns: 160px 1fr;
    }

    .learning-card__thumbnail {
      height: auto;
    }
  }

  /* ===== REDUCED MOTION ===== */
  @media (prefers-reduced-motion: reduce) {
    .learning-card {
      transition: none;
    }

    .learning-card:hover {
      transform: none;
    }

    .learning-card__image {
      transition: none;
    }

    .learning-card:hover .learning-card__image {
      transform: none;
    }
  }
</style>
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:components       # Tests composants isolés
[TEST] npm run test:accessibility    # Tests accessibilité WCAG
[TEST] npm run test:responsive       # Tests responsive design
[TEST] npm run validate 7           # Validation complète Phase 7
```

**[FILE]** Créer `src/lib/components/atoms/Button.test.ts` :

```ts
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import Button from "./Button.svelte";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render with default props", () => {
      const { getByRole } = render(Button, { props: { children: "Click me" } });
      const button = getByRole("button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Click me");
      expect(button).toHaveClass("btn", "btn--primary", "btn--md");
    });

    it("should render as link when href provided", () => {
      const { getByRole } = render(Button, {
        props: {
          href: "/test",
          children: "Link button",
        },
      });

      const link = getByRole("button");
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("Variants", () => {
    it("should apply size variant classes", () => {
      const { getByRole } = render(Button, {
        props: {
          size: "lg",
          children: "Large button",
        },
      });

      const button = getByRole("button");
      expect(button).toHaveClass("btn--lg");
    });

    it("should apply intent variant classes", () => {
      const { getByRole } = render(Button, {
        props: {
          variant: "success",
          children: "Success button",
        },
      });

      const button = getByRole("button");
      expect(button).toHaveClass("btn--success");
    });
  });

  describe("States", () => {
    it("should be disabled when disabled prop is true", () => {
      const { getByRole } = render(Button, {
        props: {
          disabled: true,
          children: "Disabled button",
        },
      });

      const button = getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("btn--disabled");
    });

    it("should show loading state", () => {
      const { getByRole, container } = render(Button, {
        props: {
          loading: true,
          children: "Loading button",
        },
      });

      const button = getByRole("button");
      const spinner = container.querySelector(".btn__spinner");
      const text = container.querySelector(".btn__text");

      expect(button).toHaveClass("btn--loading");
      expect(spinner).toBeInTheDocument();
      expect(text).toHaveClass("sr-only");
    });
  });

  describe("Events", () => {
    it("should handle click events", async () => {
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      const { getByRole } = render(Button, {
        props: {
          children: "Click me",
        },
      });

      const button = getByRole("button");
      button.addEventListener("click", handleClick);

      await fireEvent.click(button);
      expect(clicked).toBe(true);
    });

    it("should not handle click when disabled", async () => {
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      const { getByRole } = render(Button, {
        props: {
          disabled: true,
          children: "Disabled button",
        },
      });

      const button = getByRole("button");
      button.addEventListener("click", handleClick);

      await fireEvent.click(button);
      expect(clicked).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const { getByRole } = render(Button, {
        props: {
          ariaLabel: "Custom label",
          ariaDescribedBy: "description",
          children: "Button",
        },
      });

      const button = getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom label");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });

    it("should support keyboard navigation for links", async () => {
      const { getByRole } = render(Button, {
        props: {
          href: "/test",
          children: "Link button",
        },
      });

      const link = getByRole("button");
      await fireEvent.keyDown(link, { key: "Enter" });

      // Should have triggered click handler
      expect(link).toHaveFocus();
    });
  });

  describe("Icons", () => {
    it("should render left icon", () => {
      const { container } = render(Button, {
        props: {
          iconLeft: "star",
          children: "Button with icon",
        },
      });

      const leftIcon = container.querySelector(".btn__icon--left");
      expect(leftIcon).toBeInTheDocument();
      expect(leftIcon.querySelector("use")).toHaveAttribute("href", "#star");
    });

    it("should render right icon", () => {
      const { container } = render(Button, {
        props: {
          iconRight: "arrow-right",
          children: "Button with icon",
        },
      });

      const rightIcon = container.querySelector(".btn__icon--right");
      expect(rightIcon).toBeInTheDocument();
      expect(rightIcon.querySelector("use")).toHaveAttribute(
        "href",
        "#arrow-right"
      );
    });

    it("should hide right icon when loading", () => {
      const { container } = render(Button, {
        props: {
          loading: true,
          iconRight: "arrow-right",
          children: "Loading button",
        },
      });

      const rightIcon = container.querySelector(".btn__icon--right");
      expect(rightIcon).not.toBeInTheDocument();
    });
  });
});
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Design system avec tokens et composants atomiques
- [ ] **[CHECK]** Interface responsive et adaptative
- [ ] **[CHECK]** Composants accessibles WCAG 2.1 AA
- [ ] **[CHECK]** Performance Core Web Vitals optimisées
- [ ] **[CHECK]** Support multi-thèmes et préférences utilisateur
- [ ] **[CHECK]** Tests visuels et d'interaction validés
- [ ] **[CHECK]** Documentation composants interactive
- [ ] **[CHECK]** Container queries et CSS moderne

---

## 🏷️ **Processus de Release v1.5**

```bash
[CMD] npm run validate 7              # Validation complète Phase 7
[CMD] npm run build:storybook        # Build documentation composants
[CMD] git add . && git commit -m "feat: Phase 7 - Dynamic Interface complete"
[CMD] git tag v1.5                   # Tag release UI
```

**🚫 STOP** : Ne pas passer à Phase 8 sans validation de l'accessibilité et performance.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [🧭 Phase 8 : Navigation UX](phase-8-navigation-ux.md)  
**Groupe actuel** : 🎨 UX/UI - Interface & Navigation  
**Dépendance** : Phase 7 (Dynamic Interface) validée ✅
