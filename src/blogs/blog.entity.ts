import { Blog_Tags_Entity } from 'src/blog_tags/blog_tags.entity';
import { CommentEntity } from 'src/comments/comment.entity';
import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('blogs')
export class BlogEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string; // tiêu đề bài viết

  @Column({ type: 'text' })
  content: string; // nội dung bài viết (HTML hoặc markdown)

  @Column({ type: 'varchar', nullable: true })
  excerpt?: string; // mô tả ngắn / đoạn trích

  @Column({ type: 'varchar', nullable: true })
  thumbnail?: string; // ảnh đại diện bài viết (URL)

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status: 'draft' | 'published' | 'archived'; // trạng thái bài viết

  @Column({ type: 'int', default: 0 })
  views: number; // lượt xem

  @Column({ type: 'int', default: 0 })
  likes: number; // lượt thích

  @Column({ type: 'int', nullable: true })
  reading_time?: number; // thời gian đọc ước lượng (phút)

  // @Column('simple-array', { nullable: true })
  // tags?: string[]; // danh sách tag (lưu dạng "nestjs,typescript,backend")

  @OneToMany(() => Blog_Tags_Entity, blog_tags => blog_tags.posts)
  blog_tags: Blog_Tags_Entity[]

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({name: "user_id"})
  user: User; // người viết bài

  @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
  comments: CommentEntity[]; // danh sách bình luận

  // ✅ Comment: LikeEntity dùng polymorphic pattern (likeable_type + likeable_id)
  // Để get likes, query: WHERE likeable_type = 'post' AND likeable_id = post.id
  // @OneToMany(() => LikeEntity, (like) => like.post)
  // postLikes: LikeEntity[]

  constructor(blog: Partial<BlogEntity>) {
    super();
    Object.assign(this, blog);
  }
}