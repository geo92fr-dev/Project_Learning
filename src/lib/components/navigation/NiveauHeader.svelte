<script lang="ts">
  export let matiere: string;
  export let niveau: string;
  export let competences: any[] = [];
  export let stats: any = {};
  
  // Configuration des niveaux
  const niveauConfig: Record<string, {
    title: string;
    icon: string;
    description: string;
    theme: string;
  }> = {
    '6eme': {
      title: '6ème',
      icon: '🌱',
      description: 'Première année du collège - Découverte et bases fondamentales',
      theme: 'Adaptation et découverte'
    },
    '5eme': {
      title: '5ème',
      icon: '🌿',
      description: 'Approfondissement des acquis et nouvelles notions',
      theme: 'Consolidation et ouverture'
    },
    '4eme': {
      title: '4ème',
      icon: '🌳',
      description: 'Renforcement des compétences et préparation',
      theme: 'Maîtrise et perfectionnement'
    },
    '3eme': {
      title: '3ème',
      icon: '🎯',
      description: 'Dernière année du collège - Préparation au brevet',
      theme: 'Excellence et préparation'
    }
  };
  
  // Configuration des matières pour le header
  const matiereLabels: Record<string, string> = {
    'mathematiques': 'Mathématiques',
    'francais': 'Français',
    'anglais': 'Anglais',
    'histoire': 'Histoire',
    'geographie': 'Géographie',
    'sciences': 'Sciences'
  };
  
  $: config = niveauConfig[niveau] || {
    title: niveau,
    icon: '📚',
    description: 'Niveau non configuré',
    theme: 'Apprentissage'
  };
  
  $: matiereLabel = matiereLabels[matiere] || matiere;
  
  // Calculer les statistiques
  $: levelStats = {
    competences: competences.length,
    totalCours: competences.reduce((sum, comp) => sum + (comp.coursCount || 0), 0),
    progression: Math.round(stats.niveauProgression || 0),
    difficultyDistribution: getDifficultyDistribution(competences)
  };
  
  function getDifficultyDistribution(comps: any[]) {
    const distribution = { facile: 0, moyen: 0, difficile: 0 };
    comps.forEach(comp => {
      if (comp.difficulty && distribution.hasOwnProperty(comp.difficulty)) {
        distribution[comp.difficulty]++;
      }
    });
    return distribution;
  }
</script>

<header class="niveau-header">
  <div class="container mx-auto px-4 py-6">
    <!-- Titre principal -->
    <div class="header-main">
      <div class="niveau-identity">
        <div class="niveau-icon">{config.icon}</div>
        <div class="niveau-info">
          <div class="niveau-title">
            <h1>{config.title}</h1>
            <span class="matiere-name">{matiereLabel}</span>
          </div>
          <p class="niveau-description">{config.description}</p>
          <div class="niveau-theme">
            <span class="theme-label">🎯 Thème :</span>
            <span class="theme-value">{config.theme}</span>
          </div>
        </div>
      </div>
      
      <!-- Statistiques rapides -->
      <div class="quick-stats">
        <div class="stat-item">
          <div class="stat-number">{levelStats.competences}</div>
          <div class="stat-label">Compétences</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{levelStats.totalCours}</div>
          <div class="stat-label">Cours</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{levelStats.progression}%</div>
          <div class="stat-label">Progression</div>
        </div>
      </div>
    </div>
    
    <!-- Barre de progression détaillée -->
    {#if levelStats.progression > 0}
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-title">Progression du niveau</span>
          <span class="progress-percentage">{levelStats.progression}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            style="width: {levelStats.progression}%"
          ></div>
        </div>
      </div>
    {/if}
    
    <!-- Répartition des difficultés -->
    <div class="difficulty-overview">
      <h3 class="difficulty-title">Répartition par difficulté</h3>
      <div class="difficulty-grid">
        <div class="difficulty-item facile">
          <div class="difficulty-icon">🟢</div>
          <div class="difficulty-info">
            <div class="difficulty-count">{levelStats.difficultyDistribution.facile}</div>
            <div class="difficulty-label">Facile</div>
          </div>
        </div>
        
        <div class="difficulty-item moyen">
          <div class="difficulty-icon">🟡</div>
          <div class="difficulty-info">
            <div class="difficulty-count">{levelStats.difficultyDistribution.moyen}</div>
            <div class="difficulty-label">Moyen</div>
          </div>
        </div>
        
        <div class="difficulty-item difficile">
          <div class="difficulty-icon">🔴</div>
          <div class="difficulty-info">
            <div class="difficulty-count">{levelStats.difficultyDistribution.difficile}</div>
            <div class="difficulty-label">Difficile</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>

<style>
  .niveau-header {
    background: linear-gradient(135deg, var(--matiere-color, #667eea) 0%, var(--matiere-color-dark, #764ba2) 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .niveau-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .header-main {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: start;
    margin-bottom: 1.5rem;
  }
  
  .niveau-identity {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .niveau-icon {
    font-size: 4rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    flex-shrink: 0;
  }
  
  .niveau-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .niveau-title {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .niveau-title h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .matiere-name {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }
  
  .niveau-description {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    line-height: 1.5;
    max-width: 500px;
  }
  
  .niveau-theme {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.975rem;
  }
  
  .theme-label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .theme-value {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 600;
  }
  
  .quick-stats {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
  
  .stat-item {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
    min-width: 80px;
  }
  
  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .progress-section {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 1.5rem;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .progress-title {
    font-size: 0.925rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  
  .progress-percentage {
    font-weight: 700;
    font-size: 1rem;
  }
  
  .progress-bar {
    height: 0.75rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 1) 100%);
    border-radius: 0.375rem;
    transition: width 0.5s ease;
  }
  
  .difficulty-overview {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .difficulty-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .difficulty-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .difficulty-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .difficulty-icon {
    font-size: 1.25rem;
  }
  
  .difficulty-count {
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .difficulty-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .header-main {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .niveau-identity {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .niveau-icon {
      font-size: 3rem;
    }
    
    .niveau-title h1 {
      font-size: 2rem;
    }
    
    .niveau-description {
      font-size: 1rem;
      max-width: none;
    }
    
    .quick-stats {
      flex-direction: row;
      justify-content: center;
    }
    
    .difficulty-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .niveau-title {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .quick-stats {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
