import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { IPayloadToken } from './jwtStrategy';
import { LoginDTO, ResetPassWorDTO, VerifyTokenDTO } from './auth.dto';
import { UserService } from 'src/users/user.service';
import { BcryptUtil } from 'src/utils/hashPassword';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO } from 'src/users/user.dto';
import { MailToReceiveTokenDTO } from 'src/email/email.dto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService, 
    private mailService: EmailService,
    private configService: ConfigService,
    private redisService: RedisService
  ) {

  }

  async generateToken(user: Partial<User>, expiresIn: string | number = '1h'): Promise<string> {
    const payload: IPayloadToken = {id: user.id, email: user.email, name: user.name}
    return this.jwtService.signAsync(payload, {expiresIn: expiresIn} as JwtSignOptions)
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
       const verifyLink = `${domain}/verify-email?token=${token}`
       await this.mailService.sendEmail(mailTosenDto.email, mailTosenDto.email, verifyLink)
       return {
        message: "Mail has been sent successfully"
       }

    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }

  async sendLinkForgotPasswordtoEmail(mailData:MailToReceiveTokenDTO ) {
    try {
        const user = await this.userService.findByEmail(mailData.email)
      if(!user) {
        throw new BadRequestException("The email has not been registered")
      }
        const token = await this.generateToken({id: user.id, email: user.email, name: user.name}, '5m')

        //save token to redis to verify later
        this.redisService.set(`tokenreset${user.id}`, token, 600)

        const domain = this.configService.get("DOMAIN") || "localhost:3000"
        const verifyLink = `${domain}/reset-password?token=${token}`
        await this.mailService.sendEmailResetPassword(mailData.email, mailData.email, verifyLink)
        return {
        message: "Mail has been sent successfully"
       }
   

    } catch (error) {
           throw new BadRequestException(error.message)
    }
  }

  async verifyTokenResetPassword( query: VerifyTokenDTO) {
    try {
      const token = query.token
      await this.verifyToken(token)
      return {
        message: "token is valid"
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  async resetPass(resetPassData: ResetPassWorDTO,  query: VerifyTokenDTO) {
    try {
      const user = await this.userService.findByEmail(resetPassData.email)
        if(!user) {
        throw new BadRequestException("The email has not been registered")
      }
      const tokenRedis = await  this.redisService.get(`tokenreset${user.id}`)
      if(!tokenRedis || tokenRedis !== query.token) {
          throw new BadRequestException("token không hợp lệ hoặc hết hạn")
      }
      const hashPassword = await BcryptUtil.hashPassword(resetPassData.password)
      user.password = hashPassword
      const updatedUser = await this.userService.createOrSaveUser(user)
      return  plainToInstance(User, updatedUser)
    } catch (error) {
        throw new BadRequestException(error.message)
    }
  }
}
