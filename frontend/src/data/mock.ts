// Mock data theo cấu trúc response từ BE
// Response từ /blog/posts: {data: items, metadata: {page, per_page, total}}
// Mỗi item có: blog_id, blog_title, blog_content, blog_excerpt, blog_thumbnail, 
// blog_status, blog_views, blog_likes, blog_reading_time, blog_created_at, blog_updated_at, tags

export const mockPosts = [
  {
    blog_id: 1,
    blog_title: 'NestJS Authentication Best Practices in 2025',
    blog_content: `
      <p>Nếu bạn đang vận hành một nền tảng SaaS phục vụ hàng chục nghìn người dùng, auth layer là chiếc khoá sinh tử. Từ kinh nghiệm triển khai cho 3 sản phẩm enterprise của chúng tôi trong năm 2024, dưới đây là checklist cụ thể để đưa vào dự án NestJS.</p>
      <h2>1. Phân tách Auth Service</h2>
      <p>Tạo module <code>AuthModule</code> riêng, expose <code>AuthService</code>, <code>JwtStrategy</code> và <code>RefreshTokenStrategy</code>. Nhớ gom toàn bộ config (public/private key, TTL, issuer) vào <code>ConfigService</code> để dễ thay đổi.</p>
      <p>Khi service phát triển lớn, chúng tôi chuyển hẳn auth sang microservice riêng để scale độc lập. Nest gRPC gateway hoạt động tốt, đặc biệt khi cần share guard giữa các module.</p>
      <h2>2. Access Token ngắn, Refresh Token dài</h2>
      <ul>
        <li>Access token: 15 phút.</li>
        <li>Refresh token: 14 ngày, lưu Redis kèm device fingerprint.</li>
        <li>Dùng <code>rotateRefreshTokens</code> cho mỗi lần refresh để giảm nguy cơ replay.</li>
      </ul>
      <h3>Case study</h3>
      <p>Trong một incident hồi tháng 11/2024, chúng tôi phát hiện refresh token bị lộ qua extension độc hại. Việc lưu hash token + fingerprint giúp revoke chính xác user/device mà không kick toàn bộ user.</p>
      <h2>3. Guard theo bối cảnh</h2>
      <p><code>AuthGuard('jwt')</code> cho route user, <code>AuthGuard('jwt-admin')</code> cho dashboard. Kết hợp decorator <code>@Roles()</code> và <code>RoleGuard</code> để enforce RBAC ngay tại controller layer. Khi làm việc với GraphQL, đừng quên custom <code>GqlExecutionContext</code>.</p>
      <h2>4. Audit & Observability</h2>
      <p>Log mọi hành vi nhạy cảm (login, logout, đổi mật khẩu) vào Elasticsearch kèm geo + user agent. Điều này giúp chúng tôi dựng dashboard anomaly trong Kibana, phát hiện hành vi brute force sau 3 phút.</p>
      <blockquote>
        <p>"Security is a journey, not a checkbox" – câu nói cũ nhưng vẫn đúng trong 2025.</p>
      </blockquote>
      <h2>Checklist cuối</h2>
      <ol>
        <li>✓ Bật rate limit trên route <code>/auth/login</code>.</li>
        <li>✓ Dùng CSRF token riêng cho web session.</li>
        <li>✓ Backup private key định kỳ + enable key rotation.</li>
      </ol>
      <p>Kết luận: đầu tư thời gian chuẩn hoá auth giúp team ra feature tự tin hơn thay vì luôn lo ngại rủi ro bảo mật.</p>
    `,
    blog_excerpt: 'Các tip bảo mật và tối ưu hoá cho hệ thống auth trong NestJS.',
    blog_thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    blog_status: 'published',
    blog_views: 1250,
    blog_likes: 120,
    blog_reading_time: 8,
    blog_created_at: '2025-02-01T10:00:00Z',
    blog_updated_at: '2025-02-01T10:00:00Z',
    tags: [
      { id: 1, name: 'nestjs' },
      { id: 2, name: 'auth' },
      { id: 3, name: 'best-practices' },
    ],
    // Thêm slug và user info để tương thích với frontend hiện tại
    slug: 'nest-auth-best-practices',
    user: {
      user_id: 1,
      user_name: 'Alice Nguyen',
      user_email: 'alice@example.com',
      user_image: 'https://i.pravatar.cc/150?img=47',
    },
  },
  {
    blog_id: 2,
    blog_title: 'Next.js 14 App Router: Những điều cần biết',
    blog_content: `
      <p>App Router không còn là khái niệm mới, nhưng phiên bản 14 đã đủ chín muồi để triển khai production. Bài viết này tổng hợp các pattern chúng tôi áp dụng khi rebuild trang marketing trong quý IV/2024.</p>
      <h2>1. Layout Streaming</h2>
      <p>Với <code>loading.tsx</code> ở từng segment, người dùng nhận được skeleton ngay lập tức trong khi server component render phần nặng hơn. Lighthouse hiển thị Time to Interactive cải thiện 26%.</p>
      <h2>2. Server Action</h2>
      <p>Chúng tôi sử dụng server action để submit form newsletter, không cần API route riêng. Ưu điểm: giảm round-trip, revalidate cache chính xác. Nhược: khó debug nếu chưa quen concept "server first".</p>
      <h3>Implementation note</h3>
      <p>Đặt action trong file <code>actions.ts</code> và import vào component client để tránh circular.</p>
      <h2>3. Route Group tổ chức "feature slice"</h2>
      <p>Sử dụng <code>(marketing)</code>, <code>(dashboard)</code>, <code>(auth)</code> group giúp chia layout + bảo vệ route mà không ảnh hưởng URL. Dashboard chỉ render nếu user đã login nhờ kết hợp middleware + session cookie.</p>
      <h2>4. Kết hợp với NestJS backend</h2>
      <p>Next.js đảm nhận layer public (SSR, SEO), còn NestJS cung cấp REST + GraphQL. Bằng cách deploy chung trong monorepo với Turborepo, chúng tôi tái sử dụng DTO và schema dễ dàng.</p>
      <p>Sau 6 tuần migrate, số lượng bug UI giảm 35% vì component tree rõ ràng, dễ testing hơn.</p>
    `,
    blog_excerpt: 'Hướng dẫn xây dựng ứng dụng blog fullstack với Next App Router + NestJS.',
    blog_thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    blog_status: 'published',
    blog_views: 980,
    blog_likes: 85,
    blog_reading_time: 12,
    blog_created_at: '2025-01-28T09:00:00Z',
    blog_updated_at: '2025-01-28T09:00:00Z',
    tags: [
      { id: 4, name: 'nextjs' },
      { id: 5, name: 'frontend' },
      { id: 6, name: 'guide' },
    ],
    slug: 'next14-app-router-guide',
    user: {
      user_id: 2,
      user_name: 'Bob Tran',
      user_email: 'bob@example.com',
      user_image: 'https://i.pravatar.cc/150?img=12',
    },
  },
  {
    blog_id: 3,
    blog_title: 'Tối ưu SEO cho blog kỹ thuật',
    blog_content: `
      <p>SEO cho nội dung kỹ thuật có đặc thù riêng: từ khoá dài, traffic niche nhưng chất lượng cao. Dưới đây là khung làm việc mà team Growth áp dụng cho blog developers.</p>
      <h2>1. Research từ khoá theo intent</h2>
      <p>Dùng Ahrefs + dữ liệu Search Console để nhóm keyword theo pain point (ví dụ "nestjs logging", "nestjs websocket retry"). Mỗi cluster có 1 pillar article + 3-4 bài supporting.</p>
      <h2>2. Technical SEO</h2>
      <ul>
        <li>Core Web Vitals: giữ LCP &lt; 2.5s nhờ prefetch hình ảnh và phân tách bundle.</li>
        <li>Schema Article + FAQ cho mọi bài hướng dẫn.</li>
        <li>Generate sitemap tự động từ CMS + ping Google mỗi khi publish.</li>
      </ul>
      <h2>3. Nội dung dài hơi</h2>
      <p>Mỗi bài pillar ~2.500 từ, có phần "Quick summary" phía đầu và "Reference implementation" cuối bài. Case study thực tế giúp tăng dwell time thêm 40% so với checklist khô khan.</p>
      <h2>4. Liên kết nội bộ</h2>
      <p>Dùng script phân tích top 50 bài để phát hiện anchor text trùng lặp. Sau khi tối ưu liên kết nội bộ, organic session tăng 18% chỉ trong 3 tuần.</p>
      <p>Kết luận: SEO không phải trò đánh nhanh thắng nhanh. Kiên trì với cấu trúc rõ ràng + nội dung sâu sắc sẽ mang lại kết quả bền vững.</p>
    `,
    blog_excerpt: 'Checklist 10 mục quan trọng để blog lọt top Google.',
    blog_thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    blog_status: 'published',
    blog_views: 760,
    blog_likes: 62,
    blog_reading_time: 6,
    blog_created_at: '2025-01-20T13:30:00Z',
    blog_updated_at: '2025-01-20T13:30:00Z',
    tags: [
      { id: 7, name: 'seo' },
      { id: 8, name: 'growth' },
      { id: 9, name: 'content' },
    ],
    slug: 'optimize-blog-seo',
    user: {
      user_id: 3,
      user_name: 'Celine Ho',
      user_email: 'celine@example.com',
      user_image: 'https://i.pravatar.cc/150?img=5',
    },
  },
];

// Mock response format từ BE
export const mockPostsResponse = {
  data: mockPosts,
  metadata: {
    page: 1,
    per_page: 20,
    total: 3,
  },
};

export const mockTags = [
  { name: 'nestjs', count: 32, description: 'Kiến trúc backend hiện đại' },
  { name: 'nextjs', count: 45, description: 'SSR/SSG cho frontend' },
  { name: 'seo', count: 27, description: 'Tối ưu nội dung & traffic' },
  { name: 'devops', count: 18, description: 'CI/CD và hạ tầng' },
];

export const mockUsers = [
  {
    id: '1',
    name: 'Alice Nguyen',
    role: 'Full-stack Engineer',
    bio: 'Yêu thích NestJS và kiến trúc clean code.',
    followers: 1200,
    following: 180,
    posts: 24,
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: '2',
    name: 'Bob Tran',
    role: 'Frontend Lead',
    bio: 'Xây dựng UI/UX cho sản phẩm SaaS.',
    followers: 860,
    following: 120,
    posts: 18,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
];

export const mockNotifications = [
  {
    id: '1',
    title: 'Bài viết mới được duyệt',
    description: '"NestJS Authentication Best Practices" đã được phê duyệt.',
    time: '2025-02-01T10:30:00Z',
    status: 'success' as const,
    unread: true,
  },
  {
    id: '2',
    title: 'Bình luận mới',
    description: 'Minh Khoa đã bình luận: "Bài viết rất hay, cảm ơn bạn!"',
    time: '2025-02-01T09:00:00Z',
    status: 'info' as const,
    unread: true,
  },
  {
    id: '3',
    title: 'Lỗi build',
    description: 'Pipeline #234 thất bại do lỗi test e2e.',
    time: '2025-01-31T21:00:00Z',
    status: 'error' as const,
    unread: false,
  },
  {
    id: '4',
    title: 'Bài viết mới được duyệt',
    description: '"NestJS Authentication Best Practices" đã được phê duyệt.',
    time: '2025-02-01T10:30:00Z',
    status: 'success' as const,
    unread: true,
  },
  {
    id: '5',
    title: 'Bình luận mới',
    description: 'Minh Khoa đã bình luận: "Bài viết rất hay, cảm ơn bạn!"',
    time: '2025-02-01T09:00:00Z',
    status: 'info' as const,
    unread: true,
  },
  {
    id: '6',
    title: 'Lỗi build',
    description: 'Pipeline #234 thất bại do lỗi test e2e.',
    time: '2025-01-31T21:00:00Z',
    status: 'error' as const,
    unread: false,
  },
];

export const mockDrafts = [
  { id: 'd1', title: 'Kinh nghiệm tối ưu Prisma', updatedAt: '2025-01-29T15:00:00Z' },
  { id: 'd2', title: 'Checklist trước khi deploy', updatedAt: '2025-01-27T11:20:00Z' },
];

export const mockStats = {
  totalViews: 24500,
  totalLikes: 1450,
  totalComments: 320,
  followers: 1280,
};

// Mock comments theo cấu trúc BE response
// Response từ /blog/post/:id/comments: {data: [...], metadata: {isNext, total}}
// Mỗi comment: {comment_id, comment_created_at, comment_content, user_id, user_name, user_email, like_count, reply_count}
export const mockComments = [
  {
    comment_id: 1,
    comment_created_at: '2025-02-01T11:00:00Z',
    comment_content: 'Bài viết rất chi tiết, cảm ơn bạn đã chia sẻ kinh nghiệm!',
    user_id: 4,
    user_name: 'Minh Khoa',
    user_email: 'minhkhoa@example.com',
    like_count: '4',
    reply_count: '0',
    postId: 1, // Thêm để filter
  },
  {
    comment_id: 2,
    comment_created_at: '2025-02-01T11:10:00Z',
    comment_content: 'Phần về refresh token + Redis rất hữu ích. Bạn có demo repo không?',
    user_id: 5,
    user_name: 'Linh Phan',
    user_email: 'linhphan@example.com',
    like_count: '2',
    reply_count: '1',
    postId: 1,
  },
  {
    comment_id: 3,
    comment_created_at: '2025-01-29T08:00:00Z',
    comment_content: 'Next.js App Router đúng là game-changer!',
    user_id: 6,
    user_name: 'Tommy',
    user_email: 'tommy@example.com',
    like_count: '1',
    reply_count: '0',
    postId: 2,
  },
];

export const mockCommentsResponse = {
  data: mockComments,
  metadata: {
    isNext: false,
    total: 3,
  },
};

// Helper function để transform BE response format sang frontend format
export function transformPost(post: typeof mockPosts[0]) {
  return {
    id: post.blog_id.toString(),
    slug: post.slug,
    title: post.blog_title,
    excerpt: post.blog_excerpt || '',
    cover: post.blog_thumbnail || '',
    author: {
      id: post.user?.user_id?.toString() || '1',
      name: post.user?.user_name || 'Unknown',
      role: 'Author',
      avatar: post.user?.user_image || '',
    },
    tags: post.tags?.map((tag) => tag.name) || [],
    publishedAt: post.blog_created_at,
    readingTime: post.blog_reading_time || 0,
    stats: {
      views: post.blog_views || 0,
      likes: post.blog_likes || 0,
      comments: 0,
    },
    content: post.blog_content,
    hero: post.blog_thumbnail || '',
    isPublic: post.blog_status === 'published',
  };
}

// Transform tất cả posts để tương thích với frontend hiện tại
export const transformedMockPosts = mockPosts.map(transformPost);

// ===== Mock data cho API fallback (theo format API response) =====

// Post types
export interface MockPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  hero_image: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  reading_time: number;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };
  tags: Array<{
    id: number;
    tag_name: string;
  }>;
}

export interface MockPostsResponse {
  data: MockPost[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface MockPostDetailResponse {
  data: MockPost;
}

export interface MockRelatedPostsResponse {
  data: MockPost[];
}

// Tag types
export interface MockTag {
  id: number;
  tag_name: string;
  created_at: string;
  updated_at: string;
}

export interface MockTagsResponse {
  data: MockTag[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}

// Comment types
export interface MockComment {
  comment_id: number;
  comment_created_at: string;
  comment_content: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_image: string;
  like_count: number;
  reply_count: number;
}

export interface MockCommentsResponse {
  data: MockComment[];
  meta: {
    isNext: boolean;
    total: number;
  };
}

// Mock data exports
export const mockPostsData: MockPostsResponse = {
  data: [
    {
      id: 1,
      title: 'Sample Post 1',
      content: 'Sample content 1',
      excerpt: 'Sample excerpt 1',
      hero_image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
      created_at: '2025-02-01T10:00:00Z',
      updated_at: '2025-02-01T10:00:00Z',
      view_count: 100,
      like_count: 10,
      comment_count: 5,
      reading_time: 5,
      status: 'published',
      user: {
        id: 1,
        name: 'Sample User',
        email: 'user@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      tags: [
        { id: 1, tag_name: 'nestjs' },
        { id: 2, tag_name: 'backend' },
      ],
    },
    {
      id: 2,
      title: 'Sample Post 2',
      content: 'Sample content 2',
      excerpt: 'Sample excerpt 2',
      hero_image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
      created_at: '2025-01-28T09:00:00Z',
      updated_at: '2025-01-28T09:00:00Z',
      view_count: 80,
      like_count: 8,
      comment_count: 3,
      reading_time: 4,
      status: 'published',
      user: {
        id: 2,
        name: 'Sample User 2',
        email: 'user2@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      tags: [
        { id: 3, tag_name: 'nextjs' },
        { id: 4, tag_name: 'frontend' },
      ],
    },
  ],
  meta: {
    page: 1,
    per_page: 12,
    total: 2,
  },
};

export const mockPostDetail: MockPostDetailResponse = {
  data: {
    id: 1,
    title: 'Sample Post Detail',
    content: 'Sample content detail',
    excerpt: 'Sample excerpt detail',
    hero_image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
    view_count: 100,
    like_count: 10,
    comment_count: 5,
    reading_time: 5,
    status: 'published',
    user: {
      id: 1,
      name: 'Sample User',
      email: 'user@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    tags: [
      { id: 1, tag_name: 'nestjs' },
      { id: 2, tag_name: 'backend' },
    ],
  },
};

export const mockRelatedPosts: MockRelatedPostsResponse = {
  data: [
    {
      id: 2,
      title: 'Related Post',
      content: 'Related content',
      excerpt: 'Related excerpt',
      hero_image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
      created_at: '2025-01-28T09:00:00Z',
      updated_at: '2025-01-28T09:00:00Z',
      view_count: 80,
      like_count: 8,
      comment_count: 3,
      reading_time: 4,
      status: 'published',
      user: {
        id: 2,
        name: 'Sample User 2',
        email: 'user2@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      tags: [
        { id: 3, tag_name: 'nextjs' },
      ],
    },
  ],
};

export const mockTagsData: MockTagsResponse = {
  data: [
    { id: 1, tag_name: 'nestjs', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
    { id: 2, tag_name: 'nextjs', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
    { id: 3, tag_name: 'typescript', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
    { id: 4, tag_name: 'react', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
    { id: 5, tag_name: 'backend', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  ],
  meta: {
    page: 1,
    per_page: 20,
    total: 5,
  },
};

export const mockCommentsData: MockCommentsResponse = {
  data: [
    {
      comment_id: 1,
      comment_created_at: '2025-02-01T11:00:00Z',
      comment_content: 'Sample comment 1',
      user_id: 1,
      user_name: 'Sample User',
      user_email: 'user@example.com',
      user_image: 'https://i.pravatar.cc/150?img=1',
      like_count: 5,
      reply_count: 2,
    },
    {
      comment_id: 2,
      comment_created_at: '2025-02-01T11:10:00Z',
      comment_content: 'Sample comment 2',
      user_id: 2,
      user_name: 'Sample User 2',
      user_email: 'user2@example.com',
      user_image: 'https://i.pravatar.cc/150?img=2',
      like_count: 3,
      reply_count: 1,
    },
  ],
  meta: {
    isNext: false,
    total: 2,
  },
};
