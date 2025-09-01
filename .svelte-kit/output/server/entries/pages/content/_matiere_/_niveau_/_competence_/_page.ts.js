import { e as error } from "../../../../../../chunks/index.js";
import { g as get_store_value } from "../../../../../../chunks/utils.js";
const load = async ({
  params
}) => {
  try {
    const { matiere, niveau, competence } = params;
    if (!matiere || !niveau || !competence || typeof matiere !== "string" || typeof niveau !== "string" || typeof competence !== "string" || matiere.trim() === "" || niveau.trim() === "" || competence.trim() === "") {
      throw error(404, "Paramètres manquants");
    }
    const matiereId = matiere.toLowerCase().trim();
    const niveauId = niveau.toLowerCase().trim();
    const competenceId = competence.toLowerCase().trim();
    const contentModule = await import("../../../../../../chunks/content.js");
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
    const competenceData = mockDataValue.competences.find(
      (c) => c.id === competenceId && c.matiereId === matiereId && c.niveauId === niveauId
    );
    if (!competenceData) {
      throw error(
        404,
        `Compétence "${competence}" non trouvée pour ${matiere}/${niveau}`
      );
    }
    const courses = mockDataValue.courses.filter((course) => course.competenceId === competenceId).sort((a, b) => a.ordre - b.ordre);
    const relatedCompetences = mockDataValue.competences.filter(
      (c) => c.matiereId === matiereId && c.niveauId === niveauId && c.id !== competenceId
    );
    const stats = {
      nombreCours: courses.length,
      dureeTotal: courses.reduce(
        (total, course) => total + course.dureeEstimee,
        0
      ),
      progression: 0,
      // À implémenter avec le système de progression
      prerequisSatisfaits: competenceData.prerequis?.length || 0
    };
    return {
      matiere: matiereData,
      niveau: niveauData,
      competence: competenceData,
      courses,
      relatedCompetences,
      stats,
      title: `${competenceData.nom} - ${niveauData.nom} ${matiereData.nom} - FunLearning`,
      description: competenceData.description
    };
  } catch (err) {
    if (err instanceof Error && "status" in err) {
      throw err;
    }
    console.error("Erreur lors du chargement de la compétence:", err);
    throw error(500, "Erreur interne du serveur");
  }
};
export {
  load
};
