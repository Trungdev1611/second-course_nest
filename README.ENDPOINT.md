# Blog Platform - Complete API Endpoints

## 🔐 Authentication & Authorization

### Public Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | `{ email, username, password, fullName }` | `{ user, accessToken, refreshToken }` | ✅
| POST | `/api/auth/login` | Đăng nhập | `{ email, password }` | `{ accessToken, refreshToken, user }` |    ✅
| POST | `/api/auth/refresh` | Lấy access token mới từ refresh token | `{ refreshToken }` | `{ accessToken }` |
| POST | `/api/auth/forgot-password` | Gửi email reset mật khẩu | `{ email }` | `{ message: "Email sent" }` |✅
| POST | `/api/auth/reset-password` | Reset mật khẩu với token | `{ token, newPassword }` | `{ message: "Password reset" }` |✅
| POST | `/api/auth/verify-email` | Xác thực email | `{ token }` | `{ message: "Email verified" }` | ✅

### Protected Endpoints (Require JWT)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | - | `{ user }` |✅
| POST | `/api/auth/logout` | Đăng xuất (xóa refresh token) | - | `{ message: "Logged out" }` |
| PUT | `/api/auth/change-password` | Đổi mật khẩu | `{ currentPassword, newPassword }` | `{ message: "Password changed" }` |✅

---

## 👤 Users Management

### Public Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/users/:id` | Lấy thông tin public profile của user | - | `{ user, stats }` |✅
| GET | `/api/users/:id/posts` | Lấy danh sách bài viết public của user | `?page=1&limit=20&status=published` | `{ data: [posts], meta }` |✅
| GET | `/api/users/:id/stats` | Thống kê user (posts, followers, following count) | - | `{ postCount, followersCount, followingCount, totalViews }` |✅
| GET | `/api/users/:id/followers` | Danh sách followers | `?page=1&limit=20` | `{ data: [users], meta }` |✅
| GET | `/api/users/:id/following` | Danh sách following | `?page=1&limit=20` | `{ data: [users], meta }` |✅
| GET | `/api/users/search` | Tìm kiếm users | `?q=john&limit=10` | `{ data: [users] }` |✅

### Protected Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| PUT | `/api/users/:id` | Cập nhật profile (chỉ owner) | `{ fullName, bio, website }` | `{ user }` |
| POST | `/api/users/:id/avatar` | Upload avatar (chỉ owner) | `FormData: { file }` | `{ avatarUrl }` |✅
| POST | `/api/users/:id/follow` | Follow user | - | `{ message: "Followed", isFollowing: true }` |✅
| DELETE | `/api/users/:id/follow` | Unfollow user | - | `{ message: "Unfollowed", isFollowing: false }` |✅
| GET | `/api/users/me/activity` | Lấy activity feed của user (posts, comments, likes) | `?page=1&limit=20` | `{ data: [activities], meta }` |

---

## 📝 Posts Management

### Public Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/posts` | Danh sách bài viết (published) | `?page=1&limit=20&sort=newest\|popular\|trending&tag=javascript` | `{ data: [posts], meta }` | |✅
| GET | `/api/posts/:id` | Chi tiết bài viết | - | `{ post, author, tags, stats }` |
| GET | `/api/posts/slug/:slug` | Lấy bài viết theo slug | - | `{ post }` |
| GET | `/api/posts/trending` | Bài viết trending | `?period=24h\|7d\|30d&limit=10` | `{ data: [posts] }` |
| GET | `/api/posts/featured` | Bài viết nổi bật (editor's pick) | `?limit=5` | `{ data: [posts] }` |
| GET | `/api/posts/:id/related` | Bài viết liên quan (dựa trên tags) | `?limit=5` | `{ data: [posts] }` |
| POST | `/api/posts/:id/view` | Tăng view count (throttled) | - | `{ viewCount }` |✅

### Protected Endpoints (Author/Admin)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/posts` | Tạo bài viết mới | `{ title, content, excerpt, coverImageUrl, tags, status }` | `{ post }` |
| PUT | `/api/posts/:id` | Cập nhật bài viết (owner/admin) | `{ title, content, excerpt, coverImageUrl, tags }` | `{ post }` |
| DELETE | `/api/posts/:id` | Soft delete bài viết (owner/admin) | - | `{ message: "Post deleted" }` |
| POST | `/api/posts/:id/publish` | Publish draft | - | `{ post, publishedAt }` |
| POST | `/api/posts/:id/unpublish` | Chuyển về draft | - | `{ post, status: "draft" }` |
| GET | `/api/posts/me/drafts` | Lấy drafts của user | `?page=1&limit=20` | `{ data: [posts], meta }` |

---

## 🔍 Search (Elasticsearch)

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/search` | Full-text search bài viết | `?q=react hooks&page=1&limit=20` | `{ data: [posts with highlights], meta }` |✅
| GET | `/api/search/suggest` | Autocomplete suggestions | `?q=rea` | `{ suggestions: ["react", "redux", "react native"] }` |✅
| GET | `/api/search/advanced` | Advanced search với filters | `?q=react&tags=javascript,tutorial&author=john&dateFrom=2024-01-01&dateTo=2024-12-31` | `{ data: [posts], meta, aggregations }` |
| GET | `/api/search/related/:id` | Tìm bài viết liên quan (More Like This) | `?limit=5` | `{ data: [posts] }` |✅

### Admin Only

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/search/reindex` | Reindex tất cả posts vào Elasticsearch | - | `{ message: "Reindexing started", jobId }` |
| GET | `/api/search/stats` | Elasticsearch statistics | - | `{ indexSize, documentCount, health }` |

---

## 💬 Comments

### Public Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/posts/:id/comments` | Lấy comments của bài viết (nested) | `?page=1&limit=20&sort=newest\|oldest\|popular` | `{ data: [comments tree], meta }` |✅
| GET | `/api/comments/:id/replies` | Lấy replies của comment | `?page=1&limit=10` | `{ data: [comments], meta }` |✅

### Protected Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/posts/:id/comments` | Thêm comment mới | `{ content, parentId? }` | `{ comment }` |✅
| PUT | `/api/comments/:id` | Sửa comment (owner/admin) | `{ content }` | `{ comment }` | |✅
| DELETE | `/api/comments/:id` | Soft delete comment (owner/admin) | - | `{ message: "Comment deleted" }` |
| POST | `/api/comments/:id/reply` | Reply comment (shorthand) | `{ content }` | `{ comment }` | |✅

---

## ❤️ Likes

### Protected Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/posts/:id/like` | Like bài viết | - | `{ message: "Liked", likeCount, isLiked: true }` | đã lấy like cùng với post ✅
| DELETE | `/api/posts/:id/like` | Unlike bài viết | - | `{ message: "Unliked", likeCount, isLiked: false }` | đã có api like - unlike ✅
| POST | `/api/comments/:id/like` | Like comment | - | `{ message: "Liked", likeCount, isLiked: true }` | đã tính số likes trong comment  post/:id/comments ✅
| DELETE | `/api/comments/:id/like` | Unlike comment | - | `{ message: "Unliked", likeCount, isLiked: false }` | đã có api like - unlike ✅
| GET | `/api/posts/:id/likes` | Danh sách users đã like | `?page=1&limit=20` | `{ data: [users], meta }` | đã trả về user trong api post/:id/comments ✅

---

## 🏷️ Tags

### Public Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/tags` | Danh sách tất cả tags | `?sort=name\|popular` | `{ data: [tags] }` |✅

| GET | `/api/tags/popular` | Top tags (most used) | `?limit=20` | `{ data: [{ tag, postCount }] }` |✅
| GET | `/api/tags/:slug` | Chi tiết tag | - | `{ tag, postCount }` |
| GET | `/api/tags/:slug/posts` | Bài viết theo tag | `?page=1&limit=20` | `{ data: [posts], meta }` |

### Admin Only

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/tags` | Tạo tag mới | `{ name }` | `{ tag }` |✅
| PUT | `/api/tags/:id` | Cập nhật tag | `{ name }` | `{ tag }` |✅
| DELETE | `/api/tags/:id` | Xóa tag (sẽ xóa relations) | - | `{ message: "Tag deleted" }` |✅

| POST | `/api/tags/merge` | Merge tags (gộp tag) | `{ sourceId, targetId }` | `{ message: "Tags merged" }` |

---

## 🔖 Bookmarks

### Protected Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/bookmarks` | Lấy reading list của user | `?page=1&limit=20` | `{ data: [posts], meta }` |
| POST | `/api/posts/:id/bookmark` | Bookmark bài viết | - | `{ message: "Bookmarked", isBookmarked: true }` |
| DELETE | `/api/posts/:id/bookmark` | Remove bookmark | - | `{ message: "Removed", isBookmarked: false }` |
| GET | `/api/bookmarks/check/:id` | Check xem đã bookmark chưa | - | `{ isBookmarked: true\|false }` |

---

## 🔔 Notifications

### Protected Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/notifications` | Lấy danh sách notifications | `?page=1&limit=20&unread=true` | `{ data: [notifications], meta }` |
| GET | `/api/notifications/unread-count` | Đếm notifications chưa đọc | - | `{ count: 5 }` |
| PUT | `/api/notifications/:id/read` | Đánh dấu đã đọc | - | `{ message: "Marked as read" }` |
| PUT | `/api/notifications/read-all` | Đánh dấu tất cả đã đọc | - | `{ message: "All marked as read" }` |
| DELETE | `/api/notifications/:id` | Xóa notification | - | `{ message: "Deleted" }` |
| DELETE | `/api/notifications/clear-all` | Xóa tất cả notifications | - | `{ message: "All cleared" }` |

---

## 📤 File Upload

### Protected Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/upload/image` | Upload single image | `FormData: { file }` | `{ url, key, size }` |
| POST | `/api/upload/images` | Upload multiple images | `FormData: { files[] }` | `{ data: [{ url, key }] }` |
| DELETE | `/api/upload/:key` | Xóa image từ S3 | - | `{ message: "Image deleted" }` |
| POST | `/api/upload/avatar` | Upload avatar (resize + optimize) | `FormData: { file }` | `{ url, thumbnailUrl }` |

---

## 👨‍💼 Admin Dashboard

### Admin Only Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/admin/stats` | Tổng quan dashboard | - | `{ users, posts, comments, views, trends }` |
| GET | `/api/admin/analytics` | Analytics data | `?period=7d\|30d\|90d` | `{ postsPerDay, usersPerDay, topAuthors, topTags }` |

### User Management

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/admin/users` | Danh sách users | `?page=1&limit=20&role=all\|author\|admin&search=john` | `{ data: [users], meta }` |
| GET | `/api/admin/users/:id` | Chi tiết user | - | `{ user, stats, recentPosts, recentComments }` |
| PUT | `/api/admin/users/:id/role` | Thay đổi role | `{ role: "reader"\|"author"\|"admin" }` | `{ user }` |
| PUT | `/api/admin/users/:id/ban` | Ban user | `{ reason, duration? }` | `{ message: "User banned" }` |
| PUT | `/api/admin/users/:id/unban` | Unban user | - | `{ message: "User unbanned" }` |
| DELETE | `/api/admin/users/:id` | Soft delete user | - | `{ message: "User deleted" }` |

### Post Management

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/admin/posts` | Danh sách posts (all status) | `?page=1&limit=20&status=all\|draft\|published\|archived` | `{ data: [posts], meta }` |
| PUT | `/api/admin/posts/:id/feature` | Đánh dấu featured post | `{ featured: true\|false }` | `{ post }` |
| PUT | `/api/admin/posts/:id/status` | Thay đổi status | `{ status: "published"\|"archived" }` | `{ post }` |
| DELETE | `/api/admin/posts/:id` | Force delete post | - | `{ message: "Post deleted permanently" }` |

### Comment Management

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/admin/comments` | Danh sách comments | `?page=1&limit=20&flagged=true` | `{ data: [comments], meta }` |
| PUT | `/api/admin/comments/:id/flag` | Flag comment (spam/abuse) | `{ reason }` | `{ message: "Comment flagged" }` |
| DELETE | `/api/admin/comments/:id` | Force delete comment | - | `{ message: "Comment deleted" }` |

---

## 📊 Analytics & Stats

### Public Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/stats/popular` | Popular posts stats | `?period=24h\|7d\|30d&limit=10` | `{ data: [{ post, views, likes }] }` |
| GET | `/api/stats/trending-tags` | Trending tags | `?limit=10` | `{ data: [{ tag, growthRate, postCount }] }` |

### Protected Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/stats/me/overview` | Overview stats của user | - | `{ totalViews, totalLikes, totalComments, followerGrowth }` |
| GET | `/api/stats/me/posts` | Stats từng bài viết | `?period=7d\|30d\|all` | `{ data: [{ post, views, likes, comments }] }` |

---

## 🎯 Feed & Recommendations

### Protected Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/feed` | Personalized feed | `?page=1&limit=20` | `{ data: [posts from following + recommended] }` |
| GET | `/api/feed/following` | Feed từ users đang follow | `?page=1&limit=20` | `{ data: [posts], meta }` |
| GET | `/api/feed/recommended` | Recommended posts (based on interests) | `?page=1&limit=20` | `{ data: [posts], meta }` |

---

## 🔧 System & Health

### Public Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/health` | Health check | `{ status: "ok", timestamp, uptime }` |
| GET | `/api/health/db` | Database health | `{ status: "ok", latency }` |
| GET | `/api/health/redis` | Redis health | `{ status: "ok", latency }` |
| GET | `/api/health/elasticsearch` | Elasticsearch health | `{ status: "ok", cluster_status }` |

---

## 📡 WebSocket Events

### Namespace: `/posts/:postId`

**Client → Server:**
- `join-post` - Join room để nhận events của post
- `leave-post` - Leave room

**Server → Client:**
- `comment:new` - Có comment mới: `{ comment, author }`
- `comment:update` - Comment được edit: `{ commentId, content }`
- `comment:delete` - Comment bị xóa: `{ commentId }`
- `like:update` - Like count thay đổi: `{ likeCount }`
- `view:update` - View count update: `{ viewCount }`

### Namespace: `/notifications`

**Client → Server:**
- `subscribe` - Subscribe notifications

**Server → Client:**
- `notification:new` - Notification mới: `{ notification }`
- `unread-count:update` - Unread count thay đổi: `{ count }`

---

## 🔑 Rate Limiting Rules

| Endpoint Pattern | Limit | Window |
|-----------------|-------|--------|
| `/api/auth/login` | 5 requests | 15 minutes |
| `/api/auth/register` | 3 requests | 1 hour |
| `/api/posts` (POST) | 10 posts | 1 hour |
| `/api/comments` (POST) | 30 comments | 1 hour |
| `/api/upload/*` | 20 uploads | 1 hour |
| `/api/search` | 100 requests | 1 minute |
| All other endpoints | 100 requests | 1 minute |

---

## 📋 Response Format Standards

### Success Response
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Common HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## 🔐 Authentication Headers

```http
Authorization: Bearer <access_token>
```

### Refresh Token (in httpOnly cookie or header)
```http
Cookie: refreshToken=<refresh_token>
```
or
```http
X-Refresh-Token: <refresh_token>
```

---

**Total Endpoints: 120+**
- Public: ~40
- Protected (User): ~50
- Admin Only: ~30

**WebSocket Namespaces: 2**
- `/posts/:postId`
- `/notifications`


Sẵn sàng cho backend
Giao diện đã sẵn sàng. Khi backend implement các API endpoints:
GET /search - Full-text search
GET /search/suggest - Autocomplete
GET /search/advanced - Advanced search
GET /search/related/:id - Related posts