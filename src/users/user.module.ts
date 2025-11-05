import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CouldinaryModule } from 'src/cloudinary/cloudinari.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CouldinaryModule],
  providers: [ UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}