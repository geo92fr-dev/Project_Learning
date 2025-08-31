// @ts-nocheck
import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }: Parameters<LayoutLoad>[0]) => {
  const { matiere, niveau, competence } = params;
  
  // Récupérer les données du parent (niveau)
  const parentData = await parent();
  
  // Trouver la compétence correspondante
  const competenceData = (parentData as any).competences.find(
    (c: any) => c.slug === competence
  );
  
  if (!competenceData) {
    throw error(404, `Compétence "${competence}" non trouvée pour ${matiere} en ${niveau}`);
  }
  
  // Vérifier si la compétence est débloquée
  if (competenceData.isUnlocked === false) {
    throw error(403, `Cette compétence n'est pas encore débloquée. Complétez d'abord les prérequis.`);
  }
  
  // Générer les cours pour cette compétence
  const cours = generateCours(competenceData);
  
  return {
    ...parentData,
    competence: competenceData,
    cours,
    breadcrumbs: [
      { label: 'Accueil', href: '/' },
      { label: matiere, href: `/${matiere}` },
      { label: niveau, href: `/${matiere}/${niveau}` },
      { label: competenceData.title, href: `/${matiere}/${niveau}/${competence}` }
    ]
  };
};

function generateCours(competence: any) {
  const coursTypes = ['Introduction', 'Théorie', 'Méthodes', 'Exercices', 'Applications'];
  const coursCount = Math.floor(Math.random() * 3) + 3; // 3-6 cours par compétence
  
  return Array.from({ length: coursCount }, (_, index) => ({
    id: `cours-${index + 1}`,
    slug: `${coursTypes[index % coursTypes.length].toLowerCase()}-${index + 1}`,
    title: `${coursTypes[index % coursTypes.length]} ${index + 1}`,
    description: `${coursTypes[index % coursTypes.length]} sur ${competence.title.toLowerCase()}`,
    type: coursTypes[index % coursTypes.length].toLowerCase(),
    duration: Math.floor(Math.random() * 20) + 10, // 10-30 minutes
    difficulty: competence.difficulty,
    isCompleted: Math.random() > 0.6, // 40% de chance d'être complété
    progress: Math.floor(Math.random() * 100),
    ordre: index + 1
  }));
}
