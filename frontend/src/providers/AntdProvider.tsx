'use client';

import { ConfigProvider, theme } from 'antd';
import { ReactNode, useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import viVN from 'antd/locale/vi_VN';

export function AntdProvider({ children }: { children: ReactNode }) {
  const { theme: appTheme } = useUIStore();

  // Đồng bộ Tailwind dark mode với Ant Design theme
  useEffect(() => {
    const html = document.documentElement;
    if (appTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [appTheme]);

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0ea5e9',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadius: 12,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

