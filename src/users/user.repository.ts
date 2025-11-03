import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

  async findPostsBelongUser(idUser: number, isPublic?: boolean) {
    const query =  this.userRepo.createQueryBuilder("user")
    .leftJoinAndSelect("user.posts", "post")
    .where('user.id = :userid', {userid: idUser})
    if(isPublic) {
      query.andWhere('post.status = :status', {status: 'published'})
    }
    
    return await query.getOne()
  }

  async followUserByTheirUserId(idUserNeedFollow: number, idCurrentUser: number) {
    if(idCurrentUser === idUserNeedFollow) {
      throw new BadRequestException(`You can not follow yourseft`);
    }

    //tìm user hiện tại và danh sách người họ đang following
    // const curentUser = await this.userRepo.findOne({
    //   where: {id: idCurrentUser},
    //   relations: ["followings"]
    // }) 

    // //tìm user mà người đó muốn following
    // const userWanttoFollow = await this.userRepo.findOne({
    //   where: {id: idUserNeedFollow}
    // })

    // if(!curentUser || !userWanttoFollow) {
    //   throw new NotFoundException(`User not found`);
    // }
    // const checkIsFollowUser = curentUser.followings.some(item => {
    //   return item.id === userWanttoFollow.id
    // })

    // if(checkIsFollowUser) {
    //   throw new BadRequestException(`The user has been followed`);
    // }
    // curentUser.followings.push(userWanttoFollow)

    // return await this.userRepo.save(curentUser)

    const [curentUser, userWantToFollow] = await Promise.all([
      this.userRepo.findOne({ where: { id: idCurrentUser } }),
      this.userRepo.findOne({ where: { id: idUserNeedFollow } }),
    ]);
  
    if (!curentUser || !userWantToFollow) {
      throw new NotFoundException(`User not found`);
    }
  
    // Check xem đã follow chưa bằng query trực tiếp
    const isFollowing = await this.userRepo
      .createQueryBuilder("user")
      .leftJoin("user.followings", "followings")
      .where("user.id = :curId", { curId: idCurrentUser })
      .andWhere("followings.id = :followId", { followId: idUserNeedFollow })
      .getOne();
  
    if (isFollowing) {
      throw new BadRequestException(`The user has already been followed`);
    }
  
    // Thêm vào followings mà không cần load tất cả
    await this.userRepo
      .createQueryBuilder()
      .relation(User, "followings")
      .of(curentUser)
      .add(userWantToFollow);
  
    return { message: `Followed user ${idUserNeedFollow}`, isFollowing: true };
  }
}