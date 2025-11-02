import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { RoleEntity } from "src/role/role.entity";
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
  role: RoleEntity
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