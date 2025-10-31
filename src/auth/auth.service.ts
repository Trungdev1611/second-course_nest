import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { IPayloadToken } from './jwtStrategy';
import { LoginDTO } from './auth.dto';
import { UserService } from 'src/users/user.service';
import { BcryptUtil } from 'src/utils/hashPassword';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO } from 'src/users/user.dto';
import { MailToReceiveTokenDTO } from 'src/email/email.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService, 
    private mailService: EmailService,
    private configService: ConfigService
  ) {

  }

  async generateToken(user: Partial<User>): Promise<string> {
    const payload: IPayloadToken = {id: user.id, email: user.email, name: user.name}
    return this.jwtService.signAsync(payload)
  }

  //hàm này chỉ cần khi verify thủ công còn bình thường vào route là dùng jwt strategy
  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token)
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
    return this.userService.createOrSaveUser(payload)
  }
   
  async verifyTokenEmail(token: string) {
    try {
      const payload = await this.verifyToken(token)
      const user = await this.userService.findByEmail(payload.email)
      if(!user) {
        throw new BadRequestException("The User not found")
      }
      user.is_verify_email = true
      return this.userService.createOrSaveUser(user)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async sendTokenToMail(mailTosenDto: MailToReceiveTokenDTO){
    try {
      const user = await this.userService.findByEmail(mailTosenDto.email)
      if(!user) {
        throw new BadRequestException("The email has not been registered")
      }
       const token = await this.generateToken({id: user.id, email: user.email, name: user.name})
       const domain = this.configService.get("DOMAIN") || "localhost:3000"
       const verifyLink = `${domain}?token=${token}`
       await this.mailService.sendEmail(mailTosenDto.email, mailTosenDto.email, verifyLink)
       return {
        message: "Mail has been sent successfully"
       }

    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }
}
