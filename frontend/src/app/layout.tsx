import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { AntdProvider } from '@/providers/AntdProvider';
import { AntdRegistry } from '@ant-design/nextjs-registry';

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
          <QueryProvider>
            <AntdProvider>
              {children}
            </AntdProvider>
          </QueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

