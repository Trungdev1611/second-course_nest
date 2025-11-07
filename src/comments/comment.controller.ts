import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentCreateDTO } from './comment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';
import { IdParamDto } from 'src/common/dto/common.dto';

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
    description: 'API success - trả về data theo client query và pagination',
    type: CommentCreateDTO,
  })
  create(@Body() createDto: CommentCreateDTO, @Req() req, @Param() param: IdParamDto ) {
    return this.commentService.create(createDto, req.user.id, param.id );
  }

//   @Get()
//   findAll() {
//     return this.sService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.sService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
//     return this.sService.update(+id, updateDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.sService.remove(+id);
//   }
}
