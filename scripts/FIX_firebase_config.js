// 🔧 FIX_firebase_config.js - Correction Configuration Firebase
// Approche TDD : Correction guidée par les tests

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

class FirebaseConfigFixer {
  constructor() {
    this.configPath = './src/lib/firebase/config.js';
    this.envPath = './.env';
    this.backupPath = './src/lib/firebase/config.js.backup';
  }

  async fixConfiguration() {
    console.log('🔧 Correction Configuration Firebase - Approche TDD');
    console.log('═'.repeat(65));

    // Étape 1: Vérifier tests d'abord (RED phase)
    await this.runTestsRed();
    
    // Étape 2: Backup configuration actuelle
    await this.backupCurrentConfig();
    
    // Étape 3: Guider création projet Firebase
    await this.guideFirebaseSetup();
    
    // Étape 4: Mettre à jour configuration (GREEN phase)
    await this.updateConfiguration();
    
    // Étape 5: Valider tests passent (GREEN validation)
    await this.runTestsGreen();
    
    // Étape 6: Recommandations finales
    await this.finalRecommendations();
  }

  async runTestsRed() {
    console.log('\n🔴 PHASE RED: Vérification échec tests...');
    
    try {
      execSync('npm run test -- tests/firebase/auth.test.js', { stdio: 'pipe' });
      console.log('⚠️  Tests passent déjà - configuration peut être partiellement correcte');
    } catch (error) {
      console.log('✅ Tests échouent comme attendu - prêt pour correction');
    }
  }

  async backupCurrentConfig() {
    console.log('\n💾 Sauvegarde configuration actuelle...');
    
    try {
      const currentConfig = readFileSync(this.configPath, 'utf8');
      writeFileSync(this.backupPath, currentConfig);
      console.log(`✅ Backup créé: ${this.backupPath}`);
    } catch (error) {
      console.error('❌ Erreur backup:', error.message);
    }
  }

  async guideFirebaseSetup() {
    console.log('\n🚀 Guide Configuration Firebase');
    console.log('═'.repeat(45));
    
    console.log(`
🔥 ÉTAPES OBLIGATOIRES:

1. Aller sur: https://console.firebase.google.com
2. Créer un nouveau projet ou sélectionner existant
3. Aller dans Paramètres du projet (⚙️)
4. Onglet "Général" → "Vos applications"
5. Cliquer "Ajouter une application" → "Web" (<//>)
6. Donner un nom: "FunLearning Web App"
7. Cocher "Configurer Firebase Hosting" 
8. Copier la configuration qui apparaît

📋 CONFIGURATION À COPIER:
{
  apiKey: "AIza...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}

⚠️  SÉCURITÉ: Ces clés iront dans .env avec préfixe VITE_
    `);

    console.log('\n⏸️  Script en pause - Configurez Firebase puis relancez avec les vraies clés');
    
    // Créer template .env si n'existe pas
    await this.createEnvTemplate();
  }

  async createEnvTemplate() {
    console.log('\n📝 Création template .env...');
    
    const envTemplate = `# 🔥 Configuration Firebase - FunLearning
# Remplacez par vos vraies clés Firebase

VITE_FIREBASE_API_KEY="votre-api-key-ici"
VITE_FIREBASE_AUTH_DOMAIN="votre-projet.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="votre-projet"
VITE_FIREBASE_STORAGE_BUCKET="votre-projet.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abc123"

# 🔧 Configuration développement
VITE_FIREBASE_EMULATOR_AUTH=true
VITE_FIREBASE_EMULATOR_FIRESTORE=true

# 📊 Configuration app
VITE_APP_NAME="FunLearning"
VITE_APP_VERSION="1.0.0"
`;

    try {
      const envExists = readFileSync(this.envPath, 'utf8');
      if (!envExists.includes('VITE_FIREBASE_API_KEY')) {
        writeFileSync(this.envPath, envTemplate, { flag: 'a' });
        console.log('✅ Variables Firebase ajoutées à .env');
      }
    } catch (error) {
      writeFileSync(this.envPath, envTemplate);
      console.log('✅ Fichier .env créé avec template Firebase');
    }
  }

  async updateConfiguration() {
    console.log('\n🟢 PHASE GREEN: Mise à jour configuration...');
    
    const newConfig = `// 🔥 Firebase Configuration - FunLearning V2.0
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
    throw new Error(\`🔥 Configuration Firebase incomplète: \${missing.join(', ')}\`);
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
`;

    writeFileSync(this.configPath, newConfig);
    console.log('✅ Configuration mise à jour avec variables d\'environnement');
  }

  async runTestsGreen() {
    console.log('\n🟢 PHASE GREEN: Validation tests...');
    
    console.log('⚠️  Pour valider les tests, vous devez:');
    console.log('1. Remplir les vraies clés dans .env');
    console.log('2. Exécuter: npm run test -- tests/firebase/auth.test.js');
    console.log('3. Vérifier que tous les tests passent');
  }

  async finalRecommendations() {
    console.log('\n🎯 RECOMMANDATIONS FINALES');
    console.log('═'.repeat(35));
    
    console.log(`
✅ PROCHAINES ÉTAPES:

1. 🔑 Remplir .env avec vraies clés Firebase
2. 🧪 Tester: npm run test -- tests/firebase/
3. 🚀 Démarrer: npm run dev
4. 🔍 Vérifier console navigateur (pas d'erreurs Firebase)
5. 🔐 Tester authentification sur /auth-google

🔧 SCRIPTS UTILES:
• npm run debug:firebase     - Diagnostic complet
• npm run test:firebase-auth - Tests spécifiques auth
• npm run validate:env       - Validation variables d'environnement

📊 MÉTRIQUES TDD:
• Tests RED ✅ → Configuration invalide détectée
• Tests GREEN ⏳ → À valider après saisie clés réelles
• Refactoring 🔄 → Configuration sécurisée avec env vars

🛡️ SÉCURITÉ:
• ✅ Clés Firebase dans .env (hors Git)
• ✅ Validation config au démarrage
• ✅ Gestion d'erreurs spécifiques
• ✅ Support emulator développement
    `);
  }
}

// Exécution
const fixer = new FirebaseConfigFixer();
fixer.fixConfiguration().catch(console.error);
