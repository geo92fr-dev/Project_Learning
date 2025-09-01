<!--
  🎨 Design System Demo - Phase 7.A
  Démonstration des composants atomiques selon DOC_CoPilot_Practices
-->
<script>
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  let theme = 'light';
  let inputValue = '';
  let isLoading = false;
  let showModal = false;
  let showFormModal = false;
  let showConfirmModal = false;

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
  }

  function handleButtonClick(variant) {
    console.log(`Bouton ${variant} cliqué !`);
  }

  function simulateLoading() {
    isLoading = true;
    setTimeout(() => {
      isLoading = false;
    }, 2000);
  }
</script>

<svelte:head>
  <title>Design System Demo - FunLearning Phase 7.A</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 text-gray-900 p-8" class:dark={theme === 'dark'}>
  <div class="max-w-6xl mx-auto space-y-12">
    
    <!-- Header -->
    <header class="text-center">
      <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        🎨 Design System Demo
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        Composants atomiques Phase 7.A selon DOC_CoPilot_Practices
      </p>
      
      <div class="mt-6">
        <Button variant="outline" on:click={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'} Mode {theme === 'light' ? 'sombre' : 'clair'}
        </Button>
      </div>
    </header>

    <!-- Section Buttons -->
    <section>
      <Card variant="outlined" padding="lg">
        <svelte:fragment slot="header">
          <h2 class="text-2xl font-semibold">🔘 Composants Button</h2>
        </svelte:fragment>
        
        <div class="space-y-6">
          <!-- Button Variants -->
          <div>
            <h3 class="text-lg font-medium mb-4">Variants</h3>
            <div class="flex flex-wrap gap-4">
              <Button variant="primary" on:click={() => handleButtonClick('primary')}>
                Primary
              </Button>
              <Button variant="secondary" on:click={() => handleButtonClick('secondary')}>
                Secondary
              </Button>
              <Button variant="outline" on:click={() => handleButtonClick('outline')}>
                Outline
              </Button>
              <Button variant="ghost" on:click={() => handleButtonClick('ghost')}>
                Ghost
              </Button>
            </div>
          </div>

          <!-- Button Sizes -->
          <div>
            <h3 class="text-lg font-medium mb-4">Tailles</h3>
            <div class="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </div>
          </div>

          <!-- Button States -->
          <div>
            <h3 class="text-lg font-medium mb-4">États</h3>
            <div class="flex flex-wrap gap-4">
              <Button variant="primary">Normal</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" loading={isLoading} on:click={simulateLoading}>
                {isLoading ? 'Chargement...' : 'Loading Test'}
              </Button>
              <Button variant="primary" fullWidth>Full Width</Button>
            </div>
          </div>
        </div>
      </Card>
    </section>

    <!-- Section Inputs -->
    <section>
      <Card variant="elevated" padding="lg">
        <svelte:fragment slot="header">
          <h2 class="text-2xl font-semibold">📝 Composants Input</h2>
        </svelte:fragment>
        
        <div class="space-y-6">
          <!-- Input Variants -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input 
              id="input-default"
              label="Input Default"
              placeholder="Tapez ici..."
              bind:value={inputValue}
            />
            
            <Input 
              id="input-filled"
              label="Input Filled"
              variant="filled"
              placeholder="Style filled"
            />
            
            <Input 
              id="input-outlined"
              label="Input Outlined"
              variant="outlined"
              placeholder="Style outlined"
            />
          </div>

          <!-- Input avec icônes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              id="input-search"
              label="Recherche"
              placeholder="Rechercher..."
              leftIcon="🔍"
            />
            
            <Input 
              id="input-email"
              label="Email"
              type="email"
              placeholder="votre@email.com"
              leftIcon="📧"
              rightIcon="✓"
            />
          </div>

          <!-- Input States -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              id="input-error"
              label="Input avec erreur"
              placeholder="Champ invalide"
              error={true}
              helperText="Ce champ est requis"
            />
            
            <Input 
              id="input-disabled"
              label="Input désactivé"
              placeholder="Champ désactivé"
              disabled={true}
              helperText="Ce champ est désactivé"
            />
          </div>

          <!-- Sizes -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Tailles</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                id="input-sm"
                label="Small"
                size="sm"
                placeholder="Small input"
              />
              
              <Input 
                id="input-md"
                label="Medium"
                size="md"
                placeholder="Medium input"
              />
              
              <Input 
                id="input-lg"
                label="Large"
                size="lg"
                placeholder="Large input"
              />
            </div>
          </div>
        </div>
      </Card>
    </section>

    <!-- Section Cards -->
    <section>
      <Card variant="default" padding="lg">
        <svelte:fragment slot="header">
          <h2 class="text-2xl font-semibold">📋 Composants Card</h2>
        </svelte:fragment>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card Default -->
          <Card variant="default" hoverable>
            <svelte:fragment slot="header">
              <h3 class="font-semibold">Card Default</h3>
            </svelte:fragment>
            
            <p class="text-gray-600 dark:text-gray-400">
              Cette card utilise le variant default avec un effet hover.
            </p>
            
            <svelte:fragment slot="footer">
              <Button size="sm" fullWidth>Action</Button>
            </svelte:fragment>
          </Card>

          <!-- Card Elevated -->
          <Card variant="elevated" clickable hoverable>
            <svelte:fragment slot="header">
              <h3 class="font-semibold">Card Elevated</h3>
            </svelte:fragment>
            
            <p class="text-gray-600 dark:text-gray-400">
              Cette card est clickable avec une ombre plus prononcée.
            </p>
            
            <svelte:fragment slot="footer">
              <div class="flex gap-2">
                <Button size="sm" variant="outline">Cancel</Button>
                <Button size="sm" variant="primary">Confirm</Button>
              </div>
            </svelte:fragment>
          </Card>

          <!-- Card Outlined -->
          <Card variant="outlined" hoverable>
            <svelte:fragment slot="header">
              <h3 class="font-semibold">Card Outlined</h3>
            </svelte:fragment>
            
            <p class="text-gray-600 dark:text-gray-400">
              Cette card utilise un style outlined sans ombre.
            </p>
          </Card>

          <!-- Card Loading -->
          <Card variant="default" loading={true}>
            <!-- Le contenu est masqué quand loading=true -->
          </Card>

          <!-- Card avec différents paddings -->
          <Card variant="default" padding="sm">
            <h4 class="font-medium mb-2">Small Padding</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Contenu avec padding réduit.
            </p>
          </Card>

          <Card variant="default" padding="lg">
            <h4 class="font-medium mb-2">Large Padding</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Contenu avec padding étendu pour plus d'espace.
            </p>
          </Card>
        </div>
      </Card>
    </section>

    <!-- Section Badges -->
    <section>
      <Card variant="default" padding="lg">
        <svelte:fragment slot="header">
          <h2 class="text-2xl font-semibold">🏷️ Composants Badge</h2>
        </svelte:fragment>
        
        <div class="space-y-6">
          <!-- Badge Variants -->
          <div>
            <h3 class="text-lg font-medium mb-4">Variants</h3>
            <div class="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
          </div>

          <!-- Badge Outlined -->
          <div>
            <h3 class="text-lg font-medium mb-4">Style Outlined</h3>
            <div class="flex flex-wrap gap-3">
              <Badge variant="default" outline>Default</Badge>
              <Badge variant="primary" outline>Primary</Badge>
              <Badge variant="secondary" outline>Secondary</Badge>
              <Badge variant="success" outline>Success</Badge>
              <Badge variant="warning" outline>Warning</Badge>
              <Badge variant="error" outline>Error</Badge>
            </div>
          </div>

          <!-- Badge Sizes -->
          <div>
            <h3 class="text-lg font-medium mb-4">Tailles</h3>
            <div class="flex flex-wrap items-center gap-3">
              <Badge size="sm" variant="primary">Small</Badge>
              <Badge size="md" variant="primary">Medium</Badge>
              <Badge size="lg" variant="primary">Large</Badge>
            </div>
          </div>

          <!-- Badge avec icônes -->
          <div>
            <h3 class="text-lg font-medium mb-4">Avec icônes</h3>
            <div class="flex flex-wrap gap-3">
              <Badge variant="success" icon="✓">Validé</Badge>
              <Badge variant="warning" icon="⚠️">Attention</Badge>
              <Badge variant="error" icon="❌">Erreur</Badge>
              <Badge variant="primary" icon="📧">Nouveau</Badge>
              <Badge variant="secondary" icon="⭐">Favori</Badge>
            </div>
          </div>

          <!-- Badge Pills -->
          <div>
            <h3 class="text-lg font-medium mb-4">Style Pill</h3>
            <div class="flex flex-wrap gap-3">
              <Badge variant="primary" pill>JavaScript</Badge>
              <Badge variant="success" pill icon="✓">Terminé</Badge>
              <Badge variant="warning" pill icon="⏱️">En cours</Badge>
              <Badge variant="error" pill outline>Urgent</Badge>
            </div>
          </div>

          <!-- Badge Dismissible -->
          <div>
            <h3 class="text-lg font-medium mb-4">Dismissible</h3>
            <div class="flex flex-wrap gap-3">
              <Badge variant="primary" dismissible on:dismiss={() => console.log('Badge primary supprimé')}>
                Filtrer: Niveau 1
              </Badge>
              <Badge variant="secondary" dismissible icon="🏷️" on:dismiss={() => console.log('Badge tag supprimé')}>
                Tag: Important
              </Badge>
              <Badge variant="success" dismissible pill on:dismiss={() => console.log('Badge success supprimé')}>
                Statut: Actif
              </Badge>
            </div>
          </div>

          <!-- Badge Clickable -->
          <div>
            <h3 class="text-lg font-medium mb-4">Clickable</h3>
            <div class="flex flex-wrap gap-3">
              <Badge variant="primary" clickable on:click={() => console.log('Badge primary cliqué')}>
                Cliquez-moi
              </Badge>
              <Badge variant="success" clickable pill icon="🚀" on:click={() => console.log('Badge success cliqué')}>
                Action rapide
              </Badge>
              <Badge variant="warning" clickable outline on:click={() => console.log('Badge warning cliqué')}>
                Voir détails
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </section>

    <!-- Section Modals -->
    <section>
      <Card variant="elevated" padding="lg">
        <svelte:fragment slot="header">
          <h2 class="text-2xl font-semibold">🪟 Composants Modal</h2>
        </svelte:fragment>
        
        <div class="space-y-6">
          <!-- Modal Triggers -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" on:click={() => showModal = true}>
              Modal Simple
            </Button>
            
            <Button variant="secondary" on:click={() => showFormModal = true}>
              Modal avec Formulaire
            </Button>
            
            <Button variant="outline" on:click={() => showConfirmModal = true}>
              Modal de Confirmation
            </Button>
          </div>
        </div>
      </Card>
    </section>

    <!-- Section Combinaisons -->
    <section>
      <Card variant="elevated" padding="lg">
        <svelte:fragment slot="header">
          <h2 class="text-2xl font-semibold">🧩 Combinaisons de composants</h2>
        </svelte:fragment>
        
        <div class="space-y-8">
          <!-- Formulaire -->
          <Card variant="outlined" padding="md">
            <svelte:fragment slot="header">
              <h3 class="font-semibold">Formulaire d'exemple</h3>
            </svelte:fragment>
            
            <div class="space-y-4">
              <Input 
                id="form-name"
                label="Nom complet"
                placeholder="Jean Dupont"
                required={true}
                leftIcon="👤"
              />
              
              <Input 
                id="form-email"
                label="Adresse email"
                type="email"
                placeholder="jean@example.com"
                required={true}
                leftIcon="📧"
              />
              
              <Input 
                id="form-message"
                label="Message"
                placeholder="Votre message..."
                helperText="250 caractères maximum"
              />
            </div>
            
            <svelte:fragment slot="footer">
              <div class="flex gap-3">
                <Button variant="outline" fullWidth>Annuler</Button>
                <Button variant="primary" fullWidth>Envoyer</Button>
              </div>
            </svelte:fragment>
          </Card>
        </div>
      </Card>
    </section>

  </div>
</div>

<!-- Modals -->
<!-- Modal Simple -->
<Modal bind:open={showModal} title="Modal de démonstration" size="md">
  <div class="space-y-4">
    <p class="text-gray-600 dark:text-gray-400">
      Ceci est un exemple de modal simple avec un titre et du contenu de base.
    </p>
    
    <div class="flex flex-wrap gap-2">
      <Badge variant="primary" icon="ℹ️">Information</Badge>
      <Badge variant="success" icon="✓">Validé</Badge>
      <Badge variant="warning" icon="⚠️">Attention</Badge>
    </div>
    
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Vous pouvez fermer ce modal en cliquant sur le X, en appuyant sur Escape, ou en cliquant à l'extérieur.
    </p>
  </div>

  <svelte:fragment slot="footer">
    <Button variant="outline" on:click={() => showModal = false}>
      Annuler
    </Button>
    <Button variant="primary" on:click={() => showModal = false}>
      Confirmer
    </Button>
  </svelte:fragment>
</Modal>

<!-- Modal avec Formulaire -->
<Modal bind:open={showFormModal} title="Créer un nouvel élément" size="lg">
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input 
        id="modal-name"
        label="Nom"
        placeholder="Nom de l'élément"
        required={true}
        leftIcon="🏷️"
      />
      
      <Input 
        id="modal-category"
        label="Catégorie"
        placeholder="Sélectionner une catégorie"
        leftIcon="📁"
      />
    </div>
    
    <Input 
      id="modal-description"
      label="Description"
      placeholder="Description détaillée..."
      helperText="Maximum 500 caractères"
    />
    
    <div class="flex flex-wrap gap-2">
      <Badge variant="primary" pill dismissible>JavaScript</Badge>
      <Badge variant="secondary" pill dismissible>Svelte</Badge>
      <Badge variant="success" pill dismissible>Design System</Badge>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button variant="outline" on:click={() => showFormModal = false}>
      Annuler
    </Button>
    <Button variant="primary" on:click={() => showFormModal = false}>
      Créer
    </Button>
  </svelte:fragment>
</Modal>

<!-- Modal de Confirmation -->
<Modal bind:open={showConfirmModal} size="sm" backdrop={false}>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
        <span class="text-red-600 dark:text-red-400 text-lg">⚠️</span>
      </div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Confirmer la suppression
      </h2>
    </div>
  </svelte:fragment>

  <div class="space-y-4">
    <p class="text-gray-600 dark:text-gray-400">
      Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
    </p>
    
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
      <p class="text-sm text-red-800 dark:text-red-200">
        <strong>Attention :</strong> Toutes les données associées seront définitivement perdues.
      </p>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button variant="outline" on:click={() => showConfirmModal = false}>
      Annuler
    </Button>
    <Button variant="primary" on:click={() => showConfirmModal = false}>
      Supprimer
    </Button>
  </svelte:fragment>
</Modal>

<style>
  :global(.dark) {
    color-scheme: dark;
  }
  
  :global(.dark body) {
    background-color: #111827;
  }
</style>
