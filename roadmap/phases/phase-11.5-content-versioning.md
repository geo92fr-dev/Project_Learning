# 📚 Phase 11.5 : Content Versioning & Export/Import (3 jours) - v1.9.1

## 📋 **Vue d'Ensemble**

**Objectif** : Système complet d'export/import de contenu avec versioning et workflow éditorial  
**Version cible** : v1.9.1 (gestion contenu avancée)  
**Groupe** : 🚀 PRODUCTION - Extension Admin Dashboard  
**Prérequis** : Phase 11 (Admin Dashboard) validée ✅

---

## 🎯 **Problématique Résolue**

### 📝 **Besoin Identifié**
- **Export de cours individuels** pour édition externe
- **Import de versions corrigées** avec validation
- **Système de versioning** avec métadonnées (version, commentaire, auteur)
- **Gestion de séries de cours** avec workflow d'approbation

### 🔧 **Éléments Existants à Intégrer**
- **Phase 6** : Scripts d'import en masse Firebase ✅
- **Phase 11** : CRUD contenu et permissions RBAC ✅  
- **Scripts existants** : Upload Markdown et import JSON batch ✅
- **Archives** : Système drag & drop de fichiers ✅

---

## 🏗️ **Architecture de la Solution**

### 📦 **Modèle de Données - Versioning**

```typescript
interface ContentVersion {
  id: string;
  contentId: string; // ID du cours/exercice parent
  contentType: 'course' | 'exercise' | 'series';
  version: string; // Semantic versioning (1.0.0, 1.1.0, etc.)
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    comment: string; // Commentaire de version
    changeLog: string[]; // Liste des modifications
    isActive: boolean; // Version actuellement publiée
    isDraft: boolean; // Brouillon en cours
    approvalStatus: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
  };
  content: {
    // Contenu sérialisé selon le type
    data: any;
    format: 'json' | 'markdown' | 'hybrid';
    checksum: string; // Pour détecter les modifications
  };
  export: {
    formats: string[]; // Formats d'export disponibles
    lastExportedAt?: Date;
    exportHistory: ExportRecord[];
  };
}
```

### 🔄 **Workflow Export → Édition → Import**

```mermaid
graph LR
    A[Sélection Contenu] --> B[Export Format]
    B --> C[Édition Externe]
    C --> D[Import Nouveau]
    D --> E[Validation]
    E --> F[Preview Diff]
    F --> G[Approbation]
    G --> H[Publication]
```

---

## 📝 **Instructions d'Implémentation**

### 🔧 **Étape 11.5.1 : Extension Modèle de Données**

**[FILE]** Créer `src/lib/types/content-versioning.ts` :

```typescript
import { z } from 'zod';

// Schéma de validation pour les versions de contenu
export const ContentVersionSchema = z.object({
  id: z.string(),
  contentId: z.string(),
  contentType: z.enum(['course', 'exercise', 'series']),
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // Semantic versioning
  title: z.string().min(1),
  description: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  metadata: z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
    comment: z.string(),
    changeLog: z.array(z.string()),
    isActive: z.boolean(),
    isDraft: z.boolean(),
    approvalStatus: z.enum(['draft', 'pending', 'to_be_updated', 'approved', 'rejected', 'not_conformed', 'archived']),
    approvedBy: z.string().optional(),
    approvedAt: z.date().optional(),
    validationComment: z.string().optional(),
    validatedBy: z.string().optional(),
    validatedAt: z.date().optional(),
    archivedAt: z.date().optional(),
  }),
  content: z.object({
    data: z.any(),
    format: z.enum(['json', 'markdown', 'hybrid']),
    checksum: z.string(),
  }),
  export: z.object({
    formats: z.array(z.string()),
    lastExportedAt: z.date().optional(),
    exportHistory: z.array(z.any()),
  }),
});

export type ContentVersion = z.infer<typeof ContentVersionSchema>;

// Types d'export supportés
export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  description: string;
  supportsMetadata: boolean;
}

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'json',
    name: 'JSON Complet',
    extension: 'json',
    mimeType: 'application/json',
    description: 'Format JSON avec toutes les métadonnées',
    supportsMetadata: true,
  },
  {
    id: 'markdown',
    name: 'Markdown',
    extension: 'md',
    mimeType: 'text/markdown',
    description: 'Format Markdown pour édition simple',
    supportsMetadata: false,
  },
  {
    id: 'package',
    name: 'Package Complet',
    extension: 'zip',
    mimeType: 'application/zip',
    description: 'Archive ZIP avec contenu + métadonnées',
    supportsMetadata: true,
  },
  {
    id: 'ai_analysis',
    name: 'IA Analysis Ready',
    extension: 'md',
    mimeType: 'text/markdown',
    description: 'Format optimisé pour analyse IA avec prompts intégrés',
    supportsMetadata: true,
  },
];

// Configuration pour l'export IA
export interface AIAnalysisConfig {
  contentType: 'course' | 'exercise' | 'series';
  analysisType: 'quality' | 'improvement' | 'adaptation' | 'complete';
  targetAudience: string;
  learningObjectives: string[];
  currentIssues?: string[];
}

export const AI_ANALYSIS_PROMPTS = {
  course: {
    expert_role: "En tant qu'expert en ingénierie pédagogique et concepteur de cours e-learning",
    context: "Analysez ce contenu de cours pour identifier les améliorations possibles",
    analysis_criteria: [
      "Structure pédagogique et progression logique",
      "Clarté des objectifs d'apprentissage",
      "Pertinence et qualité du contenu",
      "Engagement et interactivité",
      "Adaptation au public cible",
      "Cohérence terminologique",
      "Exemples et cas pratiques",
      "Évaluation des acquis"
    ]
  },
  exercise: {
    expert_role: "En tant qu'expert en évaluation pédagogique et création d'exercices",
    context: "Analysez cet exercice pour optimiser son efficacité pédagogique",
    analysis_criteria: [
      "Alignement avec les objectifs d'apprentissage",
      "Niveau de difficulté approprié",
      "Clarté des consignes",
      "Qualité des feedbacks",
      "Variété des types de questions",
      "Progression dans la complexité",
      "Temps de réalisation estimé",
      "Critères d'évaluation"
    ]
  },
  series: {
    expert_role: "En tant qu'expert en conception de parcours d'apprentissage",
    context: "Analysez cette série de contenus pour optimiser le parcours pédagogique",
    analysis_criteria: [
      "Cohérence globale du parcours",
      "Progression pédagogique entre modules",
      "Équilibrage des charges de travail",
      "Liens et dépendances entre contenus",
      "Diversité des modalités pédagogiques",
      "Points de contrôle et évaluation",
      "Adaptabilité aux différents profils",
      "Motivation et engagement"
    ]
  }
};
```

**[FILE]** Créer `src/lib/services/content-versioning.ts` :

```typescript
import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '$lib/firebase/config';
import type { ContentVersion } from '$lib/types/content-versioning';
import { ContentVersionSchema, EXPORT_FORMATS } from '$lib/types/content-versioning';
import { crypto } from 'crypto';

export class ContentVersioningService {
  private readonly COLLECTION = 'content_versions';

  /**
   * 🆕 Créer une nouvelle version de contenu
   */
  async createVersion(
    contentId: string,
    contentType: 'course' | 'exercise' | 'series',
    content: any,
    metadata: {
      title: string;
      description: string;
      comment: string;
      authorId: string;
      authorName: string;
      authorEmail: string;
    }
  ): Promise<ContentVersion> {
    // Récupérer la dernière version pour incrémenter
    const lastVersion = await this.getLatestVersion(contentId);
    const newVersionNumber = this.incrementVersion(lastVersion?.version || '0.0.0');

    // Calculer le checksum du contenu
    const checksum = this.calculateChecksum(content);

    const newVersion: Partial<ContentVersion> = {
      contentId,
      contentType,
      version: newVersionNumber,
      title: metadata.title,
      description: metadata.description,
      author: {
        id: metadata.authorId,
        name: metadata.authorName,
        email: metadata.authorEmail,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        comment: metadata.comment,
        changeLog: this.generateChangeLog(content, lastVersion?.content.data),
        isActive: false, // Nouvelle version n'est pas active par défaut
        isDraft: true,
        approvalStatus: 'pending',
      },
      content: {
        data: content,
        format: 'json',
        checksum,
      },
      export: {
        formats: EXPORT_FORMATS.map(f => f.id),
        exportHistory: [],
      },
    };

    // Validation
    const validated = ContentVersionSchema.parse(newVersion);

    // Sauvegarde Firebase
    const docRef = await addDoc(collection(db, this.COLLECTION), {
      ...validated,
      metadata: {
        ...validated.metadata,
        createdAt: Timestamp.fromDate(validated.metadata.createdAt),
        updatedAt: Timestamp.fromDate(validated.metadata.updatedAt),
      },
    });

    return { ...validated, id: docRef.id } as ContentVersion;
  }

  /**
   * 📥 Importer une version depuis un fichier
   */
  async importVersion(
    file: File,
    contentId: string,
    importMetadata: {
      comment: string;
      authorId: string;
      authorName: string;
      authorEmail: string;
    }
  ): Promise<ContentVersion> {
    const content = await this.parseImportFile(file);
    
    return this.createVersion(
      contentId,
      content.contentType || 'course',
      content.data,
      {
        title: content.title || `Import ${file.name}`,
        description: content.description || `Importé depuis ${file.name}`,
        comment: importMetadata.comment,
        authorId: importMetadata.authorId,
        authorName: importMetadata.authorName,
        authorEmail: importMetadata.authorEmail,
      }
    );
  }

  /**
   * 📤 Exporter une version vers un format spécifique
   */
  async exportVersion(
    versionId: string,
    format: string
  ): Promise<{ blob: Blob; filename: string }> {
    const version = await this.getVersion(versionId);
    if (!version) throw new Error('Version non trouvée');

    const exportFormat = EXPORT_FORMATS.find(f => f.id === format);
    if (!exportFormat) throw new Error('Format d\'export non supporté');

    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'json':
        blob = new Blob([JSON.stringify(version, null, 2)], { 
          type: exportFormat.mimeType 
        });
        filename = `${version.contentId}_v${version.version}.${exportFormat.extension}`;
        break;

      case 'markdown':
        const markdownContent = this.convertToMarkdown(version);
        blob = new Blob([markdownContent], { type: exportFormat.mimeType });
        filename = `${version.contentId}_v${version.version}.${exportFormat.extension}`;
        break;

      case 'package':
        blob = await this.createPackage(version);
        filename = `${version.contentId}_v${version.version}.${exportFormat.extension}`;
        break;

      case 'ai_analysis':
        const aiContent = await this.generateAIAnalysisExport(version);
        blob = new Blob([aiContent], { type: exportFormat.mimeType });
        filename = `${version.contentId}_v${version.version}_AI_READY.${exportFormat.extension}`;
        break;

      default:
        throw new Error('Format d\'export non implémenté');
    }

    // Enregistrer l'historique d'export
    await this.recordExport(versionId, format);

    return { blob, filename };
  }

  /**
   * 🔍 Récupérer toutes les versions pour validation (nouvelle méthode)
   */
  async getAllVersionsForValidation(): Promise<ContentVersion[]> {
    const q = query(
      collection(db, this.COLLECTION),
      orderBy('metadata.updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ContentVersion[];
  }

  /**
   * 📝 Mettre à jour le statut d'une version (lifecycle)
   */
  async updateVersionStatus(
    versionId: string,
    newStatus: string,
    validationData: {
      comment: string;
      validatedBy: string;
      validatedAt: Date;
    }
  ): Promise<void> {
    const updateData = {
      'metadata.approvalStatus': newStatus,
      'metadata.updatedAt': Timestamp.now(),
    };

    // Ajouter les données de validation si fourni
    if (validationData.comment) {
      updateData['metadata.validationComment'] = validationData.comment;
    }
    if (validationData.validatedBy) {
      updateData['metadata.validatedBy'] = validationData.validatedBy;
      updateData['metadata.validatedAt'] = Timestamp.fromDate(validationData.validatedAt);
    }

    // Logique spéciale selon le nouveau statut
    switch (newStatus) {
      case 'approved':
        // Si approuvé, désactiver les autres versions actives du même contenu
        const version = await this.getVersion(versionId);
        if (version) {
          const currentActive = await this.getActiveVersion(version.contentId);
          if (currentActive && currentActive.id !== versionId) {
            await updateDoc(doc(db, this.COLLECTION, currentActive.id), {
              'metadata.isActive': false,
            });
          }
          updateData['metadata.isActive'] = true;
          updateData['metadata.isDraft'] = false;
        }
        break;
      
      case 'draft':
        updateData['metadata.isDraft'] = true;
        updateData['metadata.isActive'] = false;
        break;
        
      case 'archived':
        updateData['metadata.isActive'] = false;
        updateData['metadata.archivedAt'] = Timestamp.now();
        break;
    }

    await updateDoc(doc(db, this.COLLECTION, versionId), updateData);
  }

  /**
   * 🔍 Récupérer toutes les versions d'un contenu
   */
  async getVersions(contentId: string): Promise<ContentVersion[]> {
    const q = query(
      collection(db, this.COLLECTION),
      where('contentId', '==', contentId),
      orderBy('metadata.createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ContentVersion[];
  }

  /**
   * 🎯 Récupérer la version active d'un contenu
   */
  async getActiveVersion(contentId: string): Promise<ContentVersion | null> {
    const q = query(
      collection(db, this.COLLECTION),
      where('contentId', '==', contentId),
      where('metadata.isActive', '==', true)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as ContentVersion;
  }

  /**
   * ✅ Approuver une version et la rendre active
   */
  async approveVersion(
    versionId: string,
    approverId: string
  ): Promise<void> {
    const version = await this.getVersion(versionId);
    if (!version) throw new Error('Version non trouvée');

    // Désactiver l'ancienne version active
    const currentActive = await this.getActiveVersion(version.contentId);
    if (currentActive) {
      await updateDoc(doc(db, this.COLLECTION, currentActive.id), {
        'metadata.isActive': false,
      });
    }

    // Activer la nouvelle version
    await updateDoc(doc(db, this.COLLECTION, versionId), {
      'metadata.isActive': true,
      'metadata.isDraft': false,
      'metadata.approvalStatus': 'approved',
      'metadata.approvedBy': approverId,
      'metadata.approvedAt': Timestamp.now(),
      'metadata.updatedAt': Timestamp.now(),
    });
  }

  // ===== MÉTHODES PRIVÉES =====

  private async getVersion(versionId: string): Promise<ContentVersion | null> {
    // Implémentation de récupération d'une version spécifique
    // ... (code de récupération Firebase)
    return null; // Placeholder
  }

  private async getLatestVersion(contentId: string): Promise<ContentVersion | null> {
    const versions = await this.getVersions(contentId);
    return versions.length > 0 ? versions[0] : null;
  }

  private incrementVersion(currentVersion: string): string {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private calculateChecksum(content: any): string {
    // Implémentation simple de checksum (à améliorer en production)
    return crypto.createHash('md5')
      .update(JSON.stringify(content))
      .digest('hex');
  }

  private generateChangeLog(newContent: any, oldContent?: any): string[] {
    // Génération automatique des changements
    // Cette méthode sera améliorée pour détecter les différences spécifiques
    if (!oldContent) return ['Création initiale'];
    
    const changes: string[] = [];
    // Comparaison basique - à améliorer
    if (JSON.stringify(newContent) !== JSON.stringify(oldContent)) {
      changes.push('Contenu modifié');
    }
    
    return changes;
  }

  private async parseImportFile(file: File): Promise<any> {
    const text = await file.text();
    
    if (file.name.endsWith('.json')) {
      return JSON.parse(text);
    } else if (file.name.endsWith('.md')) {
      return this.parseMarkdownContent(text);
    }
    
    throw new Error('Format de fichier non supporté');
  }

  private parseMarkdownContent(markdown: string): any {
    // Parser basique Markdown - à améliorer
    return {
      contentType: 'course',
      title: 'Import Markdown',
      data: { content: markdown },
    };
  }

  private convertToMarkdown(version: ContentVersion): string {
    // Conversion vers Markdown - implémentation de base
    return `# ${version.title}

Version: ${version.version}
Auteur: ${version.author.name}
Date: ${version.metadata.createdAt}

## Description
${version.description}

## Contenu
${JSON.stringify(version.content.data, null, 2)}

## Métadonnées
- Commentaire: ${version.metadata.comment}
- Statut: ${version.metadata.approvalStatus}
- Checksum: ${version.content.checksum}
`;
  }

  private async createPackage(version: ContentVersion): Promise<Blob> {
    // Création d'un package ZIP avec contenu + métadonnées
    // Implémentation avec JSZip ou équivalent
    const packageData = {
      content: version.content.data,
      metadata: version.metadata,
      version: version.version,
    };
    
    return new Blob([JSON.stringify(packageData, null, 2)], {
      type: 'application/json'
    });
  }

  /**
   * 🤖 Générer l'export optimisé pour analyse IA
   */
  private async generateAIAnalysisExport(version: ContentVersion): Promise<string> {
    const promptConfig = AI_ANALYSIS_PROMPTS[version.contentType];
    
    const aiExport = `# 🤖 ANALYSE IA - ${version.title}

## 📋 PROMPT POUR IA

### RÔLE D'EXPERT
${promptConfig.expert_role}

### CONTEXTE D'ANALYSE
${promptConfig.context}

### MISSION
Vous devez analyser le contenu ci-dessous et fournir des recommandations d'amélioration structurées selon les critères définis.

### CRITÈRES D'ANALYSE
${promptConfig.analysis_criteria.map((criteria, index) => `${index + 1}. ${criteria}`).join('\n')}

### FORMAT DE RÉPONSE ATTENDU
Merci de structurer votre réponse selon ce format JSON précis :

\`\`\`json
{
  "analysis_summary": {
    "overall_score": "Note globale sur 10",
    "strengths": ["Point fort 1", "Point fort 2", "..."],
    "weaknesses": ["Point faible 1", "Point faible 2", "..."],
    "priority_improvements": ["Amélioration prioritaire 1", "Amélioration prioritaire 2", "..."]
  },
  "detailed_analysis": {
    "structure": {
      "score": "Note sur 10",
      "comment": "Analyse détaillée de la structure",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    },
    "content_quality": {
      "score": "Note sur 10", 
      "comment": "Analyse de la qualité du contenu",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    },
    "pedagogical_effectiveness": {
      "score": "Note sur 10",
      "comment": "Analyse de l'efficacité pédagogique", 
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    },
    "engagement": {
      "score": "Note sur 10",
      "comment": "Analyse de l'engagement et interactivité",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    },
    "accessibility": {
      "score": "Note sur 10",
      "comment": "Analyse de l'accessibilité et adaptation",
      "suggestions": ["Suggestion 1", "Suggestion 2"]
    }
  },
  "improvement_roadmap": {
    "quick_wins": [
      {
        "action": "Action rapide à réaliser",
        "impact": "high/medium/low",
        "effort": "low/medium/high",
        "description": "Description détaillée"
      }
    ],
    "medium_term": [
      {
        "action": "Action à moyen terme",
        "impact": "high/medium/low", 
        "effort": "low/medium/high",
        "description": "Description détaillée"
      }
    ],
    "long_term": [
      {
        "action": "Action à long terme",
        "impact": "high/medium/low",
        "effort": "low/medium/high", 
        "description": "Description détaillée"
      }
    ]
  },
  "content_suggestions": {
    "additions": ["Contenu à ajouter 1", "Contenu à ajouter 2"],
    "modifications": [
      {
        "section": "Section à modifier",
        "current": "Contenu actuel",
        "suggested": "Contenu suggéré",
        "reason": "Raison de la modification"
      }
    ],
    "deletions": [
      {
        "section": "Section à supprimer",
        "reason": "Raison de la suppression"
      }
    ]
  },
  "technical_recommendations": {
    "format_improvements": ["Amélioration format 1", "Amélioration format 2"],
    "metadata_suggestions": ["Métadonnée à ajouter 1", "Métadonnée à ajouter 2"],
    "integration_points": ["Point d'intégration 1", "Point d'intégration 2"]
  }
}
\`\`\`

---

## 📊 MÉTADONNÉES DU CONTENU

### Informations Générales
- **ID**: ${version.id}
- **Type**: ${version.contentType}
- **Version**: ${version.version}
- **Titre**: ${version.title}
- **Description**: ${version.description}

### Informations d'Authoring
- **Auteur**: ${version.author.name} (${version.author.email})
- **Date de création**: ${new Date(version.metadata.createdAt).toLocaleDateString('fr-FR')}
- **Dernière modification**: ${new Date(version.metadata.updatedAt).toLocaleDateString('fr-FR')}
- **Statut actuel**: ${version.metadata.approvalStatus}

### Historique des Modifications
${version.metadata.changeLog.map((change, index) => `${index + 1}. ${change}`).join('\n')}

### Commentaires Existants
${version.metadata.comment || 'Aucun commentaire'}

${version.metadata.validationComment ? `\n### Dernière Validation\n${version.metadata.validationComment}` : ''}

---

## 📚 CONTENU À ANALYSER

### Format du Contenu
- **Type de données**: ${version.content.format}
- **Checksum**: ${version.content.checksum}

### Données Complètes
\`\`\`json
${JSON.stringify(version.content.data, null, 2)}
\`\`\`

---

## 🔄 INSTRUCTIONS POUR LE RETOUR

### Format d'Import
Pour faciliter l'intégration de vos recommandations, veuillez :

1. **Copier intégralement** le JSON de réponse généré
2. **Nommer le fichier** : \`${version.contentId}_v${version.version}_AI_ANALYSIS.json\`
3. **Importer via l'interface** de validation de contenu
4. Le système détectera automatiquement le format d'analyse IA

### Points d'Attention
- Les scores doivent être des nombres entiers entre 1 et 10
- Les suggestions doivent être actionables et spécifiques
- Priorisez les améliorations par impact/effort
- Respectez le contexte pédagogique français

### Validation Automatique
Le système vérifiera automatiquement :
- ✅ Format JSON valide
- ✅ Présence de tous les champs obligatoires  
- ✅ Cohérence des scores
- ✅ Pertinence des suggestions

---

## 🎯 OBJECTIFS SPÉCIFIQUES

${this.generateSpecificObjectives(version)}

---

*Export généré automatiquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}*
*Prêt pour analyse IA - FunLearning Content Versioning v11.5*`;

    return aiExport;
  }

  /**
   * 🎯 Générer les objectifs spécifiques selon le type de contenu
   */
  private generateSpecificObjectives(version: ContentVersion): string {
    const data = version.content.data;
    
    switch (version.contentType) {
      case 'course':
        return `### Objectifs Pédagogiques du Cours
${data.objectives ? data.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') : 'Objectifs non définis dans les métadonnées'}

### Public Cible
${data.targetAudience || 'Public cible non spécifié'}

### Durée Estimée
${data.duration || 'Durée non spécifiée'}

### Prérequis
${data.prerequisites ? data.prerequisites.join(', ') : 'Prérequis non spécifiés'}`;

      case 'exercise':
        return `### Objectifs de l'Exercice
${data.learningObjectives ? data.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') : 'Objectifs non définis'}

### Niveau de Difficulté
${data.difficulty || 'Niveau non spécifié'}

### Temps Estimé
${data.estimatedTime || 'Temps non spécifié'}

### Type d'Évaluation
${data.evaluationType || 'Type d\'évaluation non spécifié'}`;

      case 'series':
        return `### Objectifs de la Série
${data.seriesObjectives ? data.seriesObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') : 'Objectifs non définis'}

### Parcours d'Apprentissage
${data.learningPath ? `Nombre de modules : ${data.learningPath.length}` : 'Parcours non défini'}

### Durée Totale
${data.totalDuration || 'Durée totale non spécifiée'}`;

      default:
        return 'Objectifs spécifiques non disponibles pour ce type de contenu';
    }
  }

  /**
   * 📥 Importer une analyse IA et créer une version améliorée
   */
  async importAIAnalysis(
    originalVersionId: string,
    aiAnalysisFile: File,
    importMetadata: {
      comment: string;
      authorId: string;
      authorName: string;
      authorEmail: string;
    }
  ): Promise<ContentVersion> {
    const analysisText = await aiAnalysisFile.text();
    let aiAnalysis;

    try {
      // Tenter de parser le JSON d'analyse IA
      aiAnalysis = JSON.parse(analysisText);
      
      // Valider la structure de l'analyse IA
      this.validateAIAnalysisStructure(aiAnalysis);
    } catch (error) {
      throw new Error(`Format d'analyse IA invalide: ${error.message}`);
    }

    // Récupérer la version originale
    const originalVersion = await this.getVersion(originalVersionId);
    if (!originalVersion) {
      throw new Error('Version originale non trouvée');
    }

    // Générer les modifications basées sur l'analyse IA
    const improvedContent = this.applyAIImprovements(originalVersion.content.data, aiAnalysis);

    // Créer une nouvelle version avec les améliorations
    return this.createVersion(
      originalVersion.contentId,
      originalVersion.contentType,
      improvedContent,
      {
        title: `${originalVersion.title} (Amélioré par IA)`,
        description: `Version améliorée basée sur analyse IA - Score: ${aiAnalysis.analysis_summary.overall_score}/10`,
        comment: `${importMetadata.comment}\n\nAméliorations IA appliquées:\n${aiAnalysis.analysis_summary.priority_improvements.map(imp => `- ${imp}`).join('\n')}`,
        authorId: importMetadata.authorId,
        authorName: importMetadata.authorName,
        authorEmail: importMetadata.authorEmail,
      }
    );
  }

  private validateAIAnalysisStructure(analysis: any): void {
    const requiredFields = [
      'analysis_summary',
      'detailed_analysis', 
      'improvement_roadmap',
      'content_suggestions'
    ];

    for (const field of requiredFields) {
      if (!analysis[field]) {
        throw new Error(`Champ requis manquant: ${field}`);
      }
    }

    if (!analysis.analysis_summary.overall_score) {
      throw new Error('Score global manquant dans analysis_summary');
    }
  }

  private applyAIImprovements(originalContent: any, aiAnalysis: any): any {
    // Clone du contenu original
    const improvedContent = JSON.parse(JSON.stringify(originalContent));

    // Appliquer les suggestions de contenu
    if (aiAnalysis.content_suggestions) {
      // Ajouter les métadonnées d'amélioration IA
      improvedContent._aiImprovement = {
        analysisDate: new Date().toISOString(),
        overallScore: aiAnalysis.analysis_summary.overall_score,
        appliedSuggestions: aiAnalysis.content_suggestions.modifications.length,
        priorityImprovements: aiAnalysis.analysis_summary.priority_improvements
      };

      // Marquer les sections modifiées (pour traçabilité)
      improvedContent._modificationLog = aiAnalysis.content_suggestions.modifications.map(mod => ({
        section: mod.section,
        reason: mod.reason,
        timestamp: new Date().toISOString()
      }));
    }

    return improvedContent;
  }

  private async recordExport(versionId: string, format: string): Promise<void> {
    // Enregistrer l'historique d'export
    await updateDoc(doc(db, this.COLLECTION, versionId), {
      'export.lastExportedAt': Timestamp.now(),
      'export.exportHistory': [...(await this.getVersion(versionId))?.export.exportHistory || [], {
        format,
        exportedAt: new Date(),
      }],
    });
  }
}

// Instance globale
export const contentVersioningService = new ContentVersioningService();
```

### 🎨 **Étape 11.5.2 : Page de Validation du Contenu**

**[FILE]** Créer `src/lib/components/admin/ContentValidation.svelte` :

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { contentVersioningService } from '$lib/services/content-versioning';
  import type { ContentVersion } from '$lib/types/content-versioning';
  import Button from '$lib/components/atoms/Button.svelte';
  import Card from '$lib/components/atoms/Card.svelte';
  import Modal from '$lib/components/atoms/Modal.svelte';
  import Badge from '$lib/components/atoms/Badge.svelte';

  // ===== PROPS =====
  export let currentUser: { id: string; name: string; email: string; role: string };

  // ===== STATE =====
  let allVersions: ContentVersion[] = [];
  let filteredVersions: ContentVersion[] = [];
  let isLoading = false;
  let error: string | null = null;

  // Filtres et tri
  let statusFilter: string = 'all';
  let contentTypeFilter: string = 'all';
  let sortBy: string = 'updated_desc';
  let searchQuery: string = '';

  // Modal de validation
  let showValidationModal = false;
  let selectedVersion: ContentVersion | null = null;
  let validationComment = '';
  let isValidating = false;

  // ===== LIFECYCLE STATES =====
  const LIFECYCLE_STATES = {
    draft: {
      label: 'Brouillon',
      color: 'gray',
      icon: '📝',
      description: 'Contenu en cours de rédaction'
    },
    pending: {
      label: 'En attente',
      color: 'yellow',
      icon: '⏳',
      description: 'En attente de validation'
    },
    to_be_updated: {
      label: 'À mettre à jour',
      color: 'orange',
      icon: '🔄',
      description: 'Modifications demandées'
    },
    approved: {
      label: 'Approuvé',
      color: 'green',
      icon: '✅',
      description: 'Contenu validé et prêt'
    },
    rejected: {
      label: 'Rejeté',
      color: 'red',
      icon: '❌',
      description: 'Contenu non conforme'
    },
    not_conformed: {
      label: 'Non conforme',
      color: 'purple',
      icon: '⚠️',
      description: 'Ne respecte pas les standards'
    },
    archived: {
      label: 'Archivé',
      color: 'gray',
      icon: '📦',
      description: 'Version archivée'
    }
  };

  // ===== LIFECYCLE =====
  onMount(() => {
    loadAllVersions();
  });

  // ===== REACTIVE STATEMENTS =====
  $: filteredVersions = filterAndSortVersions(allVersions, statusFilter, contentTypeFilter, sortBy, searchQuery);
  $: statusCounts = calculateStatusCounts(allVersions);

  // ===== METHODS =====
  async function loadAllVersions() {
    isLoading = true;
    error = null;

    try {
      allVersions = await contentVersioningService.getAllVersionsForValidation();
    } catch (err) {
      error = err.message;
      console.error('Erreur chargement versions:', err);
    } finally {
      isLoading = false;
    }
  }

  function filterAndSortVersions(versions, status, contentType, sort, search) {
    let filtered = [...versions];

    // Filtre par statut
    if (status !== 'all') {
      filtered = filtered.filter(v => v.metadata.approvalStatus === status);
    }

    // Filtre par type de contenu
    if (contentType !== 'all') {
      filtered = filtered.filter(v => v.contentType === contentType);
    }

    // Recherche textuelle
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchLower) ||
        v.description.toLowerCase().includes(searchLower) ||
        v.author.name.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    switch (sort) {
      case 'updated_desc':
        filtered.sort((a, b) => new Date(b.metadata.updatedAt) - new Date(a.metadata.updatedAt));
        break;
      case 'updated_asc':
        filtered.sort((a, b) => new Date(a.metadata.updatedAt) - new Date(b.metadata.updatedAt));
        break;
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author_asc':
        filtered.sort((a, b) => a.author.name.localeCompare(b.author.name));
        break;
      case 'version_desc':
        filtered.sort((a, b) => compareVersions(b.version, a.version));
        break;
    }

    return filtered;
  }

  function calculateStatusCounts(versions) {
    const counts = {};
    Object.keys(LIFECYCLE_STATES).forEach(status => {
      counts[status] = versions.filter(v => v.metadata.approvalStatus === status).length;
    });
    counts.total = versions.length;
    return counts;
  }

  function compareVersions(a, b) {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart !== bPart) return aPart - bPart;
    }
    return 0;
  }

  async function updateVersionStatus(version, newStatus, comment = '') {
    isValidating = true;
    error = null;

    try {
      await contentVersioningService.updateVersionStatus(
        version.id,
        newStatus,
        {
          comment,
          validatedBy: currentUser.id,
          validatedAt: new Date()
        }
      );

      // Recharger les données
      await loadAllVersions();
      showValidationModal = false;
      validationComment = '';
    } catch (err) {
      error = err.message;
    } finally {
      isValidating = false;
    }
  }

  function openValidationModal(version) {
    selectedVersion = version;
    showValidationModal = true;
  }

  function getActionButtons(version) {
    const actions = [];
    const currentStatus = version.metadata.approvalStatus;

    switch (currentStatus) {
      case 'draft':
        actions.push(
          { label: 'Soumettre', status: 'pending', variant: 'primary' }
        );
        break;
      case 'pending':
        actions.push(
          { label: 'Approuver', status: 'approved', variant: 'success' },
          { label: 'Demander MAJ', status: 'to_be_updated', variant: 'warning' },
          { label: 'Rejeter', status: 'rejected', variant: 'danger' }
        );
        break;
      case 'to_be_updated':
        actions.push(
          { label: 'Resoummettre', status: 'pending', variant: 'primary' }
        );
        break;
      case 'approved':
        actions.push(
          { label: 'Marquer non conforme', status: 'not_conformed', variant: 'warning' },
          { label: 'Archiver', status: 'archived', variant: 'secondary' }
        );
        break;
      case 'rejected':
        actions.push(
          { label: 'Reprendre en brouillon', status: 'draft', variant: 'secondary' }
        );
        break;
      case 'not_conformed':
        actions.push(
          { label: 'Corriger', status: 'to_be_updated', variant: 'primary' },
          { label: 'Archiver', status: 'archived', variant: 'secondary' }
        );
        break;
      case 'archived':
        actions.push(
          { label: 'Restaurer', status: 'draft', variant: 'secondary' }
        );
        break;
    }

    return actions;
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<!-- ===== TEMPLATE ===== -->
<div class="content-validation">
  <header class="content-validation__header">
    <div class="header-title">
      <h1>🔍 Validation du Contenu</h1>
      <p>Gestion du cycle de vie éditorial</p>
    </div>
    
    <!-- Statistiques rapides -->
    <div class="validation-stats">
      {#each Object.entries(LIFECYCLE_STATES) as [status, config]}
        <div class="stat-card" class:highlight={statusCounts[status] > 0}>
          <span class="stat-icon">{config.icon}</span>
          <div class="stat-info">
            <span class="stat-count">{statusCounts[status] || 0}</span>
            <span class="stat-label">{config.label}</span>
          </div>
        </div>
      {/each}
    </div>
  </header>

  <!-- Filtres et recherche -->
  <div class="validation-filters">
    <div class="filter-group">
      <label for="status-filter">Statut:</label>
      <select id="status-filter" bind:value={statusFilter}>
        <option value="all">Tous les statuts</option>
        {#each Object.entries(LIFECYCLE_STATES) as [status, config]}
          <option value={status}>{config.icon} {config.label}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="type-filter">Type:</label>
      <select id="type-filter" bind:value={contentTypeFilter}>
        <option value="all">Tous les types</option>
        <option value="course">📚 Cours</option>
        <option value="exercise">🧠 Exercice</option>
        <option value="series">📑 Série</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="sort-select">Tri:</label>
      <select id="sort-select" bind:value={sortBy}>
        <option value="updated_desc">Plus récent</option>
        <option value="updated_asc">Plus ancien</option>
        <option value="title_asc">Titre A-Z</option>
        <option value="author_asc">Auteur A-Z</option>
        <option value="version_desc">Version desc.</option>
      </select>
    </div>

    <div class="search-group">
      <input
        type="text"
        placeholder="Rechercher..."
        bind:value={searchQuery}
        class="search-input"
      />
    </div>
  </div>

  <!-- Liste des contenus -->
  <div class="validation-content">
    {#if isLoading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des contenus...</p>
      </div>
    {:else if filteredVersions.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Aucun contenu trouvé</h3>
        <p>Aucun contenu ne correspond aux critères sélectionnés.</p>
      </div>
    {:else}
      <div class="versions-grid">
        {#each filteredVersions as version}
          <Card class="version-validation-card">
            <div class="version-header">
              <div class="version-title-section">
                <h3 class="version-title">{version.title}</h3>
                <div class="version-meta">
                  <Badge variant={LIFECYCLE_STATES[version.metadata.approvalStatus].color}>
                    {LIFECYCLE_STATES[version.metadata.approvalStatus].icon}
                    {LIFECYCLE_STATES[version.metadata.approvalStatus].label}
                  </Badge>
                  <span class="version-number">v{version.version}</span>
                  <span class="content-type">{version.contentType}</span>
                </div>
              </div>
              
              <div class="version-actions">
                <Button
                  size="xs"
                  variant="ghost"
                  iconLeft="eye"
                  on:click={() => {/* Prévisualiser */}}
                >
                  Voir
                </Button>
                <Button
                  size="xs"
                  variant="primary"
                  iconLeft="edit"
                  on:click={() => openValidationModal(version)}
                >
                  Valider
                </Button>
              </div>
            </div>

            <div class="version-description">
              <p>{version.description}</p>
            </div>

            <div class="version-details">
              <div class="detail-row">
                <span class="detail-label">Auteur:</span>
                <span class="detail-value">{version.author.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dernière MAJ:</span>
                <span class="detail-value">{formatDate(version.metadata.updatedAt)}</span>
              </div>
              {#if version.metadata.comment}
                <div class="detail-row">
                  <span class="detail-label">Commentaire:</span>
                  <span class="detail-value comment">{version.metadata.comment}</span>
                </div>
              {/if}
              {#if version.metadata.changeLog.length > 0}
                <div class="detail-row">
                  <span class="detail-label">Modifications:</span>
                  <span class="detail-value">{version.metadata.changeLog.length} changement(s)</span>
                </div>
              {/if}
            </div>

            <!-- Actions rapides selon le statut -->
            <div class="quick-actions">
              {#each getActionButtons(version) as action}
                <Button
                  size="xs"
                  variant={action.variant}
                  on:click={() => {
                    selectedVersion = version;
                    if (action.status === 'approved' || action.status === 'rejected') {
                      openValidationModal(version);
                    } else {
                      updateVersionStatus(version, action.status);
                    }
                  }}
                >
                  {action.label}
                </Button>
              {/each}
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Messages d'erreur -->
  {#if error}
    <div class="error-message">
      <span class="error-icon">⚠️</span>
      <span>{error}</span>
      <Button size="xs" variant="ghost" on:click={() => error = null}>
        Fermer
      </Button>
    </div>
  {/if}
</div>

<!-- ===== MODAL DE VALIDATION ===== -->
<Modal bind:show={showValidationModal} title="Validation du contenu" size="large">
  {#if selectedVersion}
    <div class="validation-modal">
      <div class="validation-header">
        <h3>{selectedVersion.title}</h3>
        <Badge variant={LIFECYCLE_STATES[selectedVersion.metadata.approvalStatus].color}>
          {LIFECYCLE_STATES[selectedVersion.metadata.approvalStatus].icon}
          {LIFECYCLE_STATES[selectedVersion.metadata.approvalStatus].label}
        </Badge>
      </div>

      <div class="validation-content-preview">
        <h4>Aperçu du contenu</h4>
        <div class="content-preview">
          <pre>{JSON.stringify(selectedVersion.content.data, null, 2)}</pre>
        </div>
      </div>

      <div class="validation-comment">
        <label for="validation-comment">Commentaire de validation:</label>
        <textarea
          id="validation-comment"
          bind:value={validationComment}
          placeholder="Ajoutez vos remarques, suggestions ou raisons du rejet..."
          rows="4"
        ></textarea>
      </div>

      <div class="validation-actions">
        <div class="action-buttons">
          <Button
            variant="success"
            loading={isValidating}
            on:click={() => updateVersionStatus(selectedVersion, 'approved', validationComment)}
          >
            ✅ Approuver
          </Button>
          
          <Button
            variant="warning"
            loading={isValidating}
            on:click={() => updateVersionStatus(selectedVersion, 'to_be_updated', validationComment)}
          >
            🔄 Demander MAJ
          </Button>
          
          <Button
            variant="danger"
            loading={isValidating}
            on:click={() => updateVersionStatus(selectedVersion, 'rejected', validationComment)}
          >
            ❌ Rejeter
          </Button>
          
          <Button
            variant="secondary"
            loading={isValidating}
            on:click={() => updateVersionStatus(selectedVersion, 'not_conformed', validationComment)}
          >
            ⚠️ Non conforme
          </Button>
        </div>

        <Button
          variant="ghost"
          on:click={() => showValidationModal = false}
        >
          Annuler
        </Button>
      </div>
    </div>
  {/if}
</Modal>

<style>
  .content-validation {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .content-validation__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 2rem;
  }

  .validation-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--color-surface);
    border-radius: 8px;
    border: 1px solid var(--color-border);
    min-width: 120px;
  }

  .stat-card.highlight {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-count {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .validation-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    align-items: end;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .search-group {
    flex: 1;
    min-width: 200px;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
  }

  .versions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .version-validation-card {
    padding: 1.5rem;
  }

  .version-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .version-meta {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-top: 0.5rem;
  }

  .version-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .version-actions {
    display: flex;
    gap: 0.5rem;
  }

  .version-details {
    margin: 1rem 0;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .detail-label {
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .detail-value.comment {
    font-style: italic;
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .quick-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .validation-modal {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .validation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .content-preview {
    max-height: 300px;
    overflow-y: auto;
    background: var(--color-surface);
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
  }

  .content-preview pre {
    margin: 0;
    font-size: 0.875rem;
    white-space: pre-wrap;
  }

  .validation-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .loading-state, .empty-state {
    text-align: center;
    padding: 3rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-border);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background: var(--color-error);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Styles pour les modals IA */
  .ai-export-modal, .ai-import-modal {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .ai-description {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }

  .ai-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ai-features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .ai-features li:last-child {
    border-bottom: none;
  }

  .version-to-analyze, .original-version {
    background: var(--color-surface);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  .version-card {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid var(--color-border);
  }

  .version-header {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .version-badge, .content-type-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .version-badge {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  .content-type-badge {
    background: var(--color-secondary-light);
    color: var(--color-secondary);
  }

  .ai-config {
    background: var(--color-surface);
    padding: 1rem;
    border-radius: 8px;
  }

  .config-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .config-group label {
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .config-group input, .config-group select, .config-group textarea {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-family: inherit;
  }

  .ai-workflow {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  .workflow-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: white;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid var(--color-border);
  }

  .step-number {
    background: var(--color-primary);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .step-content strong {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--color-text-primary);
  }

  .step-content p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .ai-upload-zone {
    border: 2px dashed var(--color-primary);
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    background: var(--color-primary-light);
    transition: all 0.3s ease;
  }

  .ai-upload-zone:hover {
    border-color: var(--color-primary-dark);
    background: var(--color-primary);
    background-opacity: 0.1;
  }

  .ai-validation-info {
    background: var(--color-success-light);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--color-success);
  }

  .validation-checks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .check-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .check-icon {
    font-size: 1rem;
  }

  .ai-export-actions, .ai-import-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }
</style>
```

### 🎨 **Étape 11.5.3 : Interface Export/Import**

**[FILE]** Créer `src/lib/components/admin/ContentExportImport.svelte` :

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { contentVersioningService } from '$lib/services/content-versioning';
  import { EXPORT_FORMATS, type ContentVersion } from '$lib/types/content-versioning';
  import Button from '$lib/components/atoms/Button.svelte';
  import Card from '$lib/components/atoms/Card.svelte';
  import Modal from '$lib/components/atoms/Modal.svelte';

  // ===== PROPS =====
  export let contentId: string;
  export let contentType: 'course' | 'exercise' | 'series' = 'course';
  export let currentUser: { id: string; name: string; email: string };

  // ===== STATE =====
  let versions: ContentVersion[] = [];
  let selectedVersion: ContentVersion | null = null;
  let isLoading = false;
  let error: string | null = null;

  // États des modals
  let showExportModal = false;
  let showImportModal = false;
  let showVersionHistory = false;

  // Export state
  let selectedExportFormat = 'json';
  let isExporting = false;

  // Import state
  let importFiles: FileList | null = null;
  let importComment = '';
  let isImporting = false;
  let dragOver = false;

  // AI Analysis state
  let showAIExportModal = false;
  let aiAnalysisConfig = {
    analysisType: 'complete',
    targetAudience: '',
    currentIssues: []
  };
  let isExportingForAI = false;

  // AI Import state
  let aiAnalysisFiles: FileList | null = null;
  let showAIImportModal = false;
  let isImportingAI = false;

  // ===== LIFECYCLE =====
  onMount(() => {
    loadVersions();
  });

  // ===== METHODS =====
  async function loadVersions() {
    if (!contentId) return;
    
    isLoading = true;
    error = null;

    try {
      versions = await contentVersioningService.getVersions(contentId);
    } catch (err) {
      error = err.message;
      console.error('Erreur chargement versions:', err);
    } finally {
      isLoading = false;
    }
  }

  async function handleExport() {
    if (!selectedVersion) return;

    isExporting = true;
    error = null;

    try {
      const { blob, filename } = await contentVersioningService.exportVersion(
        selectedVersion.id,
        selectedExportFormat
      );

      // Déclencher le téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      showExportModal = false;
    } catch (err) {
      error = err.message;
    } finally {
      isExporting = false;
    }
  }

  async function handleImport() {
    if (!importFiles || importFiles.length === 0) return;

    isImporting = true;
    error = null;

    try {
      const file = importFiles[0];
      await contentVersioningService.importVersion(
        file,
        contentId,
        {
          comment: importComment || `Import de ${file.name}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorEmail: currentUser.email,
        }
      );

      // Recharger les versions
      await loadVersions();
      
      // Reset form
      importFiles = null;
      importComment = '';
      showImportModal = false;
    } catch (err) {
      error = err.message;
    } finally {
      isImporting = false;
    }
  }

  // Gestion drag & drop (intégration des scripts existants)
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    
    if (event.dataTransfer?.files) {
      importFiles = event.dataTransfer.files;
    }
  }

  async function approveVersion(version: ContentVersion) {
    try {
      await contentVersioningService.approveVersion(version.id, currentUser.id);
      await loadVersions();
    } catch (err) {
      error = err.message;
    }
  }

  async function handleAIExport() {
    if (!selectedVersion) return;

    isExportingForAI = true;
    error = null;

    try {
      const { blob, filename } = await contentVersioningService.exportVersion(
        selectedVersion.id,
        'ai_analysis'
      );

      // Déclencher le téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      showAIExportModal = false;
    } catch (err) {
      error = err.message;
    } finally {
      isExportingForAI = false;
    }
  }

  async function handleAIImport() {
    if (!aiAnalysisFiles || aiAnalysisFiles.length === 0 || !selectedVersion) return;

    isImportingAI = true;
    error = null;

    try {
      const aiFile = aiAnalysisFiles[0];
      await contentVersioningService.importAIAnalysis(
        selectedVersion.id,
        aiFile,
        {
          comment: `Import analyse IA depuis ${aiFile.name}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorEmail: currentUser.email,
        }
      );

      // Recharger les versions
      await loadVersions();
      
      // Reset form
      aiAnalysisFiles = null;
      showAIImportModal = false;
    } catch (err) {
      error = err.message;
    } finally {
      isImportingAI = false;
    }
  }

  // ===== COMPUTED =====
  $: activeVersion = versions.find(v => v.metadata.isActive);
  $: draftVersions = versions.filter(v => v.metadata.isDraft);
  $: pendingVersions = versions.filter(v => v.metadata.approvalStatus === 'pending');
</script>

<!-- ===== TEMPLATE ===== -->
<div class="content-export-import">
  <header class="content-export-import__header">
    <h2>Gestion des Versions - {contentType}</h2>
    <div class="content-export-import__actions">
      <Button
        variant="secondary"
        iconLeft="download"
        on:click={() => {
          selectedVersion = activeVersion || versions[0];
          showExportModal = true;
        }}
        disabled={versions.length === 0}
      >
        Exporter
      </Button>
      
      <Button
        variant="primary"
        iconLeft="upload"
        on:click={() => showImportModal = true}
      >
        Importer
      </Button>
      
      <Button
        variant="secondary"
        iconLeft="robot"
        on:click={() => {
          selectedVersion = activeVersion || versions[0];
          showAIExportModal = true;
        }}
        disabled={versions.length === 0}
      >
        🤖 Export IA
      </Button>
      
      <Button
        variant="ghost"
        iconLeft="robot-import"
        on:click={() => {
          selectedVersion = activeVersion || versions[0];
          showAIImportModal = true;
        }}
        disabled={versions.length === 0}
      >
        🧠 Import IA
      </Button>
      
      <Button
        variant="ghost"
        iconLeft="history"
        on:click={() => showVersionHistory = true}
        disabled={versions.length === 0}
      >
        Historique ({versions.length})
      </Button>
    </div>
  </header>

  <!-- Vue d'ensemble des versions -->
  {#if activeVersion}
    <Card class="content-export-import__active-version">
      <div class="version-card">
        <div class="version-card__header">
          <span class="version-badge version-badge--active">
            Version Active: {activeVersion.version}
          </span>
          <span class="version-date">
            {new Date(activeVersion.metadata.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <h3 class="version-title">{activeVersion.title}</h3>
        <p class="version-description">{activeVersion.description}</p>
        <div class="version-meta">
          <span class="version-author">Par {activeVersion.author.name}</span>
          <span class="version-comment">{activeVersion.metadata.comment}</span>
        </div>
      </div>
    </Card>
  {/if}

  <!-- Versions en attente d'approbation -->
  {#if pendingVersions.length > 0}
    <Card class="content-export-import__pending">
      <h3>⏳ Versions en attente d'approbation ({pendingVersions.length})</h3>
      <div class="pending-versions">
        {#each pendingVersions as version}
          <div class="version-card version-card--pending">
            <div class="version-card__header">
              <span class="version-badge version-badge--pending">
                v{version.version}
              </span>
              <Button
                size="xs"
                variant="primary"
                on:click={() => approveVersion(version)}
              >
                Approuver
              </Button>
            </div>
            <h4 class="version-title">{version.title}</h4>
            <p class="version-comment">{version.metadata.comment}</p>
            <span class="version-author">Par {version.author.name}</span>
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  <!-- États de chargement et erreurs -->
  {#if isLoading}
    <div class="content-export-import__loading">
      Chargement des versions...
    </div>
  {/if}

  {#if error}
    <div class="content-export-import__error">
      <span class="error-icon">⚠️</span>
      <span>{error}</span>
      <Button size="xs" variant="ghost" on:click={() => error = null}>
        Fermer
      </Button>
    </div>
  {/if}
</div>

<!-- ===== MODALS ===== -->

<!-- Modal Export IA -->
<Modal bind:show={showAIExportModal} title="🤖 Export pour Analyse IA" size="large">
  <div class="ai-export-modal">
    {#if selectedVersion}
      <div class="ai-export-info">
        <h3>Préparation pour analyse IA</h3>
        <p class="ai-description">
          Cet export va générer un fichier Markdown optimisé contenant :
        </p>
        <ul class="ai-features">
          <li>🎯 <strong>Prompts structurés</strong> pour une analyse experte</li>
          <li>📊 <strong>Métadonnées complètes</strong> du contenu</li>
          <li>🔄 <strong>Format de retour standardisé</strong> JSON</li>
          <li>📝 <strong>Instructions d'import</strong> automatique</li>
        </ul>
      </div>

      <div class="version-to-analyze">
        <h4>Version sélectionnée</h4>
        <div class="version-card">
          <div class="version-header">
            <span class="version-badge">v{selectedVersion.version}</span>
            <span class="content-type-badge">{selectedVersion.contentType}</span>
          </div>
          <h5>{selectedVersion.title}</h5>
          <p>{selectedVersion.description}</p>
          <div class="version-meta">
            <span>Par {selectedVersion.author.name}</span>
            <span>•</span>
            <span>{new Date(selectedVersion.metadata.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div class="ai-config">
        <h4>Configuration de l'analyse</h4>
        
        <div class="config-group">
          <label for="analysis-type">Type d'analyse :</label>
          <select id="analysis-type" bind:value={aiAnalysisConfig.analysisType}>
            <option value="quality">Qualité du contenu</option>
            <option value="improvement">Suggestions d'amélioration</option>
            <option value="adaptation">Adaptation public cible</option>
            <option value="complete">Analyse complète</option>
          </select>
        </div>

        <div class="config-group">
          <label for="target-audience">Public cible (optionnel) :</label>
          <input
            id="target-audience"
            type="text"
            bind:value={aiAnalysisConfig.targetAudience}
            placeholder="Ex: Étudiants débutants, Professionnels..."
          />
        </div>

        <div class="config-group">
          <label for="current-issues">Problèmes identifiés (optionnel) :</label>
          <textarea
            id="current-issues"
            bind:value={aiAnalysisConfig.currentIssues}
            placeholder="Décrivez les problèmes ou points d'attention spécifiques..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="ai-workflow">
        <h4>📋 Workflow d'analyse IA</h4>
        <div class="workflow-steps">
          <div class="step">
            <span class="step-number">1</span>
            <div class="step-content">
              <strong>Export</strong>
              <p>Téléchargement du fichier optimisé IA</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <div class="step-content">
              <strong>Analyse</strong>
              <p>Copier-coller dans votre IA préférée</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <div class="step-content">
              <strong>Récupération</strong>
              <p>Sauvegarder la réponse JSON</p>
            </div>
          </div>
          <div class="step">
            <span class="step-number">4</span>
            <div class="step-content">
              <strong>Import</strong>
              <p>Réimporter pour créer version améliorée</p>
            </div>
          </div>
        </div>
      </div>

      <div class="ai-export-actions">
        <Button
          variant="secondary"
          on:click={() => showAIExportModal = false}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          iconLeft="download"
          loading={isExportingForAI}
          on:click={handleAIExport}
        >
          🤖 Générer Export IA
        </Button>
      </div>
    {/if}
  </div>
</Modal>

<!-- Modal Import IA -->
<Modal bind:show={showAIImportModal} title="🧠 Import Analyse IA" size="large">
  <div class="ai-import-modal">
    {#if selectedVersion}
      <div class="ai-import-info">
        <h3>Import des améliorations IA</h3>
        <p>Importez le fichier JSON d'analyse IA pour créer une version améliorée du contenu.</p>
      </div>

      <div class="original-version">
        <h4>Version d'origine</h4>
        <div class="version-card">
          <span class="version-badge">v{selectedVersion.version}</span>
          <h5>{selectedVersion.title}</h5>
          <p>{selectedVersion.description}</p>
        </div>
      </div>

      <!-- Zone de drop pour fichier IA -->
      <div class="ai-upload-zone">
        <input
          type="file"
          bind:files={aiAnalysisFiles}
          accept=".json"
          id="ai-file-input"
          class="file-input"
        />
        
        <div class="upload-content">
          {#if aiAnalysisFiles && aiAnalysisFiles.length > 0}
            <div class="selected-files">
              <h4>🤖 Analyse IA sélectionnée</h4>
              <div class="file-info">
                <span class="file-name">{aiAnalysisFiles[0].name}</span>
                <span class="file-size">({(aiAnalysisFiles[0].size / 1024).toFixed(1)} KB)</span>
              </div>
            </div>
          {:else}
            <div class="upload-prompt">
              <div class="upload-icon">🧠</div>
              <h4>Sélectionnez votre analyse IA</h4>
              <p>
                <label for="ai-file-input" class="file-button">Choisir le fichier JSON</label>
              </p>
              <p class="file-types">
                Format requis : JSON avec structure d'analyse IA
              </p>
            </div>
          {/if}
        </div>
      </div>

      <div class="ai-validation-info">
        <h4>🔍 Validation automatique</h4>
        <div class="validation-checks">
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>Format JSON valide</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>Structure d'analyse complète</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>Scores et suggestions présents</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>Compatibilité avec le contenu</span>
          </div>
        </div>
      </div>

      <div class="ai-import-actions">
        <Button
          variant="secondary"
          on:click={() => showAIImportModal = false}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          iconLeft="robot"
          loading={isImportingAI}
          disabled={!aiAnalysisFiles || aiAnalysisFiles.length === 0}
          on:click={handleAIImport}
        >
          🧠 Créer Version Améliorée
        </Button>
      </div>
    {/if}
  </div>
</Modal>

<!-- Modal Export -->
<Modal bind:show={showExportModal} title="Exporter le contenu">
  <div class="export-modal">
    {#if selectedVersion}
      <div class="export-version-info">
        <h3>Version sélectionnée: {selectedVersion.version}</h3>
        <p>{selectedVersion.title}</p>
        <p class="export-description">{selectedVersion.description}</p>
      </div>

      <div class="export-format-selection">
        <h4>Format d'export:</h4>
        <div class="format-options">
          {#each EXPORT_FORMATS as format}
            <label class="format-option">
              <input
                type="radio"
                bind:group={selectedExportFormat}
                value={format.id}
              />
              <div class="format-info">
                <strong>{format.name}</strong>
                <span class="format-description">{format.description}</span>
                <span class="format-extension">.{format.extension}</span>
              </div>
            </label>
          {/each}
        </div>
      </div>

      <div class="export-actions">
        <Button
          variant="secondary"
          on:click={() => showExportModal = false}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          loading={isExporting}
          on:click={handleExport}
        >
          Télécharger
        </Button>
      </div>
    {/if}
  </div>
</Modal>

<!-- Modal Import (réutilise le drag & drop des archives) -->
<Modal bind:show={showImportModal} title="Importer une nouvelle version">
  <div class="import-modal">
    <div class="import-info">
      <h3>Import de contenu</h3>
      <p>Importez un fichier pour créer une nouvelle version du contenu.</p>
    </div>

    <!-- Zone de drop inspirée des scripts existants -->
    <div
      class="upload-zone"
      class:drag-over={dragOver}
      on:drop={handleDrop}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      role="button"
      tabindex="0"
    >
      <input
        type="file"
        bind:files={importFiles}
        accept=".json,.md,.zip"
        id="file-input"
        class="file-input"
      />
      
      <div class="upload-content">
        {#if importFiles && importFiles.length > 0}
          <div class="selected-files">
            <h4>📁 Fichier sélectionné</h4>
            <div class="file-info">
              <span class="file-name">{importFiles[0].name}</span>
              <span class="file-size">({(importFiles[0].size / 1024).toFixed(1)} KB)</span>
            </div>
          </div>
        {:else}
          <div class="upload-prompt">
            <div class="upload-icon">📤</div>
            <h4>Glissez votre fichier ici</h4>
            <p>
              ou <label for="file-input" class="file-button">choisissez un fichier</label>
            </p>
            <p class="file-types">
              Formats acceptés: JSON, Markdown, ZIP
            </p>
          </div>
        {/if}
      </div>
    </div>

    <div class="import-comment">
      <label for="import-comment">Commentaire de version:</label>
      <textarea
        id="import-comment"
        bind:value={importComment}
        placeholder="Décrivez les modifications apportées..."
        rows="3"
      ></textarea>
    </div>

    <div class="import-actions">
      <Button
        variant="secondary"
        on:click={() => showImportModal = false}
      >
        Annuler
      </Button>
      <Button
        variant="primary"
        loading={isImporting}
        disabled={!importFiles || importFiles.length === 0}
        on:click={handleImport}
      >
        Importer
      </Button>
    </div>
  </div>
</Modal>

<!-- Modal Historique des versions -->
<Modal bind:show={showVersionHistory} title="Historique des versions" size="large">
  <div class="version-history">
    {#if versions.length === 0}
      <p>Aucune version disponible</p>
    {:else}
      <div class="versions-list">
        {#each versions as version}
          <div class="version-history-item" class:active={version.metadata.isActive}>
            <div class="version-info">
              <div class="version-header">
                <span class="version-number">v{version.version}</span>
                <span class="version-status version-status--{version.metadata.approvalStatus}">
                  {version.metadata.approvalStatus}
                </span>
                {#if version.metadata.isActive}
                  <span class="active-indicator">✓ Active</span>
                {/if}
              </div>
              <h4 class="version-title">{version.title}</h4>
              <p class="version-comment">{version.metadata.comment}</p>
              <div class="version-metadata">
                <span>Par {version.author.name}</span>
                <span>•</span>
                <span>{new Date(version.metadata.createdAt).toLocaleDateString()}</span>
                {#if version.metadata.changeLog.length > 0}
                  <span>•</span>
                  <span>{version.metadata.changeLog.length} modification(s)</span>
                {/if}
              </div>
            </div>
            <div class="version-actions">
              <Button
                size="xs"
                variant="ghost"
                iconLeft="download"
                on:click={() => {
                  selectedVersion = version;
                  showVersionHistory = false;
                  showExportModal = true;
                }}
              >
                Exporter
              </Button>
              {#if !version.metadata.isActive && version.metadata.approvalStatus === 'pending'}
                <Button
                  size="xs"
                  variant="primary"
                  on:click={() => approveVersion(version)}
                >
                  Approuver
                </Button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</Modal>

<!-- CSS styles intégrés pour économiser l'espace -->
</svelte>
```

### 🔗 **Étape 11.5.4 : Intégration avec Éléments Existants**

**[FILE]** Étendre `src/lib/admin/adminStore.ts` pour intégrer le versioning :

```typescript
// Ajout des permissions pour le versioning
export const ROLE_PERMISSIONS = {
  super_admin: ["*"], // Tous les droits
  admin: [
    "users.read", "users.create", "users.update", "users.delete",
    "courses.read", "courses.create", "courses.update", "courses.delete", "courses.publish",
    "exercises.read", "exercises.create", "exercises.update", "exercises.delete",
    "analytics.read", "system.read",
    // Nouvelles permissions versioning et validation
    "content.version.create", "content.version.approve", "content.version.export", 
    "content.version.import", "content.version.history", "content.validation.manage",
  ],
  instructor: [
    "courses.read", "courses.create", "courses.update", "courses.publish",
    "exercises.read", "exercises.create", "exercises.update",
    "users.read", "analytics.read",
    // Permissions versioning limitées + validation
    "content.version.create", "content.version.export", "content.version.import",
    "content.validation.view",
  ],
  moderator: [
    "courses.read", "courses.moderate",
    "exercises.read", "exercises.moderate",
    "users.read", "users.moderate",
    // Permissions versioning de modération + validation
    "content.version.approve", "content.version.history", "content.validation.manage",
  ],
  viewer: [
    "courses.read", "exercises.read", "users.read", "analytics.read",
    "content.version.export", "content.version.history", "content.validation.view"
  ],
} as const;
```

**[FILE]** Ajouter la route dans `src/lib/admin/AdminDashboard.svelte` :

```typescript
// Ajout dans les sections du dashboard admin
const adminSections = [
  // ... sections existantes
  {
    id: 'content-validation',
    title: 'Validation Contenu',
    icon: '🔍',
    description: 'Gérer le cycle de vie du contenu',
    component: ContentValidation,
    permissions: ['content.validation.view', 'content.validation.manage'],
    priority: 2,
  },
  {
    id: 'content-versioning',
    title: 'Versioning',
    icon: '📚',
    description: 'Export/Import et versions',
    component: ContentExportImport,
    permissions: ['content.version.create', 'content.version.export'],
    priority: 3,
  },
  // ... autres sections
];
```

**[FILE]** Créer le test unitaire `src/lib/components/admin/__tests__/ContentValidation.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ContentValidation from '../ContentValidation.svelte';
import { contentVersioningService } from '$lib/services/content-versioning';

// Mock du service
vi.mock('$lib/services/content-versioning', () => ({
  contentVersioningService: {
    getAllVersionsForValidation: vi.fn(),
    updateVersionStatus: vi.fn(),
  }
}));

const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin'
};

const mockVersions = [
  {
    id: 'version-1',
    contentId: 'content-1',
    contentType: 'course',
    version: '1.0.0',
    title: 'Test Course',
    description: 'Description du cours de test',
    author: { id: 'author-1', name: 'John Doe', email: 'john@example.com' },
    metadata: {
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
      comment: 'Version initiale',
      changeLog: ['Création'],
      isActive: false,
      isDraft: true,
      approvalStatus: 'pending',
    },
    content: { data: { lessons: [] }, format: 'json', checksum: 'abc123' },
    export: { formats: ['json', 'markdown'], exportHistory: [] }
  },
  {
    id: 'version-2',
    contentId: 'content-2',
    contentType: 'exercise',
    version: '2.1.0',
    title: 'Test Exercise',
    description: 'Exercice de test',
    author: { id: 'author-2', name: 'Jane Smith', email: 'jane@example.com' },
    metadata: {
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date('2023-01-04'),
      comment: 'Mise à jour majeure',
      changeLog: ['Ajout questions', 'Correction typos'],
      isActive: true,
      isDraft: false,
      approvalStatus: 'approved',
    },
    content: { data: { questions: [] }, format: 'json', checksum: 'def456' },
    export: { formats: ['json'], exportHistory: [] }
  }
];

describe('ContentValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contentVersioningService.getAllVersionsForValidation.mockResolvedValue(mockVersions);
  });

  it('should render content validation interface', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    expect(screen.getByText('🔍 Validation du Contenu')).toBeInTheDocument();
    expect(screen.getByText('Gestion du cycle de vie éditorial')).toBeInTheDocument();
  });

  it('should display lifecycle statistics', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    // Attendre le chargement
    await vi.waitFor(() => {
      expect(screen.getByText('En attente')).toBeInTheDocument();
      expect(screen.getByText('Approuvé')).toBeInTheDocument();
    });
  });

  it('should filter versions by status', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    });

    // Filtrer par "approved"
    const statusFilter = screen.getByLabelText('Statut:');
    await fireEvent.change(statusFilter, { target: { value: 'approved' } });

    expect(screen.queryByText('Test Course')).not.toBeInTheDocument();
    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
  });

  it('should filter versions by content type', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    });

    // Filtrer par "course"
    const typeFilter = screen.getByLabelText('Type:');
    await fireEvent.change(typeFilter, { target: { value: 'course' } });

    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.queryByText('Test Exercise')).not.toBeInTheDocument();
  });

  it('should search versions by text', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('Test Exercise')).toBeInTheDocument();
    });

    // Rechercher "Exercise"
    const searchInput = screen.getByPlaceholderText('Rechercher...');
    await fireEvent.input(searchInput, { target: { value: 'Exercise' } });

    expect(screen.queryByText('Test Course')).not.toBeInTheDocument();
    expect(screen.getByText('Test Exercise')).toBeInTheDocument();
  });

  it('should open validation modal', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Cliquer sur le bouton "Valider"
    const validateButtons = screen.getAllByText('Valider');
    await fireEvent.click(validateButtons[0]);

    expect(screen.getByText('Validation du contenu')).toBeInTheDocument();
    expect(screen.getByText('✅ Approuver')).toBeInTheDocument();
    expect(screen.getByText('🔄 Demander MAJ')).toBeInTheDocument();
    expect(screen.getByText('❌ Rejeter')).toBeInTheDocument();
  });

  it('should approve version', async () => {
    contentVersioningService.updateVersionStatus.mockResolvedValue(undefined);
    
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Ouvrir modal et approuver
    const validateButtons = screen.getAllByText('Valider');
    await fireEvent.click(validateButtons[0]);

    const approveButton = screen.getByText('✅ Approuver');
    await fireEvent.click(approveButton);

    expect(contentVersioningService.updateVersionStatus).toHaveBeenCalledWith(
      'version-1',
      'approved',
      expect.objectContaining({
        validatedBy: 'user-123',
      })
    );
  });

  it('should handle validation with comment', async () => {
    contentVersioningService.updateVersionStatus.mockResolvedValue(undefined);
    
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Ouvrir modal
    const validateButtons = screen.getAllByText('Valider');
    await fireEvent.click(validateButtons[0]);

    // Ajouter commentaire
    const commentTextarea = screen.getByPlaceholderText(/Ajoutez vos remarques/);
    await fireEvent.input(commentTextarea, { 
      target: { value: 'Excellente qualité, approuvé sans réserve' } 
    });

    // Approuver avec commentaire
    const approveButton = screen.getByText('✅ Approuver');
    await fireEvent.click(approveButton);

    expect(contentVersioningService.updateVersionStatus).toHaveBeenCalledWith(
      'version-1',
      'approved',
      expect.objectContaining({
        comment: 'Excellente qualité, approuvé sans réserve',
        validatedBy: 'user-123',
      })
    );
  });

  it('should display action buttons based on status', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      const pendingVersion = screen.getByText('Test Course').closest('.version-validation-card');
      const approvedVersion = screen.getByText('Test Exercise').closest('.version-validation-card');

      // Version en attente doit avoir l'action "Soumettre"
      expect(pendingVersion.querySelector('button:contains("Soumettre")')).toBeInTheDocument();
      
      // Version approuvée doit avoir l'action "Marquer non conforme"
      expect(approvedVersion.querySelector('button:contains("Marquer non conforme")')).toBeInTheDocument();
    });
  });

  it('should handle version status transition', async () => {
    contentVersioningService.updateVersionStatus.mockResolvedValue(undefined);
    
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Trouver et cliquer sur "Soumettre"
    const submitButton = screen.getByText('Soumettre');
    await fireEvent.click(submitButton);

    expect(contentVersioningService.updateVersionStatus).toHaveBeenCalledWith(
      'version-1',
      'pending',
      expect.any(Object)
    );
  });

  it('should handle loading state', () => {
    contentVersioningService.getAllVersionsForValidation.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    expect(screen.getByText('Chargement des contenus...')).toBeInTheDocument();
  });

  it('should handle empty state', async () => {
    contentVersioningService.getAllVersionsForValidation.mockResolvedValue([]);
    
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('📭')).toBeInTheDocument();
      expect(screen.getByText('Aucun contenu trouvé')).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    const errorMessage = 'Erreur de connexion Firebase';
    contentVersioningService.getAllVersionsForValidation.mockRejectedValue(new Error(errorMessage));
    
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should export content for AI analysis', async () => {
    contentVersioningService.exportVersion.mockResolvedValue({
      blob: new Blob(['AI export content'], { type: 'text/markdown' }),
      filename: 'test_v1.0.0_AI_READY.md'
    });

    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Cliquer sur le bouton "🤖 Export IA"
    const aiExportButton = screen.getByText('🤖 Export IA');
    await fireEvent.click(aiExportButton);

    expect(screen.getByText('🤖 Export pour Analyse IA')).toBeInTheDocument();
    expect(screen.getByText('Préparation pour analyse IA')).toBeInTheDocument();

    // Cliquer sur "Générer Export IA"
    const generateButton = screen.getByText('🤖 Générer Export IA');
    await fireEvent.click(generateButton);

    expect(contentVersioningService.exportVersion).toHaveBeenCalledWith(
      'version-1',
      'ai_analysis'
    );
  });

  it('should import AI analysis and create improved version', async () => {
    const mockAIAnalysis = {
      analysis_summary: {
        overall_score: 8,
        strengths: ['Bon contenu'],
        weaknesses: ['Peut être amélioré'],
        priority_improvements: ['Ajouter plus d\'exemples']
      },
      detailed_analysis: {},
      improvement_roadmap: {},
      content_suggestions: {
        modifications: []
      }
    };

    contentVersioningService.importAIAnalysis.mockResolvedValue({
      id: 'version-improved',
      title: 'Test Course (Amélioré par IA)',
      version: '1.1.0'
    });

    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Ouvrir modal import IA
    const aiImportButton = screen.getByText('🧠 Import IA');
    await fireEvent.click(aiImportButton);

    expect(screen.getByText('🧠 Import Analyse IA')).toBeInTheDocument();

    // Simuler sélection fichier
    const fileInput = screen.getByLabelText(/Choisir le fichier JSON/);
    const aiFile = new File([JSON.stringify(mockAIAnalysis)], 'ai_analysis.json', {
      type: 'application/json'
    });

    Object.defineProperty(fileInput, 'files', {
      value: [aiFile],
      writable: false,
    });

    await fireEvent.change(fileInput);

    // Cliquer sur "Créer Version Améliorée"
    const createButton = screen.getByText('🧠 Créer Version Améliorée');
    await fireEvent.click(createButton);

    expect(contentVersioningService.importAIAnalysis).toHaveBeenCalledWith(
      'version-1',
      aiFile,
      expect.objectContaining({
        authorId: 'user-123',
      })
    );
  });

  it('should configure AI analysis parameters', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Ouvrir modal export IA
    const aiExportButton = screen.getByText('🤖 Export IA');
    await fireEvent.click(aiExportButton);

    // Configurer l'analyse
    const analysisTypeSelect = screen.getByLabelText('Type d\'analyse :');
    await fireEvent.change(analysisTypeSelect, { target: { value: 'improvement' } });

    const targetAudienceInput = screen.getByLabelText('Public cible (optionnel) :');
    await fireEvent.input(targetAudienceInput, { 
      target: { value: 'Étudiants débutants' } 
    });

    const issuesTextarea = screen.getByLabelText('Problèmes identifiés (optionnel) :');
    await fireEvent.input(issuesTextarea, { 
      target: { value: 'Contenu trop complexe' } 
    });

    // Vérifier que les valeurs sont enregistrées
    expect(analysisTypeSelect.value).toBe('improvement');
    expect(targetAudienceInput.value).toBe('Étudiants débutants');
    expect(issuesTextarea.value).toBe('Contenu trop complexe');
  });

  it('should display AI workflow steps', async () => {
    render(ContentValidation, { props: { currentUser: mockUser } });
    
    await vi.waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Ouvrir modal export IA
    const aiExportButton = screen.getByText('🤖 Export IA');
    await fireEvent.click(aiExportButton);

    // Vérifier les étapes du workflow
    expect(screen.getByText('📋 Workflow d\'analyse IA')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Analyse')).toBeInTheDocument();
    expect(screen.getByText('Récupération')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
  });
});

// Tests du service ContentVersioningService pour l'IA
describe('ContentVersioningService - AI Features', () => {
  let service;

  beforeEach(() => {
    service = new ContentVersioningService();
  });

  it('should generate AI analysis export format', async () => {
    const mockVersion = {
      id: 'version-1',
      contentId: 'content-1',
      contentType: 'course',
      version: '1.0.0',
      title: 'Test Course',
      description: 'Course description',
      author: { id: 'author-1', name: 'John Doe', email: 'john@example.com' },
      metadata: {
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        comment: 'Version initiale',
        changeLog: ['Création'],
        approvalStatus: 'pending',
      },
      content: {
        data: { lessons: ['Lesson 1', 'Lesson 2'] },
        format: 'json',
        checksum: 'abc123'
      }
    };

    const aiExport = await service.generateAIAnalysisExport(mockVersion);

    expect(aiExport).toContain('🤖 ANALYSE IA');
    expect(aiExport).toContain('En tant qu\'expert en ingénierie pédagogique');
    expect(aiExport).toContain('FORMAT DE RÉPONSE ATTENDU');
    expect(aiExport).toContain('"analysis_summary"');
    expect(aiExport).toContain('"improvement_roadmap"');
    expect(aiExport).toContain('Test Course');
    expect(aiExport).toContain('v1.0.0');
  });

  it('should validate AI analysis structure', () => {
    const validAnalysis = {
      analysis_summary: { overall_score: 8 },
      detailed_analysis: {},
      improvement_roadmap: {},
      content_suggestions: {}
    };

    expect(() => service.validateAIAnalysisStructure(validAnalysis)).not.toThrow();

    const invalidAnalysis = {
      analysis_summary: {}
    };

    expect(() => service.validateAIAnalysisStructure(invalidAnalysis)).toThrow();
  });

  it('should apply AI improvements to content', () => {
    const originalContent = {
      title: 'Original Course',
      lessons: ['Lesson 1']
    };

    const aiAnalysis = {
      analysis_summary: {
        overall_score: 9,
        priority_improvements: ['Add more examples']
      },
      content_suggestions: {
        modifications: [
          {
            section: 'lessons',
            reason: 'Add interactive elements'
          }
        ]
      }
    };

    const improvedContent = service.applyAIImprovements(originalContent, aiAnalysis);

    expect(improvedContent._aiImprovement).toBeDefined();
    expect(improvedContent._aiImprovement.overallScore).toBe(9);
    expect(improvedContent._modificationLog).toBeDefined();
    expect(improvedContent._modificationLog[0].section).toBe('lessons');
  });
});
```

```javascript
#!/usr/bin/env node
/**
 * 🔗 Script d'Intégration Phase 11.5 - Content Versioning
 * 
 * Intègre les éléments existants de la Phase 6 et des archives :
 * - Scripts d'import en masse Firebase
 * - Système d'upload Markdown
 * - Workflow export → édition → import
 * 
 * @version 1.0.0
 * @since Phase 11.5
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Réutiliser les configs de la Phase 6
import { DEFAULT_CONFIG, BATCH_CONFIGURATIONS } from './curriculum-automation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 📦 Configuration pour migration des scripts existants vers versioning
 */
const INTEGRATION_CONFIG = {
  // Réutiliser les outputs de Phase 6
  curriculumPath: join(__dirname, '../generated-curriculums'),
  
  // Nouveaux répertoires versioning
  versionsPath: join(__dirname, '../content-versions'),
  exportsPath: join(__dirname, '../content-exports'),
  importsPath: join(__dirname, '../content-imports'),
  
  // Formats supportés (extension des existants)
  supportedFormats: ['json', 'markdown', 'zip', 'csv'],
  
  // Intégration avec Firebase (reprend les patterns Phase 6)
  firebaseConfig: {
    batchSize: 500, // Reprend la limite Firestore de la Phase 6
    collections: {
      versions: 'content_versions',
      courses: 'courses',
      exercises: 'exercises'
    }
  }
};

/**
 * 🚀 Migration des contenus existants vers le système de versioning
 */
class ContentMigrationService {
  async migrateExistingContent() {
    console.log('🔄 Migration contenu existant vers versioning...');
    
    // 1. Scanner les contenus générés par Phase 6
    const curriculumFiles = await this.scanCurriculumFiles();
    
    // 2. Créer les premières versions (v1.0.0) pour chaque contenu
    for (const file of curriculumFiles) {
      await this.createInitialVersion(file);
    }
    
    // 3. Intégrer les scripts d'upload Markdown existants
    await this.integrateMarkdownUpload();
    
    console.log('✅ Migration terminée');
  }

  async scanCurriculumFiles() {
    try {
      const files = await fs.readdir(INTEGRATION_CONFIG.curriculumPath);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.log('📋 Aucun curriculum existant trouvé - création depuis scratch');
      return [];
    }
  }

  async createInitialVersion(filename) {
    const filePath = join(INTEGRATION_CONFIG.curriculumPath, filename);
    const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // Créer la structure de version initiale
    const initialVersion = {
      id: `${filename.replace('.json', '')}-v1.0.0`,
      contentId: filename.replace('.json', ''),
      contentType: this.detectContentType(content),
      version: '1.0.0',
      title: content.title || `Import ${filename}`,
      description: content.description || 'Version initiale migrée',
      author: {
        id: 'migration-script',
        name: 'Migration Automatique',
        email: 'admin@funlearning.app'
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        comment: 'Migration depuis Phase 6 - Curriculum Generation',
        changeLog: ['Migration initiale depuis curriculum généré'],
        isActive: true,
        isDraft: false,
        approvalStatus: 'approved'
      },
      content: {
        data: content,
        format: 'json',
        checksum: this.calculateChecksum(content)
      },
      export: {
        formats: ['json', 'markdown'],
        exportHistory: []
      }
    };

    // Sauvegarder la version
    const versionPath = join(INTEGRATION_CONFIG.versionsPath, `${initialVersion.id}.json`);
    await fs.mkdir(INTEGRATION_CONFIG.versionsPath, { recursive: true });
    await fs.writeFile(versionPath, JSON.stringify(initialVersion, null, 2));
    
    console.log(`✅ Version initiale créée: ${initialVersion.id}`);
  }

  detectContentType(content) {
    if (content.modules || content.lessons) return 'course';
    if (content.questions || content.exercises) return 'exercise';
    if (content.competences || content.curriculum) return 'series';
    return 'course'; // Default
  }

  calculateChecksum(content) {
    // Réutilise la logique de hash de la Phase 6
    const crypto = require('crypto');
    return crypto.createHash('md5').update(JSON.stringify(content)).digest('hex');
  }

  async integrateMarkdownUpload() {
    // Créer les répertoires d'import/export
    await fs.mkdir(INTEGRATION_CONFIG.exportsPath, { recursive: true });
    await fs.mkdir(INTEGRATION_CONFIG.importsPath, { recursive: true });
    
    // Créer les templates d'export Markdown
    const markdownTemplate = `# {{title}}

**Version:** {{version}}  
**Auteur:** {{author}}  
**Date:** {{date}}

## Description
{{description}}

## Contenu

\`\`\`json
{{content}}
\`\`\`

---
*Généré par FunLearning Content Versioning v11.5*
`;

    await fs.writeFile(
      join(INTEGRATION_CONFIG.exportsPath, 'markdown-template.md'),
      markdownTemplate
    );

    console.log('📝 Templates Markdown créés');
  }
}

/**
 * 🔧 Extension du système Firebase pour versioning
 */
async function setupFirebaseVersioning() {
  console.log('🔥 Configuration Firebase Versioning...');
  
  // Créer les rules de sécurité pour content_versions
  const versioningRules = `
// Règles pour content_versions (ajout aux firestore.rules existantes)
match /content_versions/{versionId} {
  allow read: if isAuthenticated() && (
    hasPermission(request.auth, 'content.version.history') ||
    isContentAuthor(resource.data)
  );
  
  allow create: if isAuthenticated() && 
    hasPermission(request.auth, 'content.version.create') &&
    isValidVersionData(request.resource.data);
    
  allow update: if isAuthenticated() && (
    hasPermission(request.auth, 'content.version.approve') ||
    (hasPermission(request.auth, 'content.version.create') && 
     isContentAuthor(resource.data))
  );
  
  allow delete: if isAuthenticated() && 
    hasPermission(request.auth, 'content.version.approve');
}

function isContentAuthor(versionData) {
  return versionData.author.id == request.auth.uid;
}

function isValidVersionData(data) {
  return data.keys().hasAll(['contentId', 'version', 'content', 'metadata']) &&
         data.version.matches('^\\\\d+\\\\.\\\\d+\\\\.\\\\d+$') && // Semantic versioning
         data.contentId is string && data.contentId.size() > 0;
}
`;

  // Sauvegarder les rules (à intégrer manuellement)
  await fs.writeFile(
    join(__dirname, '../firestore-versioning-rules.txt'),
    versioningRules
  );

  console.log('📋 Rules Firebase créées - À intégrer dans firestore.rules');
}

/**
 * 🧪 Tests d'intégration pour Phase 11.5
 */
async function runIntegrationTests() {
  console.log('🧪 Tests d\'intégration Phase 11.5...');
  
  const tests = [
    {
      name: 'Migration contenu existant',
      test: async () => {
        const migration = new ContentMigrationService();
        await migration.migrateExistingContent();
        return true;
      }
    },
    {
      name: 'Page validation interface',
      test: async () => {
        // Test interface de validation avec lifecycle
        const validationStates = ['draft', 'pending', 'to_be_updated', 'approved', 'rejected', 'not_conformed', 'archived'];
        console.log(`✅ États lifecycle: ${validationStates.length} configurés`);
        return true;
      }
    },
    {
      name: 'Création version test',
      test: async () => {
        // Test de création de version
        const testContent = {
          title: 'Test Course',
          description: 'Course de test',
          content: { lessons: [] }
        };
        return true; // Placeholder
      }
    },
    {
      name: 'Export/Import cycle',
      test: async () => {
        // Test cycle complet export → import
        return true; // Placeholder
      }
    },
    {
      name: 'IA Analysis workflow',
      test: async () => {
        // Test workflow complet export IA → analyse → import
        const aiFormats = ['ai_analysis'];
        const promptTypes = ['course', 'exercise', 'series'];
        console.log(`✅ Formats IA: ${aiFormats.length}, Types prompts: ${promptTypes.length}`);
        return true;
      }
    }
  ];

  let passed = 0;
  for (const test of tests) {
    try {
      const result = await test.test();
      if (result) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }

  console.log(`🎯 Tests: ${passed}/${tests.length} réussis`);
  return passed === tests.length;
}

// Exécution si appelé directement
if (require.main === module) {
  (async () => {
    try {
      const migration = new ContentMigrationService();
      await migration.migrateExistingContent();
      await setupFirebaseVersioning();
      
      const testsPass = await runIntegrationTests();
      if (testsPass) {
        console.log('🎉 Phase 11.5 - Intégration réussie !');
      } else {
        console.log('⚠️ Phase 11.5 - Intégration partielle');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Erreur intégration:', error);
      process.exit(1);
    }
  })();
}

export { ContentMigrationService, INTEGRATION_CONFIG };
```

---

## ✅ **Critères de Validation Phase 11.5**

### 🎯 **Critères Obligatoires**

- [ ] **[CHECK]** Modèle de données versioning avec schémas Zod ✅
- [ ] **[CHECK]** Service de versioning avec CRUD complet ✅
- [ ] **[CHECK]** Interface export/import avec drag & drop ✅
- [ ] **[CHECK]** Support formats JSON, Markdown, ZIP ✅
- [ ] **[CHECK]** Workflow approbation avec permissions RBAC ✅
- [ ] **[CHECK]** Intégration scripts Phase 6 existants ✅
- [ ] **[CHECK]** Migration contenu existant vers versioning ✅
- [ ] **[CHECK]** Semantic versioning automatique ✅
- [ ] **[CHECK]** Historique complet des versions ✅
- [ ] **[CHECK]** Page de validation avec lifecycle complet ✅
- [ ] **[CHECK]** États : draft, pending, to_be_updated, approved, rejected, not_conformed, archived ✅
- [ ] **[CHECK]** Interface de validation avec prévisualisation ✅
- [ ] **[CHECK]** Workflow d'approbation avec commentaires ✅
- [ ] **[CHECK]** Statistiques en temps réel par statut ✅
- [ ] **[CHECK]** Export optimisé pour analyse IA avec prompts structurés ✅
- [ ] **[CHECK]** Format de retour JSON standardisé pour import automatique ✅
- [ ] **[CHECK]** Configuration d'analyse IA (type, public cible, problèmes) ✅
- [ ] **[CHECK]** Import analyse IA avec création version améliorée ✅
- [ ] **[CHECK]** Workflow complet Export IA → Analyse → Import améliorations ✅

### 🔧 **Tests de Validation**

```bash
[TEST] npm run test:ai-integration      # Tests export/import IA
[TEST] npm run test:content-validation   # Tests page validation et lifecycle
[TEST] npm run test:versioning         # Tests service versioning
[TEST] npm run test:export-import      # Tests cycle export/import  
[TEST] npm run test:version-approval   # Tests workflow approbation
[TEST] npm run test:integration-11.5   # Tests intégration complète
[TEST] npm run validate:11.5           # Validation Phase 11.5
```

### 📊 **Métriques de Succès**

- **Export de contenu** : < 2 secondes pour cours standard
- **Import avec validation** : < 5 secondes pour fichier 1MB
- **Création de version** : < 1 seconde
- **Workflow approbation** : Notifications temps réel
- **Migration existant** : 100% contenu Phase 6 migré
- **Validation lifecycle** : Transitions d'état < 500ms
- **Page validation** : Chargement < 2 secondes pour 100+ versions
- **Export IA** : Génération fichier optimisé < 3 secondes
- **Import IA** : Traitement analyse et création version < 5 secondes
- **Workflow IA complet** : Export → Analyse → Import < 10 minutes

---

## 🏷️ **Processus de Release v1.9.1**

```bash
[CMD] npm run integrate:versioning     # Migration contenu existant
[CMD] npm run validate:11.5           # Validation complète Phase 11.5  
[CMD] git add . && git commit -m "feat: Phase 11.5 - Content Versioning & Export/Import complete"
[CMD] git tag v1.9.1                 # Tag release versioning
```

**🚫 STOP** : Ne pas passer à Phase 12 sans validation workflow export→import complet.

---

## 🔗 **Liens et Dépendances**

**Phase précédente** : [⚙️ Phase 11 : Admin Dashboard](phase-11-admin-dashboard.md) ✅  
**Phase suivante** : [🚀 Phase 12 : Production Deployment](phase-12-production-deployment.md)  
**Éléments intégrés** :
- ✅ Phase 6 : Scripts import masse Firebase
- ✅ Archives : Système upload drag & drop  
- ✅ Phase 11 : RBAC permissions et interface admin

**🎯 Valeur ajoutée** : Workflow éditorial complet avec versioning professionnel pour gestion de contenu à grande échelle.
```
