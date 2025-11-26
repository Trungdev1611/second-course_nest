import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity({ name: 'chat_messages' })
export class MessageEntity extends BaseEntity {
  @Column({ name: 'conversation_id' })
  conversationId: number;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;

  @Column({ name: 'sender_id' })
  senderId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'attachment_url', nullable: true })
  attachmentUrl?: string;

  @Column({ name: 'reply_to_id', nullable: true })
  replyToId?: number;

  @ManyToOne(() => MessageEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reply_to_id' })
  replyTo?: MessageEntity;

  @Column({ name: 'message_key', nullable: true, unique: true })
  messageKey?: string;
}
