import { useEffect, useRef } from "react";
import { useAppStore } from "../store";

export const useAutoSave = (content: string, delay: number = 3000) => {
  const currentNote = useAppStore((state) => state.currentNote);
  const updateNote = useAppStore((state) => state.updateNote);
  const saveNote = useAppStore((state) => state.saveNote);
  const config = useAppStore((state) => state.config);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!config.autoSave || !currentNote) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      if (currentNote.content !== content) {
        // 更新本地状态（立即响应）
        updateNote({ content });

        // 保存到存储（异步）
        try {
          const updatedNote = {
            ...currentNote,
            content,
            updatedAt: new Date(),
          };
          await saveNote(updatedNote);
          console.log("Auto-saved note:", currentNote.id);
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    }, delay);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, currentNote, updateNote, saveNote, config.autoSave, delay]);

  // Save immediately on window blur/close
  useEffect(() => {
    const handleWindowBlur = async () => {
      if (currentNote && currentNote.content !== content && content.trim()) {
        // 立即更新状态
        updateNote({ content });

        // 立即保存到存储
        try {
          const updatedNote = {
            ...currentNote,
            content,
            updatedAt: new Date(),
          };
          await saveNote(updatedNote);
          console.log("Saved on window blur:", currentNote.id);
        } catch (error) {
          console.error("Save on blur failed:", error);
        }
      }
    };

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (currentNote && currentNote.content !== content && content.trim()) {
        // 同步保存（阻塞）以确保数据不丢失
        updateNote({ content });

        try {
          const updatedNote = {
            ...currentNote,
            content,
            updatedAt: new Date(),
          };
          // 在页面卸载时使用同步方法（如果可能的话）
          await saveNote(updatedNote);
        } catch (error) {
          console.error("Save before unload failed:", error);
          // 如果保存失败，提示用户
          e.preventDefault();
          e.returnValue = "您的更改可能未保存。确定要离开吗？";
          return e.returnValue;
        }
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [content, currentNote, updateNote, saveNote]);
};
