'use client';

import { useState } from 'react';
import { DatePicker, Button, Select } from 'antd';
import { AntdTag } from '@/components/common';
import { SearchParams } from '@/lib/api';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchFiltersProps {
  filters: Partial<SearchParams>;
  onFiltersChange: (filters: Partial<SearchParams>) => void;
  availableTags?: Array<{ id: number; name: string }>;
  availableStatuses?: Array<{ value: string; label: string }>;
  className?: string;
}

export function SearchFilters({
  filters,
  onFiltersChange,
  availableTags = [],
  availableStatuses = [
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
    { value: 'archived', label: 'Đã lưu trữ' },
  ],
  className = '',
}: SearchFiltersProps) {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    filters.date_from && filters.date_to
      ? [dayjs(filters.date_from), dayjs(filters.date_to)]
      : null
  );

  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(filters.status);

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      onFiltersChange({
        ...filters,
        date_from: dates[0].toISOString(),
        date_to: dates[1].toISOString(),
      });
    } else {
      const { date_from, date_to, ...rest } = filters;
      onFiltersChange(rest);
    }
  };

  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
    onFiltersChange({
      ...filters,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const handleStatusChange = (status: string | undefined) => {
    setSelectedStatus(status);
    onFiltersChange({
      ...filters,
      status: status || undefined,
    });
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({
      ...filters,
      sort: sort as SearchParams['sort'],
    });
  };

  const clearFilters = () => {
    setDateRange(null);
    setSelectedTags([]);
    setSelectedStatus(undefined);
    onFiltersChange({
      q: filters.q, // Keep search query
    });
  };

  const hasActiveFilters =
    selectedTags.length > 0 || selectedStatus || dateRange;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Bộ lọc tìm kiếm
        </h3>
        {hasActiveFilters && (
          <Button type="link" onClick={clearFilters} className="text-blue-600 dark:text-blue-400">
            Xóa tất cả
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Trạng thái
          </label>
          <Select
            placeholder="Tất cả trạng thái"
            value={selectedStatus}
            onChange={handleStatusChange}
            allowClear
            className="w-full"
          >
            {availableStatuses.map((status) => (
              <Option key={status.value} value={status.value}>
                {status.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Tags Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tags
          </label>
          <Select
            mode="multiple"
            placeholder="Chọn tags"
            value={selectedTags}
            onChange={handleTagChange}
            allowClear
            className="w-full"
            maxTagCount={2}
          >
            {availableTags.map((tag) => (
              <Option key={tag.id} value={tag.name}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Khoảng thời gian
          </label>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            className="w-full"
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Sắp xếp theo
          </label>
          <Select
            placeholder="Sắp xếp"
            value={filters.sort || 'relevance'}
            onChange={handleSortChange}
            className="w-full"
          >
            <Option value="relevance">Liên quan nhất</Option>
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="popular">Phổ biến nhất</Option>
            <Option value="trending">Xu hướng</Option>
          </Select>
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          {selectedStatus && (
            <AntdTag
              closable
              onClose={() => handleStatusChange(undefined)}
              className="cursor-pointer"
            >
              Trạng thái: {availableStatuses.find((s) => s.value === selectedStatus)?.label}
            </AntdTag>
          )}
          {selectedTags.map((tag) => (
            <AntdTag
              key={tag}
              closable
              onClose={() => handleTagChange(selectedTags.filter((t) => t !== tag))}
              className="cursor-pointer"
            >
              {tag}
            </AntdTag>
          ))}
          {dateRange && dateRange[0] && dateRange[1] && (
            <AntdTag
              closable
              onClose={() => handleDateRangeChange(null)}
              className="cursor-pointer"
            >
              {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
            </AntdTag>
          )}
        </div>
      )}
    </div>
  );
}

