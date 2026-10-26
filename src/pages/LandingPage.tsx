import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Download,
  Code2,
  Binary,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  HelpCircle,
  FileText,
  Workflow,
  Cpu,
  Target,
} from 'lucide-react';
import { SAMPLE_TREE_NOTES } from '../data/sampleTreeNotes';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-50/70 via-blue-50/30 to-transparent pointer-events-none -z-10 rounded-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold shadow-2xs">
            <GraduationCap size={14} className="text-indigo-600" />
            <span>Lumixora Notes AI • Production Academic Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Comprehensive, Exam-Ready <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
              AI Study Notes
            </span>{' '}
            for Any Syllabus.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Generate complete academic notes equipped with rendered Mermaid flowcharts, verified code, KaTeX math derivations, and university exam short & long answers.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/generate"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles size={16} />
              <span>Generate Notes Now</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/predict"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Target size={16} />
              <span>Exam Predictor & PYQ</span>
            </Link>

            <Link
              to={`/notes/${SAMPLE_TREE_NOTES.id}`}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <BookOpen size={16} className="text-indigo-600" />
              <span>Explore Benchmark</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>Strict Light Mode UI</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-indigo-600" />
              <span>Real Mermaid & KaTeX Rendering</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-indigo-600" />
              <span>Export Real DOCX & Print PDF</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-indigo-600" />
              <span>In-Browser Python Execution</span>
            </span>
          </div>
        </div>
      </section>

      {/* Featured Sample Highlight Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                  Curriculum Benchmark
                </span>
                <span className="text-xs text-slate-400">14 Verified Sections • 4,850 Words</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {SAMPLE_TREE_NOTES.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Pre-seeded standard for B.Tech Computer Science: Complete terminology, full/complete/perfect classifications, mathematical induction proofs ($n_0 = n_2 + 1$), BST search/deletion, AVL rotations, complexity tables, and C & Python code.
              </p>
            </div>

            <Link
              to={`/notes/${SAMPLE_TREE_NOTES.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 text-xs sm:text-sm transition shrink-0"
            >
              <span>Read Full Document</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Quick stats pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-lg font-bold text-slate-900">8</span>
              <p className="text-[11px] text-slate-500 font-medium">Mermaid Diagrams</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-lg font-bold text-indigo-600">4</span>
              <p className="text-[11px] text-slate-500 font-medium">Verified Code Implementations</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-lg font-bold text-emerald-600">100%</span>
              <p className="text-[11px] text-slate-500 font-medium">KaTeX Math & Derivations</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-lg font-bold text-purple-600">6</span>
              <p className="text-[11px] text-slate-500 font-medium">Exam QA & Viva Questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
            Engine Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for Academic Precision & Examination Success
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Workflow size={20} />
            </div>
            <h4 className="font-bold text-base text-slate-900">Real Mermaid Visual Generation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates genuine Mermaid diagrams (flowcharts, trees, state transitions, sequence charts) rendered live to SVG with zoom, fullscreen preview, and source editing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Binary size={20} />
            </div>
            <h4 className="font-bold text-base text-slate-900">KaTeX Mathematical Rigor</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Formats formulas, recurrence relations, proofs by mathematical induction, and asymptotic notations with precision rendering.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Code2 size={20} />
            </div>
            <h4 className="font-bold text-base text-slate-900">Live Code Execution Sandbox</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Syntax-highlighted Python, C, C++, and Java code blocks with side-by-side expected output and verified in-browser execution sandbox.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h4 className="font-bold text-base text-slate-900">University Exam Preparation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated short answers (2-marks), long derivations (10-marks), viva voce questions, and interactive MCQs with instant answer feedback.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Download size={20} />
            </div>
            <h4 className="font-bold text-base text-slate-900">True DOCX & PDF Export</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates genuine downloadable Microsoft Word (.docx) files with native tables and styles, alongside print-ready PDFs with cover pages and page breaks.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h4 className="font-bold text-base text-slate-900">PDF Syllabus & Lecture Extraction</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your university syllabus PDF or lecture slides to automatically extract units, learning outcomes, and synthesize tailored study guides.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-tr from-indigo-700 via-indigo-800 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to master your curriculum?
          </h3>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
            Input any university subject or chapter to generate textbook-grade study notes in seconds.
          </p>
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-800 font-bold rounded-xl hover:bg-indigo-50 shadow-md transition-all text-sm"
          >
            <Sparkles size={16} />
            <span>Start Generating Notes</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
