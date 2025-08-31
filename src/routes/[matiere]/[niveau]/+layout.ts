import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

// Liste des niveaux disponibles
const AVAILABLE_LEVELS = ['6eme', '5eme', '4eme', '3eme'];

export const load: LayoutLoad = async ({ params, parent }) => {
  const { matiere, niveau } = params;
  
  // Récupérer les données du parent (matière)
  const parentData = await parent();
  
  // Vérifier que le niveau existe
  if (!AVAILABLE_LEVELS.includes(niveau)) {
    throw error(404, `Niveau "${niveau}" non trouvé. Niveaux disponibles : ${AVAILABLE_LEVELS.join(', ')}`);
  }
  
  // Générer les compétences pour ce niveau
  const competences = generateCompetences(matiere, niveau);
  
  // Calculer les statistiques de progression
  const completedCompetences = competences.filter(c => c.progress && c.progress >= 100).length;
  const totalProgress = competences.reduce((sum, c) => sum + (c.progress || 0), 0);
  const niveauProgression = Math.round(totalProgress / competences.length);
  
  return {
    ...parentData,
    niveau,
    competences,
    stats: {
      ...(parentData as any).stats,
      totalCompetences: competences.length,
      completedCompetences,
      niveauProgression,
      inProgressCompetences: competences.filter(c => c.progress && c.progress > 0 && c.progress < 100).length,
      unlockedCompetences: competences.filter(c => c.isUnlocked !== false).length
    }
  };
};

// Fonction pour générer des compétences détaillées
function generateCompetences(matiere: string, niveau: string) {
  const competencesNames = getCompetencesForLevel(matiere, niveau);
  
  return competencesNames.map((comp, index) => {
    // Progression simulée basée sur l'index pour la démo
    const hasProgress = Math.random() > 0.3; // 70% des compétences ont une progression
    const progress = hasProgress ? Math.floor(Math.random() * 100) : 0;
    const isUnlocked = index === 0 || Math.random() > 0.2; // Première compétence toujours débloquée
    
    // Objectifs d'apprentissage par difficulté
    const objectives = generateObjectives(comp, index);
    const prerequisites = index > 0 ? generatePrerequisites(competencesNames, index) : [];
    const tags = generateTags(matiere, niveau, comp);
    
    return {
      id: `comp-${index + 1}`,
      slug: comp.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
      title: comp,
      description: generateDescription(comp, niveau),
      difficulty: (index < 2 ? 'facile' : index < 4 ? 'moyen' : 'difficile') as 'facile' | 'moyen' | 'difficile',
      duration: generateDuration(index),
      objectives,
      prerequisites,
      tags,
      progress: progress,
      isUnlocked: isUnlocked,
      lastAccessed: hasProgress ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
    };
  });
}

function generateDescription(competence: string, niveau: string): string {
  const descriptions: Record<string, string> = {
    'Les nombres entiers': 'Comprendre et manipuler les nombres entiers naturels, apprendre les opérations de base.',
    'Les fractions simples': 'Découvrir les fractions, comprendre leur signification et effectuer des calculs simples.',
    'Géométrie plane': 'Explorer les figures géométriques planes, leurs propriétés et leurs constructions.',
    'Mesures et unités': 'Maîtriser les unités de mesure et effectuer des conversions.',
    'Proportionnalité': 'Comprendre la notion de proportionnalité et résoudre des problèmes concrets.',
    'Organisation de données': 'Apprendre à organiser, représenter et interpréter des données.',
    'Nombres relatifs': 'Découvrir les nombres relatifs et leurs opérations.',
    'Fractions et décimaux': 'Approfondir le calcul avec les fractions et les nombres décimaux.',
    'Expressions littérales': 'Initiation au calcul littéral et aux expressions algébriques.',
    'Géométrie dans l\'espace': 'Explorer les solides et la géométrie en trois dimensions.'
  };
  
  return descriptions[competence] || `Maîtriser ${competence.toLowerCase()} en classe de ${niveau}.`;
}

function generateObjectives(competence: string, index: number): string[] {
  const baseObjectives = [
    'Comprendre les concepts fondamentaux',
    'Appliquer les techniques de calcul',
    'Résoudre des problèmes concrets',
    'Développer le raisonnement logique'
  ];
  
  const specificObjectives: Record<string, string[]> = {
    'Les nombres entiers': [
      'Lire et écrire les grands nombres',
      'Effectuer les quatre opérations',
      'Comprendre la division euclidienne'
    ],
    'Les fractions simples': [
      'Comprendre ce que représente une fraction',
      'Comparer des fractions simples',
      'Additionner des fractions de même dénominateur'
    ],
    'Géométrie plane': [
      'Construire des figures géométriques',
      'Utiliser les instruments de géométrie',
      'Reconnaître les propriétés des figures'
    ]
  };
  
  return specificObjectives[competence] || baseObjectives.slice(0, 3);
}

function generatePrerequisites(allCompetences: string[], currentIndex: number): string[] {
  if (currentIndex === 0) return [];
  
  const prereqCount = Math.min(2, currentIndex);
  const prerequisites: string[] = [];
  
  for (let i = 0; i < prereqCount; i++) {
    if (currentIndex - i - 1 >= 0) {
      prerequisites.push(allCompetences[currentIndex - i - 1]);
    }
  }
  
  return prerequisites;
}

function generateTags(matiere: string, niveau: string, competence: string): string[] {
  const tags = [niveau];
  
  if (competence.includes('nombre') || competence.includes('calcul')) {
    tags.push('Calcul', 'Arithmétique');
  }
  if (competence.includes('géométrie')) {
    tags.push('Géométrie', 'Construction');
  }
  if (competence.includes('fraction') || competence.includes('décimal')) {
    tags.push('Fractions', 'Décimaux');
  }
  if (competence.includes('problème') || competence.includes('proportionnalité')) {
    tags.push('Problèmes', 'Application');
  }
  
  return tags;
}

function generateDuration(index: number): string {
  const durations = ['20-30 min', '30-45 min', '45-60 min', '60-90 min'];
  const difficultyIndex = index < 2 ? 0 : index < 4 ? 1 : Math.random() > 0.5 ? 2 : 3;
  return durations[difficultyIndex];
}

// Fonction helper pour générer les compétences par niveau
function getCompetencesForLevel(matiere: string, niveau: string): string[] {
  const competencesBase: Record<string, Record<string, string[]>> = {
    'mathematiques': {
      '6eme': [
        'Les nombres entiers',
        'Les fractions simples', 
        'Géométrie plane',
        'Mesures et unités',
        'Proportionnalité',
        'Organisation de données'
      ],
      '5eme': [
        'Nombres relatifs',
        'Fractions et décimaux',
        'Expressions littérales',
        'Géométrie dans l\'espace',
        'Aires et périmètres',
        'Statistiques'
      ],
      '4eme': [
        'Calcul littéral',
        'Équations',
        'Théorème de Pythagore',
        'Cosinus',
        'Puissances',
        'Probabilités'
      ],
      '3eme': [
        'Fonctions',
        'Équations du second degré',
        'Trigonométrie',
        'Géométrie dans l\'espace',
        'Statistiques avancées',
        'Révisions brevet'
      ]
    },
    'francais': {
      '6eme': [
        'Orthographe',
        'Grammaire de base',
        'Vocabulaire',
        'Expression écrite',
        'Lecture et compréhension',
        'Poésie'
      ],
      '5eme': [
        'Conjugaison',
        'Analyse de phrases',
        'Rédaction',
        'Littérature médiévale',
        'Théâtre',
        'Argumentation'
      ],
      '4eme': [
        'Grammaire avancée',
        'Analyse littéraire',
        'Expression personnelle',
        'Littérature classique',
        'Presse et médias',
        'Oral et débat'
      ],
      '3eme': [
        'Révisions brevet',
        'Dissertation',
        'Analyse d\'image',
        'Littérature contemporaine',
        'Histoire des arts',
        'Préparation oral'
      ]
    }
  };
  
  // Utiliser les compétences définies ou des compétences par défaut
  return competencesBase[matiere]?.[niveau] || [
    'Compétence 1',
    'Compétence 2', 
    'Compétence 3',
    'Compétence 4',
    'Compétence 5',
    'Compétence 6'
  ];
}
