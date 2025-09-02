import { describe, it, expect, beforeEach } from 'vitest';
import { ContentVersioningService } from '../content-versioning.js';

describe('Debug Markdown Export', () => {
  let service: ContentVersioningService;

  beforeEach(() => {
    service = new ContentVersioningService();
  });

  it('should debug title preservation', async () => {
    console.log('🔍 Debut test debug');
    
    const inputData = {
      contentId: 'debug-test',
      contentType: 'course' as const,
      content: {
        title: 'Test Markdown',
        body: 'Contenu debug',
        tags: ['debug']
      },
      metadata: {
        contentId: 'debug-test',
        version: 1,
        isActive: true,
        isDraft: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'debug-user',
        approvalStatus: 'approved' as const
      }
    };

    console.log('📝 Input title:', inputData.content.title);

    const testVersion = await service.createVersion(inputData);
    
    console.log('💾 Created version title:', testVersion.content.title);
    console.log('💾 Full version:', JSON.stringify(testVersion, null, 2));

    const exportResult = await service.exportVersion(testVersion.id!, 'markdown');
    
    console.log('📤 Export content preview:', exportResult.content.substring(0, 100));
    console.log('📤 Looking for:', '# Test Markdown');
    
    expect(testVersion.content.title).toBe('Test Markdown');
  });
});
