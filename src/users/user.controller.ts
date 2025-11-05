import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, keyjwtGuard } from 'src/guard/jwtAuthGuard';
import { IdParamDto } from 'src/common/dto/common.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalJwtGuard } from 'src/guard/OptionalJwtAuth';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { FileInterceptor } from '@nestjs/platform-express';


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

  @Get(':id/followers') //danh sách người follow the user
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'dùng để lấy danh sách người followers theo user id', 
    description:
      `Nếu thành công sẽ trả về list các user follow the user mà bạn đang call api
      `
  })
    @ApiResponse({
    status: 200,
    schema: {
      example: { data: ["list followers"],meta: "metadata" },
    },
  })
  getListFollower(@Param() param: IdParamDto,  @Query() query: PaginateAndSearchDTO) {
    return this.userService.getListFollower(param.id,  query)
  }

  @Get(':id/followings') //danh sách người mà user đang follows
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get list users who are followings the target user', 
    description:
      `Nếu thành công sẽ trả về list các user mà user đang tìm kiếm following
      `
  })
    @ApiResponse({
    status: 200,
    schema: {
      example: { data: ["list followings"],meta: "metadata" },
    },
  })
  getListFollowings(@Param() param: IdParamDto,  @Query() query: PaginateAndSearchDTO) {
    return this.userService.getListFollowings(param.id,  query)
  }

  @Get(':id/stats')
  @ApiOperation({
    summary: 'this api to stats user', 
    description:
      `If it success, it will return the stat information
      `
  })
    @ApiResponse({
    status: 200,
    schema: {
      example: { data: { postCount: 10, followersCount: 10, followingCount: 1, totalViews: 1 } },
    },
  })
  getStats(@Param() param: IdParamDto) {
    return this.userService.getStats(param.id)
  }

  @Put(':id/update-avatar')
  @ApiOperation({
    summary: 'this api will update the avatar of the target user by using the image was uploaded', 
    description:
      `If it success, the avatar of the target user will be updated
      `
  })
    @ApiResponse({
    status: 200,
    schema: {
      example: { data: "Object thông tin user" }
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // <-- this shows "Choose File" button
        },
      },
    },
  })

  @ApiConsumes('multipart/form-data') //accept -formdata
  @UseInterceptors(FileInterceptor('file'))
  updateAvatarOfUser(@Param() param: IdParamDto, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatarOfUser(param.id, file)
  }

}
