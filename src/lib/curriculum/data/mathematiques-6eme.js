// 📚 Données Curriculum - Mathématiques 6ème (Matière Pilote)
// Phase 6.1 - Validation architecture avec 5 compétences de base

/**
 * 🎯 MATHÉMATIQUES 6ÈME - Curriculum Pilote
 * 5 compétences fondamentales pour valider le système
 */

export const mathematiques6eme = {
  subject: 'mathematiques',
  level: '6eme',
  title: 'Mathématiques - Sixième',
  description: 'Programme complet de mathématiques pour la classe de sixième',
  estimatedDuration: '36 semaines', // Année scolaire
  globalObjectives: [
    'Maîtriser les nombres entiers et décimaux',
    'Développer le raisonnement géométrique',
    'Résoudre des problèmes concrets',
    'Utiliser les outils mathématiques appropriés',
    'Communiquer avec un langage mathématique précis'
  ],

  // 🔢 Compétences fondamentales
  competences: {
    // COMPÉTENCE 1 : Nombres et Calculs
    'math6-nombres-entiers': {
      id: 'math6-nombres-entiers',
      title: 'Nombres entiers et opérations',
      description: 'Maîtriser les nombres entiers, leur écriture et les opérations de base',
      type: 'fondamentale',
      difficulty: 2,
      estimatedTime: 120, // minutes par séance
      
      learningObjectives: [
        'Lire, écrire et représenter les nombres entiers',
        'Comparer et ranger les nombres entiers',
        'Effectuer les quatre opérations sur les entiers',
        'Résoudre des problèmes avec les nombres entiers'
      ],
      
      prerequisites: [
        'Numération de base (CP-CM2)',
        'Tables de multiplication',
        'Sens des opérations'
      ],
      
      subCompetences: [
        {
          id: 'lecture-ecriture-entiers',
          title: 'Lecture et écriture des nombres entiers',
          content: 'Nombres jusqu\'à 1 million, écriture en chiffres et en lettres',
          exercises: ['dictee-nombres', 'ecriture-lettres', 'decomposition']
        },
        {
          id: 'comparaison-entiers',
          title: 'Comparaison et rangement',
          content: 'Utilisation des symboles <, >, =, rangement croissant/décroissant',
          exercises: ['comparaison-paires', 'rangement-listes', 'encadrement']
        },
        {
          id: 'operations-entiers',
          title: 'Opérations sur les entiers',
          content: 'Addition, soustraction, multiplication, division euclidienne',
          exercises: ['calcul-mental', 'operations-posees', 'problemes-concrets']
        }
      ],
      
      assessmentCriteria: [
        'Exactitude des calculs',
        'Pertinence de la méthode choisie',
        'Présentation claire des calculs',
        'Vérification des résultats'
      ],
      
      resources: [
        {
          type: 'video',
          title: 'Les nombres entiers - Introduction',
          url: '/resources/videos/nombres-entiers-intro.mp4',
          duration: 8
        },
        {
          type: 'exercice',
          title: 'Exercices interactifs - Nombres entiers',
          url: '/exercises/math6/nombres-entiers',
          difficulty: 2
        },
        {
          type: 'schema',
          title: 'Frise numérique interactive',
          url: '/tools/frise-numerique',
          interactive: true
        }
      ]
    },

    // COMPÉTENCE 2 : Nombres décimaux
    'math6-nombres-decimaux': {
      id: 'math6-nombres-decimaux',
      title: 'Nombres décimaux',
      description: 'Comprendre et utiliser les nombres décimaux',
      type: 'fondamentale',
      difficulty: 3,
      estimatedTime: 100,
      
      learningObjectives: [
        'Comprendre la notion de nombre décimal',
        'Lire et écrire les nombres décimaux',
        'Comparer et ranger les nombres décimaux',
        'Effectuer des opérations simples avec les décimaux'
      ],
      
      prerequisites: ['math6-nombres-entiers'],
      
      subCompetences: [
        {
          id: 'notion-decimal',
          title: 'Notion de nombre décimal',
          content: 'Passage des fractions décimales aux nombres décimaux',
          exercises: ['fractions-decimales', 'graduation-droite', 'representation']
        },
        {
          id: 'ecriture-decimaux',
          title: 'Écriture des nombres décimaux',
          content: 'Partie entière, partie décimale, position des chiffres',
          exercises: ['decomposition-decimaux', 'placement-tableau', 'dictee-decimaux']
        },
        {
          id: 'operations-decimaux',
          title: 'Opérations avec les décimaux',
          content: 'Addition et soustraction de décimaux, multiplication par un entier',
          exercises: ['addition-decimaux', 'soustraction-decimaux', 'multiplication-simple']
        }
      ],
      
      assessmentCriteria: [
        'Compréhension de la valeur positionnelle',
        'Précision dans les calculs',
        'Utilisation correcte de la virgule',
        'Estimation et vérification des résultats'
      ],
      
      resources: [
        {
          type: 'manipulation',
          title: 'Matériel de numération décimale',
          url: '/tools/materiel-decimal',
          interactive: true
        },
        {
          type: 'video',
          title: 'Les nombres décimaux expliqués',
          url: '/resources/videos/decimaux-explication.mp4',
          duration: 12
        }
      ]
    },

    // COMPÉTENCE 3 : Géométrie plane
    'math6-geometrie-plane': {
      id: 'math6-geometrie-plane',
      title: 'Géométrie plane',
      description: 'Figures géométriques de base et leurs propriétés',
      type: 'fondamentale',
      difficulty: 3,
      estimatedTime: 90,
      
      learningObjectives: [
        'Reconnaître et nommer les figures géométriques de base',
        'Utiliser les instruments de géométrie',
        'Construire des figures simples',
        'Identifier les propriétés des figures'
      ],
      
      prerequisites: [
        'Vocabulaire spatial de base',
        'Manipulation des instruments'
      ],
      
      subCompetences: [
        {
          id: 'figures-base',
          title: 'Figures géométriques de base',
          content: 'Point, droite, segment, triangle, carré, rectangle, cercle',
          exercises: ['reconnaissance-figures', 'denomination', 'classification']
        },
        {
          id: 'instruments-geometrie',
          title: 'Utilisation des instruments',
          content: 'Règle, équerre, compas, rapporteur (initiation)',
          exercises: ['trace-droites', 'construction-triangles', 'trace-cercles']
        },
        {
          id: 'proprietes-figures',
          title: 'Propriétés des figures',
          content: 'Côtés, angles, symétries simples',
          exercises: ['mesure-segments', 'angles-droits', 'symetrie-axiale']
        }
      ],
      
      assessmentCriteria: [
        'Précision des constructions',
        'Utilisation appropriée des instruments',
        'Reconnaissance correcte des figures',
        'Application des propriétés'
      ],
      
      resources: [
        {
          type: 'simulation',
          title: 'Atelier de géométrie virtuel',
          url: '/tools/geometrie-virtuelle',
          interactive: true
        },
        {
          type: 'video',
          title: 'Constructions géométriques de base',
          url: '/resources/videos/constructions-geometrie.mp4',
          duration: 15
        }
      ]
    },

    // COMPÉTENCE 4 : Mesures et grandeurs
    'math6-mesures-grandeurs': {
      id: 'math6-mesures-grandeurs',
      title: 'Mesures et grandeurs',
      description: 'Unités de mesure et leur utilisation pratique',
      type: 'transversale',
      difficulty: 2,
      estimatedTime: 80,
      
      learningObjectives: [
        'Connaître les unités de mesure usuelles',
        'Effectuer des conversions simples',
        'Mesurer des longueurs, masses, durées',
        'Résoudre des problèmes de mesures'
      ],
      
      prerequisites: [
        'Notion de grandeur',
        'Numération décimale'
      ],
      
      subCompetences: [
        {
          id: 'unites-longueur',
          title: 'Unités de longueur',
          content: 'Mètre et ses multiples/sous-multiples, conversions',
          exercises: ['conversion-longueurs', 'mesures-directes', 'estimation']
        },
        {
          id: 'unites-masse',
          title: 'Unités de masse',
          content: 'Gramme, kilogramme, conversions courantes',
          exercises: ['pesees', 'conversion-masses', 'problemes-masse']
        },
        {
          id: 'unites-temps',
          title: 'Unités de temps',
          content: 'Heures, minutes, secondes, durées',
          exercises: ['lecture-horloges', 'calcul-durees', 'problemes-temps']
        }
      ],
      
      assessmentCriteria: [
        'Choix de l\'unité appropriée',
        'Exactitude des conversions',
        'Précision des mesures',
        'Cohérence des résultats'
      ],
      
      resources: [
        {
          type: 'outil',
          title: 'Tableau de conversion interactif',
          url: '/tools/conversion-unites',
          interactive: true
        },
        {
          type: 'jeu',
          title: 'Jeu des mesures',
          url: '/games/mesures-6eme',
          gamified: true
        }
      ]
    },

    // COMPÉTENCE 5 : Résolution de problèmes
    'math6-resolution-problemes': {
      id: 'math6-resolution-problemes',
      title: 'Résolution de problèmes',
      description: 'Méthodologie de résolution et problèmes concrets',
      type: 'transversale',
      difficulty: 4,
      estimatedTime: 100,
      
      learningObjectives: [
        'Analyser un énoncé de problème',
        'Identifier les données et l\'objectif',
        'Choisir une stratégie de résolution',
        'Vérifier la cohérence du résultat'
      ],
      
      prerequisites: [
        'math6-nombres-entiers',
        'math6-nombres-decimaux',
        'math6-mesures-grandeurs'
      ],
      
      subCompetences: [
        {
          id: 'analyse-enonce',
          title: 'Analyse d\'énoncé',
          content: 'Lecture active, identification des éléments clés',
          exercises: ['analyse-guidee', 'reformulation', 'tri-informations']
        },
        {
          id: 'strategies-resolution',
          title: 'Stratégies de résolution',
          content: 'Schéma, tableau, calcul direct, étapes',
          exercises: ['resolution-guidee', 'choix-methode', 'problemes-ouverts']
        },
        {
          id: 'verification-resultats',
          title: 'Vérification et validation',
          content: 'Ordre de grandeur, cohérence, unités',
          exercises: ['verification-systematique', 'detection-erreurs', 'estimation']
        }
      ],
      
      assessmentCriteria: [
        'Pertinence de l\'analyse',
        'Adaptation de la méthode',
        'Justesse du résultat',
        'Qualité de la vérification'
      ],
      
      resources: [
        {
          type: 'methodologie',
          title: 'Guide de résolution de problèmes',
          url: '/resources/guides/resolution-problemes.pdf',
          downloadable: true
        },
        {
          type: 'exercice',
          title: 'Problèmes progressifs',
          url: '/exercises/math6/problemes-progressifs',
          adaptive: true
        }
      ]
    }
  },

  // 🔗 Relations entre compétences (Graphe de connaissances)
  relations: [
    {
      from: 'math6-nombres-entiers',
      to: 'math6-nombres-decimaux',
      type: 'prerequis',
      weight: 0.9,
      description: 'Les nombres entiers sont essentiels pour comprendre les décimaux'
    },
    {
      from: 'math6-nombres-decimaux',
      to: 'math6-mesures-grandeurs',
      type: 'complement',
      weight: 0.7,
      description: 'Les décimaux sont utilisés dans les mesures précises'
    },
    {
      from: 'math6-nombres-entiers',
      to: 'math6-resolution-problemes',
      type: 'prerequis',
      weight: 0.8,
      description: 'Calculs de base nécessaires pour résoudre des problèmes'
    },
    {
      from: 'math6-nombres-decimaux',
      to: 'math6-resolution-problemes',
      type: 'prerequis',
      weight: 0.8,
      description: 'Calculs décimaux utiles dans many problèmes'
    },
    {
      from: 'math6-mesures-grandeurs',
      to: 'math6-resolution-problemes',
      type: 'complement',
      weight: 0.9,
      description: 'Les mesures sont souvent au cœur des problèmes concrets'
    },
    {
      from: 'math6-geometrie-plane',
      to: 'math6-mesures-grandeurs',
      type: 'complement',
      weight: 0.6,
      description: 'Mesure de longueurs en géométrie'
    }
  ],

  // 📊 Évaluation et progression
  evaluation: {
    modalites: [
      'Évaluation diagnostique (début d\'année)',
      'Évaluations formatives (régulières)',
      'Évaluations sommatives (fin de chapitre)',
      'Évaluation certificative (fin d\'année)'
    ],
    
    competencesCles: [
      'Calcul mental fluide',
      'Résolution autonome de problèmes',
      'Construction géométrique précise',
      'Utilisation appropriée des unités'
    ],
    
    niveauxMaitrise: {
      'non-acquis': 'Compétence non maîtrisée',
      'en-cours': 'Compétence en cours d\'acquisition',
      'acquis': 'Compétence maîtrisée',
      'expert': 'Compétence maîtrisée avec autonomie'
    }
  },

  // 🎯 Parcours recommandés
  parcours: {
    'parcours-standard': {
      name: 'Parcours Standard',
      description: 'Progression classique pour la majorité des élèves',
      ordre: [
        'math6-nombres-entiers',
        'math6-nombres-decimaux',
        'math6-geometrie-plane',
        'math6-mesures-grandeurs',
        'math6-resolution-problemes'
      ],
      dureeEstimee: '32 semaines'
    },
    
    'parcours-renforce': {
      name: 'Parcours Renforcé',
      description: 'Avec approfondissements pour élèves avancés',
      ordre: [
        'math6-nombres-entiers',
        'math6-geometrie-plane', // Parallèle possible
        'math6-nombres-decimaux',
        'math6-mesures-grandeurs',
        'math6-resolution-problemes'
      ],
      dureeEstimee: '30 semaines',
      enrichissements: [
        'Nombres relatifs (initiation)',
        'Géométrie dans l\'espace (découverte)',
        'Problèmes de recherche'
      ]
    },
    
    'parcours-accompagne': {
      name: 'Parcours Accompagné',
      description: 'Avec étapes supplémentaires pour élèves en difficulté',
      ordre: [
        'math6-nombres-entiers',
        'math6-nombres-decimaux',
        'math6-mesures-grandeurs',
        'math6-geometrie-plane',
        'math6-resolution-problemes'
      ],
      dureeEstimee: '36 semaines',
      supports: [
        'Matériel de manipulation',
        'Exercices guidés supplémentaires',
        'Tutorat par les pairs',
        'Révision calcul mental intégrée',
        'Consolidation opérations intégrée'
      ]
    }
  }
};

// 🔧 Fonctions utilitaires pour la validation
export const validationFunctions = {
  /**
   * Valider la cohérence du curriculum
   */
  validateCurriculum(curriculum) {
    const errors = [];
    const warnings = [];

    // Vérifier que toutes les relations pointent vers des compétences existantes
    const competenceIds = Object.keys(curriculum.competences);
    
    for (const relation of curriculum.relations) {
      if (!competenceIds.includes(relation.from)) {
        errors.push(`Relation invalide: ${relation.from} n'existe pas`);
      }
      if (!competenceIds.includes(relation.to)) {
        errors.push(`Relation invalide: ${relation.to} n'existe pas`);
      }
    }

    // Vérifier la cohérence des prérequis
    for (const [id, competence] of Object.entries(curriculum.competences)) {
      for (const prerequis of competence.prerequisites || []) {
        if (competenceIds.includes(prerequis)) {
          // C'est un prérequis interne, vérifier qu'il y a une relation
          const hasRelation = curriculum.relations.some(r => 
            r.from === prerequis && r.to === id && r.type === 'prerequis'
          );
          if (!hasRelation) {
            warnings.push(`Prérequis ${prerequis} pour ${id} sans relation définie`);
          }
        }
      }
    }

    return { errors, warnings, isValid: errors.length === 0 };
  },

  /**
   * Calculer les statistiques du curriculum
   */
  getStatistics(curriculum) {
    const competences = Object.values(curriculum.competences);
    
    return {
      totalCompetences: competences.length,
      totalDuration: competences.reduce((sum, c) => sum + c.estimatedTime, 0),
      difficultyDistribution: this.getDifficultyDistribution(competences),
      typeDistribution: this.getTypeDistribution(competences),
      averageDifficulty: competences.reduce((sum, c) => sum + c.difficulty, 0) / competences.length,
      relationCount: curriculum.relations.length,
      connectivityScore: this.calculateConnectivity(curriculum)
    };
  },

  getDifficultyDistribution(competences) {
    const distribution = {};
    competences.forEach(c => {
      distribution[c.difficulty] = (distribution[c.difficulty] || 0) + 1;
    });
    return distribution;
  },

  getTypeDistribution(competences) {
    const distribution = {};
    competences.forEach(c => {
      distribution[c.type] = (distribution[c.type] || 0) + 1;
    });
    return distribution;
  },

  calculateConnectivity(curriculum) {
    const competenceCount = Object.keys(curriculum.competences).length;
    const relationCount = curriculum.relations.length;
    
    // Score de connectivité basé sur le ratio relations/compétences
    return relationCount / competenceCount;
  }
};

export default mathematiques6eme;
