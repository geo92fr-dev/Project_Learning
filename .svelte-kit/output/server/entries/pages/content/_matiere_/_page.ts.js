import { e as error } from "../../../../chunks/index2.js";
import { g as get_store_value } from "../../../../chunks/utils.js";
const load = async ({ params }) => {
  try {
    const { matiere } = params;
    if (!matiere || typeof matiere !== "string" || matiere.trim() === "") {
      throw error(404, "Matière non trouvée");
    }
    const matiereId = matiere.toLowerCase().trim();
    const contentModule = await import("../../../../chunks/content.js");
    const contentStore = contentModule.default;
    const mockDataValue = get_store_value(contentStore.mockData);
    const matieres = mockDataValue.matieres;
    const matiereData = matieres.find((m) => m.id === matiereId);
    if (!matiereData) {
      throw error(404, `Matière "${matiere}" non trouvée`);
    }
    const niveaux = mockDataValue.niveaux;
    const competences = mockDataValue.competences.filter(
      (c) => c.matiereId === matiereId
    );
    const stats = {
      nombreNiveaux: niveaux.length,
      nombreCompetences: competences.length,
      nombreCours: mockDataValue.courses.filter((course) => {
        const competence = competences.find(
          (c) => c.id === course.competenceId
        );
        return competence !== void 0;
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
    if (err instanceof Error && "status" in err) {
      throw err;
    }
    console.error("Erreur lors du chargement de la matière:", err);
    throw error(500, "Erreur interne du serveur");
  }
};
export {
  load
};
