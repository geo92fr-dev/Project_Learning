/**
 * Service de Métacognition - Phase 4
 * Système de réflexion guidée et d'auto-régulation
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  MetacognitionPrompt, 
  MetacognitionResponse,
  MetacognitiveStrategy 
} from '$lib/types/pedagogy';

// ===== STORES =====
export const currentPrompt = writable<MetacognitionPrompt | null>(null);
export const promptHistory = writable<MetacognitionResponse[]>([]);
export const metacognitionState = writable<'idle' | 'prompting' | 'analyzing' | 'completed'>('idle');
export const reflectionQuality = writable<number>(0);

// Store dérivé pour l'analyse des stratégies
export const strategiesAnalysis = derived(
  [promptHistory],
  ([$history]) => {
    if ($history.length === 0) return null;
    return analyzeMetacognitiveStrategies($history);
  }
);

// ===== BANQUE DE PROMPTS =====
const PROMPT_BANK: MetacognitionPrompt[] = [
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

// ===== ANALYSEUR DE RÉPONSES =====
export class ResponseAnalyzer {
  /**
   * Analyse la qualité d'une réponse métacognitive
   */
  analyzeResponseQuality(response: MetacognitionResponse, prompt: MetacognitionPrompt): number {
    let qualityScore = 0;
    const maxScore = 100;
    
    // 1. Longueur de la réponse (20 points max)
    const wordCount = response.word_count;
    if (wordCount >= 50) qualityScore += 20;
    else if (wordCount >= 25) qualityScore += 15;
    else if (wordCount >= 10) qualityScore += 10;
    else qualityScore += 5;
    
    // 2. Présence d'éléments attendus (30 points max)
    const content = response.content.toLowerCase();
    let elementsFound = 0;
    
    for (const element of prompt.expected_elements) {
      if (content.includes(element.toLowerCase()) || 
          this.containsSemanticEquivalent(content, element)) {
        elementsFound++;
      }
    }
    
    qualityScore += (elementsFound / prompt.expected_elements.length) * 30;
    
    // 3. Profondeur de réflexion (25 points max)
    const depthIndicators = [
      'parce que', 'car', 'donc', 'ainsi', 'par conséquent',
      'je pense que', 'je crois que', 'il me semble',
      'par exemple', 'notamment', 'en particulier',
      'cependant', 'néanmoins', 'toutefois', 'mais'
    ];
    
    let depthScore = 0;
    for (const indicator of depthIndicators) {
      if (content.includes(indicator)) depthScore += 3;
    }
    qualityScore += Math.min(25, depthScore);
    
    // 4. Stratégies métacognitives identifiées (25 points max)
    const strategies = this.identifyStrategies(content);
    qualityScore += (strategies.length / 3) * 25; // Max 3 stratégies
    
    return Math.min(maxScore, qualityScore);
  }
  
  /**
   * Identifie les stratégies métacognitives dans une réponse
   */
  identifyStrategies(content: string): MetacognitiveStrategy[] {
    const strategies: MetacognitiveStrategy[] = [];
    const lowerContent = content.toLowerCase();
    
    // Stratégies de planification
    if (lowerContent.includes('planifier') || lowerContent.includes('organiser') || 
        lowerContent.includes('préparer') || lowerContent.includes('objectif')) {
      strategies.push({
        type: 'planning',
        description: 'Planification et organisation',
        effectiveness: 4,
        context: 'Organisation préalable de l\'apprentissage'
      });
    }
    
    // Stratégies de monitoring
    if (lowerContent.includes('vérifier') || lowerContent.includes('contrôler') ||
        lowerContent.includes('surveiller') || lowerContent.includes('suivre')) {
      strategies.push({
        type: 'monitoring',
        description: 'Auto-surveillance et contrôle',
        effectiveness: 4,
        context: 'Suivi de la compréhension en temps réel'
      });
    }
    
    // Stratégies d'évaluation
    if (lowerContent.includes('évaluer') || lowerContent.includes('juger') ||
        lowerContent.includes('analyser') || lowerContent.includes('bilan')) {
      strategies.push({
        type: 'evaluating',
        description: 'Évaluation et bilan',
        effectiveness: 4,
        context: 'Évaluation des résultats d\'apprentissage'
      });
    }
    
    // Stratégies de débogage
    if (lowerContent.includes('erreur') || lowerContent.includes('problème') ||
        lowerContent.includes('difficulté') || lowerContent.includes('corriger')) {
      strategies.push({
        type: 'debugging',
        description: 'Détection et correction d\'erreurs',
        effectiveness: 5,
        context: 'Résolution de problèmes d\'apprentissage'
      });
    }
    
    // Stratégies de révision
    if (lowerContent.includes('réviser') || lowerContent.includes('revoir') ||
        lowerContent.includes('répéter') || lowerContent.includes('reprendre')) {
      strategies.push({
        type: 'reviewing',
        description: 'Révision et consolidation',
        effectiveness: 3,
        context: 'Renforcement des connaissances'
      });
    }
    
    return strategies;
  }
  
  /**
   * Vérifie si le contenu contient un équivalent sémantique
   */
  private containsSemanticEquivalent(content: string, target: string): boolean {
    const equivalents: Record<string, string[]> = {
      'connaissances préalables': ['ce que je sais', 'mes acquis', 'baggage', 'expérience'],
      'objectifs d\'apprentissage': ['but', 'goal', 'objectif', 'viser', 'atteindre'],
      'stratégies': ['méthode', 'approche', 'technique', 'façon de faire'],
      'gestion du temps': ['temps', 'durée', 'horaire', 'planning'],
      'compréhension': ['comprendre', 'saisir', 'clair', 'évident'],
      'auto-évaluation': ['me juger', 'évaluer mes', 'bilan personnel']
    };
    
    const targetEquivalents = equivalents[target] || [];
    return targetEquivalents.some(equiv => content.includes(equiv));
  }
}

// ===== GESTIONNAIRE DE PROMPTS =====
export class MetacognitionPromptBank {
  /**
   * Sélectionne un prompt approprié selon le contexte
   */
  selectPrompt(
    trigger: MetacognitionPrompt['trigger'],
    competenceFocus?: string,
    previousPrompts: string[] = []
  ): MetacognitionPrompt | null {
    
    // Filtrer par trigger
    let candidates = PROMPT_BANK.filter(p => p.trigger === trigger);
    
    // Exclure les prompts déjà utilisés récemment
    candidates = candidates.filter(p => !previousPrompts.includes(p.id));
    
    // Filtrer par compétence si spécifiée
    if (competenceFocus) {
      const focused = candidates.filter(p => p.competence_focus === competenceFocus);
      if (focused.length > 0) candidates = focused;
    }
    
    // Sélection aléatoire parmi les candidats
    if (candidates.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
  
  /**
   * Récupère tous les prompts d'un type donné
   */
  getPromptsByType(type: MetacognitionPrompt['type']): MetacognitionPrompt[] {
    return PROMPT_BANK.filter(p => p.type === type);
  }
  
  /**
   * Récupère tous les prompts d'un trigger donné
   */
  getPromptsByTrigger(trigger: MetacognitionPrompt['trigger']): MetacognitionPrompt[] {
    return PROMPT_BANK.filter(p => p.trigger === trigger);
  }
}

// ===== SERVICE PRINCIPAL =====
export class MetacognitionService {
  private promptBank: MetacognitionPromptBank;
  private analyzer: ResponseAnalyzer;
  private sessionId: string;
  private userId: string = '';
  
  constructor() {
    this.promptBank = new MetacognitionPromptBank();
    this.analyzer = new ResponseAnalyzer();
    this.sessionId = this.generateSessionId();
  }

  /**
   * Génère des prompts adaptés au niveau
   */
  generatePromptsForLevel(level: string, subject: string): MetacognitionPrompt[] {
    const basePrompts = [
      "Quelle stratégie avez-vous utilisée pour aborder ce problème ?",
      "Qu'est-ce qui vous a semblé le plus difficile ?",
      "Comment évaluez-vous votre confiance dans vos réponses ?"
    ];
    
    return basePrompts.map((prompt: string, index: number) => ({
      id: `${level}-${subject}-${index}`,
      type: 'reflection' as const,
      trigger: 'during_lesson' as const,
      question: this.adaptPromptToLevel(prompt, level),
      sub_questions: [],
      guidance: `Réfléchissez attentivement à votre processus d'apprentissage`,
      expected_elements: ['stratégie', 'difficulté', 'confiance'],
      competence_focus: subject
    }));
  }

  /**
   * Analyse les réponses de réflexion
   */
  analyzeReflection(responses: Array<{prompt: string, response: string}>): {
    strategies: string[];
    awarenessLevel: string;
    recommendations: string[];
  } {
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
  identifyStrategies(responses: Array<{prompt: string, response: string}>): string[] {
    const strategies = [];
    
    for (const response of responses) {
      if (!response.response) continue; // Protection contre les réponses vides
      const text = response.response.toLowerCase();
      
      if (text.includes('répét') || text.includes('relis') || text.includes('revoi')) {
        strategies.push('Répétition');
      }
      if (text.includes('schéma') || text.includes('diagram') || text.includes('visualis')) {
        strategies.push('Visualisation');
      }
      if (text.includes('résumé') || text.includes('synthès') || text.includes('plan')) {
        strategies.push('Organisation');
      }
      if (text.includes('exemple') || text.includes('analogie') || text.includes('compar')) {
        strategies.push('Elaboration');
      }
      if (text.includes('vérifie') || text.includes('test') || text.includes('contrôl')) {
        strategies.push('Autorégulation');
      }
    }
    
    return [...new Set(strategies)]; // Enlever les doublons
  }

  /**
   * Évalue le niveau de conscience métacognitive
   */
  evaluateAwarenessLevel(responses: Array<{prompt: string, response: string}>): string {
    let score = 0;
    const totalResponses = responses.length;
    
    for (const response of responses) {
      if (!response.response) continue; // Protection contre les réponses vides
      const text = response.response.toLowerCase();
      const wordCount = text.split(' ').length;
      
      // Critères d'évaluation
      if (wordCount > 20) score += 1; // Réponses détaillées
      if (text.includes('parce que') || text.includes('car') || text.includes('donc')) score += 1; // Justifications
      if (text.includes('stratégie') || text.includes('méthode') || text.includes('approche')) score += 1; // Conscience des stratégies
      if (text.includes('difficile') || text.includes('facile') || text.includes('compris')) score += 1; // Autoévaluation
    }
    
    const average = totalResponses > 0 ? score / (totalResponses * 4) : 0; // 4 critères max par réponse
    
    if (average > 0.7) return 'Élevé';
    if (average > 0.4) return 'Moyen';
    return 'Faible';
  }

  /**
   * Génère des recommandations basées sur l'analyse (nouvelle méthode pour tests)
   */
  private generateTestRecommendations(strategies: string[], awarenessLevel: string): string[] {
    const recommendations = [];
    
    if (awarenessLevel === 'Faible') {
      recommendations.push('Pratiquez l\'autoréflexion régulièrement');
      recommendations.push('Posez-vous des questions sur votre processus d\'apprentissage');
    }
    
    if (strategies.length < 2) {
      recommendations.push('Diversifiez vos stratégies d\'apprentissage');
    }
    
    if (!strategies.includes('Autorégulation')) {
      recommendations.push('Développez vos capacités d\'autocontrôle et de vérification');
    }
    
    return recommendations;
  }

  /**
   * Méthodes utilitaires
   */
  private getCategoryForLevel(level: string): string {
    switch (level) {
      case 'beginner': return 'Découverte';
      case 'intermediate': return 'Approfondissement';
      case 'advanced': return 'Maîtrise';
      default: return 'Réflexion';
    }
  }

  private adaptPromptToLevel(prompt: string, level: string): string {
    if (level === 'beginner') {
      return prompt.replace(/complexe|avancé|sophistiqué/g, 'simple');
    }
    if (level === 'advanced') {
      return prompt + ' Analysez en détail vos processus cognitifs.';
    }
    return prompt;
  }
  
  /**
   * Démarre une session de métacognition
   */
  startSession(userId: string): void {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
    metacognitionState.set('idle');
    console.log(`🧠 Session métacognition démarrée pour ${userId}`);
  }
  
  /**
   * Déclenche un prompt de métacognition
   */
  triggerPrompt(
    trigger: MetacognitionPrompt['trigger'],
    competenceFocus?: string
  ): MetacognitionPrompt | null {
    
    const history = get(promptHistory);
    const recentPrompts = history.slice(-3).map(r => r.prompt_id);
    
    const prompt = this.promptBank.selectPrompt(trigger, competenceFocus, recentPrompts);
    
    if (prompt) {
      currentPrompt.set(prompt);
      metacognitionState.set('prompting');
      console.log(`💭 Prompt déclenché: ${prompt.question}`);
    }
    
    return prompt;
  }
  
  /**
   * Traite une réponse utilisateur
   */
  async submitResponse(content: string, promptId: string): Promise<void> {
    const prompt = PROMPT_BANK.find(p => p.id === promptId);
    if (!prompt) {
      console.error('Prompt non trouvé:', promptId);
      return;
    }
    
    metacognitionState.set('analyzing');
    
    // Créer la réponse
    const response: MetacognitionResponse = {
      prompt_id: promptId,
      user_id: this.userId,
      session_id: this.sessionId,
      content: content.trim(),
      timestamp: new Date(),
      word_count: content.trim().split(/\s+/).length,
      reflection_depth: this.calculateReflectionDepth(content),
      keywords_identified: this.extractKeywords(content),
      metacognitive_strategies: this.analyzer.identifyStrategies(content)
    };
    
    // Analyser la qualité
    const quality = this.analyzer.analyzeResponseQuality(response, prompt);
    reflectionQuality.set(quality);
    
    // Sauvegarder
    promptHistory.update(history => [...history, response]);
    
    // Simuler le temps d'analyse
    await new Promise(resolve => setTimeout(resolve, 800));
    
    metacognitionState.set('completed');
    currentPrompt.set(null);
    
    console.log(`✅ Réponse analysée - Qualité: ${quality}/100`);
  }
  
  /**
   * Calcule la profondeur de réflexion
   */
  private calculateReflectionDepth(content: string): 1 | 2 | 3 | 4 | 5 {
    const lowerContent = content.toLowerCase();
    let depth = 1;
    
    // Indicateurs de profondeur
    const depthIndicators = [
      ['parce que', 'car', 'donc'], // Causalité (+1)
      ['cependant', 'mais', 'néanmoins'], // Nuances (+1)
      ['par exemple', 'notamment'], // Exemples (+1)
      ['je pense que', 'il me semble'], // Métaréflexion (+1)
      ['cela me rappelle', 'je fais le lien'] // Connexions (+1)
    ];
    
    for (const indicators of depthIndicators) {
      if (indicators.some(indicator => lowerContent.includes(indicator))) {
        depth++;
      }
    }
    
    return Math.min(5, depth) as 1 | 2 | 3 | 4 | 5;
  }
  
  /**
   * Extrait les mots-clés pédagogiques
   */
  private extractKeywords(content: string): string[] {
    const keywords: string[] = [];
    const lowerContent = content.toLowerCase();
    
    const pedagogicalKeywords = [
      'apprendre', 'comprendre', 'mémoriser', 'réviser',
      'stratégie', 'méthode', 'technique', 'approche',
      'objectif', 'but', 'goal', 'cible',
      'difficile', 'facile', 'complexe', 'simple',
      'temps', 'durée', 'rythme', 'vitesse',
      'erreur', 'faute', 'problème', 'obstacle',
      'réussir', 'échouer', 'progression', 'amélioration'
    ];
    
    for (const keyword of pedagogicalKeywords) {
      if (lowerContent.includes(keyword)) {
        keywords.push(keyword);
      }
    }
    
    return [...new Set(keywords)]; // Supprimer les doublons
  }
  
  /**
   * Génère un rapport d'analyse métacognitive
   */
  generateAnalysisReport(): any {
    const history = get(promptHistory);
    
    if (history.length === 0) {
      return {
        totalResponses: 0,
        averageQuality: 0,
        strategiesUsed: [],
        reflectionTrend: [],
        recommendations: []
      };
    }
    
    // Calcul de la qualité moyenne
    const qualityScores = history.map(response => {
      const prompt = PROMPT_BANK.find(p => p.id === response.prompt_id);
      return prompt ? this.analyzer.analyzeResponseQuality(response, prompt) : 0;
    });
    
    const averageQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
    
    // Analyse des stratégies utilisées
    const allStrategies = history.flatMap(r => r.metacognitive_strategies);
    const strategyTypes = [...new Set(allStrategies.map(s => s.type))];
    
    // Tendance de la qualité de réflexion
    const reflectionTrend = history.map(r => r.reflection_depth);
    
    // Recommandations
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
  private generateRecommendations(history: MetacognitionResponse[], avgQuality: number): string[] {
    const recommendations: string[] = [];
    
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
    
    // Recommandations basées sur les stratégies manquantes
    const usedStrategies = new Set(history.flatMap(r => r.metacognitive_strategies.map(s => s.type)));
    
    if (!usedStrategies.has('planning')) {
      recommendations.push("Pensez à planifier davantage vos sessions d'apprentissage");
    }
    
    if (!usedStrategies.has('monitoring')) {
      recommendations.push("Surveillez plus régulièrement votre compréhension pendant l'apprentissage");
    }
    
    if (!usedStrategies.has('evaluating')) {
      recommendations.push("Prenez du temps pour évaluer vos acquis après chaque session");
    }
    
    return recommendations;
  }
  
  /**
   * Génère un ID de session unique
   */
  private generateSessionId(): string {
    return `metacog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Remet à zéro la session
   */
  reset(): void {
    currentPrompt.set(null);
    promptHistory.set([]);
    metacognitionState.set('idle');
    reflectionQuality.set(0);
    this.sessionId = this.generateSessionId();
    this.userId = '';
  }
}

// ===== FONCTION D'ANALYSE GLOBALE =====
function analyzeMetacognitiveStrategies(responses: MetacognitionResponse[]): any {
  if (responses.length === 0) return null;
  
  const allStrategies = responses.flatMap(r => r.metacognitive_strategies);
  const strategyDistribution: Record<string, number> = {};
  
  for (const strategy of allStrategies) {
    strategyDistribution[strategy.type] = (strategyDistribution[strategy.type] || 0) + 1;
  }
  
  const dominantStrategy = Object.entries(strategyDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
  
  const averageEffectiveness = allStrategies.length > 0 
    ? allStrategies.reduce((acc, s) => acc + s.effectiveness, 0) / allStrategies.length
    : 0;
  
  return {
    totalStrategies: allStrategies.length,
    uniqueStrategies: Object.keys(strategyDistribution).length,
    dominantStrategy,
    strategyDistribution,
    averageEffectiveness: Math.round(averageEffectiveness * 100) / 100
  };
}

// ===== INSTANCES GLOBALES =====
export const metacognitionService = new MetacognitionService();
export const promptBank = new MetacognitionPromptBank();
export const responseAnalyzer = new ResponseAnalyzer();

// ===== UTILITAIRES =====
export function getPromptById(id: string): MetacognitionPrompt | undefined {
  return PROMPT_BANK.find(p => p.id === id);
}

export function getPromptsByCompetence(competence: string): MetacognitionPrompt[] {
  return PROMPT_BANK.filter(p => p.competence_focus === competence);
}

export function calculateSessionProgress(): number {
  const history = get(promptHistory);
  if (history.length === 0) return 0;
  
  const qualitySum = history.reduce((acc, response) => {
    const prompt = PROMPT_BANK.find(p => p.id === response.prompt_id);
    if (!prompt) return acc;
    
    const analyzer = new ResponseAnalyzer();
    return acc + analyzer.analyzeResponseQuality(response, prompt);
  }, 0);
  
  return Math.round(qualitySum / history.length);
}