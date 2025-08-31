# 📚 Phase 3 : Contenu & Markdown (1 semaine) - v1.2

## 📋 **Vue d'Ensemble**

**Objectif** : Système de contenu Markdown avec conversion HTML sécurisée et routes dynamiques  
**Version cible** : v1.2 (plateforme de contenu fonctionnelle)  
**Groupe** : 🏗️ FONDATIONS  
**Prérequis** : Phase 2 (Auth) validée ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### 📝 **Architecture de Contenu**

**Stack de Contenu :**
- **Markdown Processing** : marked.js pour parsing performant
- **Sécurisation** : DOMPurify pour sanitization XSS
- **Syntax Highlighting** : highlight.js pour code samples
- **Routes dynamiques** : SvelteKit avec paramètres typés
- **Types sécurisés** : TypeScript strict pour toutes les entités

**Principes de Conception :**
- **Content as Code** : Contenu versionné et évolutif
- **Sécurité first** : Sanitization obligatoire de tout HTML
- **Performance** : Lazy loading et cache des transformations
- **Évolutivité** : Structure extensible pour tous types de contenu
- **Accessibilité** : Markup sémantique et ARIA

### 🏗️ **Architecture des Données**

**Modèle Hiérarchique :**
```
Matières → Niveaux → Compétences → Cours → Leçons
```

**Types Extensibles :**
- **BaseEntity** : ID, timestamps, metadata communs
- **Matiere** : Disciplines (Math, Français, etc.)
- **NiveauEducatif** : Classes (6ème, 5ème, etc.)
- **Competence** : Objectifs pédagogiques
- **Course** : Cours structurés
- **Lesson** : Contenu Markdown individuel

### 🚀 **Approche Qualité & Performance**

**Optimisations :**
- **Parsing cache** : HTML généré mis en cache
- **Tree shaking** : Import sélectif des utilitaires
- **Code splitting** : Routes chargées à la demande
- **Image optimization** : Formats modernes via Vite
- **Bundle analysis** : Monitoring de la taille

**Sécurité :**
- **XSS Protection** : DOMPurify sur tout contenu utilisateur
- **Content validation** : Schémas Zod pour validation
- **Type safety** : TypeScript strict sur toutes les interfaces
- **Input sanitization** : Nettoyage des paramètres de routes

---

## 📚 **Références Modulaires**

### **[REF]** Types et validation : **[content-types.md](../references/data/content-types.md)**
- ✅ Types TypeScript pour contenu éducatif complet
- ✅ Validation Zod et système de migration
- ✅ Structure évolutive pour compétences et cours
- ✅ Interfaces pour exercices et progression

### **[REF]** Système temps réel : **[realtime-system.md](../references/data/realtime-system.md)**
- ✅ Cache intelligent avec TTL et invalidation
- ✅ RealtimeDataManager pour Firestore
- ✅ Stores réactifs avec cleanup automatique
- ✅ Optimisations de performance réseau

### **[REF]** Composants UI : **[component-patterns.md](../references/ui/component-patterns.md)**
- ✅ Design system avec tokens CSS cohérents
- ✅ Composants de base (Button, Card, Input, Modal)
- ✅ Composants spécialisés pour l'apprentissage
- ✅ Patterns d'accessibilité et responsive design

---

## 📝 **Instructions d'Implémentation**

### 🔧 **Étape 3.1 : Installation des dépendances**

```bash
[CMD] npm install marked dompurify highlight.js zod
[CMD] npm install -D @types/marked @types/dompurify
```

### 📊 **Étape 3.2 : Types de contenu sécurisés**

**[FILE]** Créer `src/lib/types/content.ts` :

```ts
import { z } from 'zod';

// ===== ENTITÉ DE BASE =====
export const BaseEntitySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number().int().positive().default(1),
  metadata: z.record(z.unknown()).optional()
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

// ===== MATIÈRES =====
export const MatiereSchema = BaseEntitySchema.extend({
  nom: z.string().min(1).max(100),
  code: z.string().min(2).max(10),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icone: z.string().min(1),
  description: z.string().max(500).optional(),
  ordre: z.number().int().min(0).default(0),
  actif: z.boolean().default(true)
});

export type Matiere = z.infer<typeof MatiereSchema>;

// ===== NIVEAUX ÉDUCATIFS =====
export const NiveauEducatifSchema = BaseEntitySchema.extend({
  nom: z.string().min(1).max(50),
  code: z.string().min(2).max(10),
  ordre: z.number().int().min(0),
  cycleId: z.string().optional(),
  ageMin: z.number().int().min(3).max(25).optional(),
  ageMax: z.number().int().min(3).max(25).optional(),
  actif: z.boolean().default(true)
});

export type NiveauEducatif = z.infer<typeof NiveauEducatifSchema>;

// ===== COMPÉTENCES =====
export const CompetenceSchema = BaseEntitySchema.extend({
  nom: z.string().min(1).max(200),
  description: z.string().max(1000),
  matiereId: z.string().min(1),
  niveauId: z.string().min(1),
  prerequis: z.array(z.string()).default([]),
  objectifs: z.array(z.string()).min(1),
  dureeEstimee: z.number().int().min(1).max(480), // en minutes
  difficulte: z.enum(['facile', 'moyen', 'difficile']).default('moyen'),
  tags: z.array(z.string()).default([]),
  actif: z.boolean().default(true)
});

export type Competence = z.infer<typeof CompetenceSchema>;

// ===== COURS =====
export const CourseSchema = BaseEntitySchema.extend({
  titre: z.string().min(1).max(200),
  description: z.string().max(1000),
  competenceId: z.string().min(1),
  contenuMarkdown: z.string().min(1),
  contenuHtml: z.string().optional(), // Cache de la conversion
  ordre: z.number().int().min(0).default(0),
  dureeEstimee: z.number().int().min(1).max(240), // en minutes
  type: z.enum(['cours', 'exercice', 'evaluation']).default('cours'),
  ressources: z.array(z.object({
    nom: z.string(),
    url: z.string().url(),
    type: z.enum(['video', 'pdf', 'lien', 'image'])
  })).default([]),
  actif: z.boolean().default(true)
});

export type Course = z.infer<typeof CourseSchema>;

// ===== LEÇONS =====
export const LessonSchema = BaseEntitySchema.extend({
  titre: z.string().min(1).max(200),
  courseId: z.string().min(1),
  contenuMarkdown: z.string().min(1),
  contenuHtml: z.string().optional(),
  ordre: z.number().int().min(0).default(0),
  type: z.enum(['introduction', 'explication', 'exemple', 'exercice', 'synthese']),
  dureeEstimee: z.number().int().min(1).max(120),
  actif: z.boolean().default(true)
});

export type Lesson = z.infer<typeof LessonSchema>;

// ===== VALIDATION HELPERS =====
export function validateMatiere(data: unknown): Matiere {
  return MatiereSchema.parse(data);
}

export function validateCourse(data: unknown): Course {
  return CourseSchema.parse(data);
}

// Export des schémas pour validation côté API
export const schemas = {
  BaseEntity: BaseEntitySchema,
  Matiere: MatiereSchema,
  NiveauEducatif: NiveauEducatifSchema,
  Competence: CompetenceSchema,
  Course: CourseSchema,
  Lesson: LessonSchema
} as const;
```

### 🔄 **Étape 3.3 : Utilitaires de contenu**

**[FILE]** Créer `src/lib/utils/content.ts` :

```ts
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import type { Course, Lesson } from '$lib/types/content';

// Configuration de marked avec sécurité
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.warn('Erreur de coloration syntaxique:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// Configuration DOMPurify sécurisée
const purifyConfig = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'strong', 'em', 'u', 'del',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
  ALLOW_DATA_ATTR: false
};

/**
 * Convertit du Markdown en HTML sécurisé
 */
export function markdownToHtml(markdown: string): string {
  try {
    // 1. Parser le Markdown
    const rawHtml = marked.parse(markdown);
    
    // 2. Sécuriser le HTML
    const cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);
    
    return cleanHtml;
  } catch (error) {
    console.error('Erreur de conversion Markdown:', error);
    return '<p class="error">Erreur de chargement du contenu</p>';
  }
}

/**
 * Génère un slug URL-friendly à partir d'un titre
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Estime le temps de lecture en minutes
 */
export function estimateReadingTime(markdown: string): number {
  const wordsPerMinute = 200;
  const wordCount = markdown.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extrait les en-têtes d'un contenu Markdown pour la navigation
 */
export function extractHeaders(markdown: string): Array<{id: string, level: number, text: string}> {
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const headers = [];
  let match;
  
  while ((match = headerRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateSlug(text);
    
    headers.push({ id, level, text });
  }
  
  return headers;
}

/**
 * Cache des conversions HTML pour optimiser les performances
 */
class ContentCache {
  private cache = new Map<string, { html: string, timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.html;
  }

  set(key: string, html: string): void {
    this.cache.set(key, {
      html,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const contentCache = new ContentCache();

/**
 * Convertit un cours avec cache
 */
export function processCourse(course: Course): Course {
  if (course.contenuHtml) {
    return course;
  }

  const cacheKey = `course-${course.id}-${course.updatedAt}`;
  let html = contentCache.get(cacheKey);
  
  if (!html) {
    html = markdownToHtml(course.contenuMarkdown);
    contentCache.set(cacheKey, html);
  }

  return {
    ...course,
    contenuHtml: html
  };
}
```

### 🗂️ **Étape 3.4 : Stores de contenu**

**[FILE]** Créer `src/lib/stores/content.ts` :

```ts
import { writable, derived, readable } from 'svelte/store';
import type { Matiere, NiveauEducatif, Competence, Course } from '$lib/types/content';

// ===== STORES DE DONNÉES =====
export const matieres = writable<Matiere[]>([]);
export const niveaux = writable<NiveauEducatif[]>([]);
export const competences = writable<Competence[]>([]);
export const courses = writable<Course[]>([]);

// ===== STORES DE NAVIGATION =====
export const currentMatiere = writable<string | null>(null);
export const currentNiveau = writable<string | null>(null);
export const currentCompetence = writable<string | null>(null);

// ===== STORES DÉRIVÉS =====
export const matiereActive = derived(
  [matieres, currentMatiere],
  ([$matieres, $currentMatiere]) => 
    $matieres.find(m => m.id === $currentMatiere)
);

export const niveauActif = derived(
  [niveaux, currentNiveau],
  ([$niveaux, $currentNiveau]) => 
    $niveaux.find(n => n.id === $currentNiveau)
);

export const competencesFiltered = derived(
  [competences, currentMatiere, currentNiveau],
  ([$competences, $matiere, $niveau]) => 
    $competences.filter(c => 
      (!$matiere || c.matiereId === $matiere) &&
      (!$niveau || c.niveauId === $niveau)
    )
);

export const coursesFiltered = derived(
  [courses, currentCompetence],
  ([$courses, $competence]) => 
    $courses.filter(c => !$competence || c.competenceId === $competence)
);

// ===== DONNÉES DE TEST =====
export const mockData = readable({
  matieres: [
    {
      id: 'math',
      nom: 'Mathématiques',
      code: 'MATH',
      couleur: '#3B82F6',
      icone: '🔢',
      description: 'Découvrez les merveilles des mathématiques',
      ordre: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      actif: true
    },
    {
      id: 'francais',
      nom: 'Français',
      code: 'FR',
      couleur: '#EF4444',
      icone: '📚',
      description: 'Maîtrisez la langue française',
      ordre: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      actif: true
    }
  ] as Matiere[],
  
  niveaux: [
    {
      id: '6eme',
      nom: '6ème',
      code: '6E',
      ordre: 1,
      ageMin: 11,
      ageMax: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      actif: true
    },
    {
      id: '5eme',
      nom: '5ème',
      code: '5E',
      ordre: 2,
      ageMin: 12,
      ageMax: 13,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      actif: true
    }
  ] as NiveauEducatif[]
});

// ===== ACTIONS =====
export const contentActions = {
  // Initialiser avec les données de test
  loadMockData() {
    mockData.subscribe(data => {
      matieres.set(data.matieres);
      niveaux.set(data.niveaux);
    });
  },

  // Navigation
  selectMatiere(matiereId: string) {
    currentMatiere.set(matiereId);
    currentNiveau.set(null);
    currentCompetence.set(null);
  },

  selectNiveau(niveauId: string) {
    currentNiveau.set(niveauId);
    currentCompetence.set(null);
  },

  selectCompetence(competenceId: string) {
    currentCompetence.set(competenceId);
  },

  // Reset navigation
  reset() {
    currentMatiere.set(null);
    currentNiveau.set(null);
    currentCompetence.set(null);
  }
};
```

### 🎨 **Étape 3.5 : Routes dynamiques**

**[FILE]** Créer `src/routes/content/+page.svelte` :

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { matieres, niveaux, contentActions } from '$lib/stores/content';

  onMount(() => {
    contentActions.loadMockData();
  });
</script>

<svelte:head>
  <title>Contenu - FunLearning</title>
</svelte:head>

<div class="content-hub">
  <header>
    <h1>Explorer le contenu</h1>
    <p>Découvrez nos matières et niveaux d'apprentissage</p>
  </header>

  <section class="matieres-grid">
    <h2>Matières disponibles</h2>
    <div class="grid">
      {#each $matieres as matiere (matiere.id)}
        <a 
          href="/content/{matiere.code.toLowerCase()}" 
          class="matiere-card"
          style="--couleur: {matiere.couleur}"
        >
          <div class="icone">{matiere.icone}</div>
          <h3>{matiere.nom}</h3>
          <p>{matiere.description}</p>
        </a>
      {/each}
    </div>
  </section>

  <section class="niveaux-section">
    <h2>Niveaux d'apprentissage</h2>
    <div class="niveaux-list">
      {#each $niveaux as niveau (niveau.id)}
        <div class="niveau-item">
          <strong>{niveau.nom}</strong>
          <span>Ages {niveau.ageMin}-{niveau.ageMax} ans</span>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .content-hub {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .matiere-card {
    display: block;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
    background: white;
  }

  .matiere-card:hover {
    border-color: var(--couleur);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .icone {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .matiere-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--couleur);
  }

  .niveaux-section {
    margin-top: 3rem;
  }

  .niveaux-list {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .niveau-item {
    padding: 0.75rem 1rem;
    background: #f3f4f6;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .niveau-item span {
    font-size: 0.875rem;
    color: #6b7280;
  }
</style>
```

**[FILE]** Créer `src/routes/content/[matiere]/+page.svelte` :

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { matiereActive, niveaux, contentActions } from '$lib/stores/content';

  $: matiereCode = $page.params.matiere;

  onMount(() => {
    contentActions.loadMockData();
    // Rechercher la matière par code
    // Note: ici on devrait faire une vraie recherche
    contentActions.selectMatiere('math'); // Simplification pour l'exemple
  });
</script>

<svelte:head>
  <title>{$matiereActive?.nom || 'Matière'} - FunLearning</title>
</svelte:head>

{#if $matiereActive}
  <div class="matiere-page">
    <header class="matiere-header" style="--couleur: {$matiereActive.couleur}">
      <div class="icone">{$matiereActive.icone}</div>
      <h1>{$matiereActive.nom}</h1>
      <p>{$matiereActive.description}</p>
    </header>

    <section class="niveaux-selection">
      <h2>Choisissez votre niveau</h2>
      <div class="niveaux-grid">
        {#each $niveaux as niveau (niveau.id)}
          <a 
            href="/content/{matiereCode}/{niveau.code.toLowerCase()}"
            class="niveau-card"
          >
            <h3>{niveau.nom}</h3>
            <p>Ages {niveau.ageMin}-{niveau.ageMax} ans</p>
          </a>
        {/each}
      </div>
    </section>
  </div>
{:else}
  <div class="loading">
    <p>Chargement de la matière...</p>
  </div>
{/if}

<style>
  .matiere-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .matiere-header {
    text-align: center;
    padding: 3rem 0;
    background: linear-gradient(135deg, var(--couleur), color-mix(in srgb, var(--couleur) 60%, white));
    border-radius: 12px;
    color: white;
    margin-bottom: 3rem;
  }

  .matiere-header .icone {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .niveaux-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .niveau-card {
    display: block;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    background: white;
    transition: all 0.2s;
  }

  .niveau-card:hover {
    border-color: var(--couleur);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .loading {
    text-align: center;
    padding: 3rem;
  }
</style>
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:content          # Tests types et utils
[TEST] npm run test:security         # Tests sécurité XSS
[TEST] npm run test:e2e             # Tests navigation
[TEST] npm run validate 3           # Validation complète Phase 3
```

**[FILE]** Créer `src/lib/utils/content.test.ts` :

```ts
import { describe, it, expect } from 'vitest';
import { markdownToHtml, generateSlug, estimateReadingTime } from './content';

describe('Content Utils', () => {
  describe('markdownToHtml', () => {
    it('should convert basic markdown', () => {
      const markdown = '# Hello\n\nThis is **bold**.';
      const html = markdownToHtml(markdown);
      expect(html).toContain('<h1>Hello</h1>');
      expect(html).toContain('<strong>bold</strong>');
    });

    it('should sanitize dangerous HTML', () => {
      const markdown = '<script>alert("xss")</script>';
      const html = markdownToHtml(markdown);
      expect(html).not.toContain('<script>');
    });
  });

  describe('generateSlug', () => {
    it('should create URL-friendly slugs', () => {
      expect(generateSlug('Les Mathématiques Avancées')).toBe('les-mathematiques-avancees');
      expect(generateSlug('Français 6ème')).toBe('francais-6eme');
    });
  });

  describe('estimateReadingTime', () => {
    it('should estimate reading time', () => {
      const shortText = 'Hello world';
      const longText = 'word '.repeat(400); // 400 mots
      
      expect(estimateReadingTime(shortText)).toBe(1);
      expect(estimateReadingTime(longText)).toBe(2); // 400/200 = 2 minutes
    });
  });
});
```

**[FILE]** Créer `tests/e2e/content.spec.ts` :

```ts
import { test, expect } from '@playwright/test';

test.describe('Content Navigation', () => {
  test('should display content hub', async ({ page }) => {
    await page.goto('/content');
    await expect(page.locator('h1')).toContainText('Explorer le contenu');
    await expect(page.locator('.matiere-card')).toHaveCount(2);
  });

  test('should navigate to matiere page', async ({ page }) => {
    await page.goto('/content');
    await page.click('text=Mathématiques');
    await expect(page).toHaveURL('/content/math');
    await expect(page.locator('h1')).toContainText('Mathématiques');
  });
});
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Types de contenu TypeScript complets
- [ ] **[CHECK]** Conversion Markdown → HTML sécurisée
- [ ] **[CHECK]** Protection XSS avec DOMPurify
- [ ] **[CHECK]** Routes dynamiques fonctionnelles
- [ ] **[CHECK]** Navigation entre matières/niveaux
- [ ] **[CHECK]** Stores de contenu réactifs
- [ ] **[CHECK]** Cache des transformations opérationnel
- [ ] **[CHECK]** Tests de sécurité passent

---

## 🏷️ **Processus de Release v1.2**

```bash
[CMD] npm run validate 3              # Validation complète Phase 3
[CMD] git add . && git commit -m "feat: Phase 3 - Content & Markdown complete"
[CMD] git tag v1.2                   # Tag release contenu
[CMD] npm run release:deploy         # Déploiement production
```

**🚫 STOP** : Ne pas passer à Phase 4 sans validation complète de Phase 3.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [🧠 Phase 4 : Pédagogie Avancée](phase-4-pedagogy.md)  
**Dépendance** : Phase 3 (Contenu) validée ✅
