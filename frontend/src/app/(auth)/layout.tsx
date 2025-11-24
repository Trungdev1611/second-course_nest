import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white p-12">
        <div className="max-w-md self-center space-y-6">
          <p className="uppercase tracking-widest text-sm text-blue-100">
            Modern Blog Platform
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            Khám phá các bài viết hay ho ngay cả khi chưa đăng nhập
          </h1>
          <p className="text-blue-100">
            Đăng nhập để tạo bài viết, bình luận và lưu bài. Người xem vẫn có thể đọc các bài
            public mà không cần tài khoản.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div>
              <p className="font-semibold">Không muốn đăng nhập?</p>
              <p className="text-blue-100">Truy cập feed công khai ngay bây giờ.</p>
            </div>
            <Link
              href="/posts"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              Xem bài viết public
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

