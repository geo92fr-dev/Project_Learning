// 🔥 Firebase Configuration - FunLearning V2.0
// Configuration SSR-Safe selon DOC_CoPilot_Practices
// Mise à jour avec vraies clés Firebase

import { browser } from '$app/environment';

// Configuration Firebase depuis variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validation configuration au démarrage
function validateConfig() {
  const required = ['apiKey', 'authDomain', 'projectId'];
  const missing = required.filter(key => !firebaseConfig[key] || firebaseConfig[key].includes('demo'));
  
  if (missing.length > 0) {
    throw new Error(`🔥 Configuration Firebase incomplète: ${missing.join(', ')}`);
  }
  
  console.log('🔥 Configuration Firebase validée');
}

let app = null;
let auth = null;

// Initialize Firebase only in browser
if (browser) {
  try {
    validateConfig(); // Validation AVANT initialisation
    
    const { initializeApp } = await import('firebase/app');
    const { getAuth, connectAuthEmulator } = await import('firebase/auth');
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Connect to auth emulator in development
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATOR_AUTH === 'true') {
      if (!auth._delegate._config.emulator) {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099');
          console.log('🔥 Firebase Auth Emulator connecté');
        } catch (error) {
          console.warn('🔥 Firebase Auth Emulator non disponible, utilisation production');
        }
      }
    }
    
    console.log('🔥 Firebase initialisé avec succès');
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase:', error);
    
    // Diagnostic d'erreur spécifique
    if (error.message.includes('api-key-not-valid')) {
      console.error('🔧 SOLUTION: Vérifier VITE_FIREBASE_API_KEY dans .env');
    }
    if (error.message.includes('project-not-found')) {
      console.error('🔧 SOLUTION: Vérifier VITE_FIREBASE_PROJECT_ID dans .env');
    }
  }
}

export { app, auth };
export default { app, auth };
