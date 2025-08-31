#!/usr/bin/env node
/**
 * 📋 Générateur de Récapitulatifs de Phases
 * @description Crée automatiquement les fichiers phase-X-recap.md
 * @usage node scripts/generate-phase-recaps.cjs
 */

const fs = require('fs');
const path = require('path');

class PhaseRecapGenerator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.phasesDir = path.join(this.projectRoot, 'roadmap/phases');
    
    this.phaseData = {
      3: { title: 'Content Management', duration: '3-4 jours', version: 'v1.1' },
      4: { title: 'Pédagogie & Métacognition', duration: '3-4 jours', version: 'v1.1' },
      5: { title: 'Firebase Integration', duration: '2-3 jours', version: 'v1.2' },
      6: { title: 'Curriculum Generation', duration: '4-5 jours', version: 'v1.2' },
      7: { title: 'Interface Dynamique', duration: '3-4 jours', version: 'v1.5' },
      8: { title: 'Navigation & UX', duration: '3-4 jours', version: 'v1.5' },
      9: { title: 'Exercices & Évaluation', duration: '4-5 jours', version: 'v1.7' },
      10: { title: 'PWA & Offline', duration: '3-4 jours', version: 'v1.9' },
      11: { title: 'Admin Dashboard', duration: '3-4 jours', version: 'v1.9' },
      12: { title: 'Production Deployment', duration: '2-3 jours', version: 'v2.0' }
    };
  }

  generateRecapTemplate(phaseNum, data) {
    return `# 📋 Phase ${phaseNum} - ${data.title} - RÉCAPITULATIF

> **Status :** 🔄 **À VENIR** - ${data.title}  
> **Durée :** ${data.duration} (Estimé)  
> **Version :** ${data.version} - Évolution majeure  

---

## 🎯 **Objectifs Phase ${phaseNum} - À RÉALISER**

### 🎯 **Fonctionnalités principales**
- [ ] **Objectif 1** : Description à compléter
- [ ] **Objectif 2** : Description à compléter
- [ ] **Objectif 3** : Description à compléter
- [ ] **Objectif 4** : Description à compléter

### 🎯 **Qualité & Tests**
- [ ] **Tests unitaires** : Coverage >90%
- [ ] **Tests E2E** : Workflow complet
- [ ] **Performance** : Optimisations
- [ ] **Documentation** : Mise à jour complète

---

## 🏗️ **RÉALISATIONS PRÉVUES**

### **📁 Structure à Créer/Modifier**
\`\`\`
src/
├── [Structure spécifique Phase ${phaseNum}]
├── lib/
│   ├── components/
│   ├── stores/
│   └── utils/
└── tests/
    └── [Tests Phase ${phaseNum}]
\`\`\`

### **⚙️ Scripts NPM Phase ${phaseNum}**
\`\`\`bash
🎯 npm run dev:ia              # Orchestrateur Phase ${phaseNum}
🎯 npm run test:phase${phaseNum}        # Tests spécifiques
🎯 npm run validate:phase${phaseNum}    # Validation complète
\`\`\`

---

## 📊 **MÉTRIQUES DE SUCCÈS CIBLES**

### **🎯 Quality Gates Phase ${phaseNum}**
| Gate | Target | Validation |
|------|--------|------------|
| **Fonctionnel** | 100% specs | Toutes fonctionnalités |
| **Tests** | >90% coverage | Unit + E2E complets |
| **Performance** | Optimisé | Métriques cibles |
| **UX** | Fluide | Workflow utilisateur |

### **🎯 Livrables Validés**
- [ ] Fonctionnalité 1 opérationnelle
- [ ] Fonctionnalité 2 opérationnelle  
- [ ] Fonctionnalité 3 opérationnelle
- [ ] Tests complets 100% coverage
- [ ] Documentation mise à jour

---

## 🔄 **WORKFLOW PHASE ${phaseNum}**

### **Phase ${phaseNum}.1 : Préparation (Jour 1)**
\`\`\`bash
npm run dev:ia                # Orchestrateur Phase ${phaseNum}
# Mise en place infrastructure
# Création composants de base
# Tests unitaires initiaux
\`\`\`

### **Phase ${phaseNum}.2 : Développement (Jours 2-3)**
\`\`\`bash
npm run quality:gates         # Validation continue
# Implémentation fonctionnalités
# Tests E2E
# Optimisations performance
\`\`\`

### **Phase ${phaseNum}.3 : Finalisation (Jour final)**
\`\`\`bash
npm run validate             # Validation Phase ${phaseNum} complète
npm run test:phase${phaseNum}         # Tests complets
# Documentation finale
# Transition Phase ${phaseNum + 1}
\`\`\`

---

## 🔗 **LIENS PHASE ${phaseNum}**

- **📋 Phase Setup** : [phase-${phaseNum}-${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md](./phase-${phaseNum}-${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md)
- **📊 Phase Précédente** : [phase-${phaseNum - 1}-recap.md](./phase-${phaseNum - 1}-recap.md)
${phaseNum < 12 ? `- **🔄 Phase Suivante** : [phase-${phaseNum + 1}-recap.md](./phase-${phaseNum + 1}-recap.md)` : '- **🎉 PROJET TERMINÉ** : Déploiement production'}

---

**🎯 Phase ${phaseNum} : À VENIR** - ${data.title} avec ${data.version}`;
  }

  async generateAllRecaps() {
    console.log('📋 Génération des récapitulatifs de phases...');
    
    for (const [phaseNum, data] of Object.entries(this.phaseData)) {
      const recapFile = path.join(this.phasesDir, `phase-${phaseNum}-recap.md`);
      
      // Ne pas écraser si le fichier existe déjà
      if (fs.existsSync(recapFile)) {
        console.log(`⏭️ Phase ${phaseNum}: Récapitulatif existe déjà`);
        continue;
      }
      
      const content = this.generateRecapTemplate(parseInt(phaseNum), data);
      fs.writeFileSync(recapFile, content);
      console.log(`✅ Phase ${phaseNum}: Récapitulatif créé`);
    }
    
    console.log('\n🎉 Génération des récapitulatifs terminée !');
    
    // Créer un index des récapitulatifs
    this.generateRecapsIndex();
  }

  generateRecapsIndex() {
    const indexContent = `# 📋 Index des Récapitulatifs de Phases

> Vue d'ensemble des récapitulatifs par phase du projet FunLearning

---

## 🎯 **Récapitulatifs Disponibles**

### **✅ Phases Complétées**
- [📋 Phase 1 - Setup & Architecture](./phase-1-recap.md) ✅ **COMPLÉTÉE**

### **🔄 Phases En Cours/À Venir**
- [📋 Phase 2 - Authentication Système](./phase-2-recap.md) 🔄 **EN COURS**

### **🎯 Phases Planifiées**
${Object.entries(this.phaseData).map(([num, data]) => 
  `- [📋 Phase ${num} - ${data.title}](./phase-${num}-recap.md) 🎯 **${data.version}**`
).join('\n')}

---

## 🔧 **Utilisation des Récapitulatifs**

### **Pour le suivi de projet :**
\`\`\`bash
# Voir le status global
find roadmap/phases -name "*recap.md" -exec echo {} \\;

# Générer nouveaux récapitulatifs
node scripts/generate-phase-recaps.cjs
\`\`\`

### **Pour la documentation :**
- **Avant phase** : Consulter phase-X-setup.md (objectifs)
- **Après phase** : Mettre à jour phase-X-recap.md (réalisations)
- **Status global** : Consulter ROADMAP_LEARNING_SUMMARY.md

---

## 🔗 **Navigation Roadmap**

- **📊 Vue Stratégique** : [ROADMAP_LEARNING_SUMMARY.md](../ROADMAP_LEARNING_SUMMARY.md)
- **📋 Roadmap Principal** : [ROADMAP_LEARNING.md](../ROADMAP_LEARNING.md)
- **🤖 Roadmap Automation** : [ROADMAP_AUTOMATISATIONS_TECHNIQUES.md](../ROADMAP_AUTOMATISATIONS_TECHNIQUES.md)

---

**🎯 Suivi continu du projet FunLearning V2.0**`;

    const indexFile = path.join(this.phasesDir, 'README-RECAPS.md');
    fs.writeFileSync(indexFile, indexContent);
    console.log('📊 Index des récapitulatifs créé : README-RECAPS.md');
  }
}

// CLI Interface
if (require.main === module) {
  const generator = new PhaseRecapGenerator();
  generator.generateAllRecaps()
    .then(() => {
      console.log('\n🎯 Tous les récapitulatifs sont prêts !');
      process.exit(0);
    })
    .catch(error => {
      console.error('🚨 Erreur génération récapitulatifs:', error);
      process.exit(1);
    });
}

module.exports = PhaseRecapGenerator;
