import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap size={18} />
              </div>
              <span className="font-bold text-slate-900 text-base">Lumixora Notes AI</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Professional, AI-architected academic notes platform generating syllabus-aligned study guides, live Mermaid flowcharts, verified code, KaTeX math equations, and university exam solutions.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Strict Light Mode • Verified Pedagogical Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition">Home Overview</Link>
              </li>
              <li>
                <Link to="/generate" className="hover:text-indigo-600 transition">Notes Generator</Link>
              </li>
              <li>
                <Link to="/notes/tree-data-structures-btech" className="hover:text-indigo-600 transition">
                  Sample: B.Tech Trees
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-indigo-600 transition">Saved Notes Library</Link>
              </li>
            </ul>
          </div>

          {/* Standards */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Academic Formats</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>B.Tech / Engineering Syllabi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>GATE / Technical Tests</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>2, 5, 10 Mark Exam Models</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>DOCX & PDF Professional Export</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Lumixora Notes AI. All educational rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/settings" className="hover:text-slate-600 transition">AI Provider Settings</Link>
            <span>•</span>
            <span className="text-slate-500">Built for Students, Educators & Engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
