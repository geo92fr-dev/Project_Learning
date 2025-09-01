import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, a as escape, v as validate_component } from "../../../chunks/ssr.js";
import { Q as QCMCard } from "../../../chunks/QCMCard.js";
import { d as derived, w as writable } from "../../../chunks/index2.js";
const initialState = {
  currentExercise: null,
  userAnswer: null,
  result: null,
  isSubmitting: false,
  timeStarted: null,
  collection: null,
  currentIndex: 0
};
const exercisesStore = writable(initialState);
const currentExercise = derived(
  exercisesStore,
  ($store) => $store.currentExercise
);
derived(
  exercisesStore,
  ($store) => $store.currentExercise !== null
);
const exerciseProgress = derived(exercisesStore, ($store) => {
  if (!$store.collection)
    return { current: 0, total: 0, percentage: 0 };
  return {
    current: $store.currentIndex + 1,
    total: $store.collection.exercises.length,
    percentage: Math.round(
      $store.currentIndex / $store.collection.exercises.length * 100
    )
  };
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".test-exercises-page.svelte-1oupcgz.svelte-1oupcgz{min-height:100vh;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:2rem 1rem}.page-header.svelte-1oupcgz.svelte-1oupcgz{text-align:center;color:white;margin-bottom:3rem}.page-header.svelte-1oupcgz h1.svelte-1oupcgz{font-size:2.5rem;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0, 0, 0, 0.3)}.page-header.svelte-1oupcgz p.svelte-1oupcgz{font-size:1.2rem;opacity:0.9}.container.svelte-1oupcgz.svelte-1oupcgz{max-width:800px;margin:0 auto}.progress-section.svelte-1oupcgz.svelte-1oupcgz{background:white;padding:1.5rem;border-radius:12px;margin-bottom:2rem;box-shadow:0 8px 32px rgba(0, 0, 0, 0.1)}.progress-info.svelte-1oupcgz.svelte-1oupcgz{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.progress-text.svelte-1oupcgz.svelte-1oupcgz{font-weight:600;color:#2c3e50}.progress-percentage.svelte-1oupcgz.svelte-1oupcgz{background:linear-gradient(135deg, #667eea, #764ba2);color:white;padding:0.25rem 0.75rem;border-radius:20px;font-size:0.9rem;font-weight:600}.progress-bar.svelte-1oupcgz.svelte-1oupcgz{background:#e9ecef;height:8px;border-radius:4px;overflow:hidden}.progress-fill.svelte-1oupcgz.svelte-1oupcgz{background:linear-gradient(135deg, #667eea, #764ba2);height:100%;transition:width 0.5s ease}.exercise-section.svelte-1oupcgz.svelte-1oupcgz{margin-bottom:2rem}.result-section.svelte-1oupcgz.svelte-1oupcgz{margin-top:2rem}.result-card.svelte-1oupcgz.svelte-1oupcgz{background:white;border-radius:12px;padding:2rem;box-shadow:0 8px 32px rgba(0, 0, 0, 0.1);border-left:4px solid #e74c3c;transition:all 0.3s ease}.result-card.correct.svelte-1oupcgz.svelte-1oupcgz{border-left-color:#27ae60}.result-header.svelte-1oupcgz.svelte-1oupcgz{display:flex;align-items:center;margin-bottom:1.5rem}.result-icon.svelte-1oupcgz.svelte-1oupcgz{font-size:2rem;margin-right:1rem}.result-title.svelte-1oupcgz.svelte-1oupcgz{margin:0;color:#2c3e50;font-size:1.3rem}.result-score.svelte-1oupcgz.svelte-1oupcgz{margin:0.5rem 0 0 0;font-weight:600;color:#7f8c8d}.result-explanation.svelte-1oupcgz.svelte-1oupcgz{background:#f8f9fa;padding:1.5rem;border-radius:8px;margin-bottom:1.5rem;border-left:3px solid #3498db}.result-explanation.svelte-1oupcgz strong.svelte-1oupcgz{color:#2c3e50;display:block;margin-bottom:0.5rem}.result-actions.svelte-1oupcgz.svelte-1oupcgz{text-align:center}.completion-section.svelte-1oupcgz.svelte-1oupcgz{text-align:center}.completion-card.svelte-1oupcgz.svelte-1oupcgz{background:white;padding:3rem 2rem;border-radius:12px;box-shadow:0 8px 32px rgba(0, 0, 0, 0.1)}.completion-icon.svelte-1oupcgz.svelte-1oupcgz{font-size:4rem;margin-bottom:1rem}.completion-card.svelte-1oupcgz h2.svelte-1oupcgz{color:#2c3e50;margin-bottom:1rem}.completion-stats.svelte-1oupcgz.svelte-1oupcgz{display:flex;justify-content:center;gap:2rem;margin:2rem 0}.stat.svelte-1oupcgz.svelte-1oupcgz{text-align:center}.stat-label.svelte-1oupcgz.svelte-1oupcgz{display:block;font-size:0.9rem;color:#7f8c8d;margin-bottom:0.5rem}.stat-value.svelte-1oupcgz.svelte-1oupcgz{display:block;font-size:1.5rem;font-weight:700;color:#2c3e50}.loading-section.svelte-1oupcgz.svelte-1oupcgz{text-align:center;padding:3rem;color:white}.loading-spinner.svelte-1oupcgz.svelte-1oupcgz{font-size:3rem;margin-bottom:1rem;animation:svelte-1oupcgz-spin 2s linear infinite}@keyframes svelte-1oupcgz-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.btn.svelte-1oupcgz.svelte-1oupcgz{background:linear-gradient(135deg, #667eea, #764ba2);color:white;border:none;padding:0.75rem 2rem;border-radius:25px;font-weight:600;cursor:pointer;transition:all 0.3s ease;font-size:1rem}.btn.svelte-1oupcgz.svelte-1oupcgz:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(102, 126, 234, 0.4)}.btn-secondary.svelte-1oupcgz.svelte-1oupcgz{background:linear-gradient(135deg, #95a5a6, #7f8c8d)}.btn-secondary.svelte-1oupcgz.svelte-1oupcgz:hover{box-shadow:0 8px 25px rgba(149, 165, 166, 0.4)}@media(max-width: 768px){.test-exercises-page.svelte-1oupcgz.svelte-1oupcgz{padding:1rem 0.5rem}.page-header.svelte-1oupcgz h1.svelte-1oupcgz{font-size:2rem}.progress-section.svelte-1oupcgz.svelte-1oupcgz{padding:1rem}.completion-stats.svelte-1oupcgz.svelte-1oupcgz{flex-direction:column;gap:1rem}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let progress;
  let exercise;
  let isCollectionComplete;
  let $currentExercise, $$unsubscribe_currentExercise;
  let $exerciseProgress, $$unsubscribe_exerciseProgress;
  $$unsubscribe_currentExercise = subscribe(currentExercise, (value) => $currentExercise = value);
  $$unsubscribe_exerciseProgress = subscribe(exerciseProgress, (value) => $exerciseProgress = value);
  let showResult = false;
  let selectedOptions = [];
  $$result.css.add(css);
  progress = $exerciseProgress;
  exercise = $currentExercise;
  progress.current === progress.total;
  isCollectionComplete = !exercise && progress.current > 0;
  $$unsubscribe_currentExercise();
  $$unsubscribe_exerciseProgress();
  return `  ${$$result.head += `<!-- HEAD_svelte-f9zim5_START -->${$$result.title = `<title>Test Exercices - FunLearning V3.0</title>`, ""}<!-- HEAD_svelte-f9zim5_END -->`, ""} <div class="test-exercises-page svelte-1oupcgz"><header class="page-header svelte-1oupcgz" data-svelte-h="svelte-1jahj6"><h1 class="svelte-1oupcgz">🎯 Test des Exercices - Phase 3</h1> <p class="svelte-1oupcgz">Système d&#39;exercices QCM interactifs avec validation automatique</p></header> <div class="container svelte-1oupcgz">${exercise ? ` <div class="progress-section svelte-1oupcgz"><div class="progress-info svelte-1oupcgz"><span class="progress-text svelte-1oupcgz">Question ${escape(progress.current)} sur ${escape(progress.total)}</span> <span class="progress-percentage svelte-1oupcgz">${escape(progress.percentage)}%</span></div> <div class="progress-bar svelte-1oupcgz"><div class="progress-fill svelte-1oupcgz" style="${"width: " + escape(progress.percentage, true) + "%"}"></div></div></div>  <div class="exercise-section svelte-1oupcgz">${validate_component(QCMCard, "QCMCard").$$render(
    $$result,
    {
      exercise,
      disabled: showResult,
      showResult,
      selectedOptions
    },
    {},
    {}
  )}</div>  ${``}` : `${isCollectionComplete ? ` <div class="completion-section svelte-1oupcgz"><div class="completion-card svelte-1oupcgz"><div class="completion-icon svelte-1oupcgz" data-svelte-h="svelte-1uvgfen">🏆</div> <h2 class="svelte-1oupcgz" data-svelte-h="svelte-1vc9bb8">Quiz terminé !</h2> <p data-svelte-h="svelte-h2c81g">Félicitations ! Vous avez terminé tous les exercices de cette
            collection.</p> <div class="completion-stats svelte-1oupcgz"><div class="stat svelte-1oupcgz"><span class="stat-label svelte-1oupcgz" data-svelte-h="svelte-18drt2j">Questions</span> <span class="stat-value svelte-1oupcgz">${escape(progress.total)}</span></div> <div class="stat svelte-1oupcgz"><span class="stat-label svelte-1oupcgz" data-svelte-h="svelte-19ugd61">Progression</span> <span class="stat-value svelte-1oupcgz">${escape(progress.percentage)}%</span></div></div> <button class="btn btn-secondary svelte-1oupcgz" data-svelte-h="svelte-y4t5sg">🔄 Recommencer</button></div></div>` : ` <div class="loading-section svelte-1oupcgz" data-svelte-h="svelte-4wbx96"><div class="loading-spinner svelte-1oupcgz">⏳</div> <p>Chargement des exercices...</p></div>`}`}</div> </div>`;
});
export {
  Page as default
};
