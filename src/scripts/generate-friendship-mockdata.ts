import { AppDataSource } from '../config/db.config';

/**
 * Script để generate mock data cho bảng friendship
 * 
 * Usage:
 * npm run seed:friendship
 * hoặc
 * ts-node -r tsconfig-paths/register src/scripts/generate-friendship-mockdata.ts
 */

async function generateFriendshipMockData(count: number = 100) {
  
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Lấy danh sách user IDs
    const userIds = await AppDataSource.query(`
      SELECT id FROM "user" ORDER BY id
    `);

    if (userIds.length < 2) {
      throw new Error('Cần ít nhất 2 users trong database để tạo friendship');
    }

    console.log(`📊 Tìm thấy ${userIds.length} users trong database`);

    const userIdArray = userIds.map((u: any) => u.id);
    const friendships: Array<{ user_target_id: number; friend_id: number }> = [];
    const usedPairs = new Set<string>();

    // Generate các cặp friendship ngẫu nhiên
    let attempts = 0;
    const maxAttempts = count * 10; // Giới hạn số lần thử để tránh vòng lặp vô hạn

    while (friendships.length < count && attempts < maxAttempts) {
      attempts++;
      
      // Chọn 2 user IDs ngẫu nhiên
      const user1Index = Math.floor(Math.random() * userIdArray.length);
      const user2Index = Math.floor(Math.random() * userIdArray.length);
      
      const userTargetId = userIdArray[user1Index];
      const friendId = userIdArray[user2Index];

      // Bỏ qua nếu cùng một user
      if (userTargetId === friendId) continue;

      // Tạo key để check duplicate (đảm bảo không trùng cả 2 chiều)
      const pairKey1 = `${userTargetId}-${friendId}`;
      const pairKey2 = `${friendId}-${userTargetId}`;

      if (!usedPairs.has(pairKey1) && !usedPairs.has(pairKey2)) {
        friendships.push({ user_target_id: userTargetId, friend_id: friendId });
        usedPairs.add(pairKey1);
        usedPairs.add(pairKey2);
      }
    }

    if (friendships.length === 0) {
      throw new Error('Không thể tạo friendship data. Có thể đã hết các cặp có thể tạo.');
    }

    console.log(`🔄 Đang insert ${friendships.length} bản ghi friendship...`);

    // Insert vào database
    const values = friendships.map(
      (f) => `(${f.user_target_id}, ${f.friend_id})`
    ).join(',');

    const insertQuery = `
      INSERT INTO friendship (user_target_id, friend_id)
      VALUES ${values}
      ON CONFLICT (user_target_id, friend_id) DO NOTHING
    `;

    await AppDataSource.query(insertQuery);

    // Kiểm tra kết quả
    const [result] = await AppDataSource.query(`
      SELECT COUNT(*) as total FROM friendship
    `);

    console.log(`✅ Đã tạo thành công! Tổng số friendship trong database: ${result.total}`);

    // Hiển thị một vài bản ghi mẫu
    const samples = await AppDataSource.query(`
      SELECT 
        f.user_target_id,
        u1.name AS user_name,
        f.friend_id,
        u2.name AS friend_name
      FROM friendship f
      LEFT JOIN "user" u1 ON u1.id = f.user_target_id
      LEFT JOIN "user" u2 ON u2.id = f.friend_id
      ORDER BY f.user_target_id
      LIMIT 5
    `);

    console.log('\n📋 Mẫu dữ liệu:');
    console.table(samples);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  }
}

// Chạy script
const count = process.argv[2] ? parseInt(process.argv[2]) : 100;
generateFriendshipMockData(count);

