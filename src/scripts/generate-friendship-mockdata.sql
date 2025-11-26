-- Script để generate 100 bản ghi mock data cho bảng friendship
-- Đảm bảo có ít nhất 20 users trong database trước khi chạy script này

-- Xóa dữ liệu cũ (optional - comment nếu muốn giữ lại)
-- DELETE FROM friendship;

-- Generate 100 bản ghi friendship
-- Sử dụng CTE để lấy danh sách user IDs và tạo các cặp friendship ngẫu nhiên
WITH 
  -- Lấy danh sách user IDs có sẵn
  user_ids AS (
    SELECT id FROM "user" ORDER BY id
  ),
  -- Tạo các cặp (user_target_id, friend_id) ngẫu nhiên
  -- Đảm bảo user_target_id != friend_id và không trùng lặp
  friendship_pairs AS (
    SELECT DISTINCT
      u1.id AS user_target_id,
      u2.id AS friend_id
    FROM user_ids u1
    CROSS JOIN user_ids u2
    WHERE u1.id != u2.id
    ORDER BY RANDOM()
    LIMIT 100
  )
-- Insert vào bảng friendship
INSERT INTO friendship (user_target_id, friend_id)
SELECT user_target_id, friend_id
FROM friendship_pairs
ON CONFLICT (user_target_id, friend_id) DO NOTHING;

-- Kiểm tra số lượng bản ghi đã insert
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

