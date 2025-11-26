import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { RoleEntity } from "src/role/role.entity";
import { BlogEntity } from "src/blogs/blog.entity";
import { LikeEntity } from "src/likes/Like.entity";
import { CommentEntity } from "src/comments/comment.entity";
// import { Friendship } from "src/friend_ship/friend_ship.entity";
@Entity()
export class User extends BaseEntity {
  @Column({unique: true})
  name: string

  @Column({unique: true})
  email: string

  @Column()
  @Exclude()
  password: string

  @Column({default: ""})
  image: string;

  @Column({default: false})
  is_verify_email: boolean

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity

  @OneToMany(() => BlogEntity, (post) => post.user)
  posts: BlogEntity

  //implement the feature: follow user
  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({
    name: "user_follows",
    joinColumn: {
      name: "follower_id", //người đi follow
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'following_id', //ngừoi được follow
      referencedColumnName: 'id'
    }

  })
  followings: User[] //người mà bạn đang follow

  @ManyToMany(() => User, (user) => user.followings)
  followers: User[] //người mà follow mình

  @OneToMany(() => LikeEntity, like => like.user)
  likes: LikeEntity[]

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: CommentEntity[]

  // @OneToMany(() => Friendship, sentFriendRequests => sentFriendRequests.requester)
  // sentFriendRequests: Friendship[]

  // @OneToMany(() => Friendship, receivedFriendRequests => receivedFriendRequests.receiver)
  // receivedFriendRequests: Friendship[]

  @ManyToMany(() => User, user => user.friends)
  @JoinTable({
    name: "friendship",
    joinColumn: {
      name: "user_target_id", //user
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'friend_id', //bạn của user
      referencedColumnName: 'id'
    }

  })
  friends: User[]


  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 10)
  // }

}