import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog_Tags_Entity } from './blog_tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog_Tags_Entity])],
  controllers: [],
  providers: [],
  exports: []
})
export class BlogTagsModule {}