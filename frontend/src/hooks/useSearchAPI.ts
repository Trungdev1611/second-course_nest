import { searchApi, SearchParams } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

export default function useSearchAPI() {
  // Search with filters
  const useSearch = (params: SearchParams) => {
    return useQuery({
      queryKey: ['search', params],
      queryFn: async () => {
        const res = await searchApi.search(params);
        return res.data;
      },
      enabled: !!params.q || !!params.status || !!params.tags?.length,
    });
  };

  // Autocomplete suggestions with debounce
  const useSuggestions = (query: string, limit = 5) => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedQuery(query);
      }, 300);

      return () => clearTimeout(timer);
    }, [query]);

    return useQuery({
      queryKey: ['search-suggestions', debouncedQuery],
      queryFn: async () => {
        if (!debouncedQuery.trim()) return null;
        const res = await searchApi.getSuggestions({ q: debouncedQuery, limit });
        return res.data;
      },
      enabled: debouncedQuery.trim().length >= 2,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
  };

  // Advanced search
  const useAdvancedSearch = (params: SearchParams) => {
    return useQuery({
      queryKey: ['advanced-search', params],
      queryFn: async () => {
        const res = await searchApi.advancedSearch(params);
        return res.data;
      },
      enabled: !!(params.q || params.status || params.tags?.length),
    });
  };

  // Related posts
  const useRelatedPosts = (id: number) => {
    return useQuery({
      queryKey: ['related-posts-search', id],
      queryFn: async () => {
        const res = await searchApi.getRelatedPosts(id);
        return res.data;
      },
      enabled: !!id && !isNaN(id),
    });
  };

  return {
    useSearch,
    useSuggestions,
    useAdvancedSearch,
    useRelatedPosts,
  };
}

