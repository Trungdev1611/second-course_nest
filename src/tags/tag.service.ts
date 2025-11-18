import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { TagRepository } from './tag.repository';


@Injectable()
export class TagService {
    constructor(private readonly TagRepo: TagRepository) {

    }
//   create(createDto: CreateDto) {
//     return 'This action adds a new ';
//   }

async  findAll(query: PaginateAndSearchDTO) {
    try {
        const {page, per_page} = query
        const [data, count] =await  this.TagRepo.findAll(query.page, query.per_page)
        return {data, metadata: {page, per_page, total: count}}
    } catch (error) {
        throw new BadRequestException(error.message)
    }

  }

   async remove(id: number) {
    try {
      return await this.TagRepo.removeTagByID(id)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async softDelete(id: number) {
    try {
      return await this.TagRepo.softDelete(id)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }


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
