import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { BcryptUtil } from 'src/utils/hashPassword';
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { PaginateAndSearchDTO } from 'src/common/dto/paginate.dto';
import { UploadService } from 'src/cloudinary/upload.service';


@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository, private readonly uploadService: UploadService ){

  }
  async createOrSaveUser(createDto: CreateUserDTO) {
    try {
      if(createDto.password) {
        const hashPassword = await BcryptUtil.hashPassword(createDto.password)
        createDto.password = hashPassword
      }
      const savedUser =  await this.userRepo.saveUser(createDto)
      return plainToInstance(User, { ...savedUser});
 
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');

    }
    
  }

  async findByEmail(email: string) {
    return this.userRepo.findUserByEmail(email)
  }


  findAll() {
    return `This action returns all s`;
  }

  async findPostsBelongUser(idUser: number, isPublic: boolean = false) {
    try {
        return await this.userRepo.findPostsBelongUser(idUser, isPublic)
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');
    }
  }
  async findOneUser(id: number) {
    try {
      const user =  await this.userRepo.findOneUserById(id)
      if(!user) {
        throw new NotFoundException("User not found")
      }
      return plainToInstance(User, user)
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');
    }
  }

  async followUserByTheirUserId(idUserNeedFollow: number, idCurrentUser: number) {
    try {
      await  this.userRepo.followUserByTheirUserId(idUserNeedFollow, idCurrentUser)
      return { message: `Followed user ${idUserNeedFollow}`, isFollowing: true }
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');
    }
  }

  async unFollowUserByTheirUserId(idUserNeedFollow: number, idCurrentUser: number) {
    try {
      return await  this.userRepo.unFollowUserByTheirUserId(idUserNeedFollow, idCurrentUser)
    
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');
    }
  }

  async getListFollower(followerOwnerId:number,  query: PaginateAndSearchDTO) {
    try {
      return await this.userRepo.getListFollower(followerOwnerId, query )
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getListFollowings(OwnerIdfollowings:number,  query: PaginateAndSearchDTO) {
    try {
      return await this.userRepo.getListFollowings(OwnerIdfollowings, query )
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  
  async getStats(idTargetUser: number) {
    try {
      return await this.userRepo.getInfoStats(idTargetUser)
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateAvatarOfUser(idUserToUpdate: number, file: Express.Multer.File) {
    try {
    const user =  await this.userRepo.findOneUserById(idUserToUpdate)
      if(!user) {
        throw new NotFoundException("User not found")
      }
    const imageUrl = await this.uploadService.uploadImage(file )
    const savedUser =  await this.userRepo.saveUser({...user, image: imageUrl})
    return plainToInstance(User, { ...savedUser}); 
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUsersNotFriends(currentUserId: number, query: PaginateAndSearchDTO) {
    try {
      return await this.userRepo.getUsersNotFriends(currentUserId, query);
    } catch (error) {
      throw new BadRequestException(error.message || 'Unexpected error');
    }
  }
}
