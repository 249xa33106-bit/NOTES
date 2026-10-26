import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Download,
  Share2,
  Copy,
  Check,
  Edit3,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  CopyCheck,
  Search,
  FileText,
  FileCode,
  Printer,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  History,
  X,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  Network,
  RotateCw,
  Award,
  Bot,
  Volume2,
} from 'lucide-react';
import { NoteDocument, NoteSection, ContentBlock } from '../types';
import { storageService } from '../services/storageService';
import { exportService } from '../services/exportService';
import { aiProvider } from '../services/aiProvider';
import { ContentBlockRenderer } from '../components/renderers/ContentBlockRenderer';
import { SAMPLE_TREE_NOTES } from '../data/sampleTreeNotes';
import { AudioNotesPlayer } from '../components/study/AudioNotesPlayer';
import { FlashcardsModal } from '../components/study/FlashcardsModal';
import { MindmapViewer } from '../components/study/MindmapViewer';
import { MockExamSimulator } from '../components/study/MockExamSimulator';
import { AITutorDrawer } from '../components/study/AITutorDrawer';

export const NotesReaderEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [document, setDocument] = useState<NoteDocument | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [activeAudioIndex, setActiveAudioIndex] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<string>('Saved');

  // Advanced Study Feature Modals
  const [showFlashcards, setShowFlashcards] = useState<boolean>(false);
  const [showMindmap, setShowMindmap] = useState<boolean>(false);
  const [showMockExam, setShowMockExam] = useState<boolean>(false);
  const [showAITutor, setShowAITutor] = useState<boolean>(false);

  // Edit / Regenerate Modals
  const [showRegenSectionModal, setShowRegenSectionModal] = useState<NoteSection | null>(null);
  const [regenPrompt, setRegenPrompt] = useState<string>('');
  const [isRegeneratingSection, setIsRegeneratingSection] = useState<boolean>(false);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  // Load document
  useEffect(() => {
    if (!id) return;
    const doc = storageService.getNoteById(id);
    if (doc) {
      setDocument(doc);
      if (doc.sections.length > 0) {
        setActiveSectionId(doc.sections[0].id);
      }
    } else {
      setDocument(SAMPLE_TREE_NOTES);
      setActiveSectionId(SAMPLE_TREE_NOTES.sections[0].id);
    }
  }, [id]);

  // Autosave handler
  const handleUpdateDocument = (updatedDoc: NoteDocument) => {
    setDocument(updatedDoc);
    setAutosaveStatus('Saving...');
    storageService.saveNote(updatedDoc);
    setTimeout(() => {
      setAutosaveStatus('Saved');
    }, 600);
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNotification(label);
      setTimeout(() => setCopiedNotification(null), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleExportDocx = async () => {
    if (!document) return;
    setIsExporting(true);
    const success = await exportService.exportToDocx(document);
    setIsExporting(false);
    if (success) {
      setCopiedNotification('DOCX downloaded successfully!');
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  const handleExportMarkdown = () => {
    if (!document) return;
    exportService.exportToMarkdown(document);
    setCopiedNotification('Markdown (.md) downloaded!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handlePrintPdf = () => {
    exportService.triggerPrintPdf();
  };

  const handleDuplicate = () => {
    if (!document) return;
    const copy = storageService.duplicateNote(document.id);
    if (copy) {
      navigate(`/notes/${copy.id}`);
    }
  };

  const handleDelete = () => {
    if (!document) return;
    if (window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
      storageService.deleteNote(document.id);
      navigate('/library');
    }
  };

  const handleRename = () => {
    if (!document || !newTitle.trim()) return;
    const updated = { ...document, title: newTitle.trim() };
    handleUpdateDocument(updated);
    setShowRenameModal(false);
  };

  // Section level operations
  const handleRegenerateSectionSubmit = async () => {
    if (!document || !showRegenSectionModal) return;
    setIsRegeneratingSection(true);

    try {
      const enrichedSection = await aiProvider.regenerateSection(
        showRegenSectionModal,
        regenPrompt,
        document.topic
      );

      const updatedSections = document.sections.map((s) =>
        s.id === enrichedSection.id ? enrichedSection : s
      );

      const updatedDoc = {
        ...document,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      };

      handleUpdateDocument(updatedDoc);
      setShowRegenSectionModal(null);
      setRegenPrompt('');
    } catch (err) {
      console.error('Failed to regenerate section', err);
    } finally {
      setIsRegeneratingSection(false);
    }
  };

  const handleUpdateSectionTitle = (sectionId: string, newTitle: string) => {
    if (!document) return;
    const updatedSections = document.sections.map((s) =>
      s.id === sectionId ? { ...s, title: newTitle } : s
    );
    const updatedToc = document.tableOfContents.map((t) =>
      t.id === sectionId ? { ...t, title: newTitle } : t
    );
    handleUpdateDocument({
      ...document,
      sections: updatedSections,
      tableOfContents: updatedToc,
    });
  };

  const handleAddParagraphBlock = (sectionId: string) => {
    if (!document) return;
    const newBlock: ContentBlock = {
      id: 'b-' + Date.now(),
      type: 'paragraph',
      content: 'New paragraph notes content. Click in edit mode to modify text.',
    };
    const updatedSections = document.sections.map((s) => {
      if (s.id === sectionId) {
        return { ...s, blocks: [...s.blocks, newBlock] };
      }
      return s;
    });
    handleUpdateDocument({ ...document, sections: updatedSections });
  };

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-700">Loading structured study notes...</p>
      </div>
    );
  }

  // Filter sections by search query
  const filteredSections = document.sections.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (sec.title.toLowerCase().includes(q)) return true;
    return sec.blocks.some((b) => {
      if (b.type === 'paragraph') return b.content.toLowerCase().includes(q);
      if (b.type === 'heading') return b.text.toLowerCase().includes(q);
      if (b.type === 'callout') return b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q);
      if (b.type === 'examQuestion') return b.question.toLowerCase().includes(q) || b.answer.toLowerCase().includes(q);
      return false;
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Copied Notification Toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-modal text-xs font-semibold flex items-center gap-2 border border-slate-700 transition">
          <Check size={15} className="text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Top Notes Control Bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="Toggle Table of Contents"
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-md sm:max-w-xl">
                  {document.title}
                </h1>
                <button
                  onClick={() => {
                    setNewTitle(document.title);
                    setShowRenameModal(true);
                  }}
                  className="text-slate-400 hover:text-slate-700 transition"
                  title="Rename Title"
                >
                  <Edit3 size={13} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                  {document.subject}
                </span>
                <span>•</span>
                <span>{document.educationLevel}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck size={11} /> {autosaveStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Advanced Study Mode Pills */}
            <button
              onClick={() => setShowMindmap(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 text-xs font-bold transition"
              title="Explore visual knowledge graph and concept mindmap"
            >
              <Network size={14} className="text-indigo-600" />
              <span>Mindmap</span>
            </button>

            <button
              onClick={() => setShowFlashcards(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50/70 hover:bg-purple-100/70 text-purple-700 text-xs font-bold transition"
              title="Active recall 3D flashcards mode"
            >
              <RotateCw size={14} className="text-purple-600" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setShowMockExam(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 text-xs font-bold transition"
              title="Take a timed mock exam with automated grading"
            >
              <Award size={14} className="text-emerald-600" />
              <span>Mock Exam</span>
            </button>

            {/* Edit Mode Toggle */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isEditMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isEditMode ? <Eye size={14} /> : <Edit3 size={14} />}
              <span>{isEditMode ? 'Read Mode' : 'Edit Mode'}</span>
            </button>

            {/* Export Dropdown Group */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <button
                onClick={handleExportDocx}
                disabled={isExporting}
                title="Download formatted Microsoft Word document (.docx)"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border-r border-slate-200 transition"
              >
                <FileText size={14} className="text-blue-600" />
                <span>DOCX</span>
              </button>

              <button
                onClick={handlePrintPdf}
                title="Print or Save as PDF"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 border-r border-slate-200 transition"
              >
                <Printer size={14} className="text-indigo-600" />
                <span>PDF</span>
              </button>

              <button
                onClick={handleExportMarkdown}
                title="Export as Raw Markdown"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <FileCode size={14} className="text-slate-600" />
                <span>MD</span>
              </button>
            </div>

            {/* Duplicate */}
            <button
              onClick={handleDuplicate}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              title="Duplicate Notes"
            >
              <CopyCheck size={16} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition"
              title="Delete Notes"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex gap-8">
        {/* Table of Contents Sticky Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 shrink-0 hidden lg:block no-print">
            <div className="sticky top-32 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4 max-h-[calc(100vh-160px)] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={14} className="text-indigo-600" />
                  <span>Table of Contents</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {document.sections.length} Sections
                </span>
              </div>

              {/* In-notes Search */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inside notes..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* TOC Link List */}
              <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                {filteredSections.map((sec, idx) => {
                  const isActive = activeSectionId === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => {
                        setActiveSectionId(sec.id);
                        setActiveAudioIndex(idx);
                      }}
                      className={`block px-3 py-2 rounded-lg text-xs leading-snug transition ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-bold border-l-2 border-indigo-600 pl-2.5'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {sec.title}
                    </a>
                  );
                })}
              </div>

              {/* Metadata badge box */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Word Count:</span>
                  <span className="font-mono font-medium text-slate-700">
                    ~{document.metadata.wordCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mermaid Diagrams:</span>
                  <span className="font-mono font-medium text-slate-700">
                    {document.metadata.diagramCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Engine:</span>
                  <span className="font-mono font-medium text-indigo-600 truncate max-w-[140px]">
                    {document.metadata.aiModel || 'Lumixora AI'}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Notes Reading & Editing Canvas */}
        <main className="flex-1 min-w-0 notes-container space-y-6">
          {/* Audio Lecture Player Component */}
          <AudioNotesPlayer
            document={document}
            activeSectionIndex={activeAudioIndex}
            onSectionChange={(newIdx) => {
              setActiveAudioIndex(newIdx);
              if (document.sections[newIdx]) {
                setActiveSectionId(document.sections[newIdx].id);
              }
            }}
          />

          {/* Document Cover Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs print-cover page-break-inside-avoid">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {document.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {document.educationLevel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Target: {document.examFormat}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Depth: {document.depth.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {document.title}
            </h1>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Last revised {new Date(document.updatedAt).toLocaleTimeString()}</span>
              </div>

              {document.metadata.sourceFileName && (
                <div className="text-indigo-600 font-medium">
                  Source: {document.metadata.sourceFileName}
                </div>
              )}
            </div>
          </div>

          {/* Render Sections */}
          <div className="space-y-8">
            {filteredSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs page-break-inside-avoid transition hover:border-slate-300"
              >
                {/* Section Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                      className="text-lg sm:text-xl font-bold text-slate-900 border-b border-indigo-400 pb-1 focus:outline-none flex-1"
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {section.title}
                    </h2>
                  )}

                  {/* Section action tools */}
                  <div className="flex items-center gap-1.5 no-print">
                    <button
                      onClick={() =>
                        handleCopyText(
                          section.blocks
                            .map((b) => (b.type === 'paragraph' ? b.content : ''))
                            .join('\n\n'),
                          'Section text copied!'
                        )
                      }
                      title="Copy section text"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-xs flex items-center gap-1"
                    >
                      <Copy size={13} />
                      <span className="hidden sm:inline">Copy</span>
                    </button>

                    <button
                      onClick={() => setShowRegenSectionModal(section)}
                      title="Regenerate this section with AI"
                      className="p-1.5 rounded-lg border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition text-xs flex items-center gap-1 font-medium"
                    >
                      <RefreshCw size={13} />
                      <span className="hidden sm:inline">Regenerate</span>
                    </button>

                    {isEditMode && (
                      <button
                        onClick={() => handleAddParagraphBlock(section.id)}
                        className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition text-xs flex items-center gap-1 font-medium"
                      >
                        <Plus size={13} />
                        <span>Add Block</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Content Blocks */}
                <div className="space-y-4">
                  {section.blocks.map((block) => (
                    <ContentBlockRenderer
                      key={block.id}
                      block={block}
                      isEditing={isEditMode}
                      onUpdateBlock={(updatedBlock) => {
                        const updatedSections = document.sections.map((s) => {
                          if (s.id === section.id) {
                            return {
                              ...s,
                              blocks: s.blocks.map((b) =>
                                b.id === updatedBlock.id ? updatedBlock : b
                              ),
                            };
                          }
                          return s;
                        });
                        handleUpdateDocument({ ...document, sections: updatedSections });
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>

      {/* Floating AI Tutor Copilot Launcher */}
      <button
        onClick={() => setShowAITutor(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-tr from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-xs sm:text-sm no-print"
      >
        <Bot size={18} />
        <span>Ask AI Tutor</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      </button>

      {/* Flashcards Mode Modal */}
      {showFlashcards && (
        <FlashcardsModal
          document={document}
          onClose={() => setShowFlashcards(false)}
        />
      )}

      {/* Mindmap / Knowledge Graph Modal */}
      {showMindmap && (
        <MindmapViewer
          document={document}
          onSelectSection={(secId) => {
            setActiveSectionId(secId);
            const el = window.document.getElementById(secId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onClose={() => setShowMindmap(false)}
        />
      )}

      {/* Mock Exam Simulator Modal */}
      {showMockExam && (
        <MockExamSimulator
          document={document}
          onClose={() => setShowMockExam(false)}
        />
      )}

      {/* AI Tutor Drawer */}
      <AITutorDrawer
        document={document}
        isOpen={showAITutor}
        onClose={() => setShowAITutor(false)}
      />

      {/* Section Regeneration Modal */}
      {showRegenSectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                <span>Regenerate Section</span>
              </h3>
              <button
                onClick={() => setShowRegenSectionModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1">
                Target Section:
              </span>
              <p className="text-sm font-bold text-indigo-900 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                {showRegenSectionModal.title}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Instructions for Regeneration (Optional):
              </label>
              <textarea
                value={regenPrompt}
                onChange={(e) => setRegenPrompt(e.target.value)}
                placeholder="e.g. Add 3 more real-world examples, elaborate on the mathematical proof, or add a comparison table."
                rows={3}
                className="w-full p-3 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRegenSectionModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerateSectionSubmit}
                disabled={isRegeneratingSection}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={isRegeneratingSection ? 'animate-spin' : ''}
                />
                <span>{isRegeneratingSection ? 'Regenerating...' : 'Regenerate Section'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Document Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Rename Document</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                Save Title
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
