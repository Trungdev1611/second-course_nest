# Generate Mock Data cho bảng Friendship

Scripts để tạo mock data cho bảng `friendship` với khoảng 100 bản ghi.

## 📋 Yêu cầu

- Đã có ít nhất **20 users** trong database (để đảm bảo có đủ cặp để tạo)
- Database đã chạy migrations (bảng `friendship` đã được tạo)

## 🚀 Cách sử dụng

### Cách 1: Dùng TypeScript Script (Khuyến nghị)

```bash
# Tạo 100 bản ghi (mặc định)
npm run seed:friendship

# Hoặc chỉ định số lượng cụ thể
ts-node -r tsconfig-paths/register src/scripts/generate-friendship-mockdata.ts 50
```

**Ưu điểm:**
- Tự động kiểm tra số lượng users
- Hiển thị kết quả chi tiết
- Xử lý duplicate tự động
- Dễ tích hợp vào CI/CD

### Cách 2: Dùng SQL Script (Đơn giản)

```bash
# Chạy file SQL trong psql
psql -U postgres -d fullstack -f src/scripts/generate-friendship-mockdata-simple.sql

# Hoặc copy paste vào pgAdmin
```

**Ưu điểm:**
- Nhanh, không cần compile TypeScript
- Dễ customize trực tiếp trong SQL
- Có thể chạy từ bất kỳ SQL client nào

### Cách 3: SQL Script với CTE (Nâng cao)

```bash
psql -U postgres -d fullstack -f src/scripts/generate-friendship-mockdata.sql
```

## 📊 Cấu trúc dữ liệu

Bảng `friendship` có cấu trúc:
- `user_target_id` (integer) - ID của user
- `friend_id` (integer) - ID của bạn bè
- Primary Key: `(user_target_id, friend_id)`

**Lưu ý:**
- Mỗi cặp `(user_target_id, friend_id)` là unique
- `user_target_id` != `friend_id` (không thể kết bạn với chính mình)
- Friendship là **one-way** (nếu A kết bạn B, không tự động B kết bạn A)

## 🔍 Kiểm tra kết quả

Sau khi chạy script, kiểm tra:

```sql
-- Đếm tổng số friendship
SELECT COUNT(*) FROM friendship;

-- Xem một vài bản ghi mẫu
SELECT 
  f.user_target_id,
  u1.name AS user_name,
  f.friend_id,
  u2.name AS friend_name
FROM friendship f
LEFT JOIN "user" u1 ON u1.id = f.user_target_id
LEFT JOIN "user" u2 ON u2.id = f.friend_id
LIMIT 10;

-- Thống kê số lượng bạn bè của mỗi user
SELECT 
  u.id,
  u.name,
  COUNT(f.friend_id) AS friend_count
FROM "user" u
LEFT JOIN friendship f ON f.user_target_id = u.id
GROUP BY u.id, u.name
ORDER BY friend_count DESC;
```

## ⚠️ Lưu ý

1. **Xóa dữ liệu cũ**: Nếu muốn xóa dữ liệu cũ trước khi insert, uncomment dòng `TRUNCATE TABLE friendship;` hoặc `DELETE FROM friendship;` trong SQL script.

2. **Số lượng users**: Nếu có ít users (< 10), có thể không tạo đủ 100 bản ghi. Script sẽ tạo tối đa số lượng có thể.

3. **Duplicate**: Script tự động xử lý duplicate bằng `ON CONFLICT DO NOTHING`, nên có thể chạy nhiều lần an toàn.

4. **Performance**: Với số lượng lớn (> 1000), nên dùng batch insert hoặc transaction.

## 🛠️ Customize

### Thay đổi số lượng bản ghi

**TypeScript:**
```bash
ts-node -r tsconfig-paths/register src/scripts/generate-friendship-mockdata.ts 200
```

**SQL:**
Sửa `LIMIT 100` thành số lượng mong muốn trong file SQL.

### Tạo friendship 2 chiều (bidirectional)

Nếu muốn tạo friendship 2 chiều (A kết bạn B thì B cũng kết bạn A), thêm:

```sql
-- Sau khi insert, tạo reverse friendships
INSERT INTO friendship (user_target_id, friend_id)
SELECT friend_id, user_target_id
FROM friendship
ON CONFLICT (user_target_id, friend_id) DO NOTHING;
```

## 📝 Example Output

```
✅ Database connected
📊 Tìm thấy 25 users trong database
🔄 Đang insert 100 bản ghi friendship...
✅ Đã tạo thành công! Tổng số friendship trong database: 100

📋 Mẫu dữ liệu:
┌─────────────┬──────────────┬───────────┬─────────────┐
│ user_target │  user_name   │ friend_id │ friend_name │
├─────────────┼──────────────┼───────────┼─────────────┤
│      1      │   user-1     │     5     │   user-5    │
│      1      │   user-1     │    12     │   user-12   │
│      2      │   user-2     │     8     │   user-8    │
└─────────────┴──────────────┴───────────┴─────────────┘
```

