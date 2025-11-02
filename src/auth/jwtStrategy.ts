

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { keyjwtGuard } from 'src/guard/jwtAuthGuard';
import { UserService } from 'src/users/user.service';


export interface IPayloadToken {
    id: number,
    name: string,
    email: string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, keyjwtGuard) {
  constructor(private configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtkey') || 'superSecretKey', //từ env
    })
  }

  async validate(payload: IPayloadToken) { //payload này là data sau giải mã từ token
    const playloadFromToken =  { userId: payload.id, username: payload.name, email: payload.email };
    console.log(">> JWT Payload:", payload);
    //validate data db từ payload giải mã được
    const user = await this.userService.findByEmail(playloadFromToken.email);

    if(!user) {
        throw new BadRequestException("validate token error")
    }
    return user
  }
}
