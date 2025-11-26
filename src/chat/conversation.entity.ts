import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ConversationMember } from './conversation_member.entity';
import { MessageEntity } from './message.entity';

export type ConversationType = 'direct' | 'group';

@Entity({ name: 'chat_conversations' })
export class ConversationEntity extends BaseEntity {
  @Column({ name: 'conversation_key', type: 'varchar', unique: true })
  conversationKey: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ['direct', 'group'],
    default: 'direct',
  })
  type: ConversationType;

  @Column({ name: 'title', type: 'varchar', nullable: true })
  title?: string;

  @OneToMany(() => ConversationMember, (m) => m.conversation)
  members: ConversationMember[];

  @OneToMany(() => MessageEntity, (m) => m.conversation)
  messages: MessageEntity[];
}