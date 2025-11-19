'use client';

import { notification, NotificationArgsProps } from 'antd';
import { ReactNode } from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface UseAntdNotificationReturn {
  contextHolder: ReactNode;
  notify: (type: NotificationType, config: NotificationArgsProps) => void;
  success: (config: NotificationArgsProps) => void;
  info: (config: NotificationArgsProps) => void;
  warning: (config: NotificationArgsProps) => void;
  error: (config: NotificationArgsProps) => void;
}

export function useAntdNotification(): UseAntdNotificationReturn {
  const [api, contextHolder] = notification.useNotification();

  const notify = (type: NotificationType, config: NotificationArgsProps) => {
    api[type]({
      placement: 'topRight',
      duration: 3,
      ...config,
    });
  };

  return {
    contextHolder,
    notify,
    success: (config) => notify('success', config),
    info: (config) => notify('info', config),
    warning: (config) => notify('warning', config),
    error: (config) => notify('error', config),
  };
}

