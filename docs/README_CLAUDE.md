# Blog Platform - Full Stack Learning Project

## 📚 Mục tiêu học
- NestJS + TypeScript (Backend)
- Next.js 13+ App Router (Frontend)
- PostgreSQL + Complex Queries
- Redis (Cache, Rate Limit, Queue)
- Elasticsearch (Full-text Search)
- WebSocket (Real-time)
- AWS S3/Cloudinary (File Upload)
- Message Queue (Bull/BullMQ)

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'reader', -- reader, author, admin
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  view_count INTEGER DEFAULT 0,
  search_vector tsvector, -- PostgreSQL full-text search
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Post Tags (Many-to-Many)
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- Comments (Self-referencing for nested comments)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- Likes (Polymorphic - like post hoặc comment)
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  likeable_type VARCHAR(20) NOT NULL, -- post, comment
  likeable_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, likeable_type, likeable_id)
);

CREATE INDEX idx_likes_likeable ON likes(likeable_type, likeable_id);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- comment, like, follow
  title VARCHAR(255) NOT NULL,
  content TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Followers
CREATE TABLE followers (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);
```

---

## 🏗️ Tech Stack

### Backend (NestJS)
```json
{
  "framework": "NestJS + TypeScript",
  "database": "PostgreSQL + TypeORM/Prisma",
  "cache": "Redis (ioredis)",
  "search": "Elasticsearch",
  "queue": "Bull/BullMQ (Redis-based)",
  "auth": "JWT + Passport",
  "upload": "Multer + AWS S3 / Cloudinary",
  "realtime": "Socket.IO",
  "validation": "class-validator + class-transformer",
  "docs": "Swagger (@nestjs/swagger)",
  "logging": "Winston / Pino",
  "monitoring": "Prometheus + Grafana (optional)"
}
```

### Frontend (Next.js)
```json
{
  "framework": "Next.js 13+ App Router + TypeScript",
  "data-fetching": "React Query / SWR",
  "ui": "Tailwind CSS + shadcn/ui",
  "forms": "React Hook Form + Zod",
  "editor": "Tiptap / Quill.js",
  "realtime": "Socket.IO Client",
  "state": "Zustand (global state)"
}
```

---

## 📋 Features & Implementation

### 1️⃣ AUTHENTICATION & AUTHORIZATION

#### Backend APIs
```typescript
// Module: auth.module.ts
POST   /api/auth/register           // Đăng ký user
POST   /api/login              // Login, trả access + refresh token
POST   /api/auth/refresh            // Refresh access token
POST   /api/auth/logout             // Logout, xóa refresh token
POST   /api/auth/verify-email       // Xác thực email
POST   /api/auth/forgot-password    // Quên mật khẩu
POST   /api/auth/reset-password     // Reset mật khẩu
GET    /api/auth/me                 // Lấy thông tin user hiện tại
```

#### Frontend Pages
```typescript
// app/(auth)/
├── login/page.tsx                  // Form đăng nhập
├── register/page.tsx               // Form đăng ký
├── forgot-password/page.tsx        // Form quên mật khẩu
└── reset-password/page.tsx         // Form reset mật khẩu

// Components
├── components/loginForm.tsx
├── components/auth/RegisterForm.tsx
└── components/auth/AuthGuard.tsx   // Protected routes
```

#### Technologies Used
- **JWT**: Access token (15min) + Refresh token (7 days)
- **Redis**: Lưu refresh token, blacklist access token khi logout
- **Bcrypt**: Hash password
- **Guards**: JWT Guard, Role Guard (Author, Admin)
- **Email**: NodeMailer + Bull Queue (gửi email verify async)

#### Complex Queries
```typescript
// Check duplicate email/username
// Hash password với bcrypt
// Transaction: Create user + Send verification email
```

---

### 2️⃣ USER PROFILE & MANAGEMENT

#### Backend APIs
```typescript
// Module: users.module.ts
GET    /api/users/:id               // Lấy public profile
GET    /api/users/:id/posts         // Lấy bài viết của user
GET    /api/users/:id/stats         // Thống kê: posts count, followers, following
PUT    /api/users/:id               // Update profile (auth required)
POST   /api/users/:id/avatar        // Upload avatar
POST   /api/users/:id/follow        // Follow user
DELETE /api/users/:id/follow        // Unfollow user
GET    /api/users/:id/followers     // Danh sách followers
GET    /api/users/:id/following     // Danh sách following

// Admin only
GET    /api/admin/users             // Quản lý users (pagination, filter)
PUT    /api/admin/users/:id/role    // Thay đổi role
DELETE /api/admin/users/:id         // Soft delete user
```

#### Frontend Pages
```typescript
// app/users/[id]/
├── page.tsx                        // Profile page (posts, stats)
├── followers/page.tsx              // Danh sách followers
├── following/page.tsx              // Danh sách following
└── settings/page.tsx               // Cài đặt tài khoản

// app/admin/
└── users/page.tsx                  // Admin user management

// Components
├── components/user/ProfileCard.tsx
├── components/user/UserStats.tsx
├── components/user/FollowButton.tsx
└── components/user/AvatarUpload.tsx
```

#### Technologies Used
- **S3/Cloudinary**: Upload avatar
- **Redis Cache**: Cache user profile, stats
- **Complex Queries**:
  ```sql
  -- Get user stats
  SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT f1.follower_id) as followers_count,
    COUNT(DISTINCT f2.following_id) as following_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id AND p.deleted_at IS NULL
  LEFT JOIN followers f1 ON f1.following_id = u.id
  LEFT JOIN followers f2 ON f2.follower_id = u.id
  WHERE u.id = $1
  GROUP BY u.id;
  ```

---

### 3️⃣ POSTS MANAGEMENT (CRUD)

#### Backend APIs
```typescript
// Module: posts.module.ts
GET    /api/posts                   // List posts (pagination, filter, sort)
GET    /api/posts/:id               // Chi tiết bài viết
POST   /api/posts                   // Tạo bài viết (Author/Admin)
PUT    /api/posts/:id               // Update bài viết
DELETE /api/posts/:id               // Soft delete bài viết
POST   /api/posts/:id/publish       // Publish draft
GET    /api/posts/slug/:slug        // Lấy bài viết theo slug

// Trending & Stats
GET    /api/posts/trending          // Hot posts (24h, 7d, 30d)
GET    /api/posts/featured          // Featured posts (editor's pick)
POST   /api/posts/:id/view          // Tăng view count
```

#### Frontend Pages
```typescript
// app/posts/
├── page.tsx                        // List all posts
├── [slug]/page.tsx                 // Post detail page
├── create/page.tsx                 // Create new post (protected)
└── [id]/edit/page.tsx              // Edit post (protected)

// app/
├── page.tsx                        // Homepage (trending posts)
└── trending/page.tsx               // Trending page

// Components
├── components/post/PostCard.tsx
├── components/post/PostList.tsx
├── components/post/PostEditor.tsx  // Tiptap/Quill rich editor
├── components/post/PostStats.tsx   // Views, likes, comments count
└── components/post/DeletePostButton.tsx
```

#### Technologies Used
- **Rich Text Editor**: Tiptap hoặc Quill.js
- **Redis Cache**: 
  - Cache hot posts (TTL 5min)
  - Cache post detail (TTL 1h)
  - Trending posts với Sorted Set (score = views in 24h)
- **Bull Queue**: 
  - Index post vào Elasticsearch (async)
  - Update view count (debounce)
  - Generate post excerpt
- **Complex Queries**:
  ```sql
  -- Trending posts with stats
  SELECT 
    p.*,
    u.username as author_name,
    u.avatar_url as author_avatar,
    COUNT(DISTINCT l.id) as like_count,
    COUNT(DISTINCT c.id) as comment_count,
    array_agg(DISTINCT t.name) as tags
  FROM posts p
  JOIN users u ON u.id = p.author_id
  LEFT JOIN likes l ON l.likeable_type = 'post' AND l.likeable_id = p.id
  LEFT JOIN comments c ON c.post_id = p.id AND c.deleted_at IS NULL
  LEFT JOIN post_tags pt ON pt.post_id = p.id
  LEFT JOIN tags t ON t.id = pt.tag_id
  WHERE p.status = 'published' 
    AND p.deleted_at IS NULL
    AND p.published_at > NOW() - INTERVAL '7 days'
  GROUP BY p.id, u.id
  ORDER BY p.view_count DESC, like_count DESC
  LIMIT 10;
  ```

---

### 4️⃣ SEARCH (Elasticsearch)

#### Backend APIs
```typescript
// Module: search.module.ts
GET    /api/search                  // Full-text search (title, content, tags)
GET    /api/search/suggest          // Autocomplete suggestions
GET    /api/search/advanced         // Advanced search (filters: author, date range, tags)
GET    /api/search/related/:id      // Related posts
POST   /api/search/reindex          // Admin: Reindex all posts
```

#### Frontend Pages
```typescript
// app/search/
├── page.tsx                        // Search results page
└── advanced/page.tsx               // Advanced search page

// Components
├── components/search/SearchBar.tsx        // Global search bar
├── components/search/SearchResults.tsx
├── components/search/SearchSuggestions.tsx // Autocomplete dropdown
├── components/search/SearchFilters.tsx    // Filters: date, author, tags
└── components/search/RelatedPosts.tsx     // Related posts sidebar
```

#### Technologies Used
- **Elasticsearch**:
  - Index: posts (title, content, tags)
  - Mappings: Analyzer cho Vietnamese text
  - Fuzzy search, Highlighting
  - Aggregations: Top tags, posts by date
- **Bull Queue**: Index posts vào ES khi tạo/update (async)
- **Redis**: Cache search results (5min)

#### Elasticsearch Queries
```typescript
// Full-text search với highlight
{
  "query": {
    "multi_match": {
      "query": "react hooks",
      "fields": ["title^3", "content", "tags^2"],
      "fuzziness": "AUTO"
    }
  },
  "highlight": {
    "fields": {
      "title": {},
      "content": {}
    }
  }
}

// Autocomplete suggestions
{
  "suggest": {
    "title-suggest": {
      "prefix": "rea",
      "completion": {
        "field": "title.suggest"
      }
    }
  }
}

// Aggregations - Top tags
{
  "aggs": {
    "popular_tags": {
      "terms": {
        "field": "tags.keyword",
        "size": 10
      }
    }
  }
}

// Related posts (More Like This)
{
  "query": {
    "more_like_this": {
      "fields": ["title", "content", "tags"],
      "like": [
        {
          "_index": "posts",
          "_id": "post-id"
        }
      ],
      "min_term_freq": 1,
      "max_query_terms": 12
    }
  }
}
```

---

### 5️⃣ COMMENTS & LIKES (Real-time)

#### Backend APIs
```typescript
// Module: comments.module.ts
GET    /api/posts/:id/comments      // Lấy comments (nested, pagination)
POST   /api/posts/:id/comments      // Thêm comment (auth required)
PUT    /api/comments/:id            // Edit comment
DELETE /api/comments/:id            // Soft delete comment
POST   /api/comments/:id/reply      // Reply comment (nested)

// Module: likes.module.ts
POST   /api/posts/:id/like          // Like post
DELETE /api/posts/:id/like          // Unlike post
POST   /api/comments/:id/like       // Like comment
DELETE /api/comments/:id/like       // Unlike comment
GET    /api/posts/:id/likes         // Danh sách users liked

// WebSocket Events
// Socket namespace: /posts/:id
emit   'comment:new'                 // Khi có comment mới
emit   'comment:update'              // Khi comment được edit
emit   'comment:delete'              // Khi comment bị xóa
emit   'like:update'                 // Khi có like/unlike
```

#### Frontend Pages
```typescript
// app/posts/[slug]/page.tsx (Post detail)
// Components
├── components/comment/CommentSection.tsx     // Comment list + form
├── components/comment/CommentItem.tsx        // Single comment (nested)
├── components/comment/CommentForm.tsx        // Form add/edit comment
├── components/comment/ReplyButton.tsx
├── components/like/LikeButton.tsx            // Like button with count
└── components/like/LikesList.tsx             // Modal danh sách users liked
```

#### Technologies Used
- **Socket.IO**: 
  - Namespace `/posts/:id` cho mỗi post
  - Emit events khi có comment/like mới
  - Client subscribe khi vào post detail page
- **Redis Pub/Sub**: 
  - Sync events across multiple server instances
- **Complex Queries**:
  ```sql
  -- Get nested comments (CTE - Common Table Expression)
  WITH RECURSIVE comment_tree AS (
    -- Base case: root comments
    SELECT 
      c.*,
      u.username,
      u.avatar_url,
      COUNT(l.id) as like_count,
      0 as level
    FROM comments c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN likes l ON l.likeable_type = 'comment' AND l.likeable_id = c.id
    WHERE c.post_id = $1 AND c.parent_id IS NULL AND c.deleted_at IS NULL
    GROUP BY c.id, u.id
    
    UNION ALL
    
    -- Recursive case: child comments
    SELECT 
      c.*,
      u.username,
      u.avatar_url,
      COUNT(l.id) as like_count,
      ct.level + 1
    FROM comments c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN likes l ON l.likeable_type = 'comment' AND l.likeable_id = c.id
    JOIN comment_tree ct ON c.parent_id = ct.id
    WHERE c.deleted_at IS NULL
    GROUP BY c.id, u.id, ct.level
  )
  SELECT * FROM comment_tree
  ORDER BY level, created_at DESC;
  ```

---

### 6️⃣ TAGS & CATEGORIES

#### Backend APIs
```typescript
// Module: tags.module.ts
GET    /api/tags                    // List all tags
GET    /api/tags/popular            // Top tags (most used)
GET    /api/tags/:slug/posts        // Posts by tag
POST   /api/tags                    // Create tag (Admin)
PUT    /api/tags/:id                // Update tag
DELETE /api/tags/:id                // Delete tag
```

#### Frontend Pages
```typescript
// app/tags/
├── page.tsx                        // All tags (cloud/grid)
└── [slug]/page.tsx                 // Posts by tag

// Components
├── components/tag/TagCloud.tsx     // Tag cloud với sizes khác nhau
├── components/tag/TagList.tsx      // List tags
└── components/tag/TagBadge.tsx     // Tag badge (clickable)
```

#### Technologies Used
- **Redis Cache**: Cache popular tags (TTL 1h)
- **Complex Queries**:
  ```sql
  -- Popular tags với post count
  SELECT 
    t.id,
    t.name,
    t.slug,
    COUNT(pt.post_id) as post_count
  FROM tags t
  LEFT JOIN post_tags pt ON pt.tag_id = t.id
  LEFT JOIN posts p ON p.id = pt.post_id 
    AND p.status = 'published' 
    AND p.deleted_at IS NULL
  GROUP BY t.id
  ORDER BY post_count DESC
  LIMIT 20;
  ```

---

### 7️⃣ BOOKMARKS & READING LIST

#### Backend APIs
```typescript
// Module: bookmarks.module.ts
GET    /api/bookmarks               // Lấy bookmarks của user (auth)
POST   /api/posts/:id/bookmark      // Bookmark post
DELETE /api/posts/:id/bookmark      // Remove bookmark
```

#### Frontend Pages
```typescript
// app/bookmarks/page.tsx            // Reading list page (protected)

// Components
├── components/bookmark/BookmarkButton.tsx
└── components/bookmark/BookmarkList.tsx
```

#### Technologies Used
- **Redis Cache**: Cache bookmark IDs của user
- **Optimistic Updates**: UI update ngay, sync với server sau

---

### 8️⃣ NOTIFICATIONS (Real-time)

#### Backend APIs
```typescript
// Module: notifications.module.ts
GET    /api/notifications           // Lấy notifications (pagination)
GET    /api/notifications/unread    // Count unread
PUT    /api/notifications/:id/read  // Mark as read
PUT    /api/notifications/read-all  // Mark all as read
DELETE /api/notifications/:id       // Delete notification

// WebSocket Events
// Socket namespace: /notifications
emit   'notification:new'           // Khi có notification mới
```

#### Frontend Pages
```typescript
// app/notifications/page.tsx       // Notifications page

// Components
├── components/notification/NotificationBell.tsx  // Bell icon với badge
├── components/notification/NotificationDropdown.tsx
├── components/notification/NotificationItem.tsx
└── components/notification/NotificationList.tsx
```

#### Technologies Used
- **Socket.IO**: Push notification real-time
- **Redis**: Cache unread count
- **Bull Queue**: 
  - Tạo notification async khi có event:
    - User được follow
    - Post được comment
    - Post/Comment được like

---

### 9️⃣ ADMIN DASHBOARD

#### Backend APIs
```typescript
// Module: admin.module.ts (Guard: Admin role only)
GET    /api/admin/stats             // Tổng quan: users, posts, comments count
GET    /api/admin/users             // Quản lý users
GET    /api/admin/posts             // Quản lý posts (all status)
GET    /api/admin/comments          // Quản lý comments
DELETE /api/admin/posts/:id         // Force delete post
DELETE /api/admin/comments/:id      // Force delete comment
PUT    /api/admin/posts/:id/feature // Feature post
GET    /api/admin/analytics         // Analytics data
```

#### Frontend Pages
```typescript
// app/admin/
├── page.tsx                        // Dashboard overview
├── users/page.tsx                  // User management
├── posts/page.tsx                  // Post management
├── comments/page.tsx               // Comment management
└── analytics/page.tsx              // Analytics charts

// Components
├── components/admin/Sidebar.tsx
├── components/admin/StatCard.tsx
├── components/admin/UserTable.tsx
├── components/admin/PostTable.tsx
└── components/admin/AnalyticsChart.tsx  // Recharts
```

#### Technologies Used
- **Recharts**: Biểu đồ analytics
- **Complex Queries**:
  ```sql
  -- Analytics: Posts per day (last 30 days)
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as count
  FROM posts
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY DATE(created_at)
  ORDER BY date;
  
  -- Analytics: Top authors
  SELECT 
    u.id,
    u.username,
    COUNT(p.id) as post_count,
    SUM(p.view_count) as total_views,
    COUNT(DISTINCT l.id) as total_likes
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
  LEFT JOIN likes l ON l.likeable_type = 'post' AND l.likeable_id = p.id
  GROUP BY u.id
  ORDER BY post_count DESC
  LIMIT 10;
  ```

---

### 🔟 FILE UPLOAD

#### Backend APIs
```typescript
// Module: upload.module.ts
POST   /api/upload/image            // Upload single image
POST   /api/upload/images           // Upload multiple images
DELETE /api/upload/:key             // Delete image from S3
```

#### Frontend Components
```typescript
// Components
├── components/upload/ImageUploader.tsx    // Drag & drop uploader
├── components/upload/ImagePreview.tsx
└── components/upload/UploadProgress.tsx   // Progress bar
```

#### Technologies Used
- **Multer**: Handle multipart/form-data
- **AWS S3** hoặc **Cloudinary**:
  - Upload ảnh
  - Generate signed URL
  - Image transformation (resize, compress)
- **Bull Queue**: 
  - Resize ảnh sau khi upload (async)
  - Generate thumbnails

---

## 🔄 Advanced Features & Complex Queries

### 1. Rate Limiting (Redis)
```typescript
// Token Bucket Algorithm
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests per 60 seconds
async createPost() {}

// Custom Redis Rate Limiter
// Key: rate-limit:user:{userId}:post
// Sliding window với Sorted Set
```

### 2. Trending Algorithm (Redis Sorted Set)
```typescript
// Redis key: trending:posts:24h
// Score = views * 1 + likes * 2 + comments * 3
// TTL = 1 hour

// Update score khi có activity
ZINCRBY trending:posts:24h 1 post:{postId}  // view
ZINCRBY trending:posts:24h 2 post:{postId}  // like
ZINCRBY trending:posts:24h 3 post:{postId}  // comment

// Get trending posts
ZREVRANGE trending:posts:24h 0 9 WITHSCORES
```

### 3. Feed Algorithm (Personalized)
```typescript
// Following feed
SELECT p.*
FROM posts p
JOIN followers f ON f.following_id = p.author_id
WHERE f.follower_id = $1
  AND p.status = 'published'
  AND p.deleted_at IS NULL
ORDER BY p.published_at DESC
LIMIT 20;

// Recommended posts (same tags)
SELECT p.*
FROM posts p
JOIN post_tags pt ON pt.post_id = p.id
WHERE pt.tag_id IN (
  -- Tags from user's liked posts
  SELECT DISTINCT pt2.tag_id
  FROM likes l
  JOIN post_tags pt2 ON pt2.post_id = l.likeable_id
  WHERE l.user_id = $1 AND l.likeable_type = 'post'
)
AND p.id NOT IN (
  -- Exclude already read posts
  SELECT likeable_id FROM likes WHERE user_id = $1
)
AND p.status = 'published'
GROUP BY p.id
ORDER BY COUNT(pt.tag_id) DESC, p.published_at DESC
LIMIT 20;
```

### 4. Database Indexing
```sql
-- Composite indexes
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_author_status ON posts(author_id, status);

-- Partial index
CREATE INDEX idx_published_posts ON posts(published_at DESC) 
WHERE status = 'published' AND deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_posts_fulltext ON posts 
USING GIN(to_tsvector('english', title || ' ' || content));
```

### 5. Caching Strategy
```typescript
// Multi-level caching
1. Browser Cache (SWR/React Query) - 5min
2. Redis Cache - 1hour
3. Database

// Cache keys structure
cache:post:{id}                 // Single post
cache:posts:list:{page}:{limit} // Post list
cache:user:{id}:stats           // User stats
cache:trending:24h              // Trending posts
cache:tags:popular              // Popular tags

// Cache invalidation
- On post create/update: Invalidate post cache + list cache
- On like/comment: Invalidate post cache (stats changed)
- On follow: Invalidate user stats cache
```

### 6. Database Transactions
```typescript
// Create post with tags (atomic)
await this.dataSource.transaction(async (manager) => {
  // 1. Create post
  const post = await manager.save(Post, postData);
  
  // 2. Create/find tags
  const tags = await Promise.all(
    tagNames.map(name => 
      manager.findOne(Tag, { where: { name } }) ||
      manager.save(Tag, { name, slug: slugify(name) })
    )
  );
  
  // 3. Create post_tags relations
  await manager.save(
    PostTag,
    tags.map(tag => ({ postId: post.id, tagId: tag.id }))
  );
  
  return post;
});
```

---

## 📅 Development Roadmap

### Week 1-2: Setup & Authentication
- [ ] Setup NestJS + PostgreSQL + TypeORM
- [ ] Setup Next.js 13+ App Router
- [ ] Database schema + migrations
- [ ] Auth module: Register, Login, JWT
- [ ] Redis setup cho refresh tokens
- [ ] Frontend: Login/Register pages

### Week 3: Users & Posts CRUD
- [ ] Users module + Profile pages
- [ ] Posts CRUD endpoints
- [ ] Post editor (Tiptap/Quill)
- [ ] Image upload (S3/Cloudinary)
- [ ] Frontend: Post list, detail, create/edit pages

### Week 4: Redis Caching & Rate Limiting
- [ ] Redis caching cho posts, users
- [ ] Rate limiting với Redis
- [ ] Cache invalidation strategy
- [ ] Trending posts với Sorted Set

### Week 5: Elasticsearch Integration
- [ ] Setup Elasticsearch
- [ ] Index posts vào ES
- [ ] Search endpoints + autocomplete
- [ ] Frontend: Search page với filters
- [ ] Bull queue cho indexing async

### Week 6: Real-time Features
- [ ] Socket.IO setup
- [ ] Comments module + nested comments
- [ ] Likes module (polymorphic)
- [ ] Real-time events: comment, like
- [ ] Notifications module + WebSocket

### Week 7: Advanced Features
- [ ] Tags module + popular tags
- [ ] Bookmarks module
- [ ] Follow/Unfollow users
- [ ] Personalized feed algorithm
- [ ] Related posts (ES More Like This)

### Week 8: Admin Dashboard & Analytics
- [ ] Admin guards + role-based access
- [ ] Admin dashboard với stats
- [ ] User/Post/Comment management
- [ ] Analytics charts (Recharts)
- [ ] Feature posts

### Week 9: Background Jobs & Optimization
- [ ] Bull queues: Email, Resize images, Index ES
- [ ] Database query optimization
- [ ] Database indexing
- [ ] N+1 queries fix
- [ ] Load testing với K6

### Week 10: Monitoring & Deployment
- [ ] Winston/Pino logging
- [ ] Error tracking (Sentry)
- [ ] Prometheus metrics
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Deploy to production

---

## 🎯 Learning Objectives per Feature

### Authentication (Week 1-2)
**Backend Skills:**
- JWT implementation (access + refresh token)
- Password hashing với bcrypt
- Redis cho token storage
- Guards & Decorators trong NestJS
- Email verification flow

**Frontend Skills:**
- Form handling với React Hook Form + Zod
- Token storage (httpOnly cookies vs localStorage)
- Protected routes với middleware
- Auth context/state management

**Queries:**
```sql
-- Check duplicate email/username
SELECT id FROM users WHERE email = $1 OR username = $2;

-- Transaction: Create user + log
BEGIN;
  INSERT INTO users (...) VALUES (...) RETURNING *;
  INSERT INTO audit_logs (action, user_id) VALUES ('register', $1);
COMMIT;
```

---

### Posts CRUD (Week 3)
**Backend Skills:**
- DTOs validation với class-validator
- File upload với Multer
- Slug generation (unique constraint)
- Soft delete pattern
- Query builder với TypeORM

**Frontend Skills:**
- Rich text editor integration
- Image upload với preview
- Draft autosave (debounce)
- Optimistic updates

**Complex Queries:**
```sql
-- Get posts with author info, like/comment count
SELECT 
  p.*,
  u.username, u.avatar_url,
  COUNT(DISTINCT l.id) as like_count,
  COUNT(DISTINCT c.id) as comment_count,
  ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags
FROM posts p
INNER JOIN users u ON u.id = p.author_id
LEFT JOIN likes l ON l.likeable_type = 'post' AND l.likeable_id = p.id
LEFT JOIN comments c ON c.post_id = p.id AND c.deleted_at IS NULL
LEFT JOIN post_tags pt ON pt.post_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
WHERE p.status = 'published' AND p.deleted_at IS NULL
GROUP BY p.id, u.id
ORDER BY p.published_at DESC
LIMIT $1 OFFSET $2;

-- Pagination with cursor (better than offset)
SELECT * FROM posts
WHERE published_at < $1  -- cursor
  AND status = 'published'
ORDER BY published_at DESC
LIMIT 20;
```

---

### Redis Caching (Week 4)
**Skills:**
- Cache-aside pattern
- Cache key design (hierarchical)
- TTL strategies
- Cache invalidation (write-through, write-behind)
- Redis data structures (String, Hash, Set, Sorted Set)

**Implementation:**
```typescript
// Cache-aside pattern
async getPost(id: string) {
  // 1. Check cache
  const cached = await redis.get(`cache:post:${id}`);
  if (cached) return JSON.parse(cached);
  
  // 2. Query DB
  const post = await this.postRepo.findOne({ where: { id } });
  
  // 3. Set cache
  await redis.setex(
    `cache:post:${id}`, 
    3600, // TTL 1 hour
    JSON.stringify(post)
  );
  
  return post;
}

// Trending posts với Sorted Set
async getTrending() {
  // Get from sorted set
  const postIds = await redis.zrevrange('trending:24h', 0, 9);
  
  // Fetch full data (pipeline to avoid N+1)
  const pipeline = redis.pipeline();
  postIds.forEach(id => {
    pipeline.get(`cache:post:${id}`);
  });
  const results = await pipeline.exec();
  
  return results.map(([err, data]) => JSON.parse(data));
}

// Rate limiting - Token Bucket
async checkRateLimit(userId: string, limit: number = 10) {
  const key = `rate-limit:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  
  if (current > limit) {
    throw new TooManyRequestsException();
  }
  
  return { remaining: limit - current };
}

// Leaderboard - Top authors
await redis.zincrby('leaderboard:authors', 1, userId); // +1 post
const topAuthors = await redis.zrevrange('leaderboard:authors', 0, 9, 'WITHSCORES');
```

---

### Elasticsearch (Week 5)
**Skills:**
- Index mapping design
- Analyzers (standard, vietnamese)
- Full-text search queries
- Fuzzy search, phrase matching
- Highlighting
- Aggregations (buckets, metrics)
- Bulk indexing

**Elasticsearch Mappings:**
```json
PUT /posts
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": {
            "type": "completion"
          }
        }
      },
      "content": {
        "type": "text",
        "analyzer": "standard"
      },
      "tags": {
        "type": "keyword"
      },
      "author": {
        "properties": {
          "id": { "type": "keyword" },
          "username": { "type": "keyword" }
        }
      },
      "published_at": {
        "type": "date"
      },
      "view_count": {
        "type": "integer"
      }
    }
  }
}
```

**Advanced Queries:**
```typescript
// Full-text search with filters
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "react hooks",
            "fields": ["title^3", "content"],
            "fuzziness": "AUTO",
            "operator": "and"
          }
        }
      ],
      "filter": [
        { "terms": { "tags": ["javascript", "react"] } },
        { "range": { "published_at": { "gte": "2024-01-01" } } }
      ]
    }
  },
  "highlight": {
    "fields": {
      "title": { "number_of_fragments": 0 },
      "content": { "fragment_size": 150 }
    }
  },
  "sort": [
    { "_score": "desc" },
    { "published_at": "desc" }
  ]
}

// Aggregations - Analytics
{
  "size": 0,
  "aggs": {
    "posts_per_month": {
      "date_histogram": {
        "field": "published_at",
        "calendar_interval": "month"
      }
    },
    "top_tags": {
      "terms": {
        "field": "tags",
        "size": 10
      },
      "aggs": {
        "avg_views": {
          "avg": { "field": "view_count" }
        }
      }
    },
    "top_authors": {
      "terms": {
        "field": "author.username",
        "size": 10
      }
    }
  }
}
```

**Bulk Indexing:**
```typescript
// Bull queue job
async indexAllPosts() {
  const posts = await this.postRepo.find({
    where: { status: 'published' },
    relations: ['author', 'tags']
  });
  
  const body = posts.flatMap(post => [
    { index: { _index: 'posts', _id: post.id } },
    {
      title: post.title,
      content: post.content,
      tags: post.tags.map(t => t.name),
      author: {
        id: post.author.id,
        username: post.author.username
      },
      published_at: post.publishedAt,
      view_count: post.viewCount
    }
  ]);
  
  await this.esClient.bulk({ body });
}
```

---

### WebSocket & Real-time (Week 6)
**Skills:**
- Socket.IO namespaces & rooms
- Event emitters
- Redis Pub/Sub (multi-server sync)
- Optimistic UI updates
- Connection management

**Backend Implementation:**
```typescript
// posts.gateway.ts
@WebSocketGateway({
  namespace: '/posts',
  cors: { origin: '*' }
})
export class PostsGateway {
  @WebSocketServer()
  server: Server;
  
  constructor(private redisService: RedisService) {}
  
  // Join room when viewing post
  @SubscribeMessage('join-post')
  handleJoinPost(
    @ConnectedSocket() client: Socket,
    @MessageBody() postId: string
  ) {
    client.join(`post:${postId}`);
    return { success: true };
  }
  
  // Emit new comment to room
  async emitNewComment(postId: string, comment: any) {
    // Emit via Socket.IO
    this.server.to(`post:${postId}`).emit('comment:new', comment);
    
    // Publish to Redis (for other servers)
    await this.redisService.publish(
      'post-events',
      JSON.stringify({ event: 'comment:new', postId, data: comment })
    );
  }
  
  // Subscribe to Redis events (from other servers)
  async onModuleInit() {
    const subscriber = this.redisService.duplicate();
    await subscriber.subscribe('post-events');
    
    subscriber.on('message', (channel, message) => {
      const { event, postId, data } = JSON.parse(message);
      this.server.to(`post:${postId}`).emit(event, data);
    });
  }
}
```

**Frontend Implementation:**
```typescript
// hooks/usePostSocket.ts
export function usePostSocket(postId: string) {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  
  useEffect(() => {
    const socket = io('http://localhost:3000/posts');
    
    // Join room
    socket.emit('join-post', postId);
    
    // Listen for events
    socket.on('comment:new', (comment) => {
      setComments(prev => [comment, ...prev]);
      toast.success('New comment!');
    });
    
    socket.on('like:update', ({ count }) => {
      setLikes(count);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [postId]);
  
  return { comments, likes };
}
```

---

### Nested Comments (Week 6)
**Skills:**
- Recursive CTE (Common Table Expression)
- Self-referencing foreign key
- Tree traversal algorithms
- Recursive React components

**Complex Query:**
```sql
-- Get comment tree with depth limit
WITH RECURSIVE comment_tree AS (
  -- Base: Root comments (level 0)
  SELECT 
    c.*,
    u.username,
    u.avatar_url,
    0 as depth,
    ARRAY[c.id] as path,
    c.created_at::text as sort_key
  FROM comments c
  JOIN users u ON u.id = c.user_id
  WHERE c.post_id = $1 
    AND c.parent_id IS NULL 
    AND c.deleted_at IS NULL
  
  UNION ALL
  
  -- Recursive: Child comments
  SELECT 
    c.*,
    u.username,
    u.avatar_url,
    ct.depth + 1,
    ct.path || c.id,
    ct.sort_key || '/' || c.created_at::text
  FROM comments c
  JOIN users u ON u.id = c.user_id
  JOIN comment_tree ct ON c.parent_id = ct.id
  WHERE c.deleted_at IS NULL
    AND ct.depth < 5  -- Max depth = 5
)
SELECT 
  ct.*,
  COUNT(l.id) as like_count,
  EXISTS(
    SELECT 1 FROM likes 
    WHERE likeable_type = 'comment' 
      AND likeable_id = ct.id 
      AND user_id = $2
  ) as is_liked
FROM comment_tree ct
LEFT JOIN likes l ON l.likeable_type = 'comment' AND l.likeable_id = ct.id
GROUP BY ct.id, ct.username, ct.avatar_url, ct.depth, ct.path, ct.sort_key
ORDER BY sort_key;
```

**Frontend Recursive Component:**
```typescript
// components/comment/CommentItem.tsx
function CommentItem({ comment, depth = 0 }: Props) {
  const [showReply, setShowReply] = useState(false);
  
  return (
    <div className={`ml-${depth * 4}`}>
      <div className="comment-content">
        <Avatar src={comment.avatar_url} />
        <p>{comment.content}</p>
        <button onClick={() => setShowReply(!showReply)}>Reply</button>
      </div>
      
      {showReply && <CommentForm parentId={comment.id} />}
      
      {/* Recursive render children */}
      {comment.children?.map(child => (
        <CommentItem 
          key={child.id} 
          comment={child} 
          depth={depth + 1} 
        />
      ))}
    </div>
  );
}
```

---

### Bull Queue (Week 9)
**Skills:**
- Job queues (delayed, repeated, prioritized)
- Worker processes
- Job progress tracking
- Error handling & retries
- Queue monitoring (Bull Board)

**Queue Setup:**
```typescript
// email.processor.ts
@Processor('email')
export class EmailProcessor {
  @Process('send-verification')
  async handleSendVerification(job: Job<{ email: string; token: string }>) {
    const { email, token } = job.data;
    
    // Update progress
    await job.progress(50);
    
    // Send email
    await this.mailer.send({
      to: email,
      subject: 'Verify your email',
      html: `Click here: ${process.env.APP_URL}/verify?token=${token}`
    });
    
    await job.progress(100);
    return { sent: true };
  }
  
  @Process('send-notification')
  async handleNotification(job: Job) {
    // Send notification email
  }
  
  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed:`, error);
    // Log to Sentry
  }
}

// auth.service.ts - Add job to queue
async register(dto: RegisterDto) {
  const user = await this.userRepo.save(dto);
  
  // Add job to queue (async, non-blocking)
  await this.emailQueue.add('send-verification', {
    email: user.email,
    token: generateToken()
  }, {
    attempts: 3, // Retry 3 times
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
  
  return user;
}

// image.processor.ts
@Processor('image')
export class ImageProcessor {
  @Process('resize')
  async handleResize(job: Job<{ url: string; sizes: number[] }>) {
    const { url, sizes } = job.data;
    const results = [];
    
    for (const size of sizes) {
      const resized = await sharp(url)
        .resize(size, size)
        .toBuffer();
      
      const uploadedUrl = await this.s3.upload(resized);
      results.push({ size, url: uploadedUrl });
      
      await job.progress((results.length / sizes.length) * 100);
    }
    
    return results;
  }
}
```

**Bull Board (Monitoring):**
```typescript
// app.module.ts
import { BullModule } from '@nestjs/bull';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(emailQueue),
    new BullAdapter(imageQueue),
    new BullAdapter(searchQueue)
  ],
  serverAdapter
});

// Access at: http://localhost:3000/admin/queues
```

---

### Database Optimization (Week 9)
**Skills:**
- Query analysis với EXPLAIN ANALYZE
- Index optimization
- N+1 query problem
- Query pagination strategies
- Connection pooling

**EXPLAIN ANALYZE:**
```sql
EXPLAIN ANALYZE
SELECT p.*, u.username
FROM posts p
JOIN users u ON u.id = p.author_id
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 20;

-- Output:
-- Seq Scan on posts (cost=0..1000 rows=100)
-- → BAD: Full table scan

-- Add index:
CREATE INDEX idx_posts_status_published 
ON posts(status, published_at DESC);

-- After index:
-- Index Scan on idx_posts_status_published (cost=0..50 rows=20)
-- → GOOD: Using index
```

**N+1 Query Fix:**
```typescript
// BAD: N+1 query
const posts = await this.postRepo.find();
for (const post of posts) {
  post.author = await this.userRepo.findOne(post.authorId); // N queries
}

// GOOD: Eager loading
const posts = await this.postRepo.find({
  relations: ['author', 'tags'] // 1 query with JOINs
});

// BETTER: DataLoader (batch loading)
const posts = await this.postRepo.find();
const authorIds = posts.map(p => p.authorId);
const authors = await this.authorLoader.loadMany(authorIds); // 1 batched query
```

**Connection Pooling:**
```typescript
// typeorm.config.ts
{
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'blog',
  extra: {
    max: 20, // Max connections
    min: 5,  // Min connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// posts.service.spec.ts
describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<Post>;
  let redis: RedisService;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockRepository },
        { provide: RedisService, useValue: mockRedis }
      ]
    }).compile();
    
    service = module.get(PostsService);
  });
  
  it('should cache post after fetching', async () => {
    const post = { id: '1', title: 'Test' };
    jest.spyOn(repo, 'findOne').mockResolvedValue(post);
    jest.spyOn(redis, 'setex').mockResolvedValue('OK');
    
    await service.getPost('1');
    
    expect(redis.setex).toHaveBeenCalledWith(
      'cache:post:1',
      3600,
      JSON.stringify(post)
    );
  });
});
```

### Integration Tests
```typescript
// posts.e2e.spec.ts
describe('Posts API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    
    app = module.createNestApplication();
    await app.init();
    
    // Login to get token
    const res = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'test@test.com', password: 'password' });
    accessToken = res.body.accessToken;
  });
  
  it('GET /posts should return posts', async () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect(res => {
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.meta).toHaveProperty('total');
      });
  });
  
  it('POST /posts should create post (auth required)', async () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Test Post', content: 'Content' })
      .expect(201);
  });
});
```

---

## 📦 Deployment

### Docker Setup
```dockerfile
# Dockerfile (Backend)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: blog
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:password@postgres:5432/blog
      REDIS_URL: redis://redis:6379
      ELASTICSEARCH_URL: http://elasticsearch:9200
    depends_on:
      - postgres
      - redis
      - elasticsearch
  
  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3000
    depends_on:
      - backend

volumes:
  postgres_data:
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: myregistry/blog-backend:latest
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} \
            "cd /app && docker-compose pull && docker-compose up -d"
```

---

## 📚 Resources & Documentation

### Official Docs
- **NestJS**: https://docs.nestjs.com
- **Next.js**: https://nextjs.org/docs
- **TypeORM**: https://typeorm.io
- **Redis**: https://redis.io/docs
- **Elasticsearch**: https://www.elastic.co/guide
- **Bull**: https://docs.bullmq.io

### Learning Path
1. **Week 1-2**: NestJS fundamentals, TypeORM basics
2. **Week 3-4**: Advanced NestJS (Guards, Interceptors, Pipes)
3. **Week 5-6**: Redis patterns, caching strategies
4. **Week 7-8**: Elasticsearch, full-text search
5. **Week 9-10**: WebSocket, real-time features
6. **Week 11-12**: Performance optimization, deployment

### Recommended Tools
- **API Testing**: Postman, Insomnia
- **DB Client**: DBeaver, pgAdmin
- **Redis Client**: RedisInsight
- **ES Client**: Kibana
- **Monitoring**: Grafana, Prometheus
- **Load Testing**: K6, Apache Bench

---

## ✅ Checklist

### Backend
- [ ] NestJS project setup
- [ ] Database schema + migrations
- [ ] Authentication (JWT + Redis)
- [ ] Posts CRUD with relations
- [ ] Redis caching layer
- [ ] Elasticsearch integration
- [ ] WebSocket gateway
- [ ] Bull queues (email, image, search)
- [ ] File upload (S3/Cloudinary)
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests (>80% coverage)
- [ ] E2E tests
- [ ] Logging (Winston)
- [ ] Error tracking (Sentry)
- [ ] Docker setup

### Frontend
- [ ] Next.js project setup
- [ ] Authentication pages
- [ ] Post list/detail/create/edit
- [ ] Search page với filters
- [ ] Real-time comments/likes
- [ ] User profile pages
- [ ] Admin dashboard
- [ ] Image upload component
- [ ] Rich text editor
- [ ] Loading states & skeletons
- [ ] Error boundaries
- [ ] SEO optimization
- [ ] Responsive design
- [ ] Dark mode

### DevOps
- [ ] Docker Compose setup
- [ ] CI/CD pipeline
- [ ] Environment variables management
- [ ] Database backups
- [ ] SSL certificate
- [ ] Domain setup
- [ ] Monitoring setup
- [ ] Log aggregation

---

## 🎓 What You'll Learn

By completing this project, you will master:

✅ **Backend Architecture**: Modular design, dependency injection, SOLID principles  
✅ **Database Design**: Normalization, indexing, complex queries (JOINs, CTEs, Window functions)  
✅ **Caching Strategies**: Multi-level caching, invalidation patterns, Redis data structures  
✅ **Search Engines**: Elasticsearch mappings, analyzers, aggregations, full-text search  
✅ **Real-time Systems**: WebSocket, Redis Pub/Sub, event-driven architecture  
✅ **Background Jobs**: Queue systems, job scheduling, error handling  
✅ **Performance**: Query optimization, N+1 problem, connection pooling, load balancing  
✅ **Security**: JWT auth, role-based access, rate limiting, input validation  
✅ **Testing**: Unit tests, integration tests, E2E tests, mocking  
✅ **DevOps**: Docker, CI/CD, monitoring, logging, deployment  

Good luck! 🚀