# FunLearning CBD Assistant

## 🎓 Extension VS Code pour FunLearning

Extension spécialisée pour le développement FunLearning avec validation CBD temps réel, dashboard qualité, et génération de templates adaptatifs.

### ✨ Fonctionnalités

#### 🔍 Validation CBD Temps Réel

- Détection automatique des formats CBD (Standard, URL/Test, Éducation)
- Validation en temps réel avec diagnostics visuels
- Auto-completion intelligente des blocs CBD
- Détection automatique de la phase projet (1-12)

#### 📊 Dashboard Qualité Intégré

- Métriques qualité code (coverage, complexité, maintenabilité)
- Santé projet (build status, tests, dépendances)
- Qualité éducative (conformité CBD, alignement pédagogique)
- Performance (Lighthouse, temps chargement, bundle size)

#### 🎯 Suivi Progression Roadmap

- Analyse automatique de l'état du projet
- Progression par phases avec estimation temps
- Détection des blockers et prochaines tâches
- Vue latérale avec arbre de progression

#### 📝 Génération Templates Adaptatifs

- Templates Svelte adaptatifs au contexte
- Pages éducatives avec validation pédagogique
- Variables dynamiques avec validation de types
- Génération contextuelle selon phase/niveau

#### 🎓 Assistant Pédagogique

- Validation contenu par niveau scolaire (6ème-3ème)
- Framework compétences intégré
- Analyse vocabulaire adaptatif
- Génération d'exercices automatique

### 🚀 Commandes

| Commande                                   | Raccourci      | Description                   |
| ------------------------------------------ | -------------- | ----------------------------- |
| `FunLearning: Valider Prompt CBD`          | `Ctrl+Shift+V` | Validation CBD temps réel     |
| `FunLearning: Dashboard Qualité`           | `Ctrl+Shift+D` | Ouvrir dashboard métriques    |
| `FunLearning: Détecter Phase Projet`       | -              | Analyser progression actuelle |
| `FunLearning: Générer Template`            | -              | Templates adaptatifs          |
| `FunLearning: Valider Contenu Pédagogique` | -              | Validation éducative          |

### 🎨 Interface

#### Vues Latérales

- **📊 FunLearning Dashboard** : Métriques qualité temps réel
- **🗺️ Progression Roadmap** : Suivi phases projet

#### Status Bar

- Affichage phase actuelle et score qualité
- Indicateur visuel pour alertes qualité

### ⚙️ Configuration

```json
{
  "funlearning.autoValidation": true,
  "funlearning.currentPhase": "3",
  "funlearning.educationalLevel": "5eme",
  "funlearning.strictMode": false
}
```

### 📋 Niveaux Supportés

- **6ème** : Initiation, vocabulaire simple
- **5ème** : Développement, concepts intermédiaires
- **4ème** : Approfondissement, projets complexes
- **3ème** : Maîtrise, créativité avancée

### 🔧 Développement

```bash
# Compiler
npm run compile

# Watch mode
npm run watch

# Créer package
npm run package

# Installer extension
npm run install-extension
```

### 📊 Métriques Dashboard

#### Code Quality

- **Coverage** : Pourcentage tests/code
- **Complexité** : Analyse cyclomatique
- **Duplication** : Détection code dupliqué
- **Maintenabilité** : Score composite

#### Project Health

- **Build Status** : État compilation
- **Tests** : Ratio tests réussis/total
- **Dépendances** : Nombre packages
- **Vulnérabilités** : Alertes sécurité

#### Educational Quality

- **Conformité CBD** : Respect formats
- **Alignement Pédagogique** : Adéquation niveau
- **Accessibilité** : Score A11Y
- **Qualité Contenu** : Score global

#### Performance

- **Lighthouse** : Score performance
- **Load Time** : Temps chargement
- **Bundle Size** : Taille finale
- **Memory Usage** : Consommation mémoire

### 🎯 Auto-Détection Phases

1. **Setup & Configuration** : package.json, vite.config
2. **Authentification Firebase** : firebase.js, auth components
3. **Contenu Éducatif** : markdown parser, exercices
4. **Interface Utilisateur** : design system, responsive
5. **CRUD Avancé** : Firestore, real-time
6. **Curriculum Intelligence** : compétences, progression
7. **Interactions Avancées** : gamification, social
8. **Responsive & Mobile** : mobile-first, PWA prep
9. **PWA & Offline** : service worker, notifications
10. **Performance** : optimisations, Lighthouse 90+
11. **Production** : CI/CD, deployment
12. **Maintenance** : monitoring, analytics

### 📚 Templates Disponibles

#### 🎨 Composant Svelte

- Structure base avec validation pédagogique
- Props configurables avec types
- Tests automatiques générés
- Documentation intégrée

#### 📚 Page Éducative

- Layout pédagogique complet
- Système de progression intégré
- Activités interactives
- Évaluation par compétences

### 🔄 Auto-Refresh

- Dashboard : 30 secondes
- Progression : Détection changements fichiers
- Métriques : Analyse continue workspace
- Status : Mise à jour temps réel

### 🎓 Framework Compétences

#### 6ème

- Comprendre et s'exprimer en français
- Langages mathématiques de base
- Langages scientifiques simples
- Créativité artistique
- Méthodes d'apprentissage

#### 5ème-3ème

- Progression adaptative selon niveau
- Compétences transversales
- Projets collaboratifs
- Autonomie croissante

### 🚀 Prochaines Versions

- [ ] Intelligence artificielle pour suggestions
- [ ] Collaboration temps réel
- [ ] Analytics avancées
- [ ] Export rapports qualité
- [ ] Intégration CI/CD
- [ ] Marketplace templates

---

**Version** : 1.0.0  
**Auteur** : FunLearning Team  
**Licence** : MIT  
**Support** : [GitHub Issues](https://github.com/geo92fr-dev/Project_Learning/issues)
