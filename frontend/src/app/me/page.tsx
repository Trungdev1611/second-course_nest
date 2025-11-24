'use client';

import { Row, Col, Space } from 'antd';
import Link from 'next/link';
import {
  AntdCard,
  AntdTable,
  AntdTag,
  AntdButton,
  AntdAlert,
} from '@/components/common';
import { transformedMockPosts, mockDrafts, mockStats, mockNotifications } from '@/data/mock';

export default function MePage() {
  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Views', dataIndex: 'views', key: 'views' },
    { title: 'Likes', dataIndex: 'likes', key: 'likes' },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">Bảng điều khiển của bạn</h1>
        <p className="text-slate-600">
          Quản lý bài viết, theo dõi tương tác và cập nhật thông báo. Người xem chưa đăng nhập vẫn có thể đọc bài public.
        </p>
      </div>

      <Row gutter={[20, 20]}>
        {Object.entries(mockStats).map(([key, value]) => (
          <Col key={key} xs={12} md={6}>
            <AntdCard className="rounded-2xl bg-white shadow-sm p-4">
              <p className="text-slate-500 text-sm capitalize">{key}</p>
              <p className="text-2xl font-semibold text-slate-500">{value}</p>
            </AntdCard>
          </Col>
        ))}
      </Row>

      <AntdCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Drafts</h2>
          <Link href="/editor">
            <AntdButton variant="ghost">Tạo bài mới</AntdButton>
          </Link>
        </div>
        <Space direction="vertical" className="w-full">
          {mockDrafts.map((draft) => (
            <div key={draft.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{draft.title}</p>
                <p className="text-sm text-slate-500">
                  Cập nhật lần cuối {new Date(draft.updatedAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <Link href={`/editor?draft=${draft.id}`}>
                <AntdButton variant="ghost">Tiếp tục viết</AntdButton>
              </Link>
            </div>
          ))}
        </Space>
      </AntdCard>

      <AntdTable
        title="Bài viết gần đây"
        columns={columns}
        dataSource={transformedMockPosts.map((post) => ({
          key: post.id,
          title: post.title,
          status: post.isPublic ? 'Public' : 'Draft',
          views: post.stats.views,
          likes: post.stats.likes,
        }))}
        pagination={false}
      />

      <AntdCard title="Thông báo gần đây">
        <Space direction="vertical" className="w-full">
          {mockNotifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-slate-500">{notification.description}</p>
              </div>
              <AntdTag color={notification.status}>{notification.status}</AntdTag>
            </div>
          ))}
        </Space>
      </AntdCard>

      <AntdAlert
        type="info"
        message="Tip"
        description="Bạn có thể chia sẻ link bài public cho mọi người mà không cần đăng nhập."
      />
    </main>
  );
}

