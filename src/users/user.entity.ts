import { BaseEntity } from "src/common/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from 'bcrypt'

@Entity()
export class User extends BaseEntity{

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  image: string

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}