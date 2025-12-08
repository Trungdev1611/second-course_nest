// data-seeds/comment.seed.ts
import { CommentEntity } from 'src/comments/comment.entity';
import { BlogEntity } from 'src/blogs/blog.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';

export const seedComments = async (dataSource: DataSource, count: number = 750) => {
  const commentRepo = dataSource.getRepository(CommentEntity);
  const blogRepo = dataSource.getRepository(BlogEntity);
  const userRepo = dataSource.getRepository(User);

  const existingComments = await commentRepo.count();
  const commentsToCreate = Math.max(0, count - existingComments);

  if (commentsToCreate <= 0) {
    console.log(`⚠️  Đã có đủ ${existingComments} comments (yêu cầu: ${count})`);
    return;
  }

  console.log(`💬 Tạo ${commentsToCreate} comments...`);

  // Lấy published blogs và users
  const publishedBlogs = await blogRepo.find({ 
    where: { status: 'published' },
    take: 1000 
  });
  const allUsers = await userRepo.find({ take: 1000 });

  if (publishedBlogs.length === 0) {
    console.log('⚠️  Không có published blogs. Bỏ qua seed comments.');
    return;
  }

  if (allUsers.length === 0) {
    throw new Error('Không có users nào. Vui lòng chạy seed users trước.');
  }

  const commentTemplates = [
    'Great article! Very helpful.',
    'Thanks for sharing this.',
    'I learned a lot from this post.',
    'This is exactly what I was looking for.',
    'Excellent explanation!',
    'Could you provide more details about',
    'I have a question regarding',
    'This helped me solve my problem.',
    'Amazing content! Keep it up.',
    'I disagree with some points, but overall good article.',
    'Very informative and well-written.',
    'Looking forward to more posts like this.',
    'This is a game-changer!',
    'I tried this and it works perfectly.',
    'Thanks for the detailed guide.',
  ];

  function generateComment(): string {
    const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
    const additions = [
      ' I will definitely try this.',
      ' Can you explain more?',
      ' This is very useful.',
      ' Great job!',
      ' Keep up the good work!',
    ];
    return template + (Math.random() > 0.5 ? additions[Math.floor(Math.random() * additions.length)] : '');
  }

  const batchSize = 100;
  const comments: CommentEntity[] = [];
  const commentMap = new Map<number, CommentEntity[]>(); // blogId -> comments

  // Tạo comments (70% top-level, 30% replies)
  const topLevelCount = Math.floor(commentsToCreate * 0.7);
  const replyCount = commentsToCreate - topLevelCount;

  // Tạo top-level comments
  for (let i = 0; i < topLevelCount; i++) {
    const randomBlog = publishedBlogs[Math.floor(Math.random() * publishedBlogs.length)];
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

    const comment = commentRepo.create({
      content: generateComment(),
      post: randomBlog,
      postId: randomBlog.id,
      user: randomUser,
      userId: randomUser.id,
      parentId: undefined,
    });

    comments.push(comment);
    if (!commentMap.has(randomBlog.id)) {
      commentMap.set(randomBlog.id, []);
    }
    commentMap.get(randomBlog.id)!.push(comment);
  }

  // Tạo reply comments
  for (let i = 0; i < replyCount; i++) {
    const blogComments = Array.from(commentMap.values()).flat();
    if (blogComments.length === 0) break;

    const parentComment = blogComments[Math.floor(Math.random() * blogComments.length)];
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

    const reply = commentRepo.create({
      content: generateComment(),
      post: parentComment.post,
      postId: parentComment.postId,
      user: randomUser,
      userId: randomUser.id,
      parentId: parentComment.id,
    });

    comments.push(reply);
  }

  // Batch insert
  for (let i = 0; i < comments.length; i += batchSize) {
    const batch = comments.slice(i, i + batchSize);
    await commentRepo.save(batch);
    console.log(`  ✅ Created ${Math.min(i + batchSize, comments.length)}/${comments.length} comments`);
  }

  const totalComments = await commentRepo.count();
  const topLevelComments = await commentRepo.count({ where: { parentId: null } });
  const replyComments = totalComments - topLevelComments;
  console.log(`✅ Total comments: ${totalComments} (Top-level: ${topLevelComments}, Replies: ${replyComments})`);
};

