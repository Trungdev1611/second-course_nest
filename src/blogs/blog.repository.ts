import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogDTO, PaginateandSortCommentDTO, queryBlogDTO } from './blog.dto';
import { BlogSortType } from './type';
import { LikeEntity } from 'src/likes/Like.entity';
import { CommentEntity } from 'src/comments/comment.entity';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';


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

async getListComments(postId: number,query: PaginateandSortCommentDTO ) {
    const repository = this.dataSource.getRepository(CommentEntity).createQueryBuilder("comment")
    .leftJoin("comment.post", "post")
    .leftJoin('comment.likes', 'like', 'like.likeable_type = :type', { type: 'comment' })
    .leftJoin('comment.user', 'user')
    .where("post.id=:postId", {postId})

  const qb =  repository
    // .andWhere("like.likeable_type=:type", {type: "comment"})
    .select(["comment.id", "comment.content", "comment.created_at", "user.id", "user.name", "user.email", "user.email"])
    .addSelect("COUNT(like.id)", "like_count")
    .groupBy("comment.id")
    .addGroupBy("user.id")
    if(query.sort === "popular") {
      qb.orderBy("like_count", "DESC")
    }

    const data = await qb
    .skip((query.page - 1) * query.per_page)
    .limit(query.per_page).getRawMany()

    const countQb = repository.clone(); //phải clone ra vì không nó ăn theo qb
    const total = await countQb.getCount()
    return [data, total]
  }

}