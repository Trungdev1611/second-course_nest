import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './blog.dto';


@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  create(@Body() createDto: CreateBlogDTO) {
    return this.blogService.create(createDto);
  }

  // @Get()
  // findAll() {
  //   return this.blogService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.blogService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
  //   return this.blogService.update(+id, updateDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.blogService.remove(+id);
  // }
}
