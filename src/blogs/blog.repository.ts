import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CreateBlogDTO } from './blog.dto';

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

  async createBlog(blogData: CreateBlogDTO): Promise<BlogEntity> {
    return this.repo.save(blogData)
  }


}