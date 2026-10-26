import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  BookOpen,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  TrendingUp,
  Layers,
  Award,
  Clock,
  ArrowRight,
  GraduationCap,
  Percent,
  Flame,
  Check,
  Send,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  examPredictorService,
  ExamPredictionReport,
  PredictedQuestion,
  PYQQuestion,
  AnswerEvaluationResult,
} from '../services/examPredictorService';
import { FormattedMathText } from '../components/renderers/KaTeXViewer';
import { documentParser, ExtractedDocument } from '../services/documentParser';

export const ExamPredictorPage: React.FC = () => {
  const navigate = useNavigate();

  // Form Inputs
  const [subject, setSubject] = useState('Engineering Mathematics');
  const [courseCode, setCourseCode] = useState('21MAT31 / MA3151');
  const [targetChapter, setTargetChapter] = useState('All Units & High-Yield Chapters');
  const [university, setUniversity] = useState('State Technical University (JNTU / Anna / VTU / KTU)');
  const [targetExamYear, setTargetExamYear] = useState('2026 Upcoming Semester Exam');
  const [pastPaperText, setPastPaperText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Strategy Mode
  const [strategyMode, setStrategyMode] = useState<'all' | 'pass_guarantee' | 'ranker'>('all');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [report, setReport] = useState<ExamPredictionReport | null>(null);
  const [activeTab, setActiveTab] = useState<'predicted' | 'model_paper' | 'pyq' | 'weightage' | 'tips'>('predicted');
  const [selectedMarksFilter, setSelectedMarksFilter] = useState<'all' | '2' | '5' | '10'>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});

  // Practice / Self-Test Mode States
  const [practiceQuestionId, setPracticeQuestionId] = useState<string | null>(null);
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AnswerEvaluationResult | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const extracted: ExtractedDocument = await documentParser.parseFile(file);
      setPastPaperText(extracted.extractedText);
      setUploadedFileName(file.name);
      if (extracted.detectedSubject) {
        setSubject(extracted.detectedSubject);
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
    }
  };

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!subject.trim()) return;

    setIsLoading(true);
    setReport(null);
    setPracticeQuestionId(null);
    setEvaluationResult(null);

    try {
      const result = await examPredictorService.generatePrediction({
        subject,
        courseCode,
        targetChapter,
        university,
        targetExamYear,
        uploadedPyqText: pastPaperText,
      });

      setReport(result);
      if (result.predictedQuestions.length > 0) {
        setExpandedQuestionIds({ [result.predictedQuestions[0].id]: true });
      }

      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePresetSelect = (sub: string, code: string, chap: string) => {
    setSubject(sub);
    setCourseCode(code);
    setTargetChapter(chap);
  };

  const handleStartPractice = (qId: string) => {
    setPracticeQuestionId(qId);
    setStudentAnswerText('');
    setEvaluationResult(null);
  };

  const handleEvaluateAnswer = (question: PredictedQuestion) => {
    if (!studentAnswerText.trim()) return;
    setIsEvaluating(true);

    setTimeout(() => {
      const res = examPredictorService.evaluateStudentAnswer(question, studentAnswerText);
      setEvaluationResult(res);
      setIsEvaluating(false);

      if (res.percentage >= 70) {
        confetti({
          particleCount: 50,
          spread: 45,
          origin: { y: 0.7 },
        });
      }
    }, 600);
  };

  const handleExportDocx = async () => {
    if (!report) return;
    setIsExportingDocx(true);
    try {
      await examPredictorService.exportModelPaperToDocx(report);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Filter questions by marks & strategy
  const filteredPredictedQuestions = (report?.predictedQuestions || []).filter((q) => {
    // Strategy Filter
    if (strategyMode === 'pass_guarantee') {
      if (q.probabilityScore < 90) return false;
    } else if (strategyMode === 'ranker') {
      if (q.marks < 5) return false;
    }

    // Marks Filter
    if (selectedMarksFilter === 'all') return true;
    if (selectedMarksFilter === '2') return q.marks === 2;
    if (selectedMarksFilter === '5') return q.marks === 5;
    if (selectedMarksFilter === '10') return q.marks >= 10;
    return true;
  });

  const filteredPyqQuestions = (report?.pyqBank || []).filter((q) => {
    if (selectedYearFilter === 'all') return true;
    return q.appearedYears.includes(Number(selectedYearFilter));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
          <Target size={14} className="text-emerald-600" />
          <span>Advanced AI Question Predictor & Previous Question Papers (PYQ) Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          University Exam Question Predictor & PYQ Portal
        </h1>
        <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          Deep probabilistic recurrence modeling across 5-10 year university archives. Generates 100-mark model question papers, model solutions, examiner rubrics, and interactive answer evaluations.
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-10">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
          <BookOpen size={16} className="text-indigo-600" />
          <span>1. Configure Subject, University & Curriculum Details</span>
        </h2>

        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Subject / Discipline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Engineering Mathematics, Data Structures, Operating Systems"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Chapter / Target Units (Optional)
              </label>
              <input
                type="text"
                value={targetChapter}
                onChange={(e) => setTargetChapter(e.target.value)}
                placeholder="e.g. Unit 3: Trees & Dynamic Search / All Units"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University / Examination Board
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="State Technical University (JNTU / Anna / VTU / KTU)">
                  State Technical University (JNTU / Anna / VTU / KTU)
                </option>
                <option value="Anna University (R2021 / R2017 Regulations)">
                  Anna University (Chennai)
                </option>
                <option value="JNTU (Hyderabad / Kakinada / Anantapur - R20/R22)">
                  JNTU (Hyderabad / AP)
                </option>
                <option value="VTU (Belagavi - 2021/2022 Scheme)">VTU (Karnataka)</option>
                <option value="KTU (Kerala Technological University)">KTU (Kerala)</option>
                <option value="Mumbai University / Pune University (SPPU)">
                  Mumbai / Pune University
                </option>
                <option value="GATE / GRE / National Competitive Exam">GATE / National Exam</option>
                <option value="CBSE / ISC / State Board (Class 11-12)">CBSE / Class 12 Board</option>
                <option value="Autonomous University / Custom College">Custom Autonomous College</option>
              </select>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick Examination Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(
                    'Engineering Mathematics',
                    '21MAT31',
                    'Linear Algebra, Differential Equations & Transforms'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                📐 Engg Maths (Cayley-Hamilton, ODEs, Gauss)
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(
                    'Data Structures & Algorithms',
                    'CS3301',
                    'Unit 3: Trees (AVL, B-Trees) & Graphs'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                🌲 CS: Trees & Graphs (AVL 4-Rotations, Dijkstra)
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(
                    'Operating Systems',
                    'CS3451',
                    'Process Synchronization, Deadlock & Paging'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                ⚡ OS: Bankers Algorithm & Page Replacement
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect(
                    'Electrical Circuits & Networks',
                    'EE3201',
                    'Transient Analysis & Network Theorems'
                  )
                }
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                ⚡ Electrical: Thevenin & RLC Transients
              </button>
            </div>
          </div>

          {/* Optional Past Paper Upload or Paste */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Past Question Papers (PDF/DOCX) or Paste Past Exam Questions (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 cursor-pointer transition text-xs font-medium text-slate-600">
                <Upload size={16} className="text-indigo-600" />
                <span>
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Upload Past Papers (PDF/Word)'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>

              <textarea
                value={pastPaperText}
                onChange={(e) => setPastPaperText(e.target.value)}
                placeholder="Or paste questions from 2021, 2022, 2023, 2024 here..."
                rows={1}
                className="flex-2 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Predict Action Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Runs probabilistic recurrence modeling across 5-year university archives.
            </span>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Recurrence Trends...</span>
                </>
              ) : (
                <>
                  <Target size={16} />
                  <span>Predict Exam Questions & Analyze PYQs</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Report Results */}
      {report && (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                <Target size={13} className="text-emerald-600" />
                <span>Exam Yield Confidence</span>
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-600">
                  {report.predictedCoverageScore}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  High Precision
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Covers ~85/100 marks of question paper</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                <Sparkles size={13} className="text-indigo-600" />
                <span>Predicted Questions</span>
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-indigo-700">
                  {report.predictedQuestions.length}
                </span>
                <span className="text-[11px] font-medium text-slate-500">Curated Items</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">2M, 5M & 10M mark formats</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                <Clock size={13} className="text-blue-600" />
                <span>PYQ Archive Depth</span>
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-blue-600">5 Years</span>
                <span className="text-[11px] font-medium text-slate-500">(2019-2024)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {report.pyqBank.length} questions mapped in database
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                <Award size={13} className="text-amber-600" />
                <span>Target University</span>
              </span>
              <span className="text-sm font-bold text-slate-800 line-clamp-1">
                {report.university}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">{report.targetExam}</p>
            </div>
          </div>

          {/* Strategy Mode Filter Chips */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={14} className="text-amber-500" />
                <span>Exam Strategy Filter:</span>
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setStrategyMode('all')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                    strategyMode === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Questions
                </button>
                <button
                  type="button"
                  onClick={() => setStrategyMode('pass_guarantee')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                    strategyMode === 'pass_guarantee'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <ShieldAlert size={12} />
                  <span>Guaranteed Pass Mode (50+ M)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStrategyMode('ranker')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                    strategyMode === 'ranker'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  <Award size={12} />
                  <span>Distinction / 90%+ Ranker</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportDocx}
                disabled={isExportingDocx}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1.5 transition"
              >
                <Download size={13} />
                <span>{isExportingDocx ? 'Exporting...' : 'Export 100M Paper (.docx)'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('predicted')}
                className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'predicted'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Target size={16} />
                <span>Predicted Questions ({filteredPredictedQuestions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('model_paper')}
                className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'model_paper'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award size={16} />
                <span>🏛️ 100-Mark University Model Paper</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pyq')}
                className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'pyq'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText size={16} />
                <span>Past Papers Bank (PYQ)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('weightage')}
                className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'weightage'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp size={16} />
                <span>Unit Weightage Blueprint</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tips')}
                className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'tips'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap size={16} />
                <span>Examiner Scoring Secrets</span>
              </button>
            </div>

            {/* Quick Print CTA */}
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Printer size={13} />
              <span>Print Paper</span>
            </button>
          </div>

          {/* TAB 1: PREDICTED QUESTIONS */}
          {activeTab === 'predicted' && (
            <div className="space-y-6">
              {/* Filter Sub-bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Filter by Marks:</span>
                <div className="flex gap-1.5">
                  {(['all', '2', '5', '10'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMarksFilter(m)}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition ${
                        selectedMarksFilter === m
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {m === 'all' ? 'All Marks' : `${m} Marks`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                {filteredPredictedQuestions.map((q, idx) => {
                  const isExpanded = !!expandedQuestionIds[q.id];
                  const isPracticing = practiceQuestionId === q.id;

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-indigo-200"
                    >
                      {/* Card Header */}
                      <div className="p-5 sm:p-6 border-b border-slate-100">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs">
                              Q{idx + 1} • {q.marks} Marks
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {q.chapterOrUnit}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                              <Target size={12} className="text-emerald-600" />
                              <span>{q.probabilityScore}% Probability</span>
                            </span>
                            <span className="hidden sm:inline text-xs text-slate-400">
                              • {q.frequencyBadge}
                            </span>
                          </div>
                        </div>

                        {/* Question Text with KaTeX */}
                        <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed mb-3">
                          <FormattedMathText text={q.question} />
                        </div>

                        {/* Rationale Box */}
                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                          <AlertCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
                          <div>
                            <span className="font-bold">Why this is predicted: </span>
                            <span>{q.rationale}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="px-5 py-3 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleExpand(q.id)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1.5"
                          >
                            <span>{isExpanded ? 'Hide Model Answer & Rubric' : 'View Step-by-Step Model Answer & Scoring Rubric'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartPractice(q.id)}
                            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition flex items-center gap-1"
                          >
                            <span>✍️ Test Myself / Practice Answering</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            navigate('/generate');
                          }}
                          className="text-xs text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1 transition"
                        >
                          <span>Generate Notes for this Topic</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>

                      {/* Interactive Student Practice & Evaluation Drawer */}
                      {isPracticing && (
                        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span>✍️ Practice Answer Scratchpad (Max Marks: {q.marks})</span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => setPracticeQuestionId(null)}
                              className="text-xs text-slate-400 hover:text-slate-600"
                            >
                              Close Practice
                            </button>
                          </div>

                          <textarea
                            value={studentAnswerText}
                            onChange={(e) => setStudentAnswerText(e.target.value)}
                            placeholder="Type your derivation steps, formulas, axioms, or bullet points here to get scored by the AI Examiner..."
                            rows={4}
                            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                          />

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">
                              Evaluated against the examiner scoring rubric criteria.
                            </span>
                            <button
                              type="button"
                              disabled={isEvaluating || !studentAnswerText.trim()}
                              onClick={() => handleEvaluateAnswer(q)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                            >
                              {isEvaluating ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Evaluating Answer...</span>
                                </>
                              ) : (
                                <>
                                  <Send size={13} />
                                  <span>AI Evaluate My Answer</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Evaluation Results Card */}
                          {evaluationResult && (
                            <div className="mt-4 p-5 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-4 animate-fadeIn">
                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                <div>
                                  <span className="text-xs text-slate-400 font-semibold block">Evaluated Score:</span>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-emerald-600">
                                      {evaluationResult.score} / {evaluationResult.maxScore} Marks
                                    </span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      {evaluationResult.grade} ({evaluationResult.percentage}%)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Rubric Breakdown Table */}
                              <div>
                                <span className="text-xs font-bold text-slate-800 block mb-2">Examiner Milestone Scoring:</span>
                                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                                  <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                                      <tr>
                                        <th className="p-2">Criterion</th>
                                        <th className="p-2 w-20 text-center">Score</th>
                                        <th className="p-2">Evaluator Comment</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {evaluationResult.rubricBreakdown.map((r, rIdx) => (
                                        <tr key={rIdx}>
                                          <td className="p-2 font-medium text-slate-800">{r.criterion}</td>
                                          <td className="p-2 text-center font-bold text-emerald-700">
                                            {r.marksAwarded} / {r.maxMarks}
                                          </td>
                                          <td className="p-2 text-slate-600">{r.comment}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Advice */}
                              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2">
                                <Award size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold">Examiner Advice: </span>
                                  <span>{evaluationResult.examinerAdvice}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step-by-Step Model Answer & Scoring Rubric */}
                      {isExpanded && (
                        <div className="p-5 sm:p-6 bg-white border-t border-slate-100 space-y-5">
                          {q.stepByStepSolution && q.stepByStepSolution.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                                <span>Step-by-Step Exam Solution:</span>
                              </h4>
                              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                                {q.stepByStepSolution.map((step, sIdx) => (
                                  <li key={sIdx} className="leading-relaxed">
                                    <FormattedMathText text={step} />
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          <div>
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                              Full Model Answer:
                            </h4>
                            <div className="p-4 rounded-xl bg-indigo-50/30 border border-indigo-100 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                              <FormattedMathText text={q.modelAnswer} />
                            </div>
                          </div>

                          {q.scoringRubric && q.scoringRubric.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Award size={14} className="text-indigo-600" />
                                <span>Examiner Marking Rubric (Total: {q.marks} Marks):</span>
                              </h4>
                              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                                <table className="w-full text-left">
                                  <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                                    <tr>
                                      <th className="p-2.5">Grading Criteria / Milestone</th>
                                      <th className="p-2.5 w-24 text-right">Marks</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {q.scoringRubric.map((rubric, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-slate-50">
                                        <td className="p-2.5 text-slate-700">{rubric.criterion}</td>
                                        <td className="p-2.5 text-right font-bold text-indigo-700">
                                          +{rubric.marks} M
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: 100-MARK UNIVERSITY MODEL QUESTION PAPER */}
          {activeTab === 'model_paper' && (
            <div className="bg-white rounded-3xl border border-slate-300 shadow-sm p-6 sm:p-12 space-y-8 font-serif">
              {/* Paper Header */}
              <div className="text-center border-b-2 border-slate-900 pb-6 space-y-1.5">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  {report.modelQuestionPaper.universityHeader}
                </h2>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800">
                  {report.modelQuestionPaper.degreeName}
                </h3>
                <h4 className="text-sm font-bold text-indigo-700">
                  {report.modelQuestionPaper.courseCode} — {report.modelQuestionPaper.subjectTitle}
                </h4>
                <p className="text-xs text-slate-500 font-sans italic">
                  ({report.modelQuestionPaper.regulations})
                </p>
                <div className="pt-3 flex items-center justify-between text-xs sm:text-sm font-bold font-sans text-slate-800 border-t border-slate-200 mt-4">
                  <span>Time: {report.modelQuestionPaper.timeAllowed}</span>
                  <span className="italic uppercase">Answer ALL Questions</span>
                  <span>Maximum: {report.modelQuestionPaper.maxMarks} Marks</span>
                </div>
              </div>

              {/* PART A */}
              <div className="space-y-4">
                <div className="text-center font-bold text-sm sm:text-base border-b border-slate-200 pb-1 font-sans">
                  PART A — (10 × 2 = 20 Marks)
                </div>

                <div className="grid grid-cols-1 gap-3 font-sans text-xs sm:text-sm">
                  {report.modelQuestionPaper.partA.map((q) => (
                    <div key={q.qNum} className="flex items-start justify-between gap-3 py-1">
                      <div className="flex items-start gap-2">
                        <span className="font-bold">{q.qNum}.</span>
                        <FormattedMathText text={q.question} />
                      </div>
                      <span className="font-bold text-slate-500 shrink-0">({q.marks})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART B */}
              <div className="space-y-6 pt-4">
                <div className="text-center font-bold text-sm sm:text-base border-b border-slate-200 pb-1 font-sans">
                  PART B — (5 × 16 = 80 Marks)
                </div>

                <div className="space-y-6 font-sans text-xs sm:text-sm">
                  {report.modelQuestionPaper.partB.map((q) => (
                    <div key={q.qNum} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="font-bold">{q.optionA.label}</span>
                          <FormattedMathText text={q.optionA.question} />
                        </div>
                        <span className="font-bold text-indigo-700 shrink-0">({q.optionA.marks})</span>
                      </div>

                      <div className="text-center font-bold text-xs text-red-600 tracking-wider">
                        [ OR ]
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="font-bold">{q.optionB.label}</span>
                          <FormattedMathText text={q.optionB.question} />
                        </div>
                        <span className="font-bold text-indigo-700 shrink-0">({q.optionB.marks})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 font-sans">
                <div className="text-xs text-slate-500">
                  Formatted strictly according to State University / NBA curriculum regulations.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportDocx}
                    disabled={isExportingDocx}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Download size={14} />
                    <span>{isExportingDocx ? 'Generating DOCX...' : 'Download Full Paper (.docx)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Printer size={14} />
                    <span>Print Paper</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PYQ ARCHIVE BANK */}
          {activeTab === 'pyq' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Filter by Examination Year:</span>
                <div className="flex gap-1.5">
                  {['all', '2024', '2023', '2022', '2021'].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYearFilter(yr)}
                      className={`text-xs px-3 py-1 rounded-md font-medium transition ${
                        selectedYearFilter === yr
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {yr === 'all' ? 'All Years' : yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredPyqQuestions.map((pyq) => (
                  <div
                    key={pyq.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {pyq.marks} Marks • {pyq.questionType.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {pyq.chapterOrUnit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 font-medium">Appeared in:</span>
                        {pyq.appearedYears.map((yr) => (
                          <span
                            key={yr}
                            className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {yr}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      <FormattedMathText text={pyq.question} />
                    </h3>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">Standard University Model Answer:</span>
                      <FormattedMathText text={pyq.modelAnswer} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CHAPTER WEIGHTAGE BLUEPRINT */}
          {activeTab === 'weightage' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Syllabus Unit Weightage & Marks Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Expected mark allocation across syllabus units based on historical question paper trends.
                </p>
              </div>

              <div className="space-y-5">
                {report.highYieldTopics.map((topic, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">{topic.unit}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-700">
                          ~{topic.expectedMarks} Marks ({topic.weightagePercent}%)
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            topic.trend === 'critical'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {topic.trend}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"
                        style={{ width: `${topic.weightagePercent * 3.5}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-medium text-slate-700">{topic.topic}</span>
                      <span className="text-slate-500 italic">{topic.frequencyComment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EXAMINER SECRETS */}
          {activeTab === 'tips' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Examiner Insights & Scoring Rules
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct feedback from university paper evaluators on how to maximize your score.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {report.examTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 text-xs sm:text-sm text-slate-800 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
