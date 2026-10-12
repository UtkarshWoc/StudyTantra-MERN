import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CITATION = /\[p\. (\d+)(?:-(\d+))?\]/g;

// Turn "[p. 12]" / "[p. 3-4]" into markdown links with a private scheme the
// link renderer recognises; everything else renders as normal Markdown.
const linkifyCitations = (text) =>
  text.replace(CITATION, (match, from, to) => `[p. ${from}${to ? `-${to}` : ''}](#cite-${from})`);

/**
 * Renders AI Markdown safely (no raw HTML). Page citations become buttons
 * that call onCitation(page) when provided.
 */
const Markdown = ({ children, onCitation, className = '' }) => (
  <div className={`markdown text-[15px] leading-relaxed ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children: label }) => {
          const page = href?.startsWith('#cite-') ? Number(href.slice(6)) : null;
          if (page) {
            return onCitation ? (
              <button
                type="button"
                onClick={() => onCitation(page)}
                className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 hover:bg-amber-500/25 align-baseline cursor-pointer"
                title={`Go to page ${page}`}
              >
                {label}
              </button>
            ) : (
              <span className="mx-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300">{label}</span>
            );
          }
          return <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-amber-600 dark:text-amber-400">{label}</a>;
        },
        h1: (props) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
        h2: (props) => <h4 className="text-base font-bold mt-4 mb-2" {...props} />,
        h3: (props) => <h5 className="font-bold mt-3 mb-1.5" {...props} />,
        p: (props) => <p className="my-2" {...props} />,
        ul: (props) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
        ol: (props) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
        code: (props) => <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[13px]" {...props} />,
        table: (props) => <div className="overflow-x-auto my-3"><table className="text-sm border-collapse" {...props} /></div>,
        th: (props) => <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left" {...props} />,
        td: (props) => <td className="border border-gray-300 dark:border-gray-600 px-2 py-1" {...props} />,
      }}
    >
      {linkifyCitations(children || '')}
    </ReactMarkdown>
  </div>
);

export default Markdown;
