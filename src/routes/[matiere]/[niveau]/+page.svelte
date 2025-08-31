<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import CompetenceCard from '$lib/components/navigation/CompetenceCard.svelte';
  
  export let data;
  
  $: matiere = data.matiere;
  $: niveau = data.niveau;
  $: competences = data.competences;
  
  // Configuration d'affichage par niveau
  $: niveauConfig = getNiveauDisplayConfig(niveau);
  
  function getNiveauDisplayConfig(niv: string) {
    const configs = {
      '6eme': {
        welcomeMessage: 'Bienvenue en 6ème ! Commencez votre parcours au collège.',
        encouragement: 'Prenez votre temps et construisez des bases solides.',
        focusAdvice: 'Concentrez-vous sur la compréhension plutôt que la vitesse.',
        icon: '🌱'
      },
      '5eme': {
        welcomeMessage: 'En 5ème, approfondissez vos connaissances !',
        encouragement: 'Vous maîtrisez déjà les bases, explorez de nouveaux horizons.',
        focusAdvice: 'Établissez des liens entre les différents concepts.',
        icon: '🌿'
      },
      '4eme': {
        welcomeMessage: 'La 4ème marque une étape importante !',
        encouragement: 'Développez votre autonomie et votre esprit critique.',
        focusAdvice: 'Préparez-vous progressivement aux exigences du lycée.',
        icon: '🌳'
      },
      '3eme': {
        welcomeMessage: 'Dernière ligne droite avant le brevet !',
        encouragement: 'Mobilisez toutes vos compétences pour exceller.',
        focusAdvice: 'Organisez vos révisions et travaillez la méthodologie.',
        icon: '🎯'
      }
    };
    
    return configs[niv] || {
      welcomeMessage: 'Découvrez les compétences de ce niveau.',
      encouragement: 'Progressez à votre rythme.',
      focusAdvice: 'Pratiquez régulièrement.',
      icon: '📚'
    };
  }
  
  // Grouper les compétences par difficulté
  $: competencesByDifficulty = groupCompetencesByDifficulty(competences);
  
  function groupCompetencesByDifficulty(comps: any[]) {
    return {
      facile: comps.filter(c => c.difficulty === 'facile'),
      moyen: comps.filter(c => c.difficulty === 'moyen'),
      difficile: comps.filter(c => c.difficulty === 'difficile')
    };
  }
  
  // Animation d'apparition
  let visible = false;
  
  onMount(() => {
    visible = true;
  });
  
  // Ordre recommandé des compétences
  $: orderedSections = [
    { 
      key: 'facile', 
      title: '🟢 Compétences Essentielles',
      description: 'Commencez par ces bases fondamentales',
      competences: competencesByDifficulty.facile,
      advice: 'Ces compétences sont la fondation de votre apprentissage.'
    },
    {
      key: 'moyen',
      title: '🟡 Compétences Intermédiaires', 
      description: 'Approfondissez vos connaissances',
      competences: competencesByDifficulty.moyen,
      advice: 'Assurez-vous de maîtriser les bases avant de continuer.'
    },
    {
      key: 'difficile',
      title: '🔴 Compétences Avancées',
      description: 'Relevez le défi avec ces notions complexes',
      competences: competencesByDifficulty.difficile,
      advice: 'Ces compétences demandent plus de pratique et de réflexion.'
    }
  ];
</script>

<svelte:head>
  <title>{niveau} {matiere} - Compétences - FunLearning</title>
</svelte:head>

<div class="niveau-page">
  <!-- Message de bienvenue -->
  {#if visible}
    <section class="welcome-section" in:fade={{ duration: 600, delay: 200 }}>
      <div class="welcome-content">
        <div class="welcome-header">
          <span class="niveau-icon">{niveauConfig.icon}</span>
          <div>
            <h2 class="welcome-title">{niveauConfig.welcomeMessage}</h2>
            <p class="welcome-subtitle">{niveauConfig.encouragement}</p>
          </div>
        </div>
        
        <div class="advice-card">
          <div class="advice-icon">💡</div>
          <p class="advice-text">{niveauConfig.focusAdvice}</p>
        </div>
      </div>
    </section>
  {/if}
  
  <!-- Progression globale du niveau -->
  {#if visible && data.stats?.niveauProgression > 0}
    <section class="progress-overview" in:fly={{ y: 30, duration: 600, delay: 400 }}>
      <h3 class="progress-title">📈 Votre progression en {niveau}</h3>
      <div class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            style="width: {data.stats.niveauProgression}%"
          ></div>
        </div>
        <span class="progress-text">{data.stats.niveauProgression}% complété</span>
      </div>
    </section>
  {/if}
  
  <!-- Sections de compétences -->
  {#if visible}
    {#each orderedSections as section, sectionIndex}
      {#if section.competences.length > 0}
        <section 
          class="competences-section" 
          in:fly={{ y: 50, duration: 600, delay: 600 + (sectionIndex * 200) }}
        >
          <div class="section-header">
            <h3 class="section-title">{section.title}</h3>
            <p class="section-description">{section.description}</p>
            <div class="section-advice">
              <span class="advice-icon">ℹ️</span>
              <span class="advice-text">{section.advice}</span>
            </div>
          </div>
          
          <div class="competences-grid">
            {#each section.competences as competence, index}
              <div in:fly={{ y: 30, duration: 400, delay: 800 + (sectionIndex * 200) + (index * 100) }}>
                <CompetenceCard
                  {competence}
                  {matiere}
                  {niveau}
                  href="/{matiere}/{niveau}/{competence.slug}"
                />
              </div>
            {/each}
          </div>
        </section>
      {/if}
    {/each}
  {/if}
  
  <!-- Conseil pédagogique -->
  {#if visible}
    <section class="pedagogy-tips" in:fly={{ y: 50, duration: 600, delay: 1200 }}>
      <div class="tips-content">
        <h3 class="tips-title">🎓 Conseils pour réussir en {niveau}</h3>
        
        <div class="tips-grid">
          <div class="tip-card">
            <div class="tip-icon">📅</div>
            <h4 class="tip-title">Planifiez</h4>
            <p class="tip-text">Organisez votre travail et fixez-vous des objectifs réalisables.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">🔄</div>
            <h4 class="tip-title">Pratiquez</h4>
            <p class="tip-text">La répétition et la pratique régulière sont clés pour mémoriser.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">❓</div>
            <h4 class="tip-title">Questionnez</h4>
            <p class="tip-text">N'hésitez pas à poser des questions et à demander de l'aide.</p>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">🎯</div>
            <h4 class="tip-title">Persévérez</h4>
            <p class="tip-text">Les difficultés sont normales, continuez vos efforts !</p>
          </div>
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  .niveau-page {
    padding: 1rem 0;
  }
  
  .welcome-section {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
  }
  
  .welcome-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .niveau-icon {
    font-size: 3rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  
  .welcome-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 0.5rem 0;
  }
  
  .welcome-subtitle {
    font-size: 1.125rem;
    color: #4a5568;
    margin: 0;
  }
  
  .advice-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #fef5e7;
    border: 1px solid #f6ad55;
    border-radius: 0.75rem;
    padding: 1rem;
  }
  
  .advice-icon {
    font-size: 1.5rem;
  }
  
  .advice-text {
    margin: 0;
    color: #9c4221;
    font-weight: 500;
  }
  
  .progress-overview {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .progress-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }
  
  .progress-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .progress-bar {
    flex: 1;
    height: 0.75rem;
    background: #f1f5f9;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--matiere-color, #3b82f6) 0%, var(--matiere-color-dark, #1e40af) 100%);
    border-radius: 0.375rem;
    transition: width 0.8s ease;
  }
  
  .progress-text {
    font-size: 0.925rem;
    font-weight: 600;
    color: var(--matiere-color, #3b82f6);
    white-space: nowrap;
  }
  
  .competences-section {
    margin-bottom: 3rem;
  }
  
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .section-description {
    font-size: 1rem;
    color: #718096;
    margin-bottom: 0.75rem;
  }
  
  .section-advice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #4a5568;
    background: #f7fafc;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }
  
  .competences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  
  .pedagogy-tips {
    background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid #e2e8f0;
  }
  
  .tips-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  .tip-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s ease;
  }
  
  .tip-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .tip-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .tip-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .tip-text {
    font-size: 0.925rem;
    color: #4a5568;
    margin: 0;
    line-height: 1.5;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .welcome-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .welcome-title {
      font-size: 1.5rem;
    }
    
    .competences-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .tips-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .niveau-page {
      padding: 0.5rem 0;
    }
    
    .welcome-section,
    .pedagogy-tips {
      padding: 1.5rem;
    }
    
    .tips-grid {
      grid-template-columns: 1fr;
    }
    
    .progress-container {
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }
  }
</style>
