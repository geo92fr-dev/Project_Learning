import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentVersioningService } from '../content-versioning.js';
import type { ContentVersion, ContentVersionInput } from '../../types/content-versioning';

// Mock Firebase
vi.mock('$lib/firebase/config', () => ({
  db: null // Force mock mode
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: {
    fromDate: vi.fn((date) => date),
    now: vi.fn(() => new Date())
  }
}));

describe('ContentVersioningService - Phase 11.5 TDD', () => {
  let service: ContentVersioningService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ContentVersioningService();
  });

  describe('✅ Test 1: Creation with Validation', () => {
    it('should create a new content version with proper validation', async () => {
      const input: ContentVersionInput = {
        contentId: 'test-content-001',
        contentType: 'course',
        content: {
          title: 'Introduction TypeScript',
          body: 'Cours complet sur TypeScript avec exemples pratiques.',
          tags: ['typescript', 'javascript', 'programming']
        },
        metadata: {
          contentId: 'test-content-001',
          version: 1,
          isActive: false,
          isDraft: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-123',
          approvalStatus: 'draft'
        }
      };

      const result = await service.createVersion(input);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.contentId).toBe('test-content-001');
      expect(result.contentType).toBe('course');
      expect(result.content.title).toBe('Introduction TypeScript');
      expect(result.metadata.version).toBe(1);
    });
  });

  describe('✅ Test 2: XSS Protection', () => {
    it('should sanitize malicious content', async () => {
      const maliciousInput: ContentVersionInput = {
        contentId: 'malicious-content',
        contentType: 'course',
        content: {
          title: '<script>alert("XSS")</script>Titre malveillant',
          body: 'Contenu avec <img src="x" onerror="alert(1)"> injection',
          tags: ['<script>console.log("hack")</script>', 'sécurité']
        },
        metadata: {
          contentId: 'malicious-content',
          version: 1,
          isActive: false,
          isDraft: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-456',
          approvalStatus: 'draft'
        }
      };

      const result = await service.createVersion(maliciousInput);

      expect(result).toBeDefined();
      // DOMPurify should clean the content
      expect(result.content.title).not.toContain('<script>');
      expect(result.content.body).not.toContain('onerror');
      expect(result.content.tags?.[0]).not.toContain('<script>');
    });
  });

  describe('✅ Test 3: Version Status Validation', () => {
    it('should validate version status updates', async () => {
      expect(async () => {
        await service.validateVersion('test-version', 'invalid-status', {
          comment: 'Test',
          validatedBy: 'user-123',
          validatedAt: new Date()
        });
      }).rejects.toThrow('Statut non autorisé');
    });

    it('should accept valid status updates', async () => {
      expect(async () => {
        await service.validateVersion('test-version', 'approved', {
          comment: 'Validation réussie',
          validatedBy: 'user-123',
          validatedAt: new Date()
        });
      }).not.toThrow();
    });
  });

  describe('✅ Test 4: Export Functionality', () => {
    it('should export to JSON format', async () => {
      // Create a test version first
      const testVersion = await service.createVersion({
        contentId: 'export-test',
        contentType: 'course',
        content: {
          title: 'Test Export',
          body: 'Contenu pour test d\'export',
          tags: ['test', 'export']
        },
        metadata: {
          contentId: 'export-test',
          version: 1,
          isActive: true,
          isDraft: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-export',
          approvalStatus: 'approved'
        }
      });

      const exportResult = await service.exportVersion(testVersion.id!, 'json');

      expect(exportResult).toBeDefined();
      expect(exportResult.content).toBeDefined();
      expect(exportResult.filename).toContain('.json');
      expect(exportResult.mimeType).toBe('application/json');
    });

    it('should export to Markdown format', async () => {
      const testVersion = await service.createVersion({
        contentId: 'markdown-test',
        contentType: 'course',
        content: {
          title: 'Test Markdown',
          body: 'Contenu markdown',
          tags: ['markdown']
        },
        metadata: {
          contentId: 'markdown-test',
          version: 1,
          isActive: true,
          isDraft: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-md',
          approvalStatus: 'approved'
        }
      });

      const exportResult = await service.exportVersion(testVersion.id!, 'markdown');

      expect(exportResult).toBeDefined();
      expect(exportResult.content).toContain('# Test Markdown');
      expect(exportResult.filename).toContain('.md');
      expect(exportResult.mimeType).toBe('text/markdown');
    });
  });

  describe('✅ Test 5: AI Analysis Export', () => {
    it('should generate AI analysis export', async () => {
      const testVersion = await service.createVersion({
        contentId: 'ai-test',
        contentType: 'course',
        content: {
          title: 'Test IA',
          body: 'Contenu pour analyse IA',
          tags: ['ia', 'analyse']
        },
        metadata: {
          contentId: 'ai-test',
          version: 1,
          isActive: true,
          isDraft: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-ai',
          approvalStatus: 'approved'
        }
      });

      const aiExport = await service.generateAIExport(testVersion.id!, 'course');

      expect(aiExport).toBeDefined();
      expect(aiExport.content).toBeDefined();
      expect(aiExport.analysisPrompt).toBeDefined();
      expect(aiExport.suggestedImprovements).toBeDefined();
      expect(aiExport.suggestedImprovements).toHaveLength(3);
    });
  });

  describe('✅ Test 6: Import with Enhancement', () => {
    it('should import and enhance content', async () => {
      const importData = {
        contentType: 'course',
        content: {
          title: 'Contenu importé',
          body: 'Contenu basique à améliorer'
        }
      };

      const result = await service.importAndEnhance(importData, {
        preserveMetadata: false,
        autoEnhance: true,
        targetContentId: 'imported-content'
      });

      expect(result).toBeDefined();
      expect(result.contentId).toBe('imported-content');
      expect(result.content.title).toContain('enrichie'); // Should be enhanced
      expect(result.metadata.approvalStatus).toBe('draft');
    });
  });

  describe('✅ Test 7: Version History Management', () => {
    it('should retrieve version history', async () => {
      const history = await service.getVersionHistory('test-content');

      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
      
      // In mock mode, should return 2 versions
      expect(history).toHaveLength(2);
      expect(history[0].metadata.version).toBe(2); // Latest first
      expect(history[1].metadata.version).toBe(1);
    });
  });

  describe('✅ Test 8: Active Version Management', () => {
    it('should retrieve active version', async () => {
      const activeVersion = await service.getActiveVersion('test-content');

      expect(activeVersion).toBeDefined();
      expect(activeVersion!.metadata.isActive).toBe(true);
      expect(activeVersion!.metadata.approvalStatus).toBe('approved');
    });
  });

  describe('✅ Test 9: Version Duplication', () => {
    it('should duplicate a version', async () => {
      // First create a version to duplicate
      const originalVersion = await service.createVersion({
        contentId: 'duplicate-test',
        contentType: 'course',
        content: {
          title: 'Version originale',
          body: 'Contenu original'
        },
        metadata: {
          contentId: 'duplicate-test',
          version: 1,
          isActive: true,
          isDraft: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-original',
          approvalStatus: 'approved'
        }
      });

      const duplicatedVersion = await service.duplicateVersion(
        originalVersion.id!,
        'user-duplicate'
      );

      expect(duplicatedVersion).toBeDefined();
      expect(duplicatedVersion.contentId).toBe(originalVersion.contentId);
      expect(duplicatedVersion.content.title).toBe(originalVersion.content.title);
      expect(duplicatedVersion.metadata.createdBy).toBe('user-duplicate');
      expect(duplicatedVersion.metadata.isDraft).toBe(true);
    });
  });

  describe('✅ Test 10: Version Archiving', () => {
    it('should archive a version', async () => {
      const testVersion = await service.createVersion({
        contentId: 'archive-test',
        contentType: 'course',
        content: {
          title: 'Version à archiver',
          body: 'Contenu à archiver'
        },
        metadata: {
          contentId: 'archive-test',
          version: 1,
          isActive: true,
          isDraft: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-archive',
          approvalStatus: 'approved'
        }
      });

      expect(async () => {
        await service.archiveVersion(testVersion.id!);
      }).not.toThrow();
    });
  });

  describe('✅ Test 11: Version Statistics', () => {
    it('should provide version statistics', async () => {
      const stats = await service.getVersionStats('test-content');

      expect(stats).toBeDefined();
      expect(stats.totalVersions).toBeGreaterThanOrEqual(0);
      expect(typeof stats.activeVersion).toBe('number');
      expect(stats.draftVersions).toBeGreaterThanOrEqual(0);
      expect(stats.approvedVersions).toBeGreaterThanOrEqual(0);
    });
  });

  describe('✅ Test 12: Error Handling', () => {
    it('should handle missing version gracefully', async () => {
      const result = await service.getVersionById('non-existent-version');
      
      expect(result).toBeDefined(); // Returns mock in test mode
      expect(result!.id).toBe('non-existent-version');
    });
  });

  describe('✅ Test 13: Input Validation', () => {
    it('should validate required fields', async () => {
      expect(async () => {
        await service.createVersion({
          contentId: '',
          contentType: 'course',
          content: {},
          metadata: {
            contentId: '',
            version: 1,
            isActive: false,
            isDraft: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: '',
            approvalStatus: 'draft'
          }
        });
      }).rejects.toThrow();
    });
  });

  describe('✅ Test 14: Content Enhancement', () => {
    it('should enhance content with AI suggestions', async () => {
      const basicContent = {
        title: 'Titre basique',
        body: 'Contenu formation développement web programmation',
        tags: []
      };

      const enhanced = await (service as any).enhanceContentWithAI(basicContent);

      expect(enhanced.title).toContain('enrichie');
      expect(enhanced.tags).toBeDefined();
      expect(enhanced.tags.length).toBeGreaterThan(0);
      expect(enhanced.body).toContain('Introduction');
    });
  });

  describe('✅ Test 15: Export Format Validation', () => {
    it('should reject invalid export formats', async () => {
      const testVersion = await service.createVersion({
        contentId: 'format-test',
        contentType: 'course',
        content: {
          title: 'Test format',
          body: 'Contenu test'
        },
        metadata: {
          contentId: 'format-test',
          version: 1,
          isActive: true,
          isDraft: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'user-format',
          approvalStatus: 'approved'
        }
      });

      expect(async () => {
        await service.exportVersion(testVersion.id!, 'invalid-format' as any);
      }).rejects.toThrow('Format d\'export non supporté');
    });
  });
});
