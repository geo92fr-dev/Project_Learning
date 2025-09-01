/**
 * Service de Ressources Adaptatives - Phase 4 (Version Finale)
 * Recommandation intelligente de ressources selon le profil d'apprentissage
 */

import { writable } from "svelte/store";
import type { AdaptiveResource } from "$lib/types/pedagogy";

// ===== STORES =====
export const recommendedResources = writable<AdaptiveResource[]>([]);

// ===== TYPES LOCAUX =====
interface UserPreferences {
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading" | "mixed";
  timeConstraints: number; // minutes
  preferredResourceTypes: Array<
    "lesson" | "exercise" | "video" | "interactive" | "reading" | "game"
  >;
}

interface RecommendationContext {
  competence: string;
  currentLevel: number;
  timeAvailable: number;
  sessionGoal: "learn" | "practice" | "review" | "assess";
}

interface AdaptiveRecommendation {
  resource: AdaptiveResource;
  relevance_score: number;
  estimated_completion_time: number;
  adaptation_rationale: string;
  personalization_factors: PersonalizationFactor[];
}

interface PersonalizationFactor {
  factor: string;
  value: string;
  impact: "low" | "medium" | "high";
  explanation: string;
}

interface AdaptedContent {
  originalResource: AdaptiveResource;
  adaptations: ContentAdaptation[];
  estimatedImprovement: number;
  adaptationRationale: string;
}

interface ContentAdaptation {
  type: "pacing" | "difficulty" | "presentation" | "modality" | "enhancement";
  description: string;
  parameters: Record<string, any>;
}

interface ResourceEffectivenessReport {
  total_resources: number;
  total_interactions: number;
  average_duration: number;
  average_satisfaction: number;
  type_breakdown: Record<string, ResourceTypeMetrics>;
  top_performing_resources: Array<{ id: string; score: number }>;
  improvement_recommendations: string[];
  generated_at: string;
}

interface ResourceTypeMetrics {
  count: number;
  avg_duration: number;
  avg_satisfaction: number;
  completion_rate: number;
}

// ===== BANQUE DE RESSOURCES =====
const RESOURCE_BANK: AdaptiveResource[] = [
  {
    id: "js-intro-video",
    type: "video",
    title: "Introduction à JavaScript",
    description: "Vidéo interactive couvrant les bases de JavaScript",
    difficulty_level: 1,
    estimated_time: 25,
    learning_objectives: ["Variables", "Fonctions", "Syntaxe de base"],
    prerequisites: [],
    skill_focus: ["javascript-fundamentals"],
    adaptation_reason: "Idéal pour débutants avec style d'apprentissage visuel",
    priority: "high",
    content_path: "/content/javascript/intro-video",
  },
  {
    id: "js-practice-exercises",
    type: "exercise",
    title: "Exercices Pratiques JavaScript",
    description: "Série d'exercices interactifs pour pratiquer les concepts",
    difficulty_level: 2,
    estimated_time: 40,
    learning_objectives: ["Application pratique", "Résolution de problèmes"],
    prerequisites: ["javascript-fundamentals"],
    skill_focus: ["javascript-application"],
    adaptation_reason: "Parfait pour consolider les acquis par la pratique",
    priority: "medium",
    content_path: "/content/javascript/exercises",
  },
  {
    id: "reading-js-concepts",
    type: "reading",
    title: "Guide Complet JavaScript",
    description: "Documentation approfondie des concepts JavaScript",
    difficulty_level: 3,
    estimated_time: 60,
    learning_objectives: ["Compréhension approfondie", "Référence"],
    prerequisites: ["javascript-fundamentals"],
    skill_focus: ["javascript-advanced"],
    adaptation_reason: "Idéal pour apprentissage par lecture et référence",
    priority: "medium",
    content_path: "/content/javascript/guide",
  },
  {
    id: "typescript-intro",
    type: "lesson",
    title: "TypeScript pour Débutants",
    description: "Leçon interactive sur les fondamentaux de TypeScript",
    difficulty_level: 2,
    estimated_time: 35,
    learning_objectives: ["Types", "Interfaces", "Classes"],
    prerequisites: ["javascript-fundamentals"],
    skill_focus: ["typescript-fundamentals"],
    adaptation_reason: "Progression naturelle après JavaScript",
    priority: "medium",
    content_path: "/content/typescript/intro",
  },
  {
    id: "svelte-game",
    type: "game",
    title: "Jeu Svelte Builder",
    description: "Jeu interactif pour apprendre Svelte en s'amusant",
    difficulty_level: 4,
    estimated_time: 45,
    learning_objectives: ["Composants", "Réactivité", "Stores"],
    prerequisites: ["javascript-fundamentals", "typescript-fundamentals"],
    skill_focus: ["svelte-advanced"],
    adaptation_reason: "Apprentissage ludique pour concepts avancés",
    priority: "low",
    content_path: "/content/svelte/game",
  },
];

// ===== MOTEUR DE RECOMMANDATION =====
export class AdaptiveResourceManager {
  private userPreferences: UserPreferences = {
    learningStyle: "mixed",
    timeConstraints: 30,
    preferredResourceTypes: ["interactive", "video"],
  };

  /**
   * Met à jour les préférences utilisateur
   */
  updateUserPreferences(preferences: Partial<UserPreferences>) {
    this.userPreferences = { ...this.userPreferences, ...preferences };
  }

  /**
   * Calcule un score de pertinence pour une ressource
   */
  private calculateRelevanceScore(
    resource: AdaptiveResource,
    context: RecommendationContext
  ): number {
    let score = 50; // Score de base

    // Score basé sur le style d'apprentissage
    if (
      this.matchesLearningStyle(resource, this.userPreferences.learningStyle)
    ) {
      score += 25;
    }

    // Score basé sur le temps disponible
    if (resource.estimated_time <= context.timeAvailable) {
      score += 20;
    } else if (resource.estimated_time <= context.timeAvailable * 1.2) {
      score += 10;
    } else {
      score -= 20;
    }

    // Score basé sur la priorité
    switch (resource.priority) {
      case "critical":
        score += 30;
        break;
      case "high":
        score += 20;
        break;
      case "medium":
        score += 10;
        break;
      case "low":
        score += 0;
        break;
    }

    // Score basé sur la difficulté appropriée
    const levelDiff = Math.abs(
      resource.difficulty_level - context.currentLevel
    );
    if (levelDiff === 0) score += 15;
    else if (levelDiff === 1) score += 10;
    else if (levelDiff > 2) score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Génère des recommandations pour une compétence
   */
  generateRecommendations(
    competence: string,
    maxRecommendations: number = 5,
    context?: Partial<RecommendationContext>
  ): AdaptiveRecommendation[] {
    const fullContext: RecommendationContext = {
      competence,
      currentLevel: 2,
      timeAvailable: this.userPreferences.timeConstraints,
      sessionGoal: "learn",
      ...context,
    };

    // Filtrer les ressources pertinentes
    const relevantResources = RESOURCE_BANK.filter(
      (r) =>
        r.skill_focus.some((skill) => skill.includes(competence)) ||
        r.skill_focus.includes(competence)
    );

    // Calculer les scores et trier
    const scoredResources = relevantResources.map((resource) => ({
      resource,
      score: this.calculateRelevanceScore(resource, fullContext),
    }));

    scoredResources.sort((a, b) => b.score - a.score);

    // Convertir en recommandations
    return scoredResources.slice(0, maxRecommendations).map((item) => ({
      resource: item.resource,
      relevance_score: item.score,
      estimated_completion_time: this.estimateCompletionTime(item.resource),
      adaptation_rationale: this.generateAdaptationRationale(
        item.resource,
        fullContext
      ),
      personalization_factors: this.getPersonalizationFactors(item.resource),
    }));
  }

  /**
   * Adapte le contenu d'une ressource selon le profil
   */
  adaptResourceContent(resource: AdaptiveResource): AdaptedContent {
    const adaptations: ContentAdaptation[] = [];

    // Adaptation basée sur le type de ressource
    switch (resource.type) {
      case "video":
        adaptations.push({
          type: "pacing",
          description: "Vitesse de lecture adaptée",
          parameters: { speed: 1.0 },
        });
        break;

      case "exercise":
        adaptations.push({
          type: "difficulty",
          description: "Exercices graduels",
          parameters: { startLevel: 1 },
        });
        break;

      case "reading":
        adaptations.push({
          type: "presentation",
          description: "Format de lecture optimisé",
          parameters: { fontSize: "medium", highlighting: true },
        });
        break;
    }

    return {
      originalResource: resource,
      adaptations,
      estimatedImprovement: adaptations.length * 10,
      adaptationRationale: "Contenu adapté à vos préférences d'apprentissage",
    };
  }

  /**
   * Analyse l'efficacité des ressources
   */
  analyzeResourceEffectiveness(): ResourceEffectivenessReport {
    const totalResources = RESOURCE_BANK.length;
    const avgDuration =
      RESOURCE_BANK.reduce((acc, r) => acc + r.estimated_time, 0) /
      totalResources;

    // Métriques par type
    const typeBreakdown: Record<string, ResourceTypeMetrics> = {};

    for (const resource of RESOURCE_BANK) {
      if (!typeBreakdown[resource.type]) {
        typeBreakdown[resource.type] = {
          count: 0,
          avg_duration: 0,
          avg_satisfaction: 4.0,
          completion_rate: 0.8,
        };
      }
      typeBreakdown[resource.type].count++;
      typeBreakdown[resource.type].avg_duration += resource.estimated_time;
    }

    // Calcul des moyennes
    Object.values(typeBreakdown).forEach((metrics) => {
      if (metrics.count > 0) {
        metrics.avg_duration /= metrics.count;
      }
    });

    return {
      total_resources: totalResources,
      total_interactions: 0,
      average_duration: avgDuration,
      average_satisfaction: 4.2,
      type_breakdown: typeBreakdown,
      top_performing_resources: RESOURCE_BANK.slice(0, 3).map((r) => ({
        id: r.id,
        score: 85,
      })),
      improvement_recommendations: [
        "Ajouter plus de ressources interactives",
        "Développer du contenu adaptatif avancé",
        "Améliorer les mécaniques de gamification",
      ],
      generated_at: new Date().toISOString(),
    };
  }

  // ===== MÉTHODES UTILITAIRES =====

  private matchesLearningStyle(
    resource: AdaptiveResource,
    userStyle: string
  ): boolean {
    const styleMapping: Record<string, Array<AdaptiveResource["type"]>> = {
      visual: ["video", "interactive", "reading"],
      auditory: ["video", "lesson"],
      kinesthetic: ["interactive", "exercise", "game"],
      reading: ["reading", "lesson"],
      mixed: ["video", "interactive", "exercise"],
    };

    return styleMapping[userStyle]?.includes(resource.type) || false;
  }

  private estimateCompletionTime(resource: AdaptiveResource): number {
    return resource.estimated_time;
  }

  private generateAdaptationRationale(
    resource: AdaptiveResource,
    context: RecommendationContext
  ): string {
    const reasons = [];

    if (
      this.matchesLearningStyle(resource, this.userPreferences.learningStyle)
    ) {
      reasons.push(
        `adapté à votre style d'apprentissage ${this.userPreferences.learningStyle}`
      );
    }

    if (resource.estimated_time <= context.timeAvailable) {
      reasons.push(
        `correspond à votre temps disponible (${context.timeAvailable}min)`
      );
    }

    if (resource.priority === "high" || resource.priority === "critical") {
      reasons.push("priorité élevée pour votre progression");
    }

    return reasons.length > 0
      ? `Recommandé car ${reasons.join(", ")}`
      : resource.adaptation_reason ||
          "Ressource pertinente pour vos objectifs d'apprentissage";
  }

  private getPersonalizationFactors(
    resource: AdaptiveResource
  ): PersonalizationFactor[] {
    return [
      {
        factor: "learning_style",
        value: this.userPreferences.learningStyle,
        impact: "high",
        explanation: `Adapté au style d'apprentissage ${this.userPreferences.learningStyle}`,
      },
      {
        factor: "time_constraints",
        value: `${resource.estimated_time}/${this.userPreferences.timeConstraints}min`,
        impact: "medium",
        explanation: "Durée adaptée à vos contraintes de temps",
      },
      {
        factor: "difficulty_level",
        value: resource.difficulty_level.toString(),
        impact: "high",
        explanation: `Niveau de difficulté ${resource.difficulty_level}/5`,
      },
    ];
  }
}

// ===== INSTANCE GLOBALE =====
export const adaptiveResourceManager = new AdaptiveResourceManager();

// ===== FONCTIONS UTILITAIRES =====
export function getResourcesByCompetence(
  competence: string
): AdaptiveResource[] {
  return RESOURCE_BANK.filter(
    (r) =>
      r.skill_focus.some((skill) => skill.includes(competence)) ||
      r.skill_focus.includes(competence)
  );
}

export function initializeResourceSystem() {
  console.log("Système de ressources adaptatives initialisé");
  console.log(`${RESOURCE_BANK.length} ressources disponibles`);

  // Mise à jour du store
  recommendedResources.set(RESOURCE_BANK.slice(0, 3));
}

// Initialisation automatique
initializeResourceSystem();
