# 🎨 Design System Phase 7.A - FunLearning

## Vue d'ensemble

Notre design system suit les principes de l'**Atomic Design** et les bonnes pratiques du **DOC_CoPilot_Practices** pour créer une expérience utilisateur cohérente et accessible.

## 🎯 Philosophie

- **Cohérence** : Chaque composant suit le même système de variants, tailles et états
- **Accessibilité** : Support complet des standards ARIA et navigation clavier
- **Dark Mode** : Support natif du mode sombre avec CSS custom properties
- **Performance** : Composants légers et optimisés
- **DX** : API simple et intuitive pour les développeurs

## 🧩 Composants Atomiques

### 🔘 Button

Le composant `Button` est notre atome principal pour les interactions.

**Props:**
- `variant`: `primary`, `secondary`, `outline`, `ghost`
- `size`: `sm`, `md`, `lg`
- `disabled`: `boolean`
- `loading`: `boolean`
- `fullWidth`: `boolean`

**Exemple:**
```svelte
<Button variant="primary" size="md" on:click={handleClick}>
  Mon bouton
</Button>
```

### 📝 Input

Le composant `Input` gère tous les types de saisie utilisateur.

**Props:**
- `type`: `text`, `email`, `password`, `number`
- `variant`: `default`, `filled`, `outlined`
- `size`: `sm`, `md`, `lg`
- `leftIcon`, `rightIcon`: Icônes décoratives
- `error`: État d'erreur
- `helperText`: Texte d'aide

**Exemple:**
```svelte
<Input 
  label="Email"
  type="email"
  placeholder="votre@email.com"
  leftIcon="📧"
  bind:value={email}
/>
```

### 📋 Card

Le composant `Card` structure le contenu en sections logiques.

**Props:**
- `variant`: `default`, `elevated`, `outlined`
- `padding`: `sm`, `md`, `lg`
- `hoverable`: Effet hover
- `clickable`: État cliquable
- `loading`: État de chargement

**Slots:**
- `header`: En-tête de la card
- `default`: Contenu principal
- `footer`: Pied de page

**Exemple:**
```svelte
<Card variant="elevated" hoverable>
  <svelte:fragment slot="header">
    <h3>Titre</h3>
  </svelte:fragment>
  
  <p>Contenu de la card</p>
  
  <svelte:fragment slot="footer">
    <Button>Action</Button>
  </svelte:fragment>
</Card>
```

### 🏷️ Badge

Le composant `Badge` affiche des étiquettes et statuts.

**Props:**
- `variant`: `default`, `primary`, `secondary`, `success`, `warning`, `error`
- `size`: `sm`, `md`, `lg`
- `outline`: Style outlined
- `pill`: Forme arrondie
- `dismissible`: Peut être supprimé
- `clickable`: Peut être cliqué
- `icon`: Icône optionnelle

**Exemple:**
```svelte
<Badge variant="success" icon="✓" pill>
  Validé
</Badge>
```

### 🪟 Modal

Le composant `Modal` crée des dialogues et overlays.

**Props:**
- `size`: `sm`, `md`, `lg`, `xl`, `full`
- `closeable`: Peut être fermé
- `backdrop`: Fermeture sur backdrop
- `title`: Titre du modal

**Slots:**
- `header`: En-tête personnalisé
- `default`: Contenu principal
- `footer`: Actions du modal

**Exemple:**
```svelte
<Modal bind:open={showModal} title="Confirmation">
  <p>Êtes-vous sûr ?</p>
  
  <svelte:fragment slot="footer">
    <Button variant="outline" on:click={() => showModal = false}>
      Annuler
    </Button>
    <Button variant="primary" on:click={confirm}>
      Confirmer
    </Button>
  </svelte:fragment>
</Modal>
```

### 🍞 Notification

Le composant `Notification` affiche des messages temporaires.

**Props:**
- `type`: `info`, `success`, `warning`, `error`
- `position`: `top-right`, `top-left`, `bottom-right`, etc.
- `duration`: Durée d'affichage (ms)
- `dismissible`: Peut être fermé
- `title`, `message`: Contenu

**Méthodes:**
- `show()`: Afficher la notification
- `hide()`: Masquer la notification

## 🎨 Système de Design Tokens

### Couleurs

```css
/* Primary */
--color-primary-50: #eff6ff;
--color-primary-500: #3b82f6;
--color-primary-900: #1e3a8a;

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Espacement

```css
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
```

### Typography

```css
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
```

## 🌙 Mode Sombre

Tous les composants supportent automatiquement le mode sombre via les classes CSS Tailwind et les variables CSS custom.

```css
:global(.dark) .component {
  background-color: var(--color-gray-800);
  color: var(--color-gray-100);
}
```

## ♿ Accessibilité

### Standards ARIA

- Tous les boutons ont des labels appropriés
- Les inputs sont liés à leurs labels
- Les modals utilisent `role="dialog"` et `aria-modal`
- Focus trap dans les modals
- Navigation clavier complète

### Tests d'accessibilité

Chaque composant est testé pour :
- Navigation clavier (Tab, Enter, Escape)
- Screen readers (ARIA labels, roles)
- Contraste des couleurs (WCAG AA)
- Focus visible

## 🚀 Performance

### Optimisations

- **Bundle splitting** : Composants chargés à la demande
- **Tree shaking** : Code inutilisé éliminé automatiquement
- **CSS scoped** : Styles encapsulés par composant
- **Transitions optimisées** : Hardware acceleration

### Métriques

- Bundle size : < 50kb gzipped
- First paint : < 100ms
- Interactive : < 200ms

## 📦 Structure des fichiers

```
src/lib/components/ui/
├── Button.svelte          # Composant bouton
├── Input.svelte           # Composant input
├── Card.svelte            # Composant card
├── Badge.svelte           # Composant badge
├── Modal.svelte           # Composant modal
├── Notification.svelte    # Composant notification
└── index.js              # Exports centralisés
```

## 🔧 Utilisation

### Import individuel
```svelte
import Button from '$lib/components/ui/Button.svelte';
import Input from '$lib/components/ui/Input.svelte';
```

### Import global
```svelte
import { Button, Input, Card } from '$lib/components/ui';
```

## 🧪 Tests

Chaque composant est couvert par des tests :
- **Unit tests** : Logique interne
- **Integration tests** : Interaction entre composants
- **Visual regression tests** : Cohérence visuelle
- **Accessibility tests** : Standards ARIA

```bash
npm run test:unit          # Tests unitaires
npm run test:a11y          # Tests d'accessibilité
npm run test:visual        # Tests visuels
```

## 📈 Évolution

### Prochaines fonctionnalités

- [ ] Composant `DataTable` pour les tableaux
- [ ] Composant `Select` pour les listes déroulantes
- [ ] Composant `DatePicker` pour la sélection de dates
- [ ] Système de thèmes personnalisables
- [ ] Animations avancées avec Framer Motion

### Roadmap

**Phase 8 :** Navigation et routage avancé
**Phase 9 :** Intégration Firebase complète
**Phase 10 :** PWA et offline support

---

*Design System Phase 7.A créé selon les principes DOC_CoPilot_Practices*
*Version: 1.0.0 | Dernière mise à jour: Décembre 2024*
