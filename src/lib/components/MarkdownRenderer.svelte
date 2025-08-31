<script lang="ts">
  import {
    markdownToHtml,
    processCourse,
    estimateReadingTime,
    extractHeaders,
  } from "$lib/utils/content";
  import type { Course, MarkdownOptions } from "$lib/types/content";

  export let content: string = "";
  export let course: Course | null = null;
  export const options: MarkdownOptions = {
    allowHtml: false,
    highlight: true,
    headingIds: true,
    breaks: true,
    enableCodeHighlight: true,
    enableMath: false,
    sanitizeHtml: true,
  };
  export let showMeta: boolean = false;
  export let showToc: boolean = false;

  let renderedHtml = "";
  let readingTime = 0;
  let headers: Array<{ id: string; level: number; text: string }> = [];
  let processingTime = 0;

  // Fonction reactive pour le rendu
  $: {
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

  function scrollToHeader(headerId: string) {
    const element = document.getElementById(headerId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<div class="markdown-renderer">
  {#if showMeta && (course || content)}
    <div class="content-meta">
      <div class="meta-info">
        {#if course}
          <h2 class="content-title">{course.titre}</h2>
          <p class="content-description">{course.description}</p>
          <div class="meta-tags">
            <span class="meta-tag type">📖 {course.type}</span>
            <span class="meta-tag duration">⏱️ {course.dureeEstimee} min</span>
            <span class="meta-tag reading">📚 {readingTime} min de lecture</span
            >
          </div>
        {:else}
          <div class="meta-tags">
            <span class="meta-tag reading">📚 {readingTime} min de lecture</span
            >
            <span class="meta-tag processing"
              >⚡ {processingTime.toFixed(2)}ms</span
            >
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <div class="content-layout">
    {#if showToc && headers.length > 0}
      <nav class="table-of-contents">
        <h3>📋 Table des matières</h3>
        <ul class="toc-list">
          {#each headers as header (header.id)}
            <li class="toc-item level-{header.level}">
              <button
                class="toc-link"
                on:click={() => scrollToHeader(header.id)}
              >
                {header.text}
              </button>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}

    <div class="content-body" class:with-toc={showToc && headers.length > 0}>
      <article class="rendered-content">
        <!-- Note: Le contenu HTML est sécurisé par le service markdown.ts -->
        {@html renderedHtml}
      </article>
    </div>
  </div>
</div>

<style>
  .markdown-renderer {
    font-family: "Segoe UI", system-ui, sans-serif;
    line-height: 1.6;
  }

  .content-meta {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .content-title {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .content-description {
    margin: 0 0 1rem 0;
    color: #6b7280;
    font-size: 1rem;
  }

  .meta-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .meta-tag {
    background: #3b82f6;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .meta-tag.type {
    background: #10b981;
  }

  .meta-tag.duration {
    background: #f59e0b;
  }

  .meta-tag.reading {
    background: #8b5cf6;
  }

  .meta-tag.processing {
    background: #ef4444;
  }

  .content-layout {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: start;
  }

  .content-layout:not(:has(.table-of-contents)) {
    grid-template-columns: 1fr;
  }

  .table-of-contents {
    position: sticky;
    top: 2rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    min-width: 250px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .table-of-contents h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #374151;
    font-weight: 600;
  }

  .toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc-item {
    margin-bottom: 0.5rem;
  }

  .toc-item.level-2 {
    padding-left: 1rem;
  }

  .toc-item.level-3 {
    padding-left: 2rem;
  }

  .toc-item.level-4 {
    padding-left: 3rem;
  }

  .toc-link {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.25rem 0;
    text-align: left;
    width: 100%;
    transition: color 0.2s;
  }

  .toc-link:hover {
    color: #3b82f6;
  }

  .content-body {
    min-width: 0; /* Permet au flex-shrink de fonctionner */
  }

  .rendered-content {
    max-width: none;
  }

  /* Styles pour le contenu rendu */
  .rendered-content :global(h1) {
    color: #1f2937;
    font-size: 2rem;
    font-weight: 700;
    margin: 2rem 0 1rem 0;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .rendered-content :global(h2) {
    color: #374151;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem 0;
  }

  .rendered-content :global(h3) {
    color: #4b5563;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1.25rem 0 0.5rem 0;
  }

  .rendered-content :global(p) {
    margin: 1rem 0;
    color: #374151;
  }

  .rendered-content :global(ul),
  .rendered-content :global(ol) {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .rendered-content :global(li) {
    margin: 0.5rem 0;
    color: #374151;
  }

  .rendered-content :global(blockquote) {
    background: #f9fafb;
    border-left: 4px solid #3b82f6;
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    color: #4b5563;
    font-style: italic;
  }

  .rendered-content :global(code) {
    background: #f1f5f9;
    color: #1e293b;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.875rem;
    font-family: "Courier New", monospace;
  }

  .rendered-content :global(pre) {
    background: #1f2937;
    color: #f9fafb;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;
    line-height: 1.4;
  }

  .rendered-content :global(pre code) {
    background: none;
    color: inherit;
    padding: 0;
    font-size: 0.875rem;
  }

  .rendered-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.875rem;
  }

  .rendered-content :global(th),
  .rendered-content :global(td) {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
  }

  .rendered-content :global(th) {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  .rendered-content :global(strong) {
    font-weight: 600;
    color: #1f2937;
  }

  .rendered-content :global(em) {
    font-style: italic;
    color: #4b5563;
  }

  .rendered-content :global(a) {
    color: #3b82f6;
    text-decoration: underline;
    text-decoration-color: #93c5fd;
    transition: all 0.2s;
  }

  .rendered-content :global(a:hover) {
    color: #1d4ed8;
    text-decoration-color: #3b82f6;
  }

  .rendered-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 1rem 0;
  }

  .rendered-content :global(hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2rem 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .content-layout {
      grid-template-columns: 1fr !important;
    }

    .table-of-contents {
      position: static;
      order: -1;
      max-height: 200px;
    }

    .rendered-content :global(h1) {
      font-size: 1.75rem;
    }

    .rendered-content :global(h2) {
      font-size: 1.375rem;
    }

    .rendered-content :global(pre) {
      padding: 1rem;
      margin: 1rem -1rem;
      border-radius: 0;
    }
  }
</style>
