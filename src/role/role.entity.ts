import { BaseEntity } from 'src/common/base.entity';
import { User } from './../users/user.entity';
import {  Column, Entity, OneToMany } from "typeorm"

@Entity('roles')
export class RoleEntity extends BaseEntity{
    @Column()
    name: string

    @OneToMany(() => User, user => user.role)
    users: User[]
}