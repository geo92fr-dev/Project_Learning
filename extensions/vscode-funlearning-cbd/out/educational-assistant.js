"use strict";
/**
 * 📚 Educational Assistant - Assistant pédagogique intelligent
 * Phase 2.1 - Intelligence Contextuelle FunLearning
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationalAssistant = void 0;
class EducationalAssistant {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
    this.levelHierarchy = [
      "6eme",
      "5eme",
      "4eme",
      "3eme",
      "seconde",
      "premiere",
      "terminale",
    ];
    this.competenceFramework = {
      "6eme": [
        "Comprendre et s'exprimer en utilisant la langue française",
        "Comprendre et s'exprimer en utilisant les langages mathématiques",
        "Comprendre et s'exprimer en utilisant les langages scientifiques",
        "Comprendre et s'exprimer en utilisant les langages des arts",
        "Les méthodes et outils pour apprendre",
      ],
      "5eme": [
        "Maîtriser la lecture et l'écriture",
        "Pratiquer différents langages mathématiques",
        "Adopter un comportement éthique et responsable",
        "Se situer dans l'espace et dans le temps",
        "Mobiliser des outils numériques",
      ],
      "4eme": [
        "Analyser et comprendre un document",
        "Pratiquer différents langages pour penser et communiquer",
        "Mobiliser des outils numériques pour apprendre",
        "Adopter un comportement éthique et responsable",
        "Coopérer et mutualiser",
      ],
      "3eme": [
        "Maîtriser l'expression écrite et orale",
        "Utiliser les mathématiques dans différents domaines",
        "Comprendre le monde contemporain",
        "Développer sa sensibilité et sa créativité",
        "Apprendre à apprendre",
      ],
    };
    this.vocabularyLevels = {
      "6eme": { maxComplexity: 3, familiarWords: 0.8 },
      "5eme": { maxComplexity: 4, familiarWords: 0.7 },
      "4eme": { maxComplexity: 5, familiarWords: 0.6 },
      "3eme": { maxComplexity: 6, familiarWords: 0.5 },
    };
  }
  /**
   * 🎓 Valider contenu pédagogique
   */
  async validateEducationalContent(content, targetLevel) {
    const gaps = [];
    const suggestions = [];
    let score = 100;
    // Analyser le niveau de vocabulaire
    const vocabularyAnalysis = this.analyzeVocabulary(content, targetLevel);
    if (!vocabularyAnalysis.appropriate) {
      gaps.push("Vocabulaire trop complexe pour le niveau");
      suggestions.push(
        `Simplifier le vocabulaire (complexité actuelle: ${vocabularyAnalysis.complexity})`
      );
      score -= 20;
    }
    // Analyser la structure pédagogique
    const structureAnalysis = this.analyzeStructure(content);
    if (!structureAnalysis.hasObjectives) {
      gaps.push("Objectifs d'apprentissage manquants");
      suggestions.push("Ajouter des objectifs clairs au début");
      score -= 15;
    }
    if (!structureAnalysis.hasExercises) {
      gaps.push("Exercices pratiques manquants");
      suggestions.push("Inclure des activités interactives");
      score -= 15;
    }
    // Analyser les compétences couvertes
    const competences = this.extractCompetences(content, targetLevel);
    if (competences.length === 0) {
      gaps.push("Aucune compétence identifiée");
      suggestions.push("Expliciter les compétences développées");
      score -= 10;
    }
    // Analyser l'engagement
    const engagementScore = this.analyzeEngagement(content);
    if (engagementScore < 60) {
      gaps.push("Contenu peu engageant");
      suggestions.push("Ajouter des éléments interactifs et ludiques");
      score -= 10;
    }
    // Analyser l'accessibilité
    const accessibilityIssues = this.analyzeAccessibility(content);
    if (accessibilityIssues.length > 0) {
      gaps.push("Problèmes d'accessibilité détectés");
      suggestions.push(
        ...accessibilityIssues.map((issue) => `Corriger: ${issue}`)
      );
      score -= accessibilityIssues.length * 5;
    }
    return {
      isValid: score >= 70,
      level: targetLevel,
      competences,
      gaps,
      suggestions,
      score: Math.max(0, score),
    };
  }
  /**
   * 📝 Analyser vocabulaire
   */
  analyzeVocabulary(content, level) {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const levelConfig = this.vocabularyLevels[level];
    if (!levelConfig) {
      return { appropriate: true, complexity: 3 };
    }
    // Calculer complexité moyenne des mots
    let totalComplexity = 0;
    let complexWords = 0;
    for (const word of words) {
      const complexity = this.getWordComplexity(word);
      totalComplexity += complexity;
      if (complexity > levelConfig.maxComplexity) {
        complexWords++;
      }
    }
    const avgComplexity = totalComplexity / words.length;
    const complexWordRatio = complexWords / words.length;
    return {
      appropriate:
        avgComplexity <= levelConfig.maxComplexity &&
        complexWordRatio <= 1 - levelConfig.familiarWords,
      complexity: avgComplexity,
    };
  }
  /**
   * 🔤 Calculer complexité d'un mot
   */
  getWordComplexity(word) {
    // Mots simples (fréquents)
    const simpleWords = new Set([
      "le",
      "de",
      "et",
      "à",
      "un",
      "il",
      "être",
      "et",
      "en",
      "avoir",
      "que",
      "pour",
      "dans",
      "ce",
      "son",
      "une",
      "sur",
      "avec",
      "ne",
      "se",
      "pas",
      "tout",
      "plus",
      "par",
      "grand",
      "bien",
      "autre",
      "même",
      "très",
      "faire",
      "voir",
      "bon",
    ]);
    if (simpleWords.has(word)) return 1;
    if (word.length <= 4) return 2;
    if (word.length <= 6) return 3;
    if (word.length <= 8) return 4;
    if (word.length <= 10) return 5;
    return 6;
  }
  /**
   * 🏗️ Analyser structure pédagogique
   */
  analyzeStructure(content) {
    const hasObjectives = /objectif|but|apprendre|comprendre|maîtriser/i.test(
      content
    );
    const hasExercises = /exercice|activité|pratique|quiz|question/i.test(
      content
    );
    const hasConclusion = /conclusion|résumé|bilan|synthèse/i.test(content);
    return { hasObjectives, hasExercises, hasConclusion };
  }
  /**
   * 🎯 Extraire compétences
   */
  extractCompetences(content, level) {
    const levelCompetences = this.competenceFramework[level] || [];
    const foundCompetences = [];
    for (const competence of levelCompetences) {
      const keywords = this.getCompetenceKeywords(competence);
      const hasKeywords = keywords.some((keyword) =>
        new RegExp(keyword, "i").test(content)
      );
      if (hasKeywords) {
        foundCompetences.push(competence);
      }
    }
    return foundCompetences;
  }
  /**
   * 🔑 Obtenir mots-clés de compétence
   */
  getCompetenceKeywords(competence) {
    const keywordMap = {
      "langue française": [
        "français",
        "langue",
        "écriture",
        "lecture",
        "orthographe",
        "grammaire",
      ],
      "langages mathématiques": [
        "mathématiques",
        "calcul",
        "nombre",
        "géométrie",
        "algèbre",
      ],
      "langages scientifiques": [
        "science",
        "expérience",
        "observation",
        "hypothèse",
      ],
      "langages des arts": ["art", "créativité", "expression", "esthétique"],
      "outils pour apprendre": [
        "méthode",
        "stratégie",
        "organisation",
        "planification",
      ],
      "outils numériques": [
        "numérique",
        "ordinateur",
        "logiciel",
        "internet",
        "technologie",
      ],
    };
    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (competence.toLowerCase().includes(key)) {
        return keywords;
      }
    }
    return competence.toLowerCase().split(" ");
  }
  /**
   * 🎮 Analyser engagement
   */
  analyzeEngagement(content) {
    let score = 50; // Score de base
    // Éléments engageants
    const engagingElements = [
      { pattern: /\?/g, points: 5, max: 20 }, // Questions
      { pattern: /exemple|cas|situation/gi, points: 10, max: 30 }, // Exemples
      { pattern: /imagine|suppose|si tu/gi, points: 15, max: 30 }, // Mise en situation
      { pattern: /jeu|défi|challenge/gi, points: 20, max: 40 }, // Gamification
      { pattern: /découvrir|explorer|investiguer/gi, points: 10, max: 20 }, // Investigation
      { pattern: /créer|construire|inventer/gi, points: 15, max: 30 }, // Créativité
    ];
    for (const element of engagingElements) {
      const matches = content.match(element.pattern);
      if (matches) {
        score += Math.min(matches.length * element.points, element.max);
      }
    }
    // Pénalités pour contenu passif
    const passiveIndicators = [
      /apprendre par cœur/gi,
      /mémoriser/gi,
      /répéter/gi,
    ];
    for (const indicator of passiveIndicators) {
      const matches = content.match(indicator);
      if (matches) {
        score -= matches.length * 10;
      }
    }
    return Math.max(0, Math.min(100, score));
  }
  /**
   * ♿ Analyser accessibilité
   */
  analyzeAccessibility(content) {
    const issues = [];
    // Vérifier images sans description
    const images = content.match(/!\[.*?\]\(.*?\)/g) || [];
    for (const image of images) {
      if (!/!\[.+\]/.test(image)) {
        issues.push("Image sans texte alternatif");
      }
    }
    // Vérifier longueur des paragraphes
    const paragraphs = content.split("\n\n");
    const longParagraphs = paragraphs.filter((p) => p.length > 500);
    if (longParagraphs.length > 0) {
      issues.push("Paragraphes trop longs (>500 caractères)");
    }
    // Vérifier structure hiérarchique
    const headers = content.match(/^#+\s/gm) || [];
    if (headers.length === 0) {
      issues.push("Manque de titres pour structurer le contenu");
    }
    // Vérifier contrastes de couleur (simulation)
    if (content.includes("color:") || content.includes("background:")) {
      issues.push("Vérifier les contrastes de couleurs");
    }
    return issues;
  }
  /**
   * 📚 Générer contenu éducatif
   */
  async generateEducationalContent(topic, level, competences) {
    const id = `content_${Date.now()}`;
    // Objectifs basés sur les compétences
    const objectives = competences.map(
      (comp) => `Développer la compétence: ${comp.toLowerCase()}`
    );
    // Générer exercices adaptés au niveau
    const exercises = await this.generateExercises(topic, level);
    // Générer critères d'évaluation
    const assessments = this.generateAssessments(competences);
    return {
      id,
      title: `${topic} - Niveau ${level}`,
      level,
      competences,
      objectives,
      content: this.generateContentTemplate(topic, level, objectives),
      exercises,
      assessments,
    };
  }
  /**
   * 🏋️ Générer exercices
   */
  async generateExercises(topic, level) {
    const exercises = [];
    const levelIndex = this.levelHierarchy.indexOf(level);
    const difficulty = Math.max(1, Math.min(5, levelIndex + 1));
    // Quiz de compréhension
    exercises.push({
      id: `quiz_${Date.now()}`,
      type: "quiz",
      question: `Quelle est la définition principale de ${topic} ?`,
      options: [
        "Option A - Réponse simple",
        "Option B - Réponse correcte",
        "Option C - Réponse complexe",
        "Option D - Réponse incorrecte",
      ],
      correctAnswer: "Option B - Réponse correcte",
      explanation: `La réponse B est correcte car elle correspond au niveau ${level}`,
      difficulty,
    });
    // Exercice pratique
    exercises.push({
      id: `practice_${Date.now()}`,
      type: "coding",
      question: `Créez un exemple pratique de ${topic}`,
      explanation:
        "Cet exercice permet de mettre en pratique les concepts théoriques",
      difficulty,
    });
    // Réflexion personnelle
    exercises.push({
      id: `reflection_${Date.now()}`,
      type: "reflection",
      question: `Comment pouvez-vous utiliser ${topic} dans votre quotidien ?`,
      explanation:
        "Cette question favorise la métacognition et le transfert des apprentissages",
      difficulty: Math.max(1, difficulty - 1),
    });
    return exercises;
  }
  /**
   * 📊 Générer évaluations
   */
  generateAssessments(competences) {
    return competences.map((competence, index) => ({
      id: `assessment_${index}`,
      criteria: competence,
      maxScore: 4,
      rubric: [
        "Non atteint (1) - Compétence non démontrée",
        "Partiellement atteint (2) - Compétence en cours d'acquisition",
        "Atteint (3) - Compétence maîtrisée",
        "Dépassé (4) - Compétence expertisée",
      ],
    }));
  }
  /**
   * 📝 Générer template de contenu
   */
  generateContentTemplate(topic, level, objectives) {
    return `# ${topic} - Niveau ${level}

## 🎯 Objectifs d'apprentissage

${objectives.map((obj) => `- ${obj}`).join("\n")}

## 📚 Introduction

Découvrons ensemble le concept de **${topic}**. Ce sujet est adapté à votre niveau ${level} et vous permettra de développer de nouvelles compétences.

## 🔍 Exploration

### Qu'est-ce que ${topic} ?

[Contenu principal à développer selon le sujet]

### Pourquoi est-ce important ?

[Contexte et applications pratiques]

## 💡 Points clés à retenir

- Point important 1
- Point important 2  
- Point important 3

## 🎮 Activités pratiques

[Les exercices générés seront intégrés ici]

## 📈 Pour aller plus loin

Suggestions d'approfondissement adaptées au niveau ${level}.

## ✅ Auto-évaluation

Vérifiez votre compréhension en répondant aux questions d'évaluation.
`;
  }
  /**
   * 🎨 Générer recommandations
   */
  async generateRecommendations(currentLevel, completedTopics) {
    const recommendations = [];
    const levelIndex = this.levelHierarchy.indexOf(currentLevel);
    // Recommandations basées sur le niveau
    if (levelIndex < this.levelHierarchy.length - 1) {
      const nextLevel = this.levelHierarchy[levelIndex + 1];
      recommendations.push(
        `Préparer la transition vers le niveau ${nextLevel}`
      );
    }
    // Recommandations basées sur les sujets complétés
    if (completedTopics.length < 3) {
      recommendations.push("Diversifier les sujets étudiés");
    }
    // Recommandations générales
    recommendations.push("Pratiquer régulièrement avec des exercices variés");
    recommendations.push("Participer à des discussions collaboratives");
    return recommendations;
  }
  /**
   * 📊 Obtenir statistiques d'apprentissage
   */
  async getLearningAnalytics() {
    // Implémentation future avec tracking des données
    return {
      totalContent: 0,
      completionRate: 0,
      averageScore: 0,
      strongAreas: [],
      weakAreas: [],
    };
  }
}
exports.EducationalAssistant = EducationalAssistant;
//# sourceMappingURL=educational-assistant.js.map
