import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { browser } from "$app/environment";
import type { Course, Lesson } from "$lib/types/content";

// Configuration de marked avec highlight.js
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.warn("Erreur de coloration syntaxique:", err);
      }
    }
    return hljs.highlightAuto(code).value;
  }
}));

// Configuration de marked avec sécurité
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Configuration d'highlight.js
const highlightCode = (code: string, lang: string): string => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(code, { language: lang }).value;
    } catch (err) {
      console.warn("Erreur de coloration syntaxique:", err);
    }
  }
  return hljs.highlightAuto(code).value;
};

// Configuration DOMPurify sécurisée
const purifyConfig = {
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "strong",
    "em",
    "u",
    "del",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitisation basique côté serveur pour les éléments dangereux
 */
function sanitizeHtmlBasic(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: URLs
}

/**
 * Convertit du Markdown en HTML sécurisé
 */
export function markdownToHtml(markdown: string): string {
  try {
    // 1. Parser le Markdown
    const rawHtml = marked.parse(markdown) as string;

    // 2. Sécuriser le HTML
    let cleanHtml: string;
    
    if (browser && typeof window !== 'undefined' && DOMPurify.sanitize) {
      // Côté client avec DOMPurify
      cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);
    } else {
      // Côté serveur ou environnement de test avec sanitisation basique
      cleanHtml = sanitizeHtmlBasic(rawHtml);
    }
    
    return cleanHtml;
  } catch (error) {
    console.error("Erreur de conversion Markdown:", error);
    return '<p class="error">Erreur de chargement du contenu</p>';
  }
}

/**
 * Cache pour les conversions HTML
 */
const htmlCache = new Map<string, string>();

/**
 * Convertit du Markdown avec cache
 */
export function markdownToHtmlCached(
  markdown: string,
  cacheKey?: string
): string {
  const key = cacheKey || btoa(markdown).slice(0, 32);

  if (htmlCache.has(key)) {
    return htmlCache.get(key)!;
  }

  const html = markdownToHtml(markdown);
  htmlCache.set(key, html);

  return html;
}

/**
 * Traite un cours et génère le HTML
 */
export function processCourse(course: Course): Course {
  return {
    ...course,
    contenuHtml: markdownToHtmlCached(course.contenuMarkdown, course.id),
  };
}

/**
 * Traite une leçon et génère le HTML
 */
export function processLesson(lesson: Lesson): Lesson {
  return {
    ...lesson,
    contenuHtml: markdownToHtmlCached(lesson.contenuMarkdown, lesson.id),
  };
}

/**
 * Extrait un résumé du contenu Markdown
 */
export function extractSummary(markdown: string, maxLength = 200): string {
  // Supprime les markdowns basiques
  const plainText = markdown
    .replace(/#{1,6}\s+/g, "") // Titres
    .replace(/\*\*(.*?)\*\*/g, "$1") // Gras
    .replace(/\*(.*?)\*/g, "$1") // Italique
    .replace(/`(.*?)`/g, "$1") // Code inline
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Liens
    .replace(/!\[(.*?)\]\(.*?\)/g, "$1") // Images
    .replace(/\n+/g, " ") // Sauts de ligne
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength).trim() + "...";
}

/**
 * Validation et nettoyage du contenu Markdown
 */
export function sanitizeMarkdown(markdown: string): string {
  // Supprime les balises HTML potentiellement dangereuses
  return markdown
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/<iframe.*?>.*?<\/iframe>/gi, "")
    .replace(/<object.*?>.*?<\/object>/gi, "")
    .replace(/<embed.*?>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

/**
 * Génère un slug URL-friendly à partir d'un titre
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Estime le temps de lecture en minutes
 */
export function estimateReadingTime(markdown: string): number {
  const wordsPerMinute = 200;
  const wordCount = markdown.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extrait les en-têtes d'un contenu Markdown pour la navigation
 */
export function extractHeaders(
  markdown: string
): Array<{ id: string; level: number; text: string }> {
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const headers = [];
  let match;

  while ((match = headerRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateSlug(text);

    headers.push({ id, level, text });
  }

  return headers;
}

/**
 * Utilitaires d'export
 */
export const ContentUtils = {
  markdownToHtml,
  markdownToHtmlCached,
  processCourse,
  processLesson,
  extractSummary,
  sanitizeMarkdown,
  generateSlug,
  estimateReadingTime,
  extractHeaders,
  clearCache: () => htmlCache.clear(),
  getCacheSize: () => htmlCache.size,
};

// 📋 Phase Status: ✅ Phase 3 - Content Utils créés
