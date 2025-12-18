'use client';

import Link from 'next/link';
import { Row, Col, Space, Spin } from 'antd';
import { AntdCard, AntdButton, AntdTag } from '@/components/common';
import useTagAPI from '@/hooks/useTagAPI';

export default function TagsPage() {
  const { useTags } = useTagAPI();
  const { data} = useTags({ per_page: 50 });


  const tags = data?.data || [];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3">
        <p className="uppercase text-xs tracking-[0.3em] text-slate-500">Categories</p>
        <h1 className="text-4xl font-semibold">Khám phá theo chủ đề</h1>
        <p className="text-slate-600">Các tag được cập nhật theo số lượng bài viết mới nhất.</p>
      </div>

      {tags.length === 0 ? (
        <div className="text-center text-slate-500 py-10">
          <p>Chưa có tag nào</p>
        </div>
      ) : (