import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

// 🧪 TDD - Page Load Matière selon DOC_CoPilot_Practices
// Load function pour route dynamique /content/[matiere]

export const load = async ({ params }: { params: { matiere: string } }) => {
  try {
    const { matiere } = params;
    
    // Validation basique du paramètre
    if (!matiere || typeof matiere !== 'string' || matiere.trim() === '') {
      throw error(404, 'Matière non trouvée');
    }

    // Normaliser l'ID matière
    const matiereId = matiere.toLowerCase().trim();
    
    // Import dynamique du store content
    const contentModule = await import('$lib/stores/content');
    const contentStore = contentModule.default;
    
    // Récupérer les données mockées via get()
    const mockDataValue = get(contentStore.mockData);
    
    // Récupérer les matières disponibles
    const matieres = mockDataValue.matieres;
    const matiereData = matieres.find((m: any) => m.id === matiereId);
    
    if (!matiereData) {
      throw error(404, `Matière "${matiere}" non trouvée`);
    }

    // Récupérer les niveaux pour cette matière
    const niveaux = mockDataValue.niveaux;
    
    // Récupérer les compétences pour cette matière
    const competences = mockDataValue.competences
      .filter((c: any) => c.matiereId === matiereId);

    // Stats sur la matière
    const stats = {
      nombreNiveaux: niveaux.length,
      nombreCompetences: competences.length,
      nombreCours: mockDataValue.courses
        .filter((course: any) => {
          const competence = competences.find((c: any) => c.id === course.competenceId);
          return competence !== undefined;
        }).length
    };

    return {
      matiere: matiereData,
      niveaux,
      competences,
      stats,
      title: `${matiereData.nom} - FunLearning`,
      description: matiereData.description
    };
  } catch (err) {
    if (err instanceof Error && 'status' in err) {
      throw err; // Re-throw SvelteKit errors
    }
    
    console.error('Erreur lors du chargement de la matière:', err);
    throw error(500, 'Erreur interne du serveur');
  }
};
