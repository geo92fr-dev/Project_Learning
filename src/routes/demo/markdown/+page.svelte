<script lang="ts">
  import { onMount } from "svelte";
  import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";
  import {
    markdownToHtml,
    generateSlug,
    estimateReadingTime,
  } from "$lib/utils/content";

  let currentContent = "";
  let contentType = "tutorial";
  let showToc = true;

  const demoContents = {
    tutorial: `# 🎓 Guide d'apprentissage des Mathématiques

## Introduction aux Mathématiques Amusantes

Bienvenue dans notre aventure mathématique ! Dans ce cours, nous allons explorer les concepts fondamentaux des mathématiques de manière ludique et interactive.

### 📊 Qu'allez-vous apprendre ?

- Les bases de l'arithmétique
- La géométrie pratique  
- Les fractions simplifiées
- La résolution de problèmes

## 🔢 Chapitre 1 : Les Nombres

Les nombres sont partout autour de nous ! Observez votre environnement :

> **Astuce pédagogique** : Comptez les objets dans votre chambre pour pratiquer !

### Les différents types de nombres

1. **Nombres entiers** : 0, 1, 2, 3, 4...
2. **Nombres décimaux** : 3.14, 2.5, 0.75...
3. **Fractions** : 1/2, 3/4, 2/3...

### Exercice pratique

Voici un petit exercice de calcul :

\`\`\`python
# Calcul simple en Python
nombre1 = 15
nombre2 = 7
resultat = nombre1 + nombre2
print(f"Le résultat est : {resultat}")
\`\`\`

## 📐 Chapitre 2 : La Géométrie

La géométrie nous aide à comprendre les formes et l'espace.

### Les formes de base

| Forme | Côtés | Angles |
|-------|--------|---------|
| Triangle | 3 | 3 |
| Carré | 4 | 4 droits |
| Cercle | 0 | Infini |

### Formules importantes

- **Aire du carré** : côté × côté
- **Aire du rectangle** : longueur × largeur  
- **Circonférence du cercle** : 2 × π × rayon

## 🎯 Exercices

1. Calculez l'aire d'un carré de 5 cm de côté
2. Trouvez le périmètre d'un rectangle de 8 cm × 3 cm
3. Estimez la circonférence d'un cercle de rayon 4 cm

---

**💡 Conseil** : N'hésitez pas à utiliser une calculatrice pour vérifier vos réponses !

*Temps de lecture estimé : 5 minutes*`,

    exercise: `# 🎯 Exercice : Les Fractions

## Objectif

Apprendre à manipuler les fractions simples et comprendre leur utilité dans la vie quotidienne.

## 📖 Rappel théorique

Une fraction représente une partie d'un tout. Elle s'écrit sous la forme :

\`\`\`
numérateur
─────────
dénominateur
\`\`\`

### Exemples visuels

- **1/2** = la moitié d'une pizza 🍕
- **3/4** = trois quarts d'un gâteau 🎂  
- **2/5** = deux cinquièmes d'une tablette de chocolat 🍫

## ✅ Questions

### Question 1
Quelle fraction représente 3 parts sur 8 parts égales ?

**Réponse** : 3/8

### Question 2
Simplifiez la fraction 6/12

**Étapes** :
1. Trouvez le PGCD de 6 et 12
2. PGCD(6, 12) = 6
3. Divisez numérateur et dénominateur par 6
4. 6÷6 = 1 et 12÷6 = 2

**Réponse** : 1/2

### Question 3
Additionnez 1/4 + 1/4

**Méthode** :
- Même dénominateur → additionnez les numérateurs
- 1 + 1 = 2
- Résultat : 2/4 = 1/2

## 🏆 Défi

Calculez : (2/3) × (3/4)

\`\`\`
Étape 1: Multipliez les numérateurs
2 × 3 = 6

Étape 2: Multipliez les dénominateurs  
3 × 4 = 12

Étape 3: Résultat
6/12 = 1/2
\`\`\`

**Bravo !** 🎉 Vous maîtrisez maintenant les fractions de base.`,

    evaluation: `# 📊 Évaluation : Mathématiques Niveau 6ème

## Informations

- **Durée** : 45 minutes
- **Note** : /20 points
- **Calculatrice** : Autorisée

---

## Partie I : Calculs (8 points)

### Exercice 1 (4 points)
Effectuez les calculs suivants :

a) 247 + 156 = ?  
b) 503 - 287 = ?  
c) 24 × 13 = ?  
d) 144 ÷ 12 = ?

### Exercice 2 (4 points)
Calculez en respectant les priorités :

a) 5 + 3 × 2 = ?  
b) (8 + 4) × 3 = ?  
c) 20 - 2 × 5 = ?  
d) 15 ÷ 3 + 4 = ?

## Partie II : Géométrie (6 points)

### Exercice 3 (3 points)
Un rectangle a pour dimensions :
- Longueur : 12 cm
- Largeur : 7 cm

Calculez :
1. Son périmètre
2. Son aire

### Exercice 4 (3 points)
Nommez les figures géométriques ci-dessous et donnez leurs propriétés principales.

\`\`\`
Figure A: Triangle équilatéral
Figure B: Carré  
Figure C: Cercle
\`\`\`

## Partie III : Problèmes (6 points)

### Exercice 5 (3 points)
Marie achète 3 cahiers à 2,50€ chacun et 2 stylos à 1,20€ chacun.
Combien dépense-t-elle en tout ?

### Exercice 6 (3 points)
Un groupe de 24 élèves doit être réparti en équipes égales.
Proposez 3 façons différentes de faire cette répartition.

---

## Barème

- **18-20** : Excellent 🏆
- **16-17** : Très bien 🎉  
- **14-15** : Bien 👍
- **12-13** : Assez bien 📚
- **10-11** : Passable ⚠️
- **< 10** : Insuffisant 📖

*Bonne chance !* 🍀`,
  };

  $: {
    currentContent = demoContents[contentType as keyof typeof demoContents];
  }

  $: readingTime = currentContent ? estimateReadingTime(currentContent) : 0;
  $: slug = generateSlug("Demo Contenu Markdown");

  onMount(() => {
    currentContent = demoContents.tutorial;
  });
</script>

<svelte:head>
  <title>Démo Système de Contenu - FunLearning</title>
  <meta
    name="description"
    content="Démonstration du système de rendu Markdown avancé de FunLearning"
  />
</svelte:head>

<div class="demo-page">
  <header class="demo-header">
    <div class="container">
      <h1>🎯 Démo Système de Contenu Markdown</h1>
      <p>Découvrez notre système de rendu de contenu éducatif avancé</p>
    </div>
  </header>

  <div class="demo-controls">
    <div class="container">
      <div class="control-section">
        <h3>Type de contenu</h3>
        <div class="content-types">
          <button
            class="type-btn"
            class:active={contentType === "tutorial"}
            on:click={() => (contentType = "tutorial")}
          >
            📚 Cours
          </button>
          <button
            class="type-btn"
            class:active={contentType === "exercise"}
            on:click={() => (contentType = "exercise")}
          >
            🎯 Exercice
          </button>
          <button
            class="type-btn"
            class:active={contentType === "evaluation"}
            on:click={() => (contentType = "evaluation")}
          >
            📊 Évaluation
          </button>
        </div>
      </div>

      <div class="control-section">
        <h3>Options d'affichage</h3>
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={showToc} />
          <span>Afficher la table des matières</span>
        </label>
      </div>

      <div class="content-meta">
        <div class="meta-item">
          <span class="meta-label">Temps de lecture :</span>
          <span class="meta-value">{readingTime} min</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Slug URL :</span>
          <span class="meta-value">{slug}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Mots :</span>
          <span class="meta-value">{currentContent.split(" ").length}</span>
        </div>
      </div>
    </div>
  </div>

  <main class="demo-content">
    <div class="container">
      <div class="content-wrapper">
        <MarkdownRenderer content={currentContent} />
      </div>
    </div>
  </main>

  <footer class="demo-footer">
    <div class="container">
      <div class="features-showcase">
        <h3>🚀 Fonctionnalités du système</h3>
        <div class="features-grid">
          <div class="feature">
            <div class="feature-icon">🔒</div>
            <h4>Sécurisation XSS</h4>
            <p>HTML sanitisé automatiquement</p>
          </div>

          <div class="feature">
            <div class="feature-icon">🎨</div>
            <h4>Coloration syntaxique</h4>
            <p>Code highlighting avec highlight.js</p>
          </div>

          <div class="feature">
            <div class="feature-icon">📑</div>
            <h4>Table des matières</h4>
            <p>Navigation automatique par titres</p>
          </div>

          <div class="feature">
            <div class="feature-icon">⚡</div>
            <h4>Cache intelligent</h4>
            <p>Performance optimisée</p>
          </div>

          <div class="feature">
            <div class="feature-icon">📱</div>
            <h4>Responsive</h4>
            <p>Adapté à tous les écrans</p>
          </div>

          <div class="feature">
            <div class="feature-icon">♿</div>
            <h4>Accessibilité</h4>
            <p>Conforme aux standards WCAG</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .demo-page {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .demo-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 3rem 0;
    text-align: center;
  }

  .demo-header h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .demo-header p {
    margin: 0;
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .demo-controls {
    background: white;
    border-bottom: 1px solid #e9ecef;
    padding: 2rem 0;
  }

  .control-section {
    margin-bottom: 2rem;
  }

  .control-section h3 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1.1rem;
  }

  .content-types {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .type-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid #e9ecef;
    background: white;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .type-btn:hover {
    border-color: #007bff;
    background: #f8f9ff;
  }

  .type-btn.active {
    border-color: #007bff;
    background: #007bff;
    color: white;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    color: #495057;
  }

  .checkbox-label input {
    margin: 0;
  }

  .content-meta {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
    border: 1px solid #e9ecef;
  }

  .meta-item {
    display: flex;
    gap: 0.5rem;
  }

  .meta-label {
    font-weight: 600;
    color: #6c757d;
  }

  .meta-value {
    color: #495057;
    font-family: "SF Mono", Monaco, Consolas, monospace;
    background: white;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    border: 1px solid #dee2e6;
    font-size: 0.875rem;
  }

  .demo-content {
    padding: 3rem 0;
  }

  .content-wrapper {
    background: white;
    border-radius: 1rem;
    padding: 3rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
  }

  .demo-footer {
    background: #2c3e50;
    color: white;
    padding: 3rem 0;
  }

  .features-showcase h3 {
    margin: 0 0 2rem 0;
    text-align: center;
    font-size: 1.5rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .feature {
    text-align: center;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    backdrop-filter: blur(10px);
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .feature h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #ecf0f1;
  }

  .feature p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  :global(.demo-markdown) {
    font-size: 1.1rem;
    line-height: 1.7;
  }

  :global(.demo-markdown h1) {
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
  }

  :global(.demo-markdown h2) {
    color: #34495e;
    margin-top: 2.5rem;
  }

  :global(.demo-markdown blockquote) {
    border-left: 4px solid #f39c12;
    background: #fef9e7;
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
  }

  :global(.demo-markdown code) {
    background: #2c3e50;
    color: #ecf0f1;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
  }

  :global(.demo-markdown pre) {
    background: #2c3e50;
    color: #ecf0f1;
    border-radius: 0.5rem;
    padding: 1.5rem;
    overflow-x: auto;
  }

  :global(.demo-markdown table) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  :global(.demo-markdown th) {
    background: #3498db;
    color: white;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    .demo-header h1 {
      font-size: 2rem;
    }

    .content-wrapper {
      padding: 2rem;
    }

    .content-types {
      flex-direction: column;
    }

    .type-btn {
      width: 100%;
    }

    .content-meta {
      flex-direction: column;
      gap: 1rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
