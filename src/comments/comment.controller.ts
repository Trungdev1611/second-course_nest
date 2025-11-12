import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentCreateDTO, EditCommentDTO } from './comment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';
import { IdParamDto, PostCommentParamDto } from 'src/common/dto/common.dto';

@ApiTags("Comment")
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post("post/:id/create")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "tạo mới comment",
    description: "nếu thành công sẽ tạo mới bản ghi trong table comment"
  })
  @ApiResponse({
    status: 201,
    type: CommentCreateDTO,
  })
  create(@Body() createDto: CommentCreateDTO, @Req() req, @Param() param: IdParamDto ) {
    return this.commentService.create(createDto, req.user.id, param.id );
  }

  @Post("post/:idPost/parent/:idComment")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "tạo mới comment reply",
    description: "nếu thành công sẽ tạo mới bản ghi trong table comment, với parent_comment đã được gửi"
  })
  @ApiResponse({
    status: 201,
    type: CommentCreateDTO,
  })
  createReplycomment(@Body() createDto: CommentCreateDTO, @Req() req, @Param() param: PostCommentParamDto ) {
    return this.commentService.createReply(createDto, req.user.id, param.idPost, param.idComment);
  }


  @Put("edit/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "tạo mới comment reply",
    description: "nếu thành công sẽ tạo mới bản ghi trong table comment, với parent_comment đã được gửi"
  })
  @ApiResponse({
    status: 201,
    type: CommentCreateDTO,
  })
  editComment(@Body() contentEdit: EditCommentDTO, @Req() req, @Param() param: IdParamDto ) {
    return this.commentService.editComment(contentEdit, req.user.id, param.id);
  }
  
  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.commentService.removeComment(param.id);
  }
}
