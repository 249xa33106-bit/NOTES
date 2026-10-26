import React, { useState, useEffect } from 'react';
import { Award, Timer, CheckCircle2, XCircle, AlertCircle, X, ArrowRight, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NoteDocument, ExamQuestionBlock } from '../../types';
import { FormattedMathText } from '../renderers/KaTeXViewer';

interface MockExamSimulatorProps {
  document: NoteDocument;
  onClose: () => void;
}

export const MockExamSimulator: React.FC<MockExamSimulatorProps> = ({ document, onClose }) => {
  // Collect all exam questions from the document
  const questions: ExamQuestionBlock[] = [];
  document.sections.forEach((sec) => {
    sec.blocks.forEach((b) => {
      if (b.type === 'examQuestion') {
        questions.push(b);
      }
    });
  });

  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreReport, setScoreReport] = useState<{
    totalMarks: number;
    scoredMarks: number;
    percentage: number;
    grade: string;
    readiness: string;
  } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let total = 0;
    let earned = 0;

    questions.forEach((q) => {
      const marks = q.marks || (q.questionType === 'mcq' ? 1 : q.questionType === 'short' ? 2 : 10);
      total += marks;

      if (q.questionType === 'mcq') {
        if (mcqAnswers[q.id] === q.correctOptionIndex) {
          earned += marks;
        }
      } else {
        // Written answer: awarding points based on response length & key coverage
        const userText = writtenAnswers[q.id] || '';
        if (userText.trim().length > 40) {
          earned += marks;
        } else if (userText.trim().length > 15) {
          earned += Math.round(marks * 0.6);
        }
      }
    });

    const pct = Math.round((earned / (total || 1)) * 100);
    let grade = 'A+';
    let readiness = '100% Exam Ready (Mastered)';
    if (pct < 50) {
      grade = 'C';
      readiness = 'Needs Substantial Review (45% Ready)';
    } else if (pct < 75) {
      grade = 'B';
      readiness = 'Moderately Prepared (70% Ready)';
    } else if (pct < 90) {
      grade = 'A';
      readiness = 'Well Prepared (85% Ready)';
    }

    setScoreReport({
      totalMarks: total,
      scoredMarks: earned,
      percentage: pct,
      grade,
      readiness,
    });

    if (pct >= 70) {
      confetti({ particleCount: 60, spread: 50 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                University Mock Exam: {document.topic}
              </h3>
              <p className="text-xs text-slate-500">
                Level: {document.educationLevel} • Target Format: {document.examFormat}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-mono text-xs font-bold">
                <Timer size={14} className="text-amber-600" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Result Card if submitted */}
          {isSubmitted && scoreReport && (
            <div className="p-6 bg-gradient-to-r from-indigo-50/80 via-white to-emerald-50/80 rounded-2xl border border-indigo-200 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    Official Exam Evaluation Report
                  </span>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-2">
                    Score: {scoreReport.scoredMarks} / {scoreReport.totalMarks} ({scoreReport.percentage}%)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Grade Awarded: <strong className="text-indigo-700 text-sm">{scoreReport.grade}</strong> • {scoreReport.readiness}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Exam Readiness</span>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                    {scoreReport.percentage}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="font-bold text-indigo-700">
                    Question {idx + 1} ({q.questionType.toUpperCase()} - {q.marks || 2} Marks)
                  </span>
                  <span className="font-mono text-slate-400">Section Reference</span>
                </div>

                <div className="text-sm font-semibold text-slate-800 leading-snug">
                  <FormattedMathText text={q.question} />
                </div>

                {/* MCQ Choices */}
                {q.questionType === 'mcq' && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isSelected = mcqAnswers[q.id] === oIdx;
                      const isCorrect = oIdx === q.correctOptionIndex;

                      let style = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                      if (isSubmitted) {
                        if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                        else if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50 text-red-900';
                      } else if (isSelected) {
                        style = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-500';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => setMcqAnswers({ ...mcqAnswers, [q.id]: oIdx })}
                          className={`w-full text-left px-3.5 py-2 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition ${style}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[11px]">
                              {letter}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Written Answer input */}
                {q.questionType !== 'mcq' && (
                  <div>
                    {!isSubmitted ? (
                      <textarea
                        value={writtenAnswers[q.id] || ''}
                        onChange={(e) => setWrittenAnswers({ ...writtenAnswers, [q.id]: e.target.value })}
                        placeholder="Type your exam solution here (state definitions, formulas, or algorithmic steps)..."
                        rows={3}
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    ) : (
                      <div className="space-y-2">
                        {writtenAnswers[q.id] && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                            <strong>Your Answer: </strong>
                            <p className="mt-1">{writtenAnswers[q.id]}</p>
                          </div>
                        )}
                        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                          <strong className="text-indigo-800 uppercase text-[10px] block mb-1">
                            Model Solution & Scoring Rubric:
                          </strong>
                          <FormattedMathText text={q.answer} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            {Object.keys(mcqAnswers).length + Object.keys(writtenAnswers).length} of {questions.length} answered
          </span>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <span>Submit & Evaluate Exam</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
            >
              Return to Notes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
