import React, { useState, useMemo } from 'react';
import { X, RotateCw, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Download, Sparkles, BookOpen } from 'lucide-react';
import { NoteDocument } from '../../types';
import { FormattedMathText } from '../renderers/KaTeXViewer';
import { exportService } from '../../services/exportService';

interface Flashcard {
  id: string;
  category: string;
  front: string;
  back: string;
  sourceSection: string;
}

interface FlashcardsModalProps {
  document: NoteDocument;
  onClose: () => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({ document, onClose }) => {
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Extract flashcards from document sections
  const flashcards: Flashcard[] = useMemo(() => {
    const list: Flashcard[] = [];

    document.sections.forEach((sec) => {
      sec.blocks.forEach((b) => {
        if (b.type === 'callout' && b.variant === 'formula') {
          list.push({
            id: b.id,
            category: 'Theorem / Formula',
            front: b.title,
            back: b.content,
            sourceSection: sec.title,
          });
        } else if (b.type === 'equation' && b.caption) {
          list.push({
            id: b.id,
            category: 'Mathematical Formula',
            front: b.caption,
            back: `$$${b.latex}$$`,
            sourceSection: sec.title,
          });
        } else if (b.type === 'examQuestion') {
          list.push({
            id: b.id,
            category: `Exam Question (${b.questionType.toUpperCase()})`,
            front: b.question,
            back: b.answer,
            sourceSection: sec.title,
          });
        } else if (b.type === 'table' && b.headers[0]?.toLowerCase().includes('term')) {
          b.rows.forEach((row, rIdx) => {
            if (row[0] && row[1]) {
              list.push({
                id: `${b.id}-${rIdx}`,
                category: 'Definition / Term',
                front: `Define: ${row[0]}`,
                back: `${row[1]} ${row[2] ? `\nFormula / Note: ${row[2]}` : ''}`,
                sourceSection: sec.title,
              });
            }
          });
        }
      });
    });

    // Fallback if none parsed
    if (list.length === 0) {
      document.sections.forEach((sec, idx) => {
        list.push({
          id: `sec-${idx}`,
          category: 'Key Concept',
          front: sec.title,
          back: sec.blocks.map(b => b.type === 'paragraph' ? b.content : '').filter(Boolean).slice(0, 2).join('\n\n'),
          sourceSection: sec.title,
        });
      });
    }

    return list;
  }, [document]);

  const currentCard = flashcards[currentIndex] || flashcards[0];
  const isMastered = masteredIds.has(currentCard?.id);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleToggleMastered = (mastered: boolean) => {
    const updated = new Set(masteredIds);
    if (mastered) {
      updated.add(currentCard.id);
    } else {
      updated.delete(currentCard.id);
    }
    setMasteredIds(updated);
    handleNext();
  };

  const handleExportAnki = () => {
    let tsv = '#separator:Tab\n#html:true\n';
    flashcards.forEach((c) => {
      const q = c.front.replace(/\t/g, ' ').replace(/\n/g, '<br>');
      const a = c.back.replace(/\t/g, ' ').replace(/\n/g, '<br>');
      tsv += `${q}\t${a}\t${c.category}\n`;
    });

    const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.topic.replace(/[^a-zA-Z0-9]/g, '_')}_Anki_Deck.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Active Recall Flashcards Mode
              </h3>
              <p className="text-xs text-slate-400">
                {flashcards.length} High-Yield Cards • Spaced Repetition
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAnki}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Download Anki-compatible TSV deck"
            >
              <Download size={13} />
              <span>Export to Anki</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Card {currentIndex + 1} of {flashcards.length}</span>
          <span>Mastery: {masteredIds.size} / {flashcards.length} ({Math.round((masteredIds.size / flashcards.length) * 100)}%)</span>
        </div>
        <div className="mx-6 mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${(masteredIds.size / flashcards.length) * 100}%` }}
          />
        </div>

        {/* 3D Flippable Card Area */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <div
            onClick={() => setFlipped(!flipped)}
            className="w-full h-72 sm:h-80 cursor-pointer rounded-2xl border-2 border-indigo-100 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/60 p-6 sm:p-8 flex flex-col justify-between shadow-card hover:border-indigo-300 hover:shadow-elevated transition-all relative select-none overflow-y-auto"
          >
            {/* Category tag */}
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                {currentCard.category}
              </span>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <RotateCw size={12} />
                <span>{flipped ? 'Showing Answer (Click to Flip)' : 'Click to Reveal Answer'}</span>
              </span>
            </div>

            {/* Card Content */}
            <div className="my-auto py-4 text-center">
              {!flipped ? (
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    <FormattedMathText text={currentCard.front} />
                  </div>
                  <p className="text-xs text-slate-400 mt-3 italic">
                    Tap anywhere on the card to check model answer
                  </p>
                </div>
              ) : (
                <div className="text-left bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs max-h-48 overflow-y-auto text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  <div className="font-bold text-indigo-900 mb-1 text-xs uppercase tracking-wider">
                    Model Verification:
                  </div>
                  <FormattedMathText text={currentCard.back} />
                </div>
              )}
            </div>

            {/* Source attribution */}
            <div className="text-[11px] text-slate-400 truncate">
              Section: {currentCard.sourceSection}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            title="Previous card"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleMastered(false)}
              className="px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <XCircle size={15} className="text-amber-600" />
              <span>Need Review</span>
            </button>

            <button
              onClick={() => handleToggleMastered(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <CheckCircle2 size={15} />
              <span>I Know This (Mastered)</span>
            </button>
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            title="Next card"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
