import React from 'react';
import {
  ContentBlock,
  ParagraphBlock,
  HeadingBlock,
  ListBlock,
  TableBlock,
  DiagramBlock,
  EquationBlock,
  CodeBlock,
  CalloutBlock,
  ExamQuestionBlock,
} from '../../types';
import { MermaidViewer } from './MermaidViewer';
import { KaTeXViewer, FormattedMathText } from './KaTeXViewer';
import { CodeBlockViewer } from './CodeBlockViewer';
import { ExamQuestionViewer } from './ExamQuestionViewer';
import {
  Info,
  Lightbulb,
  AlertTriangle,
  Flame,
  CheckCircle,
  Binary,
  Layers,
} from 'lucide-react';

interface ContentBlockRendererProps {
  block: ContentBlock;
  isEditing?: boolean;
  onUpdateBlock?: (updatedBlock: ContentBlock) => void;
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  switch (block.type) {
    case 'paragraph': {
      return (
        <p className="my-3 text-slate-700 text-sm sm:text-base leading-relaxed">
          <FormattedMathText text={block.content} />
        </p>
      );
    }

    case 'heading': {
      if (block.level === 2) {
        return (
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">
            <FormattedMathText text={block.text} />
          </h2>
        );
      }
      if (block.level === 3) {
        return (
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mt-6 mb-3">
            <FormattedMathText text={block.text} />
          </h3>
        );
      }
      return (
        <h4 className="text-base sm:text-lg font-medium text-slate-800 mt-4 mb-2">
          <FormattedMathText text={block.text} />
        </h4>
      );
    }

    case 'list': {
      if (block.ordered) {
        return (
          <ol className="my-3 pl-5 list-decimal space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
            {block.items.map((item, idx) => (
              <li key={idx}>
                <FormattedMathText text={item} />
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="my-3 pl-5 list-disc space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
          {block.items.map((item, idx) => (
            <li key={idx}>
              <FormattedMathText text={item} />
            </li>
          ))}
        </ul>
      );
    }

    case 'table': {
      return (
        <div className="my-6 rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {block.caption && (
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-semibold text-slate-700">
              {block.caption}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100/90 text-slate-800 border-b border-slate-200 font-semibold">
                  {block.headers.map((h, hIdx) => (
                    <th key={hIdx} className="p-3 border-r border-slate-200 last:border-r-0">
                      <FormattedMathText text={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70 transition">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-3 text-slate-700 border-r border-slate-100 last:border-r-0 align-top"
                      >
                        <FormattedMathText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case 'diagram': {
      return (
        <MermaidViewer
          source={block.source}
          caption={block.caption}
          description={block.description}
          onUpdateSource={(newSource) => {
            if (onUpdateBlock) {
              onUpdateBlock({
                ...block,
                source: newSource,
              });
            }
          }}
          allowEdit={isEditing || true}
        />
      );
    }

    case 'equation': {
      return (
        <div className="my-5 p-4 rounded-xl bg-slate-50/80 border border-slate-200">
          <KaTeXViewer math={block.latex} block={block.isBlock} caption={block.caption} />
          {block.derivationSteps && block.derivationSteps.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-700 mb-1 block">Derivation Steps:</span>
              <div className="space-y-1">
                {block.derivationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-indigo-600 font-bold">{idx + 1}.</span>
                    <div>
                      <FormattedMathText text={step.step} /> — <span className="text-slate-500">{step.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'code': {
      return (
        <CodeBlockViewer
          language={block.language}
          code={block.code}
          caption={block.caption}
          expectedOutput={block.expectedOutput}
          verifiedOutput={block.verifiedOutput}
          sampleInputs={block.sampleInputs}
          explanation={block.explanation}
        />
      );
    }

    case 'callout': {
      const getCalloutStyles = () => {
        switch (block.variant) {
          case 'important':
            return {
              bg: 'bg-indigo-50/70 border-indigo-200 text-indigo-950',
              icon: <Flame size={18} className="text-indigo-600 shrink-0 mt-0.5" />,
              badge: 'bg-indigo-100 text-indigo-800',
            };
          case 'tip':
            return {
              bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
              icon: <Lightbulb size={18} className="text-emerald-600 shrink-0 mt-0.5" />,
              badge: 'bg-emerald-100 text-emerald-800',
            };
          case 'warning':
            return {
              bg: 'bg-amber-50/70 border-amber-200 text-amber-950',
              icon: <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />,
              badge: 'bg-amber-100 text-amber-800',
            };
          case 'formula':
            return {
              bg: 'bg-violet-50/70 border-violet-200 text-violet-950',
              icon: <Binary size={18} className="text-violet-600 shrink-0 mt-0.5" />,
              badge: 'bg-violet-100 text-violet-800',
            };
          default:
            return {
              bg: 'bg-blue-50/70 border-blue-200 text-blue-950',
              icon: <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />,
              badge: 'bg-blue-100 text-blue-800',
            };
        }
      };

      const style = getCalloutStyles();

      return (
        <div className={`my-4 p-4 rounded-xl border ${style.bg} shadow-xs`}>
          <div className="flex items-start gap-2.5">
            {style.icon}
            <div className="flex-1">
              <div className="font-bold text-sm tracking-tight mb-1 text-slate-900">
                {block.title}
              </div>
              <div className="text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                <FormattedMathText text={block.content} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'examQuestion': {
      return <ExamQuestionViewer block={block} />;
    }

    default:
      return null;
  }
};
