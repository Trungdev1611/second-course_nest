import { AuthService } from 'src/auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { LoginDTO, VerifyTokenDTO } from './auth.dto';
import { CreateUserDTO } from 'src/users/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailToReceiveTokenDTO } from 'src/email/email.dto';
import { EmailService } from 'src/email/email.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly mailService: EmailService
  ) {}

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

  @Get(`verify-token-in-email`)
    @ApiOperation({
      summary: 'Verify token nhận được từ email', 
      description:
        `Endpoint này sẽ verify token từ mà user nhận được từ mail.
        `
       
    })
      @ApiResponse({
      status: 200,
      description: ` Khi verify 
        xong thì sẽ nhận cột isverrify trong user sẽ chuyển true`,
      schema: {
        example: {
          is_verify_mail: true,
        },
      },
    })
  verifyTokenEmail(@Query() query: VerifyTokenDTO) {
    return this.authService.verifyTokenEmail(query.token)
  }

  @Post("register-mail-get-token")
    @ApiOperation({
      summary: 'Nhập email đã đăng kí để verify', 
      description:
        `Endpoint này sẽ gửi 1 email chứa link để verify vào email mà người dùng nhập.
        `
      
    })
      @ApiResponse({
      status: 200,
      description: `nhận thông báo thành công và một thư được gửi vào mail`,
      schema: {
        example: {
          message: "success",
        },
      },
    })
  create(@Body() mailTosenDto: MailToReceiveTokenDTO) {
    return this.authService.sendTokenToMail(mailTosenDto)
    // const token = this.authService.generateToken(mail)
    //   return this.mailService.sendEmail(mailTosenDto.email, mailTosenDto.email)
    }
}
