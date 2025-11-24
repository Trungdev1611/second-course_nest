'use client';

import Link from 'next/link';
import { Row, Col, Space } from 'antd';
import { AntdCard, AntdTag, AntdButton } from '@/components/common';
import { mockUsers, mockPosts } from '@/data/mock';

interface UserProfilePageProps {
  params: { id: string };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const user = mockUsers.find((item) => item.id === params.id) as any ;


  const userPosts = mockPosts.filter((post) => post?.user?.user_id === user.id);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <AntdCard>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-slate-500">Tác giả</p>
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-slate-500">{user.role}</p>
            <p className="mt-3 text-slate-600">{user.bio}</p>
            <Space className="mt-4">
              <AntdButton variant="primary">Theo dõi</AntdButton>
              <AntdButton variant="ghost">Nhắn tin</AntdButton>
            </Space>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold">{user.posts}</p>
              <p className="text-slate-500">Bài viết</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{user.followers}</p>
              <p className="text-slate-500">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{user.following}</p>
              <p className="text-slate-500">Đang theo dõi</p>
            </div>
          </div>
        </div>
      </AntdCard>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Bài viết gần đây</h2>
          <Link href="/posts">
            <AntdButton variant="ghost">Xem tất cả</AntdButton>
          </Link>
        </div>
        <Row gutter={[24, 24]}>
          {userPosts.map((post) => (
            <Col key={post.blog_id} xs={24} md={12}>
              <AntdCard hoverable>
                <Space direction="vertical" size="small">
                  <p className="text-xs text-slate-500">
                    {new Date(post.blog_created_at).toLocaleDateString('vi-VN')} · {post.blog_reading_time} phút đọc
                  </p>
                  <Link href={`/posts/${post.slug}`} className="text-xl font-semibold text-slate-900">
                    {post.blog_title}
                  </Link>
                  <p className="text-slate-600">{post.blog_excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <AntdTag key={index}>{tag.name}</AntdTag>
                    ))}
                  </div>
                </Space>
              </AntdCard>
            </Col>
          ))}
        </Row>
      </section>
    </main>
  );
}

