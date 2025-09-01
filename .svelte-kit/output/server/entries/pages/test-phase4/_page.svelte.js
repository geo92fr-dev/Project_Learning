import { c as create_ssr_component, o as onDestroy, e as escape, a as each, b as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
import { d as derived, w as writable } from "../../../chunks/index.js";
import { g as get_store_value, s as subscribe } from "../../../chunks/utils.js";
const currentAssessment = writable([]);
const userResponses = writable([]);
const assessmentState = writable("idle");
const currentQuestionIndex = writable(0);
derived(
  [userResponses, assessmentState],
  ([$responses, $state]) => {
    if ($state === "completed" && $responses.length > 0) {
      return analyzeResponses($responses);
    }
    return null;
  }
);
const QUESTION_BANK = [
  // Questions JavaScript - Niveau Débutant
  {
    id: "js-001",
    type: "multiple_choice",
    question: "Quelle est la méthode correcte pour déclarer une variable en JavaScript moderne ?",
    competence: "javascript-fundamentals",
    difficulty: 2,
    options: [
      "var myVar = 5;",
      "let myVar = 5;",
      "myVar = 5;",
      "const myVar;"
    ],
    correct_answer: "let myVar = 5;",
    explanation: "let est la méthode moderne recommandée pour déclarer des variables",
    time_limit: 30,
    skill_indicators: ["variable-declaration", "modern-javascript"]
  },
  // Questions TypeScript - Niveau Intermédiaire  
  {
    id: "ts-001",
    type: "multiple_choice",
    question: "Quel est l'avantage principal de TypeScript par rapport à JavaScript ?",
    competence: "typescript-fundamentals",
    difficulty: 3,
    options: [
      "Plus rapide à l'exécution",
      "Typage statique",
      "Syntaxe plus simple",
      "Compatibilité mobile"
    ],
    correct_answer: "Typage statique",
    explanation: "Le typage statique aide à détecter les erreurs à la compilation",
    time_limit: 45,
    skill_indicators: ["typescript-benefits", "static-typing"]
  },
  // Questions Svelte - Niveau Avancé
  {
    id: "sv-001",
    type: "multiple_choice",
    question: "Comment implémenter une réactivité dérivée en Svelte ?",
    competence: "svelte-advanced",
    difficulty: 4,
    options: [
      "$: derivedValue = baseValue * 2;",
      "derived(baseValue, v => v * 2);",
      "reactive(() => baseValue * 2);",
      "computed(() => baseValue * 2);"
    ],
    correct_answer: "$: derivedValue = baseValue * 2;",
    explanation: "Syntaxe reactive statement de Svelte",
    time_limit: 60,
    skill_indicators: ["svelte-reactivity", "reactive-statements"]
  },
  // Questions HTML/CSS - Niveau Débutant
  {
    id: "html-001",
    type: "multiple_choice",
    question: "Quelle balise HTML est sémantiquement correcte pour un titre principal ?",
    competence: "html-semantics",
    difficulty: 1,
    options: [
      "<title>",
      "<h1>",
      "<header>",
      "<main>"
    ],
    correct_answer: "<h1>",
    explanation: "h1 représente le titre principal d'une page",
    time_limit: 20,
    skill_indicators: ["html-semantics", "accessibility"]
  },
  // Questions Git - Niveau Intermédiaire
  {
    id: "git-001",
    type: "multiple_choice",
    question: "Quelle commande Git permet de fusionner une branche dans la branche actuelle ?",
    competence: "git-workflow",
    difficulty: 3,
    options: [
      "git branch merge",
      "git merge <branche>",
      "git pull <branche>",
      "git join <branche>"
    ],
    correct_answer: "git merge <branche>",
    explanation: "git merge fusionne une branche spécifiée dans la branche actuelle",
    time_limit: 30,
    skill_indicators: ["git-commands", "branch-management"]
  }
];
class AdaptiveEngine {
  responses = [];
  competenceScores = /* @__PURE__ */ new Map();
  /**
   * Calcule la probabilité de maîtrise d'une compétence (Knowledge Tracing)
   */
  calculateMasteryProbability(skill, responses, priorKnowledge = 0.5) {
    if (responses.length === 0)
      return priorKnowledge;
    let probability = priorKnowledge;
    const learningRate = 0.1;
    const slipRate = 0.15;
    for (const response of responses) {
      if (response.correct) {
        probability = probability + (1 - probability) * learningRate;
      } else {
        probability = probability * (1 - slipRate);
      }
    }
    return Math.max(0, Math.min(1, probability));
  }
  /**
   * Adapte la difficulté selon les performances
   */
  adaptDifficulty(responses, currentDifficulty) {
    const correctRate = responses.filter((r) => r.correct).length / responses.length;
    const avgTime = responses.reduce((acc, r) => acc + r.timeSpent, 0) / responses.length;
    let adjustment = 0;
    if (correctRate > 0.8) {
      adjustment += 0.1;
    } else if (correctRate < 0.4) {
      adjustment -= 0.1;
    }
    if (avgTime < 20) {
      adjustment += 0.05;
    } else if (avgTime > 90) {
      adjustment -= 0.05;
    }
    return Math.max(0.1, Math.min(1, currentDifficulty + adjustment));
  }
  /**
   * Calcule les métriques d'engagement
   */
  calculateEngagementMetrics(session) {
    const focus_score = Math.min(1, session.interactions / (session.duration / 60));
    const interaction_rate = session.interactions / session.questionsAnswered;
    const completion_rate = session.questionsAnswered / (session.questionsAnswered + 5);
    const accuracy_rate = session.correctAnswers / session.questionsAnswered;
    return {
      focus_score: Math.max(0, Math.min(1, focus_score)),
      interaction_rate: Math.max(0, interaction_rate),
      completion_rate: Math.max(0, Math.min(1, completion_rate)),
      accuracy_rate: Math.max(0, Math.min(1, accuracy_rate))
    };
  }
  /**
   * Sélectionne la prochaine question basée sur les réponses précédentes
   */
  selectNextQuestion(availableQuestions) {
    const answered = this.responses.map((r) => r.question_id);
    const remaining = availableQuestions.filter((q) => !answered.includes(q.id));
    if (remaining.length === 0)
      return null;
    if (this.responses.length === 0) {
      return remaining.find((q) => q.difficulty === 3) || remaining[0];
    }
    const recentPerformance = this.calculateRecentPerformance();
    if (recentPerformance > 0.8) {
      return remaining.find((q) => q.difficulty >= 4) || remaining.find((q) => q.difficulty === 3) || remaining[0];
    } else if (recentPerformance < 0.4) {
      return remaining.find((q) => q.difficulty <= 2) || remaining.find((q) => q.difficulty === 3) || remaining[0];
    } else {
      return remaining.find((q) => q.difficulty === 3) || remaining.find((q) => q.difficulty === 2) || remaining[0];
    }
  }
  /**
   * Calcule la performance récente (3 dernières questions)
   */
  calculateRecentPerformance() {
    const recentResponses = this.responses.slice(-3);
    if (recentResponses.length === 0)
      return 0.5;
    const correctCount = recentResponses.filter((r) => this.isCorrect(r)).length;
    return correctCount / recentResponses.length;
  }
  /**
   * Vérifie si une réponse est correcte
   */
  isCorrect(response) {
    const question = QUESTION_BANK.find((q) => q.id === response.question_id);
    if (!question)
      return false;
    return question.correct_answer === response.answer;
  }
  /**
   * Met à jour les scores des compétences
   */
  updateCompetenceScores(response) {
    this.responses.push(response);
    const question = QUESTION_BANK.find((q) => q.id === response.question_id);
    if (!question)
      return;
    const isCorrect = this.isCorrect(response);
    const currentScore = this.competenceScores.get(question.competence) || 0.5;
    const learningRate = 0.3;
    const forgettingRate = 0.1;
    if (isCorrect) {
      const newScore = currentScore + (1 - currentScore) * learningRate;
      this.competenceScores.set(question.competence, Math.min(1, newScore));
    } else {
      const newScore = currentScore - currentScore * forgettingRate;
      this.competenceScores.set(question.competence, Math.max(0, newScore));
    }
  }
  /**
   * Détermine si l'évaluation est terminée
   */
  shouldContinue() {
    const minQuestions = 3;
    const maxQuestions = 8;
    const confidenceThreshold = 0.15;
    if (this.responses.length < minQuestions)
      return true;
    if (this.responses.length >= maxQuestions)
      return false;
    const scores = Array.from(this.competenceScores.values());
    if (scores.length < 2)
      return true;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
    return variance > confidenceThreshold;
  }
  /**
   * Génère l'analyse complète des réponses
   */
  generateAnalysis() {
    const correctResponses = this.responses.filter((r) => this.isCorrect(r));
    const totalQuestions = this.responses.length;
    const rawScore = correctResponses.length;
    const percentage = totalQuestions > 0 ? rawScore / totalQuestions * 100 : 0;
    let weightedScore = 0;
    let totalWeight = 0;
    for (const response of this.responses) {
      const question = QUESTION_BANK.find((q) => q.id === response.question_id);
      if (question) {
        const weight = question.difficulty;
        const isCorrect = this.isCorrect(response);
        weightedScore += isCorrect ? weight : 0;
        totalWeight += weight;
      }
    }
    const adjustedScore = totalWeight > 0 ? weightedScore / totalWeight * 100 : 0;
    let competenceLevel;
    if (adjustedScore >= 85)
      competenceLevel = "expert";
    else if (adjustedScore >= 70)
      competenceLevel = "advanced";
    else if (adjustedScore >= 50)
      competenceLevel = "intermediate";
    else
      competenceLevel = "beginner";
    const avgTimePerQuestion = this.responses.length > 0 ? this.responses.reduce((acc, r) => acc + r.time_taken, 0) / this.responses.length : 0;
    const confidenceCorrelation = this.calculateConfidenceCorrelation();
    const difficultyProgression = this.calculateDifficultyProgression();
    const recommendations = this.generateRecommendations(competenceLevel, adjustedScore);
    return {
      rawScore,
      percentage,
      adjustedScore,
      competenceLevel,
      avgTimePerQuestion,
      confidenceCorrelation,
      difficultyProgression,
      recommendations,
      competenceScores: Object.fromEntries(this.competenceScores)
    };
  }
  calculateConfidenceCorrelation() {
    const validResponses = this.responses.filter((r) => r.confidence_level !== void 0);
    if (validResponses.length < 2)
      return 0;
    let correlation = 0;
    let count = 0;
    for (const response of validResponses) {
      const isCorrect = this.isCorrect(response) ? 1 : 0;
      const confidence = (response.confidence_level - 1) / 4;
      correlation += isCorrect === 1 && confidence > 0.6 ? 1 : 0;
      count++;
    }
    return count > 0 ? correlation / count : 0;
  }
  calculateDifficultyProgression() {
    const progression = [0, 0, 0, 0, 0];
    for (const response of this.responses) {
      const question = QUESTION_BANK.find((q) => q.id === response.question_id);
      if (question) {
        const isCorrect = this.isCorrect(response) ? 1 : 0;
        const diffIndex = question.difficulty - 1;
        progression[diffIndex] = isCorrect;
      }
    }
    return progression;
  }
  generateRecommendations(level, score) {
    const recommendations = [];
    if (level === "beginner") {
      recommendations.push("Commencer par les concepts fondamentaux");
      recommendations.push("Privilégier les exercices guidés");
      recommendations.push("Prévoir plus de temps pour chaque concept");
    } else if (level === "intermediate") {
      recommendations.push("Alterner théorie et pratique");
      recommendations.push("Utiliser des projets pratiques");
      recommendations.push("Réviser les bases si nécessaire");
    } else if (level === "advanced") {
      recommendations.push("Aborder des concepts avancés");
      recommendations.push("Travailler sur des projets complexes");
      recommendations.push("Enseigner à d'autres pour renforcer");
    } else {
      recommendations.push("Créer vos propres projets");
      recommendations.push("Explorer des technologies émergentes");
      recommendations.push("Contribuer à des projets open source");
    }
    return recommendations;
  }
}
class PreAssessmentManager {
  adaptiveEngine;
  sessionId;
  userId = "";
  constructor() {
    this.adaptiveEngine = new AdaptiveEngine();
    this.sessionId = this.generateSessionId();
  }
  /**
   * Démarre une nouvelle évaluation
   */
  async startAssessment(userId, targetCompetences) {
    this.userId = userId;
    const relevantQuestions = targetCompetences ? QUESTION_BANK.filter((q) => targetCompetences.includes(q.competence)) : QUESTION_BANK;
    currentAssessment.set(relevantQuestions);
    userResponses.set([]);
    assessmentState.set("running");
    currentQuestionIndex.set(0);
    console.log(`🎯 Pré-évaluation démarrée pour l'utilisateur ${userId}`);
    console.log(`📝 ${relevantQuestions.length} questions disponibles`);
  }
  /**
   * Traite une réponse utilisateur
   */
  async submitResponse(response) {
    const fullResponse = {
      ...response,
      timestamp: /* @__PURE__ */ new Date()
    };
    userResponses.update((responses) => [...responses, fullResponse]);
    this.adaptiveEngine.updateCompetenceScores(fullResponse);
    const shouldContinue = this.adaptiveEngine.shouldContinue();
    if (shouldContinue) {
      const questions = get_store_value(currentAssessment);
      const nextQuestion = this.adaptiveEngine.selectNextQuestion(questions);
      if (nextQuestion) {
        const nextIndex = questions.findIndex((q) => q.id === nextQuestion.id);
        currentQuestionIndex.set(nextIndex);
        return true;
      }
    }
    await this.completeAssessment();
    return false;
  }
  /**
   * Termine l'évaluation et génère le résultat
   */
  async completeAssessment() {
    assessmentState.set("analyzing");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const analysis = this.adaptiveEngine.generateAnalysis();
    console.log("🧠 Analyse de pré-évaluation terminée:", analysis);
    assessmentState.set("completed");
  }
  /**
   * Récupère la question actuelle
   */
  getCurrentQuestion() {
    const questions = get_store_value(currentAssessment);
    const index = get_store_value(currentQuestionIndex);
    return questions[index] || null;
  }
  /**
   * Récupère la prochaine question recommandée
   */
  getNextRecommendedQuestion() {
    const questions = get_store_value(currentAssessment);
    return this.adaptiveEngine.selectNextQuestion(questions);
  }
  /**
   * Génère un ID de session unique
   */
  generateSessionId() {
    return `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Génère le résultat complet de l'évaluation
   */
  generateResult() {
    const responses = get_store_value(userResponses);
    const questions = get_store_value(currentAssessment);
    if (responses.length === 0)
      return null;
    const analysis = this.adaptiveEngine.generateAnalysis();
    const startTime = responses[0]?.timestamp;
    const endTime = responses[responses.length - 1]?.timestamp;
    const totalDuration = endTime && startTime ? endTime.getTime() - startTime.getTime() : 0;
    const adaptivePath = {
      user_id: this.userId,
      competence: questions[0]?.competence || "general",
      current_level: analysis.competenceLevel,
      target_level: this.getTargetLevel(analysis.competenceLevel),
      estimated_completion_time: this.estimatePathDuration(analysis.competenceLevel),
      learning_style: this.generateLearningStyle(),
      recommended_resources: [],
      milestones: this.generateMilestones(analysis.competenceLevel),
      adaptation_triggers: [],
      personalization_factors: []
    };
    const result = {
      user_id: this.userId,
      competence: questions[0]?.competence || "general",
      session_id: this.sessionId,
      start_time: startTime || /* @__PURE__ */ new Date(),
      end_time: endTime || /* @__PURE__ */ new Date(),
      total_duration: totalDuration,
      questions: questions.filter((q) => responses.some((r) => r.question_id === q.id)),
      responses,
      score: {
        raw_score: analysis.rawScore,
        percentage: analysis.percentage,
        adjusted_score: analysis.adjustedScore,
        competence_level: analysis.competenceLevel
      },
      analytics: {
        average_time_per_question: analysis.avgTimePerQuestion,
        confidence_correlation: analysis.confidenceCorrelation,
        difficulty_progression: analysis.difficultyProgression,
        recommendations: analysis.recommendations
      },
      adaptive_path: adaptivePath
    };
    return result;
  }
  estimatePathDuration(level) {
    switch (level) {
      case "beginner":
        return 20;
      case "intermediate":
        return 15;
      case "advanced":
        return 10;
      case "expert":
        return 5;
      default:
        return 15;
    }
  }
  getTargetLevel(currentLevel) {
    switch (currentLevel) {
      case "beginner":
        return "intermediate";
      case "intermediate":
        return "advanced";
      case "advanced":
        return "expert";
      case "expert":
        return "expert";
      default:
        return "intermediate";
    }
  }
  generateLearningStyle() {
    return {
      visual: 70,
      auditory: 20,
      kinesthetic: 50,
      reading_writing: 60,
      dominant_style: "visual",
      learning_pace: "normal",
      attention_span: "medium"
    };
  }
  generateMilestones(level) {
    const baseMilestones = [
      {
        title: "Concepts fondamentaux",
        estimated_duration: 25,
        completion_criteria: ["Comprendre les bases"],
        resources: []
      },
      {
        title: "Application pratique",
        estimated_duration: 35,
        completion_criteria: ["Réaliser des exercices"],
        resources: []
      },
      {
        title: "Projet personnel",
        estimated_duration: 40,
        completion_criteria: ["Créer un projet"],
        resources: []
      }
    ];
    if (level === "beginner") {
      return [
        {
          title: "Initiation",
          estimated_duration: 20,
          completion_criteria: ["Découvrir les concepts"],
          resources: []
        },
        ...baseMilestones
      ];
    }
    return baseMilestones;
  }
  /**
   * Remet à zéro l'évaluation
   */
  reset() {
    currentAssessment.set([]);
    userResponses.set([]);
    assessmentState.set("idle");
    currentQuestionIndex.set(0);
    this.adaptiveEngine = new AdaptiveEngine();
    this.sessionId = this.generateSessionId();
    this.userId = "";
  }
}
function analyzeResponses(responses) {
  if (responses.length === 0)
    return null;
  const engine = new AdaptiveEngine();
  for (const response of responses) {
    engine.updateCompetenceScores(response);
  }
  return engine.generateAnalysis();
}
new PreAssessmentManager();
const currentPrompt = writable(null);
const promptHistory = writable([]);
const metacognitionState = writable("idle");
const reflectionQuality = writable(0);
derived(
  [promptHistory],
  ([$history]) => {
    if ($history.length === 0)
      return null;
    return analyzeMetacognitiveStrategies($history);
  }
);
const PROMPT_BANK = [
  // Prompts de planification - Avant l'apprentissage
  {
    id: "plan-001",
    type: "self_assessment",
    trigger: "before_lesson",
    question: "Avant de commencer cette leçon, que savez-vous déjà sur ce sujet ?",
    sub_questions: [
      "Quelles sont vos connaissances préalables ?",
      "Qu'espérez-vous apprendre ?",
      "Quelles stratégies allez-vous utiliser ?"
    ],
    guidance: "Prenez un moment pour réfléchir à vos connaissances actuelles. Cela vous aidera à mieux comprendre les nouveaux concepts.",
    expected_elements: ["connaissances préalables", "objectifs d'apprentissage", "stratégies"],
    competence_focus: "metacognition-planning"
  },
  {
    id: "plan-002",
    type: "strategy",
    trigger: "before_lesson",
    question: "Comment allez-vous organiser votre temps d'apprentissage pour cette session ?",
    sub_questions: [
      "Combien de temps avez-vous prévu ?",
      "Comment allez-vous diviser ce temps ?",
      "Que ferez-vous si vous rencontrez des difficultés ?"
    ],
    guidance: "Une bonne planification améliore l'efficacité de l'apprentissage. Pensez à prévoir du temps pour la révision.",
    expected_elements: ["gestion du temps", "stratégies de résolution", "planification"],
    competence_focus: "time-management"
  },
  // Prompts de monitoring - Pendant l'apprentissage
  {
    id: "monitor-001",
    type: "monitoring",
    trigger: "during_lesson",
    question: "À ce stade, comprenez-vous bien les concepts présentés ?",
    sub_questions: [
      "Quels points vous semblent clairs ?",
      "Y a-t-il des éléments confus ?",
      "Avez-vous besoin d'ajuster votre approche ?"
    ],
    guidance: "Faire le point régulièrement permet d'identifier les difficultés avant qu'elles s'accumulent.",
    expected_elements: ["compréhension", "auto-évaluation", "ajustements"],
    competence_focus: "self-monitoring"
  },
  {
    id: "monitor-002",
    type: "monitoring",
    trigger: "during_lesson",
    question: "Votre stratégie d'apprentissage fonctionne-t-elle bien pour ce contenu ?",
    sub_questions: [
      "Êtes-vous satisfait de votre progression ?",
      "Devriez-vous changer d'approche ?",
      "Qu'est-ce qui vous aide le mieux à comprendre ?"
    ],
    guidance: "Adapter sa stratégie en cours de route est une compétence métacognitive importante.",
    expected_elements: ["évaluation stratégie", "adaptation", "préférences d'apprentissage"],
    competence_focus: "strategy-adaptation"
  },
  // Prompts d'évaluation - Après l'apprentissage
  {
    id: "eval-001",
    type: "evaluation",
    trigger: "after_lesson",
    question: "Maintenant que vous avez terminé cette leçon, qu'avez-vous retenu ?",
    sub_questions: [
      "Quels sont les points clés que vous avez appris ?",
      "Qu'est-ce qui reste flou ?",
      "Comment pourriez-vous améliorer votre compréhension ?"
    ],
    guidance: "La réflexion après l'apprentissage consolide les connaissances et aide à identifier les lacunes.",
    expected_elements: ["synthèse", "identification lacunes", "pistes amélioration"],
    competence_focus: "knowledge-consolidation"
  },
  {
    id: "eval-002",
    type: "evaluation",
    trigger: "after_lesson",
    question: "Comment évaluez-vous l'efficacité de votre session d'apprentissage ?",
    sub_questions: [
      "Vos objectifs ont-ils été atteints ?",
      "Qu'est-ce qui a bien fonctionné ?",
      "Que feriez-vous différemment la prochaine fois ?"
    ],
    guidance: "Évaluer ses méthodes d'apprentissage permet de s'améliorer continuellement.",
    expected_elements: ["auto-évaluation", "points positifs", "améliorations"],
    competence_focus: "self-evaluation"
  },
  // Prompts de stratégie - Après exercices
  {
    id: "strategy-001",
    type: "strategy",
    trigger: "after_exercise",
    question: "Comment avez-vous abordé cet exercice ? Décrivez votre démarche.",
    sub_questions: [
      "Quelle était votre première approche ?",
      "Avez-vous rencontré des obstacles ?",
      "Comment les avez-vous surmontés ?"
    ],
    guidance: "Prendre conscience de sa démarche de résolution aide à développer de meilleures stratégies.",
    expected_elements: ["méthode de résolution", "gestion obstacles", "processus de pensée"],
    competence_focus: "problem-solving"
  },
  {
    id: "reflect-001",
    type: "reflection",
    trigger: "after_exercise",
    question: "Que vous a appris cet exercice sur votre façon d'apprendre ?",
    sub_questions: [
      "Quelles sont vos forces ?",
      "Quels sont vos points d'amélioration ?",
      "Comment appliquer ces insights à l'avenir ?"
    ],
    guidance: "La réflexion sur ses propres processus d'apprentissage est au cœur de la métacognition.",
    expected_elements: ["auto-connaissance", "forces/faiblesses", "transfert"],
    competence_focus: "self-knowledge"
  }
];
class ResponseAnalyzer {
  /**
   * Analyse la qualité d'une réponse métacognitive
   */
  analyzeResponseQuality(response, prompt) {
    let qualityScore = 0;
    const maxScore = 100;
    const wordCount = response.word_count;
    if (wordCount >= 50)
      qualityScore += 20;
    else if (wordCount >= 25)
      qualityScore += 15;
    else if (wordCount >= 10)
      qualityScore += 10;
    else
      qualityScore += 5;
    const content = response.content.toLowerCase();
    let elementsFound = 0;
    for (const element of prompt.expected_elements) {
      if (content.includes(element.toLowerCase()) || this.containsSemanticEquivalent(content, element)) {
        elementsFound++;
      }
    }
    qualityScore += elementsFound / prompt.expected_elements.length * 30;
    const depthIndicators = [
      "parce que",
      "car",
      "donc",
      "ainsi",
      "par conséquent",
      "je pense que",
      "je crois que",
      "il me semble",
      "par exemple",
      "notamment",
      "en particulier",
      "cependant",
      "néanmoins",
      "toutefois",
      "mais"
    ];
    let depthScore = 0;
    for (const indicator of depthIndicators) {
      if (content.includes(indicator))
        depthScore += 3;
    }
    qualityScore += Math.min(25, depthScore);
    const strategies = this.identifyStrategies(content);
    qualityScore += strategies.length / 3 * 25;
    return Math.min(maxScore, qualityScore);
  }
  /**
   * Identifie les stratégies métacognitives dans une réponse
   */
  identifyStrategies(content) {
    const strategies = [];
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("planifier") || lowerContent.includes("organiser") || lowerContent.includes("préparer") || lowerContent.includes("objectif")) {
      strategies.push({
        type: "planning",
        description: "Planification et organisation",
        effectiveness: 4,
        context: "Organisation préalable de l'apprentissage"
      });
    }
    if (lowerContent.includes("vérifier") || lowerContent.includes("contrôler") || lowerContent.includes("surveiller") || lowerContent.includes("suivre")) {
      strategies.push({
        type: "monitoring",
        description: "Auto-surveillance et contrôle",
        effectiveness: 4,
        context: "Suivi de la compréhension en temps réel"
      });
    }
    if (lowerContent.includes("évaluer") || lowerContent.includes("juger") || lowerContent.includes("analyser") || lowerContent.includes("bilan")) {
      strategies.push({
        type: "evaluating",
        description: "Évaluation et bilan",
        effectiveness: 4,
        context: "Évaluation des résultats d'apprentissage"
      });
    }
    if (lowerContent.includes("erreur") || lowerContent.includes("problème") || lowerContent.includes("difficulté") || lowerContent.includes("corriger")) {
      strategies.push({
        type: "debugging",
        description: "Détection et correction d'erreurs",
        effectiveness: 5,
        context: "Résolution de problèmes d'apprentissage"
      });
    }
    if (lowerContent.includes("réviser") || lowerContent.includes("revoir") || lowerContent.includes("répéter") || lowerContent.includes("reprendre")) {
      strategies.push({
        type: "reviewing",
        description: "Révision et consolidation",
        effectiveness: 3,
        context: "Renforcement des connaissances"
      });
    }
    return strategies;
  }
  /**
   * Vérifie si le contenu contient un équivalent sémantique
   */
  containsSemanticEquivalent(content, target) {
    const equivalents = {
      "connaissances préalables": ["ce que je sais", "mes acquis", "baggage", "expérience"],
      "objectifs d'apprentissage": ["but", "goal", "objectif", "viser", "atteindre"],
      "stratégies": ["méthode", "approche", "technique", "façon de faire"],
      "gestion du temps": ["temps", "durée", "horaire", "planning"],
      "compréhension": ["comprendre", "saisir", "clair", "évident"],
      "auto-évaluation": ["me juger", "évaluer mes", "bilan personnel"]
    };
    const targetEquivalents = equivalents[target] || [];
    return targetEquivalents.some((equiv) => content.includes(equiv));
  }
}
class MetacognitionPromptBank {
  /**
   * Sélectionne un prompt approprié selon le contexte
   */
  selectPrompt(trigger, competenceFocus, previousPrompts = []) {
    let candidates = PROMPT_BANK.filter((p) => p.trigger === trigger);
    candidates = candidates.filter((p) => !previousPrompts.includes(p.id));
    if (competenceFocus) {
      const focused = candidates.filter((p) => p.competence_focus === competenceFocus);
      if (focused.length > 0)
        candidates = focused;
    }
    if (candidates.length === 0)
      return null;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
  /**
   * Récupère tous les prompts d'un type donné
   */
  getPromptsByType(type) {
    return PROMPT_BANK.filter((p) => p.type === type);
  }
  /**
   * Récupère tous les prompts d'un trigger donné
   */
  getPromptsByTrigger(trigger) {
    return PROMPT_BANK.filter((p) => p.trigger === trigger);
  }
}
class MetacognitionService {
  promptBank;
  analyzer;
  sessionId;
  userId = "";
  constructor() {
    this.promptBank = new MetacognitionPromptBank();
    this.analyzer = new ResponseAnalyzer();
    this.sessionId = this.generateSessionId();
  }
  /**
   * Génère des prompts adaptés au niveau
   */
  generatePromptsForLevel(level, subject) {
    const basePrompts = [
      "Quelle stratégie avez-vous utilisée pour aborder ce problème ?",
      "Qu'est-ce qui vous a semblé le plus difficile ?",
      "Comment évaluez-vous votre confiance dans vos réponses ?"
    ];
    return basePrompts.map((prompt, index) => ({
      id: `${level}-${subject}-${index}`,
      type: "reflection",
      trigger: "during_lesson",
      question: this.adaptPromptToLevel(prompt, level),
      sub_questions: [],
      guidance: `Réfléchissez attentivement à votre processus d'apprentissage`,
      expected_elements: ["stratégie", "difficulté", "confiance"],
      competence_focus: subject
    }));
  }
  /**
   * Analyse les réponses de réflexion
   */
  analyzeReflection(responses) {
    const strategies = this.identifyStrategies(responses);
    const awarenessLevel = this.evaluateAwarenessLevel(responses);
    return {
      strategies,
      awarenessLevel,
      recommendations: this.generateTestRecommendations(strategies, awarenessLevel)
    };
  }
  /**
   * Identifie les stratégies d'apprentissage
   */
  identifyStrategies(responses) {
    const strategies = [];
    for (const response of responses) {
      if (!response.response)
        continue;
      const text = response.response.toLowerCase();
      if (text.includes("répét") || text.includes("relis") || text.includes("revoi")) {
        strategies.push("Répétition");
      }
      if (text.includes("schéma") || text.includes("diagram") || text.includes("visualis")) {
        strategies.push("Visualisation");
      }
      if (text.includes("résumé") || text.includes("synthès") || text.includes("plan")) {
        strategies.push("Organisation");
      }
      if (text.includes("exemple") || text.includes("analogie") || text.includes("compar")) {
        strategies.push("Elaboration");
      }
      if (text.includes("vérifie") || text.includes("test") || text.includes("contrôl")) {
        strategies.push("Autorégulation");
      }
    }
    return [...new Set(strategies)];
  }
  /**
   * Évalue le niveau de conscience métacognitive
   */
  evaluateAwarenessLevel(responses) {
    let score = 0;
    const totalResponses = responses.length;
    for (const response of responses) {
      if (!response.response)
        continue;
      const text = response.response.toLowerCase();
      const wordCount = text.split(" ").length;
      if (wordCount > 20)
        score += 1;
      if (text.includes("parce que") || text.includes("car") || text.includes("donc"))
        score += 1;
      if (text.includes("stratégie") || text.includes("méthode") || text.includes("approche"))
        score += 1;
      if (text.includes("difficile") || text.includes("facile") || text.includes("compris"))
        score += 1;
    }
    const average = totalResponses > 0 ? score / (totalResponses * 4) : 0;
    if (average > 0.7)
      return "Élevé";
    if (average > 0.4)
      return "Moyen";
    return "Faible";
  }
  /**
   * Génère des recommandations basées sur l'analyse (nouvelle méthode pour tests)
   */
  generateTestRecommendations(strategies, awarenessLevel) {
    const recommendations = [];
    if (awarenessLevel === "Faible") {
      recommendations.push("Pratiquez l'autoréflexion régulièrement");
      recommendations.push("Posez-vous des questions sur votre processus d'apprentissage");
    }
    if (strategies.length < 2) {
      recommendations.push("Diversifiez vos stratégies d'apprentissage");
    }
    if (!strategies.includes("Autorégulation")) {
      recommendations.push("Développez vos capacités d'autocontrôle et de vérification");
    }
    return recommendations;
  }
  /**
   * Méthodes utilitaires
   */
  getCategoryForLevel(level) {
    switch (level) {
      case "beginner":
        return "Découverte";
      case "intermediate":
        return "Approfondissement";
      case "advanced":
        return "Maîtrise";
      default:
        return "Réflexion";
    }
  }
  adaptPromptToLevel(prompt, level) {
    if (level === "beginner") {
      return prompt.replace(/complexe|avancé|sophistiqué/g, "simple");
    }
    if (level === "advanced") {
      return prompt + " Analysez en détail vos processus cognitifs.";
    }
    return prompt;
  }
  /**
   * Démarre une session de métacognition
   */
  startSession(userId) {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
    metacognitionState.set("idle");
    console.log(`🧠 Session métacognition démarrée pour ${userId}`);
  }
  /**
   * Déclenche un prompt de métacognition
   */
  triggerPrompt(trigger, competenceFocus) {
    const history = get_store_value(promptHistory);
    const recentPrompts = history.slice(-3).map((r) => r.prompt_id);
    const prompt = this.promptBank.selectPrompt(trigger, competenceFocus, recentPrompts);
    if (prompt) {
      currentPrompt.set(prompt);
      metacognitionState.set("prompting");
      console.log(`💭 Prompt déclenché: ${prompt.question}`);
    }
    return prompt;
  }
  /**
   * Traite une réponse utilisateur
   */
  async submitResponse(content, promptId) {
    const prompt = PROMPT_BANK.find((p) => p.id === promptId);
    if (!prompt) {
      console.error("Prompt non trouvé:", promptId);
      return;
    }
    metacognitionState.set("analyzing");
    const response = {
      prompt_id: promptId,
      user_id: this.userId,
      session_id: this.sessionId,
      content: content.trim(),
      timestamp: /* @__PURE__ */ new Date(),
      word_count: content.trim().split(/\s+/).length,
      reflection_depth: this.calculateReflectionDepth(content),
      keywords_identified: this.extractKeywords(content),
      metacognitive_strategies: this.analyzer.identifyStrategies(content)
    };
    const quality = this.analyzer.analyzeResponseQuality(response, prompt);
    reflectionQuality.set(quality);
    promptHistory.update((history) => [...history, response]);
    await new Promise((resolve) => setTimeout(resolve, 800));
    metacognitionState.set("completed");
    currentPrompt.set(null);
    console.log(`✅ Réponse analysée - Qualité: ${quality}/100`);
  }
  /**
   * Calcule la profondeur de réflexion
   */
  calculateReflectionDepth(content) {
    const lowerContent = content.toLowerCase();
    let depth = 1;
    const depthIndicators = [
      ["parce que", "car", "donc"],
      // Causalité (+1)
      ["cependant", "mais", "néanmoins"],
      // Nuances (+1)
      ["par exemple", "notamment"],
      // Exemples (+1)
      ["je pense que", "il me semble"],
      // Métaréflexion (+1)
      ["cela me rappelle", "je fais le lien"]
      // Connexions (+1)
    ];
    for (const indicators of depthIndicators) {
      if (indicators.some((indicator) => lowerContent.includes(indicator))) {
        depth++;
      }
    }
    return Math.min(5, depth);
  }
  /**
   * Extrait les mots-clés pédagogiques
   */
  extractKeywords(content) {
    const keywords = [];
    const lowerContent = content.toLowerCase();
    const pedagogicalKeywords = [
      "apprendre",
      "comprendre",
      "mémoriser",
      "réviser",
      "stratégie",
      "méthode",
      "technique",
      "approche",
      "objectif",
      "but",
      "goal",
      "cible",
      "difficile",
      "facile",
      "complexe",
      "simple",
      "temps",
      "durée",
      "rythme",
      "vitesse",
      "erreur",
      "faute",
      "problème",
      "obstacle",
      "réussir",
      "échouer",
      "progression",
      "amélioration"
    ];
    for (const keyword of pedagogicalKeywords) {
      if (lowerContent.includes(keyword)) {
        keywords.push(keyword);
      }
    }
    return [...new Set(keywords)];
  }
  /**
   * Génère un rapport d'analyse métacognitive
   */
  generateAnalysisReport() {
    const history = get_store_value(promptHistory);
    if (history.length === 0) {
      return {
        totalResponses: 0,
        averageQuality: 0,
        strategiesUsed: [],
        reflectionTrend: [],
        recommendations: []
      };
    }
    const qualityScores = history.map((response) => {
      const prompt = PROMPT_BANK.find((p) => p.id === response.prompt_id);
      return prompt ? this.analyzer.analyzeResponseQuality(response, prompt) : 0;
    });
    const averageQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
    const allStrategies = history.flatMap((r) => r.metacognitive_strategies);
    const strategyTypes = [...new Set(allStrategies.map((s) => s.type))];
    const reflectionTrend = history.map((r) => r.reflection_depth);
    const recommendations = this.generateRecommendations(history, averageQuality);
    return {
      totalResponses: history.length,
      averageQuality: Math.round(averageQuality),
      strategiesUsed: strategyTypes,
      reflectionTrend,
      recommendations,
      sessionId: this.sessionId
    };
  }
  /**
   * Génère des recommandations personnalisées
   */
  generateRecommendations(history, avgQuality) {
    const recommendations = [];
    if (avgQuality < 50) {
      recommendations.push("Essayez d'être plus détaillé dans vos réflexions");
      recommendations.push("Prenez plus de temps pour analyser vos processus d'apprentissage");
    }
    if (avgQuality >= 50 && avgQuality < 75) {
      recommendations.push("Continuez à développer vos réflexions métacognitives");
      recommendations.push("Essayez d'identifier plus de stratégies d'apprentissage");
    }
    if (avgQuality >= 75) {
      recommendations.push("Excellente qualité de réflexion ! Maintenez cette approche");
      recommendations.push("Partagez vos stratégies avec d'autres apprenants");
    }
    const usedStrategies = new Set(history.flatMap((r) => r.metacognitive_strategies.map((s) => s.type)));
    if (!usedStrategies.has("planning")) {
      recommendations.push("Pensez à planifier davantage vos sessions d'apprentissage");
    }
    if (!usedStrategies.has("monitoring")) {
      recommendations.push("Surveillez plus régulièrement votre compréhension pendant l'apprentissage");
    }
    if (!usedStrategies.has("evaluating")) {
      recommendations.push("Prenez du temps pour évaluer vos acquis après chaque session");
    }
    return recommendations;
  }
  /**
   * Génère un ID de session unique
   */
  generateSessionId() {
    return `metacog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Remet à zéro la session
   */
  reset() {
    currentPrompt.set(null);
    promptHistory.set([]);
    metacognitionState.set("idle");
    reflectionQuality.set(0);
    this.sessionId = this.generateSessionId();
    this.userId = "";
  }
}
function analyzeMetacognitiveStrategies(responses) {
  if (responses.length === 0)
    return null;
  const allStrategies = responses.flatMap((r) => r.metacognitive_strategies);
  const strategyDistribution = {};
  for (const strategy of allStrategies) {
    strategyDistribution[strategy.type] = (strategyDistribution[strategy.type] || 0) + 1;
  }
  const dominantStrategy = Object.entries(strategyDistribution).sort(([, a], [, b]) => b - a)[0]?.[0] || "none";
  const averageEffectiveness = allStrategies.length > 0 ? allStrategies.reduce((acc, s) => acc + s.effectiveness, 0) / allStrategies.length : 0;
  return {
    totalStrategies: allStrategies.length,
    uniqueStrategies: Object.keys(strategyDistribution).length,
    dominantStrategy,
    strategyDistribution,
    averageEffectiveness: Math.round(averageEffectiveness * 100) / 100
  };
}
new MetacognitionService();
const currentPreEvaluation = writable(null);
const currentQuestion = writable(null);
const evaluationProgress = writable(0);
const evaluationState = derived(
  [currentPreEvaluation, currentQuestion, evaluationProgress],
  ([$preEval, $question, $progress]) => ({
    isActive: $preEval !== null,
    currentQuestion: $question,
    progress: $progress,
    isComplete: $progress >= 100
  })
);
const PreEvaluationQuiz_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".pre-evaluation-container.svelte-1dspto9.svelte-1dspto9{animation:svelte-1dspto9-fadeInUp 0.6s ease-out}@keyframes svelte-1dspto9-fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.progress-fill.svelte-1dspto9.svelte-1dspto9{background:linear-gradient(90deg, #3b82f6, #1d4ed8)}.answer-option.svelte-1dspto9.svelte-1dspto9:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0, 0, 0, 0.1)}.confidence-indicator.svelte-1dspto9.svelte-1dspto9{transition:all 0.2s ease}.confidence-indicator.svelte-1dspto9.svelte-1dspto9:hover{transform:scale(1.05)}.submit-btn.svelte-1dspto9.svelte-1dspto9{background:linear-gradient(135deg, #3b82f6, #1d4ed8)}.submit-btn.svelte-1dspto9.svelte-1dspto9:hover:not(:disabled){background:linear-gradient(135deg, #1d4ed8, #1e40af);transform:translateY(-1px);box-shadow:0 4px 12px rgba(59, 130, 246, 0.3)}.question-container.svelte-1dspto9.svelte-1dspto9{animation:svelte-1dspto9-slideInRight 0.4s ease-out}@keyframes svelte-1dspto9-slideInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}@media(max-width: 768px){.pre-evaluation-container.svelte-1dspto9.svelte-1dspto9{margin:1rem;padding:1rem}.question-meta.svelte-1dspto9.svelte-1dspto9{flex-direction:column;gap:0.5rem}.actions.svelte-1dspto9.svelte-1dspto9{flex-direction:column;gap:0.75rem}.actions.svelte-1dspto9 button.svelte-1dspto9{width:100%}.confidence-options.svelte-1dspto9.svelte-1dspto9{flex-direction:column;gap:0.5rem}}@media(prefers-reduced-motion: reduce){.pre-evaluation-container.svelte-1dspto9.svelte-1dspto9,.question-container.svelte-1dspto9.svelte-1dspto9,.answer-option.svelte-1dspto9.svelte-1dspto9,.confidence-indicator.svelte-1dspto9.svelte-1dspto9,.submit-btn.svelte-1dspto9.svelte-1dspto9{animation:none;transition:none}}.answer-option.svelte-1dspto9.svelte-1dspto9:focus-within{outline:2px solid #3b82f6;outline-offset:2px}.confidence-indicator.svelte-1dspto9.svelte-1dspto9:focus-within{outline:2px solid #3b82f6;outline-offset:2px}.submit-btn.svelte-1dspto9.svelte-1dspto9:focus,.cancel-btn.svelte-1dspto9.svelte-1dspto9:focus{outline:2px solid #3b82f6;outline-offset:2px}",
  map: null
};
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
function getTimerColor(seconds) {
  if (seconds <= 30)
    return "text-red-500";
  if (seconds <= 60)
    return "text-orange-500";
  return "text-gray-600";
}
const PreEvaluationQuiz = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let question;
  let progress;
  let isMultipleChoice;
  let isTrueFalse;
  let canSubmit;
  let $$unsubscribe_evaluationState;
  let $evaluationProgress, $$unsubscribe_evaluationProgress;
  let $currentQuestion, $$unsubscribe_currentQuestion;
  $$unsubscribe_evaluationState = subscribe(evaluationState, (value) => value);
  $$unsubscribe_evaluationProgress = subscribe(evaluationProgress, (value) => $evaluationProgress = value);
  $$unsubscribe_currentQuestion = subscribe(currentQuestion, (value) => $currentQuestion = value);
  let { userId } = $$props;
  let { competence } = $$props;
  let { onComplete = () => {
  } } = $$props;
  let { onCancel = () => {
  } } = $$props;
  let selectedAnswer = "";
  let isLoading = false;
  let timeRemaining = 180;
  onDestroy(() => {
  });
  if ($$props.userId === void 0 && $$bindings.userId && userId !== void 0)
    $$bindings.userId(userId);
  if ($$props.competence === void 0 && $$bindings.competence && competence !== void 0)
    $$bindings.competence(competence);
  if ($$props.onComplete === void 0 && $$bindings.onComplete && onComplete !== void 0)
    $$bindings.onComplete(onComplete);
  if ($$props.onCancel === void 0 && $$bindings.onCancel && onCancel !== void 0)
    $$bindings.onCancel(onCancel);
  $$result.css.add(css$1);
  question = $currentQuestion;
  progress = $evaluationProgress;
  isMultipleChoice = question?.type === "multiple_choice";
  isTrueFalse = question?.type === "true_false";
  canSubmit = selectedAnswer !== "";
  $$unsubscribe_evaluationState();
  $$unsubscribe_evaluationProgress();
  $$unsubscribe_currentQuestion();
  return `   <div class="pre-evaluation-container max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg svelte-1dspto9"> <div class="header mb-8"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold text-gray-800">Pré-évaluation : ${escape(competence)}</h2> <button class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-svelte-h="svelte-1dr7di9">Annuler</button></div>  <div class="progress-bar bg-gray-200 rounded-full h-3 mb-2"><div class="progress-fill bg-blue-500 h-3 rounded-full transition-all duration-500 svelte-1dspto9" style="${"width: " + escape(progress, true) + "%"}"></div></div> <div class="text-sm text-gray-600 text-center">Progression : ${escape(Math.round(progress))}%</div></div> ${`${question ? ` <div class="question-container svelte-1dspto9"> <div class="question-meta flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg svelte-1dspto9"><div class="flex items-center space-x-4"><span class="${"difficulty-badge px-3 py-1 rounded-full text-sm font-medium " + escape(
    question.difficulty <= 2 ? "bg-green-100 text-green-800" : question.difficulty <= 3 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800",
    true
  )}">Niveau ${escape(question.difficulty)}/5</span> <span class="text-sm text-gray-600">${escape(question.type === "multiple_choice" ? "QCM" : question.type === "true_false" ? "Vrai/Faux" : "Question ouverte")}</span></div> <div class="timer flex items-center space-x-2"><svg class="${"w-5 h-5 " + escape(getTimerColor(timeRemaining), true) + " svelte-1dspto9"}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg> <span class="${"font-mono " + escape(getTimerColor(timeRemaining), true) + " svelte-1dspto9"}">${escape(formatTime(timeRemaining))}</span></div></div>  <div class="question-content mb-8"><h3 class="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">${escape(question.question)}</h3>  <div class="answers-container space-y-3">${isMultipleChoice && question.options ? `${each(question.options, (option, index) => {
    return `<label class="${"answer-option flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all " + escape(
      selectedAnswer === option ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
      true
    ) + " svelte-1dspto9"}"><input type="radio" name="answer"${add_attribute("value", option, 0)} class="sr-only"${option === selectedAnswer ? add_attribute("checked", true, 1) : ""}> <div class="${"option-indicator w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center " + escape(
      selectedAnswer === option ? "border-blue-500 bg-blue-500" : "border-gray-300",
      true
    )}">${selectedAnswer === option ? `<div class="w-2 h-2 bg-white rounded-full"></div>` : ``}</div> <span class="option-text text-gray-700 font-medium">${escape(String.fromCharCode(65 + index))}. ${escape(option)}</span> </label>`;
  })}` : `${isTrueFalse ? `${each(["Vrai", "Faux"], (option) => {
    return `<label class="${"answer-option flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all " + escape(
      selectedAnswer === option ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
      true
    ) + " svelte-1dspto9"}"><input type="radio" name="answer"${add_attribute("value", option, 0)} class="sr-only"${option === selectedAnswer ? add_attribute("checked", true, 1) : ""}> <div class="${"option-indicator w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center " + escape(
      selectedAnswer === option ? "border-blue-500 bg-blue-500" : "border-gray-300",
      true
    )}">${selectedAnswer === option ? `<div class="w-2 h-2 bg-white rounded-full"></div>` : ``}</div> <span class="option-text text-gray-700 font-medium">${escape(option)}</span> </label>`;
  })}` : ``}`}</div></div>  <div class="confidence-section mb-6"><button class="confidence-toggle flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${add_attribute(
    "d",
    "M9 5l7 7-7 7",
    0
  )}></path></svg>
					Indiquer votre niveau de confiance (optionnel)</button> ${``}</div>  <div class="actions flex justify-between items-center svelte-1dspto9"><button class="cancel-btn px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors svelte-1dspto9" data-svelte-h="svelte-pl0yqc">Arrêter l&#39;évaluation</button> <button ${!canSubmit || isLoading ? "disabled" : ""} class="submit-btn px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors svelte-1dspto9">${escape("Valider ma réponse")}</button></div></div>` : ` <div class="waiting-state text-center py-12" data-svelte-h="svelte-18c17pu"><div class="text-gray-600"><svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p class="text-lg">Préparation de votre prochaine question...</p></div></div>`}`} </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".test-container.svelte-ubmtgp.svelte-ubmtgp{max-width:1200px;margin:0 auto;padding:2rem;font-family:'Segoe UI', system-ui, sans-serif}.test-header.svelte-ubmtgp.svelte-ubmtgp{text-align:center;margin-bottom:3rem}.test-header.svelte-ubmtgp h1.svelte-ubmtgp{color:#2563eb;margin-bottom:0.5rem}.steps-indicator.svelte-ubmtgp.svelte-ubmtgp{display:flex;justify-content:center;gap:1rem;margin-top:2rem}.step.svelte-ubmtgp.svelte-ubmtgp{padding:0.75rem 1.5rem;background:#f1f5f9;border-radius:0.5rem;color:#64748b;font-weight:500;transition:all 0.3s ease}.step.active.svelte-ubmtgp.svelte-ubmtgp{background:#2563eb;color:white;transform:scale(1.05)}.test-content.svelte-ubmtgp.svelte-ubmtgp{background:white;border-radius:1rem;padding:2rem;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1)}.assessment-section.svelte-ubmtgp h2.svelte-ubmtgp,.metacognition-section.svelte-ubmtgp h2.svelte-ubmtgp,.results-section.svelte-ubmtgp h2.svelte-ubmtgp{color:#1e293b;margin-bottom:1rem}.prompts-container.svelte-ubmtgp.svelte-ubmtgp{display:flex;flex-direction:column;gap:1.5rem;margin:2rem 0}.prompt-card.svelte-ubmtgp.svelte-ubmtgp{background:#f8fafc;padding:1.5rem;border-radius:0.75rem;border-left:4px solid #3b82f6}.prompt-card.svelte-ubmtgp h3.svelte-ubmtgp{color:#1e40af;margin-bottom:0.5rem;font-size:1.1rem}.prompt-card.svelte-ubmtgp textarea.svelte-ubmtgp{width:100%;padding:0.75rem;border:2px solid #e2e8f0;border-radius:0.5rem;font-family:inherit;resize:vertical;margin-top:1rem}.prompt-card.svelte-ubmtgp textarea.svelte-ubmtgp:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59, 130, 246, 0.1)}.complete-btn.svelte-ubmtgp.svelte-ubmtgp,.reset-btn.svelte-ubmtgp.svelte-ubmtgp{background:#3b82f6;color:white;border:none;padding:0.75rem 2rem;border-radius:0.5rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;margin-top:1rem}.complete-btn.svelte-ubmtgp.svelte-ubmtgp:hover,.reset-btn.svelte-ubmtgp.svelte-ubmtgp:hover{background:#2563eb;transform:translateY(-1px)}.complete-btn.svelte-ubmtgp.svelte-ubmtgp:disabled{background:#9ca3af;cursor:not-allowed;transform:none}.results-grid.svelte-ubmtgp.svelte-ubmtgp{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:2rem 0}.result-card.svelte-ubmtgp.svelte-ubmtgp{background:#f8fafc;padding:1.5rem;border-radius:0.75rem;border:1px solid #e2e8f0}.result-card.svelte-ubmtgp h3.svelte-ubmtgp{color:#1e40af;margin-bottom:1rem;font-size:1.25rem}.result-content.svelte-ubmtgp p.svelte-ubmtgp{margin-bottom:0.5rem}.result-content.svelte-ubmtgp ul.svelte-ubmtgp{margin:0.5rem 0;padding-left:1.5rem}.result-content.svelte-ubmtgp li.svelte-ubmtgp{margin-bottom:0.25rem}.debug-section.svelte-ubmtgp.svelte-ubmtgp{margin-top:3rem;padding-top:2rem;border-top:2px solid #e2e8f0}.debug-section.svelte-ubmtgp h3.svelte-ubmtgp{color:#7c3aed;margin-bottom:1rem}.debug-section.svelte-ubmtgp pre.svelte-ubmtgp{background:#1e293b;color:#e2e8f0;padding:1rem;border-radius:0.5rem;overflow-x:auto;font-size:0.875rem;max-height:400px;overflow-y:auto}@media(max-width: 768px){.test-container.svelte-ubmtgp.svelte-ubmtgp{padding:1rem}.steps-indicator.svelte-ubmtgp.svelte-ubmtgp{flex-direction:column;align-items:center}.results-grid.svelte-ubmtgp.svelte-ubmtgp{grid-template-columns:1fr}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let studentId = "test-student-" + Date.now();
  let currentStep = "assessment";
  let assessmentResults = null;
  let metacognitionPrompts = [];
  let metacognitionResults = null;
  function handleAssessmentComplete(event) {
    console.log("Assessment completed:", event.detail);
    assessmentResults = event.detail;
    metacognitionPrompts = [
      {
        id: "strategy",
        category: "Stratégie d'apprentissage",
        text: "Quelle stratégie avez-vous utilisée pour répondre aux questions ?",
        userResponse: ""
      },
      {
        id: "difficulty",
        category: "Perception de difficulté",
        text: "Quelles questions vous ont semblé les plus difficiles et pourquoi ?",
        userResponse: ""
      },
      {
        id: "confidence",
        category: "Confiance",
        text: "À quel point étiez-vous confiant dans vos réponses ?",
        userResponse: ""
      }
    ];
    currentStep = "metacognition";
  }
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-gq2uvf_START -->${$$result.title = `<title>Test Phase 4 - Pédagogie Adaptative</title>`, ""}<!-- HEAD_svelte-gq2uvf_END -->`, ""} <div class="test-container svelte-ubmtgp"><header class="test-header svelte-ubmtgp"><h1 class="svelte-ubmtgp" data-svelte-h="svelte-1yiorxq">🧪 Test Phase 4 - Système de Pédagogie Adaptative</h1> <p data-svelte-h="svelte-s2jjg9">Test des fonctionnalités d&#39;évaluation adaptative et de métacognition</p> <div class="steps-indicator svelte-ubmtgp"><div class="${["step svelte-ubmtgp", currentStep === "assessment" ? "active" : ""].join(" ").trim()}" data-svelte-h="svelte-1si2ice">1. Évaluation Adaptative</div> <div class="${["step svelte-ubmtgp", currentStep === "metacognition" ? "active" : ""].join(" ").trim()}" data-svelte-h="svelte-mencni">2. Métacognition</div> <div class="${["step svelte-ubmtgp", currentStep === "results" ? "active" : ""].join(" ").trim()}" data-svelte-h="svelte-13ys6dk">3. Résultats</div></div></header> <main class="test-content svelte-ubmtgp">${currentStep === "assessment" ? `<section class="assessment-section svelte-ubmtgp"><h2 class="svelte-ubmtgp" data-svelte-h="svelte-1k897uf">📝 Évaluation Pré-Adaptative</h2> <p data-svelte-h="svelte-4k7mt8">Cette évaluation adaptera automatiquement la difficulté selon vos réponses</p> ${validate_component(PreEvaluationQuiz, "PreEvaluationQuiz").$$render(
    $$result,
    {
      userId: studentId,
      competence: "biologie",
      onComplete: handleAssessmentComplete
    },
    {},
    {}
  )}</section>` : `${currentStep === "metacognition" ? `<section class="metacognition-section svelte-ubmtgp"><h2 class="svelte-ubmtgp" data-svelte-h="svelte-1sd7r8j">🤔 Réflexion Métacognitive</h2> <p data-svelte-h="svelte-1v5ddhn">Réfléchissez sur votre processus d&#39;apprentissage</p> <div class="prompts-container svelte-ubmtgp">${each(metacognitionPrompts, (prompt, index) => {
    return `<div class="prompt-card svelte-ubmtgp"><h3 class="svelte-ubmtgp">${escape(prompt.category)}</h3> <p>${escape(prompt.text)}</p> <textarea placeholder="Votre réflexion..." rows="3" class="svelte-ubmtgp">${escape(prompt.userResponse || "")}</textarea> </div>`;
  })}</div> <button class="complete-btn svelte-ubmtgp" ${!metacognitionPrompts.every((p) => p.userResponse?.trim()) ? "disabled" : ""}>Terminer la réflexion</button></section>` : `${currentStep === "results" ? `<section class="results-section svelte-ubmtgp"><h2 class="svelte-ubmtgp" data-svelte-h="svelte-16f1xuo">📊 Résultats et Analyse</h2> <div class="results-grid svelte-ubmtgp"><div class="result-card svelte-ubmtgp"><h3 class="svelte-ubmtgp" data-svelte-h="svelte-1jysfoi">🎯 Évaluation Adaptative</h3> <div class="result-content svelte-ubmtgp"><p class="svelte-ubmtgp"><strong data-svelte-h="svelte-mk5csw">Niveau détecté:</strong> ${escape(assessmentResults?.level || "Non déterminé")}</p> <p class="svelte-ubmtgp"><strong data-svelte-h="svelte-14742k0">Score:</strong> ${escape(assessmentResults?.score || 0)}/100</p> <p class="svelte-ubmtgp"><strong data-svelte-h="svelte-1qflyc2">Questions répondues:</strong> ${escape(assessmentResults?.answers?.length || 0)}</p> <h4 data-svelte-h="svelte-i8vz1g">Recommandations:</h4> <ul class="svelte-ubmtgp">${each(assessmentResults?.recommendations || [], (rec) => {
    return `<li class="svelte-ubmtgp">${escape(rec)}</li>`;
  })}</ul></div></div> <div class="result-card svelte-ubmtgp"><h3 class="svelte-ubmtgp" data-svelte-h="svelte-157jmd0">🧠 Analyse Métacognitive</h3> <div class="result-content svelte-ubmtgp"><p class="svelte-ubmtgp" data-svelte-h="svelte-4rtwdl"><strong>Stratégies identifiées:</strong></p> <ul class="svelte-ubmtgp">${each([], (strategy) => {
    return `<li class="svelte-ubmtgp">${escape(strategy)}</li>`;
  })}</ul> <p class="svelte-ubmtgp"><strong data-svelte-h="svelte-19ys1g1">Niveau de conscience:</strong> ${escape("Non évalué")}</p> <h4 data-svelte-h="svelte-9sb7uc">Recommandations métacognitives:</h4> <ul class="svelte-ubmtgp">${each([], (rec) => {
    return `<li class="svelte-ubmtgp">${escape(rec)}</li>`;
  })}</ul></div></div></div> <div class="debug-section svelte-ubmtgp"><h3 class="svelte-ubmtgp" data-svelte-h="svelte-jnzqm2">🔧 Données de Debug</h3> <details><summary data-svelte-h="svelte-12922xx">Voir les données brutes</summary> <pre class="svelte-ubmtgp">${escape(JSON.stringify({ assessmentResults, metacognitionResults }, null, 2))}</pre></details></div> <button class="reset-btn svelte-ubmtgp" data-svelte-h="svelte-12l17ty">🔄 Recommencer le test</button></section>` : ``}`}`}</main> </div>`;
});
export {
  Page as default
};
