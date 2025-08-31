<script lang="ts">
  import InteractiveExercise from "$lib/components/exercises/InteractiveExercise.svelte";

  let exerciseCompleted = false;
  let finalScore = 0;

  function handleExerciseComplete(event: CustomEvent) {
    const { score } = event.detail;
    finalScore = score;
    exerciseCompleted = true;

    // Log for demo purposes
    console.log("Exercice terminé avec un score de:", score + "%");
  }

  function handleProgress(event: CustomEvent) {
    const { current, total } = event.detail;
    console.log(`Progression: ${current}/${total} questions répondues`);
  }
</script>

<svelte:head>
  <title>Exercice Interactif - Fractions - FunLearning</title>
  <meta
    name="description"
    content="Exercice interactif sur les fractions avec QCM et évaluation automatique"
  />
</svelte:head>

<div class="exercise-page">
  <header class="page-header">
    <div class="container">
      <nav class="breadcrumb">
        <a href="/">Accueil</a>
        <span class="separator">→</span>
        <a href="/demo">Démo</a>
        <span class="separator">→</span>
        <span class="current">Exercice Interactif</span>
      </nav>

      <div class="header-content">
        <h1>🎯 Exercices Interactifs</h1>
        <p>
          Découvrez notre système d'exercices avec évaluation automatique et
          feedback personnalisé
        </p>
      </div>
    </div>
  </header>

  <main class="page-content">
    <div class="container">
      {#if !exerciseCompleted}
        <div class="exercise-wrapper">
          <InteractiveExercise
            on:complete={handleExerciseComplete}
            on:progress={handleProgress}
          />
        </div>
      {:else}
        <div class="completion-celebration">
          <div class="celebration-content">
            <h2>🎉 Félicitations !</h2>
            <p>
              Vous avez terminé l'exercice avec un score de <strong
                >{finalScore}%</strong
              >
            </p>

            <div class="next-steps">
              <h3>Que souhaitez-vous faire maintenant ?</h3>
              <div class="action-grid">
                <a href="/demo/markdown" class="action-card">
                  <div class="action-icon">📚</div>
                  <h4>Contenu Markdown</h4>
                  <p>Découvrez notre système de rendu de contenu éducatif</p>
                </a>

                <button
                  class="action-card"
                  on:click={() => {
                    exerciseCompleted = false;
                    finalScore = 0;
                  }}
                >
                  <div class="action-icon">🔄</div>
                  <h4>Refaire l'exercice</h4>
                  <p>Améliorez votre score en recommençant</p>
                </button>

                <a href="/content" class="action-card">
                  <div class="action-icon">🎓</div>
                  <h4>Autres cours</h4>
                  <p>Explorez d'autres matières et niveaux</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </main>

  <aside class="demo-info">
    <div class="container">
      <div class="info-card">
        <h3>💡 Fonctionnalités démontrées</h3>
        <ul class="feature-list">
          <li>
            <strong>QCM interactifs</strong> - Questions à choix multiples avec validation
            en temps réel
          </li>
          <li>
            <strong>Progression visuelle</strong> - Barre de progression et navigation
            entre questions
          </li>
          <li>
            <strong>Feedback immédiat</strong> - Correction automatique avec explications
          </li>
          <li>
            <strong>Score calculé</strong> - Évaluation automatique et pourcentage
            de réussite
          </li>
          <li>
            <strong>Design adaptatif</strong> - Interface responsive pour tous les
            appareils
          </li>
          <li>
            <strong>Composants réutilisables</strong> - Architecture modulaire pour
            d'autres exercices
          </li>
        </ul>
      </div>

      <div class="tech-info">
        <h4>🔧 Technologies utilisées</h4>
        <div class="tech-tags">
          <span class="tech-tag">Svelte</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">Markdown</span>
          <span class="tech-tag">CSS Grid</span>
          <span class="tech-tag">Animations</span>
        </div>
      </div>
    </div>
  </aside>
</div>

<style>
  .exercise-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .page-header {
    background: white;
    border-bottom: 1px solid #e9ecef;
    padding: 2rem 0;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }

  .breadcrumb a {
    color: #007bff;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .separator {
    color: #6c757d;
  }

  .current {
    color: #495057;
    font-weight: 500;
  }

  .header-content {
    text-align: center;
  }

  .header-content h1 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .header-content p {
    margin: 0;
    color: #6c757d;
    font-size: 1.2rem;
  }

  .page-content {
    padding: 3rem 0;
  }

  .exercise-wrapper {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .completion-celebration {
    background: white;
    border-radius: 1rem;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .celebration-content h2 {
    margin: 0 0 1rem 0;
    color: #28a745;
    font-size: 2.5rem;
  }

  .celebration-content p {
    margin: 0 0 3rem 0;
    font-size: 1.3rem;
    color: #495057;
  }

  .next-steps h3 {
    margin: 0 0 2rem 0;
    color: #495057;
    font-size: 1.5rem;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .action-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .action-card:hover {
    border-color: #007bff;
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15);
  }

  .action-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .action-card h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.2rem;
  }

  .action-card p {
    margin: 0;
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .demo-info {
    background: white;
    border-top: 1px solid #e9ecef;
    padding: 3rem 0;
  }

  .info-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .info-card h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.3rem;
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feature-list li {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.5;
  }

  .feature-list li::before {
    content: "✨";
    position: absolute;
    left: 0;
    top: 0;
  }

  .tech-info h4 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1.1rem;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-tag {
    background: #007bff;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    .header-content h1 {
      font-size: 2rem;
    }

    .header-content p {
      font-size: 1rem;
    }

    .page-content {
      padding: 2rem 0;
    }

    .completion-celebration {
      padding: 2rem;
    }

    .celebration-content h2 {
      font-size: 2rem;
    }

    .celebration-content p {
      font-size: 1.1rem;
    }

    .action-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .action-card {
      padding: 1.5rem;
    }

    .breadcrumb {
      font-size: 0.8rem;
      flex-wrap: wrap;
    }

    .tech-tags {
      justify-content: center;
    }
  }
</style>
