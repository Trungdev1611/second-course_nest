'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { List } from 'antd';
import { AntdCard } from '@/components/common';
import useSearchAPI from '@/hooks/useSearchAPI';
import { highlightText } from '@/utils/highlightText';

interface SearchSuggestionsProps {
  query: string;
  onSelect?: (suggestion: string) => void;
  visible?: boolean;
  className?: string;
}

export function SearchSuggestions({
  query,
  onSelect,
  visible = true,
  className = '',
}: SearchSuggestionsProps) {
  const { useSuggestions } = useSearchAPI();
  const { data: suggestionsData, isLoading } = useSuggestions(query);
  
  // Backend trả về array của options từ completion suggester
  // Format: [{ text: '...', _id: '...', _source: {...} }, ...]
  // Hoặc có thể là array of strings
  let suggestions: any[] = [];
  
  if (suggestionsData?.data) {
    if (Array.isArray(suggestionsData.data)) {
      suggestions = suggestionsData.data;
    } else if (suggestionsData.data.suggestions) {
      suggestions = suggestionsData.data.suggestions;
    }
  }

  if (!visible || !query.trim() || query.length < 2) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`absolute z-50 w-full mt-1 ${className}`}>
        <AntdCard className="shadow-lg">
          <div className="text-center py-4 text-slate-500">Đang tìm kiếm...</div>
        </AntdCard>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`absolute z-50 w-full mt-1 ${className}`}>
      <AntdCard className="shadow-lg max-h-80 overflow-y-auto">
        <List
          dataSource={suggestions}
          renderItem={(item: any) => {
            // Handle different response formats - ưu tiên title
            let title: string;
            let id: string | number | undefined;
            
            if (typeof item === 'string') {
              title = item;
            } else if (item.title) {
              // Ưu tiên title field
              title = item.title;
              id = item.id || item._id;
            } else if (item.text) {
              // Nếu không có title thì dùng text
              title = item.text;
              id = item.id || item._id;
            } else if (item._source?.title) {
              // Fallback về _source.title
              title = item._source.title;
              id = item._id || item._source.id;
            } else {
              title = String(item);
            }
            
            const href = id ? `/posts/${id}` : `/search?q=${encodeURIComponent(title)}`;
            
            // Highlight text dựa trên query
            const highlightedTitle = highlightText(title, query);
            
            return (
              <List.Item
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 rounded transition-colors"
                onClick={() => onSelect?.(title)}
              >
                <div className="w-full" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">🔍</span>
                    <span 
                      className="text-slate-900 dark:text-slate-100 flex-1"
                      dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </AntdCard>
    </div>
  );
}

