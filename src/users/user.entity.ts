import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
@Entity()
export class User 
extends BaseEntity
{


  @Column({unique: true})
  name: string

  @Column({unique: true})
  email: string

  @Column()
  @Exclude()
  password: string

  @Column({default: ""})
  image: string;

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