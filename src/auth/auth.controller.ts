import { AuthService } from 'src/auth/auth.service';
import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { CreateUserDTO } from 'src/users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginAuth(@Body() loginData: LoginDTO) {
    return this.authService.login(loginData);
  }

  @Post('register')
  registerAuth(@Body() createDto: CreateUserDTO) {
    return this.authService.register(createDto);
  }
}
