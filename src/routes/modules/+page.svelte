<!-- 🎯 Module Navigation Page - Phase 8 -->
<script>
  import { onMount } from 'svelte';
  import { curriculumService } from '$lib/services/curriculumService';
  import MainNavigation from '$lib/components/navigation/MainNavigation.svelte';
  
  let modules = [];
  let loading = true;
  
  onMount(async () => {
    try {
      const competences = await curriculumService.getAllCompetences();
      
      // Organiser les compétences par modules
      modules = competences.reduce((acc, comp) => {
        const moduleKey = `${comp.matiere}-${comp.niveau}`;
        if (!acc[moduleKey]) {
          acc[moduleKey] = {
            id: moduleKey,
            title: `${comp.matiereDisplay} - ${comp.niveau}`,
            competences: [],
            matiere: comp.matiere,
            niveau: comp.niveau
          };
        }
        acc[moduleKey].competences.push(comp);
        return acc;
      }, {});
      
      modules = Object.values(modules);
      loading = false;
    } catch (error) {
      console.error('Error loading modules:', error);
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>🎯 Modules - FunLearning</title>
</svelte:head>

<MainNavigation currentRoute="/modules" />

<main class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">🎯 Modules d'Apprentissage</h1>
    <p class="text-gray-600">Explorez les modules organisés par matière et niveau</p>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement des modules...</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each modules as module}
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">
              {#if module.matiere === 'mathematiques'}🔢
              {:else if module.matiere === 'francais'}📚
              {:else if module.matiere === 'sciences'}🔬
              {:else if module.matiere === 'histoire'}🏛️
              {:else}📖{/if}
            </span>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{module.title}</h3>
              <p class="text-sm text-gray-600">{module.competences.length} compétences</p>
            </div>
          </div>
          
          <div class="space-y-2 mb-4">
            {#each module.competences.slice(0, 3) as competence}
              <div class="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2">
                {competence.name}
              </div>
            {/each}
            {#if module.competences.length > 3}
              <div class="text-sm text-gray-500 italic">
                +{module.competences.length - 3} autres compétences
              </div>
            {/if}
          </div>
          
          <button 
            class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            on:click={() => window.location.href = `/curriculum?matiere=${module.matiere}&niveau=${module.niveau}`}
          >
            Explorer le module
          </button>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  .container {
    max-width: 1200px;
  }
</style>
