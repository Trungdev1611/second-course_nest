import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date
}