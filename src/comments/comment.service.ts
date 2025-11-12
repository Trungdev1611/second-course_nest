import { Injectable, BadRequestException } from '@nestjs/common';
import { CommentCreateDTO, EditCommentDTO } from './comment.dto';
import { CommentRepository } from './comment.repository';


@Injectable()
export class CommentService {
    constructor(private readonly commentRepo: CommentRepository ) {

    }
  async create(createDto: CommentCreateDTO, idCurrentUser: number, idPost: number) {
    try {
        return await this.commentRepo.createOrSave(createDto, idCurrentUser,idPost )
    } catch (error) {
        throw new BadRequestException(error.message)
    }
    
  }

  async createReply(createDto: CommentCreateDTO, idCurrentUser: number, idPost: number, idParentComment: number) {
    try {
        return await this.commentRepo.createOrSaveReply(createDto, idCurrentUser,idPost, idParentComment )
    } catch (error) {
        throw new BadRequestException(error.message)
    }
    
  }

  async editComment(editDTO: EditCommentDTO, userId: number, idComment: number) {
    try {
      return await this.commentRepo.editComment(editDTO, userId, idComment)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  
 async removeComment(id: number) {
    try {
      return await this.commentRepo.removeComment(id)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
