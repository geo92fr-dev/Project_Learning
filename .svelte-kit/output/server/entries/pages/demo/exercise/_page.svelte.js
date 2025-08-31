import { c as create_ssr_component, d as createEventDispatcher, e as escape, v as validate_component, a as each } from "../../../../chunks/ssr.js";
import { Q as QCMCard } from "../../../../chunks/QCMCard.js";
import { M as MarkdownRenderer } from "../../../../chunks/MarkdownRenderer.js";
const InteractiveExercise_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".interactive-exercise.svelte-1txlzu2.svelte-1txlzu2{max-width:900px;margin:0 auto;padding:2rem;background:white;border-radius:1rem;box-shadow:0 4px 6px rgba(0, 0, 0, 0.05)}.exercise-header.svelte-1txlzu2.svelte-1txlzu2{text-align:center;margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid #e9ecef}.exercise-header.svelte-1txlzu2 h1.svelte-1txlzu2{margin:0 0 1rem 0;color:#2c3e50;font-size:2rem}.exercise-description.svelte-1txlzu2.svelte-1txlzu2{color:#6c757d;font-size:1.1rem;margin-bottom:2rem}.progress-container.svelte-1txlzu2.svelte-1txlzu2{display:flex;flex-direction:column;gap:0.5rem;align-items:center}.progress-bar.svelte-1txlzu2.svelte-1txlzu2{width:100%;max-width:400px;height:0.5rem;background:#e9ecef;border-radius:0.25rem;overflow:hidden}.progress-fill.svelte-1txlzu2.svelte-1txlzu2{height:100%;background:linear-gradient(90deg, #007bff, #0056b3);transition:width 0.3s ease}.progress-text.svelte-1txlzu2.svelte-1txlzu2{font-size:0.875rem;color:#6c757d;font-weight:500}.instructions.svelte-1txlzu2.svelte-1txlzu2{background:#f8f9fa;border:1px solid #e9ecef;border-radius:0.75rem;padding:2rem;margin-bottom:2rem}.question-navigation.svelte-1txlzu2.svelte-1txlzu2{margin-bottom:2rem}.question-tabs.svelte-1txlzu2.svelte-1txlzu2{display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap}.question-tab.svelte-1txlzu2.svelte-1txlzu2{width:3rem;height:3rem;border:2px solid #e9ecef;background:white;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:600;transition:all 0.2s ease;position:relative}.question-tab.svelte-1txlzu2.svelte-1txlzu2:hover{border-color:#007bff}.question-tab.active.svelte-1txlzu2.svelte-1txlzu2{border-color:#007bff;background:#007bff;color:white}.question-tab.answered.svelte-1txlzu2.svelte-1txlzu2{border-color:#6c757d;background:#f8f9fa}.question-tab.correct.svelte-1txlzu2.svelte-1txlzu2{border-color:#28a745;background:#28a745;color:white}.question-tab.incorrect.svelte-1txlzu2.svelte-1txlzu2{border-color:#dc3545;background:#dc3545;color:white}.tab-indicator.svelte-1txlzu2.svelte-1txlzu2{position:absolute;bottom:-0.25rem;right:-0.25rem;width:1rem;height:1rem;background:inherit;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;border:2px solid white}.question-container.svelte-1txlzu2.svelte-1txlzu2{margin-bottom:2rem}.exercise-controls.svelte-1txlzu2.svelte-1txlzu2{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-top:2rem}.btn.svelte-1txlzu2.svelte-1txlzu2{padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;font-weight:500;cursor:pointer;transition:all 0.15s ease;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem}.btn.svelte-1txlzu2.svelte-1txlzu2:disabled{opacity:0.6;cursor:not-allowed}.btn-primary.svelte-1txlzu2.svelte-1txlzu2{background:#007bff;color:white}.btn-primary.svelte-1txlzu2.svelte-1txlzu2:hover:not(:disabled){background:#0056b3}.btn-secondary.svelte-1txlzu2.svelte-1txlzu2{background:#6c757d;color:white}.btn-secondary.svelte-1txlzu2.svelte-1txlzu2:hover:not(:disabled){background:#545b62}.btn-success.svelte-1txlzu2.svelte-1txlzu2{background:#28a745;color:white}.btn-success.svelte-1txlzu2.svelte-1txlzu2:hover:not(:disabled){background:#1e7e34}.exercise-results.svelte-1txlzu2.svelte-1txlzu2{text-align:center}.results-header.svelte-1txlzu2.svelte-1txlzu2{margin-bottom:3rem}.results-header.svelte-1txlzu2 h2.svelte-1txlzu2{margin:0 0 2rem 0;color:#2c3e50;font-size:2rem}.score-display.svelte-1txlzu2.svelte-1txlzu2{display:flex;justify-content:center}.score-circle.svelte-1txlzu2.svelte-1txlzu2{width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg, #667eea, #764ba2);display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;box-shadow:0 8px 25px rgba(0, 0, 0, 0.15)}.score-number.svelte-1txlzu2.svelte-1txlzu2{font-size:2.5rem;font-weight:700;line-height:1}.score-label.svelte-1txlzu2.svelte-1txlzu2{font-size:1rem;opacity:0.9}.results-details.svelte-1txlzu2.svelte-1txlzu2{margin-bottom:3rem;text-align:left}.results-details.svelte-1txlzu2 h3.svelte-1txlzu2{text-align:center;margin-bottom:2rem;color:#495057}.results-grid.svelte-1txlzu2.svelte-1txlzu2{display:grid;gap:1.5rem}.result-item.svelte-1txlzu2.svelte-1txlzu2{background:#f8f9fa;border:1px solid #e9ecef;border-radius:0.75rem;padding:1.5rem}.result-header.svelte-1txlzu2.svelte-1txlzu2{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.question-number.svelte-1txlzu2.svelte-1txlzu2{background:#6c757d;color:white;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.875rem;font-weight:600}.result-indicator.svelte-1txlzu2.svelte-1txlzu2{width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white}.result-indicator.correct.svelte-1txlzu2.svelte-1txlzu2{background:#28a745}.result-indicator.incorrect.svelte-1txlzu2.svelte-1txlzu2{background:#dc3545}.result-question.svelte-1txlzu2.svelte-1txlzu2{font-weight:600;margin-bottom:1rem;color:#495057}.result-answer.svelte-1txlzu2.svelte-1txlzu2,.result-correct.svelte-1txlzu2.svelte-1txlzu2{margin-bottom:0.5rem;color:#6c757d}.result-correct.svelte-1txlzu2.svelte-1txlzu2{color:#28a745}.results-actions.svelte-1txlzu2.svelte-1txlzu2{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap}@media(max-width: 768px){.interactive-exercise.svelte-1txlzu2.svelte-1txlzu2{padding:1rem;margin:1rem}.exercise-header.svelte-1txlzu2 h1.svelte-1txlzu2{font-size:1.5rem}.exercise-controls.svelte-1txlzu2.svelte-1txlzu2{flex-direction:column}.btn.svelte-1txlzu2.svelte-1txlzu2{width:100%;justify-content:center}.question-tabs.svelte-1txlzu2.svelte-1txlzu2{gap:0.25rem}.question-tab.svelte-1txlzu2.svelte-1txlzu2{width:2.5rem;height:2.5rem}.score-circle.svelte-1txlzu2.svelte-1txlzu2{width:120px;height:120px}.score-number.svelte-1txlzu2.svelte-1txlzu2{font-size:2rem}.results-actions.svelte-1txlzu2.svelte-1txlzu2{flex-direction:column}}",
  map: null
};
const InteractiveExercise = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentQuestion;
  let progress;
  let canProceed;
  createEventDispatcher();
  let { exerciseData = {
    id: "math-fractions-demo",
    title: "Les Fractions : Exercice Interactif",
    description: "Testez vos connaissances sur les fractions avec ces questions interactives",
    instruction: `# 🧮 Exercice : Les Fractions

Répondez aux questions suivantes pour tester votre compréhension des fractions.

**Consignes :**
- Lisez chaque question attentivement
- Choisissez la meilleure réponse
- Validez votre réponse avant de passer à la suivante

*Temps recommandé : 10 minutes*`,
    questions: [
      {
        id: "q1",
        question: "Quelle fraction représente la moitié d'une pizza ?",
        options: [
          { id: "a", text: "1/4", isCorrect: false },
          { id: "b", text: "1/2", isCorrect: true },
          { id: "c", text: "2/4", isCorrect: false },
          { id: "d", text: "1/3", isCorrect: false }
        ]
      },
      {
        id: "q2",
        question: "Comment simplifier la fraction 6/8 ?",
        options: [
          { id: "a", text: "2/3", isCorrect: false },
          { id: "b", text: "3/4", isCorrect: true },
          { id: "c", text: "1/2", isCorrect: false },
          {
            id: "d",
            text: "6/8 est déjà simplifiée",
            isCorrect: false
          }
        ]
      },
      {
        id: "q3",
        question: "Que donne 1/4 + 1/4 ?",
        options: [
          { id: "a", text: "2/8", isCorrect: false },
          { id: "b", text: "1/2", isCorrect: true },
          { id: "c", text: "2/4", isCorrect: false },
          { id: "d", text: "1/8", isCorrect: false }
        ]
      },
      {
        id: "q4",
        question: "Laquelle de ces fractions est la plus grande ?",
        options: [
          { id: "a", text: "1/3", isCorrect: false },
          { id: "b", text: "1/4", isCorrect: false },
          { id: "c", text: "1/2", isCorrect: true },
          { id: "d", text: "1/5", isCorrect: false }
        ]
      }
    ]
  } } = $$props;
  let currentQuestionIndex = 0;
  let answers = {};
  let showResults = {};
  if ($$props.exerciseData === void 0 && $$bindings.exerciseData && exerciseData !== void 0)
    $$bindings.exerciseData(exerciseData);
  $$result.css.add(css$1);
  currentQuestion = exerciseData.questions[currentQuestionIndex];
  progress = (currentQuestionIndex + 1) / exerciseData.questions.length * 100;
  canProceed = answers[currentQuestion?.id];
  return `<div class="interactive-exercise svelte-1txlzu2"><header class="exercise-header svelte-1txlzu2"><h1 class="svelte-1txlzu2">${escape(exerciseData.title)}</h1> <p class="exercise-description svelte-1txlzu2">${escape(exerciseData.description)}</p> <div class="progress-container svelte-1txlzu2"><div class="progress-bar svelte-1txlzu2"><div class="progress-fill svelte-1txlzu2" style="${"width: " + escape(progress, true) + "%"}"></div></div> <span class="progress-text svelte-1txlzu2">Question ${escape(currentQuestionIndex + 1)} sur ${escape(exerciseData.questions.length)}</span></div></header> ${`<div class="exercise-content"> ${`<div class="instructions svelte-1txlzu2">${validate_component(MarkdownRenderer, "MarkdownRenderer").$$render($$result, { content: exerciseData.instruction }, {}, {})}</div>`}  <div class="question-navigation svelte-1txlzu2"><div class="question-tabs svelte-1txlzu2">${each(exerciseData.questions, (question, index) => {
    return `<button class="${[
      "question-tab svelte-1txlzu2",
      (index === currentQuestionIndex ? "active" : "") + " " + (answers[question.id] ? "answered" : "") + " " + (answers[question.id]?.isCorrect ? "correct" : "") + " " + (answers[question.id] && !answers[question.id].isCorrect ? "incorrect" : "")
    ].join(" ").trim()}">${escape(index + 1)} ${answers[question.id] ? `<span class="tab-indicator svelte-1txlzu2">${escape(answers[question.id].isCorrect ? "✓" : "✗")} </span>` : ``} </button>`;
  })}</div></div>  ${currentQuestion ? `<div class="question-container svelte-1txlzu2">${validate_component(QCMCard, "QCMCard").$$render(
    $$result,
    {
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer: answers[currentQuestion.id]?.selectedOption,
      showResults: showResults[currentQuestion.id] || false,
      questionNumber: currentQuestionIndex + 1,
      totalQuestions: exerciseData.questions.length
    },
    {},
    {}
  )}</div>` : ``}  <div class="exercise-controls svelte-1txlzu2"><button class="btn btn-secondary svelte-1txlzu2" ${"disabled"}>← Précédent</button> ${!showResults[currentQuestion?.id] ? `<button class="btn btn-primary svelte-1txlzu2" ${!canProceed ? "disabled" : ""}>Valider la réponse</button>` : `${currentQuestionIndex < exerciseData.questions.length - 1 ? `<button class="btn btn-primary svelte-1txlzu2" data-svelte-h="svelte-a4yzhw">Question suivante →</button>` : `<button class="btn btn-success svelte-1txlzu2" data-svelte-h="svelte-1nbcms5">Terminer l&#39;exercice</button>`}`}</div></div>`} </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.exercise-page.svelte-1wa2mlp.svelte-1wa2mlp{min-height:100vh;background:linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)}.container.svelte-1wa2mlp.svelte-1wa2mlp{max-width:1200px;margin:0 auto;padding:0 2rem}.page-header.svelte-1wa2mlp.svelte-1wa2mlp{background:white;border-bottom:1px solid #e9ecef;padding:2rem 0}.breadcrumb.svelte-1wa2mlp.svelte-1wa2mlp{display:flex;align-items:center;gap:0.5rem;margin-bottom:1.5rem;font-size:0.9rem}.breadcrumb.svelte-1wa2mlp a.svelte-1wa2mlp{color:#007bff;text-decoration:none}.breadcrumb.svelte-1wa2mlp a.svelte-1wa2mlp:hover{text-decoration:underline}.separator.svelte-1wa2mlp.svelte-1wa2mlp{color:#6c757d}.current.svelte-1wa2mlp.svelte-1wa2mlp{color:#495057;font-weight:500}.header-content.svelte-1wa2mlp.svelte-1wa2mlp{text-align:center}.header-content.svelte-1wa2mlp h1.svelte-1wa2mlp{margin:0 0 1rem 0;color:#2c3e50;font-size:2.5rem;font-weight:700}.header-content.svelte-1wa2mlp p.svelte-1wa2mlp{margin:0;color:#6c757d;font-size:1.2rem}.page-content.svelte-1wa2mlp.svelte-1wa2mlp{padding:3rem 0}.exercise-wrapper.svelte-1wa2mlp.svelte-1wa2mlp{background:white;border-radius:1rem;box-shadow:0 8px 25px rgba(0, 0, 0, 0.1);overflow:hidden}.completion-celebration.svelte-1wa2mlp.svelte-1wa2mlp{background:white;border-radius:1rem;padding:3rem;text-align:center;box-shadow:0 8px 25px rgba(0, 0, 0, 0.1)}.celebration-content.svelte-1wa2mlp h2.svelte-1wa2mlp{margin:0 0 1rem 0;color:#28a745;font-size:2.5rem}.celebration-content.svelte-1wa2mlp p.svelte-1wa2mlp{margin:0 0 3rem 0;font-size:1.3rem;color:#495057}.next-steps.svelte-1wa2mlp h3.svelte-1wa2mlp{margin:0 0 2rem 0;color:#495057;font-size:1.5rem}.action-grid.svelte-1wa2mlp.svelte-1wa2mlp{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:2rem}.action-card.svelte-1wa2mlp.svelte-1wa2mlp{background:white;border:2px solid #e9ecef;border-radius:1rem;padding:2rem;text-align:center;transition:all 0.3s ease;cursor:pointer;text-decoration:none;color:inherit}.action-card.svelte-1wa2mlp.svelte-1wa2mlp:hover{border-color:#007bff;transform:translateY(-4px);box-shadow:0 8px 25px rgba(0, 123, 255, 0.15)}.action-icon.svelte-1wa2mlp.svelte-1wa2mlp{font-size:3rem;margin-bottom:1rem}.action-card.svelte-1wa2mlp h4.svelte-1wa2mlp{margin:0 0 0.5rem 0;color:#2c3e50;font-size:1.2rem}.action-card.svelte-1wa2mlp p.svelte-1wa2mlp{margin:0;color:#6c757d;font-size:0.9rem;line-height:1.4}.demo-info.svelte-1wa2mlp.svelte-1wa2mlp{background:white;border-top:1px solid #e9ecef;padding:3rem 0}.info-card.svelte-1wa2mlp.svelte-1wa2mlp{background:#f8f9fa;border:1px solid #e9ecef;border-radius:1rem;padding:2rem;margin-bottom:2rem}.info-card.svelte-1wa2mlp h3.svelte-1wa2mlp{margin:0 0 1.5rem 0;color:#2c3e50;font-size:1.3rem}.feature-list.svelte-1wa2mlp.svelte-1wa2mlp{list-style:none;padding:0;margin:0}.feature-list.svelte-1wa2mlp li.svelte-1wa2mlp{margin-bottom:1rem;padding-left:1.5rem;position:relative;line-height:1.5}.feature-list.svelte-1wa2mlp li.svelte-1wa2mlp::before{content:"✨";position:absolute;left:0;top:0}.tech-info.svelte-1wa2mlp h4.svelte-1wa2mlp{margin:0 0 1rem 0;color:#495057;font-size:1.1rem}.tech-tags.svelte-1wa2mlp.svelte-1wa2mlp{display:flex;flex-wrap:wrap;gap:0.5rem}.tech-tag.svelte-1wa2mlp.svelte-1wa2mlp{background:#007bff;color:white;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.875rem;font-weight:500}@media(max-width: 768px){.container.svelte-1wa2mlp.svelte-1wa2mlp{padding:0 1rem}.header-content.svelte-1wa2mlp h1.svelte-1wa2mlp{font-size:2rem}.header-content.svelte-1wa2mlp p.svelte-1wa2mlp{font-size:1rem}.page-content.svelte-1wa2mlp.svelte-1wa2mlp{padding:2rem 0}.completion-celebration.svelte-1wa2mlp.svelte-1wa2mlp{padding:2rem}.celebration-content.svelte-1wa2mlp h2.svelte-1wa2mlp{font-size:2rem}.celebration-content.svelte-1wa2mlp p.svelte-1wa2mlp{font-size:1.1rem}.action-grid.svelte-1wa2mlp.svelte-1wa2mlp{grid-template-columns:1fr;gap:1rem}.action-card.svelte-1wa2mlp.svelte-1wa2mlp{padding:1.5rem}.breadcrumb.svelte-1wa2mlp.svelte-1wa2mlp{font-size:0.8rem;flex-wrap:wrap}.tech-tags.svelte-1wa2mlp.svelte-1wa2mlp{justify-content:center}}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-12wmrmq_START -->${$$result.title = `<title>Exercice Interactif - Fractions - FunLearning</title>`, ""}<meta name="description" content="Exercice interactif sur les fractions avec QCM et évaluation automatique"><!-- HEAD_svelte-12wmrmq_END -->`, ""} <div class="exercise-page svelte-1wa2mlp"><header class="page-header svelte-1wa2mlp" data-svelte-h="svelte-1s2h27i"><div class="container svelte-1wa2mlp"><nav class="breadcrumb svelte-1wa2mlp"><a href="/" class="svelte-1wa2mlp">Accueil</a> <span class="separator svelte-1wa2mlp">→</span> <a href="/demo" class="svelte-1wa2mlp">Démo</a> <span class="separator svelte-1wa2mlp">→</span> <span class="current svelte-1wa2mlp">Exercice Interactif</span></nav> <div class="header-content svelte-1wa2mlp"><h1 class="svelte-1wa2mlp">🎯 Exercices Interactifs</h1> <p class="svelte-1wa2mlp">Découvrez notre système d&#39;exercices avec évaluation automatique et
          feedback personnalisé</p></div></div></header> <main class="page-content svelte-1wa2mlp"><div class="container svelte-1wa2mlp">${`<div class="exercise-wrapper svelte-1wa2mlp">${validate_component(InteractiveExercise, "InteractiveExercise").$$render($$result, {}, {}, {})}</div>`}</div></main> <aside class="demo-info svelte-1wa2mlp" data-svelte-h="svelte-d2dfb6"><div class="container svelte-1wa2mlp"><div class="info-card svelte-1wa2mlp"><h3 class="svelte-1wa2mlp">💡 Fonctionnalités démontrées</h3> <ul class="feature-list svelte-1wa2mlp"><li class="svelte-1wa2mlp"><strong>QCM interactifs</strong> - Questions à choix multiples avec validation
            en temps réel</li> <li class="svelte-1wa2mlp"><strong>Progression visuelle</strong> - Barre de progression et navigation
            entre questions</li> <li class="svelte-1wa2mlp"><strong>Feedback immédiat</strong> - Correction automatique avec explications</li> <li class="svelte-1wa2mlp"><strong>Score calculé</strong> - Évaluation automatique et pourcentage
            de réussite</li> <li class="svelte-1wa2mlp"><strong>Design adaptatif</strong> - Interface responsive pour tous les
            appareils</li> <li class="svelte-1wa2mlp"><strong>Composants réutilisables</strong> - Architecture modulaire pour
            d&#39;autres exercices</li></ul></div> <div class="tech-info svelte-1wa2mlp"><h4 class="svelte-1wa2mlp">🔧 Technologies utilisées</h4> <div class="tech-tags svelte-1wa2mlp"><span class="tech-tag svelte-1wa2mlp">Svelte</span> <span class="tech-tag svelte-1wa2mlp">TypeScript</span> <span class="tech-tag svelte-1wa2mlp">Markdown</span> <span class="tech-tag svelte-1wa2mlp">CSS Grid</span> <span class="tech-tag svelte-1wa2mlp">Animations</span></div></div></div></aside> </div>`;
});
export {
  Page as default
};
