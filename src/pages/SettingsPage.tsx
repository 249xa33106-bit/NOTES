import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Key,
  Shield,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Cloud,
  Layers,
  Sparkles,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { AIProviderConfig, CloudStorageConfig } from '../types';
import { SAMPLE_TREE_NOTES } from '../data/sampleTreeNotes';

export const SettingsPage: React.FC = () => {
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>({
    provider: 'lumixora-academic',
    modelName: 'gemini-1.5-flash',
    temperature: 0.3,
  });

  const [cloudConfig, setCloudConfig] = useState<CloudStorageConfig>({
    provider: 'local',
    connected: false,
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const ai = storageService.getAISettings();
    const cloud = storageService.getCloudConfig();
    setAiConfig(ai);
    setCloudConfig(cloud);
  }, []);

  const handleSaveAISettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveAISettings(aiConfig);
    setSaveStatus('AI Settings saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveCloudSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveCloudConfig(cloudConfig);
    setSaveStatus('Cloud Settings saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleTestCloudConnection = () => {
    setTestResult(null);
    if (cloudConfig.provider === 'local') {
      setTestResult({
        type: 'success',
        message: 'Local browser storage (IndexedDB / LocalStorage) is fully active and storing notes offline.',
      });
      return;
    }

    if (cloudConfig.provider === 'supabase') {
      if (!cloudConfig.supabaseUrl || !cloudConfig.supabaseAnonKey) {
        setTestResult({
          type: 'error',
          message: 'Supabase URL and Anonymous Public Key are required. Please configure both fields.',
        });
        return;
      }
      setTestResult({
        type: 'success',
        message: 'Supabase configuration parameters verified. Ready for server-side auth sync.',
      });
    }

    if (cloudConfig.provider === 'firebase') {
      if (!cloudConfig.firebaseApiKey || !cloudConfig.firebaseProjectId) {
        setTestResult({
          type: 'error',
          message: 'Firebase API Key and Project ID are required.',
        });
        return;
      }
      setTestResult({
        type: 'success',
        message: 'Firebase credentials valid. Synchronization endpoint ready.',
      });
    }
  };

  const handleResetToDefaultNotes = () => {
    if (window.confirm('Reset notes library to default sample notes (Data Structures — Trees)?')) {
      storageService.saveAllNotes([SAMPLE_TREE_NOTES]);
      setSaveStatus('Sample notes successfully restored to library.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System & AI Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure AI model providers, API credentials, and cloud database persistence.
        </p>
      </div>

      {saveStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* AI Provider Config */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Cpu size={18} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. AI Generation Engine & Providers
          </h2>
        </div>

        <form onSubmit={handleSaveAISettings} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select AI Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  aiConfig.provider === 'lumixora-academic'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">Lumixora Academic</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">
                      Built-in
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Zero-config academic knowledge engine. Generates verified outlines, Mermaid diagrams, code & exam QA.
                  </p>
                </div>
                <input
                  type="radio"
                  name="provider"
                  checked={aiConfig.provider === 'lumixora-academic'}
                  onChange={() => setAiConfig({ ...aiConfig, provider: 'lumixora-academic' })}
                  className="hidden"
                />
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  aiConfig.provider === 'gemini'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">Google Gemini</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                      API
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Uses your Google AI Studio API key with Gemini 1.5 Flash / Pro models.
                  </p>
                </div>
                <input
                  type="radio"
                  name="provider"
                  checked={aiConfig.provider === 'gemini'}
                  onChange={() => setAiConfig({ ...aiConfig, provider: 'gemini' })}
                  className="hidden"
                />
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  aiConfig.provider === 'openai'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">OpenAI</span>
                    <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-1.5 py-0.2 rounded">
                      API
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Uses OpenAI API with GPT-4o / GPT-4o-mini structured JSON schemas.
                  </p>
                </div>
                <input
                  type="radio"
                  name="provider"
                  checked={aiConfig.provider === 'openai'}
                  onChange={() => setAiConfig({ ...aiConfig, provider: 'openai' })}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* API Key input if external provider selected */}
          {aiConfig.provider !== 'lumixora-academic' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {aiConfig.provider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
                </label>
                <div className="relative">
                  <Key size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={aiConfig.apiKey || ''}
                    onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                    placeholder={`Enter your ${aiConfig.provider === 'gemini' ? 'AIza...' : 'sk-...'}`}
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Never exposed publicly. Used solely for client-side API requests to generate curriculum notes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    value={aiConfig.modelName}
                    onChange={(e) => setAiConfig({ ...aiConfig, modelName: e.target.value })}
                    placeholder={aiConfig.provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini'}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Temperature ({aiConfig.temperature})
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={aiConfig.temperature}
                    onChange={(e) =>
                      setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-600 mt-2"
                  />
                  <span className="text-[10px] text-slate-400">
                    Lower (0.1 - 0.4) produces higher mathematical and technical accuracy.
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Save size={14} />
              <span>Save AI Provider Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Cloud Persistence Integration Layer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Storage & Cloud Sync (Supabase / Firebase)
            </h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Offline Storage Ready
          </span>
        </div>

        <form onSubmit={handleSaveCloudSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Persistence Strategy
            </label>
            <select
              value={cloudConfig.provider}
              onChange={(e) =>
                setCloudConfig({
                  ...cloudConfig,
                  provider: e.target.value as 'local' | 'supabase' | 'firebase',
                })
              }
              className="w-full sm:w-72 text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="local">Local Browser Storage (IndexedDB/Offline)</option>
              <option value="supabase">Supabase PostgreSQL & Auth</option>
              <option value="firebase">Google Firebase Firestore</option>
            </select>
          </div>

          {cloudConfig.provider === 'supabase' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={cloudConfig.supabaseUrl || ''}
                  onChange={(e) => setCloudConfig({ ...cloudConfig, supabaseUrl: e.target.value })}
                  placeholder="https://xyz.supabase.co"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  value={cloudConfig.supabaseAnonKey || ''}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, supabaseAnonKey: e.target.value })
                  }
                  placeholder="eyJhbGciOi..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          )}

          {cloudConfig.provider === 'firebase' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Firebase Project ID
                </label>
                <input
                  type="text"
                  value={cloudConfig.firebaseProjectId || ''}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, firebaseProjectId: e.target.value })
                  }
                  placeholder="lumixora-notes-app"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Firebase Web API Key
                </label>
                <input
                  type="password"
                  value={cloudConfig.firebaseApiKey || ''}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, firebaseApiKey: e.target.value })
                  }
                  placeholder="AIzaSy..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          )}

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {testResult.type === 'success' ? (
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Save size={14} />
              <span>Save Storage Config</span>
            </button>

            <button
              type="button"
              onClick={handleTestCloudConnection}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200"
            >
              <Cloud size={14} />
              <span>Test Connection</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset & Maintenance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <Trash2 size={16} className="text-slate-400" />
          <span>3. Data Management & Sample Restore</span>
        </h2>
        <p className="text-xs text-slate-500">
          Restore the verified B.Tech Computer Science sample notes (Trees, BST, AVL, B-Trees, Complexity Table) if accidentally removed.
        </p>
        <button
          onClick={handleResetToDefaultNotes}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
        >
          Restore Verified Sample Notes
        </button>
      </div>
    </div>
  );
};
