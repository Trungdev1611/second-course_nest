'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Row, Col } from 'antd';
import { AntdCard, AntdTag, AntdButton } from '@/components/common';
import { mockTags, mockPosts } from '@/data/mock';

interface TagDetailProps {
  params: { slug: string };
}

export default function TagDetailPage({ params }: TagDetailProps) {
  const tag = mockTags.find((item) => item.name === params.slug);
  if (!tag) {
    return null
  }

  const posts = mockPosts.filter((post) => post.tags.map(item => item.name).includes(tag.name));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <AntdTag color="blue">{tag.name}</AntdTag>
        <h1 className="text-3xl font-semibold">{tag.name}</h1>
        <p className="text-slate-600">{tag.description}</p>
        <p className="text-sm text-slate-500">{posts.length} bài viết có tag này</p>
      </div>

      <Row gutter={[24, 24]}>
        {posts.map((post) => (
          <Col key={post.blog_id} xs={24} md={12}>
            <AntdCard hoverable>
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  {new Date(post.blog_created_at).toLocaleDateString('vi-VN')}
                </p>
                <Link href={`/posts/${post.slug}`} className="text-xl font-semibold text-slate-900">
                  {post.blog_title}
                </Link>
                <p className="text-slate-600">{post.blog_excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <AntdTag key={tag.id}>{tag.name}</AntdTag>
                  ))}
                </div>
                <Link href={`/posts/${post.slug}`}>
                  <AntdButton variant="ghost">Đọc bài viết</AntdButton>
                </Link>
              </div>
            </AntdCard>
          </Col>
        ))}
      </Row>
    </main>
  );
}

