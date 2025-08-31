import { error } from "@sveltejs/kit";
import { get } from "svelte/store";

// 🧪 TDD - Page Load Niveau selon DOC_CoPilot_Practices
// Load function pour route dynamique /content/[matiere]/[niveau]

export const load = async ({
  params,
}: {
  params: { matiere: string; niveau: string };
}) => {
  try {
    const { matiere, niveau } = params;

    // Validation des paramètres
    if (
      !matiere ||
      !niveau ||
      typeof matiere !== "string" ||
      typeof niveau !== "string" ||
      matiere.trim() === "" ||
      niveau.trim() === ""
    ) {
      throw error(404, "Paramètres manquants");
    }

    // Normaliser les IDs
    const matiereId = matiere.toLowerCase().trim();
    const niveauId = niveau.toLowerCase().trim();

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

    // Récupérer les compétences pour cette matière et ce niveau
    const competences = mockDataValue.competences.filter(
      (c: any) => c.matiereId === matiereId && c.niveauId === niveauId
    );

    // Récupérer les cours pour ces compétences
    const courses = mockDataValue.courses.filter((course: any) => {
      const competence = competences.find(
        (c: any) => c.id === course.competenceId
      );
      return competence !== undefined;
    });

    // Stats pour ce niveau
    const stats = {
      nombreCompetences: competences.length,
      nombreCours: courses.length,
      dureeTotal: courses.reduce(
        (total: number, course: any) => total + course.dureeEstimee,
        0
      ),
      difficultesMoyenne:
        competences.length > 0
          ? competences.filter((c: any) => c.difficulte === "moyen").length /
            competences.length
          : 0,
    };

    return {
      matiere: matiereData,
      niveau: niveauData,
      competences,
      courses,
      stats,
      title: `${niveauData.nom} ${matiereData.nom} - FunLearning`,
      description: `Compétences et cours de ${matiereData.nom} pour la ${niveauData.nom}`,
    };
  } catch (err) {
    if (err instanceof Error && "status" in err) {
      throw err; // Re-throw SvelteKit errors
    }

    console.error("Erreur lors du chargement du niveau:", err);
    throw error(500, "Erreur interne du serveur");
  }
};
