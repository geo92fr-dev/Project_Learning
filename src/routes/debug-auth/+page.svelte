<script>
  import { onMount } from "svelte";

  let envVars = {};
  let authStatus = "Non testé";

  onMount(async () => {
    console.log("🧪 === DÉBUT DIAGNOSTIC AUTH ===");

    // Test des variables d'environnement
    envVars = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    console.log("📋 Variables d'environnement:", envVars);

    // Test d'import du config Firebase
    try {
      console.log("🔄 Import du config Firebase...");
      const firebaseModule = await import("$lib/firebase/config");
      console.log("✅ Module Firebase importé:", Object.keys(firebaseModule));

      // FORCER l'initialisation et attendre
      console.log("🚀 Appel de initializeFirebase()...");
      firebaseModule.initializeFirebase();

      // Attendre un petit moment pour que l'initialisation soit terminée
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { auth } = firebaseModule;
      console.log("🔐 Auth object après initialisation:", auth);

      if (auth) {
        authStatus = "✅ Auth initialisé";
        console.log("✅ Auth est défini");
      } else {
        authStatus = "❌ Auth undefined";
        console.log("❌ Auth est undefined");
      }
    } catch (error) {
      authStatus = `❌ Erreur: ${error.message}`;
      console.error("❌ Erreur import config:", error);
    }

    console.log("🧪 === FIN DIAGNOSTIC AUTH ===");
  });
</script>

<h1>🔍 Diagnostic Firebase Auth</h1>

<div
  style="background: #f0f9ff; padding: 20px; margin: 20px 0; border-radius: 8px;"
>
  <h2>Variables d'environnement</h2>
  <div
    style="font-family: monospace; background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 4px;"
  >
    {#each Object.entries(envVars) as [key, value]}
      <div style="margin: 5px 0;">
        <strong>{key}:</strong>
        <span style="color: {value ? '#10b981' : '#ef4444'};">
          {value ? `"${value.substring(0, 20)}..."` : "undefined"}
        </span>
      </div>
    {/each}
  </div>
</div>

<div
  style="background: #fef3c7; padding: 20px; margin: 20px 0; border-radius: 8px;"
>
  <h2>État Firebase Auth</h2>
  <p style="font-size: 1.2rem; font-weight: bold;">
    {authStatus}
  </p>
</div>

<div
  style="background: #e0f2fe; padding: 20px; margin: 20px 0; border-radius: 8px;"
>
  <h2>Solutions possibles</h2>
  <ul>
    <li>✅ Créer un fichier <code>.env</code> avec les variables Firebase</li>
    <li>✅ Ou utiliser directement les valeurs dans le config</li>
    <li>✅ Vérifier que le projet Firebase existe</li>
  </ul>
</div>

<p><a href="/auth">← Retour à l'authentification</a></p>
