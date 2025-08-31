// 🔥 DEBUG_firebase_config.js - Diagnostic Firebase selon DOC_CoPilot_Practices
// Approche TDD : Tests diagnostic AVANT correction

import { readFileSync } from 'fs';
import { join } from 'path';

class FirebaseConfigDiagnostic {
  constructor() {
    this.configPath = './src/lib/firebase/config.js';
    this.envPath = './.env';
    this.issues = [];
    this.recommendations = [];
  }

  async runDiagnostic() {
    console.log('🔍 Diagnostic Firebase Configuration - TDD Approach');
    console.log('═'.repeat(65));
    
    await this.checkConfigFile();
    await this.checkEnvironmentVariables();
    await this.checkProjectStatus();
    await this.generateReport();
  }

  async checkConfigFile() {
    console.log('\n📋 1. Vérification fichier de configuration...');
    
    try {
      const configContent = readFileSync(this.configPath, 'utf8');
      
      // Test 1: Vérifier si utilise des clés de demo
      if (configContent.includes('demo-api-key')) {
        this.issues.push({
          type: 'CRITICAL',
          message: 'Configuration utilise des clés de démonstration',
          impact: 'Firebase Auth ne fonctionne pas',
          location: this.configPath
        });
        this.recommendations.push('Remplacer par de vraies clés Firebase');
      }
      
      // Test 2: Vérifier structure configuration
      const requiredFields = ['apiKey', 'authDomain', 'projectId'];
      requiredFields.forEach(field => {
        if (!configContent.includes(field)) {
          this.issues.push({
            type: 'ERROR',
            message: `Champ requis manquant: ${field}`,
            location: this.configPath
          });
        }
      });
      
      console.log(this.issues.length === 0 ? '✅ Configuration structure OK' : `❌ ${this.issues.length} problèmes détectés`);
      
    } catch (error) {
      this.issues.push({
        type: 'CRITICAL',
        message: 'Fichier de configuration introuvable',
        error: error.message
      });
    }
  }

  async checkEnvironmentVariables() {
    console.log('\n📋 2. Vérification variables d\'environnement...');
    
    try {
      const envContent = readFileSync(this.envPath, 'utf8');
      
      const firebaseEnvVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID'
      ];
      
      firebaseEnvVars.forEach(envVar => {
        if (!envContent.includes(envVar)) {
          this.recommendations.push(`Ajouter ${envVar} dans .env`);
        }
      });
      
      console.log('📝 Variables d\'environnement vérifiées');
      
    } catch (error) {
      this.issues.push({
        type: 'WARNING',
        message: 'Fichier .env non trouvé ou illisible',
        recommendation: 'Créer .env avec les clés Firebase'
      });
    }
  }

  async checkProjectStatus() {
    console.log('\n📋 3. Vérification projet Firebase...');
    
    // Vérifier si Firebase CLI est disponible
    try {
      const { execSync } = await import('child_process');
      execSync('firebase --version', { stdio: 'pipe' });
      console.log('✅ Firebase CLI disponible');
      
      // Essayer de vérifier le projet
      try {
        const projects = execSync('firebase projects:list --json', { stdio: 'pipe' });
        const projectsData = JSON.parse(projects.toString());
        
        if (projectsData.length === 0) {
          this.recommendations.push('Créer un projet Firebase avec: firebase init');
        } else {
          console.log(`✅ ${projectsData.length} projet(s) Firebase trouvé(s)`);
        }
      } catch (error) {
        this.recommendations.push('Se connecter à Firebase: firebase login');
      }
      
    } catch (error) {
      this.issues.push({
        type: 'WARNING',
        message: 'Firebase CLI non installé',
        recommendation: 'Installer: npm install -g firebase-tools'
      });
    }
  }

  async generateReport() {
    console.log('\n📊 RAPPORT DIAGNOSTIC FIREBASE');
    console.log('═'.repeat(65));
    
    // Issues critiques
    const criticalIssues = this.issues.filter(issue => issue.type === 'CRITICAL');
    if (criticalIssues.length > 0) {
      console.log('\n🚨 PROBLÈMES CRITIQUES:');
      criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.message}`);
        if (issue.location) console.log(`   📂 ${issue.location}`);
        if (issue.impact) console.log(`   💥 Impact: ${issue.impact}`);
      });
    }
    
    // Recommandations
    if (this.recommendations.length > 0) {
      console.log('\n💡 RECOMMANDATIONS:');
      this.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    
    // Solution TDD
    console.log('\n🎯 SOLUTION TDD RECOMMANDÉE:');
    console.log('1. Créer tests Firebase auth avant correction');
    console.log('2. Configurer projet Firebase réel');
    console.log('3. Mettre à jour config.js avec vraies clés');
    console.log('4. Valider tests passent avec nouvelle config');
    
    // Statut global
    const status = criticalIssues.length === 0 ? '✅ CONFIGURATION FONCTIONNELLE' : '❌ CONFIGURATION DÉFAILLANTE';
    console.log(`\n📋 STATUT: ${status}`);
    
    if (criticalIssues.length > 0) {
      console.log('\n🔧 ACTIONS IMMÉDIATES REQUISES:');
      console.log('   npm run fix:firebase-config');
      console.log('   npm run test:firebase-auth');
    }
  }
}

// Exécution du diagnostic
const diagnostic = new FirebaseConfigDiagnostic();
diagnostic.runDiagnostic().catch(console.error);
