// data-seeds/blog.seed.ts
import { BlogEntity } from 'src/blogs/blog.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';

export const seedBlogs = async (dataSource: DataSource, count: number = 10000) => {
  const blogRepo = dataSource.getRepository(BlogEntity);
  const userRepo = dataSource.getRepository(User);

  const existingBlogs = await blogRepo.count();
  const blogsToCreate = Math.max(0, count - existingBlogs);

  if (blogsToCreate <= 0) {
    console.log(`⚠️  Đã có đủ ${existingBlogs} blogs (yêu cầu: ${count})`);
    return;
  }

  console.log(`📝 Tạo ${blogsToCreate} blogs...`);

  // Lấy tất cả users
  const allUsers = await userRepo.find({ take: 1000 });
  if (allUsers.length === 0) {
    throw new Error('Không có users nào. Vui lòng chạy seed users trước.');
  }

  const titles = [
    'Complete Guide to', 'Understanding', 'Deep Dive into', 'Mastering', 'Introduction to',
    'Advanced', 'Best Practices for', 'Getting Started with', 'Comprehensive', 'Ultimate Guide to',
    'Exploring', 'Building', 'Creating', 'Implementing', 'Optimizing', 'Scaling', 'Deploying',
    'Testing', 'Debugging', 'Refactoring', 'Architecting', 'Designing', 'Developing',
  ];

  const topics = [
    'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Docker', 'Kubernetes',
    'React', 'Vue', 'Angular', 'Node.js', 'API Design', 'Microservices', 'Serverless',
    'Database Optimization', 'Caching Strategies', 'Search Implementation', 'Authentication',
    'Authorization', 'Performance Tuning', 'Scalability', 'Security Best Practices',
  ];

  const statuses: Array<'draft' | 'published' | 'archived'> = ['draft', 'published', 'archived'];
  const statusWeights = [0.1, 0.85, 0.05]; // 10% draft, 85% published, 5% archived

  function getRandomStatus(): 'draft' | 'published' | 'archived' {
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < statuses.length; i++) {
      sum += statusWeights[i];
      if (rand < sum) return statuses[i];
    }
    return 'published';
  }

  function generateContent(length: number = 5000): string {
    const keywords = [
      'javascript', 'typescript', 'nestjs', 'nodejs', 'react', 'vue', 'database', 'postgresql',
      'performance', 'optimization', 'scalability', 'docker', 'kubernetes', 'microservices',
      'api', 'rest', 'graphql', 'testing', 'security', 'best-practices', 'architecture',
    ];

    const words = [];
    for (let i = 0; i < length / 6; i++) { // ~6 chars per word
      if (Math.random() > 0.7) {
        words.push(keywords[Math.floor(Math.random() * keywords.length)]);
      } else {
        words.push(`word${i}`);
      }
    }
    return words.join(' ');
  }

  function generateExcerpt(): string {
    const excerpts = [
      'This article covers everything you need to know about',
      'Learn how to implement and optimize',
      'A comprehensive guide to understanding',
      'Discover best practices and advanced techniques for',
      'Step-by-step tutorial on building',
    ];
    return excerpts[Math.floor(Math.random() * excerpts.length)];
  }

  const batchSize = 500;
  const totalBatches = Math.ceil(blogsToCreate / batchSize);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const currentBatchSize = Math.min(batchSize, blogsToCreate - batchIndex * batchSize);
    const blogs: BlogEntity[] = [];

    for (let i = 0; i < currentBatchSize; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const blogIndex = batchIndex * batchSize + i;
      const titlePrefix = titles[Math.floor(Math.random() * titles.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];

      const blog = blogRepo.create({
        title: `${titlePrefix} ${topic} - Part ${blogIndex + 1}`,
        content: generateContent(5000),
        excerpt: `${generateExcerpt()} ${topic.toLowerCase()}.`,
        status: getRandomStatus(),
        user: randomUser,
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 500),
        reading_time: Math.floor(Math.random() * 15) + 5,
        thumbnail: `https://picsum.photos/800/400?random=${blogIndex}`,
      });

      blogs.push(blog);
    }

    const savedBlogs = await blogRepo.save(blogs);
    console.log(`  ✅ Created batch ${batchIndex + 1}/${totalBatches} (${savedBlogs.length} blogs)`);
  }

  const totalBlogs = await blogRepo.count();
  const publishedBlogs = await blogRepo.count({ where: { status: 'published' } });
  console.log(`✅ Total blogs: ${totalBlogs} (Published: ${publishedBlogs})`);
};

