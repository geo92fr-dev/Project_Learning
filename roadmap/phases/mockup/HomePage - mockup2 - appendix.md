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

### **3. Interactions Mobiles Avancées**

```javascript
// Mobile sidebar management
openMobileSidebar() {
  - Transform sidebar translateX(0)
  - Active backdrop overlay
  - Lock body scroll
}

closeMobileSidebar() {
  - Transform sidebar translateX(-100%)
  - Hide backdrop
  - Unlock body scroll
}

// FAB menu management  
toggleFabMenu() {
  - Scale menu 0 ↔ 1 avec bounce
  - Icon transition plus ↔ times
  - Outside tap close
}

// Responsive resize handling
handleResize() {
  - Auto-close mobile sidebar si screen ≥ 768px
  - Update touch zones dynamically
}
```

---

## <a id="responsive"></a>📱 **Configuration Responsive**

### **1. Système de Thèmes CSS Variables**

```css
/* Thème clair (défaut) */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --accent-primary: #8b5cf6;
}

/* Mode sombre */
[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --border-color: #374151;
  --accent-primary: #a78bfa;
}

/* Thème haute visibilité */
[data-theme="high-contrast"] {
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #ffff00;
  --border-color: #ffffff;
  --accent-primary: #00ffff;
}
```

### **2. Toggle Mode Sombre**

```javascript
const themeManager = {
  current: localStorage.getItem('theme') || 'light',
  
  toggle() {
    this.current = this.current === 'light' ? 'dark' : 'light';
    this.apply();
  },
  
  apply() {
    document.documentElement.setAttribute('data-theme', this.current);
    localStorage.setItem('theme', this.current);
    
    // Mise à jour de l'icône du toggle
    const icon = document.querySelector('#theme-toggle i');
    icon.className = this.current === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
};
```

---

## <a id="apis"></a>🌐 **APIs et Intégrations**

### **1. Système i18n (Internationalisation)**

```javascript
const translations = {
  fr: {
    'welcome.title': 'Bienvenue sur ton espace personnel',
    'nav.home': 'Accueil',
    'nav.courses': 'Mes Cours',
    'action.continue': 'Continuer le cours',
    'badge.urgent': 'À faire aujourd\'hui',
    'badge.overdue': 'En retard'
  },
  en: {
    'welcome.title': 'Welcome to your personal space',
    'nav.home': 'Home',
    'nav.courses': 'My Courses',
    'action.continue': 'Continue course',
    'badge.urgent': 'Due today',
    'badge.overdue': 'Overdue'
  },
  es: {
    'welcome.title': 'Bienvenido a tu espacio personal',
    'nav.home': 'Inicio',
    'nav.courses': 'Mis Cursos',
    'action.continue': 'Continuar curso',
    'badge.urgent': 'Para hacer hoy',
    'badge.overdue': 'Atrasado'
  }
};

const i18n = {
  locale: localStorage.getItem('locale') || 'fr',
  t(key) { return translations[this.locale][key] || key; }
};
```

### **2. Navigation Clavier Avancée**

```javascript
// Gestion des raccourcis clavier
const keyboardShortcuts = {
  'Alt+h': () => navigateTo('home'),
  'Alt+c': () => navigateTo('courses'),
  'Alt+p': () => navigateTo('profile'),
  'Escape': () => closeModals(),
  'Tab': () => manageFocus(),
  'Enter': () => activateSelected(),
  'Space': () => selectCourse(),
  '?': () => showKeyboardHelp()
};

// Focus management pour accessibilité
const focusManager = {
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Piéger le focus dans le container
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Logique de cycle de focus
      }
    });
  }
};
```

### **3. Système de Widgets Configurables**

```javascript
const widgetSystem = {
  available: [
    { id: 'welcome', name: 'Carte de bienvenue', default: true },
    { id: 'progress', name: 'Barre de progression', default: true },
    { id: 'courses', name: 'Cours récents', default: true },
    { id: 'calendar', name: 'Calendrier', default: false },
    { id: 'stats', name: 'Statistiques détaillées', default: false },
    { id: 'achievements', name: 'Badges et réussites', default: false }
  ],
  
  user_config: JSON.parse(localStorage.getItem('widgets') || '{}'),
  
  toggle(widgetId) {
    this.user_config[widgetId] = !this.user_config[widgetId];
    localStorage.setItem('widgets', JSON.stringify(this.user_config));
    this.render();
  },
  
  render() {
    this.available.forEach(widget => {
      const isVisible = this.user_config[widget.id] ?? widget.default;
      const element = document.getElementById(`widget-${widget.id}`);
      if (element) {
        element.style.display = isVisible ? 'block' : 'none';
      }
    });
  }
};
```

### **4. Interface de Personnalisation**

```html
<!-- Modal de configuration des widgets -->
<div id="customization-modal" class="fixed inset-0 z-50 hidden">
  <div class="bg-black bg-opacity-50 absolute inset-0"></div>
  <div class="bg-white rounded-xl p-6 max-w-md mx-auto mt-20 relative">
    <h3 class="text-lg font-semibold mb-4">🎨 Personnaliser ton tableau de bord</h3>
    
    <!-- Liste des widgets -->
    <div class="space-y-3">
      <div class="widget-toggle">
        <label class="flex items-center justify-between">
          <span>📊 Statistiques détaillées</span>
          <input type="checkbox" class="toggle-switch">
        </label>
      </div>
    </div>
    
    <!-- Thèmes visuels -->
    <div class="mt-6">
      <h4 class="font-medium mb-3">🎨 Thème visuel</h4>
      <div class="grid grid-cols-3 gap-2">
        <button class="theme-option" data-theme="light">Clair</button>
        <button class="theme-option" data-theme="dark">Sombre</button>
        <button class="theme-option" data-theme="high-contrast">Contraste élevé</button>
      </div>
    </div>
  </div>
</div>
```

### **5. Notifications Intelligentes**

```javascript
const smartNotifications = {
  // Notifications basées sur l'activité
  checkStudyStreak() {
    const streak = getUserStudyStreak();
    if (streak > 0 && streak % 7 === 0) {
      this.show(`🔥 Incroyable ! ${streak} jours de révision consécutifs !`, 'success');
    }
  },
  
  // Encouragements personnalisés
  checkProgress() {
    const weeklyProgress = getWeeklyProgress();
    if (weeklyProgress > 80) {
      this.show('🌟 Excellente semaine ! Tu es sur la bonne voie', 'success');
    } else if (weeklyProgress < 20) {
      this.show('💪 Quelques minutes de révision aujourd\'hui ?', 'info');
    }
  },
  
  // Rappels intelligents
  checkDeadlines() {
    const upcomingDeadlines = getUpcomingDeadlines(3); // 3 prochains jours
    if (upcomingDeadlines.length > 0) {
      this.show(`⏰ ${upcomingDeadlines.length} échéance(s) dans les 3 prochains jours`, 'warning');
    }
  },
  
  show(message, type = 'info') {
    // Affichage de la notification avec style adaptatif
  }
};
```

### **6. Variables CSS et Configuration Design**

```css
/* Variables de couleurs par matière */
:root {
  --color-math: #3b82f6;
  --color-physics: #10b981;
  --color-chemistry: #8b5cf6;
  --color-biology: #f59e0b;
  
  /* Configuration spatiale */
  --sidebar-width: 320px;
  --content-max-width: 1200px;
  --gap-base: 1rem;
  --gap-large: 2rem;
  
  /* Système de timing d'animations */
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 150ms;
  --transition-medium: 300ms;
  --transition-slow: 500ms;
  
  /* Z-index layers */
  --z-sidebar: 40;
  --z-modal: 50;
  --z-notification: 60;
  --z-tooltip: 70;
}
```

### **7. Configurations de Performance**

```javascript
// Configuration des états de chargement
const loadingStates = {
  // Simulation réaliste pour suggestions
  suggestions: {
    delay: 800, // ms
    shimmer: true,
    placeholder: 'Recherche de cours recommandés...'
  },
  
  // Chargement progressif des widgets
  widgets: {
    priority: ['welcome', 'progress', 'courses'], // Ordre de chargement
    lazyLoad: ['calendar', 'stats', 'achievements'],
    timeout: 5000 // Fallback si échec
  },
  
  // Optimisations animations
  performance: {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    gpuAcceleration: true, // transform/opacity uniquement
    fps60: true, // Limitation 60fps max
    batchUpdates: true // RequestAnimationFrame batching
  }
};

// Gestion des erreurs et fallbacks
const errorHandling = {
  network: {
    retry: 3,
    fallback: 'cache',
    timeout: 10000
  },
  
  rendering: {
    fallbackTheme: 'light',
    fallbackLang: 'fr',
    gracefulDegradation: true
  }
};
```

### **8. Algorithmes d'Intelligence Utilisateur**

```javascript
// Système de recommandations intelligent
const aiRecommendations = {
  // Analyse du comportement utilisateur
  analyzeUserPattern() {
    const history = getUserHistory();
    const preferences = {
      timeSlots: this.findPreferredTimeSlots(history),
      subjects: this.analyzeSubjectPreference(history),
      difficulty: this.calculateOptimalDifficulty(history),
      sessionLength: this.findOptimalSessionLength(history)
    };
    return preferences;
  },
  
  // Score de recommandation multi-critères
  calculateRecommendationScore(course, userPrefs) {
    const factors = {
      subject_match: this.subjectAffinity(course.subject, userPrefs.subjects) * 0.3,
      difficulty_fit: this.difficultyMatch(course.level, userPrefs.difficulty) * 0.25,
      time_availability: this.timeSlotMatch(course.duration, userPrefs.timeSlots) * 0.2,
      progress_continuity: this.progressContinuity(course, userPrefs) * 0.15,
      social_proof: this.peerSuccessRate(course) * 0.1
    };
    
    return Object.values(factors).reduce((sum, score) => sum + score, 0);
  },
  
  // Machine Learning simple pour adaptation
  adaptToFeedback(courseId, userAction, outcome) {
    // Mise à jour des poids selon feedback positif/négatif
    const feedback = {
      action: userAction, // 'completed', 'skipped', 'rated'
      outcome: outcome,   // score, time_spent, satisfaction
      timestamp: Date.now()
    };
    
    this.updateModelWeights(courseId, feedback);
    this.saveUserModel(); // Persistence des apprentissages
  }
};
```

### **9. Système de Feedback Utilisateur**

```javascript
// Système de collecte de feedback
const feedbackSystem = {
  // Types de feedback disponibles
  feedbackTypes: {
    like: { icon: '👍', weight: 1 },
    dislike: { icon: '👎', weight: -1 },
    love: { icon: '❤️', weight: 2 },
    star_rating: { icon: '⭐', scale: 5 }
  },
  
  // Collecte d'un feedback
  submitFeedback(courseId, type, value, comment = '') {
    const feedback = {
      courseId: courseId,
      userId: getCurrentUserId(),
      type: type,
      value: value,
      comment: comment,
      timestamp: Date.now(),
      context: this.getContext()
    };
    
    this.saveFeedback(feedback);
    this.updateRecommendationWeights(courseId, type, value);
    this.showFeedbackConfirmation(type);
  },
  
  // Interface de feedback contextuel
  renderFeedbackWidget(courseId, placement = 'card') {
    const existingFeedback = this.getUserFeedback(courseId);
    
    return `
      <div class="feedback-widget ${placement}" data-course="${courseId}">
        <button class="feedback-btn ${existingFeedback?.type === 'like' ? 'active' : ''}" 
                data-feedback="like">
          👍 <span class="count">${this.getFeedbackCount(courseId, 'like')}</span>
        </button>
        <button class="feedback-btn ${existingFeedback?.type === 'love' ? 'active' : ''}" 
                data-feedback="love">
          ❤️ <span class="count">${this.getFeedbackCount(courseId, 'love')}</span>
        </button>
      </div>
    `;
  },
  
  // Modal de feedback détaillé (fin de cours)
  showDetailedFeedbackModal(courseId) {
    const modal = `
      <div class="feedback-modal">
        <h3>Comment était ce cours ? 🎓</h3>
        
        <!-- Rating étoiles -->
        <div class="star-rating">
          ${[1,2,3,4,5].map(i => `
            <button class="star" data-rating="${i}">⭐</button>
          `).join('')}
        </div>
        
        <!-- Tags rapides -->
        <div class="quick-tags">
          <button class="tag" data-tag="clear">Bien expliqué</button>
          <button class="tag" data-tag="difficult">Difficile</button>
          <button class="tag" data-tag="short">Trop court</button>
          <button class="tag" data-tag="perfect">Parfait</button>
        </div>
        
        <!-- Commentaire optionnel -->
        <textarea placeholder="Un commentaire ? (optionnel, max 140 caractères)" 
                  maxlength="140" class="feedback-comment"></textarea>
        
        <div class="modal-actions">
          <button class="btn-skip">Passer</button>
          <button class="btn-submit">Envoyer</button>
        </div>
      </div>
    `;
    
    this.showModal(modal);
  },
  
  // Analytics et amélioration continue
  analyzeFeedback() {
    const analytics = {
      // Satisfaction globale par matière
      subjectSatisfaction: this.calculateSatisfactionBySubject(),
      
      // Cours les mieux notés
      topRatedCourses: this.getTopRatedCourses(10),
      
      // Points d'amélioration
      improvementAreas: this.identifyImprovementAreas(),
      
      // Engagement des utilisateurs
      participationRate: this.calculateParticipationRate()
    };
    
    return analytics;
  },
  
  // Intégration avec l'algorithme de recommandation
  updateRecommendationWeights(courseId, feedbackType, value) {
    const course = getCourseById(courseId);
    const currentWeight = course.recommendationWeight || 1.0;
    
    // Ajustement du poids selon le feedback
    const adjustments = {
      'like': 0.1,
      'love': 0.2,
      'dislike': -0.15,
      'star_rating': (value - 3) * 0.05 // -0.1 à +0.1
    };
    
    const newWeight = Math.max(0.1, currentWeight + (adjustments[feedbackType] || 0));
    this.updateCourseWeight(courseId, newWeight);
  }
};

// CSS pour les widgets de feedback
const feedbackStyles = `
.feedback-widget {
  display: flex;
  gap: 8px;
  align-items: center;
}

.feedback-widget.card {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 4px;
}

.feedback-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.feedback-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.feedback-btn.active {
  background: var(--color-primary);
  color: white;
}

.feedback-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.star-rating {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
}

.star {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.2s ease;
}

.star:hover,
.star.active {
  opacity: 1;
  transform: scale(1.1);
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.tag {
  background: #f3f4f6;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.tag:hover,
.tag.active {
  background: var(--color-primary);
  color: white;
}
`;
```

### **10. Modes d'Affichage Adaptatifs**

```javascript
// Système de modes d'affichage
const displayModes = {
  // Configuration des modes
  modes: {
    simple: {
      name: 'Mode Épuré',
      description: 'Focus sur l\'essentiel',
      maxCourses: 5,
      hiddenElements: [
        '.advanced-filters',
        '.secondary-widgets', 
        '.detailed-stats',
        '.drag-drop-handle',
        '.secondary-badges'
      ],
      visibleElements: [
        '.priority-courses',
        '.main-navigation',
        '.essential-badges',
        '.primary-actions'
      ]
    },
    
    advanced: {
      name: 'Mode Avancé',
      description: 'Toutes les fonctionnalités',
      maxCourses: null,
      hiddenElements: [],
      visibleElements: ['*']
    }
  },
  
  currentMode: localStorage.getItem('displayMode') || 'simple',
  
  // Basculer entre les modes
  toggleMode(newMode) {
    if (!this.modes[newMode]) return;
    
    const oldMode = this.currentMode;
    this.currentMode = newMode;
    
    localStorage.setItem('displayMode', newMode);
    this.applyMode(newMode, oldMode);
    this.trackModeChange(oldMode, newMode);
    this.showModeChangeNotification(newMode);
  },
  
  // Interface de sélection de mode
  renderModeSelector() {
    return `
      <div class="mode-selector">
        <h4>Mode d'affichage</h4>
        <div class="mode-options">
          <label class="mode-option ${this.currentMode === 'simple' ? 'active' : ''}">
            <input type="radio" name="displayMode" value="simple" 
                   ${this.currentMode === 'simple' ? 'checked' : ''}>
            <div class="mode-card">
              <div class="mode-icon">🎯</div>
              <div class="mode-title">Épuré</div>
              <div class="mode-desc">Focus essentiel</div>
            </div>
          </label>
          
          <label class="mode-option ${this.currentMode === 'advanced' ? 'active' : ''}">
            <input type="radio" name="displayMode" value="advanced">
            <div class="mode-card">
              <div class="mode-icon">⚙️</div>
              <div class="mode-title">Avancé</div>
              <div class="mode-desc">Toutes fonctionnalités</div>
            </div>
          </label>
        </div>
      </div>
    `;
  },
  
  // Cours prioritaires pour mode épuré
  getPriorityCourses(maxCount) {
    const allCourses = this.getAllCourses();
    
    return allCourses
      .map(course => ({
        ...course,
        priority: this.calculateSimplePriority(course)
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxCount);
  },
  
  // Calcul priorité simplifié
  calculateSimplePriority(course) {
    const now = Date.now();
    const deadline = new Date(course.deadline).getTime();
    const daysUntilDeadline = (deadline - now) / (1000 * 60 * 60 * 24);
    
    let priority = 0;
    
    // Urgence critique (50%)
    if (daysUntilDeadline <= 1) priority += 50;
    else if (daysUntilDeadline <= 3) priority += 30;
    else if (daysUntilDeadline <= 7) priority += 10;
    
    // Progression faible (30%)
    if (course.progress < 30) priority += 30;
    else if (course.progress < 50) priority += 20;
    
    // Activité récente (20%)
    const lastActivity = new Date(course.lastAccessed).getTime();
    const daysSinceActivity = (now - lastActivity) / (1000 * 60 * 60 * 24);
    
    if (daysSinceActivity <= 1) priority += 20;
    else if (daysSinceActivity <= 3) priority += 10;
    
    return priority;
  }
};

// CSS modes d'affichage
const modeStyles = `
.mode-selector {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mode-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.mode-option.active .mode-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mode-card {
  background: #f8f9fa;
  padding: 16px;
  text-align: center;
  transition: all 0.2s ease;
}

/* Adaptations mode épuré */
.mode-simple .secondary-widget {
  display: none !important;
}

.mode-simple .advanced-filter {
  display: none !important;
}

.mode-simple .course-card:nth-child(n+6) {
  display: none !important;
}
`;
```

---

*Ce document technique contient tous les détails d'implémentation extraits du document principal pour une meilleure lisibilité.*
