import { e as error } from "../../../../../chunks/index2.js";
import { g as get_store_value } from "../../../../../chunks/utils.js";
const load = async ({
  params
}) => {
  try {
    const { matiere, niveau } = params;
    if (!matiere || !niveau || typeof matiere !== "string" || typeof niveau !== "string" || matiere.trim() === "" || niveau.trim() === "") {
      throw error(404, "Paramètres manquants");
    }
    const matiereId = matiere.toLowerCase().trim();
    const niveauId = niveau.toLowerCase().trim();
    const contentModule = await import("../../../../../chunks/content.js");
    const contentStore = contentModule.default;
    const mockDataValue = get_store_value(contentStore.mockData);
    const matiereData = mockDataValue.matieres.find(
      (m) => m.id === matiereId
    );
    if (!matiereData) {
      throw error(404, `Matière "${matiere}" non trouvée`);
    }
    const niveauData = mockDataValue.niveaux.find(
      (n) => n.id === niveauId
    );
    if (!niveauData) {
      throw error(404, `Niveau "${niveau}" non trouvé`);
    }
    const competences = mockDataValue.competences.filter(
      (c) => c.matiereId === matiereId && c.niveauId === niveauId
    );
    const courses = mockDataValue.courses.filter((course) => {
      const competence = competences.find(
        (c) => c.id === course.competenceId
      );
      return competence !== void 0;
    });
    const stats = {
      nombreCompetences: competences.length,
      nombreCours: courses.length,
      dureeTotal: courses.reduce(
        (total, course) => total + course.dureeEstimee,
        0
      ),
      difficultesMoyenne: competences.length > 0 ? competences.filter((c) => c.difficulte === "moyen").length / competences.length : 0
    };
    return {
      matiere: matiereData,
      niveau: niveauData,
      competences,
      courses,
      stats,
      title: `${niveauData.nom} ${matiereData.nom} - FunLearning`,
      description: `Compétences et cours de ${matiereData.nom} pour la ${niveauData.nom}`
    };
  } catch (err) {
    if (err instanceof Error && "status" in err) {
      throw err;
    }
    console.error("Erreur lors du chargement du niveau:", err);
    throw error(500, "Erreur interne du serveur");
  }
};
export {
  load
};
