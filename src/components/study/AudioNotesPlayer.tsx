import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, SkipForward, SkipBack, Sparkles } from 'lucide-react';
import { NoteDocument } from '../../types';

interface AudioNotesPlayerProps {
  document: NoteDocument;
  activeSectionIndex: number;
  onSectionChange: (index: number) => void;
}

export const AudioNotesPlayer: React.FC<AudioNotesPlayerProps> = ({
  document,
  activeSectionIndex,
  onSectionChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Prepare clean text for reading
  const getSectionSpeechText = (idx: number): string => {
    const sec = document.sections[idx];
    if (!sec) return '';
    let speech = `${sec.title}. `;

    sec.blocks.forEach((b) => {
      if (b.type === 'paragraph') {
        // Clean out LaTeX math symbols for friendly speech
        const cleanText = b.content.replace(/\$([^\$]+)\$/g, ' mathematical expression $1 ');
        speech += cleanText + ' ';
      } else if (b.type === 'heading') {
        speech += b.text + '. ';
      } else if (b.type === 'callout') {
        speech += `${b.title}. ${b.content} `;
      } else if (b.type === 'list') {
        speech += b.items.join('. ') + '. ';
      }
    });

    return speech;
  };

  const speakSection = (idx: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const text = getSectionSpeechText(idx);
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick nice English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      // Auto proceed to next section
      if (idx + 1 < document.sections.length) {
        setCurrentSectionIdx(idx + 1);
        onSectionChange(idx + 1);
        speakSection(idx + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speakSection(currentSectionIdx);
      }
    }
  };

  const handleNextSection = () => {
    if (currentSectionIdx + 1 < document.sections.length) {
      const next = currentSectionIdx + 1;
      setCurrentSectionIdx(next);
      onSectionChange(next);
      if (isPlaying) speakSection(next);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIdx - 1 >= 0) {
      const prev = currentSectionIdx - 1;
      setCurrentSectionIdx(prev);
      onSectionChange(prev);
      if (isPlaying) speakSection(prev);
    }
  };

  const handleSpeedChange = (newRate: number) => {
    setPlaybackRate(newRate);
    if (isPlaying) {
      speakSection(currentSectionIdx);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50/90 via-white to-blue-50/90 border border-indigo-200/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${isPlaying ? 'bg-indigo-600 text-white animate-pulse' : 'bg-indigo-100 text-indigo-700'}`}>
          <Volume2 size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Audio Lecture Mode</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded uppercase">
              TTS Voice
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
            Now Reading: {document.sections[currentSectionIdx]?.title || 'Section'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevSection}
          disabled={currentSectionIdx === 0}
          title="Previous Section"
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40"
        >
          <SkipBack size={15} />
        </button>

        <button
          onClick={handleTogglePlay}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? 'Pause' : 'Listen to Notes'}</span>
        </button>

        <button
          onClick={handleNextSection}
          disabled={currentSectionIdx === document.sections.length - 1}
          title="Next Section"
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40"
        >
          <SkipForward size={15} />
        </button>

        {/* Speed toggle pills */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[10px] font-semibold text-slate-600 ml-2">
          {[1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`px-2 py-0.5 rounded-md transition ${playbackRate === rate ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
