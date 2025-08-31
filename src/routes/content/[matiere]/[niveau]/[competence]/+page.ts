import { error } from "@sveltejs/kit";
import { get } from "svelte/store";

// 🧪 TDD - Page Load Compétence selon DOC_CoPilot_Practices
// Load function pour route dynamique /content/[matiere]/[niveau]/[competence]

export const load = async ({
  params,
}: {
  params: { matiere: string; niveau: string; competence: string };
}) => {
  try {
    const { matiere, niveau, competence } = params;

    // Validation des paramètres
    if (
      !matiere ||
      !niveau ||
      !competence ||
      typeof matiere !== "string" ||
      typeof niveau !== "string" ||
      typeof competence !== "string" ||
      matiere.trim() === "" ||
      niveau.trim() === "" ||
      competence.trim() === ""
    ) {
      throw error(404, "Paramètres manquants");
    }

    // Normaliser les IDs
    const matiereId = matiere.toLowerCase().trim();
    const niveauId = niveau.toLowerCase().trim();
    const competenceId = competence.toLowerCase().trim();

    // Import dynamique du store content
    const contentModule = await import("$lib/stores/content");
    const contentStore = contentModule.default;

    // Récupérer les données mockées
    const mockDataValue = get(contentStore.mockData);

    // Vérifier que la matière existe
    const matiereData = mockDataValue.matieres.find(
      (m: any) => m.id === matiereId
    );
    if (!matiereData) {
      throw error(404, `Matière "${matiere}" non trouvée`);
    }

    // Vérifier que le niveau existe
    const niveauData = mockDataValue.niveaux.find(
      (n: any) => n.id === niveauId
    );
    if (!niveauData) {
      throw error(404, `Niveau "${niveau}" non trouvé`);
    }

    // Vérifier que la compétence existe et correspond à la matière/niveau
    const competenceData = mockDataValue.competences.find(
      (c: any) =>
        c.id === competenceId &&
        c.matiereId === matiereId &&
        c.niveauId === niveauId
    );
    if (!competenceData) {
      throw error(
        404,
        `Compétence "${competence}" non trouvée pour ${matiere}/${niveau}`
      );
    }

    // Récupérer les cours pour cette compétence
    const courses = mockDataValue.courses
      .filter((course: any) => course.competenceId === competenceId)
      .sort((a: any, b: any) => a.ordre - b.ordre);

    // Récupérer les autres compétences du même niveau pour suggestions
    const relatedCompetences = mockDataValue.competences.filter(
      (c: any) =>
        c.matiereId === matiereId &&
        c.niveauId === niveauId &&
        c.id !== competenceId
    );

    // Stats pour cette compétence
    const stats = {
      nombreCours: courses.length,
      dureeTotal: courses.reduce(
        (total: number, course: any) => total + course.dureeEstimee,
        0
      ),
      progression: 0, // À implémenter avec le système de progression
      prerequisSatisfaits: competenceData.prerequis?.length || 0,
    };

    return {
      matiere: matiereData,
      niveau: niveauData,
      competence: competenceData,
      courses,
      relatedCompetences,
      stats,
      title: `${competenceData.nom} - ${niveauData.nom} ${matiereData.nom} - FunLearning`,
      description: competenceData.description,
    };
  } catch (err) {
    if (err instanceof Error && "status" in err) {
      throw err; // Re-throw SvelteKit errors
    }

    console.error("Erreur lors du chargement de la compétence:", err);
    throw error(500, "Erreur interne du serveur");
  }
};
