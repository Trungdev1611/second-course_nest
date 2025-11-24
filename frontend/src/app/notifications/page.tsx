'use client';

import { Space } from 'antd';
import { AntdCard, AntdTag } from '@/components/common';
import { mockNotifications } from '@/data/mock';

export default function NotificationsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Thông báo</h1>
        <p className="text-slate-600">
          Dù chưa đăng nhập, bạn vẫn có thể xem feed public. Đăng nhập để nhận thông báo cá nhân.
        </p>
      </div>

      <Space direction="vertical" className="w-full">
        {mockNotifications.map((notification) => (
          <AntdCard key={notification.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{notification.title}</p>
                <p className="text-sm text-slate-500">{notification.description}</p>
              </div>
              <AntdTag color={notification.status}>{notification.status}</AntdTag>
            </div>
          </AntdCard>
        ))}
      </Space>
    </main>
  );
}

