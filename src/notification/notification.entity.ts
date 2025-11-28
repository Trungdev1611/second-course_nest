import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'notifications' })
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'content' })
  content: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ['normal', 'request_friend', 'accept_friend'],
    default: 'normal',
  })
  type: 'normal' | 'request_friend' | 'accept_friend';

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.notifies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'requester_id', nullable: true })
  requesterId?: number;

@Column({
  name: 'status',
  type: 'enum',
  enum: ['pending', 'accepted', 'rejected'],
  default: 'pending',
})
status: 'pending' | 'accepted' | 'rejected';
}