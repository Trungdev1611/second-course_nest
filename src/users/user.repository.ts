import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./user.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findUserByName(name: string) {
    return await this.userRepo.findOne({where: {name}})
  }

  async saveUser(createUser: CreateUserDTO) {
    return await this.userRepo.save(createUser);
  }

  async findOneUserById(id:number) {
    return await this.userRepo.findOne({where: {id}})
  }
}