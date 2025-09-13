import React, { useState, useRef, KeyboardEvent } from 'react';

interface TagEditorProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const TagEditor: React.FC<TagEditorProps> = ({
  tags,
  onTagsChange,
  placeholder = "Add tags...",
  readOnly = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim().toLowerCase();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      // Remove # if user typed it
      const cleanTag = trimmedValue.startsWith('#') ? trimmedValue.slice(1) : trimmedValue;
      if (cleanTag) {
        onTagsChange([...tags, cleanTag]);
        setInputValue('');
      }
    }
  };

  const removeTag = (index: number) => {
    if (readOnly) return;
    const newTags = tags.filter((_, i) => i !== index);
    onTagsChange(newTags);
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag();
    }
  };

  return (
    <div className="flex items-center flex-wrap gap-2 min-h-[32px]">
      {/* Display existing tags */}
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${
            !readOnly ? 'cursor-pointer hover:bg-blue-200' : ''
          }`}
          onClick={() => !readOnly && removeTag(index)}
        >
          #{tag}
          {!readOnly && (
            <svg
              className="ml-1 w-3 h-3 hover:text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
      ))}

      {/* Input for adding new tags */}
      {!readOnly && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] border-none outline-none text-sm bg-transparent placeholder-gray-400"
        />
      )}

      {/* Show placeholder when no tags and readonly */}
      {readOnly && tags.length === 0 && (
        <span className="text-sm text-gray-400">{placeholder}</span>
      )}
    </div>
  );
};
