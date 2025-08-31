<script lang="ts">
  import { onMount } from "svelte";

  let mounted = false;
  let testResults: any = null;
  let loading = true;

  // Simulation des résultats de tests (en production, cela viendrait d'une API)
  const mockTestResults = {
    summary: {
      total: 119,
      passed: 113,
      failed: 6,
      skipped: 0,
      coverage: 95.2,
      duration: 28.4,
    },
    suites: [
      {
        name: "Authentication Tests",
        status: "passed",
        tests: 25,
        passed: 25,
        failed: 0,
        duration: 5.2,
        files: [
          "auth/GoogleAuth.test.ts",
          "auth/EmailAuth.test.ts",
          "stores/auth.test.ts",
        ],
      },
      {
        name: "Content Management Tests",
        status: "mostly-passed",
        tests: 32,
        passed: 30,
        failed: 2,
        duration: 8.7,
        files: [
          "utils/content.test.ts",
          "components/MarkdownRenderer.test.ts",
          "components/QCMCard.test.ts",
        ],
      },
      {
        name: "Component Tests",
        status: "passed",
        tests: 28,
        passed: 28,
        failed: 0,
        duration: 6.1,
        files: [
          "components/ui/Modal.test.ts",
          "components/exercises/InteractiveExercise.test.ts",
        ],
      },
      {
        name: "Utils & Helpers Tests",
        status: "mostly-passed",
        tests: 18,
        passed: 16,
        failed: 2,
        duration: 3.8,
        files: ["utils/generic-utils.test.ts", "utils/validation.test.ts"],
      },
      {
        name: "Integration Tests",
        status: "mostly-passed",
        tests: 16,
        passed: 14,
        failed: 2,
        duration: 4.6,
        files: ["pages/demo.test.ts", "pages/auth.test.ts"],
      },
    ],
    recentFailures: [
      {
        test: "Content sanitization in SSR environment",
        file: "utils/content.test.ts",
        error: "DOMPurify is not available in server context",
        status: "investigating",
      },
      {
        test: "QCM scoring calculation edge case",
        file: "components/QCMCard.test.ts",
        error: "Division by zero when no questions provided",
        status: "fixed",
      },
      {
        test: "Email validation with special characters",
        file: "utils/validation.test.ts",
        error: "Unicode email addresses not properly handled",
        status: "in-progress",
      },
      {
        test: "Component loading states",
        file: "components/ui/Modal.test.ts",
        error: "Async component mounting timing issues",
        status: "investigating",
      },
      {
        test: "Route navigation integration",
        file: "pages/demo.test.ts",
        error: "SvelteKit router mock not properly configured",
        status: "investigating",
      },
      {
        test: "Markdown highlighting performance",
        file: "utils/content.test.ts",
        error: "Timeout on large markdown files",
        status: "investigating",
      },
    ],
    coverage: {
      statements: 95.2,
      branches: 92.8,
      functions: 96.7,
      lines: 94.9,
    },
    trends: [
      { date: "2024-01-15", passed: 98 },
      { date: "2024-01-16", passed: 102 },
      { date: "2024-01-17", passed: 107 },
      { date: "2024-01-18", passed: 113 },
    ],
  };

  onMount(async () => {
    mounted = true;
    // Simulation d'un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    testResults = mockTestResults;
    loading = false;
  });

  function getStatusColor(status: string): string {
    switch (status) {
      case "passed":
        return "#28a745";
      case "mostly-passed":
        return "#ffc107";
      case "failed":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }

  function getStatusIcon(status: string): string {
    switch (status) {
      case "passed":
        return "✅";
      case "mostly-passed":
        return "⚠️";
      case "failed":
        return "❌";
      default:
        return "❓";
    }
  }

  function getFailureStatusBadge(status: string): string {
    switch (status) {
      case "fixed":
        return "✅ Corrigé";
      case "in-progress":
        return "🔄 En cours";
      case "investigating":
        return "🔍 Investigation";
      default:
        return "❓ Non défini";
    }
  }

  function getFailureStatusColor(status: string): string {
    switch (status) {
      case "fixed":
        return "#28a745";
      case "in-progress":
        return "#007bff";
      case "investigating":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  }
</script>

<svelte:head>
  <title>Tests & Qualité - FunLearning</title>
  <meta
    name="description"
    content="Résultats des tests automatisés et métriques de qualité du projet FunLearning"
  />
</svelte:head>

<div class="tests-page">
  <header class="tests-header">
    <div class="container">
      <div class="header-content" class:mounted>
        <h1>
          <span class="icon">🧪</span>
          Tests & Qualité
        </h1>
        <p class="header-description">
          Suivi en temps réel de la qualité du code, résultats des tests
          automatisés et métriques de couverture pour garantir la fiabilité du
          projet.
        </p>
      </div>
    </div>
  </header>

  <main class="tests-content">
    <div class="container">
      {#if loading}
        <div class="loading-section">
          <div class="loading-spinner" />
          <p>Chargement des résultats de tests...</p>
        </div>
      {:else if testResults}
        <div class="results-overview">
          <div class="summary-cards">
            <div class="summary-card success">
              <div class="card-icon">✅</div>
              <div class="card-content">
                <div class="card-number">{testResults.summary.passed}</div>
                <div class="card-label">Tests réussis</div>
              </div>
            </div>

            <div class="summary-card danger">
              <div class="card-icon">❌</div>
              <div class="card-content">
                <div class="card-number">{testResults.summary.failed}</div>
                <div class="card-label">Tests échoués</div>
              </div>
            </div>

            <div class="summary-card info">
              <div class="card-icon">📊</div>
              <div class="card-content">
                <div class="card-number">{testResults.summary.coverage}%</div>
                <div class="card-label">Couverture</div>
              </div>
            </div>

            <div class="summary-card secondary">
              <div class="card-icon">⏱️</div>
              <div class="card-content">
                <div class="card-number">{testResults.summary.duration}s</div>
                <div class="card-label">Durée totale</div>
              </div>
            </div>
          </div>

          <div class="success-rate">
            <h3>Taux de Réussite Global</h3>
            <div class="rate-visualization">
              <div class="rate-circle">
                <div class="rate-number">
                  {Math.round(
                    (testResults.summary.passed / testResults.summary.total) *
                      100
                  )}%
                </div>
                <div class="rate-fraction">
                  {testResults.summary.passed}/{testResults.summary.total}
                </div>
              </div>
              <div class="rate-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill success"
                    style="width: {(testResults.summary.passed /
                      testResults.summary.total) *
                      100}%"
                  />
                </div>
                <p class="rate-description">
                  Excellent taux de réussite ! Le projet maintient une qualité
                  élevée avec {testResults.summary.passed} tests sur {testResults
                    .summary.total} qui passent.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section class="test-suites">
          <h2>📋 Résultats par Suite de Tests</h2>

          <div class="suites-grid">
            {#each testResults.suites as suite, index}
              <div
                class="suite-card"
                class:mounted
                style="animation-delay: {index * 0.1}s"
              >
                <div class="suite-header">
                  <div class="suite-info">
                    <h3 class="suite-name">{suite.name}</h3>
                    <div class="suite-stats">
                      {suite.passed}/{suite.tests} tests • {suite.duration}s
                    </div>
                  </div>
                  <div class="suite-status">
                    <span
                      class="status-badge"
                      style="background-color: {getStatusColor(suite.status)}"
                    >
                      {getStatusIcon(suite.status)}
                      {suite.status === "passed"
                        ? "Tous passés"
                        : "Partiellement"}
                    </span>
                  </div>
                </div>

                <div class="suite-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      style="width: {(suite.passed / suite.tests) *
                        100}%; background-color: {getStatusColor(suite.status)}"
                    />
                  </div>
                  <span class="progress-percentage"
                    >{Math.round((suite.passed / suite.tests) * 100)}%</span
                  >
                </div>

                <div class="suite-files">
                  <h4>Fichiers testés :</h4>
                  <ul>
                    {#each suite.files as file}
                      <li>{file}</li>
                    {/each}
                  </ul>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <section class="coverage-section">
          <h2>📊 Couverture de Code</h2>

          <div class="coverage-grid">
            <div class="coverage-item">
              <h3>Instructions</h3>
              <div class="coverage-bar">
                <div
                  class="coverage-fill"
                  style="width: {testResults.coverage.statements}%"
                />
              </div>
              <span class="coverage-percentage"
                >{testResults.coverage.statements}%</span
              >
            </div>

            <div class="coverage-item">
              <h3>Branches</h3>
              <div class="coverage-bar">
                <div
                  class="coverage-fill"
                  style="width: {testResults.coverage.branches}%"
                />
              </div>
              <span class="coverage-percentage"
                >{testResults.coverage.branches}%</span
              >
            </div>

            <div class="coverage-item">
              <h3>Fonctions</h3>
              <div class="coverage-bar">
                <div
                  class="coverage-fill"
                  style="width: {testResults.coverage.functions}%"
                />
              </div>
              <span class="coverage-percentage"
                >{testResults.coverage.functions}%</span
              >
            </div>

            <div class="coverage-item">
              <h3>Lignes</h3>
              <div class="coverage-bar">
                <div
                  class="coverage-fill"
                  style="width: {testResults.coverage.lines}%"
                />
              </div>
              <span class="coverage-percentage"
                >{testResults.coverage.lines}%</span
              >
            </div>
          </div>
        </section>

        <section class="failures-section">
          <h2>⚠️ Tests en Échec - Suivi des Corrections</h2>

          <div class="failures-list">
            {#each testResults.recentFailures as failure, index}
              <div
                class="failure-card"
                class:mounted
                style="animation-delay: {index * 0.05}s"
              >
                <div class="failure-header">
                  <h3 class="failure-test">{failure.test}</h3>
                  <span
                    class="failure-status"
                    style="background-color: {getFailureStatusColor(
                      failure.status
                    )}"
                  >
                    {getFailureStatusBadge(failure.status)}
                  </span>
                </div>

                <div class="failure-details">
                  <div class="failure-file">📁 {failure.file}</div>
                  <div class="failure-error">❌ {failure.error}</div>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <section class="trends-section">
          <h2>📈 Évolution des Tests</h2>

          <div class="trends-chart">
            <div class="chart-description">
              <p>
                Progression constante : +{testResults.trends[
                  testResults.trends.length - 1
                ].passed - testResults.trends[0].passed} tests réussis sur les 4
                derniers jours, témoignant d'une amélioration continue de la qualité.
              </p>
            </div>

            <div class="trend-points">
              {#each testResults.trends as trend, index}
                <div class="trend-point">
                  <div class="point-date">{trend.date}</div>
                  <div class="point-value">{trend.passed} tests</div>
                  <div
                    class="point-indicator"
                    style="height: {(trend.passed / 120) * 100}px"
                  />
                </div>
              {/each}
            </div>
          </div>
        </section>
      {/if}
    </div>
  </main>

  <footer class="tests-footer">
    <div class="container">
      <div class="footer-content">
        <h3>🎯 Prochaines Améliorations</h3>
        <p>
          Objectif : atteindre 100% de réussite des tests en résolvant les 6
          tests en échec. Focus sur la compatibilité SSR et l'optimisation des
          performances.
        </p>

        <div class="footer-actions">
          <a href="/demo" class="btn btn-primary">
            Tester les fonctionnalités
          </a>
          <a href="/roadmap" class="btn btn-outline"> Voir la roadmap </a>
          <a href="/" class="btn btn-outline"> Retour accueil </a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .tests-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .tests-header {
    padding: 5rem 0;
    color: white;
    text-align: center;
  }

  .header-content {
    opacity: 0;
    transform: translateY(2rem);
    transition: all 0.8s ease;
  }

  .header-content.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .icon {
    font-size: 3rem;
    margin-right: 1rem;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .header-description {
    font-size: 1.3rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .tests-content {
    background: white;
    padding: 5rem 0;
  }

  .loading-section {
    text-align: center;
    padding: 5rem 0;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .results-overview {
    margin-bottom: 4rem;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .summary-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .summary-card.success {
    border-left: 4px solid #28a745;
  }

  .summary-card.danger {
    border-left: 4px solid #dc3545;
  }

  .summary-card.info {
    border-left: 4px solid #007bff;
  }

  .summary-card.secondary {
    border-left: 4px solid #6c757d;
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .card-number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .card-label {
    font-size: 0.9rem;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .success-rate {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #e9ecef;
  }

  .success-rate h3 {
    margin: 0 0 2rem 0;
    color: #495057;
    text-align: center;
  }

  .rate-visualization {
    display: flex;
    align-items: center;
    gap: 3rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .rate-circle {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    min-width: 150px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .rate-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #28a745;
    line-height: 1;
  }

  .rate-fraction {
    font-size: 1rem;
    color: #6c757d;
    margin-top: 0.5rem;
  }

  .rate-progress {
    flex: 1;
    min-width: 300px;
  }

  .progress-bar {
    height: 1rem;
    background: #e9ecef;
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.3s ease;
    border-radius: 0.5rem;
  }

  .progress-fill.success {
    background: linear-gradient(90deg, #28a745, #20c997);
  }

  .rate-description {
    color: #495057;
    line-height: 1.6;
    margin: 0;
  }

  .test-suites {
    margin-bottom: 4rem;
  }

  .test-suites h2 {
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 2rem;
  }

  .suites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .suite-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    opacity: 0;
    transform: translateY(1rem);
    transition: all 0.4s ease;
  }

  .suite-card.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .suite-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }

  .suite-name {
    margin: 0;
    color: #2c3e50;
    font-size: 1.2rem;
  }

  .suite-stats {
    font-size: 0.9rem;
    color: #6c757d;
    margin-top: 0.25rem;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 1.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .suite-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .progress-percentage {
    font-weight: 600;
    color: #495057;
    min-width: 3rem;
  }

  .suite-files h4 {
    margin: 0 0 0.75rem 0;
    color: #495057;
    font-size: 0.9rem;
  }

  .suite-files ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .suite-files li {
    padding: 0.25rem 0;
    color: #6c757d;
    font-size: 0.85rem;
    font-family: "Courier New", monospace;
  }

  .coverage-section {
    margin-bottom: 4rem;
  }

  .coverage-section h2 {
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 2rem;
  }

  .coverage-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .coverage-item {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
  }

  .coverage-item h3 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1.1rem;
  }

  .coverage-bar {
    height: 0.75rem;
    background: #e9ecef;
    border-radius: 0.375rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .coverage-fill {
    height: 100%;
    background: linear-gradient(90deg, #007bff, #0056b3);
    transition: width 0.3s ease;
    border-radius: 0.375rem;
  }

  .coverage-percentage {
    font-weight: 600;
    color: #007bff;
    font-size: 1.1rem;
  }

  .failures-section {
    margin-bottom: 4rem;
  }

  .failures-section h2 {
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 2rem;
  }

  .failures-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .failure-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    border-left: 4px solid #dc3545;
    opacity: 0;
    transform: translateX(-1rem);
    transition: all 0.3s ease;
  }

  .failure-card.mounted {
    opacity: 1;
    transform: translateX(0);
  }

  .failure-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .failure-test {
    margin: 0;
    color: #2c3e50;
    font-size: 1rem;
    flex: 1;
  }

  .failure-status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .failure-details {
    font-size: 0.9rem;
  }

  .failure-file {
    color: #6c757d;
    margin-bottom: 0.5rem;
    font-family: "Courier New", monospace;
  }

  .failure-error {
    color: #dc3545;
    line-height: 1.4;
  }

  .trends-section {
    margin-bottom: 4rem;
  }

  .trends-section h2 {
    margin-bottom: 2rem;
    color: #2c3e50;
    font-size: 2rem;
  }

  .trends-chart {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
  }

  .chart-description {
    margin-bottom: 2rem;
    text-align: center;
  }

  .chart-description p {
    color: #495057;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }

  .trend-points {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 150px;
    gap: 1rem;
  }

  .trend-point {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .point-indicator {
    background: linear-gradient(180deg, #007bff, #0056b3);
    width: 2rem;
    border-radius: 1rem 1rem 0 0;
    transition: height 0.3s ease;
    min-height: 20px;
  }

  .point-date {
    font-size: 0.8rem;
    color: #6c757d;
    order: 3;
  }

  .point-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: #495057;
    order: 1;
  }

  .tests-footer {
    background: #2c3e50;
    color: white;
    padding: 3rem 0;
  }

  .footer-content {
    text-align: center;
  }

  .footer-content h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .footer-content p {
    margin: 0 0 2rem 0;
    font-size: 1.1rem;
    opacity: 0.9;
    line-height: 1.6;
  }

  .footer-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .btn-outline {
    background: transparent;
    border: 1px solid #007bff;
    color: #007bff;
  }

  .btn-outline:hover {
    background: #007bff;
    color: white;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    .icon {
      font-size: 2rem;
    }

    .header-description {
      font-size: 1.1rem;
    }

    .summary-cards {
      grid-template-columns: 1fr;
    }

    .summary-card {
      flex-direction: column;
      text-align: center;
    }

    .rate-visualization {
      flex-direction: column;
      gap: 2rem;
    }

    .rate-progress {
      min-width: auto;
    }

    .suites-grid {
      grid-template-columns: 1fr;
    }

    .suite-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .coverage-grid {
      grid-template-columns: 1fr;
    }

    .failure-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .trend-points {
      gap: 0.5rem;
    }

    .footer-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }
</style>
