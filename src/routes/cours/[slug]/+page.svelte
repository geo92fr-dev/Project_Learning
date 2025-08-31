<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { currentCourse, courseActions } from "$lib/stores/content.js";
  import { markdownToHtml } from "$lib/services/markdown.js";

  // Fonction utilitaire pour formater les niveaux
  function getLevelLabel(level: string): string {
    const labels: Record<string, string> = {
      beginner: "🟢 Débutant",
      intermediate: "🟡 Intermédiaire",
      advanced: "🔴 Avancé",
    };
    return labels[level] || level;
  }

  let htmlContent = "";
  let isLoading = true;

  const sampleCourses = [
    {
      id: "javascript-basics",
      slug: "javascript-bases",
      metadata: {
        title: "Les bases de JavaScript",
        description: "Apprenez les fondamentaux de JavaScript",
        level: "beginner" as const,
        duration: 120,
        category: "Développement Web",
        tags: ["javascript", "programmation"],
        author: "FunLearning",
        createdAt: new Date("2025-08-30"),
        updatedAt: new Date("2025-08-30"),
      },
      content:
        "# Les bases de JavaScript\n\nJavaScript est un langage de programmation dynamique.",
      order: 1,
      isPublished: true,
    },
    {
      id: "svelte-intro",
      slug: "introduction-svelte",
      metadata: {
        title: "Introduction à Svelte",
        description: "Découvrez Svelte",
        level: "intermediate" as const,
        duration: 90,
        category: "Frameworks",
        tags: ["svelte", "framework"],
        author: "FunLearning",
        createdAt: new Date("2025-08-30"),
        updatedAt: new Date("2025-08-30"),
      },
      content: "# Introduction à Svelte\n\nSvelte est un framework moderne.",
      order: 2,
      isPublished: true,
    },
  ];

  onMount(async () => {
    courseActions.loadCourses(sampleCourses);

    const slug = $page.params.slug;
    courseActions.selectCourse(slug);

    const unsubscribe = currentCourse.subscribe(async (course) => {
      if (course) {
        htmlContent = await markdownToHtml(course.content);
        isLoading = false;
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  {#if $currentCourse}
    <title>{$currentCourse.metadata.title} - FunLearning</title>
  {/if}
</svelte:head>

<div class="container mx-auto px-4 py-8">
  {#if isLoading}
    <div class="text-center py-12">
      <div class="loading loading-spinner loading-lg" />
      <p class="mt-4">Chargement du cours...</p>
    </div>
  {:else if $currentCourse}
    <header class="mb-8">
      <nav class="breadcrumbs text-sm mb-4">
        <ul>
          <li><a href="/">Accueil</a></li>
          <li><a href="/cours">Cours</a></li>
          <li>{$currentCourse.metadata.title}</li>
        </ul>
      </nav>

      <div class="bg-base-200 rounded-lg p-6">
        <h1 class="text-3xl font-bold mb-4">{$currentCourse.metadata.title}</h1>
        <p class="text-lg mb-4">{$currentCourse.metadata.description}</p>

        <div class="flex gap-4 items-center">
          <span class="badge badge-primary"
            >{getLevelLabel($currentCourse.metadata.level)}</span
          >
          <span class="text-sm">⏱️ {$currentCourse.metadata.duration}min</span>
          <span class="text-sm">👤 {$currentCourse.metadata.author}</span>
        </div>
      </div>
    </header>

    <main class="prose max-w-none">
      <!-- svelte-ignore a11y-no-at-html-tags -->
      <!-- HTML content is sanitized by DOMPurify in markdownToHtml service -->
      {@html htmlContent}
    </main>

    <footer class="mt-12 pt-8 border-t flex justify-between">
      <a href="/cours" class="btn btn-outline">← Retour aux cours</a>
      <button class="btn btn-primary">Marquer comme terminé ✓</button>
    </footer>
  {:else}
    <div class="text-center py-12">
      <h1 class="text-2xl font-bold mb-4">Cours non trouvé</h1>
      <a href="/cours" class="btn btn-primary">Voir tous les cours</a>
    </div>
  {/if}
</div>

<style>
  .prose :global(h1) {
    font-size: 2rem;
    font-weight: bold;
    color: #2563eb;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .prose :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #3b82f6;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .prose :global(pre) {
    background-color: #1f2937;
    color: #10b981;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  .prose :global(code) {
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: "Courier New", monospace;
  }

  .prose :global(pre code) {
    background-color: transparent;
    padding: 0;
    color: #10b981;
  }
</style>
