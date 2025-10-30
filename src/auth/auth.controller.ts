import { AuthService } from 'src/auth/auth.service';
import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { CreateUserDTO } from 'src/users/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
    @ApiOperation({
    summary: 'Đăng nhập tài khoản', 
    description:
      'Endpoint này cho phép người dùng đăng nhập vào hệ thống bằng email và mật khẩu. ' +
      'Nếu thông tin hợp lệ, API sẽ trả về access token để sử dụng cho các yêu cầu tiếp theo.',
  })
    @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công. Trả về access token.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        name: "example_name",
        email: "example_email"

      },
    },
  })
  loginAuth(@Body() loginData: LoginDTO) {
    return this.authService.login(loginData);
  }

  @Post('register')
  registerAuth(@Body() createDto: CreateUserDTO) {
    return this.authService.register(createDto);
  }
}
