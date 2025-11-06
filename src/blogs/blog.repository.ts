import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogDTO, queryBlogDTO } from './blog.dto';
import { BlogSortType } from './type';
import { LikeEntity } from 'src/likes/Like.entity';


// From TypeORM v0.3

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly repo: Repository<BlogEntity>,
    private dataSource: DataSource
  ) {}

  async findAll(): Promise<BlogEntity[]> {
    return this.repo.find();
  }

  async findAndPaginate(query: queryBlogDTO) {
    const {page = 1, per_page = 20, search = '', type = "newest"} = query
    const skip = (page - 1) * per_page
    const queryBuilder = this.repo.createQueryBuilder('blog')
    .where('blog.title LIKE :search_content OR blog.content LIKE :search_content', {search_content: `%${search}%`})

    if (type === BlogSortType.NEWEST) {
      queryBuilder.orderBy('blog.updated_at', 'DESC');
    } else if (type === BlogSortType.POPULAR) {
      queryBuilder.orderBy('blog.views', 'DESC')
                  .addOrderBy('blog.updated_at', 'DESC');
    } else if (type === BlogSortType.TRENDING) {
      queryBuilder.orderBy('blog.likes', 'DESC')   
                  .addOrderBy('blog.updated_at', 'DESC');
    }

 // Pagination
    queryBuilder.skip(skip).take(per_page)

    const [items, total] = await queryBuilder.getManyAndCount()
    return {items, total, page, per_page}
  }

  async createBlog(blogData: CreateBlogDTO): Promise<BlogEntity> {
    return this.repo.save(blogData)
  }

  async incrementView(idPost: number, count: number) {
    await this.repo.increment({ id: idPost }, 'views', count);
  }

  async getPostById(idPost: number) {
    return await this.repo.findOne({
      where: {id: idPost}
    })
  }

  async likeOrUnlike(idPostOrCommentTarget: number, idUser: number, type:'post' | 'comment'): Promise<boolean> {
   return  await this.dataSource.transaction(async (manager) => {
      const liked = await manager.findOne(LikeEntity, { where: { user: {id: idUser}, likeable_id: idPostOrCommentTarget, likeable_type: type } });
    
      if (liked) {
        await manager.delete(LikeEntity, { userId:idUser , likeable_id: idPostOrCommentTarget, likeable_type: type  });
        if(type === "post") {
          await manager.decrement(BlogEntity, { id: idPostOrCommentTarget }, "likes", 1);
        }
        else if(type ==="comment") {
          // await manager.decrement(CommentEntity, { id: postId }, "likes", 1);
        }
     
      } else {
        await manager.insert(LikeEntity, { userId:idUser , likeable_id: idPostOrCommentTarget, likeable_type: type });
        if(type === "post") {
          await manager.increment(BlogEntity, { id: idPostOrCommentTarget }, "likes", 1);
        }
        else if(type ==="comment") {
          // await manager.decrement(CommentEntity, { id: postId }, "likes", 1);
        }
        
      }

      return !liked
    });


  }

}