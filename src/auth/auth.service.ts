import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { IPayloadToken } from './jwtStrategy';
import { LoginDTO } from './auth.dto';
import { UserService } from 'src/users/user.service';
import { BcryptUtil } from 'src/utils/hashPassword';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO } from 'src/users/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private userService: UserService) {

  }

  async generateToken(user: User): Promise<string> {
    const payload: IPayloadToken = {id: user.id, email: user.email, name: user.name}
    return this.jwtService.signAsync(payload)
  }

  //hàm này chỉ cần khi verify thủ công còn bình thường vào route là dùng jwt strategy
  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token)
  }

  async login(payload: LoginDTO) {
    try {
        const user =  await this.userService.findByEmail(payload.email)
        if(!user) {
            throw new UnauthorizedException('Email không tồn tại');
        }

        const isMatch = await BcryptUtil.comparePassword(payload.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Mật khẩu không đúng');
          }
        const access_token = await this.generateToken(user);

        return plainToInstance(User, { ...user, token: access_token});
    } catch (error) {
        
    }
  }

  async register(payload: CreateUserDTO) {
    return this.userService.createUser(payload)
  }
   
}
