import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDTO, queryBlogDTO } from './blog.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse,  ApiTags } from '@nestjs/swagger';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { IdParamDto } from 'src/common/dto/common.dto';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';

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

  @Get("posts")
    @ApiOperation({
      summary: "API để get các blog - có pagination và search",
      description: "yêu cầu các thông tin hợp lệ của blog schema"
    })
    @ApiResponse({
      status: 201,
      description: 'API success - trả về data theo client query và pagination',
      schema: {
        example: {
          data: 'list blogs array',
          metadata: {
            total: 100,
          },

        },
      },
    })
  filterAndPaginate(@Query() query: queryBlogDTO) {
    return this.blogService.filterAndPaginate(query);
  }


  @Get("post/:id/view")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  increView(@Param() param: IdParamDto, @Req() req){
    return this.blogService.increView(param.id, req.user.id)
  }

  @Get('post/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPostDetail(@Param() param: IdParamDto, @Req() req) {
    await this.blogService.increView(param.id, req.user.id)
    return this.blogService.getPostById(param.id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
  //   return this.blogService.update(+id, updateDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.blogService.remove(+id);
  // }
}
