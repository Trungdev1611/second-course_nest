import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly useService: UserService) {}

  @Post()
  create(@Body() createDto: CreateUserDTO) {
    return this.useService.create(createDto);
  }

  @Get()
  findAll() {
    return this.useService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.useService.findOne(+id);
  }



}
