import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { BlogEntity } from './blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { ElasticsearchModule } from 'src/elasticsearch/essearch.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), RedisModule, ElasticsearchModule],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService]
})
export class BlogModule {}