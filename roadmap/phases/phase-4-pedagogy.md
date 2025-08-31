# 🧠 Phase 4 : Pédagogie Avancée (3 jours) - v1.2

## 📋 **Vue d'Ensemble**

**Objectif** : Innovation pédagogique avec pré-évaluation, métacognition et ressources adaptatives  
**Version cible** : v1.2 (plateforme pédagogique innovante)  
**Groupe** : 🏗️ FONDATIONS  
**Prérequis** : Phase 3 (Contenu) validée ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### 🧠 **Architecture Pédagogique**

**Approche Scientifique :**

- **Learning Analytics** : Mesure et analyse des données d'apprentissage
- **Adaptive Learning** : Personnalisation en temps réel du parcours
- **Metacognition** : Développement de la conscience d'apprendre
- **Evidence-Based** : Pratiques fondées sur la recherche éducative
- **Gamification** : Motivation par mécaniques de jeu éthiques

**Algorithmes d'Adaptation :**

- **Knowledge Tracing** : Modélisation des connaissances acquises
- **Item Response Theory** : Calibrage de la difficulté des exercices
- **Bayesian Networks** : Prédiction des performances futures
- **Machine Learning** : Amélioration continue des recommandations

### 🎓 **Théories Pédagogiques Intégrées**

**Fondements Théoriques :**

- **Constructivisme** : Apprentissage par construction active
- **Zone de Développement Proximal** (Vygotsky) : Défis optimaux
- **Flow State** (Csikszentmihalyi) : Engagement optimal
- **Cognitive Load Theory** : Gestion de la charge cognitive
- **Spaced Repetition** : Révision optimisée temporellement

**Mesures d'Efficacité :**

- **Temps d'engagement** : Durée et qualité de l'attention
- **Taux de complétion** : Persévérance et motivation
- **Courbe d'apprentissage** : Vitesse d'acquisition
- **Rétention long terme** : Mémorisation durable
- **Transfert de compétences** : Application dans nouveaux contextes

### 🔬 **Approche Qualité & Recherche**

**Méthodes de Validation :**

- **A/B Testing** : Comparaison d'approches pédagogiques
- **Learning Analytics** : Analyse de patterns d'apprentissage
- **Peer Review** : Validation par experts pédagogiques
- **User Testing** : Feedback utilisateurs structuré
- **Performance Tracking** : Mesures longitudinales

---

## 📚 **Références Modulaires**

### **[REF]** Stores réactifs avancés : **[reactive-stores.md](../references/ui/reactive-stores.md)**

- ✅ Progression d'apprentissage avec adaptation
- ✅ Système de préférences pédagogiques
- ✅ Notifications intelligentes
- ✅ Hooks personnalisés pour composants

### **[REF]** Tests et validation : **[testing-strategy.md](../references/testing/testing-strategy.md)**

- ✅ Stratégie complète (unit, intégration, E2E)
- ✅ Tests de performance et charge cognitive
- ✅ Validation d'efficacité pédagogique
- ✅ Métriques d'engagement utilisateur

---

## 📝 **Instructions d'Implémentation**

### 🔬 **Étape 4.1 : Système de pré-évaluation**

**[FILE]** Créer `src/lib/pedagogy/preAssessment.ts` :

```ts
import { z } from "zod";

// ===== TYPES DE PRÉ-ÉVALUATION =====
export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(["qcm", "ouverte", "ordre", "appariement"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  difficulty: z.number().min(0).max(1), // 0=facile, 1=difficile
  competenceId: z.string(),
  points: z.number().positive(),
  timeLimit: z.number().positive().optional(), // en secondes
});

export const PreAssessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  matiereId: z.string(),
  niveauId: z.string(),
  questions: z.array(QuestionSchema),
  adaptiveRules: z.array(
    z.object({
      condition: z.string(),
      action: z.string(),
      parameters: z.record(z.unknown()),
    })
  ),
  duration: z.number().positive(), // durée totale en minutes
  passingScore: z.number().min(0).max(1), // score minimum pour validation
});

export type Question = z.infer<typeof QuestionSchema>;
export type PreAssessment = z.infer<typeof PreAssessmentSchema>;

// ===== RÉSULTATS D'ÉVALUATION =====
export interface AssessmentResult {
  userId: string;
  assessmentId: string;
  answers: AnswerRecord[];
  score: number;
  timeSpent: number;
  knowledgeProfile: KnowledgeProfile;
  recommendations: Recommendation[];
  completedAt: string;
}

export interface AnswerRecord {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  confidence: number; // 0-1, auto-évaluation de confiance
}

export interface KnowledgeProfile {
  competences: Record<string, CompetenceLevel>;
  learningStyle: LearningStyle;
  cognitiveLoad: number;
  motivationLevel: number;
  recommendedDifficulty: number;
}

export interface CompetenceLevel {
  competenceId: string;
  masteryLevel: number; // 0-1
  confidence: number;
  lastAssessed: string;
  trend: "improving" | "stable" | "declining";
}

export type LearningStyle =
  | "visual"
  | "auditory"
  | "kinesthetic"
  | "reading"
  | "mixed";

export interface Recommendation {
  type: "content" | "exercise" | "revision" | "break";
  resourceId: string;
  priority: number;
  reason: string;
}

// ===== GESTIONNAIRE DE PRÉ-ÉVALUATION =====
export class PreAssessmentManager {
  private adaptiveEngine: AdaptiveEngine;

  constructor() {
    this.adaptiveEngine = new AdaptiveEngine();
  }

  /**
   * Lance une pré-évaluation adaptative
   */
  async startAssessment(
    userId: string,
    assessmentId: string
  ): Promise<AdaptiveSession> {
    const assessment = await this.loadAssessment(assessmentId);
    return new AdaptiveSession(userId, assessment, this.adaptiveEngine);
  }

  /**
   * Analyse les réponses et génère un profil de connaissances
   */
  async analyzeAnswers(answers: AnswerRecord[]): Promise<KnowledgeProfile> {
    const competenceScores = this.calculateCompetenceScores(answers);
    const learningStyle = this.detectLearningStyle(answers);
    const cognitiveLoad = this.assessCognitiveLoad(answers);

    return {
      competences: competenceScores,
      learningStyle,
      cognitiveLoad,
      motivationLevel: this.calculateMotivation(answers),
      recommendedDifficulty: this.calculateOptimalDifficulty(competenceScores),
    };
  }

  private calculateCompetenceScores(
    answers: AnswerRecord[]
  ): Record<string, CompetenceLevel> {
    // Implémentation algorithme de Knowledge Tracing
    const competenceMap = new Map<string, CompetenceLevel>();

    answers.forEach((answer) => {
      // Logique de calcul du niveau de maîtrise par compétence
      // Utilise un modèle bayésien pour estimer la probabilité de maîtrise
    });

    return Object.fromEntries(competenceMap);
  }

  private detectLearningStyle(answers: AnswerRecord[]): LearningStyle {
    // Analyse des patterns de réponse pour détecter le style d'apprentissage
    const responsePatterns = this.analyzeResponsePatterns(answers);
    return this.classifyLearningStyle(responsePatterns);
  }

  private assessCognitiveLoad(answers: AnswerRecord[]): number {
    // Calcul de la charge cognitive basé sur temps de réponse et erreurs
    const avgResponseTime =
      answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length;
    const errorRate =
      answers.filter((a) => !a.isCorrect).length / answers.length;

    return Math.min(1, (avgResponseTime / 60 + errorRate) / 2);
  }

  private calculateMotivation(answers: AnswerRecord[]): number {
    // Estimation motivation basée sur persévérance et confiance
    const avgConfidence =
      answers.reduce((sum, a) => sum + a.confidence, 0) / answers.length;
    const completionRate = answers.length > 0 ? 1 : 0; // Simplification

    return (avgConfidence + completionRate) / 2;
  }

  private calculateOptimalDifficulty(
    competences: Record<string, CompetenceLevel>
  ): number {
    // Zone de développement proximal : légèrement au-dessus du niveau actuel
    const avgMastery =
      Object.values(competences).reduce(
        (sum, comp) => sum + comp.masteryLevel,
        0
      ) / Object.keys(competences).length;

    return Math.min(1, avgMastery + 0.2); // +20% de challenge
  }
}

// ===== MOTEUR ADAPTATIF =====
export class AdaptiveEngine {
  /**
   * Sélectionne la prochaine question basée sur les réponses précédentes
   */
  selectNextQuestion(
    availableQuestions: Question[],
    currentProfile: Partial<KnowledgeProfile>,
    previousAnswers: AnswerRecord[]
  ): Question | null {
    if (availableQuestions.length === 0) return null;

    // Algorithme de sélection adaptative
    const targetDifficulty = this.calculateTargetDifficulty(
      currentProfile,
      previousAnswers
    );
    const candidateQuestions = this.filterByDifficulty(
      availableQuestions,
      targetDifficulty
    );

    return this.selectOptimalQuestion(candidateQuestions, currentProfile);
  }

  private calculateTargetDifficulty(
    profile: Partial<KnowledgeProfile>,
    answers: AnswerRecord[]
  ): number {
    if (answers.length === 0) return 0.3; // Commencer facile

    const recentPerformance = this.analyzeRecentPerformance(answers.slice(-3));
    const adjustmentFactor = this.calculateAdjustmentFactor(recentPerformance);

    return Math.max(0.1, Math.min(0.9, recentPerformance + adjustmentFactor));
  }

  private analyzeRecentPerformance(recentAnswers: AnswerRecord[]): number {
    if (recentAnswers.length === 0) return 0.3;

    const correctRate =
      recentAnswers.filter((a) => a.isCorrect).length / recentAnswers.length;
    const avgConfidence =
      recentAnswers.reduce((sum, a) => sum + a.confidence, 0) /
      recentAnswers.length;

    return (correctRate + avgConfidence) / 2;
  }

  private calculateAdjustmentFactor(performance: number): number {
    // Si performance > 0.8, augmenter difficulté
    if (performance > 0.8) return 0.1;
    // Si performance < 0.5, diminuer difficulté
    if (performance < 0.5) return -0.1;
    // Sinon maintenir
    return 0;
  }
}

// ===== SESSION ADAPTATIVE =====
export class AdaptiveSession {
  private currentQuestion = 0;
  private answers: AnswerRecord[] = [];
  private startTime = Date.now();

  constructor(
    private userId: string,
    private assessment: PreAssessment,
    private engine: AdaptiveEngine
  ) {}

  /**
   * Obtient la prochaine question de l'évaluation
   */
  getNextQuestion(): Question | null {
    const remainingQuestions = this.assessment.questions.slice(
      this.currentQuestion
    );
    const currentProfile = this.buildCurrentProfile();

    return this.engine.selectNextQuestion(
      remainingQuestions,
      currentProfile,
      this.answers
    );
  }

  /**
   * Enregistre une réponse et met à jour le profil
   */
  submitAnswer(
    questionId: string,
    answer: string | string[],
    confidence: number
  ): void {
    const question = this.assessment.questions.find((q) => q.id === questionId);
    if (!question) throw new Error("Question not found");

    const isCorrect = this.validateAnswer(question, answer);
    const timeSpent = Date.now() - this.startTime;

    this.answers.push({
      questionId,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      confidence,
    });

    this.currentQuestion++;
  }

  /**
   * Finalise l'évaluation et génère les résultats
   */
  async complete(): Promise<AssessmentResult> {
    const manager = new PreAssessmentManager();
    const knowledgeProfile = await manager.analyzeAnswers(this.answers);
    const recommendations = this.generateRecommendations(knowledgeProfile);

    return {
      userId: this.userId,
      assessmentId: this.assessment.id,
      answers: this.answers,
      score: this.calculateFinalScore(),
      timeSpent: Date.now() - this.startTime,
      knowledgeProfile,
      recommendations,
      completedAt: new Date().toISOString(),
    };
  }

  private validateAnswer(
    question: Question,
    answer: string | string[]
  ): boolean {
    // Logique de validation selon le type de question
    switch (question.type) {
      case "qcm":
        return answer === question.correctAnswer;
      case "ordre":
        return (
          Array.isArray(answer) &&
          Array.isArray(question.correctAnswer) &&
          JSON.stringify(answer) === JSON.stringify(question.correctAnswer)
        );
      default:
        return false;
    }
  }

  private calculateFinalScore(): number {
    const totalPoints = this.answers.reduce((sum, answer) => {
      const question = this.assessment.questions.find(
        (q) => q.id === answer.questionId
      );
      return sum + (answer.isCorrect ? question?.points || 0 : 0);
    }, 0);

    const maxPoints = this.assessment.questions
      .slice(0, this.answers.length)
      .reduce((sum, q) => sum + q.points, 0);

    return maxPoints > 0 ? totalPoints / maxPoints : 0;
  }

  private buildCurrentProfile(): Partial<KnowledgeProfile> {
    // Construction rapide du profil actuel pour adaptation en temps réel
    return {
      recommendedDifficulty: this.engine["calculateTargetDifficulty"](
        {},
        this.answers
      ),
    };
  }

  private generateRecommendations(profile: KnowledgeProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Recommandations basées sur le profil de connaissances
    Object.entries(profile.competences).forEach(([competenceId, level]) => {
      if (level.masteryLevel < 0.6) {
        recommendations.push({
          type: "content",
          resourceId: `content-${competenceId}`,
          priority: 1 - level.masteryLevel,
          reason: `Renforcement nécessaire en ${competenceId}`,
        });
      }
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}
```

### 🧠 **Étape 4.2 : Module de métacognition**

**[FILE]** Créer `src/lib/pedagogy/metacognition.ts` :

```ts
import { writable, derived } from "svelte/store";

// ===== TYPES MÉTACOGNITIFS =====
export interface MetacognitionSession {
  id: string;
  userId: string;
  activity: string;
  startTime: string;
  reflections: Reflection[];
  strategies: LearningStrategy[];
  selfAssessment: SelfAssessment;
}

export interface Reflection {
  id: string;
  prompt: string;
  response: string;
  type: "before" | "during" | "after";
  timestamp: string;
  mood: EmotionalState;
}

export interface LearningStrategy {
  id: string;
  name: string;
  description: string;
  effectiveness: number; // 0-1, basé sur l'auto-évaluation
  lastUsed: string;
  frequency: number;
}

export interface SelfAssessment {
  confidenceLevel: number; // 0-1
  difficultyPerceived: number; // 0-1
  effortLevel: number; // 0-1
  satisfaction: number; // 0-1
  wouldRecommend: boolean;
}

export type EmotionalState =
  | "excited"
  | "confident"
  | "neutral"
  | "frustrated"
  | "confused"
  | "bored";

// ===== PROMPTS DE RÉFLEXION =====
export const REFLECTION_PROMPTS = {
  before: [
    "Que savez-vous déjà sur ce sujet ?",
    "Quels sont vos objectifs pour cette session ?",
    "Quelle stratégie allez-vous utiliser ?",
    "Comment vous sentez-vous avant de commencer ?",
  ],
  during: [
    "Cette stratégie fonctionne-t-elle bien ?",
    "Que trouvez-vous le plus difficile ?",
    "Comment pourriez-vous adapter votre approche ?",
    "Êtes-vous en train d'atteindre vos objectifs ?",
  ],
  after: [
    "Qu'avez-vous appris de nouveau ?",
    "Votre stratégie a-t-elle été efficace ?",
    "Que feriez-vous différemment la prochaine fois ?",
    "Comment vous sentez-vous maintenant ?",
  ],
};

// ===== GESTIONNAIRE DE MÉTACOGNITION =====
export class MetacognitionManager {
  private sessions = writable<MetacognitionSession[]>([]);
  private currentSession = writable<MetacognitionSession | null>(null);

  // Stores dérivés pour analyse
  public readonly sessionHistory = derived(
    this.sessions,
    ($sessions) => $sessions
  );
  public readonly currentReflection = derived(
    this.currentSession,
    ($session) => $session
  );

  /**
   * Démarre une nouvelle session métacognitive
   */
  startSession(userId: string, activity: string): MetacognitionSession {
    const session: MetacognitionSession = {
      id: crypto.randomUUID(),
      userId,
      activity,
      startTime: new Date().toISOString(),
      reflections: [],
      strategies: [],
      selfAssessment: {
        confidenceLevel: 0.5,
        difficultyPerceived: 0.5,
        effortLevel: 0.5,
        satisfaction: 0.5,
        wouldRecommend: false,
      },
    };

    this.currentSession.set(session);
    return session;
  }

  /**
   * Ajoute une réflexion à la session courante
   */
  addReflection(
    prompt: string,
    response: string,
    type: Reflection["type"],
    mood: EmotionalState
  ): void {
    this.currentSession.update((session) => {
      if (!session) return session;

      const reflection: Reflection = {
        id: crypto.randomUUID(),
        prompt,
        response,
        type,
        timestamp: new Date().toISOString(),
        mood,
      };

      return {
        ...session,
        reflections: [...session.reflections, reflection],
      };
    });
  }

  /**
   * Enregistre une stratégie d'apprentissage utilisée
   */
  recordStrategy(strategy: Omit<LearningStrategy, "id" | "lastUsed">): void {
    this.currentSession.update((session) => {
      if (!session) return session;

      const learningStrategy: LearningStrategy = {
        ...strategy,
        id: crypto.randomUUID(),
        lastUsed: new Date().toISOString(),
      };

      return {
        ...session,
        strategies: [...session.strategies, learningStrategy],
      };
    });
  }

  /**
   * Met à jour l'auto-évaluation
   */
  updateSelfAssessment(assessment: Partial<SelfAssessment>): void {
    this.currentSession.update((session) => {
      if (!session) return session;

      return {
        ...session,
        selfAssessment: {
          ...session.selfAssessment,
          ...assessment,
        },
      };
    });
  }

  /**
   * Finalise la session et l'ajoute à l'historique
   */
  endSession(): void {
    this.currentSession.update((session) => {
      if (!session) return null;

      // Ajouter à l'historique
      this.sessions.update((sessions) => [...sessions, session]);

      return null;
    });
  }

  /**
   * Analyse les patterns métacognitifs de l'utilisateur
   */
  analyzeMetacognitionPatterns(userId: string): MetacognitionAnalysis {
    // Implémentation de l'analyse des patterns
    // Retourne insights sur les stratégies efficaces, évolution émotionnelle, etc.
    return {
      dominantStrategies: [],
      emotionalPatterns: {},
      improvementAreas: [],
      strengths: [],
    };
  }

  /**
   * Génère des prompts personnalisés basés sur l'historique
   */
  generatePersonalizedPrompts(userId: string): string[] {
    // Logique de personnalisation des prompts de réflexion
    return REFLECTION_PROMPTS.before; // Simplification pour l'exemple
  }
}

export interface MetacognitionAnalysis {
  dominantStrategies: LearningStrategy[];
  emotionalPatterns: Record<EmotionalState, number>;
  improvementAreas: string[];
  strengths: string[];
}

// Instance globale
export const metacognitionManager = new MetacognitionManager();
```

### 🎯 **Étape 4.3 : Ressources adaptatives**

**[FILE]** Créer `src/lib/pedagogy/adaptiveResources.ts` :

```ts
import type { KnowledgeProfile, LearningStyle } from "./preAssessment";
import type { Course, Competence } from "$lib/types/content";

// ===== TYPES DE RESSOURCES ADAPTATIVES =====
export interface AdaptiveResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  difficulty: number; // 0-1
  learningStyles: LearningStyle[];
  competenceIds: string[];
  estimatedDuration: number; // en minutes
  prerequisites: string[];
  adaptiveFeatures: AdaptiveFeature[];
  content: ResourceContent;
}

export type ResourceType =
  | "video"
  | "text"
  | "interactive"
  | "simulation"
  | "game"
  | "quiz";

export interface AdaptiveFeature {
  type: "scaffolding" | "hints" | "examples" | "practice" | "feedback";
  trigger: TriggerCondition;
  content: string;
}

export interface TriggerCondition {
  type: "time" | "error_rate" | "confidence" | "completion";
  threshold: number;
  comparison: "greater" | "less" | "equal";
}

export interface ResourceContent {
  baseContent: string;
  adaptiveElements: AdaptiveElement[];
  assessmentQuestions: AssessmentQuestion[];
}

export interface AdaptiveElement {
  id: string;
  position: number; // Position dans le contenu
  type: "explanation" | "example" | "hint" | "practice";
  condition: DisplayCondition;
  content: string;
}

export interface DisplayCondition {
  showIf: {
    learningStyle?: LearningStyle[];
    masteryLevel?: { min?: number; max?: number };
    previousErrors?: number;
    timeSpent?: { min?: number; max?: number };
  };
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "understanding" | "application" | "analysis";
  expectedAnswer: string;
  hints: string[];
}

// ===== RECOMMANDATION DE RESSOURCES =====
export class AdaptiveResourceManager {
  private resources: AdaptiveResource[] = [];

  /**
   * Recommande des ressources basées sur le profil de l'apprenant
   */
  recommendResources(
    knowledgeProfile: KnowledgeProfile,
    targetCompetence: string,
    maxResources = 5
  ): ResourceRecommendation[] {
    const candidateResources =
      this.filterResourcesByCompetence(targetCompetence);
    const scoredResources = candidateResources.map((resource) => ({
      resource,
      score: this.calculateRecommendationScore(resource, knowledgeProfile),
      adaptations: this.generateAdaptations(resource, knowledgeProfile),
    }));

    return scoredResources
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResources);
  }

  /**
   * Calcule un score de recommandation pour une ressource
   */
  private calculateRecommendationScore(
    resource: AdaptiveResource,
    profile: KnowledgeProfile
  ): number {
    let score = 0;

    // Score basé sur le style d'apprentissage (30%)
    if (resource.learningStyles.includes(profile.learningStyle)) {
      score += 0.3;
    }

    // Score basé sur la difficulté optimale (40%)
    const difficultyMatch =
      1 - Math.abs(resource.difficulty - profile.recommendedDifficulty);
    score += difficultyMatch * 0.4;

    // Score basé sur les compétences à développer (30%)
    const competenceMatch = this.calculateCompetenceMatch(resource, profile);
    score += competenceMatch * 0.3;

    return Math.min(1, score);
  }

  /**
   * Génère des adaptations personnalisées pour une ressource
   */
  private generateAdaptations(
    resource: AdaptiveResource,
    profile: KnowledgeProfile
  ): ResourceAdaptation[] {
    const adaptations: ResourceAdaptation[] = [];

    // Adaptation basée sur la charge cognitive
    if (profile.cognitiveLoad > 0.7) {
      adaptations.push({
        type: "cognitive_support",
        description: "Contenu décomposé en étapes plus petites",
        modifications: ["add_breaks", "simplify_language", "add_summaries"],
      });
    }

    // Adaptation basée sur le niveau de motivation
    if (profile.motivationLevel < 0.5) {
      adaptations.push({
        type: "motivation_boost",
        description: "Éléments de gamification ajoutés",
        modifications: [
          "add_progress_indicators",
          "add_rewards",
          "add_social_elements",
        ],
      });
    }

    // Adaptation basée sur le style d'apprentissage
    switch (profile.learningStyle) {
      case "visual":
        adaptations.push({
          type: "visual_enhancement",
          description: "Contenu enrichi visuellement",
          modifications: ["add_diagrams", "add_colors", "add_infographics"],
        });
        break;
      case "kinesthetic":
        adaptations.push({
          type: "interactive_enhancement",
          description: "Éléments interactifs ajoutés",
          modifications: ["add_simulations", "add_drag_drop", "add_hands_on"],
        });
        break;
    }

    return adaptations;
  }

  /**
   * Applique les adaptations à une ressource en temps réel
   */
  adaptResource(
    resource: AdaptiveResource,
    adaptations: ResourceAdaptation[],
    currentContext: LearningContext
  ): AdaptedResource {
    let adaptedContent = { ...resource.content };

    adaptations.forEach((adaptation) => {
      adaptation.modifications.forEach((modification) => {
        adaptedContent = this.applyModification(
          adaptedContent,
          modification,
          currentContext
        );
      });
    });

    return {
      ...resource,
      content: adaptedContent,
      adaptations: adaptations,
    };
  }

  private applyModification(
    content: ResourceContent,
    modification: string,
    context: LearningContext
  ): ResourceContent {
    // Implémentation des modifications spécifiques
    switch (modification) {
      case "add_breaks":
        return this.addContentBreaks(content);
      case "add_hints":
        return this.addContextualHints(content, context);
      case "simplify_language":
        return this.simplifyLanguage(content);
      default:
        return content;
    }
  }

  private addContentBreaks(content: ResourceContent): ResourceContent {
    // Ajoute des pauses dans le contenu long
    return content; // Implémentation simplifiée
  }

  private addContextualHints(
    content: ResourceContent,
    context: LearningContext
  ): ResourceContent {
    // Ajoute des indices basés sur le contexte d'apprentissage
    return content; // Implémentation simplifiée
  }

  private simplifyLanguage(content: ResourceContent): ResourceContent {
    // Simplifie le langage du contenu
    return content; // Implémentation simplifiée
  }

  private filterResourcesByCompetence(
    competenceId: string
  ): AdaptiveResource[] {
    return this.resources.filter((resource) =>
      resource.competenceIds.includes(competenceId)
    );
  }

  private calculateCompetenceMatch(
    resource: AdaptiveResource,
    profile: KnowledgeProfile
  ): number {
    const relevantCompetences = resource.competenceIds.filter(
      (id) => profile.competences[id]
    );

    if (relevantCompetences.length === 0) return 0;

    const avgMastery =
      relevantCompetences.reduce(
        (sum, id) => sum + profile.competences[id].masteryLevel,
        0
      ) / relevantCompetences.length;

    // Ressource optimale si légèrement au-dessus du niveau actuel
    return 1 - Math.abs(avgMastery - (resource.difficulty - 0.1));
  }
}

// ===== TYPES SUPPLÉMENTAIRES =====
export interface ResourceRecommendation {
  resource: AdaptiveResource;
  score: number;
  adaptations: ResourceAdaptation[];
}

export interface ResourceAdaptation {
  type: string;
  description: string;
  modifications: string[];
}

export interface LearningContext {
  sessionDuration: number;
  errorCount: number;
  currentConfidence: number;
  timeOfDay: "morning" | "afternoon" | "evening";
  deviceType: "mobile" | "tablet" | "desktop";
}

export interface AdaptedResource extends AdaptiveResource {
  adaptations: ResourceAdaptation[];
}

// Instance globale
export const adaptiveResourceManager = new AdaptiveResourceManager();
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:pedagogy         # Tests algorithmes pédagogiques
[TEST] npm run test:adaptive         # Tests système adaptatif
[TEST] npm run test:metacognition    # Tests métacognition
[TEST] npm run validate 4           # Validation complète Phase 4
```

**[FILE]** Créer `src/lib/pedagogy/preAssessment.test.ts` :

```ts
import { describe, it, expect, vi } from "vitest";
import { PreAssessmentManager, AdaptiveEngine } from "./preAssessment";
import type { AnswerRecord, Question } from "./preAssessment";

describe("PreAssessmentManager", () => {
  const manager = new PreAssessmentManager();

  describe("analyzeAnswers", () => {
    it("should calculate knowledge profile correctly", async () => {
      const mockAnswers: AnswerRecord[] = [
        {
          questionId: "q1",
          userAnswer: "correct",
          isCorrect: true,
          timeSpent: 30000,
          confidence: 0.8,
        },
        {
          questionId: "q2",
          userAnswer: "wrong",
          isCorrect: false,
          timeSpent: 60000,
          confidence: 0.3,
        },
      ];

      const profile = await manager.analyzeAnswers(mockAnswers);

      expect(profile.motivationLevel).toBeGreaterThan(0);
      expect(profile.cognitiveLoad).toBeGreaterThan(0);
      expect(profile.recommendedDifficulty).toBeGreaterThan(0);
    });
  });
});

describe("AdaptiveEngine", () => {
  const engine = new AdaptiveEngine();

  describe("selectNextQuestion", () => {
    it("should select appropriate difficulty question", () => {
      const questions: Question[] = [
        {
          id: "easy",
          text: "Easy question",
          type: "qcm",
          correctAnswer: "a",
          difficulty: 0.2,
          competenceId: "comp1",
          points: 1,
        },
        {
          id: "hard",
          text: "Hard question",
          type: "qcm",
          correctAnswer: "b",
          difficulty: 0.8,
          competenceId: "comp1",
          points: 2,
        },
      ];

      const mockAnswers: AnswerRecord[] = [
        {
          questionId: "prev",
          userAnswer: "correct",
          isCorrect: true,
          timeSpent: 30000,
          confidence: 0.9,
        },
      ];

      const nextQuestion = engine.selectNextQuestion(
        questions,
        {},
        mockAnswers
      );

      expect(nextQuestion).toBeDefined();
      // Devrait sélectionner une question plus difficile après une bonne performance
      expect(nextQuestion?.difficulty).toBeGreaterThan(0.3);
    });
  });
});
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Système de pré-évaluation adaptatif fonctionnel
- [ ] **[CHECK]** Module de métacognition avec réflexions guidées
- [ ] **[CHECK]** Algorithme de recommandation de ressources
- [ ] **[CHECK]** Profiling des styles d'apprentissage
- [ ] **[CHECK]** Adaptation temps réel de la difficulté
- [ ] **[CHECK]** Mesure de la charge cognitive
- [ ] **[CHECK]** Tests d'efficacité pédagogique passent
- [ ] **[CHECK]** Interface utilisateur intuitive

---

## 🏷️ **Processus de Release v1.2**

```bash
[CMD] npm run validate 4              # Validation complète Phase 4
[CMD] git add . && git commit -m "feat: Phase 4 - Advanced Pedagogy complete"
[CMD] git tag v1.2                   # Tag release pédagogique
[CMD] npm run release:deploy         # Déploiement production
```

**🚫 STOP** : Ne pas passer au Groupe 2 sans validation complète de Phase 4.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [📊 Phase 5 : Firebase Data Layer](phase-5-firebase-integration.md)  
**Groupe suivant** : ⚙️ PHASE MOTEUR - Données & Contenu  
**Dépendance** : Phase 4 (Pédagogie) validée ✅
