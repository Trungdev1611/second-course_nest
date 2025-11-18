import {
//   Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from 'src/common/dto/common.dto';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

//   @Post()
//   create(@Body() createDto: CreateDto) {
//     return this.tagService.create(createDto);
//   }

  @Get('getlist')
  @ApiResponse({
    status: 200,
    description: `get List tags and pagination`,
    schema: {
      example: {
        data:   {
          "status": "success",
          "meta": {
            "page": 1,
            "per_page": 20,
            "total": 30
          },
          "data": [
            {
              "id": 1,
              "created_at": "1978-04-22T22:25:23.000Z",
              "updated_at": "1979-11-20T03:56:58.000Z",
              "tag_name": "learning"
            }]
      },
    },
  }})
  findAll(@Query() query: PaginateAndSearchDTO) {
    return this.tagService.findAll(query);
  }

  @Delete('softdelete/:id')
  softDelete(@Param() param: IdParamDto) {
    return this.tagService.softDelete(param.id)
  }

  @Delete(':id')
  remove(@Param() param: IdParamDto) {
    return this.tagService.remove(param.id);
  }



//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.sService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
//     return this.sService.update(+id, updateDto);
//   }


}
