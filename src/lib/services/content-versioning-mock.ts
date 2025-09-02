import DOMPurify from 'dompurify';
import { type ContentVersion, type ContentVersionInput } from '../types/content-versioning.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service mock pour les tests - Implémentation complète en mémoire
 */
class ContentVersioningServiceMock {
  private versions: Map<string, ContentVersion[]> = new Map();
  private activeVersions: Map<string, string> = new Map();

  /**
   * ✅ Test 1: Création avec validation
   */
  async createVersion(data: {
    contentId: string;
    contentType: 'course' | 'exercise' | 'series';
    content: {
      title: string;
      body: string;
      tags?: string[];
    };
    version?: number;
    author?: string;
  }): Promise<ContentVersion> {
    // ✅ Test 2: XSS Protection - Sanitisation avec DOMPurify
    const sanitizedContent = {
      title: DOMPurify.sanitize(data.content.title),
      body: DOMPurify.sanitize(data.content.body),
      tags: data.content.tags?.map(tag => DOMPurify.sanitize(tag)) || []
    };

    const version: ContentVersion = {
      id: uuidv4(),
      contentId: data.contentId,
      contentType: data.contentType,
      content: sanitizedContent,
      metadata: {
        contentId: data.contentId,
        version: data.version || 1,
        createdBy: data.author || 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
        isDraft: true,
        approvalStatus: 'draft' as const
      }
    };

    // Stockage en mémoire
    if (!this.versions.has(data.contentId)) {
      this.versions.set(data.contentId, []);
    }
    this.versions.get(data.contentId)!.push(version);

    // Définir comme version active si c'est la première
    if (!this.activeVersions.has(data.contentId)) {
      this.activeVersions.set(data.contentId, version.id);
    }

    return version;
  }

  /**
   * ✅ Test 3: Validation des statuts
   */
  async validateVersion(versionId: string): Promise<boolean> {
    for (const versions of this.versions.values()) {
      const version = versions.find(v => v.id === versionId);
      if (version) {
        version.metadata.approvalStatus = 'approved';
        version.metadata.updatedAt = new Date();
        return true;
      }
    }
    return false;
  }

  /**
   * ✅ Test 4: Export JSON
   */
  async exportVersion(versionId: string, format: 'json' | 'markdown' | 'package' | 'ai_analysis'): Promise<string> {
    const version = this.findVersionById(versionId);
    if (!version) throw new Error('Version non trouvée');

    switch (format) {
      case 'json':
        return JSON.stringify(version, null, 2);
      
      case 'markdown':
        return `# ${version.content.title}\n\n**Type:** ${version.contentType}\n**Version:** ${version.metadata.version}\n**Auteur:** ${version.metadata.createdBy}\n\n${version.content.body}`;
      
      case 'package':
        return JSON.stringify({
          version: version,
          dependencies: [],
          metadata: { exportedAt: new Date().toISOString() }
        }, null, 2);
      
      case 'ai_analysis':
        return `# Analyse IA - ${version.content.title}\n\n## Résumé\nAnalyse automatique du contenu.\n\n## Recommandations\n- Améliorer la structure\n- Ajouter des exemples`;
      
      default:
        throw new Error('Format d\'export non supporté');
    }
  }

  /**
   * ✅ Test 5: Export pour analyse IA
   */
  async generateAIExport(versionId: string): Promise<string> {
    return this.exportVersion(versionId, 'ai_analysis');
  }

  /**
   * ✅ Test 6: Import avec amélioration
   */
  async importAndEnhance(data: string, format: 'json' | 'markdown'): Promise<ContentVersion> {
    let content;
    
    if (format === 'json') {
      const parsed = JSON.parse(data);
      content = {
        title: parsed.content?.title || 'Contenu importé',
        body: parsed.content?.body || 'Corps enrichie avec IA',
        tags: parsed.content?.tags || []
      };
    } else {
      // Markdown simple
      content = {
        title: 'Contenu importé',
        body: data + '\n\n> Contenu enrichie avec suggestions IA',
        tags: ['importé']
      };
    }

    return this.createVersion({
      contentId: 'imported-' + Date.now(),
      contentType: 'course',
      content,
      author: 'import-system'
    });
  }

  /**
   * ✅ Test 7: Historique des versions
   */
  async getVersionHistory(contentId: string): Promise<ContentVersion[]> {
    return this.versions.get(contentId) || [];
  }

  /**
   * ✅ Test 8: Version active
   */
  async getActiveVersion(contentId: string): Promise<ContentVersion | null> {
    const activeId = this.activeVersions.get(contentId);
    if (!activeId) return null;
    
    return this.findVersionById(activeId);
  }

  /**
   * ✅ Test 9: Duplication
   */
  async duplicateVersion(versionId: string, newContentId: string): Promise<ContentVersion> {
    const original = this.findVersionById(versionId);
    if (!original) throw new Error('Version source non trouvée');

    return this.createVersion({
      contentId: newContentId,
      contentType: original.contentType,
      content: { 
        title: original.content.title || 'Copy of content',
        body: original.content.body || 'Duplicated content',
        tags: original.content.tags
      },
      author: original.metadata.createdBy
    });
  }

  /**
   * ✅ Test 10: Archivage
   */
  async archiveVersion(versionId: string): Promise<boolean> {
    for (const versions of this.versions.values()) {
      const version = versions.find(v => v.id === versionId);
      if (version) {
        version.metadata.approvalStatus = 'archived';
        version.metadata.updatedAt = new Date();
        return true;
      }
    }
    return false;
  }

  /**
   * ✅ Test 11: Statistiques
   */
  async getVersioningMetrics(): Promise<{
    totalVersions: number;
    draftCount: number;
    approvedCount: number;
    archivedCount: number;
  }> {
    let totalVersions = 0;
    let draftCount = 0;
    let approvedCount = 0;
    let archivedCount = 0;

    for (const versions of this.versions.values()) {
      totalVersions += versions.length;
      for (const version of versions) {
        switch (version.metadata.approvalStatus) {
          case 'draft': draftCount++; break;
          case 'approved': approvedCount++; break;
          case 'archived': archivedCount++; break;
        }
      }
    }

    return {
      totalVersions,
      draftCount,
      approvedCount,
      archivedCount
    };
  }

  /**
   * ✅ Test 14: Amélioration de contenu
   */
  async enhanceContent(versionId: string): Promise<ContentVersion> {
    const version = this.findVersionById(versionId);
    if (!version) throw new Error('Version non trouvée');

    // Simulation d'amélioration IA
    const enhanced: ContentVersion = {
      ...version,
      content: {
        title: (version.content.title || '') + ' (enrichie)',
        body: (version.content.body || '') + '\n\n## Suggestions IA\n- Point 1\n- Point 2',
        tags: version.content.tags
      },
      metadata: {
        ...version.metadata,
        updatedAt: new Date()
      }
    };

    // Mise à jour en mémoire
    for (const versions of this.versions.values()) {
      const index = versions.findIndex(v => v.id === versionId);
      if (index !== -1) {
        versions[index] = enhanced;
        break;
      }
    }

    return enhanced;
  }

  // Méthodes utilitaires
  private findVersionById(versionId: string): ContentVersion | null {
    for (const versions of this.versions.values()) {
      const version = versions.find(v => v.id === versionId);
      if (version) return version;
    }
    return null;
  }

  // Reset pour les tests
  reset(): void {
    this.versions.clear();
    this.activeVersions.clear();
  }
}

// Export singleton
export const contentVersioningService = new ContentVersioningServiceMock();
export { ContentVersioningServiceMock };
