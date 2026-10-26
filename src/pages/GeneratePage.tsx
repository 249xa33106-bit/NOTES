import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  Code2,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  Flame,
  FileText,
  Sliders,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  EducationLevel,
  NoteDepth,
  ExamFormat,
  ProgrammingLanguage,
  NoteGenerationRequest,
} from '../types';
import { aiProvider } from '../services/aiProvider';
import { storageService } from '../services/storageService';
import { SyllabusUploader } from '../components/generator/SyllabusUploader';
import { ExtractedDocument } from '../services/documentParser';

export const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form State
  const [subject, setSubject] = useState('Computer Science & Engineering');
  const [topic, setTopic] = useState('Graph Algorithms — Minimum Spanning Trees (Kruskal & Prim)');
  const [syllabusOrUnit, setSyllabusOrUnit] = useState('Unit 4: Advanced Graph Algorithms & Greedy Optimization');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('B.Tech / Undergraduate');
  const [depth, setDepth] = useState<NoteDepth>('detailed');
  const [language, setLanguage] = useState('English');
  const [examFormat, setExamFormat] = useState<ExamFormat>('Semester Exam Format (2, 5, 10 marks)');
  const [preferredLanguage, setPreferredLanguage] = useState<ProgrammingLanguage>('Python');

  // Handle URL query parameters for cross-portal prefill (e.g. from Exam Predictor)
  useEffect(() => {
    const subParam = searchParams.get('subject');
    const topParam = searchParams.get('topic');
    const unitParam = searchParams.get('unit');
    if (subParam) setSubject(subParam);
    if (topParam) setTopic(topParam);
    if (unitParam) setSyllabusOrUnit(unitParam);
  }, [searchParams]);

  // Toggles
  const [includeDiagrams, setIncludeDiagrams] = useState(true);
  const [includeCode, setIncludeCode] = useState(true);
  const [includePractical, setIncludePractical] = useState(true);
  const [includeExamQuestions, setIncludeExamQuestions] = useState(true);
  const [includeRevisionSheet, setIncludeRevisionSheet] = useState(true);

  // Upload / Source
  const [sourceMaterial, setSourceMaterial] = useState('');
  const [sourceFileName, setSourceFileName] = useState<string | undefined>(undefined);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSyllabusExtracted = (doc: ExtractedDocument) => {
    setSourceMaterial(doc.extractedText);
    setSourceFileName(doc.fileName);
    if (doc.detectedSubject) setSubject(doc.detectedSubject);
    if (doc.detectedTopics.length > 0) {
      setTopic(doc.detectedTopics[0]);
    }
    if (doc.units.length > 0) {
      setSyllabusOrUnit(doc.units[0].unitTitle);
    }
  };

  const handleClearSyllabus = () => {
    setSourceMaterial('');
    setSourceFileName(undefined);
  };

  const handleQuickTopic = (sub: string, top: string, unit: string, prog: ProgrammingLanguage) => {
    setSubject(sub);
    setTopic(top);
    setSyllabusOrUnit(unit);
    setPreferredLanguage(prog);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setErrorMessage('Please provide both Subject and Topic to generate notes.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setProgressPercent(10);
    setProgressMsg('Initiating Lumixora Academic Pipeline...');

    try {
      const request: NoteGenerationRequest = {
        subject,
        topic,
        syllabusOrUnit,
        educationLevel,
        depth,
        language,
        examFormat,
        preferredLanguage,
        includeDiagrams,
        includeCode,
        includePractical,
        includeExamQuestions,
        includeRevisionSheet,
        sourceMaterial,
        sourceFileName,
      };

      const doc = await aiProvider.generateNotes(request, (msg, pct) => {
        setProgressMsg(msg);
        setProgressPercent(pct);
      });

      storageService.saveNote(doc);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        navigate(`/notes/${doc.id}`);
      }, 700);
    } catch (err: any) {
      console.error('Notes generation error:', err);
      setErrorMessage(err?.message || 'Generation failed. Please verify settings and try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles size={13} />
          <span>Intelligent Curriculum-Aligned Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Generate Exam-Ready Study Notes
        </h1>
        <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Enter your topic or upload a syllabus to create mathematically verified notes with rendered Mermaid diagrams, code implementations, and university exam solutions.
        </p>
      </div>

      {/* Generation Progress Overlay */}
      {isGenerating && (
        <div className="my-8 p-6 sm:p-8 bg-white rounded-2xl border border-indigo-200 shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold">
            <span className="text-indigo-700 flex items-center gap-1.5">
              <Sparkles size={14} className="animate-spin text-indigo-600" />
              <span>Synthesizing Academic Notes</span>
            </span>
            <span className="font-mono text-slate-700">{progressPercent}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-600 text-center font-medium">
            {progressMsg}
          </p>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Core Subject & Topic */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen size={16} className="text-indigo-600" />
            <span>1. Topic & Subject Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Subject / Discipline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science & Engineering, Physics, Mathematics"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Topic / Concept <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Graph Algorithms — Kruskal & Prim MST"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              University Syllabus Unit / Module / Chapter Details (Optional)
            </label>
            <input
              type="text"
              value={syllabusOrUnit}
              onChange={(e) => setSyllabusOrUnit(e.target.value)}
              placeholder="e.g. Unit 3: Trees and Dynamic Search Structures (JNTU / Anna Univ / KTU / VTU)"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          {/* Quick topic presets */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick Suggestions (Click to autofill):
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Computer Science',
                    'Data Structures — Trees (BST, AVL, B-Trees)',
                    'Unit 3: Hierarchical Structures',
                    'Python'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                🌲 Trees & AVL (B.Tech)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Computer Science',
                    'Operating Systems — Process Scheduling & Deadlocks',
                    'Unit 2: CPU Scheduling & Synchronization',
                    'C'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                ⚡ OS Process & Deadlock
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Computer Science',
                    'DBMS — Relational Normalization (1NF, 2NF, 3NF, BCNF)',
                    'Unit 3: Database Design & Normal Forms',
                    'None (Theoretical / Non-Code)'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                🗄️ DBMS Normalization
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Mathematics',
                    'Engineering Mathematics — Linear Algebra & Eigenvalues',
                    'Unit 1: Matrix Theory & Diagonalization',
                    'None (Theoretical / Non-Code)'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                📐 Linear Algebra & Eigenvalues
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Electrical Engineering',
                    'Circuit Theory — Transient Analysis of RLC Networks',
                    'Unit 2: Second-Order Dynamic Circuits',
                    'None (Theoretical / Non-Code)'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                ⚡ Electrical — RLC Circuits
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Mechanical Engineering',
                    'Thermodynamics — Second Law, Carnot Cycles & Entropy',
                    'Unit 3: Heat Engines and Entropy Generation',
                    'None (Theoretical / Non-Code)'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                ⚙️ Mechanical — Thermodynamics
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Biological Sciences',
                    'Molecular Biology — DNA Replication & Transcription',
                    'Unit 1: Genetic Information Transfer',
                    'None (Theoretical / Non-Code)'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                🧬 Biology — DNA Replication
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickTopic(
                    'Economics & Business',
                    'Corporate Finance — Capital Budgeting, NPV & IRR',
                    'Unit 4: Investment Valuation Models',
                    'None (Theoretical / Non-Code)'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition border border-slate-200"
              >
                📈 Finance — NPV & Capital Budgeting
              </button>
            </div>
          </div>
        </div>

        {/* 2. Educational & Exam Criteria */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <GraduationCap size={16} className="text-indigo-600" />
            <span>2. Academic Level & Exam Format</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="High School (11th-12th)">High School (11th-12th)</option>
                <option value="B.Tech / Undergraduate">B.Tech / Undergraduate</option>
                <option value="Postgraduate / Master's">Postgraduate / Master's</option>
                <option value="Competitive Exams (GATE/GRE)">Competitive Exams (GATE/GRE)</option>
                <option value="Professional / Industry">Professional / Industry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Depth of Coverage</label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value as NoteDepth)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="quick">Quick Revision (Concise & High-Yield)</option>
                <option value="detailed">Detailed (Standard Textbook Rigor)</option>
                <option value="comprehensive">Comprehensive (Full Academic Depth)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Marks / Format</label>
              <select
                value={examFormat}
                onChange={(e) => setExamFormat(e.target.value as ExamFormat)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Semester Exam Format (2, 5, 10 marks)">
                  Semester Exam Format (2, 5, 10 marks)
                </option>
                <option value="2-Mark Short Conceptual">2-Mark Short Conceptual</option>
                <option value="5-Mark Analytical & Algorithmic">5-Mark Analytical & Algorithmic</option>
                <option value="10-16 Mark Comprehensive & Derivations">
                  10-16 Mark Long & Derivations
                </option>
                <option value="MCQ & Quiz Format">MCQ & Quiz Format</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Code Language (If Applicable)
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as ProgrammingLanguage)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Python">Python</option>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Rust">Rust</option>
                <option value="Go">Go</option>
                <option value="None (Theoretical / Non-Code)">None (Pure Theory / Non-Code)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Section Inclusion Toggles */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sliders size={16} className="text-indigo-600" />
            <span>3. Pedagogical Blocks & Section Controls</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={includeDiagrams}
                onChange={(e) => setIncludeDiagrams(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Mermaid Diagrams</span>
                <span className="text-[11px] text-slate-500">Flowcharts, trees & state models</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={includeCode}
                onChange={(e) => setIncludeCode(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Complete Code Programs</span>
                <span className="text-[11px] text-slate-500">Syntax highlighted with expected outputs</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={includeExamQuestions}
                onChange={(e) => setIncludeExamQuestions(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Exam Questions & Viva</span>
                <span className="text-[11px] text-slate-500">2, 5, 10 marks & interactive MCQs</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={includeRevisionSheet}
                onChange={(e) => setIncludeRevisionSheet(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Revision & Formula Sheet</span>
                <span className="text-[11px] text-slate-500">High-yield exam hall cheat sheet</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={includePractical}
                onChange={(e) => setIncludePractical(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Real-World Applications</span>
                <span className="text-[11px] text-slate-500">Engineering use cases & limitations</span>
              </div>
            </label>
          </div>
        </div>

        {/* 4. Upload Syllabus or Source Material */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText size={16} className="text-indigo-600" />
            <span>4. Syllabus Attachment or Reference Notes (Optional)</span>
          </h2>

          <SyllabusUploader
            onExtracted={handleSyllabusExtracted}
            onClear={handleClearSyllabus}
            onSelectUnit={(unitTitle, topics) => {
              setSyllabusOrUnit(unitTitle);
              if (topics && topics.length > 0) {
                setTopic(topics[0]);
              }
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Generates fully typed, structured notes with KaTeX equations & Mermaid diagrams.
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Sparkles size={18} />
            <span>Generate Study Notes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
