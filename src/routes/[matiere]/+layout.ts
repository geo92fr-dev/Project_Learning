import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

// Liste des matières disponibles
const AVAILABLE_SUBJECTS = [
  'mathematiques',
  'francais', 
  'anglais',
  'histoire',
  'geographie',
  'sciences'
];

export const load: LayoutLoad = async ({ params }) => {
  const { matiere } = params;
  
  // Vérifier que la matière existe
  if (!AVAILABLE_SUBJECTS.includes(matiere)) {
    throw error(404, `Matière "${matiere}" non trouvée. Matières disponibles : ${AVAILABLE_SUBJECTS.join(', ')}`);
  }
  
  // En production, ces données viendraient de Firebase
  // Pour le moment, on utilise des données statiques de démonstration
  const mockStats = {
    totalCompetences: getCompetenceCount(matiere),
    totalCours: getCourseCount(matiere),
    progression: 0 // À calculer selon l'utilisateur connecté
  };
  
  return {
    matiere,
    stats: mockStats
  };
};

// Fonctions helper pour les données de démonstration
function getCompetenceCount(matiere: string): number {
  const counts: Record<string, number> = {
    'mathematiques': 24,
    'francais': 20,
    'anglais': 18,
    'histoire': 16,
    'geographie': 14,
    'sciences': 22
  };
  return counts[matiere] || 20;
}

function getCourseCount(matiere: string): number {
  const counts: Record<string, number> = {
    'mathematiques': 96,
    'francais': 80,
    'anglais': 72,
    'histoire': 64,
    'geographie': 56,
    'sciences': 88
  };
  return counts[matiere] || 80;
}
