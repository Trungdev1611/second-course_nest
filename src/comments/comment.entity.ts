import { BlogEntity } from "src/blogs/blog.entity";
import { BaseEntity } from "src/common/base.entity";
import { LikeEntity } from "src/likes/Like.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "comments"})
export class CommentEntity extends BaseEntity{
    @Column({nullable: false})
    content: string

    @ManyToOne(() => BlogEntity, post => post.comments,  { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: BlogEntity

    @Column({name: "post_id"})
    postId: number

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({name: "user_id"})
    userId: number

    @OneToMany(() => LikeEntity, like => like.comment)
    likes: LikeEntity[]

}