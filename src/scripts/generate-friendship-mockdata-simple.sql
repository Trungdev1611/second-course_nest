-- ============================================
-- Script SQL đơn giản để generate mock data cho bảng friendship
-- ============================================
-- 
-- Cách sử dụng:
-- 1. Đảm bảo đã có ít nhất 20 users trong database
-- 2. Chạy script này trong psql hoặc pgAdmin
-- 3. Script sẽ tạo 100 bản ghi friendship ngẫu nhiên
--
-- ============================================

-- Xóa dữ liệu cũ (optional - uncomment nếu muốn xóa)
-- TRUNCATE TABLE friendship;

-- Generate 100 bản ghi friendship
-- Sử dụng CTE để tạo các cặp friendship ngẫu nhiên
WITH 
  -- Lấy danh sách user IDs
  user_ids AS (
    SELECT id FROM "user" ORDER BY id
  ),
  -- Tạo tất cả các cặp có thể (trừ trường hợp cùng user)
  all_pairs AS (
    SELECT 
      u1.id AS user_target_id,
      u2.id AS friend_id
    FROM user_ids u1
    CROSS JOIN user_ids u2
    WHERE u1.id != u2.id
  ),
  -- Chọn ngẫu nhiên 100 cặp
  random_pairs AS (
    SELECT DISTINCT
      user_target_id,
      friend_id
    FROM all_pairs
    ORDER BY RANDOM()
    LIMIT 100
  )
-- Insert vào bảng friendship
INSERT INTO friendship (user_target_id, friend_id)
SELECT user_target_id, friend_id
FROM random_pairs
ON CONFLICT (user_target_id, friend_id) DO NOTHING;

-- ============================================
-- Kiểm tra kết quả
-- ============================================

-- Đếm tổng số friendship
SELECT COUNT(*) AS total_friendships FROM friendship;

-- Xem một vài bản ghi mẫu
SELECT 
  f.user_target_id,
  u1.name AS user_name,
  f.friend_id,
  u2.name AS friend_name
FROM friendship f
LEFT JOIN "user" u1 ON u1.id = f.user_target_id
LEFT JOIN "user" u2 ON u2.id = f.friend_id
ORDER BY f.user_target_id
LIMIT 10;

-- Thống kê số lượng bạn bè của mỗi user
SELECT 
  u.id,
  u.name,
  COUNT(f.friend_id) AS friend_count
FROM "user" u
LEFT JOIN friendship f ON f.user_target_id = u.id
GROUP BY u.id, u.name
ORDER BY friend_count DESC
LIMIT 10;

