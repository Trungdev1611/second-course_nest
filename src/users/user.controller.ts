import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { keyjwtGuard } from 'src/guard/jwtAuthGuard';


@Controller('user')
export class UserController {
  constructor(private readonly useService: UserService) {}

  @UseGuards(AuthGuard(keyjwtGuard))
  @Post('create')
  create(@Body() createDto: CreateUserDTO) {
    return this.useService.createOrSaveUser(createDto);
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
