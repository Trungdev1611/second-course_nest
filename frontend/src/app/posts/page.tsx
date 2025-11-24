'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Row, Col, Input, Pagination } from 'antd';
import { AntdButton, LazyLoad } from '@/components/common';
import { PostItem } from '@/components/posts';
import usePostAPI from '@/hooks/usePostAPI';
import useTagAPI from '@/hooks/useTagAPI';

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { usePosts } = usePostAPI();
  const { useTags } = useTagAPI();

  const { data: postsData} = usePosts({
    page: currentPage,
    per_page: pageSize,
    search: searchValue || undefined,
    type: selectedTag || undefined,
  });

  const { data: tagsData } = useTags({ per_page: 20 });

  const posts = postsData?.data || [];
  const tags = tagsData?.data || [];
  const totalPosts = postsData?.meta?.total || 0;
  console.log('tag:::', posts)
  if(!posts || !tags) {
    return null
  }
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-4 text-center">
        <p className="uppercase text-xs tracking-[0.3em] text-slate-500">Public Feed</p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Khám phá bài viết mới nhất
        </h1>
        <p className="text-slate-600">
          Ai cũng có thể đọc bài public. Đăng nhập để lưu bài, theo dõi tác giả và nhận thông báo.
        </p>
        <div className="max-w-2xl mx-auto pt-4">
          <Input.Search
            size="large"
            placeholder="Tìm kiếm bài viết, tác giả, tags..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={(value) => {
              setSearchValue(value);
              setCurrentPage(1);
            }}
            enterButton="Tìm kiếm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <AntdButton
          variant={!selectedTag ? 'primary' : 'secondary'}
          onClick={() => {
            setSelectedTag(null);
            setCurrentPage(1);
          }}
          className="min-w-[90px]"
        >
          Tất cả
        </AntdButton>
        {tags.slice(0, 10).map((tag: any) => {
          const tagName = tag.name || tag.tag_name;
          return (
            <AntdButton
              key={tag.id}
              variant={selectedTag === tagName ? 'primary' : 'secondary'}
              onClick={() => {
                setSelectedTag(tagName);
                setCurrentPage(1);
              }}
              className="min-w-[90px] font-medium"
            >
              {tagName}
            </AntdButton>
          );
        })}
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-slate-500 py-10">
          <p>Không tìm thấy bài viết nào</p>
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {posts.map((post: any) => (
              <Col key={post.blog_id || post.id} xs={24} md={12}>
                <LazyLoad
                  placeholder={
                    <div className="h-full w-full bg-white rounded-xl border border-slate-200 animate-pulse">
                      <div className="h-48 w-full bg-slate-200 rounded-t-xl" />
                      <div className="p-4 space-y-3">
                        <div className="h-3 w-20 bg-slate-200 rounded" />
                        <div className="h-6 w-3/4 bg-slate-200 rounded" />
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-5/6 bg-slate-200 rounded" />
                        <div className="flex gap-2 mt-2">
                          <div className="h-6 w-16 bg-slate-200 rounded" />
                          <div className="h-6 w-16 bg-slate-200 rounded" />
                        </div>
                      </div>
                    </div>
                  }
                >
                  <PostItem post={post} />
                </LazyLoad>
              </Col>
            ))}
          </Row>
          {totalPosts > pageSize && (
            <div className="flex justify-center pt-4">
              <Pagination
                current={currentPage}
                total={totalPosts}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}

