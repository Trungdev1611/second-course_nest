import { BaseEntity } from "src/common/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity{

  @Column({unique: true})
  name: string

  @Column({unique: true})
  email: string

  @Column()
  password: string

  @Column({default: ""})
  image: string;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   this.password = await bcrypt.hash(this.password, 10)
  // }
}