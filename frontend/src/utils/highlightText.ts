/**
 * Utility function để highlight text dựa trên query
 * Tìm và wrap các từ khóa trùng với query bằng <mark> tag
 */
export function highlightText(text: string, query: string): string {
  if (!query || !text) {
    return text;
  }

  // Escape special regex characters trong query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Tạo regex để tìm các từ khóa (case-insensitive)
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
  // Replace các từ khóa trùng với <mark> tag
  return text.replace(regex, '<mark>$1</mark>');
}

