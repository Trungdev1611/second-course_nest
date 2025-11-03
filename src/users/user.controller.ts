import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, keyjwtGuard } from 'src/guard/jwtAuthGuard';
import { IdParamDto } from 'src/common/dto/common.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalJwtGuard } from 'src/guard/OptionalJwtAuth';


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

  @Get(':id/posts')
  @ApiBearerAuth()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({
    summary: 'dùng để lấy danh sách bài posts của 1 user: nếu có token thì lấy tất cả private và public posts, nếu không chỉ lấy public post', 
    description:
      `Nếu thành công sẽ trả về list posts.
      `
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: "list posts",
    },
      } 
  })
  findPostsBelongUser(@Param() param:IdParamDto, @Req() req ) {
    return this.userService.findPostsBelongUser(param.id, req.user)
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
    return this.userService.findOneUser(param.id);
  }

  @Post(':id/follow') //id của ngừoi được follow
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'dùng để follow 1 user dựa vào id của họ', 
    description:
      `Nếu thành công user đó sẽ được thêm vào danh sách người bạn đang follow.
      `
  })
    @ApiResponse({
    status: 200,
    schema: {
      example: { message: "Followed", isFollowing: true },
    },
  })
  followUserByTheirUserId(@Param() param: IdParamDto, @Req() req) {
    return this.userService.followUserByTheirUserId(param.id, req.user.id)
  }

  
  @Post(':id/unfollow') //id của ngừoi được follow
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'dùng để un-follow 1 user dựa vào id của họ', 
    description:
      `Nếu thành công user đó sẽ được xoá trong danh sách người bạn đang follow.
      `
  })
    @ApiResponse({
    status: 200,
    schema: {
      example: { message: "Followed", isFollowing: true },
    },
  })
  unFollowUserByTheirUserId(@Param() param: IdParamDto, @Req() req) {
    return this.userService.unFollowUserByTheirUserId(param.id, req.user.id)
  }


}
