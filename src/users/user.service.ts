import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository ){

  }
  create(createDto: CreateUserDTO) {
    return this.userRepo.saveNewUser(createDto)
  }

  findAll() {
    return `This action returns all s`;
  }

  findOne(id: number) {
    return `This action returns a #id `;
  }

}
