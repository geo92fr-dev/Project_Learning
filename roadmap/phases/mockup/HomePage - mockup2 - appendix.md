# HomePage - Mockup v2 - Appendice Technique

**Date de création** : 2 septembre 2025  
**Version** : 2.0  
**Document parent** : HomePage - mockup2.md  
**Audience** : Développeurs et équipes techniques

---

## 📋 **Vue d'Ensemble**

Ce document contient toutes les spécifications techniques, le code, et les détails d'implémentation extraits du document principal HomePage - mockup2.md pour améliorer la lisibilité du document principal destiné aux non-développeurs.

---

## 🔧 **Table des Matières Technique**

1. [Code JavaScript des Systèmes](#javascript)
2. [Spécifications CSS et Design Tokens](#css)
3. [Configuration Responsive](#responsive)
4. [APIs et Intégrations](#apis)
5. [Tests et Validation](#tests)
6. [Configuration Technique](#config)

---

## <a id="javascript"></a>📜 **Code JavaScript des Systèmes**

### **1. Système de Priorité Automatique**

```javascript
// Algorithme de priorisation
const priorityScore = (item) => {
  let score = 0;
  
  // Urgence temporelle (poids 40%)
  if (item.deadline) {
    const daysLeft = getDaysUntilDeadline(item.deadline);
    if (daysLeft <= 1) score += 40;
    else if (daysLeft <= 3) score += 30;
    else if (daysLeft <= 7) score += 20;
  }
  
  // Progression faible (poids 30%)
  if (item.progress < 30) score += 30;
  else if (item.progress < 50) score += 20;
  
  // Activité récente (poids 20%)
  const lastActivity = getDaysSinceLastActivity(item);
  if (lastActivity > 7) score += 20;
  
  // Recommandation IA (poids 10%)
  if (item.aiRecommended) score += 10;
  
  return score;
};
```

### **2. Système de Filtrage Multi-Critères**

```javascript
// Tri Intelligent par Glisser-Déposer
const sortableConfig = {
  animation: 200,
  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  dragClass: 'sortable-drag',
  
  onEnd: (evt) => {
    const newOrder = Array.from(evt.to.children).map(el => el.dataset.courseId);
    saveUserCourseOrder(newOrder);
    showNotification('Ordre personnalisé sauvegardé ✅', 'success');
  }
};
```

### **3. Auto-complétion et Suggestions**

```javascript
// Suggestion de cours lors de la saisie
const suggestCourses = (input) => {
  const suggestions = [
    // Cours populaires de même niveau
    ...getPopularCoursesByLevel(user.level),
    // Cours complémentaires aux matières actuelles
    ...getComplementaryCourses(user.subjects),
    // Cours basés sur l'historique
    ...getHistoryBasedSuggestions(user.history)
  ];
  
  return suggestions
    .filter(course => course.title.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5); // Limiter à 5 suggestions
};

// Pré-sélection Contextuelle
const preSelectCourses = () => {
  const criteria = {
    // Cours avec progression < 50%
    lowProgress: courses.filter(c => c.progress < 50),
    // Cours avec deadline proche
    urgent: courses.filter(c => getDaysUntilDeadline(c.deadline) <= 3),
    // Cours récemment consultés
    recent: courses.filter(c => c.lastViewed > Date.now() - 7 * 24 * 60 * 60 * 1000)
  };
  
  return [...criteria.urgent, ...criteria.lowProgress, ...criteria.recent]
    .slice(0, 3); // Max 3 pré-sélections
};
```

---

## <a id="css"></a>🎨 **Spécifications CSS et Design Tokens**

### **1. Système de Badges Prioritaires**

```html
<!-- Structure HTML des badges -->
<div class="priority-badges">
  <badge class="urgent">📅 À faire aujourd'hui</badge>
  <badge class="overdue">⚠️ En retard</badge>
  <badge class="recommended">✨ Recommandé</badge>
  <badge class="streak">🔥 Série active</badge>
  <badge class="low-progress">📈 Progression faible</badge>
</div>
```

```css
/* Styles des badges avec Tailwind CSS */
.urgent { @apply bg-red-100 text-red-800 border-red-200; }
.overdue { @apply bg-orange-100 text-orange-800 border-orange-200; }
.recommended { @apply bg-purple-100 text-purple-800 border-purple-200; }
.streak { @apply bg-green-100 text-green-800 border-green-200; }
.low-progress { @apply bg-blue-100 text-blue-800 border-blue-200; }
```

### **2. Interface de Filtres Multi-Critères**

```html
<!-- Barre de filtres responsive -->
<div class="filters-bar">
  <!-- Dropdown matières -->
  <select class="filter-subject">
    <option value="">Toutes les matières</option>
    <option value="math">🔢 Mathématiques</option>
    <option value="physics">⚛️ Physique</option>
    <option value="chemistry">🧪 Chimie</option>
    <option value="biology">🧬 Biologie</option>
  </select>
  
  <!-- Dropdown niveaux -->
  <select class="filter-level">
    <option value="">Tous niveaux</option>
    <option value="seconde">Seconde</option>
    <option value="premiere">Première</option>
    <option value="terminale">Terminale</option>
  </select>
  
  <!-- Toggle priorité -->
  <button class="filter-priority" data-active="false">
    🎯 Prioritaires uniquement
  </button>
  
  <!-- Reset filtres -->
  <button class="filter-reset">
    🔄 Réinitialiser
  </button>
</div>
```

---

*Ce document sera rempli progressivement avec le contenu technique extrait du document principal.*
