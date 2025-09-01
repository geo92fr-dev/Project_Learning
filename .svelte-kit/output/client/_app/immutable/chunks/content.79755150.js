import{d as o,r as p,w as n}from"./index.85dcc1c7.js";const c=n([]),d=n([]),u=n([]),l=n([]),s=n(null),a=n(null),i=n(null),g=o([c,s],([e,t])=>e.find(r=>r.id===t)),f=o([d,a],([e,t])=>e.find(r=>r.id===t)),I=o([u,s,a],([e,t,r])=>e.filter(m=>(!t||m.matiereId===t)&&(!r||m.niveauId===r))),A=o([l,i],([e,t])=>e.filter(r=>!t||r.competenceId===t)),S=p({matieres:[{id:"math",nom:"Mathématiques",code:"MATH",couleur:"#3B82F6",icone:"🔢",description:"Découvrez les merveilles des mathématiques",ordre:1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0},{id:"francais",nom:"Français",code:"FR",couleur:"#EF4444",icone:"📚",description:"Maîtrisez la langue française",ordre:2,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0},{id:"sciences",nom:"Sciences",code:"SCI",couleur:"#10B981",icone:"🔬",description:"Explorez le monde scientifique",ordre:3,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0}],niveaux:[{id:"6eme",nom:"6ème",code:"6E",ordre:1,ageMin:11,ageMax:12,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0},{id:"5eme",nom:"5ème",code:"5E",ordre:2,ageMin:12,ageMax:13,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0},{id:"4eme",nom:"4ème",code:"4E",ordre:3,ageMin:13,ageMax:14,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0}],competences:[{id:"math-calcul",nom:"Calcul et opérations",description:"Maîtriser les opérations de base",matiereId:"math",niveauId:"6eme",prerequis:[],objectifs:["Maîtriser l'addition","Comprendre la soustraction"],dureeEstimee:45,difficulte:"facile",tags:["calcul","opérations"],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0},{id:"fr-grammaire",nom:"Grammaire française",description:"Comprendre les règles grammaticales",matiereId:"francais",niveauId:"6eme",prerequis:[],objectifs:["Identifier les classes de mots","Analyser une phrase"],dureeEstimee:60,difficulte:"moyen",tags:["grammaire","syntaxe"],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0}],courses:[{id:"math-addition",titre:"L'addition des nombres entiers",description:"Apprendre à additionner les nombres entiers",competenceId:"math-calcul",ordre:1,dureeEstimee:30,type:"cours",contenuMarkdown:`# L'addition des nombres entiers

## Introduction

L'addition est l'une des quatre opérations de base en mathématiques.

## Règles de base

1. **Commutativité** : a + b = b + a
2. **Associativité** : (a + b) + c = a + (b + c)
3. **Élément neutre** : a + 0 = a

## Exemples

\`\`\`
5 + 3 = 8
12 + 7 = 19
\`\`\`

## Exercices

Calculez :
- 15 + 8 = ?
- 23 + 17 = ?
`,contenuHtml:"",ressources:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),version:1,actif:!0}]}),v={loadMockData(){S.subscribe(e=>{c.set(e.matieres),d.set(e.niveaux),u.set(e.competences),l.set(e.courses)})},selectMatiere(e){s.set(e),a.set(null),i.set(null)},selectNiveau(e){a.set(e),i.set(null)},selectCompetence(e){i.set(e)},reset(){s.set(null),a.set(null),i.set(null)}},D={matieres:c,niveaux:d,competences:u,courses:l,currentMatiere:s,currentNiveau:a,currentCompetence:i,matiereActive:g,niveauActif:f,competencesFiltered:I,coursesFiltered:A,mockData:S,contentActions:v};export{u as competences,I as competencesFiltered,v as contentActions,l as courses,A as coursesFiltered,i as currentCompetence,s as currentMatiere,a as currentNiveau,D as default,g as matiereActive,c as matieres,S as mockData,f as niveauActif,d as niveaux};
