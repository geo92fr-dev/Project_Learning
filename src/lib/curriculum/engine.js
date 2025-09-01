// 🤖 Curriculum Generation Engine - Phase 6
// Système intelligent de génération de curriculum éducatif

import { writable, derived } from 'svelte/store';

/**
 * 🧠 Intelligence Artificielle Pédagogique
 * Moteur de génération de curriculum adaptatif
 */

// Store principal du curriculum
export const curriculumStore = writable({
  currentCurriculum: null,
  generationProgress: 0,
  isGenerating: false,
  algorithms: {
    knowledgeGraph: true,
    collaborativeFiltering: false,
    contentBased: true,
    reinforcementLearning: false
  }
});

// Store des métadonnées curriculum
export const curriculumMetadata = writable({
  subjects: ['mathematiques', 'francais', 'sciences', 'histoire', 'geographie'],
  levels: ['6eme', '5eme', '4eme', '3eme', 'seconde', 'premiere', 'terminale'],
  competenceTypes: ['fondamentale', 'transversale', 'specifique', 'avancee'],
  difficultyScale: [1, 2, 3, 4, 5], // 1=Très facile, 5=Très difficile
  taxonomies: ['bloom', 'solo', 'competences-21e-siecle']
});

/**
 * 📊 Graphe de Connaissances
 * Architecture des relations entre compétences
 */
export class KnowledgeGraph {
  constructor() {
    this.nodes = new Map(); // Compétences/Concepts
    this.edges = new Map(); // Relations
    this.weights = new Map(); // Forces des relations
    this.metadata = new Map(); // Données enrichies
  }

  /**
   * Ajouter une compétence au graphe
   */
  addCompetence(id, data) {
    this.nodes.set(id, {
      id,
      title: data.title,
      description: data.description,
      level: data.level,
      subject: data.subject,
      type: data.type,
      difficulty: data.difficulty,
      estimatedTime: data.estimatedTime || 60, // minutes
      prerequisites: data.prerequisites || [],
      learningObjectives: data.learningObjectives || [],
      assessmentCriteria: data.assessmentCriteria || [],
      resources: data.resources || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Créer une relation entre compétences
   */
  addRelation(fromId, toId, type, weight = 1.0) {
    const relationKey = `${fromId}->${toId}`;
    this.edges.set(relationKey, {
      from: fromId,
      to: toId,
      type, // 'prerequis', 'recommande_apres', 'complement', 'alternatif'
      weight,
      confidence: 0.8, // Confiance dans la relation
      evidence: [], // Preuves de la relation
      createdAt: new Date().toISOString()
    });
  }

  /**
   * Trouver le chemin optimal d'apprentissage
   */
  findLearningPath(startCompetence, targetCompetence, userProfile = {}) {
    const visited = new Set();
    const path = [];
    const queue = [{ competence: startCompetence, path: [startCompetence] }];

    while (queue.length > 0) {
      const { competence, path: currentPath } = queue.shift();
      
      if (competence === targetCompetence) {
        return this.optimizePath(currentPath, userProfile);
      }

      if (visited.has(competence)) continue;
      visited.add(competence);

      // Trouver les compétences suivantes
      const nextCompetences = this.getNextCompetences(competence);
      for (const next of nextCompetences) {
        if (!visited.has(next.id)) {
          queue.push({
            competence: next.id,
            path: [...currentPath, next.id]
          });
        }
      }
    }

    return null; // Aucun chemin trouvé
  }

  /**
   * Optimiser le chemin selon le profil utilisateur
   */
  optimizePath(path, userProfile) {
    return path.map(competenceId => {
      const competence = this.nodes.get(competenceId);
      const adaptedCompetence = { ...competence };

      // Adaptation selon le profil
      if (userProfile.preferredDifficulty) {
        adaptedCompetence.adaptedDifficulty = Math.min(
          competence.difficulty,
          userProfile.preferredDifficulty
        );
      }

      if (userProfile.availableTime) {
        adaptedCompetence.adaptedTime = Math.min(
          competence.estimatedTime,
          userProfile.availableTime
        );
      }

      if (userProfile.learningStyle) {
        adaptedCompetence.recommendedResources = this.filterResourcesByStyle(
          competence.resources,
          userProfile.learningStyle
        );
      }

      return adaptedCompetence;
    });
  }

  /**
   * Obtenir les compétences suivantes possibles
   */
  getNextCompetences(competenceId) {
    const nextCompetences = [];
    
    for (const [relationKey, relation] of this.edges) {
      if (relation.from === competenceId) {
        const targetCompetence = this.nodes.get(relation.to);
        if (targetCompetence) {
          nextCompetences.push({
            ...targetCompetence,
            relationWeight: relation.weight,
            relationType: relation.type
          });
        }
      }
    }

    // Trier par poids de relation (priorité)
    return nextCompetences.sort((a, b) => b.relationWeight - a.relationWeight);
  }

  /**
   * Filtrer les ressources par style d'apprentissage
   */
  filterResourcesByStyle(resources, learningStyle) {
    const styleMapping = {
      visual: ['video', 'schema', 'infographie', 'mindmap'],
      auditif: ['audio', 'podcast', 'explication', 'discussion'],
      kinesthesique: ['exercice', 'simulation', 'manipulation', 'jeu'],
      lecture: ['texte', 'article', 'livre', 'documentation']
    };

    const preferredTypes = styleMapping[learningStyle] || [];
    
    return resources.filter(resource => 
      preferredTypes.some(type => resource.type?.includes(type))
    );
  }

  /**
   * Générer des statistiques du graphe
   */
  getGraphStats() {
    return {
      totalCompetences: this.nodes.size,
      totalRelations: this.edges.size,
      avgConnections: this.edges.size / this.nodes.size,
      subjectDistribution: this.getSubjectDistribution(),
      difficultyDistribution: this.getDifficultyDistribution(),
      completeness: this.calculateCompleteness()
    };
  }

  getSubjectDistribution() {
    const distribution = {};
    for (const competence of this.nodes.values()) {
      distribution[competence.subject] = (distribution[competence.subject] || 0) + 1;
    }
    return distribution;
  }

  getDifficultyDistribution() {
    const distribution = {};
    for (const competence of this.nodes.values()) {
      const diff = competence.difficulty;
      distribution[diff] = (distribution[diff] || 0) + 1;
    }
    return distribution;
  }

  calculateCompleteness() {
    // Estimation de la complétude du graphe
    let connectedNodes = 0;
    for (const competence of this.nodes.values()) {
      const hasConnections = Array.from(this.edges.values()).some(
        edge => edge.from === competence.id || edge.to === competence.id
      );
      if (hasConnections) connectedNodes++;
    }
    return connectedNodes / this.nodes.size;
  }
}

/**
 * 🎯 Moteur de Recommandation
 * Système de recommandation personnalisé
 */
export class RecommendationEngine {
  constructor(knowledgeGraph) {
    this.graph = knowledgeGraph;
    this.userProfiles = new Map();
    this.learningHistory = new Map();
  }

  /**
   * Générer des recommandations personnalisées
   */
  generateRecommendations(userId, options = {}) {
    const userProfile = this.userProfiles.get(userId);
    const history = this.learningHistory.get(userId) || [];
    
    const recommendations = [];

    // 1. Recommandations basées sur le contenu
    const contentBased = this.getContentBasedRecommendations(userProfile, history);
    recommendations.push(...contentBased);

    // 2. Recommandations collaboratives
    const collaborative = this.getCollaborativeRecommendations(userId, history);
    recommendations.push(...collaborative);

    // 3. Recommandations par graphe de connaissances
    const knowledgeBased = this.getKnowledgeBasedRecommendations(userProfile, history);
    recommendations.push(...knowledgeBased);

    // 4. Facteur de sérendipité (découvertes inattendues)
    const serendipity = this.addSerendipityFactor(recommendations, options.serendipityLevel || 0.1);

    return this.rankAndFilter(serendipity, options);
  }

  /**
   * Recommandations basées sur le contenu
   */
  getContentBasedRecommendations(userProfile, history) {
    if (!userProfile) return [];

    const completedCompetences = history.map(h => h.competenceId);
    const recommendations = [];

    for (const competence of this.graph.nodes.values()) {
      if (completedCompetences.includes(competence.id)) continue;

      const score = this.calculateContentSimilarity(competence, userProfile);
      if (score > 0.5) {
        recommendations.push({
          competence,
          score,
          type: 'content-based',
          reason: 'Correspond à vos préférences d\'apprentissage'
        });
      }
    }

    return recommendations;
  }

  /**
   * Recommandations collaboratives
   */
  getCollaborativeRecommendations(userId, history) {
    const similarUsers = this.findSimilarUsers(userId);
    const recommendations = [];

    for (const similarUser of similarUsers) {
      const otherHistory = this.learningHistory.get(similarUser.id) || [];
      const completedByOther = otherHistory.map(h => h.competenceId);
      const myCompleted = history.map(h => h.competenceId);

      for (const competenceId of completedByOther) {
        if (!myCompleted.includes(competenceId)) {
          const competence = this.graph.nodes.get(competenceId);
          if (competence) {
            recommendations.push({
              competence,
              score: similarUser.similarity * 0.8,
              type: 'collaborative',
              reason: `Recommandé par des apprenants similaires`
            });
          }
        }
      }
    }

    return recommendations;
  }

  /**
   * Recommandations par graphe de connaissances
   */
  getKnowledgeBasedRecommendations(userProfile, history) {
    const completedCompetences = history.map(h => h.competenceId);
    const recommendations = [];

    for (const competenceId of completedCompetences) {
      const nextCompetences = this.graph.getNextCompetences(competenceId);
      
      for (const next of nextCompetences) {
        if (!completedCompetences.includes(next.id)) {
          recommendations.push({
            competence: next,
            score: next.relationWeight * 0.9,
            type: 'knowledge-based',
            reason: `Suite logique de "${this.graph.nodes.get(competenceId)?.title}"`
          });
        }
      }
    }

    return recommendations;
  }

  /**
   * Ajouter un facteur de sérendipité
   */
  addSerendipityFactor(recommendations, level) {
    if (level === 0) return recommendations;

    const serendipityCount = Math.floor(recommendations.length * level);
    const allCompetences = Array.from(this.graph.nodes.values());
    const existingIds = new Set(recommendations.map(r => r.competence.id));

    for (let i = 0; i < serendipityCount; i++) {
      const randomCompetence = allCompetences[Math.floor(Math.random() * allCompetences.length)];
      
      if (!existingIds.has(randomCompetence.id)) {
        recommendations.push({
          competence: randomCompetence,
          score: Math.random() * 0.3, // Score faible mais pas nul
          type: 'serendipity',
          reason: 'Découverte suggérée pour élargir vos horizons'
        });
        existingIds.add(randomCompetence.id);
      }
    }

    return recommendations;
  }

  /**
   * Classer et filtrer les recommandations
   */
  rankAndFilter(recommendations, options) {
    // Supprimer les doublons
    const uniqueRecommendations = recommendations.filter((rec, index, self) =>
      index === self.findIndex(r => r.competence.id === rec.competence.id)
    );

    // Trier par score décroissant
    uniqueRecommendations.sort((a, b) => b.score - a.score);

    // Appliquer les filtres
    let filtered = uniqueRecommendations;

    if (options.maxDifficulty) {
      filtered = filtered.filter(r => r.competence.difficulty <= options.maxDifficulty);
    }

    if (options.subject) {
      filtered = filtered.filter(r => r.competence.subject === options.subject);
    }

    if (options.maxTime) {
      filtered = filtered.filter(r => r.competence.estimatedTime <= options.maxTime);
    }

    // Limiter le nombre de résultats
    const limit = options.limit || 10;
    return filtered.slice(0, limit);
  }

  /**
   * Calculer la similarité de contenu
   */
  calculateContentSimilarity(competence, userProfile) {
    let score = 0;

    // Correspondance de niveau
    if (userProfile.preferredLevel === competence.level) score += 0.3;

    // Correspondance de matière
    if (userProfile.favoriteSubjects?.includes(competence.subject)) score += 0.3;

    // Correspondance de difficulté
    const diffDiff = Math.abs((userProfile.preferredDifficulty || 3) - competence.difficulty);
    score += (5 - diffDiff) / 5 * 0.2;

    // Correspondance de temps
    if (userProfile.availableTime && competence.estimatedTime <= userProfile.availableTime) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Trouver des utilisateurs similaires
   */
  findSimilarUsers(userId) {
    const userHistory = this.learningHistory.get(userId) || [];
    const userCompetences = new Set(userHistory.map(h => h.competenceId));
    const similarities = [];

    for (const [otherUserId, otherHistory] of this.learningHistory) {
      if (otherUserId === userId) continue;

      const otherCompetences = new Set(otherHistory.map(h => h.competenceId));
      const similarity = this.calculateJaccardSimilarity(userCompetences, otherCompetences);

      if (similarity > 0.2) { // Seuil de similarité minimum
        similarities.push({ id: otherUserId, similarity });
      }
    }

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }

  /**
   * Calculer la similarité de Jaccard entre deux ensembles
   */
  calculateJaccardSimilarity(setA, setB) {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }
}

// Store dérivé pour les recommandations
export const recommendationsStore = derived(
  [curriculumStore, curriculumMetadata],
  ([$curriculum, $metadata]) => {
    // Les recommandations seront calculées dynamiquement
    return {
      personalizedRecommendations: [],
      trendingCompetences: [],
      nextSuggestedPath: null,
      completionPrediction: null
    };
  }
);

// Export du moteur global
export const curriculumEngine = {
  knowledgeGraph: new KnowledgeGraph(),
  recommendationEngine: null, // Sera initialisé avec le graphe
  
  init() {
    this.recommendationEngine = new RecommendationEngine(this.knowledgeGraph);
    console.log('🤖 Curriculum Generation Engine initialisé');
  },

  generateCurriculum(subject, level, options = {}) {
    console.log(`🎯 Génération curriculum: ${subject} ${level}`);
    // Logique de génération sera implémentée
    return this.knowledgeGraph.findLearningPath(
      options.startCompetence,
      options.targetCompetence,
      options.userProfile
    );
  }
};
