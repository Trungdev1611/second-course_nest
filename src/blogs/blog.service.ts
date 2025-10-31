import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDTO } from './blog.dto';
import { BlogRepository } from './blog.repository';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';


@Injectable()
export class BlogService {
  constructor(private readonly blogRepo: BlogRepository) {

  }
  async create(createDto: CreateBlogDTO) {
    try {
      const savedBlog = await this.blogRepo.createBlog(createDto)
      return {title: savedBlog.title, content: savedBlog.content}
    } catch (error) {
      throw new BadRequestException(error.message || "Something wrong happened")
    }

  }

  async filterAndPaginate(query: PaginateAndSearchDTO) {
    try {
      const {items, page, per_page, total} =   await this.blogRepo.findAndPaginate(query)
      return {data: items, metadata: {page, per_page, total}}
    } catch (error) {
        throw new BadRequestException(error.message || "Something wrong happened")
    }

  }

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
