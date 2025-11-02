import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy';
import { UserModule } from 'src/users/user.module';
import { EmailModule } from 'src/email/email.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtkey || 'superSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    EmailModule,
    RedisModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: []
})
export class AuthModule {}