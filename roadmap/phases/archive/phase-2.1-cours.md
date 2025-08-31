# 📚 Phase 2.1 : Squelette Navigation Cours (UX)

> **Objectif** : Créer la structure de navigation complète pour accéder aux cours par matière et niveau, avec une UX intuitive et cohérente.

---

## 🎯 **Vue d'Ensemble**

### **Contexte**

Actuellement, notre application a une interface dynamique Firebase mais manque de **structure de navigation claire** pour permettre aux utilisateurs d'accéder facilement aux cours par matière et niveau. Nous devons créer un **squelette UX complet** similaire à l'exemple FunRevis.

### **Inspiration UX**

Basé sur : https://funrevis.web.app/pages/mathematiques/index.html

- Navigation par matière → niveau → compétences
- Interface claire avec progression visuelle
- Breadcrumbs et navigation contextuelle
- Design responsive et accessible

### **Objectifs**

- **Navigation hiérarchique** : Matière → Niveau → Compétences → Cours
- **Interface cohérente** sur toutes les pages
- **Breadcrumbs intelligents** pour orientation utilisateur
- **États visuels** (disponible, bientôt, en cours, terminé)
- **Responsive design** pour mobile et desktop

---

## 📋 **Plan d'Exécution**

### **🕐 Durée Estimée** : 1-2 jours

### **⚡ Pré-requis** : Phase 2 (Interface dynamique Firebase) terminée

---

## 🛠️ **Étape 2.1.1 : Structure de Routes Hiérarchiques (2h)**

### **Objectif** : Définir l'architecture de navigation et créer les routes

#### **[FILE]** Créer la structure de routes dans `src/routes/`

```
src/routes/
├── +layout.svelte (navigation globale)
├── +page.svelte (homepage existante)
├── [matiere]/
│   ├── +layout.svelte (layout matière)
│   ├── +page.svelte (page matière - liste niveaux)
│   └── [niveau]/
│       ├── +layout.svelte (layout niveau)
│       ├── +page.svelte (page niveau - liste compétences)
│       └── [competence]/
│           └── +page.svelte (page cours individuel)
```

#### **[FILE]** Créer `src/routes/[matiere]/+layout.svelte`

```svelte
<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { getSubject } from "$lib/firebase/subjects.js";
  import Breadcrumbs from "$lib/components/navigation/Breadcrumbs.svelte";
  import MatiereHeader from "$lib/components/navigation/MatiereHeader.svelte";

  export let data;

  $: matiere = data.matiere;
  $: currentPath = $page.url.pathname;
</script>

<div class="matiere-layout">
  <Breadcrumbs {currentPath} {matiere} />

  <MatiereHeader
    {matiere}
    totalCompetences={data.stats?.totalCompetences || 0}
    totalCours={data.stats?.totalCours || 0}
  />

  <main class="matiere-content">
    <slot />
  </main>
</div>

<style>
  .matiere-layout {
    min-height: 100vh;
    background: linear-gradient(
      135deg,
      var(--matiere-color, #667eea) 0%,
      var(--matiere-color-dark, #764ba2) 100%
    );
  }

  .matiere-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .matiere-content {
      padding: 1rem;
    }
  }
</style>
```

#### **[FILE]** Créer `src/routes/[matiere]/+layout.ts`

```typescript
import { error } from "@sveltejs/kit";
import { getSubject, getSubjectStats } from "$lib/firebase/subjects.js";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params }) => {
  try {
    const { matiere } = params;

    // Vérifier que la matière existe
    const matiereData = await getSubject(matiere);
    if (!matiereData) {
      throw error(404, `Matière "${matiere}" non trouvée`);
    }

    // Récupérer les statistiques
    const stats = await getSubjectStats(matiere);

    return {
      matiere: matiereData,
      stats,
    };
  } catch (err) {
    console.error("Erreur chargement matière:", err);
    throw error(500, "Erreur lors du chargement de la matière");
  }
};
```

#### **[FILE]** Créer `src/routes/[matiere]/+page.svelte`

```svelte
<script lang="ts">
  import { goto } from "$app/navigation";
  import LevelCard from "$lib/components/courses/LevelCard.svelte";
  import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";

  export let data;

  $: matiere = data.matiere;
  $: levels = data.levels || [];
  $: isLoading = data.isLoading || false;

  function navigateToLevel(niveau: string) {
    goto(`/${matiere.id}/${niveau}`);
  }
</script>

<svelte:head>
  <title>{matiere.name} - Tous les niveaux | FunLearning</title>
  <meta
    name="description"
    content="Découvrez tous les cours de {matiere.name} du collège : 6ème, 5ème, 4ème, 3ème"
  />
</svelte:head>

<div class="matiere-page">
  <div class="intro-section">
    <h1>📐 {matiere.name}</h1>
    <p class="matiere-description">{matiere.description}</p>

    <div class="matiere-stats">
      <div class="stat">
        <span class="stat-number">{data.stats?.totalCompetences || 0}</span>
        <span class="stat-label">Compétences</span>
      </div>
      <div class="stat">
        <span class="stat-number">{data.stats?.totalCours || 0}</span>
        <span class="stat-label">Cours</span>
      </div>
      <div class="stat">
        <span class="stat-number">{levels.length}</span>
        <span class="stat-label">Niveaux</span>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="loading-container">
      <LoadingSpinner />
      <p>Chargement des niveaux...</p>
    </div>
  {:else}
    <div class="levels-grid">
      {#each levels as level (level.id)}
        <LevelCard
          {level}
          matiere={matiere.id}
          on:click={() => navigateToLevel(level.id)}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .matiere-page {
    color: white;
  }

  .intro-section {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }

  .intro-section h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .matiere-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }

  .matiere-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.5rem;
  }

  .levels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: white;
  }

  @media (max-width: 768px) {
    .intro-section h1 {
      font-size: 2rem;
    }

    .matiere-stats {
      gap: 2rem;
    }

    .levels-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
```

---

## 🛠️ **Étape 2.1.2 : Composants de Navigation (2h)**

### **Objectif** : Créer les composants réutilisables de navigation

#### **[FILE]** Créer `src/lib/components/navigation/Breadcrumbs.svelte`

```svelte
<script lang="ts">
  import { page } from "$app/stores";

  export let currentPath: string;
  export let matiere: any = null;
  export let niveau: string = "";
  export let competence: any = null;

  interface BreadcrumbItem {
    label: string;
    href: string;
    icon?: string;
  }

  $: breadcrumbs = generateBreadcrumbs(
    currentPath,
    matiere,
    niveau,
    competence
  );

  function generateBreadcrumbs(
    path: string,
    matiere: any,
    niveau: string,
    competence: any
  ): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [
      { label: "Accueil", href: "/", icon: "🏠" },
    ];

    if (matiere) {
      items.push({
        label: matiere.name,
        href: `/${matiere.id}`,
        icon: matiere.icon || "📚",
      });
    }

    if (niveau) {
      items.push({
        label: niveau.charAt(0).toUpperCase() + niveau.slice(1),
        href: `/${matiere.id}/${niveau}`,
        icon: "🎓",
      });
    }

    if (competence) {
      items.push({
        label: competence.titre,
        href: `/${matiere.id}/${niveau}/${competence.id}`,
        icon: "📖",
      });
    }

    return items;
  }
</script>

<nav class="breadcrumbs" aria-label="Fil d'Ariane">
  <ol class="breadcrumb-list">
    {#each breadcrumbs as item, index (item.href)}
      <li class="breadcrumb-item">
        {#if index < breadcrumbs.length - 1}
          <a href={item.href} class="breadcrumb-link">
            {#if item.icon}
              <span class="breadcrumb-icon">{item.icon}</span>
            {/if}
            {item.label}
          </a>
          <span class="breadcrumb-separator">→</span>
        {:else}
          <span class="breadcrumb-current">
            {#if item.icon}
              <span class="breadcrumb-icon">{item.icon}</span>
            {/if}
            {item.label}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumbs {
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .breadcrumb-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .breadcrumb-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .breadcrumb-current {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: white;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
  }

  .breadcrumb-separator {
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0.25rem;
  }

  .breadcrumb-icon {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .breadcrumbs {
      padding: 0.75rem 1rem;
    }

    .breadcrumb-list {
      font-size: 0.8rem;
    }

    .breadcrumb-icon {
      font-size: 0.9rem;
    }
  }
</style>
```

#### **[FILE]** Créer `src/lib/components/navigation/MatiereHeader.svelte`

```svelte
<script lang="ts">
  export let matiere: any;
  export let totalCompetences: number = 0;
  export let totalCours: number = 0;
  export let showStats: boolean = true;
</script>

<header class="matiere-header" style="--matiere-color: {matiere.color}">
  <div class="header-background">
    <div class="header-pattern" />
  </div>

  <div class="header-content">
    <div class="matiere-info">
      <div class="matiere-icon">
        <i class={matiere.icon || "fas fa-book"} />
      </div>
      <div class="matiere-details">
        <h1 class="matiere-title">{matiere.name}</h1>
        <p class="matiere-subtitle">{matiere.description}</p>
      </div>
    </div>

    {#if showStats}
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-value">{totalCompetences}</div>
          <div class="stat-label">Compétences</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{totalCours}</div>
          <div class="stat-label">Cours</div>
        </div>
      </div>
    {/if}
  </div>
</header>

<style>
  .matiere-header {
    position: relative;
    padding: 2rem;
    color: white;
    overflow: hidden;
  }

  .header-background {
    position: absolute;
    inset: 0;
    background: var(--matiere-color);
    opacity: 0.9;
  }

  .header-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
        circle at 20% 80%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 30%
      ), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent
          30%);
  }

  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .matiere-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .matiere-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .matiere-icon i {
    font-size: 2.5rem;
  }

  .matiere-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
  }

  .matiere-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
    line-height: 1.4;
  }

  .header-stats {
    display: flex;
    gap: 1rem;
  }

  .stat-card {
    text-align: center;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    .matiere-header {
      padding: 1.5rem 1rem;
    }

    .header-content {
      flex-direction: column;
      gap: 2rem;
      text-align: center;
    }

    .matiere-info {
      flex-direction: column;
      gap: 1rem;
    }

    .matiere-icon {
      width: 60px;
      height: 60px;
    }

    .matiere-icon i {
      font-size: 2rem;
    }

    .matiere-title {
      font-size: 2rem;
    }

    .header-stats {
      flex-direction: row;
      justify-content: center;
    }
  }
</style>
```

#### **[FILE]** Créer `src/lib/components/courses/LevelCard.svelte`

```svelte
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let level: any;
  export let matiere: string;

  const dispatch = createEventDispatcher();

  $: isAvailable = level.competencesCount > 0;
  $: progressPercentage = level.progress || 0;

  function handleClick() {
    if (isAvailable) {
      dispatch("click");
    }
  }
</script>

<div
  class="level-card"
  class:available={isAvailable}
  class:disabled={!isAvailable}
  on:click={handleClick}
  on:keydown={(e) => e.key === "Enter" && handleClick()}
  role="button"
  tabindex={isAvailable ? 0 : -1}
  aria-label="Accéder aux cours de {level.name}"
>
  <div class="card-header">
    <div class="level-badge">
      <span class="level-icon">🎓</span>
      <span class="level-name">{level.name}</span>
    </div>

    <div class="status-indicator">
      {#if isAvailable}
        <span class="status available">Disponible</span>
      {:else}
        <span class="status coming-soon">Bientôt</span>
      {/if}
    </div>
  </div>

  <div class="card-content">
    <h3 class="level-title">Programme complet de {level.name.toLowerCase()}</h3>

    <div class="level-stats">
      <div class="stat">
        <i class="fas fa-graduation-cap" />
        <span>{level.competencesCount || 0} compétences</span>
      </div>
      <div class="stat">
        <i class="fas fa-clock" />
        <span>{level.dureeEstimee || 0}h de cours</span>
      </div>
      <div class="stat">
        <i class="fas fa-book" />
        <span>{level.themesCount || 0} thèmes</span>
      </div>
    </div>

    {#if isAvailable && progressPercentage > 0}
      <div class="progress-section">
        <div class="progress-label">
          <span>Progression</span>
          <span>{progressPercentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progressPercentage}%" />
        </div>
      </div>
    {/if}
  </div>

  <div class="card-footer">
    {#if isAvailable}
      <span class="action-text"
        >Commencer les cours <i class="fas fa-arrow-right" /></span
      >
    {:else}
      <span class="action-text disabled">Contenu en préparation</span>
    {/if}
  </div>
</div>

<style>
  .level-card {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .level-card.available:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .level-card.disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .level-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .level-icon {
    font-size: 1.5rem;
  }

  .level-name {
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-indicator {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status.available {
    background: #4ade80;
    color: white;
  }

  .status.coming-soon {
    background: #fbbf24;
    color: #92400e;
  }

  .level-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .level-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .stat i {
    width: 16px;
    color: #888;
  }

  .progress-section {
    margin-top: 1rem;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .progress-bar {
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .card-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .action-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #007bff;
    font-size: 0.9rem;
  }

  .action-text.disabled {
    color: #9ca3af;
  }

  .action-text i {
    transition: transform 0.2s ease;
  }

  .level-card.available:hover .action-text i {
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    .level-card {
      padding: 1rem;
    }

    .card-header {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .level-title {
      font-size: 1.1rem;
    }
  }
</style>
```

---

## 🛠️ **Étape 2.1.3 : Pages de Niveau et Compétences (3h)**

### **Objectif** : Créer les pages pour naviguer vers les compétences et cours

#### **[FILE]** Créer `src/routes/[matiere]/[niveau]/+page.svelte`

```svelte
<script lang="ts">
  import { goto } from "$app/navigation";
  import CompetenceCard from "$lib/components/courses/CompetenceCard.svelte";
  import ThemeSection from "$lib/components/courses/ThemeSection.svelte";
  import LoadingSpinner from "$lib/components/ui/LoadingSpinner.svelte";

  export let data;

  $: matiere = data.matiere;
  $: niveau = data.niveau;
  $: themes = data.themes || [];
  $: competences = data.competences || [];
  $: isLoading = data.isLoading || false;

  function navigateToCompetence(competenceId: string) {
    goto(`/${matiere.id}/${niveau}/${competenceId}`);
  }

  // Grouper les compétences par thème
  $: competencesByTheme = competences.reduce((acc, competence) => {
    const themeId = competence.theme || "general";
    if (!acc[themeId]) acc[themeId] = [];
    acc[themeId].push(competence);
    return acc;
  }, {});
</script>

<svelte:head>
  <title>{niveau} {matiere.name} | FunLearning</title>
  <meta
    name="description"
    content="Cours de {matiere.name} niveau {niveau} : toutes les compétences et exercices"
  />
</svelte:head>

<div class="niveau-page">
  <div class="niveau-intro">
    <h1>🎓 {niveau} - {matiere.name}</h1>
    <p class="niveau-description">
      Découvrez toutes les compétences à maîtriser en {matiere.name} niveau {niveau}
    </p>

    <div class="niveau-stats">
      <div class="stat">
        <span class="stat-number">{competences.length}</span>
        <span class="stat-label">Compétences</span>
      </div>
      <div class="stat">
        <span class="stat-number">{themes.length}</span>
        <span class="stat-label">Thèmes</span>
      </div>
      <div class="stat">
        <span class="stat-number">{data.totalExercices || 0}</span>
        <span class="stat-label">Exercices</span>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="loading-container">
      <LoadingSpinner />
      <p>Chargement des compétences...</p>
    </div>
  {:else}
    <div class="content-section">
      {#each themes as theme (theme.id)}
        <ThemeSection
          {theme}
          competences={competencesByTheme[theme.id] || []}
          on:competence-click={(e) =>
            navigateToCompetence(e.detail.competenceId)}
        />
      {/each}

      <!-- Compétences sans thème spécifique -->
      {#if competencesByTheme.general?.length > 0}
        <ThemeSection
          theme={{
            id: "general",
            titre: "Compétences générales",
            description: "Autres compétences importantes",
          }}
          competences={competencesByTheme.general}
          on:competence-click={(e) =>
            navigateToCompetence(e.detail.competenceId)}
        />
      {/if}
    </div>
  {/if}
</div>

<style>
  .niveau-page {
    color: white;
  }

  .niveau-intro {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }

  .niveau-intro h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .niveau-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }

  .niveau-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.5rem;
  }

  .content-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: white;
  }

  @media (max-width: 768px) {
    .niveau-intro h1 {
      font-size: 2rem;
    }

    .niveau-stats {
      gap: 2rem;
    }

    .content-section {
      gap: 1.5rem;
    }
  }
</style>
```

#### **[FILE]** Créer `src/lib/components/courses/ThemeSection.svelte`

```svelte
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CompetenceCard from "./CompetenceCard.svelte";

  export let theme: any;
  export let competences: any[] = [];

  const dispatch = createEventDispatcher();

  function handleCompetenceClick(competenceId: string) {
    dispatch("competence-click", { competenceId });
  }
</script>

<section class="theme-section">
  <div class="theme-header">
    <h2 class="theme-title">{theme.titre}</h2>
    <p class="theme-description">{theme.description}</p>
    <div class="theme-meta">
      <span class="theme-duration">
        <i class="fas fa-clock" />
        {theme.dureeEstimee || 0}h
      </span>
      <span class="theme-period">
        <i class="fas fa-calendar" />
        Trimestre {theme.periode || 1}
      </span>
      <span class="theme-competences">
        <i class="fas fa-graduation-cap" />
        {competences.length} compétences
      </span>
    </div>
  </div>

  <div class="competences-grid">
    {#each competences as competence (competence.id)}
      <CompetenceCard
        {competence}
        on:click={() => handleCompetenceClick(competence.id)}
      />
    {/each}
  </div>
</section>

<style>
  .theme-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .theme-header {
    margin-bottom: 2rem;
  }

  .theme-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: white;
  }

  .theme-description {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .theme-meta {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .theme-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .theme-meta i {
    width: 14px;
  }

  .competences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .theme-section {
      padding: 1.5rem;
    }

    .theme-title {
      font-size: 1.5rem;
    }

    .theme-meta {
      gap: 1rem;
    }

    .competences-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
```

#### **[FILE]** Créer `src/lib/components/courses/CompetenceCard.svelte`

```svelte
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let competence: any;

  const dispatch = createEventDispatcher();

  $: difficultyColor = getDifficultyColor(competence.niveauDifficulte || 1);
  $: estimatedTime = competence.dureeEstimee || 30;
  $: exercicesCount = competence.exercices?.length || 0;

  function getDifficultyColor(niveau: number): string {
    const colors = {
      1: "#4ade80", // Facile - Vert
      2: "#60a5fa", // Moyen - Bleu
      3: "#fbbf24", // Difficile - Jaune
      4: "#f97316", // Très difficile - Orange
      5: "#ef4444", // Expert - Rouge
    };
    return colors[niveau] || colors[1];
  }

  function getDifficultyLabel(niveau: number): string {
    const labels = {
      1: "Facile",
      2: "Moyen",
      3: "Difficile",
      4: "Très difficile",
      5: "Expert",
    };
    return labels[niveau] || "Facile";
  }

  function handleClick() {
    dispatch("click");
  }
</script>

<div
  class="competence-card"
  on:click={handleClick}
  on:keydown={(e) => e.key === "Enter" && handleClick()}
  role="button"
  tabindex="0"
  aria-label="Accéder au cours : {competence.titre}"
>
  <div class="card-header">
    <div class="competence-title">{competence.titre}</div>
    <div class="difficulty-badge" style="background-color: {difficultyColor}">
      {getDifficultyLabel(competence.niveauDifficulte || 1)}
    </div>
  </div>

  <div class="card-content">
    <p class="competence-description">{competence.description}</p>

    <div class="competence-meta">
      <div class="meta-item">
        <i class="fas fa-clock" />
        <span>{estimatedTime} min</span>
      </div>
      <div class="meta-item">
        <i class="fas fa-tasks" />
        <span>{exercicesCount} exercices</span>
      </div>
      <div class="meta-item">
        <i class="fas fa-graduation-cap" />
        <span>{competence.evaluation?.qcm || 0} QCM</span>
      </div>
    </div>

    {#if competence.objectifs?.length > 0}
      <div class="objectifs-preview">
        <strong>Objectifs :</strong>
        <ul>
          {#each competence.objectifs.slice(0, 2) as objectif}
            <li>{objectif}</li>
          {/each}
          {#if competence.objectifs.length > 2}
            <li class="more">+{competence.objectifs.length - 2} autres...</li>
          {/if}
        </ul>
      </div>
    {/if}
  </div>

  <div class="card-footer">
    <span class="action-text">
      Commencer le cours <i class="fas fa-play" />
    </span>
  </div>
</div>

<style>
  .competence-card {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .competence-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .competence-title {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
    flex: 1;
  }

  .difficulty-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  .competence-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .competence-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #666;
  }

  .meta-item i {
    width: 12px;
    color: #888;
  }

  .objectifs-preview {
    font-size: 0.85rem;
    color: #555;
  }

  .objectifs-preview strong {
    color: #333;
    margin-bottom: 0.5rem;
    display: block;
  }

  .objectifs-preview ul {
    margin: 0.5rem 0 0 1rem;
    padding: 0;
  }

  .objectifs-preview li {
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .objectifs-preview li.more {
    color: #888;
    font-style: italic;
  }

  .card-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .action-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #007bff;
    font-size: 0.9rem;
  }

  .action-text i {
    transition: transform 0.2s ease;
  }

  .competence-card:hover .action-text i {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    .competence-card {
      padding: 1rem;
    }

    .card-header {
      flex-direction: column;
      gap: 0.5rem;
    }

    .competence-meta {
      gap: 0.75rem;
    }
  }
</style>
```

---

## 🛠️ **Étape 2.1.4 : Services Firebase Étendus (1h)**

### **Objectif** : Étendre les services Firebase pour supporter la navigation

#### **[FILE]** Mettre à jour `src/lib/firebase/subjects.ts`

```typescript
// Ajouter ces fonctions à subjects.ts existant

/**
 * Récupère les statistiques d'une matière
 */
export const getSubjectStats = async (matiereId: string) => {
  try {
    const cacheKey = `stats:${matiereId}`;

    // Vérifier le cache
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    let totalCompetences = 0;
    let totalCours = 0;
    let totalExercices = 0;

    // Parcourir tous les niveaux
    const levelsSnapshot = await getDocs(
      collection(db, "subjects", matiereId, "levels")
    );

    for (const levelDoc of levelsSnapshot.docs) {
      const competencesSnapshot = await getDocs(
        collection(
          db,
          "subjects",
          matiereId,
          "levels",
          levelDoc.id,
          "competences"
        )
      );

      totalCompetences += competencesSnapshot.docs.length;
      totalCours += competencesSnapshot.docs.length; // 1 cours par compétence

      // Compter les exercices
      competencesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.exercices) {
          totalExercices += data.exercices.length;
        }
      });
    }

    const stats = {
      totalCompetences,
      totalCours,
      totalExercices,
      lastUpdated: new Date().toISOString(),
    };

    // Mettre en cache
    cache.set(cacheKey, stats);

    return stats;
  } catch (error) {
    console.error("Erreur récupération stats matière:", error);
    return {
      totalCompetences: 0,
      totalCours: 0,
      totalExercices: 0,
    };
  }
};

/**
 * Récupère les niveaux disponibles pour une matière
 */
export const getSubjectLevels = async (matiereId: string) => {
  try {
    const cacheKey = `levels:${matiereId}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const levelsSnapshot = await getDocs(
      collection(db, "subjects", matiereId, "levels")
    );

    const levels = [];

    for (const levelDoc of levelsSnapshot.docs) {
      const levelData = levelDoc.data();

      // Compter les compétences pour ce niveau
      const competencesSnapshot = await getDocs(
        collection(
          db,
          "subjects",
          matiereId,
          "levels",
          levelDoc.id,
          "competences"
        )
      );

      levels.push({
        id: levelDoc.id,
        name: levelData.name || levelDoc.id,
        ...levelData,
        competencesCount: competencesSnapshot.docs.length,
        themesCount: levelData.themes?.length || 0,
      });
    }

    // Trier par ordre logique (6eme, 5eme, 4eme, 3eme)
    const orderMap = { "6eme": 1, "5eme": 2, "4eme": 3, "3eme": 4 };
    levels.sort((a, b) => (orderMap[a.id] || 99) - (orderMap[b.id] || 99));

    cache.set(cacheKey, levels);
    return levels;
  } catch (error) {
    console.error("Erreur récupération niveaux:", error);
    return [];
  }
};

/**
 * Récupère les compétences d'un niveau spécifique
 */
export const getLevelCompetences = async (
  matiereId: string,
  niveau: string
) => {
  try {
    const cacheKey = `competences:${matiereId}:${niveau}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const competencesSnapshot = await getDocs(
      collection(db, "subjects", matiereId, "levels", niveau, "competences")
    );

    const competences = competencesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    cache.set(cacheKey, competences);
    return competences;
  } catch (error) {
    console.error("Erreur récupération compétences:", error);
    return [];
  }
};

/**
 * Récupère une compétence spécifique
 */
export const getCompetence = async (
  matiereId: string,
  niveau: string,
  competenceId: string
) => {
  try {
    const docRef = doc(
      db,
      "subjects",
      matiereId,
      "levels",
      niveau,
      "competences",
      competenceId
    );
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Erreur récupération compétence:", error);
    return null;
  }
};
```

---

## 🧪 **Étape 2.1.5 : Tests et Validation (1h)**

### **Objectif** : Tester la navigation complète

#### **[CMD]** Tester l'application

```bash
npm run dev
```

#### **[TEST]** Navigation manuelle

1. Accéder à http://localhost:5173/
2. Cliquer sur une matière (ex: mathematiques)
3. Vérifier l'affichage de la page matière avec niveaux
4. Cliquer sur un niveau disponible (ex: 6eme)
5. Vérifier l'affichage des compétences par thème
6. Cliquer sur une compétence
7. Vérifier l'affichage du cours

#### **[CHECK]** Points de validation obligatoires

- [ ] **Navigation hiérarchique** fonctionne (Matière → Niveau → Compétence)
- [ ] **Breadcrumbs** s'affichent correctement sur chaque page
- [ ] **États visuels** différencient contenu disponible/indisponible
- [ ] **Design responsive** fonctionne sur mobile et desktop
- [ ] **Performance** acceptable (< 2s par page)
- [ ] **URLs** sont propres et bookmarkables

---

## ✅ **Critères de Validation Phase 2.1**

### **🎯 Objectifs UX**

- [x] **Navigation intuitive** par matière → niveau → compétences
- [x] **Breadcrumbs contextuels** sur toutes les pages
- [x] **États visuels clairs** (disponible, bientôt, en cours)
- [x] **Design cohérent** inspiré de l'exemple FunRevis
- [x] **Responsive design** optimisé mobile et desktop

### **🔧 Objectifs Techniques**

- [x] **Routes hiérarchiques** SvelteKit fonctionnelles
- [x] **Composants réutilisables** de navigation
- [x] **Services Firebase** étendus pour navigation
- [x] **Performance maintenue** avec nouvelle structure
- [x] **SEO optimisé** avec meta tags appropriés

### **📊 Métriques de Succès**

- **Temps de chargement** : < 2 secondes par page
- **Expérience utilisateur** : Navigation fluide et intuitive
- **Accessibilité** : Composants accessibles (ARIA, keyboard)
- **Mobile-first** : Interface adaptée à tous les écrans

---

## 🎉 **Résultats Attendus**

À la fin de cette phase, l'application disposera de :

### **📱 Interface Utilisateur Complète**

- **Navigation hiérarchique** claire et intuitive
- **Pages dédiées** pour chaque niveau d'organisation
- **Composants réutilisables** pour l'écosystème de navigation
- **Design cohérent** avec l'identité visuelle

### **🏗️ Architecture Robuste**

- **Routes SvelteKit** organisées et maintenables
- **Services Firebase** optimisés pour la navigation
- **Composants modulaires** réutilisables
- **Performance optimisée** pour l'expérience utilisateur

### **🎯 Préparation Phase Suivante**

- **Structure prête** pour intégrer le contenu de Phase 2.9
- **Navigation testée** pour supporter 120+ compétences
- **UX validée** pour passage à l'échelle

---

## 🚀 **Prochaines Étapes**

Une fois la Phase 2.1 validée, nous aurons le **squelette UX complet** pour :

1. **Phase 2.9** : Remplir la navigation avec le curriculum complet (120+ compétences)
2. **Phase 3** : Ajouter les exercices interactifs dans les pages cours
3. **Phase 4** : Optimiser l'expérience mobile avec PWA

**🚫 STOP** : Valider complètement la navigation avant Phase 2.9

---

## 📝 **Notes Techniques**

### **⚡ Optimisations UX**

- **Lazy loading** des images et composants lourds
- **Cache intelligent** pour navigation rapide
- **États de chargement** informatifs
- **Transitions fluides** entre pages

### **🎨 Design System**

- **Couleurs par matière** pour identification visuelle
- **Composants cohérents** dans toute l'application
- **Iconographie** claire et signifiante
- **Typographie** lisible et hiérarchisée

### **📱 Responsive Strategy**

- **Mobile-first** design approach
- **Breakpoints** adaptés aux usages éducatifs
- **Touch-friendly** interactions
- **Navigation optimisée** pour petits écrans
