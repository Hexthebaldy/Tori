import React from 'react';

export const NoteEditorPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Note editor area */}
      <div className="flex-1 p-8">
        <textarea
          className="note-editor"
          placeholder="Start writing..."
          autoFocus
        />
      </div>

      {/* Tag area at bottom */}
      <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Tags:</span>
          <div className="flex-1 text-sm text-gray-700">
            {/* AI-generated tags will appear here */}
          </div>

          {/* AI Analysis button */}
          <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};
