import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { MessageEntity } from './message.entity';

export type ConversationMemberRole = 'member' | 'admin';

@Entity({ name: 'chat_participants' })
@Unique(['conversationId', 'userId'])
export class ConversationMember extends BaseEntity {
  @Column({ name: 'conversation_id' })
  conversationId: number;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'last_read_message_id', nullable: true })
  lastReadMessageId?: number;

  @ManyToOne(() => MessageEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_read_message_id' })
  lastReadMessage?: MessageEntity;

  @Column({
    name: 'role',
    type: 'enum',
    enum: ['member', 'admin'],
    default: 'member',
  })
  role: ConversationMemberRole;
}
