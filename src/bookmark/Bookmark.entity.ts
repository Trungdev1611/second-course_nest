import { BlogEntity } from 'src/blogs/blog.entity';
import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class BookmarkEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookmarks, {onDelete: 'CASCADE' }) //bảng chứa FK luôn là Manytoone
  user: User;

  
  @ManyToOne(() => BlogEntity, posts => posts.bookmarks, {onDelete: 'CASCADE' }) //bảng chứa FK luôn là Manytoone
  posts: BlogEntity
}