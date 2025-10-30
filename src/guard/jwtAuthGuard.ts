import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


export const keyjwtGuard = 'jwt'
@Injectable()
export class JwtAuthGuard extends AuthGuard(keyjwtGuard) {
//   handleRequest(err:any, user, info) {
//     if (err || !user) {
//       throw err || new UnauthorizedException();
//     }
//     return user;
//   }
}
