# Modern Blog Platform (NestJS + Next.js)

## 1. Công nghệ Backend (NestJS)

- **Framework**: NestJS + TypeScript  
- **Database**: PostgreSQL + TypeORM / Prisma  
- **Caching & Rate Limiting**: Redis (cache bài viết, lưu refresh token, rate limiting)  
- **Search**: Elasticsearch (tìm kiếm nâng cao: title, content, tags)  
- **Authentication**: JWT (access + refresh token)  
- **File Upload**: Multer + AWS S3 / Cloudinary (ảnh bài viết, avatar)  
- **Real-time**: Socket.IO (comment/like notifications)  
- **API Documentation**: Swagger  
- **Validation & DTOs**: class-validator + class-transformer  

---

## 2. Công nghệ Frontend (Next.js)

- **Framework**: Next.js 13+ (App Router) + TypeScript  
- **Data Fetching**: React Query / SWR (cache, refetch)  
- **UI**: Tailwind CSS / Ant Design  
- **Form Validation**: React Hook Form + Zod  
- **Real-time**: Socket.IO Client  

---

## 3. Các màn / Page + API

| Page (Frontend)       | Backend API                     | Mục đích API |
|----------------------|---------------------------------|-------------|
| **Auth / Login / Register** | POST /auth/register          | Đăng ký user |
|                      | POST /auth/login                | Đăng nhập, trả access + refresh token |
|                      | POST /auth/refresh              | Lấy access token mới bằng refresh token (Redis lưu) |
|                      | POST /auth/logout               | Xóa refresh token trong Redis |
| **Home / Feed**      | GET /posts?limit=&page=&sort=   | Lấy danh sách bài viết có phân trang, sort theo mới nhất / popular |
|                      | GET /posts/search?q=            | Tìm kiếm bài viết (Elasticsearch) |
| **Post Detail**      | GET /posts/:id                  | Lấy bài viết chi tiết |
|                      | GET /posts/:id/comments         | Lấy comment của bài viết |
|                      | POST /posts/:id/comments        | Thêm comment (JWT required) |
|                      | POST /posts/:id/like            | Like bài viết (JWT required) |
|                      | WebSocket post/:id              | Realtime: comment mới, like update |
| **Create / Edit Post** | POST /posts                    | Tạo bài viết mới (JWT + Author role) |
|                      | PUT /posts/:id                  | Chỉnh sửa bài viết |
|                      | POST /upload                    | Upload ảnh (trả URL để lưu trong content) |
| **User Profile**     | GET /users/:id                  | Lấy thông tin user và bài viết của họ |
|                      | PUT /users/:id                  | Cập nhật profile (avatar, bio) |
| **Admin Dashboard**  | GET /admin/users                | Quản lý user (Admin role) |
|                      | GET /admin/posts                | Quản lý bài viết (Admin role) |
|                      | DELETE /admin/posts/:id         | Xóa bài viết (Admin role) |

---

## 4. Công nghệ / Feature theo Page

### Auth pages
- JWT, Redis (refresh token storage)  
- Validation, hashing mật khẩu  

### Home / Feed / Search
- Elasticsearch cho tìm kiếm  
- Redis cache feed / hot posts  
- Pagination, sorting  

### Post Detail / Comments
- WebSocket (realtime comment/like)  
- Like tracking, nested comments  
- File URLs từ S3 / Cloudinary nếu có ảnh  

### Create / Edit Post
- File upload (image), rich text editor (Quill.js hoặc Tiptap)  
- Role-based guard (Author/Admin)  

### Profile / Admin Dashboard
- Role-based authorization  
- CRUD user/posts  
- Statistics / analytics (optional)  

---

## 💡 Lưu ý
Blog
