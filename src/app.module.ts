import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceConfig from './config/db.config';
AppService
@Module({
  imports: [TypeOrmModule.forRoot({
    ...dataSourceConfig
  }), 
  
  UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
