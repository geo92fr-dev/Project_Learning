import { b as null_to_empty } from "./utils.js";
import { c as create_ssr_component, d as createEventDispatcher, e as escape, a as each, b as add_attribute } from "./ssr.js";
const QCMCard_svelte_svelte_type_style_lang = "";
const css = {
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
  $$result.css.add(css);
  canSubmit = !disabled && localSelected.length > 0;
  return `   <div class="qcm-exercise svelte-63fe2j"><div class="exercise-header svelte-63fe2j"><div class="exercise-meta svelte-63fe2j"><span class="${"difficulty difficulty-" + escape(exercise.difficulty, true) + " svelte-63fe2j"}">${escape(exercise.difficulty)}</span> <span class="points svelte-63fe2j">${escape(exercise.points)} pts</span> ${exercise.timeLimit ? `<span class="time-limit svelte-63fe2j">⏱️ ${escape(exercise.timeLimit)}s</span>` : ``}</div> <h3 class="exercise-title svelte-63fe2j">${escape(exercise.title)}</h3> ${exercise.description ? `<p class="exercise-description svelte-63fe2j">${escape(exercise.description)}</p>` : ``}</div> <div class="question-section svelte-63fe2j"><h4 class="question svelte-63fe2j">${escape(exercise.question)}</h4> <p class="instruction svelte-63fe2j">${escape(exercise.multipleCorrect ? "📝 Sélectionnez toutes les bonnes réponses" : "📝 Sélectionnez la bonne réponse")}</p></div> <div class="options-list svelte-63fe2j">${each(exercise.options, (option) => {
    return `<label class="${escape(null_to_empty(getOptionClass(option)), true) + " svelte-63fe2j"}"><input${add_attribute("type", exercise.multipleCorrect ? "checkbox" : "radio", 0)} name="${"qcm-" + escape(exercise.id, true)}"${add_attribute("value", option.id, 0)} ${localSelected.includes(option.id) ? "checked" : ""} ${disabled ? "disabled" : ""} class="svelte-63fe2j"> <div class="option-content svelte-63fe2j"><span class="option-text svelte-63fe2j">${escape(option.text)}</span> ${showResult && localSelected.includes(option.id) && option.explanation ? `<div class="option-explanation svelte-63fe2j">💡 ${escape(option.explanation)} </div>` : ``}</div> <div class="option-indicator svelte-63fe2j">${showResult ? `${option.isCorrect ? `✅` : `${localSelected.includes(option.id) ? `❌` : ``}`}` : ``}</div> </label>`;
  })}</div> ${!showResult ? `<div class="exercise-actions svelte-63fe2j"><button class="${["submit-btn svelte-63fe2j", !canSubmit ? "disabled" : ""].join(" ").trim()}" ${disabled ? "disabled" : ""}>${localSelected.length === 0 ? `Sélectionnez une réponse` : `Valider (${escape(localSelected.length)} sélectionnée${escape(localSelected.length > 1 ? "s" : "")})`}</button></div>` : ``} ${showResult && exercise.explanation ? `<div class="exercise-explanation svelte-63fe2j"><h5 class="svelte-63fe2j" data-svelte-h="svelte-uxlros">💡 Explication</h5> <p class="svelte-63fe2j">${escape(exercise.explanation)}</p></div>` : ``} </div>`;
});
export {
  QCMCard as Q
};
