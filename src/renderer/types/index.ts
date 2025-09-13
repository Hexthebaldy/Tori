export interface Note {
  id: string;
  content: string;
  tags: string[];
  folder: string;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

export interface Folder {
  name: string;
  path: string;
  noteCount: number;
  summary?: string;
}

export interface AIAnalysisResult {
  folder: string;
  tags: string[];
  confidence?: number;
}

export interface AppConfig {
  apiKey: string;
  apiProvider: "deepseek" | "openai" | "anthropic" | "gemini";
  autoSave: boolean;
  autoSaveDelay: number;
}

export interface AppState {
  currentNote: Note | null;
  notes: Note[];
  folders: Folder[];
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
}
