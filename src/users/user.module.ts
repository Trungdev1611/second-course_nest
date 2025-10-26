import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <- cung cấp Repository<User>
  providers: [ UserService, UserRepository],   // chỉ cần wrapper + service
  controllers: [UserController],
  exports: [],                  // nếu dùng ngoài module khác
})
export class UserModule {}