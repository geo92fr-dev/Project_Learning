<script lang="ts">
  export let matiere: string;
  export let totalCompetences: number = 0;
  export let totalCours: number = 0;
  export let progression: number = 0; // pourcentage de progression
  
  // Configuration des matières avec couleurs et icônes
  const matiereConfig: Record<string, {
    title: string;
    icon: string;
    color: string;
    colorDark: string;
    description: string;
  }> = {
    'mathematiques': {
      title: 'Mathématiques',
      icon: '📊',
      color: '#667eea',
      colorDark: '#764ba2',
      description: 'Nombres, calculs, géométrie et résolution de problèmes'
    },
    'francais': {
      title: 'Français',
      icon: '📚',
      color: '#f093fb',
      colorDark: '#f5576c',
      description: 'Grammaire, orthographe, lecture et expression écrite'
    },
    'anglais': {
      title: 'Anglais',
      icon: '🌍',
      color: '#4facfe',
      colorDark: '#00f2fe',
      description: 'Vocabulaire, grammaire et expression orale et écrite'
    },
    'histoire': {
      title: 'Histoire',
      icon: '🏛️',
      color: '#fa709a',
      colorDark: '#fee140',
      description: 'Événements historiques, personnages et civilisations'
    },
    'geographie': {
      title: 'Géographie',
      icon: '🗺️',
      color: '#a8edea',
      colorDark: '#fed6e3',
      description: 'Territoires, populations et développement durable'
    },
    'sciences': {
      title: 'Sciences',
      icon: '🔬',
      color: '#d299c2',
      colorDark: '#fef9d7',
      description: 'Physique, chimie, SVT et technologie'
    }
  };
  
  $: config = matiereConfig[matiere] || {
    title: matiere,
    icon: '📖',
    color: '#667eea',
    colorDark: '#764ba2',
    description: 'Matière non configurée'
  };
  
  // Calculer les statistiques
  $: stats = {
    cours: totalCours,
    competences: totalCompetences,
    progression: Math.round(progression),
    niveauxDisponibles: 4 // 6ème à 3ème
  };
</script>

<svelte:head>
  <style>
    :root {
      --matiere-color: {config.color};
      --matiere-color-dark: {config.colorDark};
    }
  </style>
</svelte:head>

<header class="matiere-header">
  <div class="container mx-auto px-4 py-8">
    <div class="header-content">
      <!-- Titre et description -->
      <div class="matiere-info">
        <div class="matiere-title">
          <span class="matiere-icon">{config.icon}</span>
          <h1 class="title">{config.title}</h1>
        </div>
        <p class="description">{config.description}</p>
      </div>
      
      <!-- Statistiques -->
      <div class="matiere-stats">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{stats.niveauxDisponibles}</div>
            <div class="stat-label">Niveaux</div>
            <div class="stat-icon">🎯</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{stats.competences}</div>
            <div class="stat-label">Compétences</div>
            <div class="stat-icon">🧠</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{stats.cours}</div>
            <div class="stat-label">Cours</div>
            <div class="stat-icon">📚</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{stats.progression}%</div>
            <div class="stat-label">Progression</div>
            <div class="stat-icon">📈</div>
          </div>
        </div>
        
        <!-- Barre de progression globale -->
        {#if stats.progression > 0}
          <div class="progression-bar">
            <div class="progression-label">
              <span>Progression globale</span>
              <span>{stats.progression}%</span>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                style="width: {stats.progression}%"
              ></div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  .matiere-header {
    background: linear-gradient(135deg, var(--matiere-color) 0%, var(--matiere-color-dark) 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .matiere-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }
  
  .matiere-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .matiere-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .matiere-icon {
    font-size: 4rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
  
  .title {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .description {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    line-height: 1.6;
  }
  
  .matiere-stats {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
    position: relative;
    transition: transform 0.2s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .stat-icon {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    opacity: 0.6;
  }
  
  .progression-bar {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .progression-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .progress-track {
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
  
  /* Responsive */
  @media (max-width: 768px) {
    .header-content {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }
    
    .matiere-icon {
      font-size: 3rem;
    }
    
    .title {
      font-size: 2rem;
    }
    
    .description {
      font-size: 1rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    
    .stat-card {
      padding: 1rem;
    }
    
    .stat-value {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
