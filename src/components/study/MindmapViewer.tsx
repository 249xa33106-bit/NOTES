import React, { useMemo } from 'react';
import { Network, Sparkles, X, BookOpen, Layers } from 'lucide-react';
import { NoteDocument } from '../../types';
import { MermaidViewer } from '../renderers/MermaidViewer';

interface MindmapViewerProps {
  document: NoteDocument;
  onSelectSection: (sectionId: string) => void;
  onClose: () => void;
}

export const MindmapViewer: React.FC<MindmapViewerProps> = ({
  document,
  onSelectSection,
  onClose,
}) => {
  // Construct Mermaid mindmap / tree graph
  const mermaidGraph = useMemo(() => {
    let graph = `graph LR\n`;
    const rootId = `Root`;
    graph += `    ${rootId}["🌲 ${document.topic}"]\n`;
    graph += `    style ${rootId} fill:#4f46e5,stroke:#312e81,stroke-width:2px,color:#ffffff\n`;

    document.sections.forEach((sec, idx) => {
      const secNodeId = `Sec_${idx}`;
      const cleanTitle = sec.title.replace(/["\(\)\[\]\{\}]/g, '');
      graph += `    ${rootId} --> ${secNodeId}["${cleanTitle}"]\n`;
      graph += `    style ${secNodeId} fill:#f8fafc,stroke:#818cf8,stroke-width:1.5px\n`;

      // Extract key concepts from blocks
      sec.blocks.slice(0, 3).forEach((b, bIdx) => {
        const subId = `Sub_${idx}_${bIdx}`;
        let label = '';
        if (b.type === 'heading') label = b.text;
        else if (b.type === 'callout') label = b.title;
        else if (b.type === 'diagram') label = b.caption;
        else if (b.type === 'code') label = `${b.language.toUpperCase()} Implementation`;
        else if (b.type === 'equation') label = b.caption || 'Mathematical Invariant';
        else if (b.type === 'examQuestion') label = `${b.questionType.toUpperCase()} Exam Question`;

        if (label) {
          const cleanLabel = label.replace(/["\(\)\[\]\{\}]/g, '').slice(0, 35);
          graph += `    ${secNodeId} --> ${subId}["${cleanLabel}"]\n`;
          graph += `    style ${subId} fill:#ffffff,stroke:#cbd5e1,stroke-width:1px,color:#475569\n`;
        }
      });
    });

    return graph;
  }, [document]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Network size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Interactive Knowledge Graph & Mindmap
              </h3>
              <p className="text-xs text-slate-500">
                Visual relationship graph of {document.topic} across all {document.sections.length} syllabus sections
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mindmap Canvas */}
        <div className="flex-1 p-6 overflow-auto bg-slate-50 flex items-center justify-center">
          <div className="w-full h-full max-w-4xl">
            <MermaidViewer
              source={mermaidGraph}
              caption={`Curriculum Knowledge Map: ${document.topic}`}
              description="Visual hierarchical roadmap. Inspect prerequisite branches, algorithmic steps, and examination criteria."
              allowEdit={false}
            />
          </div>
        </div>

        {/* Quick Section Jump Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between overflow-x-auto text-xs gap-2">
          <span className="font-semibold text-slate-600 shrink-0">Jump directly to:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {document.sections.slice(0, 6).map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec.id);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium whitespace-nowrap transition"
              >
                {sec.title.split('.')[1] || sec.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
