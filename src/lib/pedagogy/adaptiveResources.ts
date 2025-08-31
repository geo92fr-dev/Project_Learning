/**
 * Système de ressources adaptatives pour personnaliser l'expérience d'apprentissage
 * Ajuste automatiquement le contenu, la difficulté et les exercices selon le profil de l'apprenant
 */

import type { LearningProfile, AssessmentResult } from './preAssessment.js';
import type { CourseContent } from '../types/content.js';

export interface AdaptiveResource {
  id: string;
  type: 'explanation' | 'example' | 'exercise' | 'visual' | 'video' | 'quiz';
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing' | 'all';
  concept: string;
  estimatedTime: number; // en minutes
  prerequisites: string[];
  metadata: {
    interactivity: 'low' | 'medium' | 'high';
    feedback: boolean;
    collaborative: boolean;
    selfPaced: boolean;
  };
}

export interface AdaptationRule {
  id: string;
  condition: (profile: LearningProfile, progress: LearningProgress) => boolean;
  action: AdaptationAction;
  priority: number;
  description: string;
}

export interface AdaptationAction {
  type: 'add-resource' | 'remove-resource' | 'adjust-difficulty' | 'change-sequence' | 'add-support';
  target: string;
  parameters: Record<string, any>;
}

export interface LearningProgress {
  userId: string;
  courseId: string;
  conceptsMastered: string[];
  conceptsInProgress: string[];
  conceptsNotStarted: string[];
  totalTimeSpent: number;
  averageSessionTime: number;
  lastActivity: Date;
  completionRate: number;
  strugglingConcepts: string[];
  confidenceLevels: Record<string, number>;
}

export interface PersonalizedPath {
  userId: string;
  courseId: string;
  originalSequence: string[];
  adaptedSequence: string[];
  adaptedResources: AdaptiveResource[];
  reasoning: string[];
  estimatedDuration: number;
  difficultyAdjustments: Record<string, 'easier' | 'harder' | 'same'>;
  supportResources: AdaptiveResource[];
}

export class AdaptiveResourceSystem {
  private resources: Map<string, AdaptiveResource[]> = new Map(); // concept -> resources
  private adaptationRules: AdaptationRule[] = [];
  private userProgress: Map<string, LearningProgress> = new Map(); // userId -> progress
  private personalizedPaths: Map<string, PersonalizedPath> = new Map(); // userId-courseId -> path

  constructor() {
    this.initializeResources();
    this.initializeAdaptationRules();
  }

  /**
   * Initialise les ressources adaptatives par concept
   */
  private initializeResources(): void {
    // Ressources pour les variables JavaScript
    const variableResources: AdaptiveResource[] = [
      {
        id: 'var-explain-basic',
        type: 'explanation',
        title: 'Les variables : qu\'est-ce que c\'est ?',
        content: `
# Les Variables en JavaScript

Une variable est comme une **boîte** qui stocke une valeur que vous pouvez utiliser plus tard.

## Analogie simple
Imaginez votre variable comme une étiquette sur une boîte :
- 📦 La boîte = l'espace mémoire
- 🏷️ L'étiquette = le nom de la variable  
- 📄 Le contenu = la valeur stockée

## Syntaxe de base
\`\`\`javascript
let monNom = "Alice";
const monAge = 25;
var maVille = "Paris";
\`\`\`
        `,
        difficulty: 'beginner',
        learningStyle: 'visual',
        concept: 'variables',
        estimatedTime: 5,
        prerequisites: [],
        metadata: {
          interactivity: 'low',
          feedback: false,
          collaborative: false,
          selfPaced: true
        }
      },
      {
        id: 'var-example-interactive',
        type: 'exercise',
        title: 'Exercice : Créer vos premières variables',
        content: `
## 🎯 Mission : Créez un profil utilisateur

Créez des variables pour stocker :
1. Votre prénom (utilisez \`let\`)
2. Votre âge (utilisez \`const\`)
3. Votre couleur préférée (utilisez \`let\`)

\`\`\`javascript
// Votre code ici :
let prenom = 
const age = 
let couleurPreferee = 

// Affichez le résultat
console.log("Je m'appelle " + prenom + ", j'ai " + age + " ans et j'aime le " + couleurPreferee);
\`\`\`

### 💡 Indices
- \`let\` pour ce qui peut changer
- \`const\` pour ce qui ne change jamais
- N'oubliez pas les guillemets pour le texte !
        `,
        difficulty: 'beginner',
        learningStyle: 'kinesthetic',
        concept: 'variables',
        estimatedTime: 10,
        prerequisites: ['var-explain-basic'],
        metadata: {
          interactivity: 'high',
          feedback: true,
          collaborative: false,
          selfPaced: true
        }
      },
      {
        id: 'var-scope-advanced',
        type: 'explanation',
        title: 'Portée des variables : let vs var vs const',
        content: `
# Portée des Variables (Scope)

## 🎯 Le problème avec \`var\`
\`\`\`javascript
function problemeVar() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 - accessible ! 😱
}
\`\`\`

## ✅ La solution avec \`let\` et \`const\`
\`\`\`javascript
function solutionLet() {
  if (true) {
    let y = 1;
    const z = 2;
  }
  console.log(y); // ReferenceError ✅
  console.log(z); // ReferenceError ✅
}
\`\`\`

## 📊 Tableau comparatif

| Mot-clé | Portée | Réassignation | Redéclaration |
|---------|--------|---------------|---------------|
| \`var\`   | Fonction | ✅ Oui | ✅ Oui |
| \`let\`   | Bloc | ✅ Oui | ❌ Non |
| \`const\` | Bloc | ❌ Non | ❌ Non |
        `,
        difficulty: 'intermediate',
        learningStyle: 'reading-writing',
        concept: 'variables',
        estimatedTime: 8,
        prerequisites: ['var-explain-basic'],
        metadata: {
          interactivity: 'low',
          feedback: false,
          collaborative: false,
          selfPaced: true
        }
      }
    ];

    // Ressources pour les fonctions JavaScript
    const functionResources: AdaptiveResource[] = [
      {
        id: 'func-explain-basic',
        type: 'explanation',
        title: 'Les fonctions : vos outils personnalisés',
        content: `
# Les Fonctions en JavaScript

## 🛠️ Qu'est-ce qu'une fonction ?
Une fonction est comme une **machine** qui :
- 📥 Reçoit des ingrédients (paramètres)
- ⚙️ Les transforme (traitement)
- 📤 Produit un résultat (valeur de retour)

## 🏭 Analogie : La machine à smoothies
\`\`\`javascript
function faireSmoothie(fruit1, fruit2) {
  let smoothie = fruit1 + " + " + fruit2 + " = délicieux !";
  return smoothie;
}

let monSmoothie = faireSmoothie("banane", "fraise");
console.log(monSmoothie); // "banane + fraise = délicieux !"
\`\`\`

## 🎯 Pourquoi utiliser des fonctions ?
- ♻️ **Réutilisabilité** : Écrivez une fois, utilisez partout
- 🧩 **Organisation** : Code plus lisible et structuré  
- 🐛 **Débogage** : Plus facile de trouver les erreurs
        `,
        difficulty: 'beginner',
        learningStyle: 'visual',
        concept: 'functions',
        estimatedTime: 6,
        prerequisites: ['variables'],
        metadata: {
          interactivity: 'low',
          feedback: false,
          collaborative: false,
          selfPaced: true
        }
      },
      {
        id: 'func-exercise-calc',
        type: 'exercise',
        title: 'Créez votre calculatrice personnelle',
        content: `
## 🧮 Mission : Calculatrice basique

Créez des fonctions pour les opérations mathématiques de base :

\`\`\`javascript
// Fonction addition
function additionner(a, b) {
  // Votre code ici
  return 
}

// Fonction soustraction  
function soustraire(a, b) {
  // Votre code ici
  return 
}

// Fonction multiplication
function multiplier(a, b) {
  // Votre code ici
  return 
}

// Testez vos fonctions
console.log(additionner(5, 3)); // Devrait afficher 8
console.log(soustraire(10, 4)); // Devrait afficher 6
console.log(multiplier(3, 7)); // Devrait afficher 21
\`\`\`

### 🏆 Défi bonus
Créez une fonction \`calculer(operation, a, b)\` qui utilise vos fonctions précédentes !
        `,
        difficulty: 'beginner',
        learningStyle: 'kinesthetic',
        concept: 'functions',
        estimatedTime: 15,
        prerequisites: ['func-explain-basic'],
        metadata: {
          interactivity: 'high',
          feedback: true,
          collaborative: false,
          selfPaced: true
        }
      }
    ];

    // Ressources pour les tableaux JavaScript
    const arrayResources: AdaptiveResource[] = [
      {
        id: 'array-visual-intro',
        type: 'visual',
        title: 'Les tableaux : vos listes organisées',
        content: `
# Les Tableaux (Arrays) en JavaScript

## 📋 Visualisation d'un tableau
\`\`\`
Indice:  [0]    [1]     [2]      [3]     [4]
Valeur:  │"🍎"│ │"🍌"│  │"🍇"│   │"🍊"│  │"🥝"│
        └────┴ └────┴  └────┴   └────┴  └────┘
\`\`\`

## 🎯 Code correspondant
\`\`\`javascript
let fruits = ["🍎", "🍌", "🍇", "🍊", "🥝"];

console.log(fruits[0]);    // "🍎" (premier élément)
console.log(fruits[2]);    // "🍇" (troisième élément)  
console.log(fruits.length); // 5 (nombre d'éléments)
\`\`\`

## 🔍 Points importants
- 📍 Les indices commencent à **0**
- 📏 \`.length\` donne la taille du tableau
- 🔄 On peut modifier les éléments : \`fruits[1] = "🍓"\`
        `,
        difficulty: 'beginner',
        learningStyle: 'visual',
        concept: 'arrays',
        estimatedTime: 5,
        prerequisites: ['variables'],
        metadata: {
          interactivity: 'low',
          feedback: false,
          collaborative: false,
          selfPaced: true
        }
      }
    ];

    this.resources.set('variables', variableResources);
    this.resources.set('functions', functionResources);
    this.resources.set('arrays', arrayResources);
  }

  /**
   * Initialise les règles d'adaptation
   */
  private initializeAdaptationRules(): void {
    this.adaptationRules = [
      // Règle : Apprenant débutant avec difficultés
      {
        id: 'beginner-struggling',
        condition: (profile, progress) => 
          profile.adaptedLevel === 'beginner' && 
          progress.strugglingConcepts.length > 0,
        action: {
          type: 'add-support',
          target: 'struggling-concepts',
          parameters: { 
            addVisualAids: true, 
            addBasicExplanations: true,
            reducePace: true 
          }
        },
        priority: 10,
        description: 'Ajouter du support pour apprenant débutant en difficulté'
      },
      
      // Règle : Apprenant visuel
      {
        id: 'visual-learner',
        condition: (profile) => profile.learningStyle === 'visual',
        action: {
          type: 'add-resource',
          target: 'visual-resources',
          parameters: { 
            prioritizeVisual: true,
            addDiagrams: true,
            addVideoContent: true 
          }
        },
        priority: 7,
        description: 'Prioriser les ressources visuelles'
      },

      // Règle : Apprenant rapide
      {
        id: 'fast-learner',
        condition: (profile, progress) => 
          profile.pace === 'fast' && 
          progress.completionRate > 0.8,
        action: {
          type: 'adjust-difficulty',
          target: 'increase',
          parameters: { 
            addAdvancedExercises: true,
            skipBasicConcepts: true,
            addChallenges: true 
          }
        },
        priority: 8,
        description: 'Augmenter la difficulté pour apprenant rapide'
      },

      // Règle : Faible confiance
      {
        id: 'low-confidence',
        condition: (profile, progress) => {
          const avgConfidence = Object.values(progress.confidenceLevels)
            .reduce((sum, conf) => sum + conf, 0) / Object.keys(progress.confidenceLevels).length;
          return avgConfidence < 3;
        },
        action: {
          type: 'add-support',
          target: 'confidence-building',
          parameters: { 
            addEncouragement: true,
            simplifySteps: true,
            addMoreExamples: true 
          }
        },
        priority: 9,
        description: 'Renforcer la confiance avec plus de support'
      },

      // Règle : Apprenant kinesthésique
      {
        id: 'kinesthetic-learner',
        condition: (profile) => profile.learningStyle === 'kinesthetic',
        action: {
          type: 'add-resource',
          target: 'interactive-resources',
          parameters: { 
            prioritizeExercises: true,
            addInteractiveContent: true,
            reducePassiveContent: true 
          }
        },
        priority: 7,
        description: 'Privilégier les exercices interactifs'
      }
    ];
  }

  /**
   * Génère un parcours personnalisé pour un utilisateur
   */
  async generatePersonalizedPath(
    userId: string,
    courseId: string,
    profile: LearningProfile,
    progress: LearningProgress,
    originalCourse: CourseContent
  ): Promise<PersonalizedPath> {
    
    // Analyser les règles d'adaptation applicables
    const applicableRules = this.adaptationRules
      .filter(rule => rule.condition(profile, progress))
      .sort((a, b) => b.priority - a.priority);

    const reasoning: string[] = [];
    const adaptedResources: AdaptiveResource[] = [];
    const difficultyAdjustments: Record<string, 'easier' | 'harder' | 'same'> = {};
    const supportResources: AdaptiveResource[] = [];

    // Appliquer les règles d'adaptation
    for (const rule of applicableRules) {
      reasoning.push(rule.description);
      
      switch (rule.action.type) {
        case 'add-resource':
          await this.addAdaptiveResources(rule, adaptedResources, profile);
          break;
          
        case 'adjust-difficulty':
          this.adjustDifficulty(rule, difficultyAdjustments, originalCourse);
          break;
          
        case 'add-support':
          await this.addSupportResources(rule, supportResources, progress);
          break;
      }
    }

    // Construire la séquence adaptée
    const originalSequence = this.extractConceptSequence(originalCourse);
    const adaptedSequence = this.adaptSequence(originalSequence, profile, progress);

    // Estimer la durée
    const estimatedDuration = this.estimateAdaptedDuration(
      originalCourse.metadata.duration,
      adaptedResources,
      supportResources,
      profile
    );

    const personalizedPath: PersonalizedPath = {
      userId,
      courseId,
      originalSequence,
      adaptedSequence,
      adaptedResources,
      reasoning,
      estimatedDuration,
      difficultyAdjustments,
      supportResources
    };

    // Sauvegarder le parcours
    this.personalizedPaths.set(`${userId}-${courseId}`, personalizedPath);

    return personalizedPath;
  }

  /**
   * Ajoute des ressources adaptatives selon la règle
   */
  private async addAdaptiveResources(
    rule: AdaptationRule,
    adaptedResources: AdaptiveResource[],
    profile: LearningProfile
  ): Promise<void> {
    const { parameters } = rule.action;

    if (parameters.prioritizeVisual && profile.learningStyle === 'visual') {
      // Ajouter des ressources visuelles pour tous les concepts
      for (const [concept, resources] of this.resources) {
        const visualResources = resources.filter(r => r.learningStyle === 'visual');
        adaptedResources.push(...visualResources);
      }
    }

    if (parameters.prioritizeExercises && profile.learningStyle === 'kinesthetic') {
      // Ajouter plus d'exercices interactifs
      for (const [concept, resources] of this.resources) {
        const interactiveResources = resources.filter(r => 
          r.type === 'exercise' && r.metadata.interactivity === 'high'
        );
        adaptedResources.push(...interactiveResources);
      }
    }
  }

  /**
   * Ajuste la difficulté du contenu
   */
  private adjustDifficulty(
    rule: AdaptationRule,
    difficultyAdjustments: Record<string, 'easier' | 'harder' | 'same'>,
    originalCourse: CourseContent
  ): void {
    const { target, parameters } = rule.action;
    
    if (target === 'increase' && parameters.addAdvancedExercises) {
      // Marquer les concepts pour augmentation de difficulté
      const concepts = this.extractConceptSequence(originalCourse);
      concepts.forEach(concept => {
        difficultyAdjustments[concept] = 'harder';
      });
    }
  }

  /**
   * Ajoute des ressources de support
   */
  private async addSupportResources(
    rule: AdaptationRule,
    supportResources: AdaptiveResource[],
    progress: LearningProgress
  ): Promise<void> {
    const { parameters } = rule.action;

    if (parameters.addBasicExplanations) {
      // Ajouter des explications supplémentaires pour les concepts en difficulté
      progress.strugglingConcepts.forEach(concept => {
        const conceptResources = this.resources.get(concept) || [];
        const basicExplanations = conceptResources.filter(r => 
          r.type === 'explanation' && r.difficulty === 'beginner'
        );
        supportResources.push(...basicExplanations);
      });
    }

    if (parameters.addMoreExamples) {
      // Ajouter plus d'exemples pour renforcer la confiance
      Object.keys(progress.confidenceLevels).forEach(concept => {
        if (progress.confidenceLevels[concept] < 3) {
          const conceptResources = this.resources.get(concept) || [];
          const examples = conceptResources.filter(r => r.type === 'example');
          supportResources.push(...examples);
        }
      });
    }
  }

  /**
   * Extrait la séquence de concepts d'un cours
   */
  private extractConceptSequence(course: CourseContent): string[] {
    // Analyser le contenu markdown pour extraire les concepts
    const concepts: string[] = [];
    
    // Logique simple basée sur les tags du cours
    if (course.metadata.tags.includes('javascript')) {
      concepts.push('variables', 'functions', 'arrays');
    }
    
    if (course.metadata.tags.includes('svelte')) {
      concepts.push('components', 'reactivity', 'events');
    }

    return concepts;
  }

  /**
   * Adapte la séquence d'apprentissage
   */
  private adaptSequence(
    originalSequence: string[],
    profile: LearningProfile,
    progress: LearningProgress
  ): string[] {
    let adaptedSequence = [...originalSequence];

    // Réorganiser selon les difficultés de l'apprenant
    if (progress.strugglingConcepts.length > 0) {
      // Déplacer les concepts difficiles vers la fin
      const struggling = progress.strugglingConcepts;
      const others = adaptedSequence.filter(c => !struggling.includes(c));
      adaptedSequence = [...others, ...struggling];
    }

    // Ajuster selon le niveau
    if (profile.adaptedLevel === 'advanced') {
      // Commencer par les concepts plus complexes si l'apprenant est avancé
      adaptedSequence.reverse();
    }

    return adaptedSequence;
  }

  /**
   * Estime la durée adaptée du cours
   */
  private estimateAdaptedDuration(
    originalDuration: number,
    adaptedResources: AdaptiveResource[],
    supportResources: AdaptiveResource[],
    profile: LearningProfile
  ): number {
    let estimatedDuration = originalDuration;

    // Ajouter le temps des ressources supplémentaires
    const additionalTime = [...adaptedResources, ...supportResources]
      .reduce((total, resource) => total + resource.estimatedTime, 0);
    
    estimatedDuration += additionalTime;

    // Ajuster selon le rythme de l'apprenant
    switch (profile.pace) {
      case 'slow':
        estimatedDuration *= 1.5;
        break;
      case 'fast':
        estimatedDuration *= 0.8;
        break;
      default:
        // 'normal' - pas d'ajustement
        break;
    }

    return Math.round(estimatedDuration);
  }

  /**
   * Obtient les ressources pour un concept spécifique
   */
  getResourcesForConcept(
    concept: string,
    profile: LearningProfile,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): AdaptiveResource[] {
    const allResources = this.resources.get(concept) || [];
    
    let filteredResources = allResources;

    // Filtrer par difficulté si spécifiée
    if (difficulty) {
      filteredResources = filteredResources.filter(r => r.difficulty === difficulty);
    }

    // Filtrer par style d'apprentissage
    filteredResources = filteredResources.filter(r => 
      r.learningStyle === profile.learningStyle || r.learningStyle === 'all'
    );

    return filteredResources;
  }

  /**
   * Met à jour le progrès d'un utilisateur
   */
  updateUserProgress(userId: string, progress: Partial<LearningProgress>): void {
    const existingProgress = this.userProgress.get(userId);
    
    const updatedProgress: LearningProgress = {
      userId,
      courseId: progress.courseId || existingProgress?.courseId || '',
      conceptsMastered: progress.conceptsMastered || existingProgress?.conceptsMastered || [],
      conceptsInProgress: progress.conceptsInProgress || existingProgress?.conceptsInProgress || [],
      conceptsNotStarted: progress.conceptsNotStarted || existingProgress?.conceptsNotStarted || [],
      totalTimeSpent: progress.totalTimeSpent || existingProgress?.totalTimeSpent || 0,
      averageSessionTime: progress.averageSessionTime || existingProgress?.averageSessionTime || 0,
      lastActivity: progress.lastActivity || new Date(),
      completionRate: progress.completionRate || existingProgress?.completionRate || 0,
      strugglingConcepts: progress.strugglingConcepts || existingProgress?.strugglingConcepts || [],
      confidenceLevels: progress.confidenceLevels || existingProgress?.confidenceLevels || {}
    };

    this.userProgress.set(userId, updatedProgress);
  }

  /**
   * Obtient le parcours personnalisé d'un utilisateur
   */
  getPersonalizedPath(userId: string, courseId: string): PersonalizedPath | null {
    return this.personalizedPaths.get(`${userId}-${courseId}`) || null;
  }

  /**
   * Obtient toutes les ressources disponibles
   */
  getAllResources(): Map<string, AdaptiveResource[]> {
    return new Map(this.resources);
  }

  /**
   * Ajoute une nouvelle ressource
   */
  addResource(concept: string, resource: AdaptiveResource): void {
    if (!this.resources.has(concept)) {
      this.resources.set(concept, []);
    }
    this.resources.get(concept)!.push(resource);
  }
}

// Instance globale
export const adaptiveResourceSystem = new AdaptiveResourceSystem();
