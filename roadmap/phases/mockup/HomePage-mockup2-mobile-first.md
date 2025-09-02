# HomePage - Mockup v2 - Architecture Mobile-First

**Module** : Architecture & Composants UI  
**Parent** : [HomePage-mockup2-core.md](./HomePage-mockup2-core.md)  
**Suivant** : [HomePage-mockup2-features.md](./HomePage-mockup2-features.md)

---

## **1. Architecture & Layout Mobile-First**

### **1.1. Composants adaptatifs**

#### **Mobile Components**
- **Header mobile** : Hamburger + Logo + Badge notifications
- **Sidebar overlay** : Slide-in avec backdrop blur
- **Bottom navigation** : 4 tabs fixes (Accueil, Cours, Progression, Profil)
- **FAB** : Floating Action Button avec menu radial
- **Welcome card** : Stats condensées (progression, cours, série)

#### **Desktop Components** 
- **Sidebar fixe** : 320px avec navigation et actions
- **Header étendu** : Titre + sous-titre + status
- **Content multi-colonnes** : Optimisation espace horizontal

---

## **2. Composants UI Mobile-First**

### **2.1. Headers Adaptatifs**

#### **Mobile Header**
- **Layout** : Flexbox justify-between
- **Éléments** :
  - Hamburger menu (ouvre sidebar overlay)
  - Logo + "FunLearning" 
  - Notification badge (badge rouge si nouveau)
- **Comportement** : Sticky top, z-index 30
- **Interactions** : Touch-friendly (44px minimum)

#### **Desktop Header** 
- **Layout** : Titre + metadata + actions
- **Éléments** :
  - "Ton Espace Personnel" + description
  - Notification bell + timestamp dernière activité
  - Séparateur visuel

### **2.2. Navigation Adaptive**

#### **Sidebar Desktop** (≥768px)
- **Branding** : Logo + version + message personnalisé glass-effect
- **Navigation principale** : Accueil (actif), Mes Matières, Mon Profil
- **Actions rapides** : 3 boutons gradient (Continuer, Quiz, Planifier)
- **Stats** : Carte série d'étude avec compteur flamme

#### **Sidebar Mobile Overlay** (<768px)
- **Animation** : translateX(-100%) → translateX(0)
- **Backdrop** : rgba(0,0,0,0.5) avec blur
- **Contenu** : Navigation condensée + stats essentielles
- **Fermeture** : Tap backdrop, bouton X, swipe, ou navigation
- **Scroll lock** : body overflow hidden quand ouvert

#### **Bottom Navigation Mobile** (<768px)
```
Layout: 4 tabs équitablement répartis
┌─────────┬─────────┬─────────┬─────────┐
│ Accueil │  Cours  │Progress │ Profil  │
│   📱    │   📚    │   📊    │   👤    │
└─────────┴─────────┴─────────┴─────────┘
```
- **Position** : Fixed bottom, z-index 40
- **Active state** : text-blue-600 + icon filled
- **Hover state** : transition-colors
- **Touch zones** : 44px minimum height

### **2.3. Actions Mobiles Spécifiques**

#### **FAB (Floating Action Button)**
- **Position** : Fixed bottom-right (bottom: 80px, right: 16px)
- **Taille** : 56px circle (Material Design standard)
- **Couleur** : bg-blue-600 avec shadow-xl
- **Menu radial** : 3 actions (Continuer, Quiz, Planifier)
- **Animation** : 
  - Menu : scale(0) → scale(1) avec cubic-bezier bounce
  - Icon : fa-plus → fa-times rotation
- **Interaction** : Tap pour toggle, close sur outside tap

#### **Welcome Card Mobile uniquement**
- **Condition** : `md:hidden` (visible uniquement mobile)
- **Layout** : Glass effect + grid-cols-3 stats
- **Contenu** : Progression %, Cours terminés, Série jours
- **Purpose** : Vue rapide sans encombrer desktop

### **2.4. Bandeau Collapsible Responsive**

#### **Header adaptatif**
- **Mobile** : Padding p-4, icônes w-10 h-10, text-base
- **Desktop** : Padding p-6, icônes w-12 h-12, text-lg
- **Preview badge** : Taille responsive (text-xs md:text-sm)

#### **Contenu responsive**
- **Grilles** : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Actions** : `flex-col sm:flex-row` (stack mobile, inline desktop)
- **Typography** : `text-sm md:text-base` adaptatif

### **2.5. Sections Principales Responsives**

#### **Ton Plan de Travail - Layout adaptatif**
- **Mobile** : 1 colonne (stack vertical)
- **Desktop** : 2/3 + 1/3 (lg:grid-cols-3)

##### **Ton Actualité**
- **Mobile responsive** : 
  - Padding : `p-3 md:p-4`
  - Typography : `text-sm md:text-base`
  - Progress text : `text-lg md:text-2xl`
- **Cards cours** :
  - Touch zones optimisées (minimum 44px height)
  - Hover effects adaptés (plus discrets sur mobile)

##### **Sidebar droite (Révisions + Parcours)**
- **Mobile** : Stack sous "Ton Actualité"
- **Desktop** : Colonne droite fixe
- **Révisions** : Cards colorées (jaune conseillé, rouge urgent)
- **Parcours** : Gradient purple/indigo avec CTA blanc

#### **Mes Matières - Grid responsive**
```
Breakpoints:
- Mobile : grid-cols-2 (2 cartes par ligne)
- Tablet : md:grid-cols-2 (2 cartes par ligne)  
- Desktop : lg:grid-cols-4 (4 cartes par ligne)
```
- **Cards adaptatives** :
  - Icons : `w-8 h-8 md:w-12 md:h-12`
  - Progress % : `text-lg md:text-xl`
  - Rounded : `rounded-xl md:rounded-2xl`
  - Padding : `p-4 md:p-6`

---

## **3. Interactions Mobiles Avancées**

### **3.1. Touch Gestures**
Interface tactile optimisée pour mobile :
- **Sidebar close** : Balayage gauche ou tap backdrop pour fermer
- **FAB menu** : Tap à l'extérieur pour fermer automatiquement
- **Cards** : Feedback tactile avec animations subtiles
- **Scroll lock** : Prévention du scroll arrière-plan avec overlay ouvert

### **3.2. Comportements Responsifs**
Gestion intelligente selon la taille d'écran :
- **Auto-fermeture** : Sidebar mobile se ferme automatiquement sur desktop
- **Zones tactiles dynamiques** : Ajustement selon la résolution
- **Transitions fluides** : Animations optimisées pour chaque device

> 🔧 **Détails techniques** : Voir [Interactions mobiles](./HomePage-mockup2-appendix.md#javascript) dans l'appendice technique

---

## **4. Spécifications des Interactions**

### **4.1. Navigation Mobile**
```javascript
// Mobile sidebar avec overlay
openMobileSidebar() {
  - sidebar.classList.add('open') // translateX(0)
  - overlay.classList.add('active') // opacity 1
  - body.style.overflow = 'hidden' // prevent scroll
}

// Bottom navigation mobile
bottomNavigation() {
  - Fixed position bottom-0
  - Safe area padding (iOS)
  - Active state management
  - Touch feedback
}
```

### **4.2. FAB & Actions Rapides**
```javascript
// FAB menu radial
toggleFabMenu() {
  - Menu scale(0) ↔ scale(1) avec spring animation
  - Icon rotation fa-plus ↔ fa-times
  - Background blur when open
  - Outside tap detection pour close
}

// Actions rapides contextuelles
fabActions = [
  { icon: 'fa-play', color: 'emerald', action: 'continueLastCourse' },
  { icon: 'fa-dumbbell', color: 'blue', action: 'quickQuiz' },
  { icon: 'fa-calendar-plus', color: 'purple', action: 'schedulleSession' }
]
```

### **4.3. Responsive Behaviors**
```javascript
// Responsive breakpoint management
handleResize() {
  if (window.innerWidth >= 768 && isMobileSidebarOpen) {
    closeMobileSidebar(); // Auto-close sur desktop
  }
  updateTouchZones(); // Adjust touch targets
}

// Touch-friendly interactions
touchInteractions = {
  minTouchSize: '44px', // Apple HIG standard
  tapFeedback: true,    // Visual feedback sur tap
  swipeGestures: ['sidebar-close', 'card-actions'],
  hapticFeedback: false // Future implementation
}
```

---

## **5. Considérations UX/UI Mobile**

### **5.1. Optimisation Spatiale**
- **Sidebar fixe** : Actions toujours accessibles sans scroll
- **Multi-colonnes** : Plus de contenu visible simultanément  
- **Sections modulaires** : Réorganisation possible selon les besoins

### **5.2. Performance UX**
- **Feedback immédiat** : Toutes les actions ont une réponse visuelle
- **Transitions fluides** : cubic-bezier optimisées
- **État de chargement** : Simulation réaliste pour suggestions
- **Persistence** : État du bandeau maintenu durant la session

### **5.3. Responsive Design**
- **Breakpoints** : sm/md/lg avec adaptation du grid
- **Sidebar** : Comportement adaptatif selon la taille écran
- **Touch friendly** : Zones de tap optimisées pour mobile

**⚠️ LIMITATION MOBILE IDENTIFIÉE** :
- **Sidebar fixe 320px** : Problématique sur écrans < 768px
- **Layout multi-colonnes** : Grids trop denses pour mobile
- **Navigation** : Actions rapides inaccessibles sur petits écrans

---

**📚 Navigation** :  
← [Vue d'ensemble](./HomePage-mockup2-core.md) | **Mobile-First** | [Fonctionnalités Avancées](./HomePage-mockup2-features.md) →
