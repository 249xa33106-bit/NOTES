import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXViewerProps {
  math: string;
  block?: boolean;
  className?: string;
  caption?: string;
}

export const KaTeXViewer: React.FC<KaTeXViewerProps> = ({
  math,
  block = false,
  className = '',
  caption,
}) => {
  const renderedHtml = useMemo(() => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: block,
        throwOnError: false,
      });
    } catch (err) {
      console.warn('KaTeX rendering error:', err);
      return `<span class="text-amber-700 bg-amber-50 px-1 rounded font-mono text-sm">${math}</span>`;
    }
  }, [math, block]);

  return (
    <div className={`my-2 ${block ? 'text-center overflow-x-auto py-2' : 'inline'} ${className}`}>
      <span dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      {caption && (
        <div className="text-xs text-slate-500 text-center mt-1 font-medium italic">
          {caption}
        </div>
      )}
    </div>
  );
};

// Helper function to render text containing inline math ($...$) and block math ($$...$$)
export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  // Split on $$...$$ and $...$
  const parts = useMemo(() => {
    if (!text) return [];
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
    const tokens: { type: 'text' | 'inline-math' | 'block-math'; content: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        });
      }
      const raw = match[0];
      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        tokens.push({
          type: 'block-math',
          content: raw.slice(2, -2),
        });
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        tokens.push({
          type: 'inline-math',
          content: raw.slice(1, -1),
        });
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    return tokens;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.type === 'block-math') {
          return <KaTeXViewer key={i} math={p.content} block={true} />;
        }
        if (p.type === 'inline-math') {
          return <KaTeXViewer key={i} math={p.content} block={false} />;
        }
        // Check for markdown bold/code in plain text
        return <span key={i}>{p.content}</span>;
      })}
    </span>
  );
};
