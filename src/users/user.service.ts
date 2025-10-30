import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { BcryptUtil } from 'src/utils/hashPassword';
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';


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
      const savedUser =  await this.userRepo.saveNewUser(createDto)
      // const user =  new User(savedUser)

      return plainToInstance(User, { ...savedUser});
      // return user
      // return {
      //   ...user,
      //   token: "test"
      // }
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');

    }
    
  }

  async findByEmail(email: string) {
    try {
        return this.userRepo.findUserByEmail(email)
    } catch (error) {
      throw new BadRequestException(error.message || 'validate findByEmail error');
    }
  }

  findAll() {
    return `This action returns all s`;
  }

  findOne(id: number) {
    return `This action returns a #id `;
  }

}
