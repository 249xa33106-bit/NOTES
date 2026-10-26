import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Award, BookOpen, MessageSquare } from 'lucide-react';
import { ExamQuestionBlock } from '../../types';
import { FormattedMathText } from './KaTeXViewer';

interface ExamQuestionViewerProps {
  block: ExamQuestionBlock;
}

export const ExamQuestionViewer: React.FC<ExamQuestionViewerProps> = ({ block }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const isMCQ = block.questionType === 'mcq' && block.options && block.options.length > 0;
  const isCorrect = isMCQ && selectedOption === block.correctOptionIndex;

  const getBadgeColor = () => {
    switch (block.questionType) {
      case 'short':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'long':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'mcq':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'viva':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getBadgeLabel = () => {
    switch (block.questionType) {
      case 'short':
        return `Short Answer (${block.marks || 2} Marks)`;
      case 'long':
        return `Long Answer (${block.marks || 10} Marks)`;
      case 'mcq':
        return 'Multiple Choice Question (MCQ)';
      case 'viva':
        return 'Viva Voce / Oral Examination';
      default:
        return 'Exam Question';
    }
  };

  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition hover:border-slate-300">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded font-semibold border ${getBadgeColor()}`}>
            {getBadgeLabel()}
          </span>
        </div>
        {block.marks && (
          <span className="font-mono text-slate-500 font-medium">
            Weightage: {block.marks} {block.marks === 1 ? 'Mark' : 'Marks'}
          </span>
        )}
      </div>

      {/* Question Content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <HelpCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-sm font-semibold text-slate-800 leading-snug">
            <FormattedMathText text={block.question} />
          </div>
        </div>

        {/* If MCQ: Render Option Buttons */}
        {isMCQ && (
          <div className="mt-4 space-y-2 ml-7">
            {block.options!.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelected = selectedOption === optIdx;
              const isTargetCorrect = optIdx === block.correctOptionIndex;

              let optionStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700';

              if (selectedOption !== null) {
                if (isTargetCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-red-400 bg-red-50 text-red-900';
                } else {
                  optionStyle = 'border-slate-100 opacity-60 text-slate-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => setSelectedOption(optIdx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm flex items-center justify-between transition ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {selectedOption !== null && (
                    <div>
                      {isTargetCorrect && <CheckCircle2 size={16} className="text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle size={16} className="text-red-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* MCQ Instant Feedback */}
        {isMCQ && selectedOption !== null && (
          <div className={`mt-3 ml-7 p-3 rounded-lg text-xs leading-relaxed ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
            <div className="font-bold flex items-center gap-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Correct Answer!</span>
                </>
              ) : (
                <>
                  <XCircle size={14} className="text-red-600" />
                  <span>Incorrect. Correct answer is Option {String.fromCharCode(65 + block.correctOptionIndex!)}</span>
                </>
              )}
            </div>
            {block.explanation && (
              <p className="mt-1 text-slate-700">
                <strong>Explanation: </strong>
                <FormattedMathText text={block.explanation} />
              </p>
            )}
          </div>
        )}

        {/* Short / Long Answer / Viva Toggle */}
        {!isMCQ && (
          <div className="mt-4 ml-7">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              <span>{showAnswer ? 'Hide Model Solution' : 'View Model Exam Solution & Scoring Guide'}</span>
              {showAnswer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAnswer && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs text-indigo-700 uppercase tracking-wide">
                  <Award size={13} />
                  <span>Model Exam Solution</span>
                </div>
                <FormattedMathText text={block.answer} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
