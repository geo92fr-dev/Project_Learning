# 🔄 Phase 2.10 : Interface Dynamique Firebase (2 heures)

## 🎯 Contexte IA

**Objectif** : Transformer l'interface statique en interface dynamique connectée à Firebase, remplacer les données hardcodées par des requêtes en temps réel.
**Pré-requis** : Firebase Firestore configuré et peuplé (Phase 2.9), curriculum généré avec données de test.

## 📝 Instructions granulaires

### Étape 2.10.1 : Service de données Firebase (45min)

**[FILE]** Créer `src/lib/services/subjects.ts` :

```typescript
import { db } from "$lib/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { Subject, Competence, Course } from "$lib/types/content";

interface SubjectStats {
  competences: number;
  courses: number;
}

interface GlobalStats {
  totalSubjects: number;
  totalCompetences: number;
  totalCourses: number;
  bySubject: Record<string, SubjectStats>;
}

export async function getSubjects(): Promise<Subject[]> {
  // Vérification SSR - Firebase n'est disponible que côté client
  if (!db) {
    console.warn("⚠️ Firebase non disponible (SSR ou erreur config)");
    return [];
  }

  try {
    const subjectsRef = collection(db, "subjects");
    const q = query(subjectsRef, orderBy("ordre", "asc"));
    const snapshot = await getDocs(q);

    const subjects: Subject[] = [];
    snapshot.forEach((doc) => {
      subjects.push({ id: doc.id, ...doc.data() } as Subject);
    });

    console.log("✅ Matières chargées depuis Firebase:", subjects.length);
    return subjects;
  } catch (error) {
    console.error("❌ Erreur chargement matières:", error);
    return [];
  }
}

export async function calculateStats(): Promise<GlobalStats> {
  if (!db) {
    return {
      totalSubjects: 0,
      totalCompetences: 0,
      totalCourses: 0,
      bySubject: {},
    };
  }

  try {
    const [subjectsSnap, competencesSnap, coursesSnap] = await Promise.all([
      getDocs(collection(db, "subjects")),
      getDocs(collection(db, "competences")),
      getDocs(collection(db, "courses")),
    ]);

    const bySubject: Record<string, SubjectStats> = {};

    // Calculer stats par matière
    subjectsSnap.forEach((doc) => {
      const subjectId = doc.id;
      bySubject[subjectId] = {
        competences: 0,
        courses: 0,
      };
    });

    // Compter compétences par matière
    competencesSnap.forEach((doc) => {
      const data = doc.data();
      const subjectId = data.subjectId;
      if (bySubject[subjectId]) {
        bySubject[subjectId].competences++;
      }
    });

    // Compter cours par matière
    coursesSnap.forEach((doc) => {
      const data = doc.data();
      const subjectId = data.subjectId;
      if (bySubject[subjectId]) {
        bySubject[subjectId].courses++;
      }
    });

    return {
      totalSubjects: subjectsSnap.size,
      totalCompetences: competencesSnap.size,
      totalCourses: coursesSnap.size,
      bySubject,
    };
  } catch (error) {
    console.error("❌ Erreur calcul statistiques:", error);
    return {
      totalSubjects: 0,
      totalCompetences: 0,
      totalCourses: 0,
      bySubject: {},
    };
  }
}
```

### Étape 2.10.2 : Interface dynamique homepage (45min)

**[FILE]** Modifier `src/routes/+page.svelte` :

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { getSubjects, calculateStats } from "$lib/services/subjects";
  import type { Subject } from "$lib/types/content";

  // État réactif
  let isLoading = true;
  let matieres: Subject[] = [];
  let globalStats = {
    totalSubjects: 0,
    totalCompetences: 0,
    totalCourses: 0,
    bySubject: {},
  };

  // Données par défaut en cas d'erreur
  const defaultMatieres: Subject[] = [
    {
      id: "math",
      nom: "Mathématiques",
      description: "Développer le raisonnement logique",
      couleur: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icone: "🔢",
    },
    {
      id: "francais",
      nom: "Français",
      description: "Maîtriser la langue française",
      couleur: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icone: "📚",
    },
  ];

  // Couleurs par défaut pour les matières
  const couleursDefaut = {
    mathematiques: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    francais: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    sciences: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    histoire: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    anglais: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  };

  // Fonction de chargement des données dynamiques
  async function loadDynamicData() {
    console.log("🔄 Chargement des données depuis Firebase...");

    try {
      // Charger les matières et statistiques depuis Firebase
      const [subjects, statistiques] = await Promise.all([
        getSubjects(),
        calculateStats(),
      ]);

      if (subjects && subjects.length > 0) {
        // Convertir les subjects Firebase en format MatiereDisplay
        matieres = subjects.map((subject) => ({
          id: subject.id,
          nom: subject.nom,
          description: subject.description,
          couleur:
            subject.couleur ||
            couleursDefaut[subject.nom.toLowerCase()] ||
            "#6366f1",
          icone: subject.icone || "📚",
        }));

        globalStats = statistiques;
        console.log("✅ Interface dynamique chargée:", {
          matieres: matieres.length,
          stats: globalStats,
        });
      } else {
        console.log(
          "⚠️ Aucune matière trouvée dans Firebase, utilisation des données par défaut"
        );
        matieres = defaultMatieres;
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des données:", error);
      console.log("🔄 Utilisation des données par défaut");
      matieres = defaultMatieres;
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    if (browser) {
      // Charger les données dynamiques depuis Firebase
      await loadDynamicData();
    } else {
      // SSR fallback
      matieres = defaultMatieres;
      isLoading = false;
    }
  });

  const handleMatiereClick = (matiereId: string) => {
    console.log("🎯 Navigation vers matière:", matiereId);
    // Navigation sera gérée par le router SvelteKit
  };
</script>

<svelte:head>
  <title>FunLearning - Plateforme d'apprentissage</title>
</svelte:head>

<div class="container">
  {#if isLoading}
    <!-- État de chargement -->
    <div class="loading-container">
      <div class="spinner" />
      <p class="loading-text">Chargement des données...</p>
    </div>
  {:else}
    <!-- Header avec statistiques -->
    {#if globalStats.totalSubjects > 0}
      <div class="stats-header">
        <h2>📊 Statistiques globales</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">{globalStats.totalSubjects}</span>
            <span class="stat-label">Matières</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{globalStats.totalCompetences}</span>
            <span class="stat-label">Compétences</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{globalStats.totalCourses}</span>
            <span class="stat-label">Cours</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Grille des matières -->
    <div class="content">
      <h1>🎓 Choisissez votre matière</h1>
      <div class="matieres-grid">
        {#each matieres as matiere}
          <a
            href="/matiere/{matiere.id}"
            class="matiere-card"
            on:click={() => handleMatiereClick(matiere.id)}
          >
            <div class="matiere-header" style="background: {matiere.couleur}">
              <span class="matiere-icon">{matiere.icone}</span>
            </div>
            <div class="matiere-content">
              <h3>{matiere.nom}</h3>
              <p>{matiere.description}</p>

              {#if globalStats.bySubject[matiere.id]}
                <div class="matiere-stats">
                  <span class="stat-item">
                    {globalStats.bySubject[matiere.id].competences} compétences
                  </span>
                  <span class="stat-item">
                    {globalStats.bySubject[matiere.id].courses} cours
                  </span>
                </div>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    gap: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #6366f1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    color: #6b7280;
    font-size: 1.1rem;
  }

  .stats-header {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .stats-header h2 {
    margin: 0 0 1rem 0;
    color: #374151;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #6366f1;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .content h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #374151;
    font-size: 2.5rem;
  }

  .matieres-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .matiere-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .matiere-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  .matiere-header {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .matiere-icon {
    font-size: 3rem;
  }

  .matiere-content {
    padding: 1.5rem;
  }

  .matiere-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
  }

  .matiere-content p {
    margin: 0 0 1rem 0;
    color: #6b7280;
    line-height: 1.5;
  }

  .matiere-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    font-size: 0.875rem;
    color: #6366f1;
    background: #f0f4ff;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .content h1 {
      font-size: 2rem;
    }

    .matieres-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### Étape 2.10.3 : Styles CSS pour états dynamiques (15min)

**[FILE]** Ajouter à `src/app.css` :

```css
/* Styles globaux pour interface dynamique */
.dynamic-loading {
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.dynamic-error {
  border: 2px solid #ef4444;
  background: #fef2f2;
}

.dynamic-success {
  border: 2px solid #10b981;
  background: #f0fdf4;
}

/* Animation de chargement globale */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Skeleton loaders */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### Étape 2.10.4 : Tests de validation (15min)

**[CMD]** Tests de l'interface dynamique :

```bash
npm run dev                           # Démarrer l'app
# Vérifier dans le navigateur :
# - État de chargement affiché au démarrage
# - Tuiles remplacées par données Firebase
# - Statistiques globales affichées en haut
# - Console devtools : logs de chargement Firebase
```

## ✅ **Critères de validation Phase 2.10**

- [ ] **[CHECK]** Service `subjects.ts` créé avec fonctions CRUD Firebase
- [ ] **[CHECK]** Interface dynamique remplace les données statiques
- [ ] **[CHECK]** États de chargement (spinner) affiché pendant requêtes
- [ ] **[CHECK]** Statistiques globales affichées (total matières/compétences/cours)
- [ ] **[CHECK]** Statistiques par tuile affichées (compétences/cours par matière)
- [ ] **[CHECK]** Fallback gracieux si Firebase indisponible
- [ ] **[CHECK]** Console logs : chargement Firebase réussi
- [ ] **[CHECK]** Tuiles générées automatiquement depuis base de données
- [ ] **[CHECK]** Performance : chargement < 3 secondes
- [ ] **[CHECK]** Responsive : fonctionne sur mobile/desktop

## 📊 **Objectifs quantitatifs Phase 2.10**

- **Temps de chargement initial** < 3 secondes
- **Tuiles affichées** = nombre de subjects dans Firebase
- **Statistiques exactes** : données cohérentes avec Firestore
- **0 données hardcodées** dans l'interface finale
- **Fallback** : affichage par défaut si connexion échoue

## 🧪 **Tests de validation spécifiques**

```bash
[TEST] npm run dev                    # Interface charge correctement
[TEST] # Ouvrir console navigateur -> logs Firebase OK
[TEST] # Vérifier tuiles = nombre matières en base
[TEST] # Vérifier statistiques cohérentes avec données
[TEST] # Simuler panne réseau -> fallback affiché
```

## 🎯 **Résultats attendus**

- ✅ **Interface entièrement dynamique** : Plus de données hardcodées
- ✅ **Chargement en temps réel** : Données actualisées à chaque visite
- ✅ **États visuels** : Loading, succès, erreur gérés
- ✅ **Performance optimisée** : Requêtes Firebase efficaces
- ✅ **UX améliorée** : Feedback utilisateur pendant chargement

---

**🚫 STOP** : Ne pas passer à Phase 3 sans validation complète de Phase 2.

---

**⏭️ NEXT** : Phase 3 - Exercices & Progression (quiz interactifs)
