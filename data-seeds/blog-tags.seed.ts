// data-seeds/blog-tags.seed.ts
import { Blog_Tags_Entity } from 'src/blog_tags/blog_tags.entity';
import { BlogEntity } from 'src/blogs/blog.entity';
import { TagEntity } from 'src/tags/tag.entity';
import { DataSource } from 'typeorm';

export const seedBlogTags = async (dataSource: DataSource) => {
  const blogTagRepo = dataSource.getRepository(Blog_Tags_Entity);
  const blogRepo = dataSource.getRepository(BlogEntity);
  const tagRepo = dataSource.getRepository(TagEntity);

  console.log(`🏷️  Tạo blog-tag relationships...`);

  // Lấy published blogs và tags
  const publishedBlogs = await blogRepo.find({ 
    where: { status: 'published' },
    take: 10000 
  });
  const allTags = await tagRepo.find({ take: 1000 });

  if (publishedBlogs.length === 0) {
    console.log('⚠️  Không có published blogs. Bỏ qua seed blog-tags.');
    return;
  }

  if (allTags.length === 0) {
    console.log('⚠️  Không có tags. Bỏ qua seed blog-tags.');
    return;
  }

  // Kiểm tra blogs đã có tags chưa
  const blogsWithTags = await blogTagRepo
    .createQueryBuilder('bt')
    .select('DISTINCT bt.postsId', 'blogId')
    .getRawMany();
  
  const blogsWithTagsSet = new Set(blogsWithTags.map(b => b.blogId));
  const blogsNeedingTags = publishedBlogs.filter(b => !blogsWithTagsSet.has(b.id));

  if (blogsNeedingTags.length === 0) {
    console.log('⚠️  Tất cả blogs đã có tags.');
    return;
  }

  console.log(`📝 Tạo tags cho ${blogsNeedingTags.length} blogs...`);

  const blogTags: Blog_Tags_Entity[] = [];
  const tagsPerPost = 3; // Mỗi post có 3-5 tags

  function getRandomTags(tags: TagEntity[], count: number): TagEntity[] {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, tags.length));
  }

  for (const blog of blogsNeedingTags) {
    const numTags = Math.floor(Math.random() * 3) + tagsPerPost; // 3-5 tags
    const selectedTags = getRandomTags(allTags, numTags);

    for (const tag of selectedTags) {
      const blogTag = blogTagRepo.create({
        posts: blog,
        tags: tag,
      });
      blogTags.push(blogTag);
    }
  }

  // Batch insert
  const batchSize = 500;
  for (let i = 0; i < blogTags.length; i += batchSize) {
    const batch = blogTags.slice(i, i + batchSize);
    try {
      await blogTagRepo.save(batch);
      console.log(`  ✅ Created ${Math.min(i + batchSize, blogTags.length)}/${blogTags.length} blog-tag relationships`);
    } catch (error: any) {
      // Bỏ qua duplicate key errors
      if (error.code !== '23505') {
        console.error(`  ⚠️  Error batch ${i / batchSize + 1}:`, error.message);
      }
    }
  }

  const totalBlogTags = await blogTagRepo.count();
  console.log(`✅ Total blog-tag relationships: ${totalBlogTags}`);
};

