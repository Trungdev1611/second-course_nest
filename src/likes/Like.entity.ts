import { CommentEntity } from 'src/comments/comment.entity';
import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('likes')
@Unique(['user', 'likeable_type', 'likeable_id'])
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

    @ManyToOne(() => CommentEntity, comment => comment.likes)
    @JoinColumn({ name: 'likeable_id' })
    comment: CommentEntity

    constructor(blog: Partial<LikeEntity>) {
    super();
    Object.assign(this, blog);
  }
}