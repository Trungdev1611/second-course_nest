import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogDTO, PaginateandSortCommentDTO, queryBlogDTO } from './blog.dto';
import { BlogSortType } from './type';
import { LikeEntity } from 'src/likes/Like.entity';
import { CommentEntity } from 'src/comments/comment.entity';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { Blog_Tags_Entity } from 'src/blog_tags/blog_tags.entity';


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
   // Step 1: get paged blog IDs
const idsQuery = this.repo.createQueryBuilder('blog')
.select('blog.id', 'id');

if(search) {
idsQuery.where('blog.title LIKE :s OR blog.content LIKE :s', { s: `%${search}%` });
}

if(type === BlogSortType.NEWEST) idsQuery.orderBy('blog.updated_at','DESC');
else if(type === BlogSortType.POPULAR) idsQuery.orderBy('blog.views','DESC').addOrderBy('blog.updated_at','DESC');
else if(type === BlogSortType.TRENDING) idsQuery.orderBy('blog.likes','DESC').addOrderBy('blog.updated_at','DESC');

idsQuery.skip(skip).take(per_page);
const rawIds = await idsQuery.getRawMany();
const ids = rawIds.map(r => r.id);
if(!ids.length) return {items:[], total:0, page, per_page};

// Step 2: load blogs + tags aggregate
const items = await this.repo.createQueryBuilder('blog', )
.leftJoin('blog.blog_tags', 'blog_tag')
.leftJoin('blog_tag.tags', 'tag')
.whereInIds(ids)
.select('blog')  // lấy toàn bộ cột của post
     .addSelect(`COALESCE(
         json_agg(json_build_object('id', tag.id, 'name', tag.tag_name))
         FILTER (WHERE tag.id IS NOT NULL), '[]'
       ) as tags`)
.groupBy('blog.id')
.orderBy(`array_position(ARRAY[${ids.join(',')}], blog.id)`) // preserve order
.getRawMany();

// Step 3: total
const totalQuery = this.repo.createQueryBuilder('blog');
if(search) totalQuery.where('blog.title LIKE :s OR blog.content LIKE :s', { s: `%${search}%` });
const total = await totalQuery.getCount();

return { items, total, page, per_page };

  }

  async createBlog(blogData: CreateBlogDTO): Promise<BlogEntity> {
    const blogSaved = await this.repo.save(blogData)
    const values = blogData.tags.map(tag_id => `(${blogSaved.id}, ${tag_id})`).join(',');
    await this.dataSource.query(`
      INSERT INTO blog_tags (post_id, tag_id)
      VALUES ${values}
    `)
    return blogSaved
  }

  async incrementView(idPost: number, count: number) {
    await this.repo.increment({ id: idPost }, 'views', count);
  }

  async getPostById(idPost: number) {
    return await    
     this.repo.createQueryBuilder('post')
     .leftJoin('post.blog_tags', 'blog_tag')
     .leftJoin('blog_tag.tags', 'tag')
     .select('post')  // lấy toàn bộ cột của post
     .addSelect(`COALESCE(
         json_agg(json_build_object('id', tag.id, 'name', tag.tag_name))
         FILTER (WHERE tag.id IS NOT NULL), '[]'
       ) as tags`)
     .where('post.id = :id', { id: idPost })
     .groupBy('post.id')
     .getRawOne();
    // this.repo.findOne({
    //   where: {id: idPost},
    //   relations: {
    //     blog_tags: {
    //       tags: true
    //     }
    //   }
    // })

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
    .leftJoin("likes", 'like', 'like.likeable_id = comment.id AND like.likeable_type = :type', { type: 'comment' })
    .leftJoin('comment.user', 'user')

    .leftJoin('comment.replies', 'reply')
    .where("post.id=:postId", {postId})
    .andWhere("comment.parent_id IS NULL")
    
    const countQb = repository.clone(); //phải clone ra vì không nó ăn theo qb

  const qb =  repository
    // .andWhere("like.likeable_type=:type", {type: "comment"})
    .select(["comment.id", "comment.content", "comment.created_at", "user.id", "user.name", "user.email", "user.email"])
    .addSelect("COUNT( DISTINCT like.id)", "like_count")
    .addSelect("COUNT(DISTINCT reply.id)", "reply_count" )
    .groupBy("comment.id")
    .addGroupBy("user.id")
    // .addGroupBy("reply.id")
    if(query.sort ==="newest") {
      qb.orderBy("comment.created_at", "DESC")
    }
    else if(query.sort === "oldest") {
      qb.orderBy("comment.created_at", "ASC")
    }
    else //(query.sort === "popular")
     {
      qb.orderBy("like_count", "DESC")
    }
    

    const data = await qb
    .skip((query.page - 1) * query.per_page)
    .limit(query.per_page).getRawMany()

    const total = await countQb.getCount()
    return [data, total]
  }

  async getListReplies(idPost: number, idComment: number) {

    return await this.dataSource.getRepository(CommentEntity)
    .createQueryBuilder('comment')
    .leftJoin('comment.user', 'user')
    .where("comment.post_id=:idPost", {idPost})
    .andWhere("comment.parent_id=:idComment", {idComment})
    .select(["comment.id", "comment.content", "comment.post_id", "user.id", "user.name", "user.image"])
    .getRawMany()
    // .find({
    //   where: {
    //     postId: idPost,
    //     parentId: idComment,
        
    //   },
    //   relations: {
    //     user: true
    //   }
    // })
  }

  async getPostRelated(idTargetPost: number) {
    const query = `
      SELECT p.id, p.title, 
             CARDINALITY(
               ARRAY(
                 SELECT UNNEST(string_to_array(p.tags, ',')) 
                 INTERSECT 
                 SELECT UNNEST(string_to_array((SELECT tags FROM blogs WHERE id = $1), ','))
               )
             ) AS "commonTagsCount"
      FROM blogs p
      WHERE p.id != $1
        AND ARRAY_LENGTH(
              ARRAY(
                SELECT UNNEST(string_to_array(p.tags, ',')) 
                INTERSECT 
                SELECT UNNEST(string_to_array((SELECT tags FROM blogs WHERE id = $1), ','))
              ), 1
            ) > 0
      ORDER BY "commonTagsCount" DESC
      LIMIT 5;
    `;
  
    const data = await this.dataSource.query(query, [idTargetPost]);
    if (!data || data.length === 0) {
      throw new BadRequestException("Post not found");
    }
    return data;
  }
  
}