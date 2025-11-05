import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { DataSource, Repository } from "typeorm";
import { CreateUserDTO } from "./user.dto";
import { PaginateAndSearchDTO } from "src/common/dto/paginate.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private dataSource: DataSource
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

  async unFollowUserByTheirUserId(idUserNeedUnFollow: number, idCurrentUser: number) {
    const isFollowed = await this.userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.followings', 'following')
    .where("user.id=:id_current_user", {id_current_user: idCurrentUser})
    .andWhere('following.id = :idUserNeedUnFollow', {idUserNeedUnFollow}).getOne()

    if(!isFollowed) {
      throw new BadRequestException(`You did not follow the target user`);
    }
    await this.userRepo.createQueryBuilder().delete().from("user_follows")
    .where("follower_id=:idCurrentUser", {idCurrentUser})
    .andWhere("following_id=:idUserNeedUnFollow", {idUserNeedUnFollow})
    .execute()
    return { message: `UnFollowed user ${idUserNeedUnFollow}`, isFollowing: false };
  }

  async getListFollower(followerOwnerId: number, query: PaginateAndSearchDTO) {
    const { page = 1, per_page = 10 } = query;
    const [data, totals] =  await this.userRepo.createQueryBuilder('user')
    .innerJoin('user.followings', 'f')
    .where("f.id=:followerOwnerId", {followerOwnerId})
    .skip((page - 1) * per_page)
    .take(per_page)
    .getManyAndCount()
   
    // const [data, totals] = await this.userRepo.findAndCount({
    //   relations: ['followers'],
    //   where: {
    //     followers: {
    //       id: followerOwnerId
    //     }
    //   },
    //   skip: (page - 1) * per_page,
    //   take: per_page,
    // })

        return {
      data: data,
      metadata: {
        total: totals,
        page: page,
        per_page: per_page
      }
    }

  }

  async getListFollowings(followerOwnerId: number, query: PaginateAndSearchDTO) {
    const { page = 1, per_page = 10 } = query;
    const [data, totals] =  await this.userRepo.createQueryBuilder('user')
    .innerJoin('user.followers', 'f')
    .where("f.id=:followerOwnerId", {followerOwnerId})
    .skip((page - 1) * per_page)
    .take(per_page)
    .getManyAndCount()
   
        return {
      data: data,
      metadata: {
        total: totals,
        page: page,
        per_page: per_page
      }
    }
  
  }

  async getInfoStats(idTargetUser: number) {
    const sql = `
    SELECT 
      (SELECT COUNT(*) FROM blogs WHERE user_id = $1) AS post_count,
      (SELECT COALESCE(SUM(views), 0) FROM blogs WHERE user_id = $1) AS total_views,
      (SELECT COUNT(*) FROM user_follows WHERE following_id = $1) AS follower_count,
      (SELECT COUNT(*) FROM user_follows WHERE follower_id = $1) AS following_count
  `;

  const [result] = await this.dataSource.query(sql, [idTargetUser])
  return result
  }
}

  

