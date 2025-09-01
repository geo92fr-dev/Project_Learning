import { c as create_ssr_component, a as escape, e as each } from "./ssr.js";
import { p as processCourse, e as estimateReadingTime, a as extractHeaders, m as markdownToHtml } from "./content2.js";
const MarkdownRenderer_svelte_svelte_type_style_lang = "";
const css = {
  code: '.markdown-renderer.svelte-zh4hvu.svelte-zh4hvu{font-family:"Segoe UI", system-ui, sans-serif;line-height:1.6}.content-meta.svelte-zh4hvu.svelte-zh4hvu{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:1.5rem;margin-bottom:2rem}.content-title.svelte-zh4hvu.svelte-zh4hvu{margin:0 0 0.5rem 0;color:#1f2937;font-size:1.5rem;font-weight:600}.content-description.svelte-zh4hvu.svelte-zh4hvu{margin:0 0 1rem 0;color:#6b7280;font-size:1rem}.meta-tags.svelte-zh4hvu.svelte-zh4hvu{display:flex;flex-wrap:wrap;gap:0.5rem}.meta-tag.svelte-zh4hvu.svelte-zh4hvu{background:#3b82f6;color:white;padding:0.25rem 0.75rem;border-radius:12px;font-size:0.75rem;font-weight:500}.meta-tag.type.svelte-zh4hvu.svelte-zh4hvu{background:#10b981}.meta-tag.duration.svelte-zh4hvu.svelte-zh4hvu{background:#f59e0b}.meta-tag.reading.svelte-zh4hvu.svelte-zh4hvu{background:#8b5cf6}.meta-tag.processing.svelte-zh4hvu.svelte-zh4hvu{background:#ef4444}.content-layout.svelte-zh4hvu.svelte-zh4hvu{display:grid;grid-template-columns:auto 1fr;gap:2rem;align-items:start}.content-layout.svelte-zh4hvu.svelte-zh4hvu:not(:has(.table-of-contents)){grid-template-columns:1fr}.table-of-contents.svelte-zh4hvu.svelte-zh4hvu{position:sticky;top:2rem;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:1.5rem;min-width:250px;max-height:70vh;overflow-y:auto}.table-of-contents.svelte-zh4hvu h3.svelte-zh4hvu{margin:0 0 1rem 0;font-size:1rem;color:#374151;font-weight:600}.toc-list.svelte-zh4hvu.svelte-zh4hvu{list-style:none;margin:0;padding:0}.toc-item.svelte-zh4hvu.svelte-zh4hvu{margin-bottom:0.5rem}.toc-item.level-2.svelte-zh4hvu.svelte-zh4hvu{padding-left:1rem}.toc-item.level-3.svelte-zh4hvu.svelte-zh4hvu{padding-left:2rem}.toc-item.level-4.svelte-zh4hvu.svelte-zh4hvu{padding-left:3rem}.toc-link.svelte-zh4hvu.svelte-zh4hvu{background:none;border:none;color:#6b7280;cursor:pointer;font-size:0.875rem;padding:0.25rem 0;text-align:left;width:100%;transition:color 0.2s}.toc-link.svelte-zh4hvu.svelte-zh4hvu:hover{color:#3b82f6}.content-body.svelte-zh4hvu.svelte-zh4hvu{min-width:0}.rendered-content.svelte-zh4hvu.svelte-zh4hvu{max-width:none}.rendered-content.svelte-zh4hvu h1{color:#1f2937;font-size:2rem;font-weight:700;margin:2rem 0 1rem 0;border-bottom:2px solid #e5e7eb;padding-bottom:0.5rem}.rendered-content.svelte-zh4hvu h2{color:#374151;font-size:1.5rem;font-weight:600;margin:1.5rem 0 0.75rem 0}.rendered-content.svelte-zh4hvu h3{color:#4b5563;font-size:1.25rem;font-weight:600;margin:1.25rem 0 0.5rem 0}.rendered-content.svelte-zh4hvu p{margin:1rem 0;color:#374151}.rendered-content.svelte-zh4hvu ul,.rendered-content.svelte-zh4hvu ol{margin:1rem 0;padding-left:1.5rem}.rendered-content.svelte-zh4hvu li{margin:0.5rem 0;color:#374151}.rendered-content.svelte-zh4hvu blockquote{background:#f9fafb;border-left:4px solid #3b82f6;margin:1.5rem 0;padding:1rem 1.5rem;color:#4b5563;font-style:italic}.rendered-content.svelte-zh4hvu code{background:#f1f5f9;color:#1e293b;padding:0.2rem 0.4rem;border-radius:3px;font-size:0.875rem;font-family:"Courier New", monospace}.rendered-content.svelte-zh4hvu pre{background:#1f2937;color:#f9fafb;padding:1.5rem;border-radius:8px;overflow-x:auto;margin:1.5rem 0;line-height:1.4}.rendered-content.svelte-zh4hvu pre code{background:none;color:inherit;padding:0;font-size:0.875rem}.rendered-content.svelte-zh4hvu table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:0.875rem}.rendered-content.svelte-zh4hvu th,.rendered-content.svelte-zh4hvu td{border:1px solid #e5e7eb;padding:0.75rem;text-align:left}.rendered-content.svelte-zh4hvu th{background:#f9fafb;font-weight:600;color:#374151}.rendered-content.svelte-zh4hvu strong{font-weight:600;color:#1f2937}.rendered-content.svelte-zh4hvu em{font-style:italic;color:#4b5563}.rendered-content.svelte-zh4hvu a{color:#3b82f6;text-decoration:underline;text-decoration-color:#93c5fd;transition:all 0.2s}.rendered-content.svelte-zh4hvu a:hover{color:#1d4ed8;text-decoration-color:#3b82f6}.rendered-content.svelte-zh4hvu img{max-width:100%;height:auto;border-radius:6px;margin:1rem 0}.rendered-content.svelte-zh4hvu hr{border:none;border-top:1px solid #e5e7eb;margin:2rem 0}@media(max-width: 768px){.content-layout.svelte-zh4hvu.svelte-zh4hvu{grid-template-columns:1fr !important}.table-of-contents.svelte-zh4hvu.svelte-zh4hvu{position:static;order:-1;max-height:200px}.rendered-content.svelte-zh4hvu h1{font-size:1.75rem}.rendered-content.svelte-zh4hvu h2{font-size:1.375rem}.rendered-content.svelte-zh4hvu pre{padding:1rem;margin:1rem -1rem;border-radius:0}}',
  map: null
};
const MarkdownRenderer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { content = "" } = $$props;
  let { course = null } = $$props;
  const options = {
    allowHtml: false,
    highlight: true,
    headingIds: true,
    breaks: true,
    enableCodeHighlight: true,
    enableMath: false,
    sanitizeHtml: true
  };
  let { showMeta = false } = $$props;
  let { showToc = false } = $$props;
  let renderedHtml = "";
  let readingTime = 0;
  let headers = [];
  let processingTime = 0;
  if ($$props.content === void 0 && $$bindings.content && content !== void 0)
    $$bindings.content(content);
  if ($$props.course === void 0 && $$bindings.course && course !== void 0)
    $$bindings.course(course);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.showMeta === void 0 && $$bindings.showMeta && showMeta !== void 0)
    $$bindings.showMeta(showMeta);
  if ($$props.showToc === void 0 && $$bindings.showToc && showToc !== void 0)
    $$bindings.showToc(showToc);
  $$result.css.add(css);
  {
    {
      const startTime = performance.now();
      if (course) {
        const processed = processCourse(course);
        renderedHtml = processed.contenuHtml || "";
        readingTime = estimateReadingTime(course.contenuMarkdown);
        headers = extractHeaders(course.contenuMarkdown);
      } else if (content) {
        renderedHtml = markdownToHtml(content);
        readingTime = estimateReadingTime(content);
        headers = extractHeaders(content);
      }
      const endTime = performance.now();
      processingTime = endTime - startTime;
    }
  }
  return `<div class="markdown-renderer svelte-zh4hvu">${showMeta && (course || content) ? `<div class="content-meta svelte-zh4hvu"><div class="meta-info">${course ? `<h2 class="content-title svelte-zh4hvu">${escape(course.titre)}</h2> <p class="content-description svelte-zh4hvu">${escape(course.description)}</p> <div class="meta-tags svelte-zh4hvu"><span class="meta-tag type svelte-zh4hvu">📖 ${escape(course.type)}</span> <span class="meta-tag duration svelte-zh4hvu">⏱️ ${escape(course.dureeEstimee)} min</span> <span class="meta-tag reading svelte-zh4hvu">📚 ${escape(readingTime)} min de lecture</span></div>` : `<div class="meta-tags svelte-zh4hvu"><span class="meta-tag reading svelte-zh4hvu">📚 ${escape(readingTime)} min de lecture</span> <span class="meta-tag processing svelte-zh4hvu">⚡ ${escape(processingTime.toFixed(2))}ms</span></div>`}</div></div>` : ``} <div class="content-layout svelte-zh4hvu">${showToc && headers.length > 0 ? `<nav class="table-of-contents svelte-zh4hvu"><h3 class="svelte-zh4hvu" data-svelte-h="svelte-1l3xw6v">📋 Table des matières</h3> <ul class="toc-list svelte-zh4hvu">${each(headers, (header) => {
    return `<li class="${"toc-item level-" + escape(header.level, true) + " svelte-zh4hvu"}"><button class="toc-link svelte-zh4hvu">${escape(header.text)}</button> </li>`;
  })}</ul></nav>` : ``} <div class="${["content-body svelte-zh4hvu", showToc && headers.length > 0 ? "with-toc" : ""].join(" ").trim()}"><article class="rendered-content svelte-zh4hvu"> <!-- HTML_TAG_START -->${renderedHtml}<!-- HTML_TAG_END --></article></div></div> </div>`;
});
export {
  MarkdownRenderer as M
};
