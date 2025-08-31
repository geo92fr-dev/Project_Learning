import { e as error } from "../../../chunks/index.js";
const AVAILABLE_SUBJECTS = [
  "mathematiques",
  "francais",
  "anglais",
  "histoire",
  "geographie",
  "sciences"
];
const load = async ({ params }) => {
  const { matiere } = params;
  if (!AVAILABLE_SUBJECTS.includes(matiere)) {
    throw error(404, `Matière "${matiere}" non trouvée. Matières disponibles : ${AVAILABLE_SUBJECTS.join(", ")}`);
  }
  const mockStats = {
    totalCompetences: getCompetenceCount(matiere),
    totalCours: getCourseCount(matiere),
    progression: 0
    // À calculer selon l'utilisateur connecté
  };
  return {
    matiere,
    stats: mockStats
  };
};
function getCompetenceCount(matiere) {
  const counts = {
    "mathematiques": 24,
    "francais": 20,
    "anglais": 18,
    "histoire": 16,
    "geographie": 14,
    "sciences": 22
  };
  return counts[matiere] || 20;
}
function getCourseCount(matiere) {
  const counts = {
    "mathematiques": 96,
    "francais": 80,
    "anglais": 72,
    "histoire": 64,
    "geographie": 56,
    "sciences": 88
  };
  return counts[matiere] || 80;
}
export {
  load
};
