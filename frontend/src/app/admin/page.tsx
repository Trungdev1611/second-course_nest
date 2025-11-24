'use client';

import { Row, Col, Table, Tag } from 'antd';
import { AntdCard, AntdButton } from '@/components/common';
import { transformedMockPosts, mockTags } from '@/data/mock';

const postColumns = [
  { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
  { title: 'Tác giả', dataIndex: 'author', key: 'author' },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color={status === 'public' ? 'green' : 'orange'}>{status}</Tag>,
  },
  { title: 'Views', dataIndex: 'views', key: 'views' },
];

export default function AdminPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Trang quản trị</h1>
          <p className="text-slate-600">
            Giám sát bài viết, tags và các hoạt động. Người đọc public vẫn xem được bài public.
          </p>
        </div>
        <AntdButton variant="primary">Tạo tag mới</AntdButton>
      </div>

      <Row gutter={[20, 20]}>
        {mockTags.map((tag) => (
          <Col key={tag.name} xs={12} md={6}>
            <AntdCard>
              <p className="text-sm text-slate-500">{tag.name}</p>
              <p className="text-2xl font-semibold">{tag.count}</p>
              <p className="text-xs text-slate-400">bài viết</p>
            </AntdCard>
          </Col>
        ))}
      </Row>

      <AntdCard title="Tổng quan bài viết">
        <Table
          columns={postColumns}
          dataSource={transformedMockPosts.map((post) => ({
            key: post.id,
            title: post.title,
            author: post.author.name,
            status: post.isPublic ? 'public' : 'draft',
            views: post.stats.views,
          }))}
          pagination={false}
        />
      </AntdCard>
    </main>
  );
}

