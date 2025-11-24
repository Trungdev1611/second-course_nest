'use client';

interface HighlightTextProps {
  text: string;
  highlight?: string[];
  className?: string;
}

/**
 * Component để render text có highlight từ Elasticsearch
 * Elasticsearch trả về highlight dạng: ['<mark>text</mark> other text']
 */
export function HighlightText({ text, highlight, className = '' }: HighlightTextProps) {
  // Nếu có highlight từ Elasticsearch, dùng highlight
  if (highlight && highlight.length > 0) {
    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: highlight[0] }}
      />
    );
  }

  // Nếu không có highlight, trả về text bình thường
  return <span className={className}>{text}</span>;
}

