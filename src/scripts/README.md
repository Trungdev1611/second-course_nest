# 📝 Scripts Documentation

Tài liệu ngắn gọn về các scripts generate data trong dự án.

---

## 1. Generate Blog Performance Data

**File:** `generate-blog-performance-data.ts`

**Mục đích:** Tạo data test performance cho query `findAndPaginate()` - blogs với content dài để test LIKE search.

**Cách chạy:**
```bash
# Mặc định: 100 users, 10000 blogs, 50 tags
npm run seed:blog-performance

# Custom: [userCount] [blogCount] [tagCount]
ts-node -r tsconfig-paths/register src/scripts/generate-blog-performance-data.ts 100 5000 30
```

**Bảng được thêm data:**
- `user` - Tạo users mới nếu chưa đủ
- `tags` - Tạo tags mới nếu chưa có
- `blogs` - Tạo blogs với status='published', content ~5KB
- `blog_tags` - Tạo relationships (3-5 tags mỗi post)
- `roles` - Tự động tạo role 'reader' nếu chưa có

---

## 2. Generate Friendship Mock Data

**File:** `generate-friendship-mockdata.ts`

**Mục đích:** Tạo mock data cho bảng friendship để test tính năng bạn bè.

**Cách chạy:**
```bash
# Mặc định: 100 friendships
npm run seed:friendship

# Custom số lượng
ts-node -r tsconfig-paths/register src/scripts/generate-friendship-mockdata.ts 200
```

**Bảng được thêm data:**
- `friendship` - Tạo relationships giữa users

**Yêu cầu:** Cần có ít nhất 20 users trong database.

---

## 3. Update Blogs Content

**File:** `update-blogs-content.ts`

**Mục đích:** Cập nhật content cho blogs hiện có với nội dung thực tế về programming/tech (100+ templates).

**Cách chạy:**
```bash
npm run update:blogs
```

**Bảng được update:**
- `blogs` - Update cột: `title`, `content`, `excerpt`

**Lưu ý:** Script sẽ **ghi đè** content của tất cả blogs hiện có.

---

## 📋 Tổng hợp lệnh

```bash
# Generate blog performance data
npm run seed:blog-performance

# Generate friendship data
npm run seed:friendship

# Update blogs content
npm run update:blogs
```

---

## ⚠️ Lưu ý chung

- Scripts **KHÔNG** xóa dữ liệu cũ (trừ `update-blogs-content` ghi đè)
- Đảm bảo đã chạy migrations trước khi chạy scripts
- Với số lượng lớn (> 10K blogs), script có thể mất 5-10 phút
