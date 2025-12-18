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
    const offset = (page - 1) * per_page;
    
    // ✅ FIX: Dùng subquery để pagination hoạt động đúng với GROUP BY
    // Bước 1: Lấy IDs đã paginated (không có GROUP BY)
    const idsQuery = this.repository
      .createQueryBuilder('tag')
      .select('tag.id', 'id')
      .orderBy('tag.updated_at', 'DESC')
      .skip(offset)
      .take(per_page);
    
    const rawIds = await idsQuery.getRawMany();
    const ids = rawIds.map(r => r.id);
    
    // Nếu không có IDs, return empty
    if (!ids.length) {
      const total = await this.repository.count();
      return [[], total];
    }
    
    // Bước 2: Load tags với COUNT, chỉ lấy những IDs đã paginated
    const queryItems = this.repository
      .createQueryBuilder('tag')
      .leftJoin('tag.blog_tags', 'blog_tags')
      .select(['tag.id', 'tag.tag_name']) // ✅ FIX: Syntax đúng - mảng các string riêng biệt
      .addSelect('COUNT(blog_tags.tag_id)', 'count_tag')
      .whereInIds(ids) // ✅ Chỉ lấy những IDs đã paginated
      .groupBy('tag.id')
      .addGroupBy('tag.tag_name')
      .orderBy(`array_position(ARRAY[${ids.join(',')}], tag.id)`) // ✅ Giữ nguyên thứ tự pagination
      .getRawMany();

    // Bước 3: Count total (không có pagination)
    const queryTotal = this.repository.createQueryBuilder('tag').getCount();
    
    return await Promise.all([queryItems, queryTotal]);
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