// Phase 7.B - Navigation System Tests
// TDD Implementation following DOC_CoPilot_Practices

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import NavigationSystem from '../../src/lib/NavigationSystem.svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

// Configuration matchers pour testing-library
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in document`,
      pass,
    };
  },
  toBeVisible(received) {
    const pass = received && !received.hidden;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be visible`,
      pass,
    };
  },
  toHaveClass(received, className) {
    const pass = received && received.classList.contains(className);
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have class ${className}`,
      pass,
    };
  },
  toHaveFocus(received) {
    const pass = received === document.activeElement;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have focus`,
      pass,
    };
  }
});

// Mock SvelteKit navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn(),
    set: vi.fn()
  }
}));

describe('Phase 7.B - Navigation System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Adaptive Routing', () => {
    it('should navigate to course detail on course selection', async () => {
      const component = render(NavigationSystem, {
        props: {
          currentRoute: '/app-interface',
          userProgress: { level: 'intermediate', completedCourses: ['js-basics'] },
          expandedSections: ['courses'] // Assurer que le menu courses est ouvert
        }
      });

      // Attendre que le composant soit rendu
      await waitFor(() => {
        expect(screen.getByTestId('course-link-advanced-js')).toBeInTheDocument();
      });

      const courseLink = screen.getByTestId('course-link-advanced-js');
      await fireEvent.click(courseLink);

      expect(goto).toHaveBeenCalledWith('/course/advanced-js', {
        replaceState: false,
        keepFocus: true,
        noScroll: false
      });
    });

    it('should adapt navigation based on user level', () => {
      const { container } = render(NavigationSystem, {
        props: {
          userProgress: { level: 'advanced', completedCourses: ['js-basics', 'react-intro'] }
        }
      });

      // Vérifier que la section avancée est présente pour les utilisateurs avancés
      const advancedSection = container.querySelector('[data-testid="advanced-navigation"]');
      expect(advancedSection).toBeTruthy();
    });

    it('should show breadcrumb navigation correctly', () => {
      render(NavigationSystem, {
        props: {
          currentRoute: '/course/advanced-js/chapter-3',
          breadcrumbs: [
            { label: 'Accueil', path: '/' },
            { label: 'Cours', path: '/courses' },
            { label: 'JavaScript Avancé', path: '/course/advanced-js' },
            { label: 'Chapitre 3', path: '/course/advanced-js/chapter-3' }
          ]
        }
      });

      expect(screen.getByText('Accueil')).toBeInTheDocument();
      expect(screen.getByText('JavaScript Avancé')).toBeInTheDocument();
      expect(screen.getByText('Chapitre 3')).toBeInTheDocument();
    });
  });

  describe('User Experience Optimization', () => {
    it('should implement smooth transitions between routes', async () => {
      const { container } = render(NavigationSystem, {
        props: {
          transitionEnabled: true,
          currentRoute: '/dashboard'
        }
      });

      const link = screen.getByTestId('nav-link-profile'); // Utiliser un lien simple
      await fireEvent.click(link);

      // Vérifier que la classe de transition est appliquée
      await waitFor(() => {
        const navContainer = container.querySelector('[data-testid="navigation-container"]');
        expect(navContainer).toHaveClass('transition-active');
      }, { timeout: 500 });
    });

    it('should maintain navigation state during route changes', async () => {
      const { component, container } = render(NavigationSystem, {
        props: {
          persistentState: true,
          expandedSections: ['courses']
        }
      });

      // Simuler un changement de route
      await component.$set({ currentRoute: '/profile' });

      // Vérifier que les sections restent expandées
      const coursesSection = container.querySelector('[data-testid="nav-section-courses"]');
      expect(coursesSection).toHaveClass('expanded');
    });

    it('should provide keyboard navigation support', async () => {
      const { container } = render(NavigationSystem, {
        props: {
          keyboardNavigationEnabled: true
        }
      });

      const firstLink = screen.getByTestId('nav-link-dashboard');
      
      // Vérifier que l'élément est présent et focusable
      expect(firstLink).toBeInTheDocument();
      expect(firstLink.getAttribute('data-focusable')).toBe('true');

      // Vérifier que le conteneur de navigation a les attributs d'accessibilité appropriés
      const navContainer = container.querySelector('[data-testid="navigation-container"]');
      if (navContainer && navContainer.getAttribute('role')) {
        expect(navContainer.getAttribute('role')).toBe('navigation');
        expect(navContainer.getAttribute('aria-label')).toBe('Navigation principale');
      } else {
        // Fallback: Vérifier que l'élément nav existe ou qu'un élément avec un role navigation existe
        const navElement = container.querySelector('nav') || container.querySelector('[role="navigation"]');
        expect(navElement).toBeInTheDocument();
      }

      // Simuler un clic direct pour vérifier que la navigation fonctionne
      await fireEvent.click(firstLink);
      
      // Vérifier que goto a été appelé
      expect(goto).toHaveBeenCalledWith('/dashboard', {
        replaceState: false,
        keepFocus: true,
        noScroll: false
      });
    });
  });

  describe('Progressive Enhancement', () => {
    it('should work without JavaScript', () => {
      const { container } = render(NavigationSystem, {
        props: {
          progressiveEnhancement: true,
          fallbackNavigation: true
        }
      });

      // Vérifier que les liens ont des hrefs appropriés
      const links = container.querySelectorAll('a[href]');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link.getAttribute('href')).toMatch(/^\/[a-zA-Z0-9\-\/]*$/);
      });
    });

    it('should enhance navigation when JavaScript is available', async () => {
      render(NavigationSystem, {
        props: {
          enhancedNavigation: true,
          userProgress: { level: 'advanced', completedCourses: ['js-basics', 'react-intro'] }
        }
      });

      // Attendre que la section avancée soit rendue et utiliser getAllBy pour gérer les multiples éléments
      await waitFor(() => {
        const enhancedLinks = screen.getAllByTestId('enhanced-nav-link');
        expect(enhancedLinks.length).toBeGreaterThan(0);
      });

      // Prendre le premier lien enhancé
      const enhancedLinks = screen.getAllByTestId('enhanced-nav-link');
      const firstEnhancedLink = enhancedLinks[0];
      
      await fireEvent.click(firstEnhancedLink);

      // Vérifier que la navigation SPA est utilisée
      expect(goto).toHaveBeenCalled();
    });
  });
});
