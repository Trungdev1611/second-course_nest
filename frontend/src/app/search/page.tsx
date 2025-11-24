'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Row, Col, Input, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import {
  AntdCard,
  AntdButton,
  AntdEmpty,
  AntdTag,
  LazyLoad,
} from '@/components/common';
import { SearchFilters, SearchSuggestions } from '@/components/search';
import { PostItem } from '@/components/posts';
import useSearchAPI from '@/hooks/useSearchAPI';
import useTagAPI from '@/hooks/useTagAPI';
import { SearchParams } from '@/lib/api';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial values from URL
  const initialQuery = searchParams.get('q') || '';
  const initialStatus = searchParams.get('status') || undefined;
  const initialTags = searchParams.get('tags')?.split(',') || [];
  const initialSort = (searchParams.get('sort') as SearchParams['sort']) || 'relevance';
  const initialPage = parseInt(searchParams.get('page') || '1');

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<Partial<SearchParams>>({
    q: initialQuery,
    status: initialStatus as any,
    tags: initialTags.length > 0 ? initialTags : undefined,
    sort: initialSort,
    page: initialPage,
    per_page: 12,
  });
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filtersVisible, setFiltersVisible] = useState(true);
  // If there's initial query from URL, user has already searched
  const [isSearching, setIsSearching] = useState(!!initialQuery);

  const { useSearch, useSuggestions } = useSearchAPI();
  const { useTags } = useTagAPI();

  // Fetch tags for filter
  const { data: tagsData } = useTags({ per_page: 100 });
  const availableTags = tagsData?.data || [];

  // Fetch suggestions only when typing (not searching)
  const { data: suggestionsData } = useSuggestions(
    searchQuery,
    8 // Show more suggestions
  );

  // Fetch search results only when user has performed a search (enter or click)
  const { data: searchData, isLoading } = useSearch({
    ...filters,
    page: currentPage,
  });

  const posts = searchData?.data || [];
  const totalPosts = searchData?.meta?.total || 0;
  const pageSize = filters.per_page || 12;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.status) params.set('status', filters.status);
    if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.sort) params.set('sort', filters.sort);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `/search?${params.toString()}` : '/search';
    router.replace(newUrl, { scroll: false });
  }, [filters, currentPage, router]);

  // Handle search - only called when user presses Enter or clicks search button
  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    const newFilters = {
      ...filters,
      q: trimmedValue || undefined,
      page: 1,
    };
    setFilters(newFilters);
    setCurrentPage(1);
    setShowSuggestions(false);
    setIsSearching(true); // Mark that user has performed a search
  };

  // Handle filter change
  const handleFiltersChange = (newFilters: Partial<SearchParams>) => {
    setFilters({
      ...filters,
      ...newFilters,
      page: 1, // Reset to page 1 when filters change
    });
    setCurrentPage(1);
    // If filters are applied, mark as searching
    if (newFilters.status || newFilters.tags?.length) {
      setIsSearching(true);
    }
  };

  // Handle suggestion select
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  // Handle input change - only update query, don't search yet
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Show suggestions when typing (at least 2 characters)
    if (value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-suggestions-container') && !target.closest('.ant-input-search')) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  // Only show results if user has performed a search (not just typing)
  const hasActiveSearch = isSearching && (filters.q || filters.status || filters.tags?.length);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-slate-100">
              Tìm kiếm bài viết
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Tận dụng sức mạnh của Elasticsearch để tìm kiếm chính xác
            </p>
          </div>
          <AntdButton
            icon={<FilterOutlined />}
            onClick={() => setFiltersVisible(!filtersVisible)}
            variant={filtersVisible ? 'primary' : 'secondary'}
          >
            {filtersVisible ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </AntdButton>
        </div>

        {/* Search Bar with Suggestions */}
        <div className="relative max-w-3xl search-suggestions-container">
          <Input.Search
            size="large"
            placeholder="Tìm kiếm theo tiêu đề, nội dung, tags, tác giả..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            className="w-full"
            onPressEnter={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
          />
          {showSuggestions && searchQuery.length >= 2 && (
            <SearchSuggestions
              query={searchQuery}
              onSelect={handleSuggestionSelect}
              visible={showSuggestions}
            />
          )}
        </div>
      </div>

      {/* Filters */}
      {filtersVisible && (
        <AntdCard className="bg-slate-50 dark:bg-slate-800">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableTags={availableTags}
          />
        </AntdCard>
      )}

      {/* Search Results */}
      {hasActiveSearch ? (
        <div className="space-y-6">
          {/* Results Info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-slate-600 dark:text-slate-400">
                {isLoading ? (
                  'Đang tìm kiếm...'
                ) : totalPosts > 0 ? (
                  <>
                    Tìm thấy <strong className="text-slate-900 dark:text-slate-100">{totalPosts}</strong> bài viết
                    {filters.q && (
                      <> cho từ khóa <strong className="text-blue-600 dark:text-blue-400">"{filters.q}"</strong></>
                    )}
                  </>
                ) : (
                  'Không tìm thấy kết quả nào'
                )}
              </p>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Đang tải kết quả...</p>
            </div>
          ) : posts.length === 0 ? (
            <AntdCard>
              <AntdEmpty
                description={
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      Không tìm thấy kết quả
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Thử với từ khóa khác hoặc điều chỉnh bộ lọc
                    </p>
                  </div>
                }
              />
            </AntdCard>
          ) : (
            <>
              <Row gutter={[24, 24]} align="top">
                {posts.map((post: any) => (
                  <Col key={post.blog_id || post.id} xs={24} md={12} lg={8}>
                    <LazyLoad
                      placeholder={
                        <div className="h-full w-full bg-white rounded-xl border border-slate-200 animate-pulse">
                          <div className="h-48 w-full bg-slate-200 rounded-t-xl" />
                          <div className="p-4 space-y-3">
                            <div className="h-3 w-20 bg-slate-200 rounded" />
                            <div className="h-6 w-3/4 bg-slate-200 rounded" />
                            <div className="h-4 w-full bg-slate-200 rounded" />
                          </div>
                        </div>
                      }
                    >
                      <PostItem post={post} />
                    </LazyLoad>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPosts > pageSize && (
                <div className="flex justify-center pt-6">
                  <Pagination
                    current={currentPage}
                    total={totalPosts}
                    pageSize={pageSize}
                    onChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} của ${total} bài viết`
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Empty State - No Search Yet */
        <AntdCard className="text-center py-20">
          <div className="space-y-4">
            <SearchOutlined className="text-6xl text-slate-300 dark:text-slate-600" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Bắt đầu tìm kiếm
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Nhập từ khóa vào ô tìm kiếm phía trên hoặc sử dụng các bộ lọc để tìm bài viết bạn muốn
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              <AntdTag>Full-text search</AntdTag>
              <AntdTag>Lọc theo status</AntdTag>
              <AntdTag>Lọc theo tags</AntdTag>
              <AntdTag>Lọc theo ngày</AntdTag>
              <AntdTag>Sắp xếp thông minh</AntdTag>
            </div>
          </div>
        </AntdCard>
      )}
    </main>
  );
}
