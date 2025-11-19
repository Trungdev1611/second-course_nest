import { Badge, Button, List, Popover, Tag } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time?: string | Date;
  status?: 'info' | 'success' | 'warning' | 'error';
  avatar?: ReactNode;
  unread?: boolean;
}

interface AntdNotificationPopoverProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onItemClick?: (item: NotificationItem) => void;
  emptyText?: ReactNode;
}

export function AntdNotificationPopover({
  notifications,
  onMarkAllRead,
  onItemClick,
  emptyText = 'Không có thông báo',
}: AntdNotificationPopoverProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  const content = (
    <div className="w-80 max-w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium text-gray-900">Thông báo</p>
        <Button
          type="link"
          size="small"
          icon={<CheckOutlined />}
          disabled={unreadCount === 0}
          onClick={onMarkAllRead}
        >
          Đánh dấu đã đọc
        </Button>
      </div>
      <List
        dataSource={notifications}
        locale={{ emptyText }}
        renderItem={(item) => (
          <List.Item
            className={`rounded-xl transition ${item.unread ? 'bg-blue-50' : 'bg-white'}`}
            style={{ padding: '12px' }}
            onClick={() => onItemClick?.(item)}
          >
            <List.Item.Meta
              avatar={item.avatar}
              title={
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.title}</span>
                  {item.status && <Tag color={statusColor(item.status)}>{item.status}</Tag>}
                </div>
              }
              description={
                <div className="text-gray-500 text-sm space-y-1">
                  <p>{item.description}</p>
                  {item.time && (
                    <span className="text-xs text-gray-400">
                      {dayjs(item.time).fromNow?.() || dayjs(item.time).format('DD/MM/YYYY HH:mm')}
                    </span>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover placement="bottomRight" content={content} trigger="click">
      <Badge count={unreadCount} size="small">
        <Button
          shape="circle"
          icon={<BellOutlined />}
        />
      </Badge>
    </Popover>
  );
}

function statusColor(status: NonNullable<NotificationItem['status']>) {
  switch (status) {
    case 'success':
      return 'green';
    case 'warning':
      return 'orange';
    case 'error':
      return 'red';
    default:
      return 'blue';
  }
}

