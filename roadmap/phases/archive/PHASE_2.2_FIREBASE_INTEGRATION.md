# 📊 Phase 2.2 : Intégration Firebase Data Layer (3h)

## 🎯 Contexte IA

**Objectif** : Intégrer Firebase Firestore comme source de données principale pour remplacer les données mock de la Phase 2.1. Transformer le système de navigation hierarchique actuel en interface dynamique connectée aux collections Firebase.

**Pré-requis** :

- ✅ Phase 2.1 : Structure de navigation hierarchique complète
- ✅ Firebase configuré (auth.ts, client.ts)
- ✅ Types TypeScript définis pour le contenu éducatif

**Post-requis** : Interface navigation entièrement dynamique avec données temps réel

---

## 🏗️ **Architecture Firebase - Schema de données**

### 📋 **Collections Firestore**

```typescript
// Types de base pour Firebase
interface FirebaseSubject {
  id: string;
  nom: string;
  description: string;
  couleur: string;
  ordre: number;
  icone?: string;
  createdAt: string;
  updatedAt: string;
}

interface FirebaseNiveau {
  id: string;
  nom: string;
  description: string;
  subjectId: string; // Référence vers subjects
  ordre: number;
  couleur?: string;
  createdAt: string;
  updatedAt: string;
}

interface FirebaseCompetence {
  id: string;
  titre: string;
  description: string;
  niveauId: string; // Référence vers niveaux
  subjectId: string; // Dénormalisé pour performance
  ordre: number;
  difficulte: "facile" | "moyen" | "difficile";
  dureeEstimee: number; // en minutes
  prerequis?: string[]; // IDs d'autres compétences
  createdAt: string;
  updatedAt: string;
}

interface FirebaseCours {
  id: string;
  titre: string;
  description: string;
  competenceId: string; // Référence vers competences
  niveauId: string; // Dénormalisé
  subjectId: string; // Dénormalisé
  ordre: number;
  contenu: string; // Markdown
  type: "cours" | "exercice" | "evaluation";
  difficulte: "facile" | "moyen" | "difficile";
  dureeEstimee: number;
  createdAt: string;
  updatedAt: string;
}
```

### 🔥 **Structure Collections Firebase**

```
firestore/
├── subjects/               # Collection racine
│   ├── {subjectId}        # Document matière
│   └── ...
├── niveaux/               # Collection racine
│   ├── {niveauId}         # Document niveau
│   └── ...
├── competences/           # Collection racine
│   ├── {competenceId}     # Document compétence
│   └── ...
└── cours/                 # Collection racine
    ├── {coursId}          # Document cours
    └── ...
```

---

## 📝 **Instructions granulaires Phase 2.2**

### Étape 2.2.1 : Services Firebase CRUD (60min)

**[FILE]** Créer `src/lib/services/firebase-data.ts` :

```typescript
import { db } from "$lib/firebase/client";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import type {
  FirebaseSubject,
  FirebaseNiveau,
  FirebaseCompetence,
  FirebaseCours,
} from "$lib/types/firebase";

// Service pour les matières
export class SubjectsService {
  static async getAll(): Promise<FirebaseSubject[]> {
    try {
      const q = query(collection(db, "subjects"), orderBy("ordre", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as FirebaseSubject)
      );
    } catch (error) {
      console.error("❌ Erreur chargement subjects:", error);
      return [];
    }
  }

  static async getById(id: string): Promise<FirebaseSubject | null> {
    try {
      const docRef = doc(db, "subjects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirebaseSubject;
      }
      return null;
    } catch (error) {
      console.error("❌ Erreur chargement subject:", error);
      return null;
    }
  }
}

// Service pour les niveaux
export class NiveauxService {
  static async getBySubjectId(subjectId: string): Promise<FirebaseNiveau[]> {
    try {
      const q = query(
        collection(db, "niveaux"),
        where("subjectId", "==", subjectId),
        orderBy("ordre", "asc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as FirebaseNiveau)
      );
    } catch (error) {
      console.error("❌ Erreur chargement niveaux:", error);
      return [];
    }
  }

  static async getById(id: string): Promise<FirebaseNiveau | null> {
    try {
      const docRef = doc(db, "niveaux", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirebaseNiveau;
      }
      return null;
    } catch (error) {
      console.error("❌ Erreur chargement niveau:", error);
      return null;
    }
  }
}

// Service pour les compétences
export class CompetencesService {
  static async getByNiveauId(niveauId: string): Promise<FirebaseCompetence[]> {
    try {
      const q = query(
        collection(db, "competences"),
        where("niveauId", "==", niveauId),
        orderBy("ordre", "asc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as FirebaseCompetence)
      );
    } catch (error) {
      console.error("❌ Erreur chargement compétences:", error);
      return [];
    }
  }

  static async getById(id: string): Promise<FirebaseCompetence | null> {
    try {
      const docRef = doc(db, "competences", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirebaseCompetence;
      }
      return null;
    } catch (error) {
      console.error("❌ Erreur chargement compétence:", error);
      return null;
    }
  }
}

// Service pour les cours
export class CoursService {
  static async getByCompetenceId(
    competenceId: string
  ): Promise<FirebaseCours[]> {
    try {
      const q = query(
        collection(db, "cours"),
        where("competenceId", "==", competenceId),
        orderBy("ordre", "asc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as FirebaseCours)
      );
    } catch (error) {
      console.error("❌ Erreur chargement cours:", error);
      return [];
    }
  }

  static async getById(id: string): Promise<FirebaseCours | null> {
    try {
      const docRef = doc(db, "cours", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FirebaseCours;
      }
      return null;
    } catch (error) {
      console.error("❌ Erreur chargement cours:", error);
      return null;
    }
  }
}

// Service de statistiques
export class StatsService {
  static async getGlobalStats() {
    try {
      const [subjectsSnap, niveauxSnap, competencesSnap, coursSnap] =
        await Promise.all([
          getDocs(collection(db, "subjects")),
          getDocs(collection(db, "niveaux")),
          getDocs(collection(db, "competences")),
          getDocs(collection(db, "cours")),
        ]);

      return {
        subjects: subjectsSnap.size,
        niveaux: niveauxSnap.size,
        competences: competencesSnap.size,
        cours: coursSnap.size,
      };
    } catch (error) {
      console.error("❌ Erreur chargement stats:", error);
      return {
        subjects: 0,
        niveaux: 0,
        competences: 0,
        cours: 0,
      };
    }
  }
}
```

### Étape 2.2.2 : Types Firebase (15min)

**[FILE]** Créer `src/lib/types/firebase.ts` :

```typescript
// Types Firebase pour les collections Firestore
export interface FirebaseSubject {
  id: string;
  nom: string;
  description: string;
  couleur: string;
  ordre: number;
  icone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirebaseNiveau {
  id: string;
  nom: string;
  description: string;
  subjectId: string;
  ordre: number;
  couleur?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirebaseCompetence {
  id: string;
  titre: string;
  description: string;
  niveauId: string;
  subjectId: string; // Dénormalisé pour performance
  ordre: number;
  difficulte: "facile" | "moyen" | "difficile";
  dureeEstimee: number; // en minutes
  prerequis?: string[]; // IDs d'autres compétences
  createdAt: string;
  updatedAt: string;
}

export interface FirebaseCours {
  id: string;
  titre: string;
  description: string;
  competenceId: string;
  niveauId: string; // Dénormalisé
  subjectId: string; // Dénormalisé
  ordre: number;
  contenu: string; // Markdown
  type: "cours" | "exercice" | "evaluation";
  difficulte: "facile" | "moyen" | "difficile";
  dureeEstimee: number;
  createdAt: string;
  updatedAt: string;
}

// Types pour les adaptateurs (conversion Firebase -> App)
export interface SubjectAdapter {
  fromFirebase(
    firebaseSubject: FirebaseSubject
  ): import("$lib/types/content").Subject;
}

export interface NiveauAdapter {
  fromFirebase(
    firebaseNiveau: FirebaseNiveau
  ): import("$lib/types/content").Niveau;
}

export interface CompetenceAdapter {
  fromFirebase(
    firebaseCompetence: FirebaseCompetence
  ): import("$lib/types/content").Competence;
}

export interface CoursAdapter {
  fromFirebase(
    firebaseCours: FirebaseCours
  ): import("$lib/types/content").Cours;
}
```

### Étape 2.2.3 : Adaptateurs de données (30min)

**[FILE]** Créer `src/lib/services/data-adapters.ts` :

```typescript
import type {
  FirebaseSubject,
  FirebaseNiveau,
  FirebaseCompetence,
  FirebaseCours,
} from "$lib/types/firebase";
import type { Subject, Niveau, Competence, Cours } from "$lib/types/content";

// Adaptateur pour les matières
export const SubjectAdapter = {
  fromFirebase(firebaseSubject: FirebaseSubject): Subject {
    return {
      id: firebaseSubject.id,
      nom: firebaseSubject.nom,
      description: firebaseSubject.description,
      couleur: firebaseSubject.couleur,
      icone: firebaseSubject.icone || "📚",
      niveaux: [], // Sera peuplé par les requêtes séparées
    };
  },

  toFirebase(subject: Subject): Omit<FirebaseSubject, "id"> {
    return {
      nom: subject.nom,
      description: subject.description,
      couleur: subject.couleur,
      icone: subject.icone,
      ordre: 0, // Sera géré par l'admin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

// Adaptateur pour les niveaux
export const NiveauAdapter = {
  fromFirebase(firebaseNiveau: FirebaseNiveau): Niveau {
    return {
      id: firebaseNiveau.id,
      nom: firebaseNiveau.nom,
      description: firebaseNiveau.description,
      couleur: firebaseNiveau.couleur || "#6366f1",
      competences: [], // Sera peuplé par les requêtes séparées
    };
  },

  toFirebase(niveau: Niveau, subjectId: string): Omit<FirebaseNiveau, "id"> {
    return {
      nom: niveau.nom,
      description: niveau.description,
      subjectId,
      couleur: niveau.couleur,
      ordre: 0, // Sera géré par l'admin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

// Adaptateur pour les compétences
export const CompetenceAdapter = {
  fromFirebase(firebaseCompetence: FirebaseCompetence): Competence {
    return {
      id: firebaseCompetence.id,
      titre: firebaseCompetence.titre,
      description: firebaseCompetence.description,
      difficulte: firebaseCompetence.difficulte,
      dureeEstimee: firebaseCompetence.dureeEstimee,
      cours: [], // Sera peuplé par les requêtes séparées
    };
  },

  toFirebase(
    competence: Competence,
    niveauId: string,
    subjectId: string
  ): Omit<FirebaseCompetence, "id"> {
    return {
      titre: competence.titre,
      description: competence.description,
      niveauId,
      subjectId, // Dénormalisé pour performance
      difficulte: competence.difficulte,
      dureeEstimee: competence.dureeEstimee,
      prerequis: [],
      ordre: 0, // Sera géré par l'admin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

// Adaptateur pour les cours
export const CoursAdapter = {
  fromFirebase(firebaseCours: FirebaseCours): Cours {
    return {
      id: firebaseCours.id,
      titre: firebaseCours.titre,
      description: firebaseCours.description,
      contenu: firebaseCours.contenu,
      type: firebaseCours.type,
      difficulte: firebaseCours.difficulte,
      dureeEstimee: firebaseCours.dureeEstimee,
    };
  },

  toFirebase(
    cours: Cours,
    competenceId: string,
    niveauId: string,
    subjectId: string
  ): Omit<FirebaseCours, "id"> {
    return {
      titre: cours.titre,
      description: cours.description,
      competenceId,
      niveauId, // Dénormalisé
      subjectId, // Dénormalisé
      contenu: cours.contenu,
      type: cours.type,
      difficulte: cours.difficulte,
      dureeEstimee: cours.dureeEstimee,
      ordre: 0, // Sera géré par l'admin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};
```

### Étape 2.2.4 : Migration des pages de route (45min)

**[FILE]** Modifier `src/routes/+page.svelte` pour utiliser Firebase :

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { SubjectsService, StatsService } from "$lib/services/firebase-data";
  import { SubjectAdapter } from "$lib/services/data-adapters";
  import type { Subject } from "$lib/types/content";

  // État de chargement
  let isLoading = true;
  let subjects: Subject[] = [];
  let globalStats = {
    subjects: 0,
    niveaux: 0,
    competences: 0,
    cours: 0,
  };

  // Chargement des données depuis Firebase
  async function loadFirebaseData() {
    if (!browser) return; // Protection SSR

    try {
      console.log("🔄 Chargement des données depuis Firebase...");

      // Charger matières et statistiques en parallèle
      const [firebaseSubjects, stats] = await Promise.all([
        SubjectsService.getAll(),
        StatsService.getGlobalStats(),
      ]);

      // Adapter les données Firebase vers le format app
      subjects = firebaseSubjects.map(SubjectAdapter.fromFirebase);
      globalStats = stats;

      console.log("✅ Données Firebase chargées:", {
        subjects: subjects.length,
        stats: globalStats,
      });
    } catch (error) {
      console.error("❌ Erreur chargement Firebase:", error);
      // Fallback vers données par défaut si échec
      subjects = [];
      globalStats = { subjects: 0, niveaux: 0, competences: 0, cours: 0 };
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadFirebaseData();
  });
</script>

<!-- État de chargement -->
{#if isLoading}
  <div class="loading-container">
    <div class="spinner" />
    <p>Chargement des données...</p>
  </div>
{:else}
  <!-- Statistiques globales -->
  <div class="stats-container">
    <div class="stat">
      <span class="number">{globalStats.subjects}</span>
      <span class="label">Matières</span>
    </div>
    <div class="stat">
      <span class="number">{globalStats.competences}</span>
      <span class="label">Compétences</span>
    </div>
    <div class="stat">
      <span class="number">{globalStats.cours}</span>
      <span class="label">Cours</span>
    </div>
  </div>

  <!-- Grille des matières -->
  <div class="subjects-grid">
    {#each subjects as subject}
      <a href="/matiere/{subject.id}" class="subject-card">
        <div class="subject-header" style="background: {subject.couleur}">
          <span class="icon">{subject.icone}</span>
        </div>
        <h3>{subject.nom}</h3>
        <p>{subject.description}</p>
      </a>
    {/each}
  </div>
{/if}

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    gap: 1rem;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #6366f1;
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

  .stats-container {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .stat .number {
    font-size: 2rem;
    font-weight: bold;
    color: #6366f1;
  }

  .stat .label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .subjects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .subject-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s;
  }

  .subject-card:hover {
    transform: translateY(-2px);
  }

  .subject-header {
    padding: 1.5rem;
    border-radius: 12px 12px 0 0;
    text-align: center;
  }

  .icon {
    font-size: 2.5rem;
  }

  .subject-card h3 {
    margin: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .subject-card p {
    margin: 0 1rem 1.5rem;
    color: #6b7280;
    line-height: 1.5;
  }
</style>
```

**[FILE]** Modifier `src/routes/[matiere]/+page.ts` pour charger depuis Firebase :

```typescript
import type { PageLoad } from "./$types";
import { SubjectsService, NiveauxService } from "$lib/services/firebase-data";
import { SubjectAdapter, NiveauAdapter } from "$lib/services/data-adapters";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  try {
    // Charger la matière depuis Firebase
    const firebaseSubject = await SubjectsService.getById(params.matiere);

    if (!firebaseSubject) {
      throw error(404, `Matière "${params.matiere}" non trouvée`);
    }

    // Charger les niveaux associés
    const firebaseNiveaux = await NiveauxService.getBySubjectId(params.matiere);

    // Adapter les données
    const subject = SubjectAdapter.fromFirebase(firebaseSubject);
    const niveaux = firebaseNiveaux.map(NiveauAdapter.fromFirebase);

    return {
      subject: {
        ...subject,
        niveaux,
      },
    };
  } catch (err) {
    console.error("❌ Erreur chargement matière:", err);
    throw error(500, "Erreur lors du chargement de la matière");
  }
};
```

**[FILE]** Modifier `src/routes/[matiere]/[niveau]/+page.ts` :

```typescript
import type { PageLoad } from "./$types";
import {
  SubjectsService,
  NiveauxService,
  CompetencesService,
} from "$lib/services/firebase-data";
import {
  SubjectAdapter,
  NiveauAdapter,
  CompetenceAdapter,
} from "$lib/services/data-adapters";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  try {
    // Charger matière, niveau et compétences depuis Firebase
    const [firebaseSubject, firebaseNiveau, firebaseCompetences] =
      await Promise.all([
        SubjectsService.getById(params.matiere),
        NiveauxService.getById(params.niveau),
        CompetencesService.getByNiveauId(params.niveau),
      ]);

    if (!firebaseSubject) {
      throw error(404, `Matière "${params.matiere}" non trouvée`);
    }

    if (!firebaseNiveau) {
      throw error(404, `Niveau "${params.niveau}" non trouvé`);
    }

    // Adapter les données
    const subject = SubjectAdapter.fromFirebase(firebaseSubject);
    const niveau = NiveauAdapter.fromFirebase(firebaseNiveau);
    const competences = firebaseCompetences.map(CompetenceAdapter.fromFirebase);

    return {
      subject,
      niveau: {
        ...niveau,
        competences,
      },
    };
  } catch (err) {
    console.error("❌ Erreur chargement niveau:", err);
    throw error(500, "Erreur lors du chargement du niveau");
  }
};
```

**[FILE]** Modifier `src/routes/[matiere]/[niveau]/[competence]/+page.ts` :

```typescript
import type { PageLoad } from "./$types";
import {
  SubjectsService,
  NiveauxService,
  CompetencesService,
  CoursService,
} from "$lib/services/firebase-data";
import {
  SubjectAdapter,
  NiveauAdapter,
  CompetenceAdapter,
  CoursAdapter,
} from "$lib/services/data-adapters";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  try {
    // Charger toutes les données depuis Firebase
    const [firebaseSubject, firebaseNiveau, firebaseCompetence, firebaseCours] =
      await Promise.all([
        SubjectsService.getById(params.matiere),
        NiveauxService.getById(params.niveau),
        CompetencesService.getById(params.competence),
        CoursService.getByCompetenceId(params.competence),
      ]);

    if (!firebaseSubject) {
      throw error(404, `Matière "${params.matiere}" non trouvée`);
    }

    if (!firebaseNiveau) {
      throw error(404, `Niveau "${params.niveau}" non trouvé`);
    }

    if (!firebaseCompetence) {
      throw error(404, `Compétence "${params.competence}" non trouvée`);
    }

    // Adapter les données
    const subject = SubjectAdapter.fromFirebase(firebaseSubject);
    const niveau = NiveauAdapter.fromFirebase(firebaseNiveau);
    const competence = CompetenceAdapter.fromFirebase(firebaseCompetence);
    const cours = firebaseCours.map(CoursAdapter.fromFirebase);

    return {
      subject,
      niveau,
      competence: {
        ...competence,
        cours,
      },
    };
  } catch (err) {
    console.error("❌ Erreur chargement compétence:", err);
    throw error(500, "Erreur lors du chargement de la compétence");
  }
};
```

**[FILE]** Modifier `src/routes/[matiere]/[niveau]/[competence]/[cours]/+page.ts` :

```typescript
import type { PageLoad } from "./$types";
import {
  SubjectsService,
  NiveauxService,
  CompetencesService,
  CoursService,
} from "$lib/services/firebase-data";
import {
  SubjectAdapter,
  NiveauAdapter,
  CompetenceAdapter,
  CoursAdapter,
} from "$lib/services/data-adapters";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  try {
    // Charger toutes les données depuis Firebase
    const [firebaseSubject, firebaseNiveau, firebaseCompetence, firebaseCours] =
      await Promise.all([
        SubjectsService.getById(params.matiere),
        NiveauxService.getById(params.niveau),
        CompetencesService.getById(params.competence),
        CoursService.getById(params.cours),
      ]);

    if (!firebaseSubject) {
      throw error(404, `Matière "${params.matiere}" non trouvée`);
    }

    if (!firebaseNiveau) {
      throw error(404, `Niveau "${params.niveau}" non trouvé`);
    }

    if (!firebaseCompetence) {
      throw error(404, `Compétence "${params.competence}" non trouvée`);
    }

    if (!firebaseCours) {
      throw error(404, `Cours "${params.cours}" non trouvé`);
    }

    // Adapter les données
    const subject = SubjectAdapter.fromFirebase(firebaseSubject);
    const niveau = NiveauAdapter.fromFirebase(firebaseNiveau);
    const competence = CompetenceAdapter.fromFirebase(firebaseCompetence);
    const cours = CoursAdapter.fromFirebase(firebaseCours);

    return {
      subject,
      niveau,
      competence,
      cours,
    };
  } catch (err) {
    console.error("❌ Erreur chargement cours:", err);
    throw error(500, "Erreur lors du chargement du cours");
  }
};
```

### Étape 2.2.5 : Script de migration données de test (30min)

**[FILE]** Créer `scripts/migrate-test-data.js` :

```javascript
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

// Configuration Firebase (remplacer par vos vraies clés)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données de test à migrer
const testData = {
  subjects: [
    {
      nom: "Mathématiques",
      description: "Découvrir les concepts mathématiques fondamentaux",
      couleur: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icone: "🔢",
      ordre: 1,
    },
    {
      nom: "Français",
      description: "Maîtriser la langue française",
      couleur: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icone: "📚",
      ordre: 2,
    },
    {
      nom: "Sciences",
      description: "Explorer le monde qui nous entoure",
      couleur: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icone: "🔬",
      ordre: 3,
    },
  ],

  niveaux: [
    {
      nom: "CP",
      description: "Cours Préparatoire - 6-7 ans",
      couleur: "#10b981",
      ordre: 1,
    },
    {
      nom: "CE1",
      description: "Cours Élémentaire 1 - 7-8 ans",
      couleur: "#3b82f6",
      ordre: 2,
    },
    {
      nom: "CE2",
      description: "Cours Élémentaire 2 - 8-9 ans",
      couleur: "#8b5cf6",
      ordre: 3,
    },
  ],

  competences: [
    {
      titre: "Les nombres jusqu'à 10",
      description: "Apprendre à compter et reconnaître les nombres",
      difficulte: "facile",
      dureeEstimee: 30,
    },
    {
      titre: "L'alphabet",
      description: "Connaître toutes les lettres de l'alphabet",
      difficulte: "facile",
      dureeEstimee: 45,
    },
    {
      titre: "Les additions simples",
      description: "Calculer des additions avec des petits nombres",
      difficulte: "moyen",
      dureeEstimee: 40,
    },
  ],

  cours: [
    {
      titre: "Compter jusqu'à 10",
      description: "Apprendre les chiffres de 1 à 10",
      contenu: `# Compter jusqu'à 10

## Les chiffres
1, 2, 3, 4, 5, 6, 7, 8, 9, 10

## Exercice
Compte les objets et écris le bon chiffre !`,
      type: "cours",
      difficulte: "facile",
      dureeEstimee: 15,
    },
    {
      titre: "Les lettres A à F",
      description: "Découvrir les premières lettres",
      contenu: `# L'alphabet - Première partie

## Les lettres
A - B - C - D - E - F

## Exercice
Écris chaque lettre 3 fois !`,
      type: "cours",
      difficulte: "facile",
      dureeEstimee: 20,
    },
  ],
};

// Fonction de nettoyage (optionnel)
async function clearCollections() {
  console.log("🧹 Nettoyage des collections...");

  const collections = ["subjects", "niveaux", "competences", "cours"];

  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db, collectionName));
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`✅ Collection ${collectionName} nettoyée`);
  }
}

// Fonction de peuplement
async function populateTestData() {
  console.log("🚀 Début de la migration des données de test...\n");

  try {
    // 1. Créer les matières
    console.log("📚 Création des matières...");
    const subjectIds = {};

    for (const subject of testData.subjects) {
      const docRef = await addDoc(collection(db, "subjects"), {
        ...subject,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      subjectIds[subject.nom] = docRef.id;
      console.log(`✅ Matière créée: ${subject.nom} (${docRef.id})`);
    }

    // 2. Créer les niveaux
    console.log("\n📊 Création des niveaux...");
    const niveauIds = {};

    for (const niveau of testData.niveaux) {
      // Associer chaque niveau à chaque matière
      for (const [subjectName, subjectId] of Object.entries(subjectIds)) {
        const docRef = await addDoc(collection(db, "niveaux"), {
          ...niveau,
          subjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        const key = `${subjectName}-${niveau.nom}`;
        niveauIds[key] = {
          id: docRef.id,
          subjectId,
          subjectName,
        };

        console.log(
          `✅ Niveau créé: ${niveau.nom} pour ${subjectName} (${docRef.id})`
        );
      }
    }

    // 3. Créer les compétences
    console.log("\n🎯 Création des compétences...");
    const competenceIds = [];

    let compteurCompetence = 0;
    for (const [niveauKey, niveauData] of Object.entries(niveauIds)) {
      const competence =
        testData.competences[compteurCompetence % testData.competences.length];

      const docRef = await addDoc(collection(db, "competences"), {
        ...competence,
        niveauId: niveauData.id,
        subjectId: niveauData.subjectId,
        ordre: 1,
        prerequis: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      competenceIds.push({
        id: docRef.id,
        niveauId: niveauData.id,
        subjectId: niveauData.subjectId,
        subjectName: niveauData.subjectName,
      });

      console.log(`✅ Compétence créée: ${competence.titre} (${docRef.id})`);
      compteurCompetence++;
    }

    // 4. Créer les cours
    console.log("\n📖 Création des cours...");

    let compteurCours = 0;
    for (const competenceData of competenceIds) {
      const cours = testData.cours[compteurCours % testData.cours.length];

      const docRef = await addDoc(collection(db, "cours"), {
        ...cours,
        competenceId: competenceData.id,
        niveauId: competenceData.niveauId,
        subjectId: competenceData.subjectId,
        ordre: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`✅ Cours créé: ${cours.titre} (${docRef.id})`);
      compteurCours++;
    }

    console.log("\n🎉 Migration terminée avec succès !");
    console.log("\n📊 Résumé:");
    console.log(`- ${testData.subjects.length} matières`);
    console.log(`- ${Object.keys(niveauIds).length} niveaux`);
    console.log(`- ${competenceIds.length} compétences`);
    console.log(`- ${competenceIds.length} cours`);
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
  }
}

// Exécuter la migration
async function main() {
  // Décommenter pour nettoyer avant migration
  // await clearCollections();

  await populateTestData();
  process.exit(0);
}

main();
```

### Étape 2.2.6 : Tests de validation (20min)

**[CMD]** Installation des dépendances de test si nécessaire :

```bash
npm install --save-dev @testing-library/svelte @testing-library/jest-dom vitest
```

**[FILE]** Créer `src/lib/services/__tests__/firebase-data.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubjectsService, NiveauxService } from "../firebase-data";

// Mock Firebase
vi.mock("$lib/firebase/client", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
}));

describe("Firebase Data Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SubjectsService", () => {
    it("should load subjects from Firebase", async () => {
      // Mock de la réponse Firebase
      const mockSnapshot = {
        docs: [
          {
            id: "math-id",
            data: () => ({
              nom: "Mathématiques",
              description: "Math test",
              couleur: "#blue",
              ordre: 1,
            }),
          },
        ],
      };

      const { getDocs } = await import("firebase/firestore");
      vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);

      const subjects = await SubjectsService.getAll();

      expect(subjects).toHaveLength(1);
      expect(subjects[0].nom).toBe("Mathématiques");
      expect(subjects[0].id).toBe("math-id");
    });

    it("should handle Firebase errors gracefully", async () => {
      const { getDocs } = await import("firebase/firestore");
      vi.mocked(getDocs).mockRejectedValue(new Error("Firebase error"));

      const subjects = await SubjectsService.getAll();

      expect(subjects).toEqual([]);
    });
  });

  describe("NiveauxService", () => {
    it("should load niveaux by subject ID", async () => {
      const mockSnapshot = {
        docs: [
          {
            id: "cp-id",
            data: () => ({
              nom: "CP",
              description: "Cours Préparatoire",
              subjectId: "math-id",
              ordre: 1,
            }),
          },
        ],
      };

      const { getDocs } = await import("firebase/firestore");
      vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);

      const niveaux = await NiveauxService.getBySubjectId("math-id");

      expect(niveaux).toHaveLength(1);
      expect(niveaux[0].nom).toBe("CP");
      expect(niveaux[0].subjectId).toBe("math-id");
    });
  });
});
```

---

## ✅ **Critères de validation Phase 2.2**

- [ ] **[CHECK]** Services Firebase CRUD opérationnels pour toutes les collections
- [ ] **[CHECK]** Types Firebase définis et cohérents avec le schema
- [ ] **[CHECK]** Adaptateurs de données fonctionnels (Firebase ↔ App)
- [ ] **[CHECK]** Page d'accueil charge les matières depuis Firebase
- [ ] **[CHECK]** Navigation hierarchique utilise les données Firebase
- [ ] **[CHECK]** États de chargement affichés pendant les requêtes
- [ ] **[CHECK]** Gestion d'erreur gracieuse si Firebase indisponible
- [ ] **[CHECK]** Statistiques globales calculées en temps réel
- [ ] **[CHECK]** Script de migration exécute sans erreur
- [ ] **[CHECK]** Tests unitaires des services passent
- [ ] **[CHECK]** Performance : chargement < 3 secondes
- [ ] **[CHECK]** Console logs : pas d'erreurs Firebase

## 🧪 **Tests de validation spécifiques**

```bash
[TEST] npm run dev                    # Interface charge correctement
[TEST] # Ouvrir console navigateur -> logs Firebase OK
[TEST] # Vérifier données dynamiques au lieu de mock
[TEST] # Tester navigation hierarchique complète
[TEST] # Vérifier statistiques temps réel
[TEST] # Simuler panne réseau -> fallback gracieux
[TEST] node scripts/migrate-test-data.js  # Migration réussie
[TEST] npm run test                   # Tests unitaires passent
```

## 📊 **Objectifs quantitatifs Phase 2.2**

- **Temps de chargement initial** < 3 secondes
- **Requêtes Firebase** optimisées (pas de sur-fetching)
- **Données affichées** = données cohérentes avec Firestore
- **0 données hardcodées** dans les composants finaux
- **Fallback gracieux** : interface par défaut si Firebase échoue
- **Cache local** : éviter requêtes redondantes

## 🎯 **Résultats attendus**

- ✅ **Interface entièrement dynamique** : Plus de données mock
- ✅ **Chargement temps réel** : Données actualisées à chaque visite
- ✅ **Navigation cohérente** : Routes basées sur les IDs Firebase
- ✅ **Performance optimisée** : Requêtes Firebase efficaces
- ✅ **UX améliorée** : Feedback utilisateur pendant chargements
- ✅ **Scalabilité** : Architecture prête pour des milliers de contenus

---

**🚫 STOP** : Ne pas passer à Phase 2.3 sans validation complète de Phase 2.2.

---

**⏭️ NEXT** : Phase 2.3 - Cache & Performance (optimisation requêtes Firebase)
