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
import { JwtAuthGuard, keyjwtGuard } from 'src/guard/jwtAuthGuard';
import { IdParamDto } from 'src/common/dto/common.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags("User")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard(keyjwtGuard))
  @Post('create')
  create(@Body() createDto: CreateUserDTO) {
    return this.userService.createOrSaveUser(createDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'dùng để lấy thông tin của một user với id của họ', 
    description:
      `Nếu thành công sẽ trả về thông tin user.
      `
  })
    @ApiResponse({
    status: 200,
    schema: {
      example: {
        name: "name user",
        email: "trungdev1611@gmail.com"
      },
    },
  })
  findOne(@Param() param: IdParamDto) {
    console.log("type of id:::", typeof(param.id))
    return this.userService.findOneUser(param.id);
  }



}
