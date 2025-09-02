import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentVersioningService } from '../content-versioning.js';

// Mock Firebase en mode simple
vi.mock('$lib/firebase/config', () => ({
  db: null
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-id' }),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: {
    now: () => ({ toDate: () => new Date() })
  }
}));

describe('ContentVersioningService - Test Interface Simple', () => {
  let service: ContentVersioningService;

  beforeEach(() => {
    service = new ContentVersioningService();
  });

  it('should create a content version', async () => {
    const input = {
      contentId: 'test-content',
      contentType: 'course' as const,
      content: {
        title: 'Test Title',
        body: 'Test Body',
        tags: ['test']
      },
      metadata: {
        contentId: 'test-content',
        version: 1,
        isActive: true,
        isDraft: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'test-user',
        approvalStatus: 'draft' as const
      }
    };

    const result = await service.createVersion(input);
    
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.contentId).toBe('test-content');
    expect(result.contentType).toBe('course');
  });

  it('should export version to JSON', async () => {
    const input = {
      contentId: 'test-content',
      contentType: 'course' as const,
      content: {
        title: 'Test Title',
        body: 'Test Body'
      },
      metadata: {
        contentId: 'test-content',
        version: 1,
        isActive: true,
        isDraft: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'test-user',
        approvalStatus: 'draft' as const
      }
    };

    const version = await service.createVersion(input);
    const exported = await service.exportVersion(version.id, 'json');
    
    expect(exported).toBeDefined();
    expect(exported.content).toBeDefined();
    expect(exported.mimeType).toBe('application/json');
  });

  it('should get version history', async () => {
    const history = await service.getVersionHistory('test-content');
    expect(Array.isArray(history)).toBe(true);
  });
});
