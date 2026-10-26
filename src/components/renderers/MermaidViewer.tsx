import React, { useEffect, useState, useRef, useId } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Code, Maximize2, X, RefreshCw, AlertCircle } from 'lucide-react';

interface MermaidViewerProps {
  source: string;
  caption?: string;
  description?: string;
  onUpdateSource?: (newSource: string) => void;
  allowEdit?: boolean;
}

// Ensure mermaid is initialized once
let mermaidInitialized = false;
const initMermaid = () => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      suppressErrorRendering: true,
      theme: 'neutral',
      themeVariables: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        primaryColor: '#e0e7ff',
        primaryBorderColor: '#4f46e5',
        primaryTextColor: '#1e1b4b',
        lineColor: '#6366f1',
        secondaryColor: '#f8fafc',
        tertiaryColor: '#f1f5f9',
      },
    });
    mermaidInitialized = true;
  }
};

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  source,
  caption,
  description,
  onUpdateSource,
  allowEdit = true,
}) => {
  const uniqueId = useId().replace(/:/g, '_');
  const [currentCode, setCurrentCode] = useState(source);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    setCurrentCode(source);
  }, [source]);

  const renderDiagram = async (codeToRender: string) => {
    initMermaid();
    setIsRendering(true);
    setError(null);

    const cleanCode = codeToRender.trim();
    if (!cleanCode) {
      setIsRendering(false);
      return;
    }

    const renderId = `m_${uniqueId}_${Date.now()}`;
    // Clean any prior DOM artifact
    try {
      const prior = document.getElementById(renderId);
      if (prior) prior.remove();
      const priorErr = document.getElementById(`d${renderId}`);
      if (priorErr) priorErr.remove();
    } catch (e) {}

    try {
      const { svg } = await mermaid.render(renderId, cleanCode);
      setSvgHtml(svg);
      setError(null);
    } catch (err: any) {
      console.warn('Mermaid render error:', err);
      // Clean residual error element injected by mermaid into document.body
      try {
        const injected = document.getElementById(`d${renderId}`);
        if (injected) injected.remove();
      } catch (e) {}
      setError(err?.message || 'Invalid diagram syntax. Please check Mermaid code.');
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    renderDiagram(currentCode);
  }, [currentCode]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.4));
  const handleResetZoom = () => setZoom(1);

  const handleCopySvg = async () => {
    if (!svgHtml) return;
    try {
      await navigator.clipboard.writeText(svgHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy SVG', e);
    }
  };

  const handleApplyEdit = () => {
    if (onUpdateSource) {
      onUpdateSource(currentCode);
    }
    renderDiagram(currentCode);
    setIsEditing(false);
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:border-slate-300">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            Mermaid Diagram
          </span>
          {caption && <span className="font-semibold text-slate-700 truncate max-w-sm">{caption}</span>}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Controls */}
          <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-xs px-1">
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              className="p-1 text-slate-500 hover:text-slate-800 transition"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-1 text-[11px] font-mono text-slate-500 min-w-[32px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              className="p-1 text-slate-500 hover:text-slate-800 transition"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1 text-slate-400 hover:text-slate-700 transition border-l border-slate-100"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Edit code toggle */}
          {allowEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition ${
                isEditing
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Code size={13} />
              <span>{isEditing ? 'Hide Code' : 'Edit Source'}</span>
            </button>
          )}

          {/* Copy SVG */}
          <button
            onClick={handleCopySvg}
            title="Copy rendered SVG markup"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition text-xs font-medium"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'SVG'}</span>
          </button>

          {/* Fullscreen Preview */}
          <button
            onClick={() => setIsFullscreen(true)}
            title="Fullscreen Modal"
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Editor drawer */}
      {isEditing && (
        <div className="p-4 bg-slate-900 border-b border-slate-800 text-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Mermaid Diagram Source</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentCode(source)}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
              >
                <RefreshCw size={12} /> Reset to Original
              </button>
              <button
                onClick={handleApplyEdit}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition"
              >
                Apply & Render
              </button>
            </div>
          </div>
          <textarea
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            rows={7}
            className="w-full font-mono text-xs bg-slate-950 text-emerald-400 p-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            spellCheck={false}
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-amber-800">Diagram Syntax Warning</div>
            <p className="mt-0.5 font-mono text-[11px] text-amber-700">{error}</p>
            <button
              onClick={() => {
                setCurrentCode(source);
                renderDiagram(source);
              }}
              className="mt-2 text-indigo-700 font-semibold hover:underline"
            >
              Restore verified diagram
            </button>
          </div>
        </div>
      )}

      {/* Diagram Canvas */}
      <div className="p-6 overflow-auto max-h-[550px] flex items-center justify-center bg-white min-h-[180px]">
        {isRendering && !svgHtml ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <RefreshCw size={14} className="animate-spin text-indigo-600" />
            <span>Rendering diagram...</span>
          </div>
        ) : (
          <div
            className="transition-transform duration-150 origin-center max-w-full"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        )}
      </div>

      {/* Caption & Description */}
      {(caption || description) && (
        <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
          {caption && <span className="font-semibold text-slate-700 mr-2">{caption}:</span>}
          {description && <span>{description}</span>}
        </div>
      )}

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                {caption || 'Diagram Preview'}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 border border-slate-200 rounded hover:bg-slate-50"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-mono">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 border border-slate-200 rounded hover:bg-slate-50"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-8 overflow-auto flex-1 flex items-center justify-center bg-slate-50">
              <div
                style={{ transform: `scale(${zoom * 1.2})` }}
                className="transition-transform origin-center"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
