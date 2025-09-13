import { create } from 'zustand';
import { AppState, Note, Folder, AppConfig } from '../types';

interface AppStore extends AppState {
  // Actions
  setCurrentNote: (note: Note | null) => void;
  updateNote: (note: Partial<Note>) => void;
  addNote: (note: Note) => void;
  setConfig: (config: Partial<AppConfig>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: 'editor' | 'settings') => void;
}

const defaultConfig: AppConfig = {
  apiKey: '',
  apiProvider: 'openai',
  autoSave: true,
  autoSaveDelay: 3000,
};

export const useAppStore = create<AppStore & { currentView: string }>((set, get) => ({
  currentNote: null,
  notes: [],
  folders: [],
  config: defaultConfig,
  isLoading: false,
  error: null,
  currentView: 'editor',

  setCurrentNote: (note) => set({ currentNote: note }),

  updateNote: (noteUpdate) => {
    const current = get().currentNote;
    if (current) {
      set({
        currentNote: { ...current, ...noteUpdate, updatedAt: new Date() }
      });
    }
  },

  addNote: (note) => set((state) => ({
    notes: [...state.notes, note],
    currentNote: note
  })),

  setConfig: (configUpdate) => set((state) => ({
    config: { ...state.config, ...configUpdate }
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setView: (view) => set({ currentView: view }),
}));
