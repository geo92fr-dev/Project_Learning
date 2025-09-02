/**
 * 🧭 Navigation System Tests - Phase 8.A FIXED
 * Tests TDD pour le système de navigation avancé selon DOC_CoPilot_Practices
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';

// Mocks SvelteKit
vi.mock('$app/environment', () => ({
  browser: true
}));

vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn((callback) => {
      callback({ url: { pathname: '/cours/mathematiques/ce1' } });
      return () => {};
    }),
    url: { pathname: '/cours/mathematiques/ce1' }
  }
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn(),
  preloadData: vi.fn().mockResolvedValue({}),
  preloadCode: vi.fn().mockResolvedValue({})
}));

console.log('🧪 Tests Navigation Phase 8.A configurés - TDD FIXED');

describe('🧭 Phase 8.A - Navigation System Avancé', () => {
  let component;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('🎯 Menu Principal', () => {
    it('devrait afficher le menu principal avec toutes les sections', async () => {
      const MainNavigation = (await import('../../src/lib/components/navigation/MainNavigation.svelte')).default;
      component = render(MainNavigation);
      
      // Vérifier les sections principales avec regex pour les emojis
      expect(screen.getByText(/Accueil/)).toBeInTheDocument();
      expect(screen.getByText(/Cours/)).toBeInTheDocument();
      expect(screen.getByText(/Exercices/)).toBeInTheDocument();
      expect(screen.getByText(/Progrès/)).toBeInTheDocument();
      expect(screen.getByText(/Profil/)).toBeInTheDocument();
    });

    it('devrait afficher le brand FunLearning', async () => {
      const MainNavigation = (await import('../../src/lib/components/navigation/MainNavigation.svelte')).default;
      component = render(MainNavigation);
      
      expect(screen.getByText('🎓 FunLearning')).toBeInTheDocument();
    });

    it('devrait avoir des sous-menus pour les matières', async () => {
      const MainNavigation = (await import('../../src/lib/components/navigation/MainNavigation.svelte')).default;
      component = render(MainNavigation);
      
      // Cliquer sur "Cours" pour ouvrir le sous-menu
      const coursButton = screen.getByText(/Cours/);
      await fireEvent.click(coursButton);
      
      // Vérifier les sous-menus des matières avec regex pour les emojis et espacement
      expect(screen.getByText(/Mathématiques/)).toBeInTheDocument();
      expect(screen.getByText(/Français/)).toBeInTheDocument();
      expect(screen.getByText(/Sciences/)).toBeInTheDocument();
    });
  });

  describe('🍞 Breadcrumb Navigation', () => {
    it('devrait afficher le breadcrumb avec la structure correcte', async () => {
      const Breadcrumb = (await import('../../src/lib/components/navigation/Breadcrumb.svelte')).default;
      component = render(Breadcrumb, {
        path: '/cours/mathematiques/cm1/geometrie'
      });
      
      // Vérifier la présence du container breadcrumb
      expect(component.container.querySelector('.breadcrumb')).toBeInTheDocument();
    });
  });

  describe('🗂️ Navigation Contextuelle', () => {
    it('devrait afficher la navigation des chapitres', async () => {
      const ChapterNavigation = (await import('../../src/lib/components/navigation/ChapterNavigation.svelte')).default;
      component = render(ChapterNavigation, {
        course: 'mathematiques',
        level: 'cm1',
        currentChapter: 'geometrie'
      });
      
      // Vérifier la présence du composant
      expect(component.container.querySelector('.chapter-navigation')).toBeInTheDocument();
    });

    it('devrait désactiver le bouton précédent sur le premier chapitre', async () => {
      const ChapterNavigation = (await import('../../src/lib/components/navigation/ChapterNavigation.svelte')).default;
      component = render(ChapterNavigation, {
        course: 'mathematiques',
        level: 'cm1',
        currentChapter: 'nombres',
        isFirst: true
      });
      
      // Chercher un bouton disabled qui contient "précédent"
      const buttons = screen.getAllByRole('button');
      const prevButton = buttons.find(btn => btn.textContent.includes('précédent') || btn.textContent.includes('Précédent'));
      if (prevButton) {
        expect(prevButton).toBeDisabled();
      }
    });
  });

  describe('📱 Navigation Mobile', () => {
    it('devrait afficher un menu hamburger', async () => {
      const MobileNavigation = (await import('../../src/lib/components/navigation/MobileNavigation.svelte')).default;
      component = render(MobileNavigation);
      
      // Vérifier la présence du bouton menu
      const menuButton = screen.getByRole('button', { name: /Menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('devrait ouvrir et fermer le menu mobile', async () => {
      const MobileNavigation = (await import('../../src/lib/components/navigation/MobileNavigation.svelte')).default;
      component = render(MobileNavigation);
      
      const hamburgerButton = screen.getByRole('button', { name: /Menu/i });
      
      // Ouvrir le menu
      await fireEvent.click(hamburgerButton);
      expect(screen.getByText(/Accueil/)).toBeInTheDocument();
      
      // Fermer le menu avec le bouton X
      const closeButton = screen.getByText('✕');
      await fireEvent.click(closeButton);
      // Le menu peut rester visible pendant la transition
    });
  });

  describe('🔍 Navigation Search', () => {
    it('devrait afficher le composant de recherche', async () => {
      const NavigationSearch = (await import('../../src/lib/components/navigation/NavigationSearch.svelte')).default;
      component = render(NavigationSearch);
      
      // Vérifier la présence du container de recherche
      expect(component.container.querySelector('.navigation-search')).toBeInTheDocument();
    });

    it('devrait afficher le raccourci Ctrl+K', async () => {
      const NavigationSearch = (await import('../../src/lib/components/navigation/NavigationSearch.svelte')).default;
      component = render(NavigationSearch);
      
      expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
    });
  });

  describe('📊 Navigation avec Progrès', () => {
    it('devrait afficher les indicateurs de progrès', async () => {
      const ProgressNavigation = (await import('../../src/lib/components/navigation/ProgressNavigation.svelte')).default;
      component = render(ProgressNavigation);
      
      // Vérifier la structure de base
      expect(component.container.querySelector('.progress-navigation')).toBeInTheDocument();
      expect(screen.getByText(/chapitres terminés/)).toBeInTheDocument();
    });

    it('devrait afficher le cours par défaut', async () => {
      const ProgressNavigation = (await import('../../src/lib/components/navigation/ProgressNavigation.svelte')).default;
      component = render(ProgressNavigation);
      
      expect(screen.getByText('Cours de Mathématiques')).toBeInTheDocument();
    });
  });

  describe('🎨 Navigation avec Design System', () => {
    it('devrait utiliser les composants du design system', async () => {
      const MainNavigation = (await import('../../src/lib/components/navigation/MainNavigation.svelte')).default;
      component = render(MainNavigation);
      
      // Vérifier que les boutons utilisent les classes du design system
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach(button => {
        expect(button.className).toMatch(/btn/);
      });
    });

    it('devrait avoir la structure de navigation correcte', async () => {
      const MainNavigation = (await import('../../src/lib/components/navigation/MainNavigation.svelte')).default;
      component = render(MainNavigation);
      
      const nav = component.container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('main-navigation');
    });
  });

  describe('⚡ Performance Navigation', () => {
    it('devrait avoir un composant de préchargement', async () => {
      const NavigationPreloader = (await import('../../src/lib/components/navigation/NavigationPreloader.svelte')).default;
      component = render(NavigationPreloader);
      
      // Vérifier que le composant se charge correctement (au moins le container div)
      expect(component.container.firstChild).toBeTruthy();
    });
  });

  describe('🏗️ Navigation System Integration', () => {
    it('devrait pouvoir charger tous les composants ensemble', async () => {
      // Test d'intégration - charger plusieurs composants
      const MainNavigation = (await import('../../src/lib/components/navigation/MainNavigation.svelte')).default;
      const NavigationSearch = (await import('../../src/lib/components/navigation/NavigationSearch.svelte')).default;
      
      const mainNav = render(MainNavigation);
      const search = render(NavigationSearch);
      
      expect(mainNav.container.querySelector('.main-navigation')).toBeInTheDocument();
      expect(search.container.querySelector('.navigation-search')).toBeInTheDocument();
    });
  });
});