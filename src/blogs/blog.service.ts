import { RedisService } from './../redis/redis.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDTO, PaginateandSortCommentDTO, queryBlogDTO } from './blog.dto';
import { BlogRepository } from './blog.repository';
import { BlogSortType } from './type';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { DataSource } from 'typeorm';
import { CommentEntity } from 'src/comments/comment.entity';


@Injectable()
export class BlogService {
  constructor(private readonly blogRepo: BlogRepository, 
    private readonly redisService: RedisService,
    private dataSource: DataSource
  ) {

  }
  async create(createDto: CreateBlogDTO) {
    try {
      const savedBlog = await this.blogRepo.createBlog(createDto)
      return {title: savedBlog.title, content: savedBlog.content}
    } catch (error) {
      throw new BadRequestException(error.message || "Something wrong happened")
    }

  }

  async filterAndPaginate(query: queryBlogDTO) {
    try {
      const {items, page, per_page, total} =   await this.blogRepo.findAndPaginate(query)
      return {data: items, metadata: {page, per_page, total}}
    } catch (error) {
        throw new BadRequestException(error.message || "Something wrong happened")
    }

  }

  async increView(idPost: number, idUser: number) {
    try {
      const key = `post:${idPost}:views`;
      const valueInRedis = await this.redisService.get(key)
      if(valueInRedis) {
        console.log("The key still exists in Redis. Please wait until reset before increasing view ")
        return
      }
      await this.redisService.incre(key)
      // await this.redisService.expire(key, 300)
    } catch (error) {
      throw new BadRequestException("error in increase view")
    }

  }

  async flushViewsToDb() {
    try {
          // Lấy tất cả keys cần flush (ví dụ theo pattern)
    const keys = await this.redisService.getAllKeys('post:*:views');


    for (const key of keys) {
      const count = await this.redisService.get(key);
      if (!count) continue;
  
      const idPost = parseInt(key.split(':')[1], 10);
  
      // Update DB
      await this.blogRepo.incrementView(idPost, +count);
  
      // Delete key after flush
      await this.redisService.del(key);
      console.log("delete the key:::", key)
    }
    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }

  async getPostById(id: number) {
   try {
     return await this.blogRepo.getPostById(id)
   } catch (error) {
    throw new BadRequestException(error.message)
   }
  }

 async likeOrUnlike(idPostOrCommentTarget: number, idUser: number, type: 'post' | 'comment') {
    try {
     const isLiked =  await this.blogRepo.likeOrUnlike(idPostOrCommentTarget, idUser, type)
      return {message: `${isLiked ? "Liked": "Unliked"} `}
    } catch (error) {
      throw new BadRequestException(error.message)
    }
    
  }

  async getListComments(postId: number, query: PaginateandSortCommentDTO) {
    try {
      const [data, total] =  await this.blogRepo.getListComments(postId, query)
      return {
        data: data,
        metadata: {
          isNext: (query.page) * query.per_page < Number(total)  ? true : false,
          total
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getListReplies(idPost: number, idComment: number) {
    try {
      return await this.blogRepo.getListReplies(idPost, idComment)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // remove(id: number) {
  //   return `This action removes a #id `;
  // }
}
