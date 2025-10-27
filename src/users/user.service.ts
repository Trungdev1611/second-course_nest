import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { BcryptUtil } from 'src/utils/hashPassword';


@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository ){

  }
  async create(createDto: CreateUserDTO) {
    try {
      if(createDto.password) {
        const hashPassword = await BcryptUtil.hashPassword(createDto.password)
        createDto.password = hashPassword
      }
      return await this.userRepo.saveNewUser(createDto)
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');

    }
    
  }

  findAll() {
    return `This action returns all s`;
  }

  findOne(id: number) {
    return `This action returns a #id `;
  }

}
