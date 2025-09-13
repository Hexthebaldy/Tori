import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAppStore } from "../store";
import { Note } from "../types";
import { useAutoSave } from "../utils/useAutoSave";

interface NoteEditorProps {
  className?: string;
  onContentChange?: (content: string) => void;
  showWordCount?: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  className = "",
  onContentChange,
  showWordCount = false,
}) => {
  const { currentNote, updateNote, addNote, config } = useAppStore();
  const [content, setContent] = useState(currentNote?.content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Use auto-save hook
  useAutoSave(content, config.autoSaveDelay);

  // Create a new note if none exists
  useEffect(() => {
    if (!currentNote) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: "",
        tags: [],
        folder: "inbox",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addNote(newNote);
    }
  }, [currentNote, addNote]);

  // Sync content with current note
  useEffect(() => {
    setContent(currentNote?.content || "");
  }, [currentNote?.content]);

  // Auto-focus the editor
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setContent(newContent);

      // Update the note in store immediately for responsive UI
      if (currentNote) {
        updateNote({ content: newContent });
      }

      // Call external change handler
      onContentChange?.(newContent);
    },
    [currentNote, updateNote, onContentChange],
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            if (currentNote) {
              updateNote({ content });
              setLastSaved(new Date());
            }
            break;
          case "a":
            e.preventDefault();
            textareaRef.current?.select();
            break;
          default:
            break;
        }
      }
    },
    [content, currentNote, updateNote],
  );

  const getPlaceholderText = () => {
    const placeholders = [
      "What's on your mind?",
      "Start writing...",
      "Capture your thoughts...",
      "Your idea here...",
      "Begin typing...",
      "Write freely...",
      "Express yourself...",
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  const getWordCount = () => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const getCharCount = () => {
    return content.length;
  };

  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        className="note-editor focus:outline-none resize-none"
        placeholder={getPlaceholderText()}
        spellCheck={true}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Status bar */}
      {(showWordCount || config.autoSave) && (
        <div className="flex items-center justify-between px-8 py-2 text-xs text-gray-400 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {showWordCount && (
              <>
                <span>{getWordCount()} words</span>
                <span>{getCharCount()} characters</span>
              </>
            )}
            {config.autoSave && lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>

          {currentNote && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">•</span>
              <span>Note ID: {currentNote.id.slice(-8)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
