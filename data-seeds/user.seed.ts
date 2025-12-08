// data-seeds/user.seed.ts
import { User } from 'src/users/user.entity';
import { RoleEntity } from 'src/role/role.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export const seedUsers = async (dataSource: DataSource, count: number = 750) => {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(RoleEntity);

  // Lấy role mặc định
  let defaultRole = await roleRepo.findOne({ where: { name: 'USER' } });
  if (!defaultRole) {
    defaultRole = await roleRepo.findOne({ where: { name: 'reader' } });
  }
  if (!defaultRole) {
    throw new Error('Không tìm thấy role USER hoặc reader. Vui lòng chạy seed roles trước.');
  }

  const existingUsers = await userRepo.count();
  const usersToCreate = Math.max(0, count - existingUsers);

  if (usersToCreate <= 0) {
    console.log(`⚠️  Đã có đủ ${existingUsers} users (yêu cầu: ${count})`);
    return;
  }

  console.log(`👥 Tạo ${usersToCreate} users...`);
  const hashedPassword = await bcrypt.hash('password123', 10);
  const batchSize = 100;
  const newUsers: User[] = [];

  for (let i = 0; i < usersToCreate; i++) {
    const user = userRepo.create({
      name: `user_${Date.now()}_${i}`,
      email: `user_${Date.now()}_${i}@example.com`,
      password: hashedPassword,
      role: defaultRole,
      is_verify_email: Math.random() > 0.3, // 70% verified
      image: `https://i.pravatar.cc/150?img=${i % 70}`,
    });
    newUsers.push(user);
  }

  // Batch insert
  for (let i = 0; i < newUsers.length; i += batchSize) {
    const batch = newUsers.slice(i, i + batchSize);
    await userRepo.save(batch);
    console.log(`  ✅ Created ${Math.min(i + batchSize, newUsers.length)}/${newUsers.length} users`);
  }

  const totalUsers = await userRepo.count();
  console.log(`✅ Total users: ${totalUsers}`);
};

