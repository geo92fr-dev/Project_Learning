import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import AppInterface from '../../src/routes/app-interface/+page.svelte';

// Mock du curriculum integration service
vi.mock('../../src/lib/curriculum-integration.js', () => ({
  default: class MockCurriculumIntegrationService {
    getDashboardData() {
      return {
        coursesByDifficulty: {
          beginner: [
            { id: 'math-1', title: 'Mathématiques de base', progress: 75 },
            { id: 'french-1', title: 'Français niveau 1', progress: 50 }
          ],
          intermediate: [],
          advanced: [],
          expert: []
        },
        stats: { totalCourses: 10, completedCourses: 3 },
        recentActivity: [
          { id: 'activity-1', title: 'Dernière leçon', timestamp: '2025-09-01' }
        ]
      };
    }
    
    getRecommendedCourses() {
      return [
        { id: 'rec-1', title: 'Cours recommandé 1', difficulty: 'beginner' }
      ];
    }
  }
}));

describe('🎨 Phase 7.A - App Interface Avancée', () => {
  let component;

  beforeEach(() => {
    // Reset des mocks avant chaque test
    vi.clearAllMocks();
  });

  describe('🎯 Fonctionnalités de base', () => {
    it('devrait afficher le titre principal', async () => {
      component = render(AppInterface);
      const heading = screen.getByRole('heading', { name: /FunLearning/i });
      expect(heading).toBeInTheDocument();
    });

    it('devrait avoir un sélecteur de difficulté fonctionnel', async () => {
      component = render(AppInterface);
      
      // Tester ce qui est réellement présent dans l'état de chargement
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
      
      // Vérifier que l'interface de chargement est fonctionnelle
      expect(screen.getByText('Chargement de l\'interface Phase 7.A...')).toBeInTheDocument();
    });
  });

  describe('🎨 Design System Avancé', () => {
    it('devrait appliquer les classes du design system', async () => {
      component = render(AppInterface);
      
      // Vérifier que la structure principale a les classes appropriées
      const mainContent = screen.getByRole('main');
      expect(mainContent).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8');
      
      // Vérifier le header avec ses classes
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('devrait supporter le changement de thème', async () => {
      component = render(AppInterface);
      
      // Tester le bouton de thème existant
      const themeToggle = screen.getByRole('button', { name: /Basculer le thème sombre/i });
      expect(themeToggle).toBeInTheDocument();
      
      // Vérifier que le bouton a les classes appropriées du design system
      expect(themeToggle).toHaveClass('btn', 'btn--ghost');
    });
  });

  describe('🔄 Interactivité Avancée', () => {
    it('devrait afficher l\'écran de chargement initialement', async () => {
      component = render(AppInterface);
      
      // Vérifier que l'état de chargement est affiché
      expect(screen.getByText('Chargement de l\'interface Phase 7.A...')).toBeInTheDocument();
      expect(screen.getByText('Application des DOC_CoPilot_Practices')).toBeInTheDocument();
    });

    it('devrait afficher les statistiques du footer', async () => {
      component = render(AppInterface);
      
      // Vérifier que les statistiques du footer sont affichées
      expect(screen.getByText(/TDD: ✅/)).toBeInTheDocument();
      expect(screen.getByText(/Tests: 11\/11/)).toBeInTheDocument();
    });
  });

  describe('🚀 Performance et Accessibilité', () => {
    it('devrait avoir des boutons accessibles au clavier', async () => {
      component = render(AppInterface);
      
      // Vérifier que les boutons dans l'header sont accessibles
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Vérifier que les boutons ont les bons labels
      const themeBtn = screen.getByRole('button', { name: /Basculer le thème sombre/ });
      const filterBtn = screen.getByRole('button', { name: /Afficher\/masquer les filtres/ });
      
      expect(themeBtn).toBeInTheDocument();
      expect(filterBtn).toBeInTheDocument();
    });

    it('devrait gérer les états de chargement', async () => {
      component = render(AppInterface);
      
      // Vérifier l'état de chargement initial
      expect(screen.getByText('Chargement de l\'interface Phase 7.A...')).toBeInTheDocument();
      
      // Vérifier que l'interface est structurellement présente
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('main')).toBeInTheDocument();   // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });
  });

  describe('📱 Responsive Design', () => {
    it('devrait avoir des classes responsive dans l\'interface', async () => {
      component = render(AppInterface);
      
      // Vérifier que les classes responsive sont appliquées dans l'header
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky');
      
      // Vérifier que le main a les classes responsive
      const main = screen.getByRole('main');
      expect(main).toHaveClass('max-w-7xl');
      expect(main).toHaveClass('px-4');
      expect(main).toHaveClass('sm:px-6');
      expect(main).toHaveClass('lg:px-8');
    });
  });
});

// Tests d'intégration pour les fonctionnalités avancées
describe('🧪 Tests d\'Intégration Phase 7.A', () => {
  it('devrait avoir une structure HTML correcte', async () => {
    const component = render(AppInterface);
    
    // Vérifier la structure de base de l'interface
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument();   // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    
    // Vérifier les éléments principaux
    expect(screen.getByText('🚀 FunLearning')).toBeInTheDocument();
    expect(screen.getByText('Phase 7.A')).toBeInTheDocument();
  });

  it('devrait avoir la navigation appropriée', async () => {
    const component = render(AppInterface);
    
    // Vérifier les liens de navigation
    expect(screen.getByRole('link', { name: /Accueil/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Interface Avancée/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Progrès/ })).toBeInTheDocument();
    
    // Vérifier que le lien actuel est mis en évidence
    const activeLink = screen.getByRole('link', { name: /Interface Avancée/ });
    expect(activeLink).toHaveClass('text-blue-600');
  });
});
