import { Note, Folder, AppConfig } from '../types';

// 使用 window.require 来访问 electron-store（需要在 preload 中暴露）
declare global {
  interface Window {
    electronAPI: {
      store: {
        get: (key: string, defaultValue?: any) => any;
        set: (key: string, value: any) => void;
        delete: (key: string) => void;
        clear: () => void;
      };
    };
  }
}

class StorageService {
  private readonly NOTES_KEY = 'notes';
  private readonly FOLDERS_KEY = 'folders';
  private readonly CONFIG_KEY = 'config';

  // 获取所有笔记
  async getNotes(): Promise<Note[]> {
    try {
      const notes = window.electronAPI?.store?.get(this.NOTES_KEY, []) || [];
      return notes.map(this.parseNote);
    } catch (error) {
      console.error('Failed to get notes:', error);
      return [];
    }
  }

  // 保存笔记
  async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.getNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);

      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }

      window.electronAPI?.store?.set(this.NOTES_KEY, notes);
    } catch (error) {
      console.error('Failed to save note:', error);
      throw new Error('保存笔记失败');
    }
  }

  // 删除笔记
  async deleteNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const filteredNotes = notes.filter(note => note.id !== noteId);
      window.electronAPI?.store?.set(this.NOTES_KEY, filteredNotes);
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw new Error('删除笔记失败');
    }
  }

  // 获取单个笔记
  async getNote(noteId: string): Promise<Note | null> {
    try {
      const notes = await this.getNotes();
      return notes.find(note => note.id === noteId) || null;
    } catch (error) {
      console.error('Failed to get note:', error);
      return null;
    }
  }

  // 按文件夹获取笔记
  async getNotesByFolder(folderName: string): Promise<Note[]> {
    try {
      const notes = await this.getNotes();
      return notes.filter(note => note.folder === folderName);
    } catch (error) {
      console.error('Failed to get notes by folder:', error);
      return [];
    }
  }

  // 获取所有文件夹
  async getFolders(): Promise<Folder[]> {
    try {
      const folders = window.electronAPI?.store?.get(this.FOLDERS_KEY, []) || [];
      return folders;
    } catch (error) {
      console.error('Failed to get folders:', error);
      return [];
    }
  }

  // 保存文件夹
  async saveFolder(folder: Folder): Promise<void> {
    try {
      const folders = await this.getFolders();
      const existingIndex = folders.findIndex(f => f.name === folder.name);

      if (existingIndex >= 0) {
        folders[existingIndex] = folder;
      } else {
        folders.push(folder);
      }

      window.electronAPI?.store?.set(this.FOLDERS_KEY, folders);
    } catch (error) {
      console.error('Failed to save folder:', error);
      throw new Error('保存文件夹失败');
    }
  }

  // 删除文件夹
  async deleteFolder(folderName: string): Promise<void> {
    try {
      const folders = await this.getFolders();
      const filteredFolders = folders.filter(folder => folder.name !== folderName);
      window.electronAPI?.store?.set(this.FOLDERS_KEY, filteredFolders);
    } catch (error) {
      console.error('Failed to delete folder:', error);
      throw new Error('删除文件夹失败');
    }
  }

  // 更新文件夹笔记数量
  async updateFolderNoteCount(): Promise<void> {
    try {
      const [notes, folders] = await Promise.all([
        this.getNotes(),
        this.getFolders(),
      ]);

      // 计算每个文件夹的笔记数量
      const folderCounts = notes.reduce((acc, note) => {
        acc[note.folder] = (acc[note.folder] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // 更新文件夹信息
      const updatedFolders = folders.map(folder => ({
        ...folder,
        noteCount: folderCounts[folder.name] || 0,
      }));

      // 添加存在笔记但没有文件夹记录的文件夹
      Object.keys(folderCounts).forEach(folderName => {
        if (!folders.find(f => f.name === folderName)) {
          updatedFolders.push({
            name: folderName,
            path: folderName,
            noteCount: folderCounts[folderName],
          });
        }
      });

      window.electronAPI?.store?.set(this.FOLDERS_KEY, updatedFolders);
    } catch (error) {
      console.error('Failed to update folder note counts:', error);
    }
  }

  // 获取应用配置
  async getConfig(): Promise<Partial<AppConfig>> {
    try {
      return window.electronAPI?.store?.get(this.CONFIG_KEY, {}) || {};
    } catch (error) {
      console.error('Failed to get config:', error);
      return {};
    }
  }

  // 保存应用配置
  async saveConfig(config: Partial<AppConfig>): Promise<void> {
    try {
      const existingConfig = await this.getConfig();
      const updatedConfig = { ...existingConfig, ...config };
      window.electronAPI?.store?.set(this.CONFIG_KEY, updatedConfig);
    } catch (error) {
      console.error('Failed to save config:', error);
      throw new Error('保存配置失败');
    }
  }

  // 清空所有数据
  async clearAll(): Promise<void> {
    try {
      window.electronAPI?.store?.clear();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw new Error('清空数据失败');
    }
  }

  // 导出所有数据
  async exportData(): Promise<{ notes: Note[]; folders: Folder[]; config: Partial<AppConfig> }> {
    try {
      const [notes, folders, config] = await Promise.all([
        this.getNotes(),
        this.getFolders(),
        this.getConfig(),
      ]);

      return { notes, folders, config };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('导出数据失败');
    }
  }

  // 导入数据
  async importData(data: { notes?: Note[]; folders?: Folder[]; config?: Partial<AppConfig> }): Promise<void> {
    try {
      if (data.notes) {
        window.electronAPI?.store?.set(this.NOTES_KEY, data.notes);
      }
      if (data.folders) {
        window.electronAPI?.store?.set(this.FOLDERS_KEY, data.folders);
      }
      if (data.config) {
        await this.saveConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('导入数据失败');
    }
  }

  // 解析笔记（确保日期对象正确）
  private parseNote(note: any): Note {
    return {
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    };
  }

  // 搜索笔记
  async searchNotes(query: string): Promise<Note[]> {
    try {
      const notes = await this.getNotes();
      const lowercaseQuery = query.toLowerCase();

      return notes.filter(note =>
        note.content.toLowerCase().includes(lowercaseQuery) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        (note.title && note.title.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Failed to search notes:', error);
      return [];
    }
  }

  // 获取最近的笔记
  async getRecentNotes(limit: number = 10): Promise<Note[]> {
    try {
      const notes = await this.getNotes();
      return notes
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get recent notes:', error);
      return [];
    }
  }
}

// 单例模式导出
export const storageService = new StorageService();
