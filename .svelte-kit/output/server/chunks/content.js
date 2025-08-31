import { d as derived, r as readable, w as writable } from "./index.js";
const matieres = writable([]);
const niveaux = writable([]);
const competences = writable([]);
const courses = writable([]);
const currentMatiere = writable(null);
const currentNiveau = writable(null);
const currentCompetence = writable(null);
const matiereActive = derived(
  [matieres, currentMatiere],
  ([$matieres, $currentMatiere]) => $matieres.find((m) => m.id === $currentMatiere)
);
const niveauActif = derived(
  [niveaux, currentNiveau],
  ([$niveaux, $currentNiveau]) => $niveaux.find((n) => n.id === $currentNiveau)
);
const competencesFiltered = derived(
  [competences, currentMatiere, currentNiveau],
  ([$competences, $matiere, $niveau]) => $competences.filter(
    (c) => (!$matiere || c.matiereId === $matiere) && (!$niveau || c.niveauId === $niveau)
  )
);
const coursesFiltered = derived(
  [courses, currentCompetence],
  ([$courses, $competence]) => $courses.filter((c) => !$competence || c.competenceId === $competence)
);
const mockData = readable({
  matieres: [
    {
      id: "math",
      nom: "Mathématiques",
      code: "MATH",
      couleur: "#3B82F6",
      icone: "🔢",
      description: "Découvrez les merveilles des mathématiques",
      ordre: 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    },
    {
      id: "francais",
      nom: "Français",
      code: "FR",
      couleur: "#EF4444",
      icone: "📚",
      description: "Maîtrisez la langue française",
      ordre: 2,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    },
    {
      id: "sciences",
      nom: "Sciences",
      code: "SCI",
      couleur: "#10B981",
      icone: "🔬",
      description: "Explorez le monde scientifique",
      ordre: 3,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    }
  ],
  niveaux: [
    {
      id: "6eme",
      nom: "6ème",
      code: "6E",
      ordre: 1,
      ageMin: 11,
      ageMax: 12,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    },
    {
      id: "5eme",
      nom: "5ème",
      code: "5E",
      ordre: 2,
      ageMin: 12,
      ageMax: 13,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    },
    {
      id: "4eme",
      nom: "4ème",
      code: "4E",
      ordre: 3,
      ageMin: 13,
      ageMax: 14,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    }
  ],
  competences: [
    {
      id: "math-calcul",
      nom: "Calcul et opérations",
      description: "Maîtriser les opérations de base",
      matiereId: "math",
      niveauId: "6eme",
      prerequis: [],
      objectifs: ["Maîtriser l'addition", "Comprendre la soustraction"],
      dureeEstimee: 45,
      difficulte: "facile",
      tags: ["calcul", "opérations"],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    },
    {
      id: "fr-grammaire",
      nom: "Grammaire française",
      description: "Comprendre les règles grammaticales",
      matiereId: "francais",
      niveauId: "6eme",
      prerequis: [],
      objectifs: ["Identifier les classes de mots", "Analyser une phrase"],
      dureeEstimee: 60,
      difficulte: "moyen",
      tags: ["grammaire", "syntaxe"],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    }
  ],
  courses: [
    {
      id: "math-addition",
      titre: "L'addition des nombres entiers",
      description: "Apprendre à additionner les nombres entiers",
      competenceId: "math-calcul",
      ordre: 1,
      dureeEstimee: 30,
      type: "cours",
      contenuMarkdown: `# L'addition des nombres entiers

## Introduction

L'addition est l'une des quatre opérations de base en mathématiques.

## Règles de base

1. **Commutativité** : a + b = b + a
2. **Associativité** : (a + b) + c = a + (b + c)
3. **Élément neutre** : a + 0 = a

## Exemples

\`\`\`
5 + 3 = 8
12 + 7 = 19
\`\`\`

## Exercices

Calculez :
- 15 + 8 = ?
- 23 + 17 = ?
`,
      contenuHtml: "",
      ressources: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      actif: true
    }
  ]
});
const contentActions = {
  // Initialiser avec les données de test
  loadMockData() {
    mockData.subscribe((data) => {
      matieres.set(data.matieres);
      niveaux.set(data.niveaux);
      competences.set(data.competences);
      courses.set(data.courses);
    });
  },
  // Navigation
  selectMatiere(matiereId) {
    currentMatiere.set(matiereId);
    currentNiveau.set(null);
    currentCompetence.set(null);
  },
  selectNiveau(niveauId) {
    currentNiveau.set(niveauId);
    currentCompetence.set(null);
  },
  selectCompetence(competenceId) {
    currentCompetence.set(competenceId);
  },
  // Reset navigation
  reset() {
    currentMatiere.set(null);
    currentNiveau.set(null);
    currentCompetence.set(null);
  }
};
const contentStore = {
  matieres,
  niveaux,
  competences,
  courses,
  currentMatiere,
  currentNiveau,
  currentCompetence,
  matiereActive,
  niveauActif,
  competencesFiltered,
  coursesFiltered,
  mockData,
  contentActions
};
export {
  competences,
  competencesFiltered,
  contentActions,
  courses,
  coursesFiltered,
  currentCompetence,
  currentMatiere,
  currentNiveau,
  contentStore as default,
  matiereActive,
  matieres,
  mockData,
  niveauActif,
  niveaux
};
