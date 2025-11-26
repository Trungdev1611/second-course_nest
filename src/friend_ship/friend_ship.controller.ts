import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FriendShipService } from './friendship.service';
import { IdParamDto } from 'src/common/dto/common.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FriendShip')
@Controller('friendship')
export class FriendShipController {
  constructor(private readonly friendShipService: FriendShipService) {}

//   @Post()
//   create(@Body() createDto: CreateDto) {
//     return this.sService.create(createDto);
//   }

  @Get('/:id/listfriend')
  findAll(@Param() param: IdParamDto) {
    return this.friendShipService.getFriendShipbyUserId(param.id);
  }

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
