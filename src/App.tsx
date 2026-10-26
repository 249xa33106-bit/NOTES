import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { GeneratePage } from './pages/GeneratePage';
import { ExamPredictorPage } from './pages/ExamPredictorPage';
import { NotesReaderEditor } from './pages/NotesReaderEditor';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';
import { storageService } from './services/storageService';

export const App: React.FC = () => {
  // Ensure default sample notes are seeded on first launch
  useEffect(() => {
    storageService.getAllNotes();
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/predict" element={<ExamPredictorPage />} />
            <Route path="/notes/:id" element={<NotesReaderEditor />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
