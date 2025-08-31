// 🧪 FunLearning V3.0 - Content Tests
// Tests unitaires pour le système de contenu Markdown

import { describe, it, expect, beforeEach } from 'vitest';
import {
  markdownToHtml,
  generateSlug,
  estimateReadingTime,
  extractTableOfContents,
  hasUnsafeContent,
  sanitizeMarkdown,
  addHeaderIds,
} from '$lib/utils/markdown';

describe('Markdown Utils - Phase 3', () => {
  describe('markdownToHtml', () => {
    it('should convert basic markdown to HTML', async () => {
      const markdown = '# Hello\n\nThis is **bold** text.';
      const html = await markdownToHtml(markdown);
      
      expect(html).toContain('<h1');
      expect(html).toContain('Hello');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<p>');
    });

    it('should sanitize dangerous HTML by default', async () => {
      const markdown = '<script>alert("xss")</script>';
      const html = await markdownToHtml(markdown);
      
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('alert');
    });

    it('should handle code blocks with syntax highlighting', async () => {
      const markdown = '```javascript\nconst x = 1;\n```';
      const html = await markdownToHtml(markdown, { enableCodeHighlight: true });
      
      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('const');
      expect(html).toContain('x');
    });

    it('should return empty string for invalid input', async () => {
      expect(await markdownToHtml('')).toBe('');
      expect(await markdownToHtml(null)).toBe('');
      expect(await markdownToHtml(undefined)).toBe('');
    });

    it('should handle line breaks correctly', async () => {
      const markdown = 'Line 1\nLine 2';
      const html = await markdownToHtml(markdown, { breaks: true });
      
      expect(html).toContain('<br>');
    });
  });

  describe('generateSlug', () => {
    it('should create URL-friendly slugs', () => {
      expect(generateSlug('Les Mathématiques Avancées')).toBe('les-mathematiques-avancees');
      expect(generateSlug('Français 6ème')).toBe('francais-6eme');
      expect(generateSlug('Introduction aux Sciences')).toBe('introduction-aux-sciences');
    });

    it('should handle special characters', () => {
      expect(generateSlug('C\'est l\'été!')).toBe('cest-lete');
      expect(generateSlug('Café & Thé')).toBe('cafe-the');
      expect(generateSlug('1-2-3 Test')).toBe('1-2-3-test');
    });

    it('should handle edge cases', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug('   ')).toBe('');
      expect(generateSlug('---')).toBe('');
      expect(generateSlug('a')).toBe('a');
    });

    it('should normalize accented characters', () => {
      expect(generateSlug('Château')).toBe('chateau');
      expect(generateSlug('Naïveté')).toBe('naivete');
      expect(generateSlug('Élève')).toBe('eleve');
    });
  });

  describe('estimateReadingTime', () => {
    it('should estimate reading time correctly', () => {
      const shortText = 'Hello world';
      const longText = 'word '.repeat(400); // 400 mots
      const veryLongText = 'word '.repeat(1000); // 1000 mots

      expect(estimateReadingTime(shortText)).toBe(1); // Minimum 1 minute
      expect(estimateReadingTime(longText)).toBe(2); // 400/200 = 2 minutes
      expect(estimateReadingTime(veryLongText)).toBe(5); // 1000/200 = 5 minutes
    });

    it('should handle empty content', () => {
      expect(estimateReadingTime('')).toBe(1);
      expect(estimateReadingTime('   ')).toBe(1);
    });

    it('should handle markdown formatting', () => {
      const markdownText = '# Title\n\n**Bold** text with *italic* and `code`.';
      expect(estimateReadingTime(markdownText)).toBe(1);
    });
  });

  describe('extractTableOfContents', () => {
    it('should extract headers with IDs', () => {
      const html = `
        <h1 id="title">Title</h1>
        <h2 id="section-1">Section 1</h2>
        <h3 id="subsection">Subsection</h3>
      `;
      
      const toc = extractTableOfContents(html);
      
      expect(toc).toHaveLength(3);
      expect(toc[0]).toEqual({ level: 1, title: 'Title', anchor: 'title' });
      expect(toc[1]).toEqual({ level: 2, title: 'Section 1', anchor: 'section-1' });
      expect(toc[2]).toEqual({ level: 3, title: 'Subsection', anchor: 'subsection' });
    });

    it('should generate anchors for headers without IDs', () => {
      const html = '<h1>Introduction</h1><h2>Getting Started</h2>';
      const toc = extractTableOfContents(html);
      
      expect(toc).toHaveLength(2);
      expect(toc[0].anchor).toBe('introduction');
      expect(toc[1].anchor).toBe('getting-started');
    });

    it('should handle empty HTML', () => {
      expect(extractTableOfContents('')).toEqual([]);
      expect(extractTableOfContents('<p>No headers here</p>')).toEqual([]);
    });
  });

  describe('addHeaderIds', () => {
    it('should add IDs to headers without them', () => {
      const html = '<h1>Introduction</h1><h2>Getting Started</h2>';
      const result = addHeaderIds(html);
      
      expect(result).toContain('id="introduction"');
      expect(result).toContain('id="getting-started"');
    });

    it('should not modify headers that already have IDs', () => {
      const html = '<h1 id="existing">Title</h1>';
      const result = addHeaderIds(html);
      
      expect(result).toBe(html); // Should remain unchanged
    });

    it('should handle mixed scenarios', () => {
      const html = '<h1>New Title</h1><h2 id="existing">Existing</h2>';
      const result = addHeaderIds(html);
      
      expect(result).toContain('id="new-title"');
      expect(result).toContain('id="existing"');
    });
  });

  describe('hasUnsafeContent', () => {
    it('should detect dangerous script tags', () => {
      expect(hasUnsafeContent('<script>alert("xss")</script>')).toBe(true);
      expect(hasUnsafeContent('<SCRIPT>dangerous</SCRIPT>')).toBe(true);
    });

    it('should detect javascript URLs', () => {
      expect(hasUnsafeContent('javascript:alert("xss")')).toBe(true);
      expect(hasUnsafeContent('JAVASCRIPT:void(0)')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(hasUnsafeContent('<div onclick="alert()">Click</div>')).toBe(true);
      expect(hasUnsafeContent('<img onload="malicious()">')).toBe(true);
    });

    it('should detect dangerous tags', () => {
      expect(hasUnsafeContent('<iframe src="evil.com"></iframe>')).toBe(true);
      expect(hasUnsafeContent('<object data="malicious.swf"></object>')).toBe(true);
      expect(hasUnsafeContent('<embed src="dangerous.pdf">')).toBe(true);
      expect(hasUnsafeContent('<form action="steal-data.php">')).toBe(true);
    });

    it('should not flag safe content', () => {
      expect(hasUnsafeContent('# Normal Markdown')).toBe(false);
      expect(hasUnsafeContent('<p>Safe HTML</p>')).toBe(false);
      expect(hasUnsafeContent('<a href="https://example.com">Link</a>')).toBe(false);
    });
  });

  describe('sanitizeMarkdown', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Normal content';
      const result = sanitizeMarkdown(input);
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toContain('Normal content');
    });

    it('should remove javascript URLs', () => {
      const input = '[Link](javascript:alert("xss"))';
      const result = sanitizeMarkdown(input);
      
      expect(result).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      const input = '<div onclick="malicious()">Content</div>';
      const result = sanitizeMarkdown(input);
      
      expect(result).not.toContain('onclick=');
      expect(result).toContain('Content');
    });

    it('should remove dangerous tags', () => {
      const input = '<iframe src="evil.com"></iframe>Safe content';
      const result = sanitizeMarkdown(input);
      
      expect(result).not.toContain('<iframe>');
      expect(result).toContain('Safe content');
    });

    it('should preserve safe content', () => {
      const input = '# Title\n\n**Bold** text with [link](https://example.com)';
      const result = sanitizeMarkdown(input);
      
      expect(result).toBe(input); // Should remain unchanged
    });
  });
});

// Tests de performance
describe('Markdown Utils - Performance', () => {
  it('should handle large markdown documents efficiently', async () => {
    const largeMarkdown = '# Title\n\n' + 'Lorem ipsum dolor sit amet. '.repeat(1000);
    
    const startTime = performance.now();
    const result = await markdownToHtml(largeMarkdown);
    const endTime = performance.now();
    
    expect(result).toBeTruthy();
    expect(endTime - startTime).toBeLessThan(1000); // Moins d'une seconde
  });

  it('should generate slugs quickly for many titles', () => {
    const titles = Array.from({ length: 1000 }, (_, i) => `Titre ${i} avec des accents é à ç`);
    
    const startTime = performance.now();
    const slugs = titles.map(generateSlug);
    const endTime = performance.now();
    
    expect(slugs).toHaveLength(1000);
    expect(endTime - startTime).toBeLessThan(100); // Moins de 100ms
  });
});

// Tests d'intégration
describe('Markdown Utils - Integration', () => {
  it('should work with complete workflow', async () => {
    const markdown = `
# Introduction aux Mathématiques

## Les Nombres

Les **nombres** sont la base des mathématiques.

### Exercice 1

Calculez: \`2 + 2 = ?\`

## Conclusion

C'est tout pour aujourd'hui !
    `.trim();

    // Conversion complète
    const html = await markdownToHtml(markdown, {
      enableCodeHighlight: true,
      headingIds: true,
      sanitizeHtml: true,
    });

    // Ajout des IDs
    const htmlWithIds = addHeaderIds(html);

    // Extraction TOC
    const toc = extractTableOfContents(htmlWithIds);

    // Estimation temps de lecture
    const readingTime = estimateReadingTime(markdown);

    // Vérifications
    expect(html).toContain('<h1');
    expect(html).toContain('<h2');
    expect(html).toContain('<h3');
    expect(html).toContain('<strong>nombres</strong>');
    expect(html).toContain('<code>2 + 2 = ?</code>');
    
    expect(toc.length).toBeGreaterThanOrEqual(3);
    expect(toc[0].level).toBe(1);
    expect(toc[1].level).toBe(2);
    expect(toc[2].level).toBe(3);
    
    expect(readingTime).toBe(1); // Court texte
  });
});

// 📋 Phase Status: ✅ Phase 3 - Comprehensive Markdown Testing
