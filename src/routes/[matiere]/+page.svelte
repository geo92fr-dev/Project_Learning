<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import LevelCard from '$lib/components/navigation/LevelCard.svelte';
  
  export let data;
  
  $: matiere = data.matiere;
  
  // Configuration des niveaux disponibles
  const niveaux = [
    {
      id: '6eme',
      title: '6ème',
      description: 'Première année du collège - Bases fondamentales',
      icon: '🌱',
      competences: 6,
      progression: 0,
      difficulty: 'facile',
      isAvailable: true
    },
    {
      id: '5eme', 
      title: '5ème',
      description: 'Approfondissement des acquis de 6ème',
      icon: '🌿',
      competences: 6,
      progression: 0,
      difficulty: 'facile',
      isAvailable: true
    },
    {
      id: '4eme',
      title: '4ème', 
      description: 'Consolidation et nouvelles notions',
      icon: '🌳',
      competences: 6,
      progression: 0,
      difficulty: 'moyen',
      isAvailable: true
    },
    {
      id: '3eme',
      title: '3ème',
      description: 'Préparation au brevet des collèges',
      icon: '🎯',
      competences: 6,
      progression: 0,
      difficulty: 'difficile',
      isAvailable: true
    }
  ];
  
  // Animation d'apparition
  let visible = false;
  
  onMount(() => {
    visible = true;
  });
  
  // Configuration spécifique par matière
  $: matiereInfo = getMatiereInfo(matiere);
  
  function getMatiereInfo(mat: string) {
    const infos: Record<string, {
      welcomeMessage: string;
      objectives: string[];
      tips: string;
    }> = {
      'mathematiques': {
        welcomeMessage: 'Explorez l\'univers des nombres, des formes et de la logique !',
        objectives: [
          'Maîtriser les opérations fondamentales',
          'Comprendre la géométrie dans l\'espace',
          'Développer le raisonnement mathématique',
          'Résoudre des problèmes concrets'
        ],
        tips: '💡 Conseil : Pratiquez régulièrement avec des exercices variés pour progresser efficacement.'
      },
      'francais': {
        welcomeMessage: 'Découvrez la richesse de la langue française !',
        objectives: [
          'Maîtriser l\'orthographe et la grammaire',
          'Développer l\'expression écrite',
          'Analyser des textes littéraires',
          'Enrichir son vocabulaire'
        ],
        tips: '📚 Conseil : Lisez régulièrement pour améliorer votre style et votre culture littéraire.'
      },
      'anglais': {
        welcomeMessage: 'Welcome to your English learning journey!',
        objectives: [
          'Acquérir du vocabulaire essentiel',
          'Maîtriser la grammaire anglaise',
          'Développer la compréhension orale',
          'S\'exprimer avec confiance'
        ],
        tips: '🌍 Conseil : Regardez des vidéos en anglais avec sous-titres pour améliorer votre compréhension.'
      },
      'histoire': {
        welcomeMessage: 'Voyagez à travers les époques et civilisations !',
        objectives: [
          'Comprendre les grandes périodes historiques',
          'Analyser des documents historiques',
          'Développer l\'esprit critique',
          'Situer les événements dans le temps'
        ],
        tips: '🏛️ Conseil : Créez des frises chronologiques pour mieux mémoriser les dates importantes.'
      },
      'geographie': {
        welcomeMessage: 'Explorez notre planète et ses territoires !',
        objectives: [
          'Comprendre l\'organisation des territoires',
          'Analyser les enjeux environnementaux',
          'Lire et interpréter des cartes',
          'Développer l\'esprit géographique'
        ],
        tips: '🗺️ Conseil : Utilisez des atlas et cartes interactives pour visualiser les concepts étudiés.'
      },
      'sciences': {
        welcomeMessage: 'Découvrez les secrets de la nature et de la technologie !',
        objectives: [
          'Observer et expérimenter',
          'Comprendre les phénomènes naturels',
          'Développer l\'esprit scientifique',
          'Appliquer les connaissances'
        ],
        tips: '🔬 Conseil : Faites des expériences simples à la maison pour mieux comprendre les concepts.'
      }
    };
    
    return infos[mat] || {
      welcomeMessage: 'Commencez votre apprentissage !',
      objectives: ['Acquérir de nouvelles connaissances', 'Développer des compétences'],
      tips: '📖 Conseil : Travaillez régulièrement pour progresser efficacement.'
    };
  }
</script>

<svelte:head>
  <title>{matiere} - Choisir un niveau - FunLearning</title>
</svelte:head>

<div class="matiere-page">
  <!-- Message d'accueil -->
  {#if visible}
    <section class="welcome-section" in:fade={{ duration: 600, delay: 200 }}>
      <div class="welcome-content">
        <h2 class="welcome-title">
          {matiereInfo.welcomeMessage}
        </h2>
        <p class="welcome-subtitle">
          Choisissez votre niveau pour commencer l'aventure
        </p>
      </div>
    </section>
  {/if}
  
  <!-- Grille des niveaux -->
  {#if visible}
    <section class="levels-section" in:fly={{ y: 50, duration: 600, delay: 400 }}>
      <h3 class="section-title">Niveaux disponibles</h3>
      
      <div class="levels-grid">
        {#each niveaux as niveau, index}
          <div in:fly={{ y: 30, duration: 400, delay: 600 + (index * 100) }}>
            <LevelCard 
              {niveau}
              {matiere}
              href="/{matiere}/{niveau.id}"
            />
          </div>
        {/each}
      </div>
    </section>
  {/if}
  
  <!-- Objectifs pédagogiques -->
  {#if visible}
    <section class="objectives-section" in:fly={{ y: 50, duration: 600, delay: 800 }}>
      <div class="objectives-grid">
        <div class="objectives-content">
          <h3 class="objectives-title">🎯 Objectifs pédagogiques</h3>
          <ul class="objectives-list">
            {#each matiereInfo.objectives as objective, index}
              <li in:fly={{ x: -20, duration: 400, delay: 1000 + (index * 100) }}>
                <span class="objective-bullet">✓</span>
                {objective}
              </li>
            {/each}
          </ul>
        </div>
        
        <div class="tips-content">
          <div class="tip-card">
            <p class="tip-text">{matiereInfo.tips}</p>
          </div>
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  .matiere-page {
    padding: 1rem 0;
  }
  
  .welcome-section {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.9) 100%);
    border-radius: 1rem;
    border: 1px solid rgba(var(--matiere-color), 0.1);
  }
  
  .welcome-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  
  .welcome-subtitle {
    font-size: 1.125rem;
    color: #718096;
    margin: 0;
  }
  
  .levels-section {
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .levels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .objectives-section {
    background: #f7fafc;
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid #e2e8f0;
  }
  
  .objectives-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    align-items: start;
  }
  
  .objectives-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }
  
  .objectives-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .objectives-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.975rem;
    color: #4a5568;
    line-height: 1.5;
  }
  
  .objective-bullet {
    color: #22c55e;
    font-weight: bold;
    font-size: 1rem;
  }
  
  .tip-card {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
  }
  
  .tip-text {
    margin: 0;
    font-size: 0.925rem;
    color: #92400e;
    line-height: 1.6;
    font-weight: 500;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .welcome-section {
      padding: 1.5rem 1rem;
      margin-bottom: 2rem;
    }
    
    .welcome-title {
      font-size: 1.5rem;
    }
    
    .welcome-subtitle {
      font-size: 1rem;
    }
    
    .levels-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .objectives-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .objectives-section {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .matiere-page {
      padding: 0.5rem 0;
    }
    
    .welcome-section {
      padding: 1rem;
    }
    
    .welcome-title {
      font-size: 1.25rem;
    }
    
    .objectives-section {
      padding: 1rem;
    }
  }
</style>
