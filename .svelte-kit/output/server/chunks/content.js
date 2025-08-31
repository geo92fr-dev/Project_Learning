import { marked } from "marked";
import DOMPurify from "dompurify";
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
function markdownToHtml(markdown) {
  try {
    const rawHtml = marked.parse(markdown);
    const cleanHtml = DOMPurify.sanitize(rawHtml, purifyConfig);
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
  markdownToHtml as m,
  processCourse as p
};
