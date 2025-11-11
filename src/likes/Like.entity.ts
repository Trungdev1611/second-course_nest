// ✅ Bỏ imports không cần thiết vì không dùng explicit relationships
import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity('likes')
// ✅ Fix: Dùng column names thay vì relationship names
@Unique(['userId', 'likeable_type', 'likeable_id'])
export class LikeEntity extends BaseEntity {

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.likes, {onDelete: "CASCADE"})
    @JoinColumn({ name: "userId" })
    user: User

    @Column(({
        nullable: false,
        type: 'enum',
        enum: ['post', 'comment'],
      }))
    likeable_type: 'post' | 'comment'

    @Column({
        nullable: false
    })
    likeable_id: number //post id || comment_id

    // ✅ Bỏ explicit relationships vì đang dùng polymorphic pattern
    // Nếu cần access entity, dùng query với likeable_type + likeable_id
    // @ManyToOne(() => CommentEntity, comment => comment.likes, { nullable: true })
    // @JoinColumn({ name: 'comment_id' })
    // comment?: CommentEntity
    
    // @ManyToOne(() => BlogEntity, post => post.postLikes, { nullable: true })
    // @JoinColumn({ name: 'post_id' })
    // post?: BlogEntity

    constructor(blog: Partial<LikeEntity>) {
    super();
    Object.assign(this, blog);
  }
}