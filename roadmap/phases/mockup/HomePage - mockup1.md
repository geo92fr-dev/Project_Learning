Bonjour ! Je vous propose une spécification UX détaillée du tableau de bord étudiant que nous avons conçu. Ce document décrit les fonctionnalités, le comportement et l'objectif de chaque élément de l'interface pour garantir une expérience utilisateur cohérente et efficace.

---

### **1. Objectif Principal**

Le tableau de bord a pour objectif de fournir aux étudiants une vue claire, personnalisée et centrée sur l'action de leur progression et de leurs tâches académiques. Il vise à réduire la surcharge d'informations en permettant à l'utilisateur de filtrer le contenu affiché et de découvrir des recommandations pertinentes pour optimiser son temps d'étude.

### **2. Public Cible**

* **Étudiants du secondaire et du supérieur** à la recherche d'un outil de suivi de leurs études.
* Utilisateurs nécessitant une **vue personnalisée et concise** de leurs cours et devoirs.

---

### **3. Spécifications des Éléments d'Interface**

#### **3.1. En-tête de la Page**

* **Contenu** : Un message de bienvenue personnalisé ("Bonjour, [Nom de l'étudiant] !"), une courte phrase d'encouragement, et une barre de navigation principale (Accueil, Mes Matières, Mon Profil).
* **Fonctionnalité** : Fournir une identification claire de l'utilisateur et un accès rapide aux sections principales de l'application.

#### **3.2. Bandeau de Sélection des Cours (Collapsible)**

* **Composant principal** : Un bandeau de titre cliquable (avec une flèche déroulante) qui sert de bouton **"Dérouler/Replier"** pour la section.
* **Contenu du bandeau** :
    * **Titre** : "✏️ Sélectionner mes cours d'actualité".
    * **Icône** : Une flèche (`<svg>`) qui change de direction (rotation de 180 degrés) pour indiquer l'état ouvert ou fermé du bandeau.
* **Contenu du panneau déroulant** :
    * **Titre** : "Sélectionner les cours sur lesquels vous travaillez actuellement pour les voir sur votre page d'accueil."
    * **Grille de sélection** : Des listes de cours organisées par matière. Chaque cours est accompagné d'une **case à cocher** pour permettre la sélection. La sélection est affichée en temps réel sur la page d'accueil.
    * **Section de suggestion** :
        * **Titre** : "Un cours manque à l'appel ?" avec une description.
        * **Champ de saisie (`<input type="text">`)** : Permet à l'étudiant d'entrer le nom d'un cours manquant.
        * **Bouton "Envoyer la suggestion"** : Envoie le nom du cours à l'administrateur.
    * **Bouton d'action** : "Enregistrer la sélection" pour sauvegarder les choix des cases à cocher.

#### **3.3. Panneau "Ton Plan de Travail"**

* **"Ton Actualité"** :
    * **Contenu** : Des cartes dynamiques qui s'affichent uniquement pour les cours sélectionnés via le bandeau. Chaque carte montre le **nom de la matière**, le **nom du cours**, la **progression en pourcentage** et une **barre de progression** visuelle.
    * **Comportement** : La section est vide si aucun cours n'est sélectionné, avec un message invitant l'utilisateur à faire un choix.
* **"Cours à Réviser"** :
    * **Contenu** : Une liste de cartes pour chaque cours recommandé pour une révision, avec le **nom du cours**, la **matière** associée et la **date** de révision conseillée.
* **"Parcours Personnalisé"** :
    * **Contenu** : Une seule carte mettant en évidence un cours recommandé, basée sur l'historique de l'étudiant (pour l'instant des données fictives).
    * **Bouton d'action** : **"Commencer ce parcours"** pour initier l'activité.

#### **3.4. Section "Mes Matières"**

* **Contenu** : Une grille de cartes, une par matière. Chaque carte affiche le **nom de la matière**, un **emoji** (`icon`), la **progression en pourcentage** et une **barre de progression**.
* **Comportement** : Les cartes sont cliquables. Une action simulée est déclenchée au clic pour signifier la navigation vers la page détaillée de la matière.

---

### **4. Spécifications des Interactions**

* **Déroulement/Repliement du bandeau** : Un clic sur le titre ou la flèche du bandeau de sélection **déroule** ou **replie** le contenu du panneau. L'état est persistant ou géré par la session.
* **Sélection des cours** : L'état des cases à cocher est mis à jour localement. Le clic sur **"Enregistrer la sélection"** met à jour la section "Ton Actualité" de la page d'accueil.
* **Suggestion de cours** :
    1.  L'utilisateur saisit un nom dans le champ de texte.
    2.  Un clic sur **"Envoyer la suggestion"** déclenche une action (simulée ici par une boîte de dialogue).
    3.  Un message de confirmation ("Merci pour votre suggestion !") est affiché, et le champ de texte est vidé.
    4.  Si le champ est vide, un message d'erreur (`alert`) demande à l'utilisateur de saisir un nom de cours.
* **Messages de feedback** :
    * Les messages d'erreur et de succès (comme "Votre sélection a été enregistrée avec succès !") sont gérés par une boîte de dialogue **non-bloquante** personnalisée, qui remplace la fonction native `alert()` pour une meilleure intégration visuelle et une meilleure UX.

---

### **5. Considérations UX / UI Générales**

* **Design Responsive** : L'interface utilise Tailwind CSS pour garantir un affichage optimal sur les téléphones mobiles, les tablettes et les ordinateurs de bureau.
* **Palette de Couleurs** : La palette est principalement composée de teintes de **Menthe** et d'**Indigo** pour un look moderne et apaisant.
* **Clarté visuelle** : L'utilisation de cartes, d'icônes, de barres de progression et de couleurs distinctes pour chaque matière rend les informations facilement lisibles et compréhensibles en un coup d'œil.