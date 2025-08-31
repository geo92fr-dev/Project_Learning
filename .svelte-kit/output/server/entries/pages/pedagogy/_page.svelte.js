import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, e as escape, d as add_attribute, b as each, v as validate_component } from "../../../chunks/ssr.js";
import { d as derived, w as writable } from "../../../chunks/index2.js";
const pedagogyState = writable({
  currentUserId: null,
  assessmentInProgress: false,
  currentAssessment: null,
  lastAssessmentResult: null,
  currentReflection: null,
  activePrompts: [],
  recentInsights: [],
  personalizedPath: null,
  recommendedResources: [],
  currentProgress: null,
  showMetacognitionModal: false,
  showAssessmentModal: false,
  showInsightsPanel: false
});
derived(
  pedagogyState,
  ($state) => {
    if (!$state.currentUserId)
      return null;
    return null;
  }
);
const assessmentProgress = derived(
  pedagogyState,
  ($state) => {
    if (!$state.currentAssessment)
      return null;
    const { currentQuestionIndex, questions } = $state.currentAssessment;
    return {
      current: currentQuestionIndex + 1,
      total: questions.length,
      percentage: Math.round((currentQuestionIndex + 1) / questions.length * 100)
    };
  }
);
derived(
  pedagogyState,
  ($state) => $state.recentInsights.filter((insight) => insight.priority === "high")
);
derived(
  pedagogyState,
  ($state) => $state.recommendedResources.slice(0, 3)
);
const AssessmentWidget_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".assessment-container.svelte-dm1qgz{max-width:800px;margin:0 auto}.question-card.svelte-dm1qgz{min-height:200px}.radio.svelte-dm1qgz{transform:scale(1.1)}.stats.svelte-dm1qgz{box-shadow:none}.stat.svelte-dm1qgz{padding:1rem}.progress.svelte-dm1qgz{height:8px}.badge.svelte-dm1qgz{font-size:0.75rem}.card.svelte-dm1qgz{box-shadow:none;border:1px solid hsl(var(--b3))}.results-container.svelte-dm1qgz{animation:svelte-dm1qgz-slideUp 0.5s ease-out}@keyframes svelte-dm1qgz-slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@media(max-width: 768px){.stats.svelte-dm1qgz{display:flex;flex-direction:column}.stat.svelte-dm1qgz{text-align:center}}",
  map: null
};
function formatLevel(level) {
  const levels = {
    beginner: "🟢 Débutant",
    intermediate: "🟡 Intermédiaire",
    advanced: "🔴 Avancé"
  };
  return levels[level] || level;
}
function getScoreColor(percentage) {
  if (percentage >= 80)
    return "text-success";
  if (percentage >= 60)
    return "text-warning";
  return "text-error";
}
const AssessmentWidget = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let assessmentState;
  let progress;
  let result;
  let $assessmentProgress, $$unsubscribe_assessmentProgress;
  let $pedagogyState, $$unsubscribe_pedagogyState;
  $$unsubscribe_assessmentProgress = subscribe(assessmentProgress, (value) => $assessmentProgress = value);
  $$unsubscribe_pedagogyState = subscribe(pedagogyState, (value) => $pedagogyState = value);
  let { domain = "javascript" } = $$props;
  let { questionCount = 3 } = $$props;
  let currentQuestion = null;
  let selectedAnswer = null;
  let showResult = false;
  if ($$props.domain === void 0 && $$bindings.domain && domain !== void 0)
    $$bindings.domain(domain);
  if ($$props.questionCount === void 0 && $$bindings.questionCount && questionCount !== void 0)
    $$bindings.questionCount(questionCount);
  $$result.css.add(css$1);
  assessmentState = $pedagogyState;
  progress = $assessmentProgress;
  result = assessmentState.lastAssessmentResult;
  {
    if (assessmentState.currentAssessment) {
      const { questions, currentQuestionIndex } = assessmentState.currentAssessment;
      currentQuestion = questions[currentQuestionIndex] || null;
      if (currentQuestionIndex >= questions.length) {
        showResult = true;
      }
    }
  }
  $$unsubscribe_assessmentProgress();
  $$unsubscribe_pedagogyState();
  return `<div class="assessment-container bg-base-100 rounded-lg shadow-lg p-6 svelte-dm1qgz"><div class="mb-6"><h2 class="text-2xl font-bold mb-2">🧠 Évaluation : ${escape(domain)}</h2> <p class="text-base-content/70" data-svelte-h="svelte-1ua6ehl">Répondez aux questions pour adapter votre parcours d&#39;apprentissage</p></div> ${!assessmentState.assessmentInProgress && !showResult ? ` <div class="text-center py-8"><div class="mb-4" data-svelte-h="svelte-f9cklc"><span class="text-6xl">🎯</span></div> <h3 class="text-xl font-semibold mb-4" data-svelte-h="svelte-h56bz4">Prêt pour l&#39;évaluation ?</h3> <p class="mb-6 text-base-content/70" data-svelte-h="svelte-1yr2x90">Cette évaluation nous aidera à personnaliser votre expérience d&#39;apprentissage</p> <button class="btn btn-primary btn-lg" data-svelte-h="svelte-i9t4c5">🚀 Commencer l&#39;évaluation</button></div>` : `${assessmentState.assessmentInProgress && currentQuestion && !showResult ? ` <div class="assessment-content"> ${progress ? `<div class="mb-6"><div class="flex justify-between text-sm mb-2"><span>Question ${escape(progress.current)} sur ${escape(progress.total)}</span> <span>${escape(progress.percentage)}%</span></div> <progress class="progress progress-primary w-full svelte-dm1qgz"${add_attribute("value", progress.percentage, 0)} max="100"></progress></div>` : ``}  <div class="question-card bg-base-200 rounded-lg p-6 mb-6 svelte-dm1qgz"><div class="flex items-start gap-3 mb-4"><span class="badge badge-outline svelte-dm1qgz">${escape(currentQuestion.difficulty)}</span> <span class="badge badge-primary svelte-dm1qgz">${escape(currentQuestion.concept)}</span></div> <h3 class="text-lg font-semibold mb-4">${escape(currentQuestion.question)}</h3>  ${currentQuestion.type === "multiple-choice" && currentQuestion.options ? `<div class="space-y-3">${each(currentQuestion.options, (option, index) => {
    return `<label class="cursor-pointer"><input type="radio"${add_attribute("value", index, 0)} class="radio radio-primary mr-3 svelte-dm1qgz"${index === selectedAnswer ? add_attribute("checked", true, 1) : ""}> <span class="text-base">${escape(option)}</span> </label>`;
  })}</div>` : ``} ${currentQuestion.type === "true-false" ? `<div class="flex gap-4"><label class="cursor-pointer"><input type="radio" value="true" class="radio radio-primary mr-2 svelte-dm1qgz"${""}> <span data-svelte-h="svelte-14rwksx">✅ Vrai</span></label> <label class="cursor-pointer"><input type="radio" value="false" class="radio radio-primary mr-2 svelte-dm1qgz"${""}> <span data-svelte-h="svelte-1yqcxt2">❌ Faux</span></label></div>` : ``}</div>  <div class="flex justify-between"><button class="btn btn-outline" data-svelte-h="svelte-dtmpgw">Annuler</button> <button class="btn btn-primary" ${"disabled"}>${escape(progress && progress.current === progress.total ? "Terminer" : "Suivant")}
          →</button></div></div>` : `${showResult && result ? ` <div class="results-container svelte-dm1qgz"> <div class="text-center mb-8"><div class="text-6xl mb-4">${result.percentage >= 80 ? `🎉` : `${result.percentage >= 60 ? `👍` : `💪`}`}</div> <h3 class="text-2xl font-bold mb-2" data-svelte-h="svelte-1dbh62u">Évaluation terminée !</h3> <div class="stats bg-base-200 rounded-lg mb-4 svelte-dm1qgz"><div class="stat svelte-dm1qgz"><div class="stat-title" data-svelte-h="svelte-7gzw0e">Score</div> <div class="${"stat-value " + escape(getScoreColor(result.percentage), true) + " svelte-dm1qgz"}">${escape(result.score)}/${escape(result.maxScore)}</div> <div class="stat-desc">${escape(result.percentage)}%</div></div> <div class="stat svelte-dm1qgz"><div class="stat-title" data-svelte-h="svelte-1d8wr1c">Niveau</div> <div class="stat-value text-lg">${escape(formatLevel(result.level))}</div></div></div></div>  <div class="grid md:grid-cols-2 gap-6 mb-8"> ${result.strengths.length > 0 ? `<div class="card bg-success/10 border border-success/20 svelte-dm1qgz"><div class="card-body"><h4 class="card-title text-success" data-svelte-h="svelte-or740c">✅ Vos forces</h4> <ul class="space-y-1">${each(result.strengths, (strength) => {
    return `<li class="flex items-center gap-2"><span class="w-2 h-2 bg-success rounded-full"></span> <span class="capitalize">${escape(strength)}</span> </li>`;
  })}</ul></div></div>` : ``}  ${result.weaknesses.length > 0 ? `<div class="card bg-warning/10 border border-warning/20 svelte-dm1qgz"><div class="card-body"><h4 class="card-title text-warning" data-svelte-h="svelte-16oirtn">🎯 À améliorer</h4> <ul class="space-y-1">${each(result.weaknesses, (weakness) => {
    return `<li class="flex items-center gap-2"><span class="w-2 h-2 bg-warning rounded-full"></span> <span class="capitalize">${escape(weakness)}</span> </li>`;
  })}</ul></div></div>` : ``}</div>  ${result.recommendations.length > 0 ? `<div class="mb-8"><h4 class="text-xl font-semibold mb-4" data-svelte-h="svelte-rm28fh">📚 Cours recommandés</h4> <div class="space-y-3">${each(result.recommendations, (rec) => {
    return `<div class="card bg-base-200 svelte-dm1qgz"><div class="card-body p-4"><div class="flex justify-between items-start"><div><h5 class="font-semibold">${escape(rec.courseId)}</h5> <p class="text-sm text-base-content/70 mb-2">${escape(rec.reason)}</p> <div class="flex gap-2"><span class="${"badge badge-" + escape(
      rec.priority === "high" ? "error" : rec.priority === "medium" ? "warning" : "info",
      true
    ) + " svelte-dm1qgz"}">${escape(rec.priority)}</span> <span class="badge badge-outline svelte-dm1qgz">⏱️ ${escape(rec.estimatedDuration)}min</span> </div></div> <button class="btn btn-sm btn-primary" data-svelte-h="svelte-1s9de8">Commencer</button> </div></div> </div>`;
  })}</div></div>` : ``}  <div class="flex justify-center gap-4"><button class="btn btn-outline" data-svelte-h="svelte-1eatfwf">🔄 Refaire l&#39;évaluation</button> <button class="btn btn-primary" data-svelte-h="svelte-1ik1dc7">🎓 Voir les cours recommandés</button></div></div>` : ``}`}`} </div>`;
});
const MetacognitionWidget_svelte_svelte_type_style_lang = "";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".tabs.svelte-17unheq.svelte-17unheq{margin:0 auto;max-width:fit-content}.demo-content.svelte-17unheq.svelte-17unheq{min-height:60vh}.stat.svelte-17unheq.svelte-17unheq{padding:1rem;box-shadow:none}.card.svelte-17unheq.svelte-17unheq{box-shadow:none;border:1px solid hsl(var(--b3))}.alert.svelte-17unheq.svelte-17unheq{padding:0.75rem}.demo-content.svelte-17unheq>div.svelte-17unheq{animation:svelte-17unheq-fadeIn 0.3s ease-out}@keyframes svelte-17unheq-fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media(max-width: 768px){.tabs.svelte-17unheq.svelte-17unheq{width:100%}.tab.svelte-17unheq.svelte-17unheq{flex:1;font-size:0.875rem}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPedagogyState;
  let $pedagogyState, $$unsubscribe_pedagogyState;
  $$unsubscribe_pedagogyState = subscribe(pedagogyState, (value) => $pedagogyState = value);
  $$result.css.add(css);
  currentPedagogyState = $pedagogyState;
  currentPedagogyState.recentInsights;
  $$unsubscribe_pedagogyState();
  return `${$$result.head += `<!-- HEAD_svelte-qx1zj3_START -->${$$result.title = `<title>Phase 2.5 : Pédagogie Avancée - Démo</title>`, ""}<!-- HEAD_svelte-qx1zj3_END -->`, ""} <div class="container mx-auto px-4 py-8"> <header class="text-center mb-12" data-svelte-h="svelte-bt0y0e"><div class="mb-4"><span class="text-6xl">🧠</span></div> <h1 class="text-4xl font-bold mb-4">Phase 2.5 : Pédagogie Avancée</h1> <p class="text-xl text-base-content/70 max-w-2xl mx-auto">Découvrez les fonctionnalités d&#39;apprentissage adaptatif : pré-évaluation, métacognition et ressources personnalisées</p></header>  <div class="tabs tabs-boxed justify-center mb-8 svelte-17unheq"><button class="${"tab " + escape("tab-active", true) + " svelte-17unheq"}">🎯 Pré-évaluation</button> <button class="${"tab " + escape("", true) + " svelte-17unheq"}">💭 Métacognition</button> <button class="${"tab " + escape("", true) + " svelte-17unheq"}">🎓 Ressources Adaptatives</button></div>  <div class="demo-content svelte-17unheq">${` <div class="mb-8 svelte-17unheq"><div class="bg-base-200 rounded-lg p-6 mb-6" data-svelte-h="svelte-rrnudn"><h2 class="text-2xl font-bold mb-4">🎯 Système de Pré-évaluation</h2> <p class="text-base-content/70 mb-4">Le système évalue automatiquement le niveau de l&#39;apprenant et adapte le contenu en conséquence.</p> <div class="grid md:grid-cols-3 gap-4 mb-6"><div class="stat bg-base-100 rounded-lg svelte-17unheq"><div class="stat-figure text-primary"><span class="text-2xl">📊</span></div> <div class="stat-title">Questions</div> <div class="stat-value text-lg">Adaptatives</div> <div class="stat-desc">Niveau ajusté automatiquement</div></div> <div class="stat bg-base-100 rounded-lg svelte-17unheq"><div class="stat-figure text-secondary"><span class="text-2xl">🎯</span></div> <div class="stat-title">Recommandations</div> <div class="stat-value text-lg">Personnalisées</div> <div class="stat-desc">Basées sur les résultats</div></div> <div class="stat bg-base-100 rounded-lg svelte-17unheq"><div class="stat-figure text-accent"><span class="text-2xl">📈</span></div> <div class="stat-title">Parcours</div> <div class="stat-value text-lg">Optimisé</div> <div class="stat-desc">Séquence adaptée</div></div></div></div>  ${validate_component(AssessmentWidget, "AssessmentWidget").$$render($$result, { domain: "javascript", questionCount: 3 }, {}, {})}</div>`}</div>  <div class="text-center mt-12" data-svelte-h="svelte-pu41mp"><a href="/" class="btn btn-outline">← Retour à l&#39;accueil</a></div> </div>`;
});
export {
  Page as default
};
