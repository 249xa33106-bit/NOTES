import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderArchive,
  Search,
  Plus,
  BookOpen,
  Calendar,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Printer,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { NoteDocument } from '../types';
import { storageService } from '../services/storageService';
import { exportService } from '../services/exportService';

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<NoteDocument[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const all = storageService.getAllNotes();
    setNotes(all);
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(`Delete "${title}"?`)) {
      storageService.deleteNote(id);
      loadNotes();
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const copy = storageService.duplicateNote(id);
    if (copy) {
      loadNotes();
    }
  };

  const handleDownloadDocx = async (doc: NoteDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await exportService.exportToDocx(doc);
  };

  // Subjects list for filter
  const subjects = ['All', ...Array.from(new Set(notes.map((n) => n.subject)))];

  const filtered = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.topic.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Notes Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your saved academic notes, curriculum modules, and revision guides.
          </p>
        </div>

        <Link
          to="/generate"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
        >
          <Plus size={16} />
          <span>Generate New Notes</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Notes</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{notes.length}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Subjects Covered</span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{subjects.length - 1}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Diagrams</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {notes.reduce((acc, n) => acc + (n.metadata?.diagramCount || 0), 0)}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Saved Offline</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">100%</div>
        </div>
      </div>

      {/* Search & Subject Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by topic or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <BookOpen size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No notes found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or generate new notes for your curriculum.
          </p>
          <Link
            to="/generate"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
          >
            <Sparkles size={14} />
            <span>Generate Notes Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/notes/${note.id}`)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-xs hover:shadow-card transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 truncate max-w-[200px]">
                    {note.subject}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {note.depth}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {note.topic} • {note.educationLevel}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDownloadDocx(note, e)}
                    title="Export DOCX"
                    className="p-1 hover:text-indigo-600 transition"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(note.id, e)}
                    title="Duplicate note"
                    className="p-1 hover:text-slate-700 transition"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(note.id, note.title, e)}
                    title="Delete note"
                    className="p-1 hover:text-red-600 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
