import { c as create_ssr_component, b as add_attribute, e as escape, v as validate_component } from "../../../../chunks/ssr.js";
import { M as MarkdownRenderer } from "../../../../chunks/MarkdownRenderer.js";
import { e as estimateReadingTime, g as generateSlug } from "../../../../chunks/content2.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.demo-page.svelte-bybbqr.svelte-bybbqr{min-height:100vh;background:#f8f9fa}.container.svelte-bybbqr.svelte-bybbqr{max-width:1200px;margin:0 auto;padding:0 2rem}.demo-header.svelte-bybbqr.svelte-bybbqr{background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;padding:3rem 0;text-align:center}.demo-header.svelte-bybbqr h1.svelte-bybbqr{margin:0 0 1rem 0;font-size:2.5rem;font-weight:700}.demo-header.svelte-bybbqr p.svelte-bybbqr{margin:0;font-size:1.2rem;opacity:0.9}.demo-controls.svelte-bybbqr.svelte-bybbqr{background:white;border-bottom:1px solid #e9ecef;padding:2rem 0}.control-section.svelte-bybbqr.svelte-bybbqr{margin-bottom:2rem}.control-section.svelte-bybbqr h3.svelte-bybbqr{margin:0 0 1rem 0;color:#495057;font-size:1.1rem}.content-types.svelte-bybbqr.svelte-bybbqr{display:flex;gap:1rem;flex-wrap:wrap}.type-btn.svelte-bybbqr.svelte-bybbqr{padding:0.75rem 1.5rem;border:2px solid #e9ecef;background:white;border-radius:0.5rem;cursor:pointer;transition:all 0.2s ease;font-weight:500}.type-btn.svelte-bybbqr.svelte-bybbqr:hover{border-color:#007bff;background:#f8f9ff}.type-btn.active.svelte-bybbqr.svelte-bybbqr{border-color:#007bff;background:#007bff;color:white}.checkbox-label.svelte-bybbqr.svelte-bybbqr{display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-weight:500;color:#495057}.checkbox-label.svelte-bybbqr input.svelte-bybbqr{margin:0}.content-meta.svelte-bybbqr.svelte-bybbqr{display:flex;gap:2rem;flex-wrap:wrap;padding:1rem;background:#f8f9fa;border-radius:0.5rem;border:1px solid #e9ecef}.meta-item.svelte-bybbqr.svelte-bybbqr{display:flex;gap:0.5rem}.meta-label.svelte-bybbqr.svelte-bybbqr{font-weight:600;color:#6c757d}.meta-value.svelte-bybbqr.svelte-bybbqr{color:#495057;font-family:"SF Mono", Monaco, Consolas, monospace;background:white;padding:0.125rem 0.375rem;border-radius:0.25rem;border:1px solid #dee2e6;font-size:0.875rem}.demo-content.svelte-bybbqr.svelte-bybbqr{padding:3rem 0}.content-wrapper.svelte-bybbqr.svelte-bybbqr{background:white;border-radius:1rem;padding:3rem;box-shadow:0 4px 6px rgba(0, 0, 0, 0.05);border:1px solid #e9ecef}.demo-footer.svelte-bybbqr.svelte-bybbqr{background:#2c3e50;color:white;padding:3rem 0}.features-showcase.svelte-bybbqr h3.svelte-bybbqr{margin:0 0 2rem 0;text-align:center;font-size:1.5rem}.features-grid.svelte-bybbqr.svelte-bybbqr{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:2rem}.feature.svelte-bybbqr.svelte-bybbqr{text-align:center;padding:1.5rem;background:rgba(255, 255, 255, 0.1);border-radius:0.75rem;backdrop-filter:blur(10px)}.feature-icon.svelte-bybbqr.svelte-bybbqr{font-size:2rem;margin-bottom:1rem}.feature.svelte-bybbqr h4.svelte-bybbqr{margin:0 0 0.5rem 0;font-size:1.1rem;color:#ecf0f1}.feature.svelte-bybbqr p.svelte-bybbqr{margin:0;opacity:0.9;font-size:0.9rem;line-height:1.4}.demo-markdown{font-size:1.1rem;line-height:1.7}.demo-markdown h1{color:#2c3e50;border-bottom:3px solid #3498db}.demo-markdown h2{color:#34495e;margin-top:2.5rem}.demo-markdown blockquote{border-left:4px solid #f39c12;background:#fef9e7;padding:1rem 1.5rem;margin:1.5rem 0}.demo-markdown code{background:#2c3e50;color:#ecf0f1;padding:0.2rem 0.4rem;border-radius:0.25rem}.demo-markdown pre{background:#2c3e50;color:#ecf0f1;border-radius:0.5rem;padding:1.5rem;overflow-x:auto}.demo-markdown table{box-shadow:0 2px 8px rgba(0, 0, 0, 0.1);border-radius:0.5rem;overflow:hidden}.demo-markdown th{background:#3498db;color:white}@media(max-width: 768px){.container.svelte-bybbqr.svelte-bybbqr{padding:0 1rem}.demo-header.svelte-bybbqr h1.svelte-bybbqr{font-size:2rem}.content-wrapper.svelte-bybbqr.svelte-bybbqr{padding:2rem}.content-types.svelte-bybbqr.svelte-bybbqr{flex-direction:column}.type-btn.svelte-bybbqr.svelte-bybbqr{width:100%}.content-meta.svelte-bybbqr.svelte-bybbqr{flex-direction:column;gap:1rem}.features-grid.svelte-bybbqr.svelte-bybbqr{grid-template-columns:1fr}}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let readingTime;
  let slug;
  let currentContent = "";
  let contentType = "tutorial";
  let showToc = true;
  const demoContents = {
    tutorial: `# 🎓 Guide d'apprentissage des Mathématiques

## Introduction aux Mathématiques Amusantes

Bienvenue dans notre aventure mathématique ! Dans ce cours, nous allons explorer les concepts fondamentaux des mathématiques de manière ludique et interactive.

### 📊 Qu'allez-vous apprendre ?

- Les bases de l'arithmétique
- La géométrie pratique  
- Les fractions simplifiées
- La résolution de problèmes

## 🔢 Chapitre 1 : Les Nombres

Les nombres sont partout autour de nous ! Observez votre environnement :

> **Astuce pédagogique** : Comptez les objets dans votre chambre pour pratiquer !

### Les différents types de nombres

1. **Nombres entiers** : 0, 1, 2, 3, 4...
2. **Nombres décimaux** : 3.14, 2.5, 0.75...
3. **Fractions** : 1/2, 3/4, 2/3...

### Exercice pratique

Voici un petit exercice de calcul :

\`\`\`python
# Calcul simple en Python
nombre1 = 15
nombre2 = 7
resultat = nombre1 + nombre2
print(f"Le résultat est : {resultat}")
\`\`\`

## 📐 Chapitre 2 : La Géométrie

La géométrie nous aide à comprendre les formes et l'espace.

### Les formes de base

| Forme | Côtés | Angles |
|-------|--------|---------|
| Triangle | 3 | 3 |
| Carré | 4 | 4 droits |
| Cercle | 0 | Infini |

### Formules importantes

- **Aire du carré** : côté × côté
- **Aire du rectangle** : longueur × largeur  
- **Circonférence du cercle** : 2 × π × rayon

## 🎯 Exercices

1. Calculez l'aire d'un carré de 5 cm de côté
2. Trouvez le périmètre d'un rectangle de 8 cm × 3 cm
3. Estimez la circonférence d'un cercle de rayon 4 cm

---

**💡 Conseil** : N'hésitez pas à utiliser une calculatrice pour vérifier vos réponses !

*Temps de lecture estimé : 5 minutes*`,
    exercise: `# 🎯 Exercice : Les Fractions

## Objectif

Apprendre à manipuler les fractions simples et comprendre leur utilité dans la vie quotidienne.

## 📖 Rappel théorique

Une fraction représente une partie d'un tout. Elle s'écrit sous la forme :

\`\`\`
numérateur
─────────
dénominateur
\`\`\`

### Exemples visuels

- **1/2** = la moitié d'une pizza 🍕
- **3/4** = trois quarts d'un gâteau 🎂  
- **2/5** = deux cinquièmes d'une tablette de chocolat 🍫

## ✅ Questions

### Question 1
Quelle fraction représente 3 parts sur 8 parts égales ?

**Réponse** : 3/8

### Question 2
Simplifiez la fraction 6/12

**Étapes** :
1. Trouvez le PGCD de 6 et 12
2. PGCD(6, 12) = 6
3. Divisez numérateur et dénominateur par 6
4. 6÷6 = 1 et 12÷6 = 2

**Réponse** : 1/2

### Question 3
Additionnez 1/4 + 1/4

**Méthode** :
- Même dénominateur → additionnez les numérateurs
- 1 + 1 = 2
- Résultat : 2/4 = 1/2

## 🏆 Défi

Calculez : (2/3) × (3/4)

\`\`\`
Étape 1: Multipliez les numérateurs
2 × 3 = 6

Étape 2: Multipliez les dénominateurs  
3 × 4 = 12

Étape 3: Résultat
6/12 = 1/2
\`\`\`

**Bravo !** 🎉 Vous maîtrisez maintenant les fractions de base.`,
    evaluation: `# 📊 Évaluation : Mathématiques Niveau 6ème

## Informations

- **Durée** : 45 minutes
- **Note** : /20 points
- **Calculatrice** : Autorisée

---

## Partie I : Calculs (8 points)

### Exercice 1 (4 points)
Effectuez les calculs suivants :

a) 247 + 156 = ?  
b) 503 - 287 = ?  
c) 24 × 13 = ?  
d) 144 ÷ 12 = ?

### Exercice 2 (4 points)
Calculez en respectant les priorités :

a) 5 + 3 × 2 = ?  
b) (8 + 4) × 3 = ?  
c) 20 - 2 × 5 = ?  
d) 15 ÷ 3 + 4 = ?

## Partie II : Géométrie (6 points)

### Exercice 3 (3 points)
Un rectangle a pour dimensions :
- Longueur : 12 cm
- Largeur : 7 cm

Calculez :
1. Son périmètre
2. Son aire

### Exercice 4 (3 points)
Nommez les figures géométriques ci-dessous et donnez leurs propriétés principales.

\`\`\`
Figure A: Triangle équilatéral
Figure B: Carré  
Figure C: Cercle
\`\`\`

## Partie III : Problèmes (6 points)

### Exercice 5 (3 points)
Marie achète 3 cahiers à 2,50€ chacun et 2 stylos à 1,20€ chacun.
Combien dépense-t-elle en tout ?

### Exercice 6 (3 points)
Un groupe de 24 élèves doit être réparti en équipes égales.
Proposez 3 façons différentes de faire cette répartition.

---

## Barème

- **18-20** : Excellent 🏆
- **16-17** : Très bien 🎉  
- **14-15** : Bien 👍
- **12-13** : Assez bien 📚
- **10-11** : Passable ⚠️
- **< 10** : Insuffisant 📖

*Bonne chance !* 🍀`
  };
  $$result.css.add(css);
  {
    {
      currentContent = demoContents[contentType];
    }
  }
  readingTime = currentContent ? estimateReadingTime(currentContent) : 0;
  slug = generateSlug("Demo Contenu Markdown");
  return `${$$result.head += `<!-- HEAD_svelte-7r2dqt_START -->${$$result.title = `<title>Démo Système de Contenu - FunLearning</title>`, ""}<meta name="description" content="Démonstration du système de rendu Markdown avancé de FunLearning"><!-- HEAD_svelte-7r2dqt_END -->`, ""} <div class="demo-page svelte-bybbqr"><header class="demo-header svelte-bybbqr" data-svelte-h="svelte-lbajlt"><div class="container svelte-bybbqr"><h1 class="svelte-bybbqr">🎯 Démo Système de Contenu Markdown</h1> <p class="svelte-bybbqr">Découvrez notre système de rendu de contenu éducatif avancé</p></div></header> <div class="demo-controls svelte-bybbqr"><div class="container svelte-bybbqr"><div class="control-section svelte-bybbqr"><h3 class="svelte-bybbqr" data-svelte-h="svelte-obukex">Type de contenu</h3> <div class="content-types svelte-bybbqr"><button class="${["type-btn svelte-bybbqr", "active"].join(" ").trim()}" data-svelte-h="svelte-mjqa39">📚 Cours</button> <button class="${["type-btn svelte-bybbqr", ""].join(" ").trim()}" data-svelte-h="svelte-1hfoicz">🎯 Exercice</button> <button class="${["type-btn svelte-bybbqr", ""].join(" ").trim()}" data-svelte-h="svelte-1yih9e5">📊 Évaluation</button></div></div> <div class="control-section svelte-bybbqr"><h3 class="svelte-bybbqr" data-svelte-h="svelte-nyqp9x">Options d&#39;affichage</h3> <label class="checkbox-label svelte-bybbqr"><input type="checkbox" class="svelte-bybbqr"${add_attribute("checked", showToc, 1)}> <span data-svelte-h="svelte-1p4nxt2">Afficher la table des matières</span></label></div> <div class="content-meta svelte-bybbqr"><div class="meta-item svelte-bybbqr"><span class="meta-label svelte-bybbqr" data-svelte-h="svelte-g4fvvt">Temps de lecture :</span> <span class="meta-value svelte-bybbqr">${escape(readingTime)} min</span></div> <div class="meta-item svelte-bybbqr"><span class="meta-label svelte-bybbqr" data-svelte-h="svelte-1dg4e63">Slug URL :</span> <span class="meta-value svelte-bybbqr">${escape(slug)}</span></div> <div class="meta-item svelte-bybbqr"><span class="meta-label svelte-bybbqr" data-svelte-h="svelte-11fmf8e">Mots :</span> <span class="meta-value svelte-bybbqr">${escape(currentContent.split(" ").length)}</span></div></div></div></div> <main class="demo-content svelte-bybbqr"><div class="container svelte-bybbqr"><div class="content-wrapper svelte-bybbqr">${validate_component(MarkdownRenderer, "MarkdownRenderer").$$render(
    $$result,
    {
      content: currentContent,
      className: "demo-markdown"
    },
    {},
    {}
  )}</div></div></main> <footer class="demo-footer svelte-bybbqr" data-svelte-h="svelte-16atlf1"><div class="container svelte-bybbqr"><div class="features-showcase svelte-bybbqr"><h3 class="svelte-bybbqr">🚀 Fonctionnalités du système</h3> <div class="features-grid svelte-bybbqr"><div class="feature svelte-bybbqr"><div class="feature-icon svelte-bybbqr">🔒</div> <h4 class="svelte-bybbqr">Sécurisation XSS</h4> <p class="svelte-bybbqr">HTML sanitisé automatiquement</p></div> <div class="feature svelte-bybbqr"><div class="feature-icon svelte-bybbqr">🎨</div> <h4 class="svelte-bybbqr">Coloration syntaxique</h4> <p class="svelte-bybbqr">Code highlighting avec highlight.js</p></div> <div class="feature svelte-bybbqr"><div class="feature-icon svelte-bybbqr">📑</div> <h4 class="svelte-bybbqr">Table des matières</h4> <p class="svelte-bybbqr">Navigation automatique par titres</p></div> <div class="feature svelte-bybbqr"><div class="feature-icon svelte-bybbqr">⚡</div> <h4 class="svelte-bybbqr">Cache intelligent</h4> <p class="svelte-bybbqr">Performance optimisée</p></div> <div class="feature svelte-bybbqr"><div class="feature-icon svelte-bybbqr">📱</div> <h4 class="svelte-bybbqr">Responsive</h4> <p class="svelte-bybbqr">Adapté à tous les écrans</p></div> <div class="feature svelte-bybbqr"><div class="feature-icon svelte-bybbqr">♿</div> <h4 class="svelte-bybbqr">Accessibilité</h4> <p class="svelte-bybbqr">Conforme aux standards WCAG</p></div></div></div></div></footer> </div>`;
});
export {
  Page as default
};
