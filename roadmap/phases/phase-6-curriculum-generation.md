# 🤖 Phase 6 : Curriculum Generation (3 jours - Approche Progressive) - v1.4

## 📋 **Vue d'Ensemble**

**Objectif** : Génération curriculum avec stratégie progressive (1 matière → templates → génération auto)
**Version cible** : v1.4 (curriculum intelligent)  
**Groupe** : ⚙️ MOTEUR  
**Prérequis** : Phase 5 (Firebase Data Layer) validée ✅
**⚡ Stratégie optimisée** : Validation 1 matière complète puis expansion automatisée

---

## 🎯 **Principes Fondamentaux & Architecture**

### 🧠 **Intelligence Artificielle Pédagogique**

**Algorithmes de Curriculum :**
- **Graph-based Learning Paths** : Dépendances entre compétences modélisées en graphe
- **Reinforcement Learning** : Optimisation continue basée sur outcomes
- **Collaborative Filtering** : Recommandations basées sur apprenants similaires
- **Content-Based Filtering** : Matching profil apprenant ↔ ressources
- **Multi-Armed Bandit** : A/B testing intelligent des parcours

**Moteur de Recommandation :**
- **Cold Start Problem** : Gestion nouveaux utilisateurs sans historique
- **Diversity vs Accuracy** : Balance exploration/exploitation
- **Serendipity Factor** : Découvertes inattendues mais pertinentes
- **Temporal Dynamics** : Evolution préférences dans le temps
- **Context Awareness** : Adaptation selon contexte (temps, lieu, mood)

### 📊 **Architecture des Données Curriculum**

**Graphe de Connaissances :**
- **Nodes** : Compétences, concepts, ressources
- **Edges** : Relations (prerequis, recommandé_après, complément)
- **Weights** : Force des relations, difficulté transitions
- **Metadata** : Taxonomies, ontologies éducatives
- **Dynamic Updates** : Évolution basée sur analytics

**Modèles Prédictifs :**
- **Knowledge Tracing** : Estimation probabilité de maîtrise
- **Performance Prediction** : Prédiction réussite parcours
- **Dropout Prevention** : Détection risque abandon
- **Optimal Stopping** : Moment idéal passage niveau suivant
- **Learning Curve Modeling** : Vitesse d'acquisition personnalisée

### 🔬 **Approche Qualité & Recherche**

**Validation Scientifique :**
- **Randomized Controlled Trials** : Efficacité vs approches traditionnelles
- **Learning Gain Analysis** : Mesure amélioration réelle compétences
- **Retention Studies** : Mémorisation long terme
- **Transfer Assessment** : Application connaissances nouveaux contextes
- **Engagement Metrics** : Motivation et persévérance

---

## 📚 **Références Modulaires**

### **[REF]** Algorithmes ML : **[machine-learning.md](../references/ai/machine-learning.md)**
- ✅ Implémentation algorithmes de recommandation
- ✅ Modèles de prédiction performance
- ✅ Système de feedback en temps réel
- ✅ A/B testing framework intégré

### **[REF]** Graphes de connaissances : **[knowledge-graphs.md](../references/ai/knowledge-graphs.md)**
- ✅ Modélisation relations entre compétences
- ✅ Algorithmes de pathfinding pédagogique
- ✅ Visualisation interactive des parcours
- ✅ Mise à jour dynamique des relations

---

## 📝 **Instructions d'Implémentation**

### 🎯 **Stratégie Progressive Optimisée (Recommandation Expert)**

**⚡ Approche en 3 étapes pour réduire les risques :**

**[PHASE-6.1] Validation Matière Pilote (Jour 1) :**
- **Matière** : Mathématiques 6ème (5 compétences de base)
- **Objectif** : Valider architecture + pipeline de génération
- **Livrables** : 1 matière complète fonctionnelle

**[PHASE-6.2] Templates et Scripts d'Automatisation (Jour 2) :**
- **Scripts** : `generate-curriculum.js` + `firebase-bulk-import.js`
- **Templates** : Structures pré-remplies pour accélération
- **Validation** : Tests automatisés de génération

**[PHASE-6.3] Génération Automatique Massive (Jour 3) :**
- **Exécution** : 6 matières × 4 niveaux × 5 compétences = 120 items
- **Monitoring** : Surveillance performance et coûts Firebase
- **Validation** : Contrôle qualité et cohérence

### 🔧 **Scripts d'Automatisation Critiques**

**[FILE]** Créer `scripts/generate-curriculum.js` - **SCRIPT ESSENTIEL** :

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Configuration des matières et niveaux
const matters = ['Math', 'Français', 'Histoire-Géo', 'Sciences', 'Anglais', 'Arts & Techno'];
const levels = ['6ème', '5ème', '4ème', '3ème'];
const skillsPerLevel = 5; // 5 compétences par niveau/matière

// Templates de compétences par matière
const skillTemplates = {
  'Math': [
    'Calculs et opérations',
    'Géométrie et mesures', 
    'Proportionnalité',
    'Statistiques et probabilités',
    'Raisonnement mathématique'
  ],
  'Français': [
    'Compréhension écrite',
    'Expression écrite',
    'Grammaire et orthographe',
    'Vocabulaire',
    'Littérature et culture'
  ],
  // ... autres matières
};

async function generateCurriculum() {
  console.log('🚀 Génération curriculum - 120+ compétences');
  
  let generatedCount = 0;
  const totalItems = matters.length * levels.length * skillsPerLevel;
  
  for (const matter of matters) {
    for (const level of levels) {
      for (let i = 1; i <= skillsPerLevel; i++) {
        const skillId = `${matter.toLowerCase()}-${level.toLowerCase()}-skill-${i}`;
        const template = skillTemplates[matter]?.[i-1] || `Compétence ${i}`;
        
        const competence = {
          id: skillId,
          name: `${template} - ${level}`,
          description: `Maîtrise de ${template.toLowerCase()} niveau ${level}`,
          category: matter,
          level: parseInt(level.charAt(0)) - 5, // 6ème = 1, 5ème = 2, etc.
          metadata: {
            createdAt: new Date().toISOString(),
            createdBy: 'curriculum-generator',
            isActive: true,
            autoGenerated: true
          }
        };
        
        console.log(`✅ Généré: ${skillId}`);
        generatedCount++;
        
        // Sauvegarde (à implémenter selon la stratégie)
        await saveCompetence(competence);
      }
    }
  }
  
  console.log(`🎉 Génération terminée: ${generatedCount}/${totalItems} compétences`);
}

async function saveCompetence(competence) {
  // Phase 6.1: Validation locale
  // Phase 6.3: Import Firebase
  const output = JSON.stringify(competence, null, 2);
  fs.appendFileSync('generated-curriculum.json', output + ',\n');
}

// Exécution
if (require.main === module) {
  generateCurriculum().catch(console.error);
}

module.exports = { generateCurriculum, skillTemplates };
```

**[FILE]** Créer `scripts/firebase-bulk-import.js` - **IMPORT OPTIMISÉ** :

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Initialisation Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY))
});

const db = admin.firestore();

async function bulkImportCurriculum() {
  console.log('📥 Import masse Firebase en cours...');
  
  try {
    const curriculumData = JSON.parse(fs.readFileSync('generated-curriculum.json', 'utf8'));
    
    // Import par batch pour optimiser performance
    const batchSize = 500; // Limite Firestore
    const batches = [];
    
    for (let i = 0; i < curriculumData.length; i += batchSize) {
      const batch = db.batch();
      const chunk = curriculumData.slice(i, i + batchSize);
      
      chunk.forEach(item => {
        const docRef = db.collection('competences').doc(item.id);
        batch.set(docRef, item);
      });
      
      batches.push(batch.commit());
    }
    
    await Promise.all(batches);
    console.log(`✅ Import réussi: ${curriculumData.length} documents`);
    
    // Monitoring coûts
    console.log(`💰 Coût estimé: ${curriculumData.length} écritures Firestore`);
    
  } catch (error) {
    console.error('❌ Erreur import:', error);
    throw error;
  }
}

// Validation des données avant import
async function validateCurriculumData() {
  const data = JSON.parse(fs.readFileSync('generated-curriculum.json', 'utf8'));
  
  const validation = {
    totalItems: data.length,
    matters: [...new Set(data.map(item => item.category))],
    levels: [...new Set(data.map(item => item.level))],
    duplicates: data.length - new Set(data.map(item => item.id)).size
  };
  
  console.log('📊 Validation données:', validation);
  
  if (validation.duplicates > 0) {
    throw new Error(`❌ ${validation.duplicates} IDs dupliqués détectés`);
  }
  
  return validation;
}

module.exports = { bulkImportCurriculum, validateCurriculumData };
```

### 🧠 **Étape 6.1 : Moteur de Génération de Curriculum**

**[FILE]** Créer `src/lib/curriculum/curriculumEngine.ts` :

```ts
import { z } from 'zod';
import type { UserProfile, Competence, Course } from '$lib/firebase/collections';

// ===== TYPES DE CURRICULUM =====
export const LearningPathSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  targetCompetences: z.array(z.string()),
  estimatedDuration: z.number(), // en heures
  difficulty: z.number().min(0).max(1),
  nodes: z.array(z.object({
    id: z.string(),
    type: z.enum(['competence', 'course', 'assessment', 'milestone']),
    resourceId: z.string(),
    title: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number()
    }),
    prerequisites: z.array(z.string()).default([]),
    estimatedTime: z.number(), // minutes
    difficulty: z.number().min(0).max(1),
    priority: z.number().min(0).max(1).default(0.5)
  })),
  edges: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(['prerequisite', 'recommended', 'optional', 'alternative']),
    weight: z.number().min(0).max(1).default(1),
    condition: z.string().optional() // Condition pour débloquer
  })),
  adaptiveRules: z.array(z.object({
    trigger: z.object({
      type: z.enum(['performance', 'time', 'engagement', 'completion']),
      threshold: z.number(),
      comparison: z.enum(['greater', 'less', 'equal'])
    }),
    action: z.object({
      type: z.enum(['skip', 'repeat', 'branch', 'recommend', 'adjust_difficulty']),
      parameters: z.record(z.unknown())
    })
  })).default([]),
  personalization: z.object({
    learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'reading', 'mixed']),
    pacePreference: z.enum(['slow', 'normal', 'fast']),
    difficultyPreference: z.number().min(0).max(1),
    interestTags: z.array(z.string()).default([]),
    availableTimeSlots: z.array(z.object({
      day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      startTime: z.string(), // HH:MM
      endTime: z.string(),
      effectiveness: z.number().min(0).max(1).default(1) // Productivité dans ce créneau
    })).default([])
  }),
  metadata: z.object({
    version: z.string().default('1.0'),
    generatedAt: z.string(),
    algorithm: z.string(), // Algorithme utilisé pour génération
    confidence: z.number().min(0).max(1), // Confiance dans la recommandation
    lastOptimized: z.string(),
    isActive: z.boolean().default(true)
  })
});

export type LearningPath = z.infer<typeof LearningPathSchema>;
export type LearningNode = LearningPath['nodes'][0];
export type LearningEdge = LearningPath['edges'][0];

// ===== CONTEXTE DE GÉNÉRATION =====
export interface GenerationContext {
  userProfile: UserProfile;
  targetGoals: string[]; // IDs des compétences cibles
  constraints: {
    maxDuration?: number; // heures max
    maxComplexity?: number; // 0-1
    preferredFormats?: string[]; // video, text, interactive
    excludeTopics?: string[];
    mustIncludeTopics?: string[];
  };
  preferences: {
    learningStyle: string;
    sessionDuration: number; // minutes
    weeklyCommitment: number; // heures par semaine
    startDate: string;
    deadline?: string;
  };
  currentKnowledge: Record<string, number>; // competenceId -> masteryLevel
  historicalPerformance: PerformanceData[];
}

export interface PerformanceData {
  competenceId: string;
  masteryAchieved: number;
  timeSpent: number;
  attemptsNeeded: number;
  retentionRate: number;
  engagementScore: number;
  timestamp: string;
}

// ===== MOTEUR DE GÉNÉRATION =====
export class CurriculumEngine {
  private knowledgeGraph: KnowledgeGraph;
  private recommendationEngine: RecommendationEngine;
  private adaptiveEngine: CurriculumAdaptiveEngine;

  constructor() {
    this.knowledgeGraph = new KnowledgeGraph();
    this.recommendationEngine = new RecommendationEngine();
    this.adaptiveEngine = new CurriculumAdaptiveEngine();
  }

  /**
   * Génère un parcours d'apprentissage personnalisé
   */
  async generateLearningPath(context: GenerationContext): Promise<LearningPath> {
    // 1. Analyser les compétences cibles et leurs dépendances
    const targetNodes = await this.analyzeTargetCompetences(context.targetGoals);
    
    // 2. Construire le graphe de prérequis
    const prerequisiteGraph = await this.buildPrerequisiteGraph(targetNodes, context);
    
    // 3. Optimiser le parcours selon le profil utilisateur
    const optimizedPath = await this.optimizePath(prerequisiteGraph, context);
    
    // 4. Ajouter les règles adaptatives
    const adaptiveRules = await this.generateAdaptiveRules(optimizedPath, context);
    
    // 5. Personnaliser selon les préférences
    const personalizedPath = await this.personalizePath(optimizedPath, context);

    return {
      id: crypto.randomUUID(),
      userId: context.userProfile.id,
      title: this.generatePathTitle(context.targetGoals),
      description: this.generatePathDescription(personalizedPath, context),
      targetCompetences: context.targetGoals,
      estimatedDuration: this.calculateTotalDuration(personalizedPath),
      difficulty: this.calculateAverageDifficulty(personalizedPath),
      nodes: personalizedPath.nodes,
      edges: personalizedPath.edges,
      adaptiveRules,
      personalization: {
        learningStyle: context.preferences.learningStyle as any,
        pacePreference: this.determinePacePreference(context),
        difficultyPreference: context.userProfile.learningProfile.difficultyPreference,
        interestTags: context.userProfile.learningProfile.interests,
        availableTimeSlots: []
      },
      metadata: {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        algorithm: 'HybridRecommendation_v2',
        confidence: this.calculateConfidence(personalizedPath, context),
        lastOptimized: new Date().toISOString(),
        isActive: true
      }
    };
  }

  /**
   * Adapte un parcours existant basé sur les performances
   */
  async adaptPath(
    currentPath: LearningPath, 
    performanceData: PerformanceData[],
    userProgress: any
  ): Promise<LearningPath> {
    // Analyser les performances récentes
    const performanceAnalysis = this.analyzePerformance(performanceData);
    
    // Identifier les zones de difficulté
    const strugglingAreas = this.identifyStrugglingAreas(performanceAnalysis);
    
    // Ajuster la difficulté et le rythme
    const adjustedPath = await this.adjustPathDifficulty(currentPath, performanceAnalysis);
    
    // Ajouter du contenu de renforcement si nécessaire
    if (strugglingAreas.length > 0) {
      return this.addReinforcementContent(adjustedPath, strugglingAreas);
    }
    
    return adjustedPath;
  }

  /**
   * Recommande le prochain élément à étudier
   */
  async getNextRecommendation(
    path: LearningPath, 
    currentProgress: any,
    context: Partial<GenerationContext>
  ): Promise<NextRecommendation> {
    // Identifier les nœuds disponibles (prérequis satisfaits)
    const availableNodes = this.getAvailableNodes(path, currentProgress);
    
    // Scorer chaque option selon multiple critères
    const scoredOptions = await Promise.all(
      availableNodes.map(node => this.scoreRecommendation(node, path, context))
    );
    
    // Sélectionner la meilleure option
    const bestOption = scoredOptions.sort((a, b) => b.score - a.score)[0];
    
    // Générer des alternatives
    const alternatives = scoredOptions
      .filter(option => option.node.id !== bestOption.node.id)
      .slice(0, 3);

    return {
      primary: bestOption,
      alternatives,
      reasoning: this.generateRecommendationReasoning(bestOption, alternatives),
      adaptations: await this.generateAdaptations(bestOption.node, context)
    };
  }

  // ===== MÉTHODES PRIVÉES =====

  private async analyzeTargetCompetences(targetIds: string[]): Promise<CompetenceNode[]> {
    // Charger les compétences depuis Firebase
    const competences = await Promise.all(
      targetIds.map(id => this.loadCompetenceById(id))
    );
    
    return competences.map(comp => ({
      id: comp.id,
      name: comp.name,
      level: comp.level,
      prerequisites: comp.prerequisites,
      difficulty: this.calculateCompetenceDifficulty(comp),
      estimatedTime: this.estimateCompetenceTime(comp)
    }));
  }

  private async buildPrerequisiteGraph(
    targets: CompetenceNode[], 
    context: GenerationContext
  ): Promise<PathGraph> {
    const graph = new Map<string, GraphNode>();
    const visited = new Set<string>();

    // Parcours en profondeur pour construire le graphe complet
    for (const target of targets) {
      await this.buildGraphRecursive(target.id, graph, visited, context);
    }

    return this.optimizeGraphStructure(graph);
  }

  private async buildGraphRecursive(
    competenceId: string,
    graph: Map<string, GraphNode>,
    visited: Set<string>,
    context: GenerationContext
  ): Promise<void> {
    if (visited.has(competenceId)) return;
    visited.add(competenceId);

    const competence = await this.loadCompetenceById(competenceId);
    const resources = await this.findResourcesForCompetence(competenceId, context);

    // Ajouter le nœud de compétence
    graph.set(competenceId, {
      id: competenceId,
      type: 'competence',
      data: competence,
      resources,
      prerequisites: competence.prerequisites
    });

    // Traiter récursivement les prérequis
    for (const prereqId of competence.prerequisites) {
      await this.buildGraphRecursive(prereqId, graph, visited, context);
    }
  }

  private async optimizePath(graph: PathGraph, context: GenerationContext): Promise<OptimizedPath> {
    // Algorithme de pathfinding optimal selon profil utilisateur
    const algorithm = this.selectOptimizationAlgorithm(context);
    
    switch (algorithm) {
      case 'shortest_path':
        return this.findShortestPath(graph, context);
      case 'balanced_difficulty':
        return this.findBalancedDifficultyPath(graph, context);
      case 'engagement_optimized':
        return this.findEngagementOptimizedPath(graph, context);
      default:
        return this.findHybridOptimalPath(graph, context);
    }
  }

  private selectOptimizationAlgorithm(context: GenerationContext): string {
    const profile = context.userProfile;
    
    // Algorithme basé sur profil et préférences
    if (profile.progressTracking.averageScore && profile.progressTracking.averageScore > 0.8) {
      return 'shortest_path'; // Apprenant avancé, chemin direct
    } else if (profile.learningProfile.difficultyPreference < 0.3) {
      return 'balanced_difficulty'; // Préfère progressif
    } else {
      return 'engagement_optimized'; // Focus sur l'engagement
    }
  }

  private calculateConfidence(path: OptimizedPath, context: GenerationContext): number {
    let confidence = 0.7; // Base
    
    // Augmenter confiance selon données disponibles
    if (context.historicalPerformance.length > 5) confidence += 0.1;
    if (context.currentKnowledge && Object.keys(context.currentKnowledge).length > 3) confidence += 0.1;
    if (context.userProfile.progressTracking.coursesCompleted > 2) confidence += 0.1;
    
    return Math.min(1, confidence);
  }

  private generateAdaptiveRules(path: OptimizedPath, context: GenerationContext): AdaptiveRule[] {
    const rules: AdaptiveRule[] = [];

    // Règle : Si performance faible, ajouter renforcement
    rules.push({
      trigger: {
        type: 'performance',
        threshold: 0.6,
        comparison: 'less'
      },
      action: {
        type: 'recommend',
        parameters: {
          contentType: 'reinforcement',
          difficulty: 'easier'
        }
      }
    });

    // Règle : Si temps dépassé, suggérer pause
    rules.push({
      trigger: {
        type: 'time',
        threshold: context.preferences.sessionDuration * 1.5,
        comparison: 'greater'
      },
      action: {
        type: 'recommend',
        parameters: {
          action: 'take_break',
          duration: 15
        }
      }
    });

    return rules;
  }
}

// ===== TYPES SUPPLÉMENTAIRES =====
interface CompetenceNode {
  id: string;
  name: string;
  level: number;
  prerequisites: string[];
  difficulty: number;
  estimatedTime: number;
}

interface GraphNode {
  id: string;
  type: 'competence' | 'course' | 'assessment';
  data: any;
  resources: any[];
  prerequisites: string[];
}

interface PathGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, string[]>;
}

interface OptimizedPath {
  nodes: LearningNode[];
  edges: LearningEdge[];
  totalDuration: number;
  averageDifficulty: number;
}

interface NextRecommendation {
  primary: ScoredOption;
  alternatives: ScoredOption[];
  reasoning: string;
  adaptations: Adaptation[];
}

interface ScoredOption {
  node: LearningNode;
  score: number;
  factors: {
    difficulty_match: number;
    learning_style_fit: number;
    engagement_potential: number;
    time_efficiency: number;
  };
}

interface Adaptation {
  type: string;
  description: string;
  parameters: Record<string, any>;
}

type AdaptiveRule = LearningPath['adaptiveRules'][0];

// ===== GRAPHE DE CONNAISSANCES =====
export class KnowledgeGraph {
  private graph: Map<string, CompetenceNode> = new Map();
  private relationshipMatrix: Map<string, Map<string, number>> = new Map();

  /**
   * Charge le graphe de connaissances depuis Firebase
   */
  async loadGraph(): Promise<void> {
    // Implémentation du chargement depuis Firestore
    // avec mise en cache pour performance
  }

  /**
   * Trouve le chemin optimal entre deux compétences
   */
  findOptimalPath(from: string, to: string, constraints: any): string[] {
    // Algorithme A* adapté pour l'éducation
    return [];
  }

  /**
   * Calcule la similarité entre deux compétences
   */
  calculateSimilarity(comp1: string, comp2: string): number {
    // Utilise word embeddings ou taxonomies éducatives
    return 0;
  }
}

// Instance globale
export const curriculumEngine = new CurriculumEngine();
```

### 🎯 **Étape 6.2 : Système de Recommandation**

**[FILE]** Créer `src/lib/curriculum/recommendationEngine.ts` :

```ts
import type { UserProfile, Course, Competence } from '$lib/firebase/collections';
import type { PerformanceData } from './curriculumEngine';

// ===== TYPES DE RECOMMANDATION =====
export interface RecommendationRequest {
  userId: string;
  context: RecommendationContext;
  filters?: RecommendationFilters;
  count?: number;
}

export interface RecommendationContext {
  currentCompetences: string[];
  targetGoals: string[];
  sessionTimeAvailable: number; // minutes
  deviceType: 'mobile' | 'tablet' | 'desktop';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  mood?: 'motivated' | 'tired' | 'curious' | 'stressed';
  environment: 'home' | 'commute' | 'work' | 'library';
}

export interface RecommendationFilters {
  contentTypes?: string[];
  difficultyRange?: [number, number];
  durationRange?: [number, number];
  languages?: string[];
  excludeCompleted?: boolean;
}

export interface Recommendation {
  id: string;
  type: 'course' | 'exercise' | 'reading' | 'video' | 'practice';
  resourceId: string;
  title: string;
  description: string;
  score: number; // 0-1
  confidence: number; // 0-1
  reasoning: RecommendationReasoning;
  metadata: {
    estimatedDuration: number;
    difficulty: number;
    learningStyle: string[];
    tags: string[];
  };
  adaptations: RecommendationAdaptation[];
}

export interface RecommendationReasoning {
  primary: string; // Raison principale
  factors: {
    user_preference: number;
    learning_style_match: number;
    difficulty_appropriateness: number;
    sequential_logic: number;
    peer_success: number;
    novelty: number;
  };
  explanation: string;
}

export interface RecommendationAdaptation {
  type: 'content' | 'presentation' | 'interaction';
  modification: string;
  reason: string;
}

// ===== MOTEUR DE RECOMMANDATION =====
export class RecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map();
  private contentFeatures: Map<string, ContentFeatures> = new Map();
  private userSimilarityMatrix: Map<string, Map<string, number>> = new Map();
  private performanceHistory: Map<string, PerformanceData[]> = new Map();

  /**
   * Génère des recommandations personnalisées
   */
  async generateRecommendations(request: RecommendationRequest): Promise<Recommendation[]> {
    const userProfile = await this.getUserProfile(request.userId);
    
    // 1. Recommandations content-based (basées sur profil utilisateur)
    const contentBasedRecs = await this.generateContentBasedRecommendations(
      userProfile, 
      request.context, 
      request.filters
    );

    // 2. Recommandations collaborative filtering (basées sur utilisateurs similaires)
    const collaborativeRecs = await this.generateCollaborativeRecommendations(
      userProfile, 
      request.context
    );

    // 3. Recommandations contextuelles (basées sur contexte immédiat)
    const contextualRecs = await this.generateContextualRecommendations(
      userProfile,
      request.context
    );

    // 4. Hybrid scoring - combinaison des approches
    const hybridRecs = this.combineRecommendations([
      { recommendations: contentBasedRecs, weight: 0.4 },
      { recommendations: collaborativeRecs, weight: 0.3 },
      { recommendations: contextualRecs, weight: 0.3 }
    ]);

    // 5. Diversification et re-ranking
    const diversifiedRecs = this.diversifyRecommendations(hybridRecs, userProfile);

    // 6. Application des filtres
    const filteredRecs = this.applyFilters(diversifiedRecs, request.filters);

    return filteredRecs.slice(0, request.count || 10);
  }

  /**
   * Met à jour le modèle basé sur feedback utilisateur
   */
  async updateModel(
    userId: string, 
    recommendationId: string, 
    feedback: RecommendationFeedback
  ): Promise<void> {
    // 1. Enregistrer le feedback
    await this.storeFeedback(userId, recommendationId, feedback);

    // 2. Mettre à jour les poids du modèle
    await this.updateModelWeights(userId, feedback);

    // 3. Recalculer les features si nécessaire
    if (feedback.rating <= 2) {
      await this.analyzeNegativeFeedback(userId, recommendationId, feedback);
    }
  }

  // ===== CONTENT-BASED FILTERING =====
  private async generateContentBasedRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext,
    filters?: RecommendationFilters
  ): Promise<ScoredRecommendation[]> {
    const recommendations: ScoredRecommendation[] = [];

    // Récupérer tous les contenus disponibles
    const availableContent = await this.getAvailableContent(filters);

    for (const content of availableContent) {
      const features = await this.extractContentFeatures(content);
      const score = this.calculateContentBasedScore(userProfile, features, context);
      
      if (score > 0.3) { // Seuil minimum
        recommendations.push({
          content,
          score,
          type: 'content_based',
          features
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  private calculateContentBasedScore(
    userProfile: UserProfile,
    contentFeatures: ContentFeatures,
    context: RecommendationContext
  ): number {
    let score = 0;

    // Correspondance style d'apprentissage (30%)
    const styleMatch = this.calculateLearningStyleMatch(
      userProfile.learningProfile.style,
      contentFeatures.learningStyles
    );
    score += styleMatch * 0.3;

    // Correspondance niveau de difficulté (25%)
    const difficultyMatch = 1 - Math.abs(
      userProfile.learningProfile.difficultyPreference - contentFeatures.difficulty
    );
    score += difficultyMatch * 0.25;

    // Correspondance centres d'intérêt (20%)
    const interestMatch = this.calculateInterestMatch(
      userProfile.learningProfile.interests,
      contentFeatures.tags
    );
    score += interestMatch * 0.2;

    // Correspondance compétences cibles (15%)
    const competenceMatch = this.calculateCompetenceMatch(
      context.targetGoals,
      contentFeatures.competences
    );
    score += competenceMatch * 0.15;

    // Appropriateness contextuelle (10%)
    const contextMatch = this.calculateContextMatch(context, contentFeatures);
    score += contextMatch * 0.1;

    return Math.min(1, score);
  }

  // ===== COLLABORATIVE FILTERING =====
  private async generateCollaborativeRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext
  ): Promise<ScoredRecommendation[]> {
    // 1. Trouver utilisateurs similaires
    const similarUsers = await this.findSimilarUsers(userProfile.id, 20);

    // 2. Récupérer contenu apprécié par utilisateurs similaires
    const recommendations = new Map<string, CollaborativeScore>();

    for (const similarUser of similarUsers) {
      const userContent = await this.getUserPreferredContent(similarUser.userId);
      
      for (const [contentId, rating] of userContent) {
        if (!recommendations.has(contentId)) {
          recommendations.set(contentId, {
            contentId,
            totalScore: 0,
            userCount: 0,
            similarity: 0
          });
        }

        const current = recommendations.get(contentId)!;
        current.totalScore += rating * similarUser.similarity;
        current.similarity += similarUser.similarity;
        current.userCount++;
      }
    }

    // 3. Calculer scores finaux
    const scoredRecs: ScoredRecommendation[] = [];
    
    for (const [contentId, data] of recommendations) {
      if (data.userCount >= 2) { // Minimum 2 utilisateurs similaires
        const content = await this.getContentById(contentId);
        const normalizedScore = data.totalScore / data.similarity;
        
        scoredRecs.push({
          content,
          score: normalizedScore,
          type: 'collaborative',
          features: await this.extractContentFeatures(content)
        });
      }
    }

    return scoredRecs.sort((a, b) => b.score - a.score);
  }

  private async findSimilarUsers(userId: string, count: number): Promise<SimilarUser[]> {
    // Utilise cosine similarity sur vectors de préférences
    const userVector = await this.getUserPreferenceVector(userId);
    const allUsers = await this.getAllUserVectors();
    
    const similarities: SimilarUser[] = [];
    
    for (const [otherUserId, otherVector] of allUsers) {
      if (otherUserId !== userId) {
        const similarity = this.calculateCosineSimilarity(userVector, otherVector);
        similarities.push({ userId: otherUserId, similarity });
      }
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count);
  }

  // ===== CONTEXTUAL RECOMMENDATIONS =====
  private async generateContextualRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext
  ): Promise<ScoredRecommendation[]> {
    const recommendations: ScoredRecommendation[] = [];
    
    // Adapter selon le contexte temporel et environnemental
    const contextualFactors = this.analyzeContext(context);
    const availableContent = await this.getContextuallyAppropriateContent(context);

    for (const content of availableContent) {
      const features = await this.extractContentFeatures(content);
      const baseScore = 0.5; // Score de base
      
      // Ajustements contextuels
      let contextualScore = baseScore;
      
      // Ajustement selon temps disponible
      if (features.estimatedDuration <= context.sessionTimeAvailable) {
        contextualScore += 0.2;
      } else if (features.estimatedDuration > context.sessionTimeAvailable * 1.5) {
        contextualScore -= 0.3;
      }

      // Ajustement selon appareil
      const deviceMatch = this.calculateDeviceMatch(context.deviceType, features);
      contextualScore += deviceMatch * 0.15;

      // Ajustement selon heure de la journée
      const timeMatch = this.calculateTimeOfDayMatch(context.timeOfDay, features);
      contextualScore += timeMatch * 0.1;

      // Ajustement selon humeur si disponible
      if (context.mood) {
        const moodMatch = this.calculateMoodMatch(context.mood, features);
        contextualScore += moodMatch * 0.15;
      }

      recommendations.push({
        content,
        score: Math.max(0, Math.min(1, contextualScore)),
        type: 'contextual',
        features
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  // ===== HYBRID COMBINATION =====
  private combineRecommendations(
    sources: Array<{ recommendations: ScoredRecommendation[]; weight: number }>
  ): ScoredRecommendation[] {
    const combined = new Map<string, CombinedRecommendation>();

    for (const source of sources) {
      for (const rec of source.recommendations) {
        const contentId = rec.content.id;
        
        if (!combined.has(contentId)) {
          combined.set(contentId, {
            content: rec.content,
            scores: [],
            features: rec.features,
            types: []
          });
        }

        const current = combined.get(contentId)!;
        current.scores.push(rec.score * source.weight);
        current.types.push(rec.type);
      }
    }

    // Calculer score final hybride
    const hybridRecs: ScoredRecommendation[] = [];
    
    for (const [contentId, data] of combined) {
      const finalScore = data.scores.reduce((sum, score) => sum + score, 0);
      
      hybridRecs.push({
        content: data.content,
        score: finalScore,
        type: 'hybrid',
        features: data.features
      });
    }

    return hybridRecs.sort((a, b) => b.score - a.score);
  }

  // ===== DIVERSIFICATION =====
  private diversifyRecommendations(
    recommendations: ScoredRecommendation[],
    userProfile: UserProfile
  ): ScoredRecommendation[] {
    const diversified: ScoredRecommendation[] = [];
    const selectedFeatures = new Set<string>();
    
    // Équilibrer entre accuracy et diversity
    const diversityWeight = 0.3; // 30% pour diversité
    
    for (const rec of recommendations) {
      // Calculer bonus de diversité
      const diversityBonus = this.calculateDiversityBonus(
        rec.features, 
        selectedFeatures,
        userProfile
      );
      
      const adjustedScore = rec.score * (1 - diversityWeight) + 
                           diversityBonus * diversityWeight;
      
      diversified.push({
        ...rec,
        score: adjustedScore
      });

      // Marquer features comme sélectionnées
      this.markSelectedFeatures(rec.features, selectedFeatures);
    }

    return diversified.sort((a, b) => b.score - a.score);
  }
}

// ===== TYPES SUPPLÉMENTAIRES =====
interface ContentFeatures {
  id: string;
  difficulty: number;
  estimatedDuration: number;
  learningStyles: string[];
  competences: string[];
  tags: string[];
  contentType: string;
  interactionLevel: number;
  deviceOptimization: string[];
  timeOfDayOptimal: string[];
  moodAlignment: string[];
}

interface ScoredRecommendation {
  content: any;
  score: number;
  type: 'content_based' | 'collaborative' | 'contextual' | 'hybrid';
  features: ContentFeatures;
}

interface SimilarUser {
  userId: string;
  similarity: number;
}

interface CollaborativeScore {
  contentId: string;
  totalScore: number;
  userCount: number;
  similarity: number;
}

interface CombinedRecommendation {
  content: any;
  scores: number[];
  features: ContentFeatures;
  types: string[];
}

interface RecommendationFeedback {
  rating: number; // 1-5
  completed: boolean;
  timeSpent: number;
  helpfulness: number;
  difficulty: number;
  engagement: number;
  comments?: string;
}

// Instance globale
export const recommendationEngine = new RecommendationEngine();
```

### 📊 **Étape 6.3 : Analytics & Optimisation**

**[FILE]** Créer `src/lib/curriculum/curriculumAnalytics.ts` :

```ts
import type { LearningPath, PerformanceData } from './curriculumEngine';
import type { UserProfile } from '$lib/firebase/collections';

// ===== ANALYTICS DE CURRICULUM =====
export interface CurriculumAnalytics {
  pathId: string;
  userId: string;
  metrics: CurriculumMetrics;
  insights: CurriculumInsights;
  optimizations: CurriculumOptimizations;
  generatedAt: string;
}

export interface CurriculumMetrics {
  completion: {
    overall: number; // 0-1
    byModule: Record<string, number>;
    timeToCompletion: number; // minutes
    abandonmentRate: number;
  };
  engagement: {
    averageSessionDuration: number;
    sessionsPerWeek: number;
    interactionRate: number;
    returnRate: number; // Taux de retour après pause
  };
  learning: {
    knowledgeGain: number; // Amélioration compétences
    retentionRate: number; // Mémorisation à long terme
    transferSuccess: number; // Application dans nouveaux contextes
    masterySpeed: number; // Vitesse d'acquisition
  };
  satisfaction: {
    userRating: number; // 1-5
    npsScore: number; // Net Promoter Score
    difficultyPerception: number; // 1-5
    relevancePerception: number; // 1-5
  };
}

export interface CurriculumInsights {
  strengths: Insight[];
  weaknesses: Insight[];
  patterns: LearningPattern[];
  predictions: Prediction[];
}

export interface Insight {
  type: 'performance' | 'engagement' | 'learning' | 'satisfaction';
  description: string;
  impact: 'high' | 'medium' | 'low';
  evidence: Evidence[];
  recommendations: string[];
}

export interface Evidence {
  metric: string;
  value: number;
  benchmark: number;
  significance: number; // p-value ou confidence
}

export interface LearningPattern {
  pattern: string;
  frequency: number;
  impact: number;
  description: string;
  examples: string[];
}

export interface Prediction {
  target: string; // Ce qui est prédit
  value: number;
  confidence: number;
  timeframe: string;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  factor: string;
  importance: number;
  direction: 'positive' | 'negative';
}

export interface CurriculumOptimizations {
  immediate: Optimization[];
  shortTerm: Optimization[];
  longTerm: Optimization[];
}

export interface Optimization {
  type: 'content' | 'sequence' | 'difficulty' | 'format' | 'timing';
  description: string;
  expectedImpact: number;
  implementationCost: 'low' | 'medium' | 'high';
  priority: number; // 1-10
  validationPlan: string;
}

// ===== MOTEUR D'ANALYTICS =====
export class CurriculumAnalyticsEngine {
  /**
   * Analyse complète d'un parcours d'apprentissage
   */
  async analyzeCurriculum(
    path: LearningPath,
    userProfile: UserProfile,
    performanceHistory: PerformanceData[]
  ): Promise<CurriculumAnalytics> {
    
    // 1. Calculer métriques de base
    const metrics = await this.calculateMetrics(path, performanceHistory);
    
    // 2. Générer insights
    const insights = await this.generateInsights(metrics, userProfile, performanceHistory);
    
    // 3. Proposer optimisations
    const optimizations = await this.generateOptimizations(insights, path, userProfile);

    return {
      pathId: path.id,
      userId: path.userId,
      metrics,
      insights,
      optimizations,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Détecte les patterns d'apprentissage
   */
  async detectLearningPatterns(
    userProfiles: UserProfile[],
    performanceData: PerformanceData[][]
  ): Promise<LearningPattern[]> {
    const patterns: LearningPattern[] = [];

    // Pattern 1: Optimal learning time
    const timePattern = this.analyzeOptimalLearningTimes(performanceData);
    if (timePattern.significance > 0.8) {
      patterns.push(timePattern);
    }

    // Pattern 2: Difficulty progression preferences
    const difficultyPattern = this.analyzeDifficultyProgressionPatterns(performanceData);
    if (difficultyPattern.significance > 0.7) {
      patterns.push(difficultyPattern);
    }

    // Pattern 3: Content format preferences
    const formatPattern = this.analyzeContentFormatPatterns(userProfiles, performanceData);
    if (formatPattern.significance > 0.75) {
      patterns.push(formatPattern);
    }

    return patterns;
  }

  /**
   * Prédit le succès d'un parcours
   */
  async predictPathSuccess(
    path: LearningPath,
    userProfile: UserProfile
  ): Promise<Prediction[]> {
    const predictions: Prediction[] = [];

    // Prédiction 1: Probabilité de complétion
    const completionPred = await this.predictCompletion(path, userProfile);
    predictions.push(completionPred);

    // Prédiction 2: Temps de complétion estimé
    const timePred = await this.predictCompletionTime(path, userProfile);
    predictions.push(timePred);

    // Prédiction 3: Score final attendu
    const scorePred = await this.predictFinalScore(path, userProfile);
    predictions.push(scorePred);

    // Prédiction 4: Risque d'abandon
    const dropoutPred = await this.predictDropoutRisk(path, userProfile);
    predictions.push(dropoutPred);

    return predictions;
  }

  /**
   * Optimise un parcours basé sur analytics
   */
  async optimizePath(
    currentPath: LearningPath,
    analytics: CurriculumAnalytics
  ): Promise<LearningPath> {
    let optimizedPath = { ...currentPath };

    // Appliquer optimisations immédiates
    for (const optimization of analytics.optimizations.immediate) {
      optimizedPath = await this.applyOptimization(optimizedPath, optimization);
    }

    // Mettre à jour métadonnées
    optimizedPath.metadata = {
      ...optimizedPath.metadata,
      lastOptimized: new Date().toISOString(),
      version: this.incrementVersion(optimizedPath.metadata.version),
      confidence: this.recalculateConfidence(optimizedPath, analytics)
    };

    return optimizedPath;
  }

  // ===== MÉTHODES PRIVÉES =====

  private async calculateMetrics(
    path: LearningPath,
    performanceHistory: PerformanceData[]
  ): Promise<CurriculumMetrics> {
    return {
      completion: await this.calculateCompletionMetrics(path, performanceHistory),
      engagement: await this.calculateEngagementMetrics(performanceHistory),
      learning: await this.calculateLearningMetrics(performanceHistory),
      satisfaction: await this.calculateSatisfactionMetrics(path.userId)
    };
  }

  private async calculateCompletionMetrics(
    path: LearningPath,
    performanceHistory: PerformanceData[]
  ): Promise<CurriculumMetrics['completion']> {
    const completedNodes = performanceHistory.filter(p => p.masteryAchieved >= 0.7);
    const totalNodes = path.nodes.length;
    
    return {
      overall: completedNodes.length / totalNodes,
      byModule: this.calculateModuleCompletion(path, performanceHistory),
      timeToCompletion: this.calculateAverageTimeToCompletion(performanceHistory),
      abandonmentRate: await this.calculateAbandonmentRate(path.userId)
    };
  }

  private async generateInsights(
    metrics: CurriculumMetrics,
    userProfile: UserProfile,
    performanceHistory: PerformanceData[]
  ): Promise<CurriculumInsights> {
    const insights: CurriculumInsights = {
      strengths: [],
      weaknesses: [],
      patterns: [],
      predictions: []
    };

    // Analyser forces
    if (metrics.engagement.returnRate > 0.8) {
      insights.strengths.push({
        type: 'engagement',
        description: 'Excellent taux de retour - le contenu maintient l\'intérêt',
        impact: 'high',
        evidence: [{
          metric: 'returnRate',
          value: metrics.engagement.returnRate,
          benchmark: 0.7,
          significance: 0.95
        }],
        recommendations: ['Maintenir le format de contenu actuel', 'Reproduire ce pattern dans autres modules']
      });
    }

    // Analyser faiblesses
    if (metrics.completion.overall < 0.6) {
      insights.weaknesses.push({
        type: 'performance',
        description: 'Taux de complétion faible - possible problème de difficulté ou engagement',
        impact: 'high',
        evidence: [{
          metric: 'completionRate',
          value: metrics.completion.overall,
          benchmark: 0.75,
          significance: 0.9
        }],
        recommendations: ['Réviser la progression de difficulté', 'Ajouter plus de feedback intermédiaire']
      });
    }

    return insights;
  }

  private async generateOptimizations(
    insights: CurriculumInsights,
    path: LearningPath,
    userProfile: UserProfile
  ): Promise<CurriculumOptimizations> {
    const immediate: Optimization[] = [];
    const shortTerm: Optimization[] = [];
    const longTerm: Optimization[] = [];

    // Optimisations immédiates basées sur insights
    for (const weakness of insights.weaknesses) {
      if (weakness.impact === 'high') {
        immediate.push({
          type: this.mapInsightToOptimizationType(weakness),
          description: `Correction immédiate: ${weakness.description}`,
          expectedImpact: 0.8,
          implementationCost: 'low',
          priority: 9,
          validationPlan: 'A/B test sur 100 utilisateurs pendant 1 semaine'
        });
      }
    }

    // Optimisations à court terme
    shortTerm.push({
      type: 'sequence',
      description: 'Réorganiser modules selon données de performance',
      expectedImpact: 0.6,
      implementationCost: 'medium',
      priority: 7,
      validationPlan: 'Cohorte pilote de 200 utilisateurs'
    });

    // Optimisations à long terme
    longTerm.push({
      type: 'content',
      description: 'Développer contenu adaptatif basé sur IA',
      expectedImpact: 0.9,
      implementationCost: 'high',
      priority: 8,
      validationPlan: 'Déploiement progressif avec mesures longitudinales'
    });

    return { immediate, shortTerm, longTerm };
  }

  private async predictCompletion(
    path: LearningPath,
    userProfile: UserProfile
  ): Promise<Prediction> {
    // Modèle prédictif basé sur historique utilisateur et similarités
    const features = this.extractPredictionFeatures(path, userProfile);
    const completionProb = await this.applyMLModel('completion_prediction', features);

    return {
      target: 'completion_probability',
      value: completionProb,
      confidence: 0.85,
      timeframe: '30 days',
      factors: [
        { factor: 'previous_completion_rate', importance: 0.4, direction: 'positive' },
        { factor: 'learning_style_match', importance: 0.3, direction: 'positive' },
        { factor: 'available_time', importance: 0.2, direction: 'positive' },
        { factor: 'difficulty_preference', importance: 0.1, direction: 'positive' }
      ]
    };
  }

  private extractPredictionFeatures(path: LearningPath, userProfile: UserProfile): number[] {
    // Extraction features pour modèle ML
    return [
      userProfile.progressTracking.coursesCompleted / 10, // Normaliser
      userProfile.progressTracking.averageScore || 0.5,
      path.difficulty,
      path.estimatedDuration / 100, // Normaliser
      userProfile.learningProfile.difficultyPreference
    ];
  }

  private async applyMLModel(modelName: string, features: number[]): Promise<number> {
    // Interface avec modèle ML (TensorFlow.js, API externe, etc.)
    // Simulation pour l'exemple
    return Math.random() * 0.4 + 0.6; // Score entre 0.6 et 1.0
  }
}

// Instance globale
export const curriculumAnalytics = new CurriculumAnalyticsEngine();
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:curriculum       # Tests génération curriculum
[TEST] npm run test:recommendations  # Tests système recommandation
[TEST] npm run test:analytics       # Tests analytics ML
[TEST] npm run validate 6           # Validation complète Phase 6
```

**[FILE]** Créer `src/lib/curriculum/curriculumEngine.test.ts` :

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CurriculumEngine } from './curriculumEngine';
import type { GenerationContext } from './curriculumEngine';

describe('CurriculumEngine', () => {
  let engine: CurriculumEngine;
  let mockContext: GenerationContext;

  beforeEach(() => {
    engine = new CurriculumEngine();
    mockContext = {
      userProfile: {
        id: 'user1',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'student',
        learningProfile: {
          style: 'mixed',
          difficultyPreference: 0.5,
          sessionDurationPreference: 30,
          learningGoals: ['javascript', 'react'],
          interests: ['web-development']
        },
        progressTracking: {
          totalTimeSpent: 0,
          coursesCompleted: 0,
          competencesAcquired: [],
          currentStreak: 0,
          longestStreak: 0
        }
      },
      targetGoals: ['javascript-basics', 'react-fundamentals'],
      constraints: {
        maxDuration: 20,
        maxComplexity: 0.7
      },
      preferences: {
        learningStyle: 'mixed',
        sessionDuration: 30,
        weeklyCommitment: 5,
        startDate: new Date().toISOString()
      },
      currentKnowledge: {},
      historicalPerformance: []
    };
  });

  describe('generateLearningPath', () => {
    it('should generate valid learning path', async () => {
      const path = await engine.generateLearningPath(mockContext);
      
      expect(path).toBeDefined();
      expect(path.id).toBeDefined();
      expect(path.userId).toBe('user1');
      expect(path.targetCompetences).toEqual(['javascript-basics', 'react-fundamentals']);
      expect(path.nodes.length).toBeGreaterThan(0);
      expect(path.estimatedDuration).toBeGreaterThan(0);
      expect(path.difficulty).toBeBetween(0, 1);
    });

    it('should respect duration constraints', async () => {
      const path = await engine.generateLearningPath(mockContext);
      
      expect(path.estimatedDuration).toBeLessThanOrEqual(
        mockContext.constraints.maxDuration || Infinity
      );
    });

    it('should respect complexity constraints', async () => {
      const path = await engine.generateLearningPath(mockContext);
      
      expect(path.difficulty).toBeLessThanOrEqual(
        mockContext.constraints.maxComplexity || 1
      );
    });
  });

  describe('adaptPath', () => {
    it('should adapt path based on poor performance', async () => {
      const initialPath = await engine.generateLearningPath(mockContext);
      
      const poorPerformance = [
        {
          competenceId: 'javascript-basics',
          masteryAchieved: 0.3,
          timeSpent: 120,
          attemptsNeeded: 3,
          retentionRate: 0.4,
          engagementScore: 0.3,
          timestamp: new Date().toISOString()
        }
      ];

      const adaptedPath = await engine.adaptPath(
        initialPath, 
        poorPerformance, 
        {}
      );

      // Le chemin adapté devrait avoir plus de contenu de renforcement
      expect(adaptedPath.nodes.length).toBeGreaterThanOrEqual(initialPath.nodes.length);
    });
  });

  describe('getNextRecommendation', () => {
    it('should recommend appropriate next step', async () => {
      const path = await engine.generateLearningPath(mockContext);
      const currentProgress = { completedNodes: [] };

      const recommendation = await engine.getNextRecommendation(
        path, 
        currentProgress, 
        mockContext
      );

      expect(recommendation).toBeDefined();
      expect(recommendation.primary).toBeDefined();
      expect(recommendation.alternatives.length).toBeGreaterThan(0);
      expect(recommendation.reasoning).toBeDefined();
    });
  });
});
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Génération automatique de parcours personnalisés
- [ ] **[CHECK]** Algorithmes de recommandation hybrides (content-based + collaborative)
- [ ] **[CHECK]** Système adaptatif basé sur performance
- [ ] **[CHECK]** Analytics prédictives avec ML
- [ ] **[CHECK]** Optimisation continue des parcours
- [ ] **[CHECK]** Tests d'efficacité pédagogique validés
- [ ] **[CHECK]** Performance algorithmes < 500ms
- [ ] **[CHECK]** Précision recommandations > 75%

---

## 🏷️ **Processus de Release v1.4**

```bash
[CMD] npm run validate 6              # Validation complète Phase 6
[CMD] git add . && git commit -m "feat: Phase 6 - Curriculum Generation complete"
[CMD] git tag v1.4                   # Tag release IA
[CMD] npm run deploy:ml-models       # Déploiement modèles ML
```

**🚫 STOP** : Ne pas passer à Phase 7 sans validation de l'efficacité des algorithmes.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [🎨 Phase 7 : Dynamic Interface](phase-7-dynamic-interface.md)  
**Groupe suivant** : 🎨 UX/UI - Interface & Navigation  
**Dépendance** : Phase 6 (Curriculum Generation) validée ✅
