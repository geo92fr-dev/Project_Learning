import { c as create_ssr_component, d as createEventDispatcher, e as escape, v as validate_component, a as each } from "../../../../chunks/ssr.js";
import { Q as QCMCard } from "../../../../chunks/QCMCard.js";
import { M as MarkdownRenderer } from "../../../../chunks/MarkdownRenderer.js";
const InteractiveExercise_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".interactive-exercise.svelte-e8lhx0.svelte-e8lhx0{max-width:900px;margin:0 auto;padding:2rem;background:white;border-radius:1rem;box-shadow:0 4px 6px rgba(0, 0, 0, 0.05)}.exercise-header.svelte-e8lhx0.svelte-e8lhx0{text-align:center;margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid #e9ecef}.exercise-header.svelte-e8lhx0 h1.svelte-e8lhx0{margin:0 0 1rem 0;color:#2c3e50;font-size:2rem}.exercise-description.svelte-e8lhx0.svelte-e8lhx0{color:#6c757d;font-size:1.1rem;margin-bottom:2rem}.progress-container.svelte-e8lhx0.svelte-e8lhx0{display:flex;flex-direction:column;gap:0.5rem;align-items:center}.progress-bar.svelte-e8lhx0.svelte-e8lhx0{width:100%;max-width:400px;height:0.5rem;background:#e9ecef;border-radius:0.25rem;overflow:hidden}.progress-fill.svelte-e8lhx0.svelte-e8lhx0{height:100%;background:linear-gradient(90deg, #007bff, #0056b3);transition:width 0.3s ease}.progress-text.svelte-e8lhx0.svelte-e8lhx0{font-size:0.875rem;color:#6c757d;font-weight:500}.instructions.svelte-e8lhx0.svelte-e8lhx0{background:#f8f9fa;border:1px solid #e9ecef;border-radius:0.75rem;padding:2rem;margin-bottom:2rem}.question-navigation.svelte-e8lhx0.svelte-e8lhx0{margin-bottom:2rem}.question-tabs.svelte-e8lhx0.svelte-e8lhx0{display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap}.question-tab.svelte-e8lhx0.svelte-e8lhx0{width:3rem;height:3rem;border:2px solid #e9ecef;background:white;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:600;transition:all 0.2s ease;position:relative}.question-tab.svelte-e8lhx0.svelte-e8lhx0:hover{border-color:#007bff}.question-tab.active.svelte-e8lhx0.svelte-e8lhx0{border-color:#007bff;background:#007bff;color:white}.question-tab.answered.svelte-e8lhx0.svelte-e8lhx0{border-color:#6c757d;background:#f8f9fa}.question-tab.correct.svelte-e8lhx0.svelte-e8lhx0{border-color:#28a745;background:#28a745;color:white}.question-tab.incorrect.svelte-e8lhx0.svelte-e8lhx0{border-color:#dc3545;background:#dc3545;color:white}.tab-indicator.svelte-e8lhx0.svelte-e8lhx0{position:absolute;bottom:-0.25rem;right:-0.25rem;width:1rem;height:1rem;background:inherit;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;border:2px solid white}.question-container.svelte-e8lhx0.svelte-e8lhx0{margin-bottom:2rem}.exercise-controls.svelte-e8lhx0.svelte-e8lhx0{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-top:2rem}.btn.svelte-e8lhx0.svelte-e8lhx0{padding:0.75rem 1.5rem;border:none;border-radius:0.5rem;font-weight:500;cursor:pointer;transition:all 0.15s ease;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem}.btn.svelte-e8lhx0.svelte-e8lhx0:disabled{opacity:0.6;cursor:not-allowed}.btn-primary.svelte-e8lhx0.svelte-e8lhx0{background:#007bff;color:white}.btn-primary.svelte-e8lhx0.svelte-e8lhx0:hover:not(:disabled){background:#0056b3}.btn-secondary.svelte-e8lhx0.svelte-e8lhx0{background:#6c757d;color:white}.btn-secondary.svelte-e8lhx0.svelte-e8lhx0:hover:not(:disabled){background:#545b62}.btn-success.svelte-e8lhx0.svelte-e8lhx0{background:#28a745;color:white}.btn-success.svelte-e8lhx0.svelte-e8lhx0:hover:not(:disabled){background:#1e7e34}.exercise-results.svelte-e8lhx0.svelte-e8lhx0{text-align:center}.results-header.svelte-e8lhx0.svelte-e8lhx0{margin-bottom:3rem}.results-header.svelte-e8lhx0 h2.svelte-e8lhx0{margin:0 0 2rem 0;color:#2c3e50;font-size:2rem}.score-display.svelte-e8lhx0.svelte-e8lhx0{display:flex;justify-content:center}.score-circle.svelte-e8lhx0.svelte-e8lhx0{width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg, #667eea, #764ba2);display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;box-shadow:0 8px 25px rgba(0, 0, 0, 0.15)}.score-number.svelte-e8lhx0.svelte-e8lhx0{font-size:2.5rem;font-weight:700;line-height:1}.score-label.svelte-e8lhx0.svelte-e8lhx0{font-size:1rem;opacity:0.9}.results-details.svelte-e8lhx0.svelte-e8lhx0{margin-bottom:3rem;text-align:left}.results-details.svelte-e8lhx0 h3.svelte-e8lhx0{text-align:center;margin-bottom:2rem;color:#495057}.results-grid.svelte-e8lhx0.svelte-e8lhx0{display:grid;gap:1.5rem}.result-item.svelte-e8lhx0.svelte-e8lhx0{background:#f8f9fa;border:1px solid #e9ecef;border-radius:0.75rem;padding:1.5rem}.result-header.svelte-e8lhx0.svelte-e8lhx0{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.question-number.svelte-e8lhx0.svelte-e8lhx0{background:#6c757d;color:white;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.875rem;font-weight:600}.result-indicator.svelte-e8lhx0.svelte-e8lhx0{width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:white}.result-indicator.correct.svelte-e8lhx0.svelte-e8lhx0{background:#28a745}.result-indicator.incorrect.svelte-e8lhx0.svelte-e8lhx0{background:#dc3545}.result-question.svelte-e8lhx0.svelte-e8lhx0{font-weight:600;margin-bottom:1rem;color:#495057}.result-answer.svelte-e8lhx0.svelte-e8lhx0,.result-correct.svelte-e8lhx0.svelte-e8lhx0{margin-bottom:0.5rem;color:#6c757d}.result-correct.svelte-e8lhx0.svelte-e8lhx0{color:#28a745}.results-actions.svelte-e8lhx0.svelte-e8lhx0{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap}@media(max-width: 768px){.interactive-exercise.svelte-e8lhx0.svelte-e8lhx0{padding:1rem;margin:1rem}.exercise-header.svelte-e8lhx0 h1.svelte-e8lhx0{font-size:1.5rem}.exercise-controls.svelte-e8lhx0.svelte-e8lhx0{flex-direction:column}.btn.svelte-e8lhx0.svelte-e8lhx0{width:100%;justify-content:center}.question-tabs.svelte-e8lhx0.svelte-e8lhx0{gap:0.25rem}.question-tab.svelte-e8lhx0.svelte-e8lhx0{width:2.5rem;height:2.5rem}.score-circle.svelte-e8lhx0.svelte-e8lhx0{width:120px;height:120px}.score-number.svelte-e8lhx0.svelte-e8lhx0{font-size:2rem}.results-actions.svelte-e8lhx0.svelte-e8lhx0{flex-direction:column}}",
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
  return `<div class="interactive-exercise svelte-e8lhx0"><header class="exercise-header svelte-e8lhx0"><h1 class="svelte-e8lhx0">${escape(exerciseData.title)}</h1> <p class="exercise-description svelte-e8lhx0">${escape(exerciseData.description)}</p> <div class="progress-container svelte-e8lhx0"><div class="progress-bar svelte-e8lhx0"><div class="progress-fill svelte-e8lhx0" style="${"width: " + escape(progress, true) + "%"}"></div></div> <span class="progress-text svelte-e8lhx0">Question ${escape(currentQuestionIndex + 1)} sur ${escape(exerciseData.questions.length)}</span></div></header> ${`<div class="exercise-content"> ${`<div class="instructions svelte-e8lhx0">${validate_component(MarkdownRenderer, "MarkdownRenderer").$$render($$result, { content: exerciseData.instruction }, {}, {})}</div>`}  <div class="question-navigation svelte-e8lhx0"><div class="question-tabs svelte-e8lhx0">${each(exerciseData.questions, (question, index) => {
    return `<button class="${[
      "question-tab svelte-e8lhx0",
      (index === currentQuestionIndex ? "active" : "") + " " + (answers[question.id] ? "answered" : "") + " " + (answers[question.id]?.isCorrect ? "correct" : "") + " " + (answers[question.id] && !answers[question.id].isCorrect ? "incorrect" : "")
    ].join(" ").trim()}">${escape(index + 1)} ${answers[question.id] ? `<span class="tab-indicator svelte-e8lhx0">${escape(answers[question.id].isCorrect ? "✓" : "✗")} </span>` : ``} </button>`;
  })}</div></div>  ${currentQuestion ? `<div class="question-container svelte-e8lhx0">${validate_component(QCMCard, "QCMCard").$$render(
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
  )}</div>` : ``}  <div class="exercise-controls svelte-e8lhx0"><button class="btn btn-secondary svelte-e8lhx0" ${"disabled"}>← Précédent</button> ${!showResults[currentQuestion?.id] ? `<button class="btn btn-primary svelte-e8lhx0" ${!canProceed ? "disabled" : ""}>Valider la réponse</button>` : `${currentQuestionIndex < exerciseData.questions.length - 1 ? `<button class="btn btn-primary svelte-e8lhx0" data-svelte-h="svelte-etx2x8">Question suivante →</button>` : `<button class="btn btn-success svelte-e8lhx0" data-svelte-h="svelte-1wtjp">Terminer l&#39;exercice</button>`}`}</div></div>`} </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".exercise-page.svelte-1rrcxkd.svelte-1rrcxkd{min-height:100vh;background:linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)}.container.svelte-1rrcxkd.svelte-1rrcxkd{max-width:1200px;margin:0 auto;padding:0 2rem}.page-header.svelte-1rrcxkd.svelte-1rrcxkd{background:white;border-bottom:1px solid #e9ecef;padding:2rem 0}.breadcrumb.svelte-1rrcxkd.svelte-1rrcxkd{display:flex;align-items:center;gap:0.5rem;margin-bottom:1.5rem;font-size:0.9rem}.breadcrumb.svelte-1rrcxkd a.svelte-1rrcxkd{color:#007bff;text-decoration:none}.breadcrumb.svelte-1rrcxkd a.svelte-1rrcxkd:hover{text-decoration:underline}.separator.svelte-1rrcxkd.svelte-1rrcxkd{color:#6c757d}.current.svelte-1rrcxkd.svelte-1rrcxkd{color:#495057;font-weight:500}.header-content.svelte-1rrcxkd.svelte-1rrcxkd{text-align:center}.header-content.svelte-1rrcxkd h1.svelte-1rrcxkd{margin:0 0 1rem 0;color:#2c3e50;font-size:2.5rem;font-weight:700}.header-content.svelte-1rrcxkd p.svelte-1rrcxkd{margin:0;color:#6c757d;font-size:1.2rem}.page-content.svelte-1rrcxkd.svelte-1rrcxkd{padding:3rem 0}.exercise-wrapper.svelte-1rrcxkd.svelte-1rrcxkd{background:white;border-radius:1rem;box-shadow:0 8px 25px rgba(0, 0, 0, 0.1);overflow:hidden}.completion-celebration.svelte-1rrcxkd.svelte-1rrcxkd{background:white;border-radius:1rem;padding:3rem;text-align:center;box-shadow:0 8px 25px rgba(0, 0, 0, 0.1)}.celebration-content.svelte-1rrcxkd h2.svelte-1rrcxkd{margin:0 0 1rem 0;color:#28a745;font-size:2.5rem}.celebration-content.svelte-1rrcxkd p.svelte-1rrcxkd{margin:0 0 3rem 0;font-size:1.3rem;color:#495057}.next-steps.svelte-1rrcxkd h3.svelte-1rrcxkd{margin:0 0 2rem 0;color:#495057;font-size:1.5rem}.action-grid.svelte-1rrcxkd.svelte-1rrcxkd{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:2rem}.action-card.svelte-1rrcxkd.svelte-1rrcxkd{background:white;border:2px solid #e9ecef;border-radius:1rem;padding:2rem;text-align:center;transition:all 0.3s ease;cursor:pointer;text-decoration:none;color:inherit}.action-card.svelte-1rrcxkd.svelte-1rrcxkd:hover{border-color:#007bff;transform:translateY(-4px);box-shadow:0 8px 25px rgba(0, 123, 255, 0.15)}.action-icon.svelte-1rrcxkd.svelte-1rrcxkd{font-size:3rem;margin-bottom:1rem}.action-card.svelte-1rrcxkd h4.svelte-1rrcxkd{margin:0 0 0.5rem 0;color:#2c3e50;font-size:1.2rem}.action-card.svelte-1rrcxkd p.svelte-1rrcxkd{margin:0;color:#6c757d;font-size:0.9rem;line-height:1.4}.demo-info.svelte-1rrcxkd.svelte-1rrcxkd{background:white;border-top:1px solid #e9ecef;padding:3rem 0}.info-card.svelte-1rrcxkd.svelte-1rrcxkd{background:#f8f9fa;border:1px solid #e9ecef;border-radius:1rem;padding:2rem;margin-bottom:2rem}.info-card.svelte-1rrcxkd h3.svelte-1rrcxkd{margin:0 0 1.5rem 0;color:#2c3e50;font-size:1.3rem}.feature-list.svelte-1rrcxkd.svelte-1rrcxkd{list-style:none;padding:0;margin:0}.feature-list.svelte-1rrcxkd li.svelte-1rrcxkd{margin-bottom:1rem;padding-left:1.5rem;position:relative;line-height:1.5}.feature-list.svelte-1rrcxkd li.svelte-1rrcxkd::before{content:'✨';position:absolute;left:0;top:0}.tech-info.svelte-1rrcxkd h4.svelte-1rrcxkd{margin:0 0 1rem 0;color:#495057;font-size:1.1rem}.tech-tags.svelte-1rrcxkd.svelte-1rrcxkd{display:flex;flex-wrap:wrap;gap:0.5rem}.tech-tag.svelte-1rrcxkd.svelte-1rrcxkd{background:#007bff;color:white;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.875rem;font-weight:500}@media(max-width: 768px){.container.svelte-1rrcxkd.svelte-1rrcxkd{padding:0 1rem}.header-content.svelte-1rrcxkd h1.svelte-1rrcxkd{font-size:2rem}.header-content.svelte-1rrcxkd p.svelte-1rrcxkd{font-size:1rem}.page-content.svelte-1rrcxkd.svelte-1rrcxkd{padding:2rem 0}.completion-celebration.svelte-1rrcxkd.svelte-1rrcxkd{padding:2rem}.celebration-content.svelte-1rrcxkd h2.svelte-1rrcxkd{font-size:2rem}.celebration-content.svelte-1rrcxkd p.svelte-1rrcxkd{font-size:1.1rem}.action-grid.svelte-1rrcxkd.svelte-1rrcxkd{grid-template-columns:1fr;gap:1rem}.action-card.svelte-1rrcxkd.svelte-1rrcxkd{padding:1.5rem}.breadcrumb.svelte-1rrcxkd.svelte-1rrcxkd{font-size:0.8rem;flex-wrap:wrap}.tech-tags.svelte-1rrcxkd.svelte-1rrcxkd{justify-content:center}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-wamlqg_START -->${$$result.title = `<title>Exercice Interactif - Fractions - FunLearning</title>`, ""}<meta name="description" content="Exercice interactif sur les fractions avec QCM et évaluation automatique"><!-- HEAD_svelte-wamlqg_END -->`, ""} <div class="exercise-page svelte-1rrcxkd"><header class="page-header svelte-1rrcxkd" data-svelte-h="svelte-15wa4nm"><div class="container svelte-1rrcxkd"><nav class="breadcrumb svelte-1rrcxkd"><a href="/" class="svelte-1rrcxkd">Accueil</a> <span class="separator svelte-1rrcxkd">→</span> <a href="/demo" class="svelte-1rrcxkd">Démo</a> <span class="separator svelte-1rrcxkd">→</span> <span class="current svelte-1rrcxkd">Exercice Interactif</span></nav> <div class="header-content svelte-1rrcxkd"><h1 class="svelte-1rrcxkd">🎯 Exercices Interactifs</h1> <p class="svelte-1rrcxkd">Découvrez notre système d&#39;exercices avec évaluation automatique et feedback personnalisé</p></div></div></header> <main class="page-content svelte-1rrcxkd"><div class="container svelte-1rrcxkd">${`<div class="exercise-wrapper svelte-1rrcxkd">${validate_component(InteractiveExercise, "InteractiveExercise").$$render($$result, {}, {}, {})}</div>`}</div></main> <aside class="demo-info svelte-1rrcxkd" data-svelte-h="svelte-ef4aco"><div class="container svelte-1rrcxkd"><div class="info-card svelte-1rrcxkd"><h3 class="svelte-1rrcxkd">💡 Fonctionnalités démontrées</h3> <ul class="feature-list svelte-1rrcxkd"><li class="svelte-1rrcxkd"><strong>QCM interactifs</strong> - Questions à choix multiples avec validation en temps réel</li> <li class="svelte-1rrcxkd"><strong>Progression visuelle</strong> - Barre de progression et navigation entre questions</li> <li class="svelte-1rrcxkd"><strong>Feedback immédiat</strong> - Correction automatique avec explications</li> <li class="svelte-1rrcxkd"><strong>Score calculé</strong> - Évaluation automatique et pourcentage de réussite</li> <li class="svelte-1rrcxkd"><strong>Design adaptatif</strong> - Interface responsive pour tous les appareils</li> <li class="svelte-1rrcxkd"><strong>Composants réutilisables</strong> - Architecture modulaire pour d&#39;autres exercices</li></ul></div> <div class="tech-info svelte-1rrcxkd"><h4 class="svelte-1rrcxkd">🔧 Technologies utilisées</h4> <div class="tech-tags svelte-1rrcxkd"><span class="tech-tag svelte-1rrcxkd">Svelte</span> <span class="tech-tag svelte-1rrcxkd">TypeScript</span> <span class="tech-tag svelte-1rrcxkd">Markdown</span> <span class="tech-tag svelte-1rrcxkd">CSS Grid</span> <span class="tech-tag svelte-1rrcxkd">Animations</span></div></div></div></aside> </div>`;
});
export {
  Page as default
};
