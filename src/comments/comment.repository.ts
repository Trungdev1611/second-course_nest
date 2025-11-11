
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


}