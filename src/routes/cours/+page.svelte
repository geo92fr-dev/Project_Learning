<script lang="ts">
  import { onMount } from "svelte";
  import { coursesByCategory, courseActions } from "$lib/stores/content.js";
  import type { CourseContent } from "$lib/types/content.js";

  // Données de cours d'exemple pour la démo
  const sampleCourses: CourseContent[] = [
    {
      id: "javascript-basics",
      slug: "javascript-bases",
      metadata: {
        title: "Les bases de JavaScript",
        description:
          "Apprenez les fondamentaux de JavaScript : variables, fonctions, objets",
        level: "beginner",
        duration: 120,
        category: "Développement Web",
        tags: ["javascript", "programmation", "web"],
        author: "FunLearning",
        createdAt: new Date("2025-08-30"),
        updatedAt: new Date("2025-08-30"),
      },
      content:
        "# Les bases de JavaScript\n\n## Introduction\n\nJavaScript est un langage de programmation dynamique.",
      order: 1,
      isPublished: true,
    },
    {
      id: "svelte-intro",
      slug: "introduction-svelte",
      metadata: {
        title: "Introduction à Svelte",
        description:
          "Découvrez Svelte, le framework qui compile vers du JavaScript vanilla",
        level: "intermediate",
        duration: 90,
        category: "Frameworks Frontend",
        tags: ["svelte", "framework", "frontend"],
        author: "FunLearning",
        createdAt: new Date("2025-08-30"),
        updatedAt: new Date("2025-08-30"),
      },
      content:
        "# Introduction à Svelte\n\n## Qu'est-ce que Svelte ?\n\nSvelte est un framework qui compile vos composants.",
      order: 2,
      isPublished: true,
    },
  ];

  onMount(() => {
    // Charge les cours d'exemple
    courseActions.loadCourses(sampleCourses);
  });

  function getLevelBadgeClass(level: string): string {
    switch (level) {
      case "beginner":
        return "badge-success";
      case "intermediate":
        return "badge-warning";
      case "advanced":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  }

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
    }
    return `${mins}min`;
  }
</script>

<svelte:head>
  <title>Cours - FunLearning</title>
  <meta
    name="description"
    content="Découvrez nos cours interactifs pour apprendre le développement web"
  />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-center mb-4">📚 Nos Cours</h1>
    <p class="text-lg text-center text-gray-600">
      Explorez notre catalogue de cours interactifs et progressez à votre rythme
    </p>
  </header>

  {#if $coursesByCategory && Object.keys($coursesByCategory).length > 0}
    {#each Object.entries($coursesByCategory) as [category, categoryCourses]}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6 text-blue-600">{category}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each categoryCourses as course}
            <div
              class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div class="card-body">
                <h3 class="card-title text-lg">
                  {course.metadata.title}
                  <div
                    class="badge {getLevelBadgeClass(course.metadata.level)}"
                  >
                    {course.metadata.level}
                  </div>
                </h3>

                <p class="text-sm text-gray-600 mb-4">
                  {course.metadata.description}
                </p>

                <div class="flex flex-wrap gap-1 mb-4">
                  {#each course.metadata.tags as tag}
                    <span class="badge badge-outline badge-sm">{tag}</span>
                  {/each}
                </div>

                <div
                  class="flex justify-between items-center text-sm text-gray-500 mb-4"
                >
                  <span>⏱️ {formatDuration(course.metadata.duration)}</span>
                  <span>👤 {course.metadata.author}</span>
                </div>

                <div class="card-actions justify-end">
                  <a href="/cours/{course.slug}" class="btn btn-primary btn-sm">
                    Commencer
                  </a>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  {:else}
    <div class="text-center py-12">
      <div class="loading loading-spinner loading-lg" />
      <p class="mt-4 text-gray-600">Chargement des cours...</p>
    </div>
  {/if}
</div>

<style>
  .badge-success {
    background-color: rgb(34 197 94);
    color: white;
  }
  .badge-warning {
    background-color: rgb(245 158 11);
    color: white;
  }
  .badge-error {
    background-color: rgb(239 68 68);
    color: white;
  }
  .badge-neutral {
    background-color: rgb(107 114 128);
    color: white;
  }
</style>
