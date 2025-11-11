import { Injectable, BadRequestException } from '@nestjs/common';
import { CommentCreateDTO } from './comment.dto';
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



//   findAll() {
//     return `This action returns all s`;
//   }

//   findOne(id: number) {
//     return `This action returns a #id `;
//   }

//   update(id: number, updateDto: UpdateDto) {
//     return `This action updates a #id `;
//   }

//   remove(id: number) {
//     return `This action removes a #id `;
//   }
}
