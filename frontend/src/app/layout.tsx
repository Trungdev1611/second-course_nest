import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { AntdProvider } from '@/providers/AntdProvider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AppShell } from '@/components/layout/AppShell';
import ErrorBoundary from '@/components/wrapper/ErrorBoundary';
import { GlobalLoading } from '@/components/wrapper/GlobalLoading';
import { MockDataIndicator } from '@/components/common/MockDataIndicator';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Blog Platform',
  description: 'Modern blog platform built with Next.js and NestJS',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdRegistry>
          <ErrorBoundary>
            <QueryProvider>
              <GlobalLoading />
              <AntdProvider>
                <AppShell>{children}</AppShell>
                <MockDataIndicator />
              </AntdProvider>
            </QueryProvider>
          </ErrorBoundary>
        </AntdRegistry>
      </body>
    </html>
  );
}

