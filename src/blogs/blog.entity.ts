import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

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

  @Column('simple-array', { nullable: true })
  tags?: string[]; // danh sách tag (lưu dạng "nestjs,typescript,backend")

  // @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  // author: UserEntity; // người viết bài

  // @OneToMany(() => CommentEntity, (comment) => comment.blog, { cascade: true })
  // comments: CommentEntity[]; // danh sách bình luận

  constructor(blog: Partial<BlogEntity>) {
    super();
    Object.assign(this, blog);
  }
}