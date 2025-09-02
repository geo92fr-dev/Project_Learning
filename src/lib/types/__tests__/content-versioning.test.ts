import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentVersionSchema, EXPORT_FORMATS, AI_ANALYSIS_PROMPTS } from '../content-versioning';

describe('Content Versioning Types - TDD Phase Rouge', () => {
  describe('ContentVersionSchema Validation', () => {
    it('should validate a complete content version object', () => {
      const validVersion = {
        id: 'version-123',
        contentId: 'content-456',
        contentType: 'course' as const,
        version: '1.2.3',
        title: 'Test Course',
        description: 'A test course description',
        author: {
          id: 'author-789',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        metadata: {
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
          comment: 'Initial version',
          changeLog: ['Created course', 'Added lessons'],
          isActive: false,
          isDraft: true,
          approvalStatus: 'pending' as const,
        },
        content: {
          data: { lessons: [] },
          format: 'json' as const,
          checksum: 'abc123def456',
        },
        export: {
          formats: ['json', 'markdown'],
          exportHistory: [],
        },
      };

      expect(() => ContentVersionSchema.parse(validVersion)).not.toThrow();
    });

    it('should reject invalid semantic version format', () => {
      const invalidVersion = {
        id: 'version-123',
        contentId: 'content-456',
        contentType: 'course',
        version: '1.2', // ❌ Invalide : doit être x.y.z
        title: 'Test Course',
        description: 'Description',
        author: {
          id: 'author-789',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          comment: 'Test',
          changeLog: [],
          isActive: false,
          isDraft: true,
          approvalStatus: 'pending',
        },
        content: {
          data: {},
          format: 'json',
          checksum: 'abc123',
        },
        export: {
          formats: [],
          exportHistory: [],
        },
      };

      expect(() => ContentVersionSchema.parse(invalidVersion)).toThrow();
    });

    it('should reject invalid email format', () => {
      const invalidVersion = {
        id: 'version-123',
        contentId: 'content-456',
        contentType: 'course',
        version: '1.0.0',
        title: 'Test Course',
        description: 'Description',
        author: {
          id: 'author-789',
          name: 'John Doe',
          email: 'invalid-email', // ❌ Format email invalide
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          comment: 'Test',
          changeLog: [],
          isActive: false,
          isDraft: true,
          approvalStatus: 'pending',
        },
        content: {
          data: {},
          format: 'json',
          checksum: 'abc123',
        },
        export: {
          formats: [],
          exportHistory: [],
        },
      };

      expect(() => ContentVersionSchema.parse(invalidVersion)).toThrow();
    });

    it('should validate all lifecycle approval statuses', () => {
      const statuses = ['draft', 'pending', 'to_be_updated', 'approved', 'rejected', 'not_conformed', 'archived'];
      
      statuses.forEach(status => {
        const versionWithStatus = {
          id: 'version-123',
          contentId: 'content-456',
          contentType: 'course',
          version: '1.0.0',
          title: 'Test Course',
          description: 'Description',
          author: {
            id: 'author-789',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            comment: 'Test',
            changeLog: [],
            isActive: false,
            isDraft: true,
            approvalStatus: status,
          },
          content: {
            data: {},
            format: 'json',
            checksum: 'abc123',
          },
          export: {
            formats: [],
            exportHistory: [],
          },
        };

        expect(() => ContentVersionSchema.parse(versionWithStatus)).not.toThrow();
      });
    });
  });

  describe('Export Formats Configuration', () => {
    it('should include all required export formats', () => {
      const expectedFormats = ['json', 'markdown', 'package', 'ai_analysis'];
      const actualFormats = EXPORT_FORMATS.map(f => f.id);
      
      expectedFormats.forEach(format => {
        expect(actualFormats).toContain(format);
      });
    });

    it('should have valid mime types for all formats', () => {
      EXPORT_FORMATS.forEach(format => {
        expect(format.mimeType).toBeTruthy();
        expect(format.mimeType).toMatch(/^[a-z]+\/[a-z-+]+$/);
      });
    });

    it('should have AI analysis format with markdown type', () => {
      const aiFormat = EXPORT_FORMATS.find(f => f.id === 'ai_analysis');
      expect(aiFormat).toBeDefined();
      expect(aiFormat?.mimeType).toBe('text/markdown');
      expect(aiFormat?.extension).toBe('md');
      expect(aiFormat?.supportsMetadata).toBe(true);
    });
  });

  describe('AI Analysis Prompts Configuration', () => {
    it('should have prompts for all content types', () => {
      const contentTypes: (keyof typeof AI_ANALYSIS_PROMPTS)[] = ['course', 'exercise', 'series'];
      
      contentTypes.forEach(type => {
        expect(AI_ANALYSIS_PROMPTS[type]).toBeDefined();
        expect(AI_ANALYSIS_PROMPTS[type].expert_role).toBeTruthy();
        expect(AI_ANALYSIS_PROMPTS[type].context).toBeTruthy();
        expect(AI_ANALYSIS_PROMPTS[type].analysis_criteria).toBeInstanceOf(Array);
        expect(AI_ANALYSIS_PROMPTS[type].analysis_criteria.length).toBeGreaterThan(0);
      });
    });

    it('should have exactly 8 analysis criteria for each content type', () => {
      Object.values(AI_ANALYSIS_PROMPTS).forEach(prompt => {
        expect(prompt.analysis_criteria).toHaveLength(8);
      });
    });

    it('should have expert roles specific to content type', () => {
      expect(AI_ANALYSIS_PROMPTS.course.expert_role).toContain('ingénierie pédagogique');
      expect(AI_ANALYSIS_PROMPTS.exercise.expert_role).toContain('évaluation pédagogique');
      expect(AI_ANALYSIS_PROMPTS.series.expert_role).toContain('parcours d\'apprentissage');
    });
  });

  describe('Security Validation Tests - Following DOC_CoPilot_Practices', () => {
    it('should prevent XSS in content data', () => {
      const maliciousContent = {
        id: 'version-123',
        contentId: 'content-456',
        contentType: 'course',
        version: '1.0.0',
        title: '<script>alert("XSS")</script>', // ⚠️ Contenu malveillant
        description: 'Description',
        author: {
          id: 'author-789',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          comment: '<img src=x onerror=alert(1)>', // ⚠️ Payload XSS
          changeLog: [],
          isActive: false,
          isDraft: true,
          approvalStatus: 'pending',
        },
        content: {
          data: { 
            maliciousScript: 'javascript:alert(1)' // ⚠️ Payload malveillant
          },
          format: 'json',
          checksum: 'abc123',
        },
        export: {
          formats: [],
          exportHistory: [],
        },
      };

      // Le schéma doit valider la structure mais pas nettoyer automatiquement
      // La sanitisation doit être faite au niveau service/composant
      expect(() => ContentVersionSchema.parse(maliciousContent)).not.toThrow();
      
      // Note: La sécurité sera gérée par DOMPurify dans les services
    });

    it('should validate checksum format', () => {
      const versionWithInvalidChecksum = {
        id: 'version-123',
        contentId: 'content-456',
        contentType: 'course',
        version: '1.0.0',
        title: 'Test',
        description: 'Description',
        author: {
          id: 'author-789',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          comment: 'Test',
          changeLog: [],
          isActive: false,
          isDraft: true,
          approvalStatus: 'pending',
        },
        content: {
          data: {},
          format: 'json',
          checksum: '', // ❌ Checksum vide
        },
        export: {
          formats: [],
          exportHistory: [],
        },
      };

      expect(() => ContentVersionSchema.parse(versionWithInvalidChecksum)).toThrow();
    });

    it('should prevent version injection attacks', () => {
      const maliciousVersions = [
        '1.0.0; DROP TABLE versions;', // SQL injection attempt
        '1.0.0<script>alert(1)</script>', // XSS attempt
        '1.0.0${7*7}', // Template injection
        '../../../etc/passwd', // Path traversal
      ];

      maliciousVersions.forEach(maliciousVersion => {
        const versionWithMaliciousNumber = {
          id: 'version-123',
          contentId: 'content-456',
          contentType: 'course',
          version: maliciousVersion,
          title: 'Test',
          description: 'Description',
          author: {
            id: 'author-789',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            comment: 'Test',
            changeLog: [],
            isActive: false,
            isDraft: true,
            approvalStatus: 'pending',
          },
          content: {
            data: {},
            format: 'json',
            checksum: 'abc123',
          },
          export: {
            formats: [],
            exportHistory: [],
          },
        };

        expect(() => ContentVersionSchema.parse(versionWithMaliciousNumber)).toThrow();
      });
    });
  });
});
