'use client';

import { ConfigProvider, theme } from 'antd';
import { ReactNode } from 'react';
import { useUIStore } from '@/store/uiStore';
import viVN from 'antd/locale/vi_VN';

export function AntdProvider({ children }: { children: ReactNode }) {
  const { theme: appTheme } = useUIStore();

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

