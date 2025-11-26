import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetMessagesDTO } from './chat.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}



  @Get('conversation/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách tin nhắn',
    description: 'Lấy danh sách tin nhắn của conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tin nhắn',
    example: {
      "data": [
        {
          "id": 2,
          "created_at": "2025-11-25T01:55:29.578Z",
          "content": "test3",
          "username": "user-test",
          "avatar": "https://picsum.photos/id/3/200/200",
          "user_id": 3
        },]
    }
  })
  async getMessages(
    @Param('id') conversationIdentifier: string,
    @Query() getMessagesDTO: GetMessagesDTO,
    @Request() req,
  ) {
    const numericFromParam = Number(conversationIdentifier);
    const resolvedConversationId = getMessagesDTO.conversationId ?? (Number.isNaN(numericFromParam) ? undefined : numericFromParam);

    const resolvedConversationKey =
      getMessagesDTO.conversationKey ??
      (!resolvedConversationId && Number.isNaN(numericFromParam)
        ? conversationIdentifier
        : undefined);

    return this.chatService.getMessages(req.user.id, {
      conversationId: resolvedConversationId,
      conversationKey: resolvedConversationKey,
      page: getMessagesDTO.page,
    });
  }


}

