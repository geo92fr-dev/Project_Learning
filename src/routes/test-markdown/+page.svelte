<script lang="ts">
  import { onMount } from "svelte";
  import { contentActions } from "$lib/stores/content";
  import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";
  import { writable } from "svelte/store";
  import type { Matiere } from "$lib/types/content";

  // Create a simple matieres store for this test page
  let matieres = writable<Matiere[]>([]);

  let selectedCourse: any = null;
  let testMarkdown = `# Test du MarkdownRenderer 🧪

## Introduction

Ce composant permet de **rendre du Markdown** de manière sécurisée avec des fonctionnalités avancées.

## Fonctionnalités

### 🔒 Sécurité
- Sanitisation HTML avec DOMPurify
- Protection contre les attaques XSS
- Validation du contenu

### ⚡ Performance
- Cache intelligent
- Rendu optimisé
- Temps de traitement affiché

### 🎨 Interface
- Table des matières automatique
- Métadonnées du contenu
- Design responsive

## Exemples de code

Voici un exemple en JavaScript :

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

Et en Python :

\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`

## Liste de tâches

- [x] Composant créé
- [x] Sécurité implémentée  
- [x] Cache fonctionnel
- [ ] Tests unitaires
- [ ] Documentation complète

## Citation

> "Le code est plus souvent lu qu'écrit" - Guido van Rossum

## Tableau de comparaison

| Fonctionnalité | Avant | Maintenant |
|----------------|-------|------------|
| Sécurité | ❌ | ✅ |
| Cache | ❌ | ✅ |
| TOC | ❌ | ✅ |
| Performance | 🟡 | ✅ |

## Conclusion

Le composant MarkdownRenderer est maintenant **opérationnel** ! 🎉
`;

  onMount(() => {
    contentActions.loadMockData();
  });

  function selectCourse(course: any) {
    selectedCourse = course;
  }

  function clearSelection() {
    selectedCourse = null;
  }
</script>

<svelte:head>
  <title>Test MarkdownRenderer - FunLearning</title>
</svelte:head>

<div class="test-page">
  <header>
    <h1>🧪 Test du composant MarkdownRenderer</h1>
    <p>
      Validation du rendu Markdown avancé avec table des matières et métadonnées
    </p>
  </header>

  <section class="controls">
    <h2>🎛️ Options de test</h2>
    <div class="buttons">
      <button class="test-btn" on:click={clearSelection}>
        📝 Test Markdown brut
      </button>
      {#each $matieres || [] as matiere (matiere.id)}
        <button class="test-btn" on:click={() => selectCourse(matiere)}>
          📖 Test cours: {matiere.nom}
        </button>
      {/each}
    </div>
  </section>

  <section class="demo-section">
    <h2>🎨 Démonstration</h2>

    {#if selectedCourse}
      <div class="demo-header">
        <h3>Mode Cours avec métadonnées</h3>
        <p>Rendu d'un cours complet avec toutes les informations</p>
      </div>
      <MarkdownRenderer
        course={selectedCourse}
        showMeta={true}
        showToc={true}
      />
    {:else}
      <div class="demo-header">
        <h3>Mode Markdown libre</h3>
        <p>Rendu de contenu Markdown avec table des matières</p>
      </div>
      <MarkdownRenderer content={testMarkdown} showMeta={true} showToc={true} />
    {/if}
  </section>

  <section class="features-section">
    <h2>✨ Fonctionnalités testées</h2>
    <div class="features-grid">
      <div class="feature-card">
        <h3>🔒 Sécurité</h3>
        <ul>
          <li>✅ Sanitisation DOMPurify</li>
          <li>✅ Protection XSS</li>
          <li>✅ Tags HTML filtrés</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>📋 Table des matières</h3>
        <ul>
          <li>✅ Extraction automatique</li>
          <li>✅ Navigation fluide</li>
          <li>✅ Hiérarchie respectée</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>⚡ Performance</h3>
        <ul>
          <li>✅ Cache intelligent</li>
          <li>✅ Temps de traitement</li>
          <li>✅ Rendu optimisé</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>🎨 Interface</h3>
        <ul>
          <li>✅ Design responsive</li>
          <li>✅ Coloration syntaxique</li>
          <li>✅ Métadonnées riches</li>
        </ul>
      </div>
    </div>
  </section>
</div>

<style>
  .test-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "Segoe UI", system-ui, sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-radius: 12px;
  }

  header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  header p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin: 0;
  }

  section {
    margin-bottom: 3rem;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 1.8rem;
    color: #374151;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .test-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .test-btn:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  }

  .demo-header {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .demo-header h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.25rem;
  }

  .demo-header p {
    margin: 0;
    color: #6b7280;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .feature-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    background: #fafafa;
  }

  .feature-card h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .feature-card ul {
    margin: 0;
    padding-left: 1rem;
  }

  .feature-card li {
    margin-bottom: 0.5rem;
    color: #4b5563;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .test-page {
      padding: 1rem;
    }

    header h1 {
      font-size: 2rem;
    }

    .buttons {
      flex-direction: column;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
