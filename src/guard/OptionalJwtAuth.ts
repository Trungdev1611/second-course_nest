import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { keyjwtGuard } from './jwtAuthGuard';

@Injectable()
export class OptionalJwtGuard extends AuthGuard(keyjwtGuard) {
  handleRequest(err, user, info) {
    return user || null;
  }
}
