import { AppDataSource } from '../config/db.config';
import { BlogEntity } from '../blogs/blog.entity';
import { User } from '../users/user.entity';
import { TagEntity } from '../tags/tag.entity';
import { Blog_Tags_Entity } from '../blog_tags/blog_tags.entity';
import { RoleEntity } from '../role/role.entity';
import * as bcrypt from 'bcrypt';

/**
 * Script để generate data test performance cho findAndPaginate()
 * 
 * Tạo:
 * - 100 users (nếu chưa có)
 * - 50 tags (nếu chưa có)
 * - 10,000 blogs với content dài (5KB mỗi post)
 * - Blog_Tags relationships (3-5 tags mỗi post)
 * 
 * Usage:
 * npm run seed:blog-performance
 * hoặc
 * ts-node -r tsconfig-paths/register src/scripts/generate-blog-performance-data.ts
 * 
 * Custom:
 * ts-node -r tsconfig-paths/register src/scripts/generate-blog-performance-data.ts [userCount] [blogCount] [tagCount]
 */

interface GenerateOptions {
  userCount?: number;
  blogCount?: number;
  tagCount?: number;
  tagsPerPost?: number;
  contentLength?: number;
}

async function generateBlogPerformanceData(options: GenerateOptions = {}) {
  const {
    userCount = 100,
    blogCount = 10000,
    tagCount = 50,
    tagsPerPost = 4, // Mỗi post có 4 tags
    contentLength = 5000, // 5KB content
  } = options;

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepo = AppDataSource.getRepository(User);
    const blogRepo = AppDataSource.getRepository(BlogEntity);
    const tagRepo = AppDataSource.getRepository(TagEntity);
    const blogTagRepo = AppDataSource.getRepository(Blog_Tags_Entity);
    const roleRepo = AppDataSource.getRepository(RoleEntity);

    // ============================================
    // 1. Đảm bảo có Role (thường là 'reader' hoặc 'author')
    // ============================================
    console.log('\n📋 Step 1: Checking/Creating Roles...');
    let defaultRole = await roleRepo.findOne({ where: { name: 'reader' } });
    if (!defaultRole) {
      defaultRole = roleRepo.create({ name: 'reader' });
      defaultRole = await roleRepo.save(defaultRole);
      console.log('✅ Created default role: reader');
    } else {
      console.log('✅ Role already exists');
    }

    // ============================================
    // 2. Tạo Users (nếu chưa đủ)
    // ============================================
    console.log(`\n👥 Step 2: Creating ${userCount} users...`);
    const existingUsers = await userRepo.find({ take: userCount });
    const usersToCreate = userCount - existingUsers.length;

    if (usersToCreate > 0) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      const newUsers: User[] = [];

      for (let i = 0; i < usersToCreate; i++) {
        const user = userRepo.create({
          name: `user_perf_${Date.now()}_${i}`,
          email: `user_perf_${Date.now()}_${i}@test.com`,
          password: hashedPassword,
          role: defaultRole,
          is_verify_email: true,
          image: '',
        });
        newUsers.push(user);
      }

      // Batch insert để tăng tốc
      const batchSize = 100;
      for (let i = 0; i < newUsers.length; i += batchSize) {
        const batch = newUsers.slice(i, i + batchSize);
        await userRepo.save(batch);
        console.log(`  ✅ Created ${Math.min(i + batchSize, newUsers.length)}/${newUsers.length} users`);
      }
    }

    const allUsers = await userRepo.find({ take: userCount, relations: ['role'] });
    console.log(`✅ Total users: ${allUsers.length}`);

    // ============================================
    // 3. Tạo Tags (nếu chưa có)
    // ============================================
    console.log(`\n🏷️  Step 3: Creating ${tagCount} tags...`);
    const existingTags = await tagRepo.find({ take: tagCount });
    const tagsToCreate = tagCount - existingTags.length;

    if (tagsToCreate > 0) {
      const tagNames = [
        'javascript', 'typescript', 'nestjs', 'nodejs', 'react', 'vue', 'angular',
        'python', 'java', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
        'database', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
        'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'devops', 'ci-cd',
        'frontend', 'backend', 'fullstack', 'mobile', 'web', 'api', 'rest',
        'graphql', 'microservices', 'architecture', 'design-patterns', 'testing',
        'security', 'performance', 'optimization', 'scalability', 'best-practices',
        'tutorial', 'guide', 'tips', 'tricks', 'news', 'update',
      ];

      const newTags: TagEntity[] = [];
      for (let i = 0; i < tagsToCreate; i++) {
        const tagName = tagNames[i] || `tag_${Date.now()}_${i}`;
        const tag = tagRepo.create({
          tag_name: tagName,
        });
        newTags.push(tag);
      }

      await tagRepo.save(newTags);
      console.log(`✅ Created ${newTags.length} tags`);
    }

    const allTags = await tagRepo.find({ take: tagCount });
    console.log(`✅ Total tags: ${allTags.length}`);

    // ============================================
    // 4. Tạo Blogs với content dài
    // ============================================
    console.log(`\n📝 Step 4: Creating ${blogCount} blogs with long content...`);
    const existingBlogsCount = await blogRepo.count();
    const blogsToCreate = blogCount - existingBlogsCount;

    if (blogsToCreate > 0) {
      const batchSize = 500; // Insert 500 blogs mỗi lần
      const totalBatches = Math.ceil(blogsToCreate / batchSize);

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const currentBatchSize = Math.min(batchSize, blogsToCreate - batchIndex * batchSize);
        const blogs: BlogEntity[] = [];

        for (let i = 0; i < currentBatchSize; i++) {
          const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
          const blogIndex = batchIndex * batchSize + i;

          const blog = blogRepo.create({
            title: `Performance Test Blog ${blogIndex} - ${generateRandomTitle()}`,
            content: generateLongContent(contentLength), // Content dài để test LIKE search
            excerpt: generateRandomText(200),
            status: 'published' as const, // Quan trọng: phải là 'published'
            user: randomUser,
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 100),
            reading_time: Math.floor(Math.random() * 10) + 5,
          });

          blogs.push(blog);
        }

        // Batch insert blogs
        const savedBlogs = await blogRepo.save(blogs);
        console.log(`  ✅ Created batch ${batchIndex + 1}/${totalBatches} (${savedBlogs.length} blogs)`);

        // ============================================
        // 5. Tạo Blog_Tags relationships
        // ============================================
        const blogTags: Blog_Tags_Entity[] = [];

        for (const blog of savedBlogs) {
          // Mỗi post có 3-5 tags ngẫu nhiên
          const numTags = Math.floor(Math.random() * (tagsPerPost - 2)) + 3; // 3-5 tags
          const selectedTags = getRandomTags(allTags, numTags);

          for (const tag of selectedTags) {
            const blogTag = blogTagRepo.create({
              posts: blog,
              tags: tag,
            });
            blogTags.push(blogTag);
          }
        }

        // Batch insert blog_tags
        await blogTagRepo.save(blogTags);
        console.log(`  ✅ Created ${blogTags.length} blog-tag relationships`);
      }
    }

    // ============================================
    // 6. Summary
    // ============================================
    console.log('\n📊 Summary:');
    const finalBlogCount = await blogRepo.count({ where: { status: 'published' } });
    const finalTagCount = await tagRepo.count();
    const finalUserCount = await userRepo.count();
    const finalBlogTagCount = await blogTagRepo.count();

    console.log(`  - Users: ${finalUserCount}`);
    console.log(`  - Tags: ${finalTagCount}`);
    console.log(`  - Published Blogs: ${finalBlogCount}`);
    console.log(`  - Blog-Tag Relationships: ${finalBlogTagCount}`);
    console.log(`  - Avg tags per post: ${(finalBlogTagCount / finalBlogCount).toFixed(2)}`);

    console.log('\n✅ Data generation completed!');
    console.log('\n🧪 Test query:');
    console.log('   GET /api/blog/posts?page=1&per_page=20&search=test');
    console.log('   GET /api/blog/posts?page=1&per_page=20&type=popular');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// ============================================
// Helper Functions
// ============================================

function generateRandomTitle(): string {
  const titles = [
    'Complete Guide to',
    'Understanding',
    'Deep Dive into',
    'Mastering',
    'Introduction to',
    'Advanced',
    'Best Practices for',
    'Getting Started with',
    'Comprehensive',
    'Ultimate Guide to',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateLongContent(length: number): string {
  // Tạo content dài với nhiều từ khóa để test LIKE search
  const keywords = [
    'javascript', 'typescript', 'nestjs', 'nodejs', 'react', 'vue',
    'database', 'postgresql', 'performance', 'optimization', 'scalability',
    'docker', 'kubernetes', 'microservices', 'api', 'rest', 'graphql',
    'testing', 'security', 'best-practices', 'architecture', 'design-patterns',
  ];

  const paragraphs = [];
  const wordsPerParagraph = 100;
  const numParagraphs = Math.ceil(length / (wordsPerParagraph * 6)); // ~6 chars per word

  for (let p = 0; p < numParagraphs; p++) {
    const words: string[] = [];
    for (let w = 0; w < wordsPerParagraph; w++) {
      if (Math.random() > 0.7) {
        // 30% chance để chèn keyword
        words.push(keywords[Math.floor(Math.random() * keywords.length)]);
      } else {
        words.push(generateRandomWord());
      }
    }
    paragraphs.push(words.join(' '));
  }

  return paragraphs.join('. ') + '.';
}

function generateRandomWord(): string {
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
    'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
    'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam',
    'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  ];
  return words[Math.floor(Math.random() * words.length)];
}

function generateRandomText(length: number): string {
  const words = generateRandomWord();
  return words.repeat(Math.ceil(length / words.length)).substring(0, length);
}

function getRandomTags(tags: TagEntity[], count: number): TagEntity[] {
  const shuffled = [...tags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ============================================
// Main Execution
// ============================================

if (require.main === module) {
  const args = process.argv.slice(2);
  const options: GenerateOptions = {};

  // Parse command line arguments
  if (args[0]) options.userCount = parseInt(args[0]);
  if (args[1]) options.blogCount = parseInt(args[1]);
  if (args[2]) options.tagCount = parseInt(args[2]);

  generateBlogPerformanceData(options)
    .then(() => {
      console.log('\n🎉 Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error);
      process.exit(1);
    });
}

export { generateBlogPerformanceData };

