import { Injectable } from '@nestjs/common';
import { CommentCreateDTO } from './comment.dto';


@Injectable()
export class CommentService {
  create(createDto: CommentCreateDTO) {
    return 'This action adds a new ';
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
