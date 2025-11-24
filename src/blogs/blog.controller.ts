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
import { CreateBlogDTO, PaginateandSortCommentDTO, queryBlogDTO, queryLikeDTO } from './blog.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse,  ApiTags } from '@nestjs/swagger';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { IdParamDto, PostCommentParamDto } from 'src/common/dto/common.dto';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';
import { CommentCreateDTO } from 'src/comments/comment.dto';
import { BlogEntity } from './blog.entity';
import { OptionalJwtGuard } from 'src/guard/OptionalJwtAuth';

@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}


  //API để setup index với mapping đúng
  @Post('setup-elasticsearch-index')
  @ApiOperation({
    summary: "Tạo index 'blogs' với mapping đúng cho completion suggester",
    description: "Cần chạy endpoint này trước khi reindex. Tạo index với field 'suggest' type 'completion'"
  })
  @ApiResponse({
    status: 201,
    description: 'Index đã được tạo thành công',
  })
  setupIndex() {
    return this.blogService.setupElasticsearchIndex();
  }

  //API để fill dữ liệu trước khi cài dặt ESsearch vào essearch
  @Post('index-blogs')
  @ApiOperation({
    summary: "Re-index ES search with old data",
    description: "các dữ liệu trước khi cài đặt ES search cần được fill vào ES search. Tự động setup index với mapping đúng trước khi reindex."
  })
  @ApiResponse({
    status: 201,
    description: 'fill dữ liệu thành công',
    schema: {
      example: {
        message: 'success',
      },
    },
  })
  indexAllBlog() {
    return this.blogService.reIndexAllBlog();
  }

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
      type: [CreateBlogDTO],
      // schema: {
      //   example: {
      //     data: [BlogEntity],
      //     metadata: {
      //       total: 100,
      //     },

      //   },
      // },
    })
  filterAndPaginate(@Query() query: queryBlogDTO) {
    return this.blogService.filterAndPaginate(query);
  }


  @Get("post/:id/view")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: `Tăng view khi vào xem post`,
    schema: {
      example: {
        data:   {
          message: "add view to redis success"
        },
      },
    },
  })
  @ApiBearerAuth()
  increView(@Param() param: IdParamDto, @Req() req){
    return this.blogService.increView(param.id, req.user.id)
  }

  @Get('post/:id')
  @UseGuards(OptionalJwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: `Get detail of a post with its ID`,
    type: CreateBlogDTO
    // schema: {
    //   example: {
    //     data:  BlogEntity,
    //   },
    // },
  })
  async getPostDetail(@Param() param: IdParamDto, @Req() req) {
    const idUser = req?.user?.id
    if(idUser) {
      await this.blogService.increView(param.id, req?.user?.id)
    }
    return this.blogService.getPostById(param.id, idUser);
  }

  @Post('post/:id/like_unlike')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: `Action like hoặc unlike 1 post`,
    schema: {
      example: {
        data:   {
         message: `Liked/Unliked` 
        },
      },
    },
  })
  @ApiBearerAuth()
  likeOrUnlike(@Param() param: IdParamDto, @Req() req, @Query() query: queryLikeDTO) {
    return this.blogService.likeOrUnlike(param.id,req.user.id, query.type );
  }

  @Post('post/:id/comments')
  @UseGuards(OptionalJwtGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: `API success - trả về d5 comments 1 lần - nếu isNext true thì vẫn còn load được thêm, nếu false thì hết rồi
    trả về số lượng like, và số lượng reply. khi bấm vào chi tiết số lượng reply sẽ gọi api lấy detail replies
    `,
    schema: {
      example: {
        data: [  {
          "comment_id": 2,
          "comment_created_at": "2025-11-05T23:27:23.178Z",
          "comment_content": "It is so exciting. A lot of new information that I can learn",
          "user_id": 3,
          "user_name": "user-test",
          "user_email": "trungdev1611@gmail.com",
          "like_count": "1",
          "repy_count": "4"
        },],
        metadata:  {
          isNext: "true /false",
          total: "number"
        }
      },
    },
  })
  async getListComments(@Param() param: IdParamDto, @Query() query: PaginateandSortCommentDTO) {
    query.per_page = 5
    return await this.blogService.getListComments(param.id, query)
  }


  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: "Get list replies of an specific comment",
   
  })
  @ApiResponse({
    status: 201,
    description: "If success, we will get an list",
    example: {
      data: [
        {
          "comment_id": 105,
          "comment_content": "hvecirackw",
          "user_id": 11,
          "user_name": "user-test5",
          "user_image": "image-test",
          "post_id": 20
    }]
  }})
  @Get(":idPost/comment/:idComment")
  async getListReplies(@Param() param: PostCommentParamDto ){
      return await this.blogService.getListReplies(param.idPost, param.idComment)
  }

  @ApiOperation({
    summary: "Get replis (trùng tag với tags của post hiện tại) id and title of these posts which related to this post",
   
  })
  @ApiResponse({
    status: 201,
    description: "If success, we will get an list",
    type: [CreateBlogDTO]  
  })
  @Get(":id/related")
  async getPostRelated(@Param() param: IdParamDto){
      return await this.blogService.getPostRelated(param.id)
  }

}

