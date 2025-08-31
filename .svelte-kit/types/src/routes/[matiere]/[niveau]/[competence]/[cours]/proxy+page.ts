// @ts-nocheck
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }: Parameters<PageLoad>[0]) => {
  const { matiere, niveau, competence, cours } = params;
  
  // Récupérer les données du parent (compétence)
  const parentData = await parent();
  
  // Trouver le cours correspondant
  const coursData = (parentData as any).cours.find(
    (c: any) => c.slug === cours
  );
  
  if (!coursData) {
    throw error(404, `Cours "${cours}" non trouvé`);
  }
  
  // Générer le contenu du cours
  const contenu = generateCoursContent(coursData, competence);
  
  return {
    ...parentData,
    cours: coursData,
    contenu,
    navigation: {
      previous: getPreviousCours((parentData as any).cours, coursData),
      next: getNextCours((parentData as any).cours, coursData)
    }
  };
};

function generateCoursContent(cours: any, competence: string) {
  const contentTypes = {
    introduction: {
      sections: [
        'Présentation du sujet',
        'Objectifs du cours',
        'Plan de travail',
        'Prérequis nécessaires'
      ],
      activities: ['Vidéo d\'introduction', 'Quiz de positionnement']
    },
    théorie: {
      sections: [
        'Définitions et concepts',
        'Propriétés importantes',
        'Exemples détaillés',
        'Cas particuliers'
      ],
      activities: ['Lecture interactive', 'Schémas animés', 'Quiz de compréhension']
    },
    méthodes: {
      sections: [
        'Méthodes de résolution',
        'Techniques pratiques',
        'Astuces et conseils',
        'Erreurs courantes'
      ],
      activities: ['Exercices guidés', 'Méthodes interactives', 'Auto-évaluation']
    },
    exercices: {
      sections: [
        'Exercices d\'application',
        'Problèmes variés',
        'Défis bonus',
        'Corrections détaillées'
      ],
      activities: ['Exercices interactifs', 'Simulateur', 'Validation automatique']
    },
    applications: {
      sections: [
        'Applications concrètes',
        'Cas d\'usage réels',
        'Projets pratiques',
        'Perspectives d\'approfondissement'
      ],
      activities: ['Projet guidé', 'Étude de cas', 'Présentation finale']
    }
  };
  
  const config = contentTypes[cours.type as keyof typeof contentTypes] || contentTypes.théorie;
  
  return {
    sections: config.sections.map((title, index) => ({
      id: `section-${index + 1}`,
      title,
      duration: Math.floor(Math.random() * 8) + 3, // 3-10 minutes par section
      completed: Math.random() > 0.5,
      content: generateSectionContent(title, cours.type)
    })),
    activities: config.activities.map((title, index) => ({
      id: `activity-${index + 1}`,
      title,
      type: getActivityType(title),
      duration: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      completed: Math.random() > 0.3
    })),
    resources: generateResources(cours.type),
    totalDuration: cours.duration
  };
}

function generateSectionContent(title: string, type: string): string {
  const templates: Record<string, string> = {
    'Présentation du sujet': 'Dans cette section, nous allons découvrir les concepts fondamentaux et comprendre l\'importance de ce sujet dans votre apprentissage.',
    'Objectifs du cours': 'À la fin de ce cours, vous serez capable de maîtriser les compétences essentielles et d\'appliquer vos connaissances.',
    'Définitions et concepts': 'Nous explorerons les définitions précises et les concepts clés nécessaires à votre compréhension.',
    'Méthodes de résolution': 'Découvrez les techniques efficaces et les méthodes éprouvées pour résoudre les problèmes.',
    'Exercices d\'application': 'Mettez en pratique vos connaissances avec des exercices progressifs et adaptés à votre niveau.',
    'Applications concrètes': 'Explorez comment utiliser ces connaissances dans des situations réelles et pratiques.'
  };
  
  return templates[title] || 'Contenu détaillé de la section avec explications, exemples et illustrations.';
}

function getActivityType(title: string): string {
  if (title.includes('Vidéo')) return 'video';
  if (title.includes('Quiz')) return 'quiz';
  if (title.includes('Exercices')) return 'exercises';
  if (title.includes('Projet')) return 'project';
  if (title.includes('Lecture')) return 'reading';
  return 'interactive';
}

function generateResources(type: string) {
  const baseResources = [
    { title: 'Résumé du cours', type: 'pdf', url: '#' },
    { title: 'Aide-mémoire', type: 'image', url: '#' }
  ];
  
  const typeSpecificResources = {
    introduction: [
      { title: 'Vidéo de présentation', type: 'video', url: '#' }
    ],
    théorie: [
      { title: 'Schémas et diagrammes', type: 'image', url: '#' },
      { title: 'Définitions détaillées', type: 'pdf', url: '#' }
    ],
    méthodes: [
      { title: 'Guide des méthodes', type: 'pdf', url: '#' },
      { title: 'Exemples résolus', type: 'video', url: '#' }
    ],
    exercices: [
      { title: 'Banque d\'exercices', type: 'pdf', url: '#' },
      { title: 'Corrections vidéo', type: 'video', url: '#' }
    ],
    applications: [
      { title: 'Cas d\'étude', type: 'pdf', url: '#' },
      { title: 'Projet modèle', type: 'link', url: '#' }
    ]
  };
  
  return [
    ...baseResources,
    ...(typeSpecificResources[type as keyof typeof typeSpecificResources] || [])
  ];
}

function getPreviousCours(allCours: any[], currentCours: any) {
  const currentIndex = allCours.findIndex(c => c.id === currentCours.id);
  return currentIndex > 0 ? allCours[currentIndex - 1] : null;
}

function getNextCours(allCours: any[], currentCours: any) {
  const currentIndex = allCours.findIndex(c => c.id === currentCours.id);
  return currentIndex < allCours.length - 1 ? allCours[currentIndex + 1] : null;
}
