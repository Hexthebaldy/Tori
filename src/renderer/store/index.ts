import { create } from "zustand";
import { AppState, Note, Folder, AppConfig } from "../types";
import { storageService } from "../services/storageService";

interface AppStore extends AppState {
  // Actions
  setCurrentNote: (note: Note | null) => void;
  updateNote: (note: Partial<Note>) => void;
  addNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  setConfig: (config: Partial<AppConfig>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setView: (view: "editor" | "settings") => void;

  // Storage Actions
  loadData: () => Promise<void>;
  saveNote: (note: Note) => Promise<void>;
  saveCurrentNote: () => Promise<void>;
  searchNotes: (query: string) => Promise<Note[]>;
  loadNotesByFolder: (folderName: string) => Promise<void>;
  updateFolderCounts: () => Promise<void>;
}

const defaultConfig: AppConfig = {
  apiKey: "",
  apiProvider: "openai",
  autoSave: true,
  autoSaveDelay: 3000,
};

export const useAppStore = create<AppStore & { currentView: string }>(
  (set, get) => ({
    currentNote: null,
    notes: [],
    folders: [],
    config: defaultConfig,
    isLoading: false,
    error: null,
    currentView: "editor",

    setCurrentNote: (note) => set({ currentNote: note }),

    updateNote: (noteUpdate) => {
      const current = get().currentNote;
      if (current) {
        const updatedNote = {
          ...current,
          ...noteUpdate,
          updatedAt: new Date(),
        };
        set({ currentNote: updatedNote });

        // 自动保存更新的笔记
        if (get().config.autoSave) {
          get()
            .saveNote(updatedNote)
            .catch((error) => {
              console.error("Failed to auto-save note:", error);
              set({ error: "自动保存失败" });
            });
        }
      }
    },

    addNote: async (note) => {
      set((state) => ({
        notes: [...state.notes, note],
        currentNote: note,
      }));

      try {
        await get().saveNote(note);
        await get().updateFolderCounts();
      } catch (error) {
        console.error("Failed to save new note:", error);
        set({ error: "保存笔记失败" });
      }
    },

    deleteNote: async (noteId) => {
      try {
        set({ isLoading: true });

        // 从存储中删除
        await storageService.deleteNote(noteId);

        // 从状态中删除
        const state = get();
        const updatedNotes = state.notes.filter((note) => note.id !== noteId);
        const newCurrentNote =
          state.currentNote?.id === noteId ? null : state.currentNote;

        set({
          notes: updatedNotes,
          currentNote: newCurrentNote,
          isLoading: false,
        });

        // 更新文件夹计数
        await get().updateFolderCounts();
      } catch (error) {
        console.error("Failed to delete note:", error);
        set({ error: "删除笔记失败", isLoading: false });
      }
    },

    setConfig: async (configUpdate) => {
      const newConfig = { ...get().config, ...configUpdate };
      set({ config: newConfig });

      try {
        await storageService.saveConfig(newConfig);
      } catch (error) {
        console.error("Failed to save config:", error);
        set({ error: "保存配置失败" });
      }
    },

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    setView: (view) => set({ currentView: view }),

    // 从存储加载所有数据
    loadData: async () => {
      try {
        set({ isLoading: true });

        const [notes, folders, config] = await Promise.all([
          storageService.getNotes(),
          storageService.getFolders(),
          storageService.getConfig(),
        ]);

        set({
          notes,
          folders,
          config: { ...defaultConfig, ...config },
          isLoading: false,
          error: null,
        });

        // 更新文件夹计数
        await get().updateFolderCounts();
      } catch (error) {
        console.error("Failed to load data:", error);
        set({
          error: "加载数据失败",
          isLoading: false,
        });
      }
    },

    // 保存笔记到存储
    saveNote: async (note) => {
      try {
        await storageService.saveNote(note);

        // 更新内存中的笔记列表
        const state = get();
        const updatedNotes = state.notes.map((n) =>
          n.id === note.id ? note : n,
        );
        const isNewNote = !state.notes.find((n) => n.id === note.id);

        set({
          notes: isNewNote ? [...state.notes, note] : updatedNotes,
        });
      } catch (error) {
        console.error("Failed to save note:", error);
        throw error;
      }
    },

    // 保存当前笔记
    saveCurrentNote: async () => {
      const currentNote = get().currentNote;
      if (currentNote) {
        try {
          await get().saveNote(currentNote);
        } catch (error) {
          console.error("Failed to save current note:", error);
          set({ error: "保存当前笔记失败" });
        }
      }
    },

    // 搜索笔记
    searchNotes: async (query) => {
      try {
        return await storageService.searchNotes(query);
      } catch (error) {
        console.error("Failed to search notes:", error);
        set({ error: "搜索笔记失败" });
        return [];
      }
    },

    // 按文件夹加载笔记
    loadNotesByFolder: async (folderName) => {
      try {
        set({ isLoading: true });
        const notes = await storageService.getNotesByFolder(folderName);
        set({ notes, isLoading: false });
      } catch (error) {
        console.error("Failed to load notes by folder:", error);
        set({ error: "加载文件夹笔记失败", isLoading: false });
      }
    },

    // 更新文件夹笔记计数
    updateFolderCounts: async () => {
      try {
        await storageService.updateFolderNoteCount();
        const folders = await storageService.getFolders();
        set({ folders });
      } catch (error) {
        console.error("Failed to update folder counts:", error);
      }
    },
  }),
);
