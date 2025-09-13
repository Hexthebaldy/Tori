export const textUtils = {
  // Get word count
  getWordCount: (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  // Get character count (excluding spaces)
  getCharacterCount: (text: string): number => {
    return text.replace(/\s/g, '').length;
  },

  // Get character count (including spaces)
  getTotalCharacterCount: (text: string): number => {
    return text.length;
  },

  // Get reading time estimate (average 200 words per minute)
  getReadingTime: (text: string): number => {
    const wordCount = textUtils.getWordCount(text);
    return Math.ceil(wordCount / 200);
  },

  // Extract potential title from content (first line or first sentence)
  extractTitle: (content: string): string => {
    if (!content.trim()) return '';

    // Try first line
    const firstLine = content.split('\n')[0].trim();
    if (firstLine.length > 0 && firstLine.length <= 100) {
      return firstLine;
    }

    // Try first sentence
    const firstSentence = content.split(/[.!?]/)[0].trim();
    if (firstSentence.length > 0 && firstSentence.length <= 100) {
      return firstSentence;
    }

    // Fallback: truncate content
    return content.substring(0, 50).trim() + (content.length > 50 ? '...' : '');
  },

  // Format content for preview (remove extra whitespace)
  formatPreview: (content: string, maxLength: number = 200): string => {
    return content
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  },

  // Check if content has enough substance for AI analysis
  hasEnoughContent: (content: string, minWords: number = 5): boolean => {
    return textUtils.getWordCount(content) >= minWords;
  }
};
