import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentCreateDTO } from './comment.dto';


@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createDto: CommentCreateDTO) {
    return this.commentService.create(createDto);
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
