// 🚀 FunLearning V3.0 - Markdown Processing with Security
// Conversion Markdown → HTML sécurisée avec DOMPurify et highlight.js

import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import hljs from "highlight.js";

// Initialiser DOMPurify pour l'environnement serveur
const window = new JSDOM("").window;
const purify = DOMPurify(window as any);
import type { MarkdownOptions, MarkdownContent } from "../types/content.js";

// ===== CONFIGURATION MARKED =====
const configureMarked = (options: MarkdownOptions = {}) => {
  marked.setOptions({
    breaks: options.breaks ?? true,
    gfm: true, // GitHub Flavored Markdown
  });

  // Configuration du renderer pour le syntax highlighting
  if (options.enableCodeHighlight) {
    const renderer = new marked.Renderer();

    renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(text, { language: lang }).value;
          return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
          console.warn("Highlight error:", err);
        }
      }
      return `<pre><code>${text}</code></pre>`;
    };

    marked.setOptions({ renderer });
  }
};

// ===== CONFIGURATION DOMPURIFY =====
const configureDOMPurify = (options: MarkdownOptions = {}) => {
  const allowedTags = options.allowedTags ?? [
    // Structure de base
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "div",
    "span",

    // Texte enrichi
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "mark",
    "sup",
    "sub",
    "small",

    // Listes
    "ul",
    "ol",
    "li",

    // Liens et médias
    "a",
    "img",

    // Tableaux
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",

    // Code
    "code",
    "pre",
    "kbd",

    // Citations
    "blockquote",
  ];

  return {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ["href", "src", "alt", "class", "id", "title"],
    FORBID_SCRIPTS: true,
    FORBID_TAGS: ["script", "object", "embed"],
    KEEP_CONTENT: true,
  };
};

// ===== FONCTIONS PRINCIPALES =====

/**
 * Convertit le Markdown en HTML sécurisé
 */
export async function markdownToHtml(
  markdown: string,
  options: MarkdownOptions = {}
): Promise<string> {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  try {
    // Configuration de marked
    configureMarked(options);

    // Conversion Markdown → HTML
    const rawHtml = await marked(markdown);

    // Sanitization avec DOMPurify
    if (options.sanitizeHtml !== false) {
      const purifyConfig = configureDOMPurify(options);
      return purify.sanitize(rawHtml, purifyConfig);
    }

    return rawHtml;
  } catch (error) {
    console.error("Erreur conversion Markdown:", error);
    return `<p class="error">Erreur de conversion du contenu</p>`;
  }
}

/**
 * Génère un slug URL-friendly à partir d'un titre
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garde uniquement lettres, chiffres, espaces, tirets
    .replace(/\s+/g, "-") // Remplace espaces par tirets
    .replace(/-+/g, "-") // Évite les tirets multiples
    .replace(/^-|-$/g, ""); // Supprime tirets en début/fin
}

/**
 * Estime le temps de lecture en minutes
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Vitesse de lecture moyenne
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes); // Au moins 1 minute
}

/**
 * Extrait la table des matières depuis le HTML
 */
export function extractTableOfContents(html: string): Array<{
  level: number;
  title: string;
  anchor: string;
}> {
  const toc: Array<{ level: number; title: string; anchor: string }> = [];

  // Pattern pour détecter les headers avec IDs
  const headerPattern =
    /<h([1-6])(?:\s+id=["']([^"']+)["'])?[^>]*>([^<]+)<\/h[1-6]>/gi;
  let match;

  while ((match = headerPattern.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2] || generateSlug(match[3]);
    const title = match[3].trim();

    toc.push({
      level,
      title,
      anchor: id,
    });
  }

  return toc;
}

/**
 * Ajoute des IDs aux headers qui n'en ont pas
 */
export function addHeaderIds(html: string): string {
  return html.replace(
    /<h([1-6])(?!\s+id=)([^>]*)>([^<]+)<\/h[1-6]>/gi,
    (match, level, attrs, title) => {
      const id = generateSlug(title);
      return `<h${level}${attrs} id="${id}">${title}</h${level}>`;
    }
  );
}

/**
 * Traite un contenu Markdown complet avec métadonnées
 */
export async function processMarkdownContent(
  markdownContent: MarkdownContent,
  options: MarkdownOptions = {}
): Promise<MarkdownContent & { html: string; toc: any[] }> {
  const { content, metadata } = markdownContent;

  // Conversion avec options par défaut sécurisées
  const defaultOptions: MarkdownOptions = {
    enableCodeHighlight: true,
    headingIds: true,
    sanitizeHtml: true,
    breaks: true,
    ...options,
  };

  let html = await markdownToHtml(content, defaultOptions);

  // Ajout des IDs aux headers si nécessaire
  if (defaultOptions.headingIds) {
    html = addHeaderIds(html);
  }

  // Extraction de la table des matières
  const toc = extractTableOfContents(html);

  return {
    ...markdownContent,
    html,
    toc,
  };
}

// ===== UTILITAIRES DE VALIDATION =====

/**
 * Vérifie si le contenu Markdown contient du HTML dangereux
 */
export function hasUnsafeContent(markdown: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(markdown));
}

/**
 * Nettoie le Markdown des éléments potentiellement dangereux
 */
export function sanitizeMarkdown(markdown: string): string {
  return markdown
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?<\/embed>/gi, "");
}

// ===== CACHE DE TRANSFORMATION =====
interface MarkdownCache {
  [key: string]: {
    html: string;
    timestamp: number;
    version: string;
  };
}

const markdownCache: MarkdownCache = {};
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Convertit le Markdown avec mise en cache
 */
export async function markdownToHtmlCached(
  markdown: string,
  options: MarkdownOptions = {},
  cacheKey?: string
): Promise<string> {
  if (!cacheKey) {
    return markdownToHtml(markdown, options);
  }

  const now = Date.now();
  const cached = markdownCache[cacheKey];

  // Vérification du cache
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.html;
  }

  // Conversion et mise en cache
  const html = await markdownToHtml(markdown, options);
  markdownCache[cacheKey] = {
    html,
    timestamp: now,
    version: "1.0",
  };

  return html;
}

/**
 * Vide le cache de transformation
 */
export function clearMarkdownCache(): void {
  Object.keys(markdownCache).forEach((key) => {
    delete markdownCache[key];
  });
}

/**
 * Obtient les statistiques du cache
 */
export function getCacheStats(): {
  entries: number;
  totalSize: number;
  oldestEntry: number;
} {
  const entries = Object.keys(markdownCache);
  const now = Date.now();

  return {
    entries: entries.length,
    totalSize: entries.reduce((size, key) => {
      return size + markdownCache[key].html.length;
    }, 0),
    oldestEntry:
      entries.length > 0
        ? Math.min(...entries.map((key) => now - markdownCache[key].timestamp))
        : 0,
  };
}

// ===== EXPORTS =====
export default {
  markdownToHtml,
  markdownToHtmlCached,
  generateSlug,
  estimateReadingTime,
  extractTableOfContents,
  addHeaderIds,
  processMarkdownContent,
  hasUnsafeContent,
  sanitizeMarkdown,
  clearMarkdownCache,
  getCacheStats,
};

// 📋 Phase Status: ✅ Phase 3 - Markdown Processing with Security
