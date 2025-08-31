import { c as create_ssr_component, d as createEventDispatcher, e as escape, b as each, f as null_to_empty, h as add_attribute, s as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import { d as derived, w as writable } from "../../../chunks/index.js";
const QCMCard_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".qcm-exercise.svelte-63fe2j.svelte-63fe2j{max-width:800px;margin:0 auto;padding:1.5rem;background:white;border-radius:12px;box-shadow:0 2px 12px rgba(0, 0, 0, 0.1)}.exercise-header.svelte-63fe2j.svelte-63fe2j{border-bottom:2px solid #f0f0f0;padding-bottom:1rem;margin-bottom:1.5rem}.exercise-meta.svelte-63fe2j.svelte-63fe2j{display:flex;gap:1rem;margin-bottom:0.5rem;font-size:0.9rem}.difficulty.svelte-63fe2j.svelte-63fe2j{padding:0.25rem 0.75rem;border-radius:20px;font-weight:500;text-transform:capitalize}.difficulty-debutant.svelte-63fe2j.svelte-63fe2j{background:#e8f5e8;color:#2d6b2d}.difficulty-intermediaire.svelte-63fe2j.svelte-63fe2j{background:#fff3cd;color:#856404}.difficulty-avance.svelte-63fe2j.svelte-63fe2j{background:#f8d7da;color:#721c24}.difficulty-expert.svelte-63fe2j.svelte-63fe2j{background:#d1ecf1;color:#0c5460}.points.svelte-63fe2j.svelte-63fe2j,.time-limit.svelte-63fe2j.svelte-63fe2j{padding:0.25rem 0.75rem;background:#f8f9fa;border-radius:20px;color:#6c757d}.exercise-title.svelte-63fe2j.svelte-63fe2j{font-size:1.5rem;font-weight:600;color:#2c3e50;margin:0}.exercise-description.svelte-63fe2j.svelte-63fe2j{color:#6c757d;margin:0.5rem 0 0 0;line-height:1.5}.question-section.svelte-63fe2j.svelte-63fe2j{margin-bottom:1.5rem}.question.svelte-63fe2j.svelte-63fe2j{font-size:1.2rem;font-weight:500;color:#2c3e50;margin:0 0 0.5rem 0;line-height:1.4}.instruction.svelte-63fe2j.svelte-63fe2j{color:#6c757d;font-style:italic;margin:0}.options-list.svelte-63fe2j.svelte-63fe2j{display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem}.option-card.svelte-63fe2j.svelte-63fe2j{display:flex;align-items:flex-start;padding:1rem;border:2px solid #e9ecef;border-radius:8px;cursor:pointer;transition:all 0.2s ease;background:white}.option-card.svelte-63fe2j.svelte-63fe2j:hover{border-color:#007bff;background:#f8f9ff}.option-card.selected.svelte-63fe2j.svelte-63fe2j{border-color:#007bff;background:#e7f3ff}.option-card.correct.svelte-63fe2j.svelte-63fe2j{border-color:#28a745;background:#f8fff8}.option-card.incorrect.svelte-63fe2j.svelte-63fe2j{border-color:#dc3545;background:#fff8f8}.option-card.svelte-63fe2j input.svelte-63fe2j{margin-right:1rem;margin-top:0.1rem}.option-content.svelte-63fe2j.svelte-63fe2j{flex:1}.option-text.svelte-63fe2j.svelte-63fe2j{display:block;font-weight:500;color:#2c3e50;line-height:1.4}.option-explanation.svelte-63fe2j.svelte-63fe2j{margin-top:0.5rem;padding:0.5rem;background:#f8f9fa;border-radius:4px;font-size:0.9rem;color:#6c757d}.option-indicator.svelte-63fe2j.svelte-63fe2j{font-size:1.2rem;margin-left:0.5rem}.exercise-actions.svelte-63fe2j.svelte-63fe2j{display:flex;justify-content:center;padding-top:1rem}.submit-btn.svelte-63fe2j.svelte-63fe2j{padding:0.75rem 2rem;background:#007bff;color:white;border:none;border-radius:6px;font-size:1rem;font-weight:500;cursor:pointer;transition:all 0.2s ease}.submit-btn.svelte-63fe2j.svelte-63fe2j:hover:not(.disabled){background:#0056b3;transform:translateY(-1px)}.submit-btn.disabled.svelte-63fe2j.svelte-63fe2j{background:#6c757d;cursor:not-allowed;opacity:0.6}.exercise-explanation.svelte-63fe2j.svelte-63fe2j{margin-top:1.5rem;padding:1rem;background:#f8f9fa;border-radius:8px;border-left:4px solid #007bff}.exercise-explanation.svelte-63fe2j h5.svelte-63fe2j{margin:0 0 0.5rem 0;color:#2c3e50}.exercise-explanation.svelte-63fe2j p.svelte-63fe2j{margin:0;color:#6c757d;line-height:1.5}@media(max-width: 768px){.qcm-exercise.svelte-63fe2j.svelte-63fe2j{padding:1rem}.exercise-meta.svelte-63fe2j.svelte-63fe2j{flex-wrap:wrap;gap:0.5rem}.exercise-title.svelte-63fe2j.svelte-63fe2j{font-size:1.3rem}.question.svelte-63fe2j.svelte-63fe2j{font-size:1.1rem}.option-card.svelte-63fe2j.svelte-63fe2j{padding:0.75rem}}",
  map: null
};
const QCMCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let canSubmit;
  let { exercise } = $$props;
  let { disabled = false } = $$props;
  let { showResult = false } = $$props;
  let { selectedOptions = [] } = $$props;
  createEventDispatcher();
  let localSelected = [...selectedOptions];
  function getOptionClass(option) {
    const baseClass = "option-card";
    const isSelected = localSelected.includes(option.id);
    if (!showResult) {
      return `${baseClass} ${isSelected ? "selected" : ""}`;
    }
    if (option.isCorrect) {
      return `${baseClass} correct ${isSelected ? "selected" : ""}`;
    } else if (isSelected) {
      return `${baseClass} incorrect selected`;
    }
    return `${baseClass} ${isSelected ? "selected" : ""}`;
  }
  if ($$props.exercise === void 0 && $$bindings.exercise && exercise !== void 0)
    $$bindings.exercise(exercise);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.showResult === void 0 && $$bindings.showResult && showResult !== void 0)
    $$bindings.showResult(showResult);
  if ($$props.selectedOptions === void 0 && $$bindings.selectedOptions && selectedOptions !== void 0)
    $$bindings.selectedOptions(selectedOptions);
  $$result.css.add(css$1);
  canSubmit = !disabled && localSelected.length > 0;
  return `   <div class="qcm-exercise svelte-63fe2j"><div class="exercise-header svelte-63fe2j"><div class="exercise-meta svelte-63fe2j"><span class="${"difficulty difficulty-" + escape(exercise.difficulty, true) + " svelte-63fe2j"}">${escape(exercise.difficulty)}</span> <span class="points svelte-63fe2j">${escape(exercise.points)} pts</span> ${exercise.timeLimit ? `<span class="time-limit svelte-63fe2j">⏱️ ${escape(exercise.timeLimit)}s</span>` : ``}</div> <h3 class="exercise-title svelte-63fe2j">${escape(exercise.title)}</h3> ${exercise.description ? `<p class="exercise-description svelte-63fe2j">${escape(exercise.description)}</p>` : ``}</div> <div class="question-section svelte-63fe2j"><h4 class="question svelte-63fe2j">${escape(exercise.question)}</h4> <p class="instruction svelte-63fe2j">${escape(exercise.multipleCorrect ? "📝 Sélectionnez toutes les bonnes réponses" : "📝 Sélectionnez la bonne réponse")}</p></div> <div class="options-list svelte-63fe2j">${each(exercise.options, (option) => {
    return `<label class="${escape(null_to_empty(getOptionClass(option)), true) + " svelte-63fe2j"}"><input${add_attribute("type", exercise.multipleCorrect ? "checkbox" : "radio", 0)} name="${"qcm-" + escape(exercise.id, true)}"${add_attribute("value", option.id, 0)} ${localSelected.includes(option.id) ? "checked" : ""} ${disabled ? "disabled" : ""} class="svelte-63fe2j"> <div class="option-content svelte-63fe2j"><span class="option-text svelte-63fe2j">${escape(option.text)}</span> ${showResult && localSelected.includes(option.id) && option.explanation ? `<div class="option-explanation svelte-63fe2j">💡 ${escape(option.explanation)} </div>` : ``}</div> <div class="option-indicator svelte-63fe2j">${showResult ? `${option.isCorrect ? `✅` : `${localSelected.includes(option.id) ? `❌` : ``}`}` : ``}</div> </label>`;
  })}</div> ${!showResult ? `<div class="exercise-actions svelte-63fe2j"><button class="${["submit-btn svelte-63fe2j", !canSubmit ? "disabled" : ""].join(" ").trim()}" ${disabled ? "disabled" : ""}>${localSelected.length === 0 ? `Sélectionnez une réponse` : `Valider (${escape(localSelected.length)} sélectionnée${escape(localSelected.length > 1 ? "s" : "")})`}</button></div>` : ``} ${showResult && exercise.explanation ? `<div class="exercise-explanation svelte-63fe2j"><h5 class="svelte-63fe2j" data-svelte-h="svelte-uxlros">💡 Explication</h5> <p class="svelte-63fe2j">${escape(exercise.explanation)}</p></div>` : ``} </div>`;
});
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
