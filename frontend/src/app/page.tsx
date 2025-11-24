import Link from 'next/link';
import { AntdButton, AntdCard, AntdTag } from '@/components/common';
import { transformedMockPosts } from '@/data/mock';

export default function HomePage() {
  const featured = transformedMockPosts[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold">
            Modern Blog Platform
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 mt-4 leading-tight">
            Chia sẻ kiến thức công nghệ, đọc bài viết chất lượng – không cần đăng nhập.
          </h1>
          <p className="text-lg text-slate-600 mt-6">
            Các bài viết public luôn mở cho cộng đồng. Khi sẵn sàng sáng tạo hoặc lưu bài yêu thích,
            hãy đăng nhập để mở khoá thêm nhiều tính năng.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/posts">
              <AntdButton size="large" variant="primary">
                Khám phá bài viết
              </AntdButton>
            </Link>
            <Link href="/auth/login">
              <AntdButton size="large" variant="ghost">
                Đăng nhập / Đăng ký
              </AntdButton>
            </Link>
            <Link href="/component-page" className="text-sm text-slate-500 underline">
              Xem thư viện UI
            </Link>
          </div>
        </div>
        <AntdCard hoverable>
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Featured Post</p>
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">{featured.title}</h3>
          <p className="text-slate-600 mb-4">{featured.excerpt}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {featured.tags.map((tag) => (
              <AntdTag key={tag} color="blue">
                {tag}
              </AntdTag>
            ))}
          </div>
          <Link href={`/posts/${featured.slug}`}>
            <AntdButton type="primary">Đọc ngay</AntdButton>
          </Link>
        </AntdCard>
      </section>
    </main>
  );
}
