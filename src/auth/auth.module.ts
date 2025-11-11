import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy';
import { UserModule } from 'src/users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtkey') || 'superSecretKey',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UserModule,
    EmailModule,RedisModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: []
})
export class AuthModule {}