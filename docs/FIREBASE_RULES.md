# Règles Firebase - FunLearning

## Firestore Security Rules

Pour que l'app fonctionne correctement, voici les règles Firestore à configurer dans la console Firebase :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs authentifiés
    match /users/{userId} {
      // L'utilisateur peut lire/écrire ses propres données
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Règles pour les données d'apprentissage
    match /learning/{document=**} {
      // Lecture pour tous les utilisateurs authentifiés
      allow read: if request.auth != null;
      // Écriture seulement pour les admins ou propriétaires
      allow write: if request.auth != null &&
        (request.auth.token.admin == true ||
         resource.data.ownerId == request.auth.uid);
    }

    // Règles par défaut : interdire tout accès non authentifié
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Auth Configuration

Dans la console Firebase → Authentication → Sign-in method :

1. ✅ Activer **Google** comme provider
2. ✅ Ajouter votre domaine autorisé : `localhost:5173` (pour le dev)
3. ✅ Configurer OAuth consent screen

## Tests sans règles Firebase

Les tests actuels (`firebase.test.js`) sont sûrs car ils ne font que :

- Vérifier la configuration locale
- Tester l'initialisation des SDK
- Valider les propriétés d'app

**Aucune requête réseau** n'est faite vers Firebase.

## Pour les tests d'intégration futurs

Si nous voulons tester les vraies opérations Firebase :

```javascript
// ❌ ATTENTION : Ces tests nécessiteraient des règles Firebase
describe("Firebase Integration", () => {
  it("should write user data", async () => {
    // Nécessite auth + règles Firestore
  });
});
```

Pour l'instant, nous restons sur des tests "unitaires" sûrs.
