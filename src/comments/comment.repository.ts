
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentCreateDTO } from './comment.dto';
import { BlogEntity } from 'src/blogs/blog.entity';

// NestJS repository from v0.3+
@Injectable()
export class CommentRepository {
  private readonly repository: Repository<CommentEntity>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(CommentEntity);
  }

  async findAll(): Promise<CommentEntity[]> {
    return this.repository.find();
  }

  async createOrSave(comment: CommentCreateDTO, idUser: number, idPost: number) {
    const post = await this.dataSource.getRepository(BlogEntity).findOne({
        where: {id: idPost}
    })

    if(!post) {
        throw new BadRequestException("Post not found")
    }
    const commentInstance =  {...comment,userId:idUser, postId: idPost  }
    // const commentInstance =  {...comment,userId:idUser, post: post  }
    return this.repository.save(commentInstance)
  }

  async createOrSaveReply(comment: CommentCreateDTO, idUser: number, idPost: number, idParent: number) {

    const parentComment = await this.repository.findOne({
      where: {
        postId: idPost,
        parentId: idParent
      }
    })
    if(!parentComment) {
      throw new BadRequestException("Post or parent comment doesn't exist")
    }

    const commentInstance =  {...comment,userId:idUser, postId: idPost, parentId: idParent  }
    console.log(`commentInstance::`, commentInstance)
    return await this.repository.save(commentInstance)
  }

  async editComment(comment: CommentCreateDTO, idUser: number, idComment: number) {

   let updateResult =  await this.repository.createQueryBuilder('comment')
   .update(CommentEntity)
   .set({
    content: comment.content
   })
   .where('id=:idComment', {idComment})
   .andWhere('user_id=:idUser', {idUser})
   .execute()
   console.log('updateResult', updateResult)
   if(!updateResult.affected) {
    throw new BadRequestException("The comment does not exist")
   }
   return updateResult.raw
  }
  

  async removeComment(idComment: number) {
    const comment = await this.repository.findOne({
      where: {
        id: idComment,
        parentId: null
      }
    })
    if(!comment) {
      throw new BadRequestException("The comment does not exist")
    }
    return await this.repository.remove(comment)

  }

}