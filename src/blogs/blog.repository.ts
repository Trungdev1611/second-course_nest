import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogDTO, queryBlogDTO } from './blog.dto';
import { BlogSortType } from './type';


// From TypeORM v0.3

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly repo: Repository<BlogEntity>,
  ) {}

  async findAll(): Promise<BlogEntity[]> {
    return this.repo.find();
  }

  async findAndPaginate(query: queryBlogDTO) {
    const {page = 1, per_page = 20, search = '', type = "newest"} = query
    const skip = (page - 1) * per_page
    const queryBuilder = this.repo.createQueryBuilder('blog')
    .where('blog.title LIKE :search_content OR blog.content LIKE :search_content', {search_content: `%${search}%`})

    if (type === BlogSortType.NEWEST) {
      queryBuilder.orderBy('blog.updated_at', 'DESC');
    } else if (type === BlogSortType.POPULAR) {
      queryBuilder.orderBy('blog.views', 'DESC')
                  .addOrderBy('blog.updated_at', 'DESC');
    } else if (type === BlogSortType.TRENDING) {
      queryBuilder.orderBy('blog.likes', 'DESC')   
                  .addOrderBy('blog.updated_at', 'DESC');
    }

 // Pagination
    queryBuilder.skip(skip).take(per_page)

    const [items, total] = await queryBuilder.getManyAndCount()
    return {items, total, page, per_page}
  }

  async createBlog(blogData: CreateBlogDTO): Promise<BlogEntity> {
    return this.repo.save(blogData)
  }

  async incrementView(idPost: number, count: number) {
    await this.repo.increment({ id: idPost }, 'views', count);
  }

  async getPostById(idPost: number) {
    return await this.repo.findOne({
      where: {id: idPost}
    })
  }

}