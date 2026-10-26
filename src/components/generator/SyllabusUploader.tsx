import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, BookOpen } from 'lucide-react';
import { documentParser, ExtractedDocument } from '../../services/documentParser';

interface SyllabusUploaderProps {
  onExtracted: (doc: ExtractedDocument) => void;
  onClear: () => void;
}

export const SyllabusUploader: React.FC<SyllabusUploaderProps> = ({
  onExtracted,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedDoc, setExtractedDoc] = useState<ExtractedDocument | null>(null);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await documentParser.parseFile(file);
      setExtractedDoc(result);
      onExtracted(result);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setError(err?.message || 'Failed to extract text from document. Please ensure valid PDF or DOCX.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setExtractedDoc(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {!extractedDoc && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70 shadow-xs'
          }`}
        >
          {isLoading ? (
            <div className="py-4 space-y-2">
              <div className="w-8 h-8 mx-auto border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-700">Extracting syllabus & document contents...</p>
              <p className="text-xs text-slate-400">Parsing PDF text layers & identifying syllabus modules</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Upload University Syllabus or Study Material (Optional)
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Drag & drop your syllabus PDF, DOCX, or lecture notes. Lumixora will extract units, key topics, and terminology automatically.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">PDF</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">DOCX</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">TXT / MD</span>
                <span>• Max 25 MB</span>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted File Summary Card */}
      {extractedDoc && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 relative shadow-xs">
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
            title="Remove uploaded document"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={18} />
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{extractedDoc.fileName}</span>
                <span className="text-[10px] font-mono uppercase bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                  {extractedDoc.fileType}
                </span>
                <span className="text-xs text-slate-400">
                  ({(extractedDoc.fileSize / 1024).toFixed(1)} KB)
                </span>
              </div>

              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 size={13} />
                <span>Extracted {extractedDoc.extractedText.length.toLocaleString()} characters of reference material</span>
              </p>

              {/* Detected Units / Topics */}
              {extractedDoc.units.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-100/80">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <BookOpen size={12} className="text-indigo-600" />
                    <span>Identified Syllabus Modules:</span>
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {extractedDoc.units.map((u, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-white border border-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md font-medium"
                      >
                        {u.unitTitle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
