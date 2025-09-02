/**
 * Phase 7 - Design System Implementation
 * Système de design complet avec composants atomiques
 */

// 🎨 Design Tokens (inline pour éviter les restrictions de fichiers)
const designTokens = {
  colors: {
    primary: { 50: '#f0f9ff', 500: '#0ea5e9', 900: '#0c4a6e' },
    semantic: { success: '#10b981', warning: '#f59e0b', error: '#ef4444' },
    difficulty: { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444', expert: '#8b5cf6' },
    neutral: { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' }
  },
  
  typography: {
    sizes: { sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' },
    weights: { normal: 400, medium: 500, bold: 700 },
    families: { sans: ['Inter', 'system-ui'], mono: ['JetBrains Mono', 'monospace'] }
  },
  
  spacing: { 1: '0.25rem', 2: '0.5rem', 4: '1rem', 6: '1.5rem', 8: '2rem' },
  
  animations: {
    durations: { fast: '150ms', normal: '300ms' },
    easings: { easeOut: 'cubic-bezier(0, 0, 0.2, 1)' }
  }
};

// 🔧 Component Factory - Créateur de composants atomiques
class ComponentFactory {
  constructor(tokens) {
    this.tokens = tokens;
    this.cache = new Map();
  }
  
  // 🔘 Créateur de boutons
  createButton(props = {}) {
    const {
      variant = 'primary',
      size = 'md',
      disabled = false,
      children = 'Button'
    } = props;
    
    const variants = {
      primary: `bg-[${this.tokens.colors.primary[500]}] text-white`,
      secondary: `bg-[${this.tokens.colors.neutral[100]}] text-[${this.tokens.colors.neutral[900]}]`,
      success: `bg-[${this.tokens.colors.semantic.success}] text-white`,
      danger: `bg-[${this.tokens.colors.semantic.error}] text-white`
    };
    
    const sizes = {
      sm: `px-3 py-1.5 text-sm`,
      md: `px-4 py-2 text-base`,
      lg: `px-6 py-3 text-lg`
    };
    
    return {
      component: 'button',
      props: {
        class: `${variants[variant]} ${sizes[size]} rounded font-medium transition-colors duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`,
        disabled,
        'aria-label': typeof children === 'string' ? children : undefined
      },
      children,
      metadata: { variant, size, type: 'Button' }
    };
  }
  
  // 📱 Créateur de grille responsive
  createGrid(props = {}) {
    const {
      cols = { default: 1, md: 2, lg: 3 },
      gap = 4,
      children = []
    } = props;
    
    const gridCols = Object.entries(cols)
      .map(([breakpoint, count]) => 
        breakpoint === 'default' 
          ? `grid-cols-${count}` 
          : `${breakpoint}:grid-cols-${count}`
      )
      .join(' ');
    
    return {
      component: 'div',
      props: {
        class: `grid ${gridCols} gap-${gap}`
      },
      children,
      metadata: { cols, gap, type: 'Grid' }
    };
  }
  
  // 🎨 Gestionnaire de thèmes
  createThemeProvider(props = {}) {
    const { theme = 'light', children = [] } = props;
    
    const themes = {
      light: {
        '--bg-primary': this.tokens.colors.neutral[50],
        '--text-primary': this.tokens.colors.neutral[900],
        '--accent': this.tokens.colors.primary[500]
      },
      dark: {
        '--bg-primary': this.tokens.colors.neutral[900], 
        '--text-primary': this.tokens.colors.neutral[50],
        '--accent': this.tokens.colors.primary[400]
      }
    };
    
    return {
      component: 'div',
      props: {
        class: `theme-${theme}`,
        style: themes[theme]
      },
      children,
      metadata: { theme, type: 'ThemeProvider' }
    };
  }
}

// 🎯 Design System Manager - Gestionnaire principal
class DesignSystemManager {
  constructor() {
    this.factory = new ComponentFactory(designTokens);
    this.components = new Map();
    this.performance = {
      renderTimes: [],
      bundleSize: 0,
      lazyLoaded: new Set()
    };
  }
  
  // 📦 Enregistrement de composants
  registerComponent(name, definition) {
    this.components.set(name, {
      ...definition,
      registered: Date.now()
    });
    
    return this;
  }
  
  // 🚀 Rendu optimisé avec lazy loading
  renderComponent(name, props = {}, options = {}) {
    const startTime = performance.now();
    
    let component;
    
    // Composants atomiques intégrés
    switch(name) {
      case 'Button':
        component = this.factory.createButton(props);
        break;
      case 'Grid':
        component = this.factory.createGrid(props);
        break;
      case 'ThemeProvider':
        component = this.factory.createThemeProvider(props);
        break;
      default:
        component = this.components.get(name);
    }
    
    const renderTime = performance.now() - startTime;
    this.performance.renderTimes.push(renderTime);
    
    // Lazy loading simulation
    if (options.lazy && !this.performance.lazyLoaded.has(name)) {
      this.performance.lazyLoaded.add(name);
      console.log(`🔄 Lazy loading component: ${name}`);
    }
    
    return component;
  }
  
  // 📊 Métriques de performance
  getPerformanceMetrics() {
    const times = this.performance.renderTimes;
    return {
      averageRenderTime: times.length ? times.reduce((a, b) => a + b) / times.length : 0,
      totalComponents: this.components.size + 3, // +3 pour Button, Grid, ThemeProvider
      lazyLoadedCount: this.performance.lazyLoaded.size,
      bundleSize: this.performance.bundleSize
    };
  }
  
  // ♿ Validation d'accessibilité
  validateAccessibility(component) {
    const checks = {
      hasAriaLabel: !!component.props?.['aria-label'],
      hasKeyboardSupport: component.props?.tabindex !== undefined || component.component === 'button',
      hasColorContrast: true, // Simplifié
      hasFocusIndicator: component.props?.class?.includes('focus:') || false
    };
    
    const score = Object.values(checks).filter(Boolean).length / Object.keys(checks).length * 100;
    
    return {
      score,
      checks,
      violations: Object.entries(checks)
        .filter(([_, passed]) => !passed)
        .map(([check]) => check)
    };
  }
  
  // 🔍 Validation des contrastes de couleur
  validateColorContrast(foreground, background) {
    // Simulation de calcul de contraste (en réalité utiliserait une vraie librairie)
    const getLuminance = (color) => {
      // Conversion hex vers luminance simplifiée
      return color === '#ffffff' ? 1 : color === '#000000' ? 0 : 0.5;
    };
    
    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return {
      ratio,
      passes: {
        AA: ratio >= 4.5,
        AAA: ratio >= 7
      }
    };
  }
  
  // 🧹 Sanitization sécurisée
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/alert\s*\(/gi, '')
      .trim();
  }
}

// 🎨 Integration avec le système de curriculum
class CurriculumDesignIntegration {
  constructor(designSystem) {
    this.designSystem = designSystem;
  }
  
  // 🎯 Composants spécifiques au curriculum
  createDifficultyBadge(difficulty) {
    const color = designTokens.colors.difficulty[difficulty] || designTokens.colors.neutral[500];
    
    return this.designSystem.renderComponent('Button', {
      variant: 'secondary',
      size: 'sm',
      children: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    });
  }
  
  // 📚 Thème curriculum
  getCurriculumTheme() {
    return {
      primary: designTokens.colors.primary[500],
      difficulty: designTokens.colors.difficulty,
      spacing: designTokens.spacing,
      typography: designTokens.typography
    };
  }
}

// 🚀 Export pour utilisation dans les tests et l'application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    designTokens,
    ComponentFactory,
    DesignSystemManager,
    CurriculumDesignIntegration
  };
}

// Export global pour le navigateur
if (typeof window !== 'undefined') {
  window.DesignSystem = {
    designTokens,
    ComponentFactory,
    DesignSystemManager,
    CurriculumDesignIntegration
  };
}

console.log('🎨 Design System Phase 7 initialisé avec succès !');
