import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import { B as BROWSER } from "./false.js";
const browser = BROWSER;
marked.use(markedHighlight({
  langPrefix: "hljs language-",
  highlight(code, lang) {
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
marked.setOptions({
  breaks: true,
  gfm: true
});
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
    "td"
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
  ALLOW_DATA_ATTR: false
};
function sanitizeHtmlBasic(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "").replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "").replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "").replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "").replace(/on\w+\s*=\s*["'][^"']*["']/gi, "").replace(/javascript:/gi, "");
}
function markdownToHtml(markdown) {
  try {
    const rawHtml = marked.parse(markdown);
    let cleanHtml;
    if (browser && typeof window !== "undefined" && DOMPurify.sanitize)
      ;
    else {
      cleanHtml = sanitizeHtmlBasic(rawHtml);
    }
    return cleanHtml;
  } catch (error) {
    console.error("Erreur de conversion Markdown:", error);
    return '<p class="error">Erreur de chargement du contenu</p>';
  }
}
const htmlCache = /* @__PURE__ */ new Map();
function markdownToHtmlCached(markdown, cacheKey) {
  const key = cacheKey || btoa(markdown).slice(0, 32);
  if (htmlCache.has(key)) {
    return htmlCache.get(key);
  }
  const html = markdownToHtml(markdown);
  htmlCache.set(key, html);
  return html;
}
function processCourse(course) {
  return {
    ...course,
    contenuHtml: markdownToHtmlCached(course.contenuMarkdown, course.id)
  };
}
function generateSlug(title) {
  return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function estimateReadingTime(markdown) {
  const wordsPerMinute = 200;
  const wordCount = markdown.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
function extractHeaders(markdown) {
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
export {
  extractHeaders as a,
  estimateReadingTime as e,
  generateSlug as g,
  markdownToHtml as m,
  processCourse as p
};
