import { AuthService } from 'src/auth/auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO, ResetPassWorDTO, VerifyTokenDTO } from './auth.dto';
import { CreateUserDTO } from 'src/users/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MailToReceiveTokenDTO } from 'src/email/email.dto';
import { EmailService } from 'src/email/email.service';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';

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
    }

  @Post("password-recovery")
   @ApiOperation({
      summary: 'Nhập email đã đăng kí để nhận link reset password', 
      description:
        `Endpoint này sẽ gửi 1 email chứa link để đi đến trang lấy lại mật khẩu .
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
   sendLinkForgotPasswordtoEmail(@Body() mailData: MailToReceiveTokenDTO) {
    return this.authService.sendLinkForgotPasswordtoEmail(mailData)
  }

  @Post("reset-password")
  @ApiOperation({
      summary: 'Nhập email đã đăng kí và mật khẩu mới để reset', 
      description:
        `Nếu thành công người dùng có thể dùng thông tin đã nhập để login .
        `
      
    })
      @ApiResponse({
      status: 200,
      description: `Có thể login bằng thông tin mới`,
      schema: {
        example: {
          message: "success",
        },
      },
    })
  resetPassWord(@Body() resetPassData: ResetPassWorDTO, @Query() query: VerifyTokenDTO) {
    return this.authService.resetPass(resetPassData, query)
  }

  @Get("verify-token-reset-password")
  @ApiOperation({
      summary: 'dùng để verify token trên url khi truy cập vào trang lần đầu', 
      description:
        `Nếu thành công người dùng có thể được truy cập vào trang để reset password .
        `
    })
      @ApiResponse({
      status: 200,
      schema: {
        example: {
          message: "token is valid",
        },
      },
    })
    verifyTokenResetPassword( @Query() query: VerifyTokenDTO) {
      return this.authService.verifyTokenResetPassword( query)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'dùng để lấy thông tin của người đang đăng nhập', 
        description:
          `Nếu thành công sẽ trả về thông tin ngừoi đăng nhập.
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
      async getCurrentUserInfo(@Req() req ) {
          console.log(`req.user::`, req.user)
          return req.user
      }
}
