import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ConversationEntity } from './conversation.entity';
import { ConversationMember } from './conversation_member.entity';
import { MessageEntity } from './message.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, ConversationMember, MessageEntity]),
    JwtModule.register({}),
    ConfigModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}

