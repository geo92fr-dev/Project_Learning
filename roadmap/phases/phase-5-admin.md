# ⚙️ Phase 5 : Admin & Import (1 semaine) - v1.5

## 🎯 Contexte IA

**Objectif** : Interface d'administration pour la gestion de contenu et import/export de données.
**Version cible** : v1.5 (solution professionnelle)
**Pré-requis** : Phase 4 validée, PWA fonctionnelle

## 🚀 Instructions d'implémentation

### Étape 5.1 : Interface d'administration

**[FILE]** Créer `src/routes/admin/+layout.svelte` :

```svelte
<script lang="ts">
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    authStore.subscribe((auth) => {
      if (!auth.user || !auth.user.isAdmin) {
        goto("/");
      }
    });
  });
</script>

<div class="admin-layout">
  <nav class="admin-nav">
    <a href="/admin/courses">Cours</a>
    <a href="/admin/users">Utilisateurs</a>
    <a href="/admin/analytics">Analytics</a>
    <a href="/admin/import">Import/Export</a>
  </nav>

  <main class="admin-content">
    <slot />
  </main>
</div>
```

### Étape 5.2 : Gestion de contenu

**[FILE]** Créer `src/routes/admin/courses/+page.svelte` :

```svelte
<script lang="ts">
  import type { Course } from "$lib/types/content";
  import { coursesStore } from "$lib/stores/courses";
  import CourseEditor from "$lib/components/admin/CourseEditor.svelte";

  let courses: Course[] = [];
  let editingCourse: Course | null = null;
  let showEditor = false;

  const handleEdit = (course: Course) => {
    editingCourse = course;
    showEditor = true;
  };

  const handleCreate = () => {
    editingCourse = null;
    showEditor = true;
  };
</script>

<div class="courses-admin">
  <header>
    <h1>Gestion des Cours</h1>
    <button on:click={handleCreate}>Nouveau Cours</button>
  </header>

  <div class="courses-grid">
    {#each courses as course}
      <div class="course-card">
        <h3>{course.title}</h3>
        <p>Compétences: {course.competences.length}</p>
        <div class="actions">
          <button on:click={() => handleEdit(course)}>Éditer</button>
          <button class="danger">Supprimer</button>
        </div>
      </div>
    {/each}
  </div>

  {#if showEditor}
    <CourseEditor
      course={editingCourse}
      on:save={handleSave}
      on:cancel={() => (showEditor = false)}
    />
  {/if}
</div>
```

### Étape 5.3 : Import/Export de données

**[FILE]** Créer `src/lib/admin/dataManager.ts` :

```typescript
interface ImportOptions {
  format: "json" | "csv" | "markdown";
  validate: boolean;
  overwrite: boolean;
  batchSize: number;
}

export class DataManager {
  async importCourses(
    file: File,
    options: ImportOptions
  ): Promise<ImportResult> {
    const content = await file.text();

    switch (options.format) {
      case "json":
        return this.importFromJSON(content, options);
      case "csv":
        return this.importFromCSV(content, options);
      case "markdown":
        return this.importFromMarkdown(content, options);
      default:
        throw new Error("Format non supporté");
    }
  }

  async exportCourses(
    courseIds: string[],
    format: "json" | "csv"
  ): Promise<Blob> {
    const courses = await this.getCourses(courseIds);

    switch (format) {
      case "json":
        return new Blob([JSON.stringify(courses, null, 2)], {
          type: "application/json",
        });
      case "csv":
        return this.generateCSV(courses);
      default:
        throw new Error("Format d'export non supporté");
    }
  }

  private async importFromJSON(
    content: string,
    options: ImportOptions
  ): Promise<ImportResult> {
    const data = JSON.parse(content);

    if (options.validate) {
      await this.validateData(data);
    }

    const results = {
      total: data.courses.length,
      imported: 0,
      errors: [],
    };

    for (const courseData of data.courses) {
      try {
        await this.createOrUpdateCourse(courseData, options.overwrite);
        results.imported++;
      } catch (error) {
        results.errors.push({
          course: courseData.title,
          error: error.message,
        });
      }
    }

    return results;
  }
}
```

### Étape 5.4 : Analytics et métriques

**[FILE]** Créer `src/routes/admin/analytics/+page.svelte` :

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import type { AnalyticsData } from "$lib/types/analytics";
  import Chart from "$lib/components/admin/Chart.svelte";

  let analyticsData: AnalyticsData;
  let loading = true;

  onMount(async () => {
    try {
      analyticsData = await fetchAnalytics();
    } finally {
      loading = false;
    }
  });

  async function fetchAnalytics(): Promise<AnalyticsData> {
    // Récupération des données analytics
  }
</script>

<div class="analytics-dashboard">
  <h1>Analytics</h1>

  {#if loading}
    <div class="loading">Chargement des données...</div>
  {:else}
    <div class="metrics-grid">
      <div class="metric-card">
        <h3>Utilisateurs Actifs</h3>
        <span class="metric-value">{analyticsData.activeUsers}</span>
      </div>

      <div class="metric-card">
        <h3>Cours Complétés</h3>
        <span class="metric-value">{analyticsData.completedCourses}</span>
      </div>

      <div class="metric-card">
        <h3>Taux de Réussite</h3>
        <span class="metric-value">{analyticsData.successRate}%</span>
      </div>
    </div>

    <Chart data={analyticsData.progressionChart} type="line" />
  {/if}
</div>
```

### Étape 5.5 : Permissions et sécurité

**[FILE]** Créer `src/lib/admin/permissions.ts` :

```typescript
export enum Permission {
  READ_COURSES = "read:courses",
  WRITE_COURSES = "write:courses",
  DELETE_COURSES = "delete:courses",
  MANAGE_USERS = "manage:users",
  VIEW_ANALYTICS = "view:analytics",
  IMPORT_DATA = "import:data",
  EXPORT_DATA = "export:data",
}

export class PermissionManager {
  static hasPermission(user: User, permission: Permission): boolean {
    return user.permissions?.includes(permission) || user.role === "admin";
  }

  static requirePermission(permission: Permission) {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        const user = getCurrentUser();
        if (!PermissionManager.hasPermission(user, permission)) {
          throw new Error("Permission insuffisante");
        }
        return originalMethod.apply(this, args);
      };
    };
  }
}
```

## 🧪 Tests de validation Phase 5

### Tests obligatoires

1. **[TEST]** `npm run test:admin` - Tests interface admin passent
2. **[TEST]** `npm run test:import` - Tests import/export passent
3. **[TEST]** `npm run test:permissions` - Tests permissions passent
4. **[CHECK]** `npm run validate 5` - Validation complète Phase 5

### Critères de validation obligatoires

- ✅ Interface d'administration accessible
- ✅ Gestion de contenu fonctionnelle
- ✅ Import/export de données opérationnel
- ✅ Analytics et métriques affichées
- ✅ Système de permissions sécurisé
- ✅ Tests de sécurité validés

**🚫 STOP** : Ne pas passer à Phase 6 sans validation complète de Phase 5.

---

**Phase 5 terminée** ✅ → Prête pour **Phase 6 : Polish & Performance**
