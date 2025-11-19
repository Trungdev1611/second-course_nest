import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

// NestJS repository from v0.3+
@Injectable()
export class TagRepository {
  private readonly repository: Repository<TagEntity>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(TagEntity);
  }

  async findAll(page: number, per_page: number) {
    const offset = (page -1) * per_page
    const queryItems =  this.repository.createQueryBuilder('tag')
    .leftJoin('tag.blog_tags', 'blog_tags')
    .select(['tag.id, tag.tag_name'])
    .addSelect('COUNT(blog_tags.tag_id)', "count_tag")
    .groupBy('tag.id')
    .orderBy('tag.updated_at', "DESC")
    .skip(offset).take(per_page)
    .getRawMany();

    const queryTotal = this.repository.createQueryBuilder('tag').getCount()
    return await Promise.all([queryItems, queryTotal])
  }

  async removeTagByID(idTag: number) {
    const tag = await this.repository.findOne({
      where: {
        id: idTag
      }
    })
    if(!tag) {
      throw new BadRequestException("tag not found")
    }
    return await this.repository.remove(tag)
  }

  async softDelete(idTag: number) {
    const tag = await this.repository.findOne({
      where: {
        id: idTag
      }
    })
    if(!tag) {
      throw new BadRequestException("tag not found")
    }
    return await this.repository.softRemove(tag)
  }
}