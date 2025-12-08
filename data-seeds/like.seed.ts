// data-seeds/like.seed.ts
import { LikeEntity } from 'src/likes/Like.entity';
import { BlogEntity } from 'src/blogs/blog.entity';
import { CommentEntity } from 'src/comments/comment.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';

export const seedLikes = async (dataSource: DataSource, count: number = 750) => {
  const likeRepo = dataSource.getRepository(LikeEntity);
  const blogRepo = dataSource.getRepository(BlogEntity);
  const commentRepo = dataSource.getRepository(CommentEntity);
  const userRepo = dataSource.getRepository(User);

  const existingLikes = await likeRepo.count();
  const likesToCreate = Math.max(0, count - existingLikes);

  if (likesToCreate <= 0) {
    console.log(`⚠️  Đã có đủ ${existingLikes} likes (yêu cầu: ${count})`);
    return;
  }

  console.log(`❤️  Tạo ${likesToCreate} likes...`);

  // Lấy data
  const publishedBlogs = await blogRepo.find({ 
    where: { status: 'published' },
    take: 1000 
  });
  const allComments = await commentRepo.find({ take: 1000 });
  const allUsers = await userRepo.find({ take: 1000 });

  if (allUsers.length === 0) {
    throw new Error('Không có users nào. Vui lòng chạy seed users trước.');
  }

  // 70% likes cho posts, 30% cho comments
  const postLikesCount = Math.floor(likesToCreate * 0.7);
  const commentLikesCount = likesToCreate - postLikesCount;

  const likes: LikeEntity[] = [];
  const usedLikes = new Set<string>(); // userId-likeable_type-likeable_id

  // Tạo likes cho posts
  for (let i = 0; i < postLikesCount && publishedBlogs.length > 0; i++) {
    const randomBlog = publishedBlogs[Math.floor(Math.random() * publishedBlogs.length)];
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    
    const likeKey = `${randomUser.id}-post-${randomBlog.id}`;
    if (!usedLikes.has(likeKey)) {
      const like = likeRepo.create({
        userId: randomUser.id,
        user: randomUser,
        likeable_type: 'post',
        likeable_id: randomBlog.id,
      });
      likes.push(like);
      usedLikes.add(likeKey);
    }
  }

  // Tạo likes cho comments
  for (let i = 0; i < commentLikesCount && allComments.length > 0; i++) {
    const randomComment = allComments[Math.floor(Math.random() * allComments.length)];
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    
    const likeKey = `${randomUser.id}-comment-${randomComment.id}`;
    if (!usedLikes.has(likeKey)) {
      const like = likeRepo.create({
        userId: randomUser.id,
        user: randomUser,
        likeable_type: 'comment',
        likeable_id: randomComment.id,
      });
      likes.push(like);
      usedLikes.add(likeKey);
    }
  }

  // Batch insert
  const batchSize = 100;
  for (let i = 0; i < likes.length; i += batchSize) {
    const batch = likes.slice(i, i + batchSize);
    try {
      await likeRepo.save(batch);
      console.log(`  ✅ Created ${Math.min(i + batchSize, likes.length)}/${likes.length} likes`);
    } catch (error: any) {
      // Bỏ qua duplicate key errors
      if (error.code !== '23505') {
        console.error(`  ⚠️  Error batch ${i / batchSize + 1}:`, error.message);
      }
    }
  }

  const totalLikes = await likeRepo.count();
  const postLikes = await likeRepo.count({ where: { likeable_type: 'post' } });
  const commentLikes = await likeRepo.count({ where: { likeable_type: 'comment' } });
  console.log(`✅ Total likes: ${totalLikes} (Posts: ${postLikes}, Comments: ${commentLikes})`);
};

