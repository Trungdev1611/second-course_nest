import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './blog.dto';
import { ApiOperation, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';

@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
    @ApiOperation({
      summary: "API tạo mới một blog",
      description: "yêu cầu các thông tin hợp lệ của blog schema"
    })
    @ApiResponse({
      status: 201,
      description: 'API success - tạo một bản ghi mới trong blog',
      schema: {
        example: {
          title: 'title name',
          content: "content",
  
        },
      },
    })
    create(@Body() createDto: CreateBlogDTO) {
      return this.blogService.create(createDto);
    }

  @Get("all")
  filterAndPaginate(@Query() query: PaginateAndSearchDTO) {
    return this.blogService.filterAndPaginate(query);
  }

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
