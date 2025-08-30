# 🎓 FunLearning - Plateforme d'Apprentissage Interactive

> **Phase 1 COMPLÈTE** - Authentification Firebase & Interface Utilisateur

## 🎯 Vue d'Ensemble

**FunLearning** est une plateforme d'apprentissage moderne développée avec **SvelteKit + Firebase**, suivant la méthodologie **CBD (Check Before Doing)** pour une qualité de code maximale.

### 🚀 **Status Phase 1 - TERMINÉE ✅**

- ✅ **Configuration Firebase** - Production `revision-a7a12`
- ✅ **Authentification Google OAuth** - Store réactif TypeScript
- ✅ **Interface Utilisateur** - Composants stylisés et accessibles
- ✅ **Tests Critiques** - 20/20 tests passent (100%)
- ✅ **Protection Routes** - Redirection auth/dashboard
- ✅ **Documentation** - Hub central et références modulaires

### 🔗 **Accès Rapides**

- **🌐 Interface:** http://localhost:5173/auth (après `npm run dev`)
- **📚 Documentation:** [docs/DOC_README.md](docs/DOC_README.md)
- **🧪 Tests:** `npm run test:critical`
- **🤖 Méthodologie:** [DOC_CoPilot_Practices](../MyDevFramework/docs/DOC_CoPilot_Practices.md)

---

## 📁 Architecture Projet

### 🏗️ **Structure Phase 1**

```
FunLearning/
├── 📚 docs/
│   ├── DOC_README.md           # Hub central documentation
│   └── FIREBASE_RULES.md       # Configuration Firebase
├── 🔥 src/lib/
│   ├── firebase.js             # Configuration Firebase production
│   ├── stores/auth.ts          # Store authentification TypeScript
│   └── components/auth/        # Composants connexion UI
├── 📄 src/routes/
│   ├── auth/+page.svelte       # Page de connexion
│   └── dashboard/+page.svelte  # Tableau de bord utilisateur
└── 🧪 tests/unit/
    ├── auth.critical.test.js        # Tests auth (5 tests)
    ├── firebase.integration.test.js # Tests Firebase (5 tests)
    └── ui.critical.test.js          # Tests UI (8 tests)
```

### � **Technologies Phase 1**

- **🎨 SvelteKit** - Framework fullstack avec TypeScript
- **🔥 Firebase** - Auth + Firestore + Analytics
- **🧪 Vitest** - Suite de tests critiques
- **⚡ Vite** - Build tool optimisé
- **🤖 CBD** - Méthodologie Check Before Doing

## 🛠️ Installation et Démarrage

### Prérequis

- Node.js v18+
- npm ou pnpm
- Git configuré

### Installation

```bash
# Cloner le projet
git clone https://github.com/geo92fr-dev/Project_Learning.git
cd Project_Learning

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run check        # Vérification TypeScript
```

## 🔧 Configuration Firebase

Le fichier `src/lib/firebase.js` contient la configuration Firebase.

⚠️ **Important** : Configurez vos propres clés API Firebase avant utilisation.

## 📚 Documentation

### 🗺️ **Roadmap Structurée** (Recommandé)

- **Navigation centrale** : [`roadmap/README.md`](roadmap/README.md) - Roadmap par phases
- **Phase actuelle** : [Phase 0 : Setup & Architecture](roadmap/phases/phase-0-setup.md)

### 📋 **Documentation Complète**

- **Roadmap détaillée** : [`DOC_ROADMAP.md`](DOC_ROADMAP.md) - Version complète (12,000+ lignes)
- **Workspace parent** : [`../README.md`](../README.md) - Organisation globale
- **Framework utilisé** : [`../MyDevFramework/README.md`](../MyDevFramework/README.md)

## 🎯 Statut du Projet

- ✅ **Structure de base** - Configurée
- ✅ **Git configuré** - Synchronisé avec GitHub
- 🔄 **En développement** - Apprentissage en cours
- 🎯 **Objectif** - Maîtriser Svelte + Firebase

## 🤝 Workflow Git

```bash
# Développement quotidien
git status
git add .
git commit -m "feat: description du changement"
git push origin master

# Synchronisation
git pull origin master
```

---

**Projet indépendant** dans le workspace Project_Learning - Voir le README parent pour l'organisation globale.

## Repositories Git

| Projet                 | Repository GitHub                                                               | Statut      | Description                                  |
| ---------------------- | ------------------------------------------------------------------------------- | ----------- | -------------------------------------------- |
| **MyDevFramework**     | [geo92fr-dev/MyDevFramework](https://github.com/geo92fr-dev/MyDevFramework)     | Synchronisé | Framework personnel pour création de projets |
| **Projet_Learning**    | [geo92fr-dev/Project_Learning](https://github.com/geo92fr-dev/Project_Learning) | Synchronisé | Projet d'apprentissage Svelte + Firebase     |
| **test-sans-doublons** | Non configuré                                                                   | Local       | Projet de test (à configurer si nécessaire)  |

## Configuration Git

### MyDevFramework

`ash
cd MyDevFramework
git remote -v

# origin https://github.com/geo92fr-dev/MyDevFramework (fetch)

# origin https://github.com/geo92fr-dev/MyDevFramework (push)

`

### Projet_Learning

`ash
cd Projet_Learning
git remote -v

# origin https://github.com/geo92fr-dev/Project_Learning (fetch)

# origin https://github.com/geo92fr-dev/Project_Learning (push)

`

## Workflow Recommandé

### 1. **Développement sur un projet spécifique**

`ash
cd [nom-du-projet]
git status
git add .
git commit -m "Description des changements"
git push origin master
`

### 2. **Synchronisation régulière**

`ash

# Pour chaque projet

git pull origin master
git push origin master
`

### 3. **Création d'un nouveau projet**

`ash

# Utiliser MyDevFramework pour créer de nouveaux projets

cd MyDevFramework
fw create nouveau-projet
`

## Règles Importantes

### **À NE PAS FAIRE**

- Mélanger les commits entre projets
- Créer des dépendances croisées
- Modifier plusieurs projets dans le même commit
- Ignorer la structure Git de chaque projet

### **BONNES PRATIQUES**

- Un commit = Un seul projet
- Branches indépendantes par projet
- Documentation à jour dans chaque projet
- Tests réguliers de synchronisation Git

## Documentation Spécifique

- **MyDevFramework** : Voir MyDevFramework/README.md
- **Projet_Learning** : Voir Projet_Learning/README.md
- **Configuration VS Code** : Voir Project_Learning.code-workspace

## Maintenance

### Vérification de l'état Git

`ash

# Script pour vérifier tous les projets

for dir in MyDevFramework Projet_Learning; do
echo "=== ==="
cd && git status && cd ..
done
`

### Synchronisation globale

`ash

# Synchroniser tous les projets

for dir in MyDevFramework Projet_Learning; do
echo "=== Syncing ==="
cd && git pull && git push && cd ..
done
`

---

**Workspace créé le 30 août 2025** - Maintenir l'indépendance des projets pour une meilleure organisation et traçabilité.
