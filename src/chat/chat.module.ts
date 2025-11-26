import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ConversationEntity } from './conversation.entity';
import { ConversationMember } from './conversation_member.entity';
import { MessageEntity } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity, ConversationMember, MessageEntity])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}

