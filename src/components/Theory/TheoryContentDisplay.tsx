import React, { useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import mermaid from 'mermaid';

// Stop mermaid from trying to lazy-load extra diagram modules
if ((mermaid as any).registerExternalDiagrams) {
  mermaid.registerExternalDiagrams([]);
}

/** ---------- Types ---------- */
interface TheoryContent {
  notes?: string;
  mermaid?: string;
  examTag?: string;
}
interface TheoryContentDisplayProps {
  content: string | TheoryContent;
}

/** ---------- Mermaid helpers ---------- */

/** Make the diagram parser-safe (handles common LLM artifacts) */
function sanitizeMermaid(diagram: string): string {
  if (!diagram) return '';

  let d = diagram
    .replace(/<META_START>[\s\S]*?MINDMAP_START/i, '')
    .replace(/MINDMAP_END[\s\S]*?META_END>/i, '')
    .trim();

  // Normalize unicode & symbols
  d = d
    .replace(/\r/g, '\n')
    .replace(/\u2192|\u27F6|\u2794/g, '->')   // arrows
    .replace(/[–—]/g, '-')                    // dashes
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/&/g, 'and');

  // ⚡️ FIX 1: wrap labels with unsafe chars in quotes
  d = d.replace(/([A-Za-z0-9_]+)\[([^\]]*?[():,%/][^\]]*?)\]/g, (m, id, label) => {
    return `${id}["${label.replace(/"/g, "'")}"]`;
  });

  // ⚡️ FIX 2: remove stray semicolons at end of lines
  d = d.replace(/;\s*$/gm, '');

  // ⚡️ FIX 3: split jammed lines
  d = d.replace(/]\s{2,}(?=[A-Za-z0-9_]+\s*[-.]{2,}\s*>)/g, ']\n');

  // Ensure header
  const trimmed = d.trim();
  if (!/^graph\s+(TD|LR|RL|BT)\b/i.test(trimmed)) {
    d = `graph TD\n${trimmed}`;
  }

  return d.replace(/\n{3,}/g, '\n\n').trim();
}

/** Extract a mermaid block from markdown or meta payloads */
function extractMermaid(markdown: string): string | null {
  if (!markdown) return null;

  // Prefer explicit MINDMAP wrapper if present
  const meta = markdown.match(/MINDMAP_START([\s\S]*?)MINDMAP_END/i);
  if (meta && meta[1]) return sanitizeMermaid(meta[1]);

  // Fallback: first ```mermaid fenced block
  const fence = markdown.match(/```mermaid([\s\S]*?)```/i);
  if (fence && fence[1]) return sanitizeMermaid(fence[1]);

  return null;
}

/** Remove mermaid/meta blocks from markdown so they don't render as code */
function stripMermaidFromMarkdown(markdown: string): string {
  if (!markdown) return '';
  return markdown
    .replace(/MINDMAP_START[\s\S]*?MINDMAP_END/gi, '')
    .replace(/```mermaid[\s\S]*?```/gi, '')
    .replace(/<META_START>[\s\S]*?META_END>/gi, '')
    .trim();
}

/** Extract EXAM_TAG from meta (if LLM included it in notes) */
function extractExamTag(markdown: string): string | null {
  const m = markdown.match(/EXAM_TAG\s*=\s*([^\s\n]+)/i);
  return m ? m[1] : null;
}

/** Optional: remove stray backtick fences the model sometimes adds
 * but keep mermaid blocks (already stripped above).
 */
function sanitizeMarkdownBody(md: string): string {
  return md
    // un-fence any accidental global code fences left over
    .replace(/```([\s\S]*?)```/g, '$1')
    // remove lonely/backtick debris
    .replace(/``+/g, '')
    .trim();
}

/** ---------- Mermaid Chart Component ---------- */
const MermaidChart: React.FC<{ chart: string; id: string }> = ({ chart, id }) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize once per mount
    mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
    nodeSpacing: 80,
    rankSpacing: 100
  },
      lazyLoad: false
});
  }, []);

  useEffect(() => {
    const render = async () => {
      if (!elRef.current) return;
      if (!chart || !chart.trim()) {
        elRef.current.innerHTML = '';
        return;
      }
      try {
        const chartId = `mermaid-${id}-${Date.now()}`;
        const safe = sanitizeMermaid(chart);
        const { svg } = await mermaid.render(chartId, safe);
        elRef.current.innerHTML = svg;
      } catch (err: any) {
        // Friendly error card (also visible in PDF)
        elRef.current.innerHTML = `
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p class="text-red-700 font-medium">Mind Map Rendering Error</p>
            <p class="text-red-600 text-sm mt-1">Unable to render the mind map diagram.</p>
            <details class="mt-2">
              <summary class="text-red-500 text-xs cursor-pointer">Show details</summary>
              <pre class="text-red-500 text-xs mt-2 text-left whitespace-pre-wrap">${(err?.message || String(err))}</pre>
            </details>
          </div>
        `;
      }
    };
    render();
  }, [chart, id]);

  return (
    <div
      ref={elRef}
      className="my-6 p-4 bg-slate-50 rounded-lg border border-slate-200 overflow-auto print:bg-white print:border-slate-200"
      style={{ minHeight: 200 }}
    />
  );
};

/** ---------- Main Component ---------- */
const TheoryContentDisplay: React.FC<TheoryContentDisplayProps> = ({ content }) => {
  /** Normalize incoming shape */
  const notes: string = useMemo(() => {
    return typeof content === 'string' ? content : (content?.notes || '');
  }, [content]);

  const explicitMermaid: string | null = useMemo(() => {
    return typeof content === 'object' ? (content?.mermaid || null) : null;
  }, [content]);

  const mergedExamTag: string | null = useMemo(() => {
    if (typeof content === 'object' && content?.examTag) return content.examTag;
    return extractExamTag(notes);
  }, [content, notes]);

  /** Extract or use provided diagram */
  const mermaidDiagram = useMemo(() => {
    return explicitMermaid || extractMermaid(notes);
  }, [explicitMermaid, notes]);

  /** Final markdown with mindmap/meta removed & fences cleaned */
  const displayMarkdown = useMemo(() => {
    const stripped = stripMermaidFromMarkdown(notes);
    return sanitizeMarkdownBody(stripped);
  }, [notes]);

  /** Renderers */
  const components = useMemo(() => {
    return {
      // Math via remark-math
      math: ({ children }: any) => <BlockMath math={String(children)} />,
      inlineMath: ({ children }: any) => <InlineMath math={String(children)} />,

      // Code blocks (non-mermaid)
      code: ({
        inline,
        className,
        children,
        ...props
      }: {
        inline?: boolean;
        className?: string;
        children?: React.ReactNode;
      }) => {
        const match = /language-(\w+)/.exec(className || '');
        const lang = match ? match[1] : '';

        if (!inline && lang === 'mermaid') {
          // If something slips through, render as chart anyway
          const chartContent = String(children || '').replace(/\n$/, '');
          return <MermaidChart chart={chartContent} id="auto" />;
        }

        if (!inline && match) {
          // Print-friendly light theme
          return (
            <pre className="bg-slate-100 text-slate-900 border border-slate-300 rounded-md overflow-x-auto my-4 p-4 print:bg-white print:border-slate-200 print:text-black print:shadow-none">
              <code className={`language-${lang}`} {...props}>
                {String(children || '').replace(/\n$/, '')}
              </code>
            </pre>
          );
        }

        // Inline code
        return (
          <code className="bg-slate-200/70 dark:bg-slate-700 text-rose-700 dark:text-rose-300 px-1 py-0.5 rounded text-[0.85em]" {...props}>
            {String(children || '')}
          </code>
        );
      },

      // Headings (keep children as React nodes; do NOT stringify → avoids [object Object])
      h1: ({ children, ...p }: any) => (
        <h1 {...p} className="theory-heading-h1 text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {children}
        </h1>
      ),
      h2: ({ children, ...p }: any) => (
        <h2 {...p} className="theory-heading-h2 text-xl font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2">
          {children}
        </h2>
      ),
      h3: ({ children, ...p }: any) => (
        <h3 {...p} className="theory-heading-h3 text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">
          {children}
        </h3>
      ),
      h4: ({ children, ...p }: any) => (
        <h4 {...p} className="theory-heading-h4 text-base font-semibold text-slate-800 dark:text-slate-100 mt-3 mb-1">
          {children}
        </h4>
      )
    };
  }, []);

  return (
    <div className="theory-content markdown-body max-w-none text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg print:bg-white">
      {/* Optional exam tag badge if present */}
      {mergedExamTag && (
        <div className="mb-3">
          <span className="inline-block text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-md border border-blue-200">
            Exam: {mergedExamTag}
          </span>
        </div>
      )}

      {/* Notes */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {displayMarkdown}
      </ReactMarkdown>

      {/* Mind map (if found or provided) */}
      {mermaidDiagram && (
        <div className="mt-6">
          <MermaidChart chart={mermaidDiagram} id="theory-mindmap" />
        </div>
      )}
    </div>
  );
};

export default TheoryContentDisplay;
