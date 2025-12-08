// data-seeds/main-seed.ts
import { DataSource } from 'typeorm';
import { seedRoles } from './role.seed';
import { seedUsers } from './user.seed';
import { seedTags } from './tag.seed';
import { seedBlogs } from './blog.seed';
import { seedComments } from './comment.seed';
import { seedLikes } from './like.seed';
import { seedBlogTags } from './blog-tags.seed';
import { AppDataSource } from 'src/config/db.config';

const dataSource = AppDataSource;

dataSource.initialize()
  .then(async () => {
    console.log('🌱 ============================================');
    console.log('🌱 BẮT ĐẦU SEEDING DATABASE');
    console.log('🌱 ============================================');
    console.log('');

    try {
      // 1. Roles (phải chạy đầu tiên)
      console.log('📋 Step 1: Seeding Roles...');
      await seedRoles(dataSource);
      console.log('');

      // 2. Users (500-1000)
      console.log('👥 Step 2: Seeding Users (750 users)...');
      await seedUsers(dataSource, 750);
      console.log('');

      // 3. Tags (500-1000)
      console.log('🏷️  Step 3: Seeding Tags (750 tags)...');
      await seedTags(dataSource, 750);
      console.log('');

      // 4. Blogs (10k)
      console.log('📝 Step 4: Seeding Blogs (10,000 blogs)...');
      await seedBlogs(dataSource, 10000);
      console.log('');

      // 5. Blog-Tags relationships
      console.log('🔗 Step 5: Seeding Blog-Tags relationships...');
      await seedBlogTags(dataSource);
      console.log('');

      // 6. Comments (500-1000)
      console.log('💬 Step 6: Seeding Comments (750 comments)...');
      await seedComments(dataSource, 750);
      console.log('');

      // 7. Likes (500-1000)
      console.log('❤️  Step 7: Seeding Likes (750 likes)...');
      await seedLikes(dataSource, 750);
      console.log('');

      // Summary
      console.log('🌱 ============================================');
      console.log('🌱 SEEDING HOÀN TẤT!');
      console.log('🌱 ============================================');
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding Error:', error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('❌ Database Connection Error:', err);
    process.exit(1);
  });

