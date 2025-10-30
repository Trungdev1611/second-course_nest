import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDTO } from './blog.dto';
import { BlogRepository } from './blog.repository';


@Injectable()
export class BlogService {
  constructor(private readonly blogRepo: BlogRepository) {

  }
  async create(createDto: CreateBlogDTO) {
    try {
      const savedBlog = await this.blogRepo.createBlog(createDto)
      return savedBlog
    } catch (error) {
      throw new BadRequestException(error.message || "Something wrong happened")
    }

  }

  // findAll() {
  //   return `This action returns all s`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #id `;
  // }

  // update(id: number, updateDto: UpdateDto) {
  //   return `This action updates a #id `;
  // }

  // remove(id: number) {
  //   return `This action removes a #id `;
  // }
}
