import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

// NestJS repository from v0.3+
@Injectable()
export class FriendShipRepository {
  private readonly userRepo: Repository<User>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async getFriendShipbyUserId(idUser: number): Promise<User[]> {
    return await this.userRepo.find({
        where: {
            id: idUser
        },
        relations: {
            friends: true
        },
        select: {
            id: true,
            name: true,
            email: true,
            friends: {
              id: true,
              name: true,
              image: true
            }
          }
    });
  }
}