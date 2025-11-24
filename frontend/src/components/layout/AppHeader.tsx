'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Drawer, Menu, Avatar } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { AntdButton, AntdNotificationPopover } from '@/components/common';
import { mockNotifications } from '@/data/mock';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';

const navLinks = [
  { href: '/posts', label: 'Bài viết' },
  { href: '/tags', label: 'Tags' },
  { href: '/editor', label: 'Viết bài' },
  { href: '/me', label: 'Dashboard' },
  { href: '/search', label: 'Advance Search' },
];

const drawerLinks = [
  { key: 'posts', label: <Link href="/posts">Tất cả bài viết</Link> },
  { key: 'tags', label: <Link href="/tags">Khám phá tags</Link> },
  { key: 'editor', label: <Link href="/editor">Trình soạn thảo</Link> },
  { key: 'notifications', label: <Link href="/notifications">Thông báo</Link> },
  { key: 'admin', label: <Link href="/admin">Admin</Link> },
  { key: 'search', label: <Link href="/search">Advance Search</Link> },
];

export function AppHeader() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useUIStore();
  const pathname = usePathname();
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              modern.blog
            </Link>
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
        {navLinks.map(link => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                px-3 py-2 rounded-lg transition-all text-slate-600 dark:text-slate-300
                ${isActive
                  ? "bg-[#e6f4ff] dark:bg-blue-900/30 text-[#1677ff] dark:text-blue-400"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#1677ff] dark:hover:text-blue-400"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
          </div>

          <div className="flex items-center gap-3">

            <AntdNotificationPopover notifications={mockNotifications} />
            <button
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-gray-700 ml-4"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              🌓
            </button>
            {user ? (
              <Link href="/me" className="hidden sm:flex items-center gap-2 text-sm text-slate-900 dark:text-slate-100">
                <Avatar size="small">{user.name?.[0] ?? 'U'}</Avatar>
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link href="/login">
                <AntdButton variant="ghost" className='!border-slate-400 dark:!border-slate-600 !border !text-gray-800 dark:!text-gray-200'>Đăng nhập</AntdButton>
              </Link>
            )}
            <AntdButton
              variant="primary"
              className="hidden sm:inline-flex"
            >
              <Link href="/editor">Tạo bài</Link>
            </AntdButton>
            <button
              aria-label="Open menu"
              className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700"
              onClick={() => setOpenDrawer(true)}
            >
              <MenuOutlined />
            </button>
          </div>
        </div>
      </header>

      <Drawer
        title="Điều hướng"
        placement="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Menu
          items={drawerLinks}
          selectable={false}
          onClick={() => setOpenDrawer(false)}
        />
      </Drawer>
    </>
  );
}

