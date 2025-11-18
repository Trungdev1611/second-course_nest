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
    return await this.repository.createQueryBuilder('tag').skip(offset).take(per_page).getManyAndCount();

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