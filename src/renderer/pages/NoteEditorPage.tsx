import React, { useState } from "react";
import { NoteEditor } from "../components/NoteEditor";
import { TagEditor } from "../components/TagEditor";
import { useAppStore } from "../store";

export const NoteEditorPage: React.FC = () => {
  const { currentNote, updateNote, isLoading } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTagsChange = (tags: string[]) => {
    if (currentNote) {
      updateNote({ tags });
    }
  };

  const handleAnalyze = async () => {
    if (!currentNote?.content.trim()) {
      return;
    }

    setIsAnalyzing(true);
    try {
      // TODO: Integrate with AI analysis
      console.log("Analyzing content:", currentNote.content);

      // Simulate AI analysis for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock AI result
      const mockTags = ["ai", "note", "analysis"];
      updateNote({
        tags: [
          ...(currentNote.tags || []),
          ...mockTags.filter((tag) => !currentNote.tags?.includes(tag)),
        ],
      });
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze =
    currentNote?.content?.trim() && currentNote.content.length > 10;

  return (
    <div className="flex-1 flex flex-col">
      {/* Main editor area */}
      <NoteEditor showWordCount={true} className="flex-1" />

      {/* Tags and AI Analysis area */}
      <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm text-gray-500 flex-shrink-0">Tags:</span>
            <div className="flex-1 min-w-0">
              <TagEditor
                tags={currentNote?.tags || []}
                onTagsChange={handleTagsChange}
                placeholder="Add tags..."
              />
            </div>
          </div>

          {/* AI Analysis button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing || isLoading}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                canAnalyze && !isAnalyzing && !isLoading
                  ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={
                !canAnalyze
                  ? "Write at least 10 characters to analyze"
                  : "Analyze content with AI"
              }
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </div>

        {/* Analysis hint */}
        {currentNote?.content && currentNote.content.length < 10 && (
          <div className="mt-2 text-xs text-gray-400">
            Write a few more words to enable AI analysis
          </div>
        )}
      </div>
    </div>
  );
};
