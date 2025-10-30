import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceConfig from './config/db.config';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceConfig
    }), 
    ConfigModule.forRoot({
      isGlobal: true, // 👈 Giúp ConfigModule dùng được ở mọi nơi
      envFilePath: '.env', // (tuỳ chọn) chỉ định file env
      cache: true, // (tuỳ chọn) cache để load nhanh hơn
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
