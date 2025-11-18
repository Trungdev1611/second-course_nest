import { Blog_Tags_Entity } from "src/blog_tags/blog_tags.entity";
import { BaseEntity } from "src/common/base.entity";
import { Column, DeleteDateColumn, Entity, OneToMany } from "typeorm";


@Entity({name: "tags"})
export class TagEntity extends BaseEntity {
    
    @Column({name: "tag_name"})
    tag_name: string


    @OneToMany(() => Blog_Tags_Entity, blog_tags => blog_tags.tags)
    blog_tags: Blog_Tags_Entity[]

    @DeleteDateColumn()
    removedAt: Date | null;
}