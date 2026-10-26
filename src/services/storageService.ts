import { NoteDocument, AIProviderConfig, CloudStorageConfig } from '../types';
import { SAMPLE_TREE_NOTES } from '../data/sampleTreeNotes';

const STORAGE_KEY_NOTES = 'lumixora_saved_notes_v1';
const STORAGE_KEY_SETTINGS = 'lumixora_settings_v1';
const STORAGE_KEY_CLOUD = 'lumixora_cloud_v1';

export const storageService = {
  // Get all saved notes, seeding with sample if empty
  getAllNotes(): NoteDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTES);
      if (!data) {
        // Seed with sample tree notes
        const initial = [SAMPLE_TREE_NOTES];
        this.saveAllNotes(initial);
        return initial;
      }
      const parsed: NoteDocument[] = JSON.parse(data);
      // Ensure sample is present if list is empty
      if (parsed.length === 0) {
        const initial = [SAMPLE_TREE_NOTES];
        this.saveAllNotes(initial);
        return initial;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to read notes from localStorage', e);
      return [SAMPLE_TREE_NOTES];
    }
  },

  // Save full list
  saveAllNotes(notes: NoteDocument[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to write notes to localStorage', e);
    }
  },

  // Get single note by id
  getNoteById(id: string): NoteDocument | null {
    if (id === SAMPLE_TREE_NOTES.id) {
      // Always ensure verified sample notes are current
      return SAMPLE_TREE_NOTES;
    }
    const notes = this.getAllNotes();
    const found = notes.find((n) => n.id === id);
    return found || null;
  },

  // Save or update note
  saveNote(note: NoteDocument): void {
    const notes = this.getAllNotes();
    const index = notes.findIndex((n) => n.id === note.id);
    const updatedNote = {
      ...note,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      notes[index] = updatedNote;
    } else {
      notes.unshift(updatedNote);
    }
    this.saveAllNotes(notes);
  },

  // Duplicate note
  duplicateNote(id: string): NoteDocument | null {
    const original = this.getNoteById(id);
    if (!original) return null;

    const copy: NoteDocument = {
      ...JSON.parse(JSON.stringify(original)),
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const notes = this.getAllNotes();
    notes.unshift(copy);
    this.saveAllNotes(notes);
    return copy;
  },

  // Delete note
  deleteNote(id: string): boolean {
    const notes = this.getAllNotes();
    const filtered = notes.filter((n) => n.id !== id);
    this.saveAllNotes(filtered);
    return true;
  },

  // Settings
  getAISettings(): AIProviderConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read AI settings', e);
    }
    return {
      provider: 'lumixora-academic',
      modelName: 'gemini-1.5-flash',
      temperature: 0.3,
    };
  },

  saveAISettings(config: AIProviderConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save AI settings', e);
    }
  },

  getCloudConfig(): CloudStorageConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CLOUD);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read cloud config', e);
    }
    return {
      provider: 'local',
      connected: false,
    };
  },

  saveCloudConfig(config: CloudStorageConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY_CLOUD, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save cloud config', e);
    }
  },
};
