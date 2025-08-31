/**
 * Service de traitement Markdown
 * Conversion sécurisée Markdown → HTML avec coloration syntaxique
 */

import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import type { MarkdownOptions } from "../types/content";

// Configuration par défaut
const DEFAULT_OPTIONS: MarkdownOptions = {
  enableCodeHighlight: true,
  enableMath: false,
  sanitizeHtml: true,
  allowedTags: [
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
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "div",
    "span",
    "section",
    "article",
  ],
};

/**
 * Configuration du rendu Markdown avec highlight.js
 */
function configureMarked() {
  marked.setOptions({
    highlight: function (code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          console.warn("Erreur highlight.js:", err);
        }
      }
      return hljs.highlightAuto(code).value;
    },
    langPrefix: "hljs language-",
    breaks: true,
    gfm: true,
  } as any); // Temporary type assertion pour marked v5+
}

/**
 * Convertit le Markdown en HTML sécurisé
 */
export async function markdownToHtml(
  markdown: string,
  options: Partial<MarkdownOptions> = {}
): Promise<string> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Configuration de marked si nécessaire
    if (config.enableCodeHighlight) {
      configureMarked();
    }

    // Conversion Markdown → HTML
    const html = await marked(markdown);

    // Sanitisation HTML si activée
    if (config.sanitizeHtml && typeof html === "string") {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: config.allowedTags,
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
        ALLOW_DATA_ATTR: false,
      });
    }

    return html as string;
  } catch (error) {
    console.error("Erreur conversion Markdown:", error);
    return `<p class="error">Erreur lors du rendu du contenu</p>`;
  }
}

/**
 * Extrait les métadonnées YAML d'un contenu Markdown
 */
export function extractFrontMatter(content: string): {
  metadata: Record<string, any>;
  content: string;
} {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  try {
    // Simple parsing YAML (pour les cas basiques)
    const yamlContent = match[1];
    const metadata: Record<string, any> = {};

    yamlContent.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length > 0) {
        const value = valueParts.join(":").trim();
        metadata[key.trim()] = value.replace(/^['"]|['"]$/g, ""); // Supprime les quotes
      }
    });

    return {
      metadata,
      content: match[2],
    };
  } catch (error) {
    console.error("Erreur parsing frontmatter:", error);
    return { metadata: {}, content: match[2] || content };
  }
}

/**
 * Génère un slug à partir d'un titre
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garde seulement lettres, chiffres, espaces, tirets
    .replace(/\s+/g, "-") // Remplace espaces par tirets
    .replace(/-+/g, "-") // Supprime tirets multiples
    .trim();
}
