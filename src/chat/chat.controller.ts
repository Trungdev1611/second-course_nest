import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDTO, GetMessagesDTO } from './chat.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gửi tin nhắn',
    description: 'Gửi tin nhắn trong conversation',
  })
  @ApiResponse({
    status: 201,
    description: 'Tin nhắn đã được gửi thành công',
  })
  async sendMessage(@Body() sendMessageDTO: SendMessageDTO, @Req() req: any) {
    const userId = req.user?.id;
    // TODO: Implement send message logic
    return this.chatService.sendMessage(
      sendMessageDTO.content,
      sendMessageDTO.conversationId,
      userId,
      sendMessageDTO.replyToId,
    );
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách tin nhắn',
    description: 'Lấy danh sách tin nhắn của conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tin nhắn',
  })
  async getMessages(@Query() getMessagesDTO: GetMessagesDTO) {
    // TODO: Implement get messages logic
    return this.chatService.getMessages(
      getMessagesDTO.conversationId as number,
      getMessagesDTO.page,
      getMessagesDTO.limit,
    );
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách conversations',
    description: 'Lấy danh sách conversations của user',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách conversations',
  })
  async getConversations(@Query() query: { page?: number; limit?: number }, @Req() req: any) {
    const userId = req.user?.id;
    // TODO: Implement get conversations logic
    return this.chatService.getConversations(userId, query.page, query.limit);
  }

  @Get('conversations/:id/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách participants của conversation',
    description: 'Lấy danh sách người tham gia trong conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách participants',
  })
  async getConversationParticipants(@Param('id') conversationId: number) {
    // TODO: Implement get participants logic
    return this.chatService.getConversationParticipants(conversationId);
  }
}

