import {
  // Body,
  Controller,
  Get,
  Param,
  // Post,
  // UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDTO } from './user.dto';
// import { AuthGuard } from '@nestjs/passport';
// import { keyjwtGuard } from 'src/guard/jwtAuthGuard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly useService: UserService) {}

  @Get()
  findAll() {
    return this.useService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.useService.findOne(+id);
  }
}
