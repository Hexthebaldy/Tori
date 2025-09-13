import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { Note } from '../types';

export const NoteEditor: React.FC = () => {
  const { currentNote, updateNote, addNote } = useAppStore();
  const [content, setContent] = useState(currentNote?.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Create a new note if none exists
  useEffect(() => {
    if (!currentNote) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: '',
        tags: [],
        folder: 'inbox',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addNote(newNote);
    }
  }, [currentNote, addNote]);

  // Sync content with current note
  useEffect(() => {
    setContent(currentNote?.content || '');
  }, [currentNote?.content]);

  // Auto-focus the editor
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Update the note in store immediately for responsive UI
    if (currentNote) {
      updateNote({ content: newContent });
    }
  };

  const getPlaceholderText = () => {
    const placeholders = [
      "What's on your mind?",
      "Start writing...",
      "Capture your thoughts...",
      "Your idea here...",
      "Begin typing..."
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  return (
    <div className="flex-1 flex flex-col">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        className="note-editor"
        placeholder={getPlaceholderText()}
        spellCheck={true}
        autoFocus
      />
    </div>
  );
};
