import { BlogEntity } from "src/blogs/blog.entity";
import { BaseEntity } from "src/common/base.entity";
import { LikeEntity } from "src/likes/Like.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: "comment"})
export class CommentEntity extends BaseEntity{
    @Column({nullable: false})
    content: string

    @ManyToOne(() => BlogEntity, post => post.comments,  { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: BlogEntity

    @OneToMany(() => LikeEntity, like => like.comment)
    likes: LikeEntity[]
}