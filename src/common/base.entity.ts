import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamp' })
  created_at: Date

  
  @Column({ type: 'timestamp' })
  updated_at: Date
}