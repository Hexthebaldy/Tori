import { useEffect, useRef } from "react";
import { useAppStore } from "../store";

export const useAutoSave = (content: string, delay: number = 3000) => {
  const currentNote = useAppStore((state) => state.currentNote);
  const updateNote = useAppStore((state) => state.updateNote);
  const config = useAppStore((state) => state.config);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!config.autoSave || !currentNote) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      if (currentNote.content !== content) {
        updateNote({ content });
        console.log("Auto-saved note:", currentNote.id);
      }
    }, delay);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, currentNote, updateNote, config.autoSave, delay]);

  // Save immediately on window blur/close
  useEffect(() => {
    const handleWindowBlur = () => {
      if (currentNote && currentNote.content !== content && content.trim()) {
        updateNote({ content });
        console.log("Saved on window blur:", currentNote.id);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentNote && currentNote.content !== content && content.trim()) {
        updateNote({ content });
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [content, currentNote, updateNote]);
};
