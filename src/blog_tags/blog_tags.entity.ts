import { BlogEntity } from "src/blogs/blog.entity";
import { BaseEntity } from "src/common/base.entity";
import { TagEntity } from "src/tags/tag.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity({name: "blog_tags"})
export class Blog_Tags_Entity extends BaseEntity {
    @ManyToOne(() => BlogEntity, post => post.blog_tags, )
    @JoinColumn({name: "post_id"})
    posts: BlogEntity

    @ManyToOne(() => TagEntity, tag => tag.blog_tags, {onDelete: 'CASCADE'})
    @JoinColumn({name: "tag_id"})
    tags: TagEntity
}