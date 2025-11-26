import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { ConversationMember } from './conversation_member.entity';
import { MessageEntity } from './message.entity';

interface SaveMessageInput {
  roomId: string;
  senderId: number;
  content: string;
  attachmentUrl?: string;
  replyToId?: number;
  messageKey?: string;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(ConversationMember)
    private readonly participantRepo: Repository<ConversationMember>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async saveMessage({
    roomId,
    senderId,
    content,
    attachmentUrl,
    replyToId,
    messageKey,
  }: SaveMessageInput) {
    if (!roomId || !senderId || !content?.trim()) {
      throw new BadRequestException('Invalid message payload');
    }

    return this.dataSource.transaction(async (manager) => {
      const conversationRepository = manager.getRepository(ConversationEntity);
      const participantRepository = manager.getRepository(ConversationMember);
      const messageRepository = manager.getRepository(MessageEntity);

      let conversation = await conversationRepository.findOne({
        where: { conversationKey: roomId },
      });

      if (!conversation) {
        conversation = conversationRepository.create({
          conversationKey: roomId,
          type: this.detectConversationType(roomId),
        });
        conversation = await conversationRepository.save(conversation);
      }

      const participantIds = this.extractParticipantIdsFromKey(roomId);
      await this.ensureParticipants(participantRepository, conversation.id, participantIds);

      const newMessage = messageRepository.create({
        conversationId: conversation.id,
        senderId,
        content,
        attachmentUrl,
        replyToId,
        messageKey: messageKey || undefined,
      });

      return await messageRepository.save(newMessage);
    });
  }

  private detectConversationType(roomId: string) {
    const participantIds = this.extractParticipantIdsFromKey(roomId);
    return participantIds.length > 2 ? 'group' : 'direct';
  }

  private extractParticipantIdsFromKey(roomId: string): number[] {
    const parts = roomId.split('_');
    if (parts.length < 3) {
      return [];
    }
    return parts
      .slice(1)
      .map((value) => Number(value))
      .filter((value) => !Number.isNaN(value));
  }

  private async ensureParticipants(
    participantRepository: Repository<ConversationMember>,
    conversationId: number,
    participantIds: number[],
  ) {
    if (!participantIds.length) {
      return;
    }

    const existingParticipants = await participantRepository.find({
      where: {
        userId: In(participantIds),
      },
      relations: ['conversation'],
    });
    const existingIds = new Set(
      existingParticipants
        .filter((participant) => participant.conversationId === conversationId)
        .map((p) => p.userId),
    );


    const missingParticipants = participantIds.filter((id) => !existingIds.has(id));

    if (!missingParticipants.length) {
      return;
    }

    const newParticipants = missingParticipants.map((userId) =>
      participantRepository.create({
        conversationId,
        userId,
        role: 'member',
      }),
    );

    await participantRepository.save(newParticipants);
  }

  private async resolveConversationReference(
    conversationId?: number,
    conversationKey?: string,
  ): Promise<ConversationEntity> {
    if (conversationId) {
      const existing = await this.conversationRepo.findOne({
        where: { id: conversationId },
      });

      if (!existing) {
        throw new BadRequestException('Cuộc trò chuyện không tồn tại');
      }

      return existing;
    }

    if (!conversationKey) {
      throw new BadRequestException('Thiếu thông tin conversation');
    }

    const participantIds = this.extractParticipantIdsFromKey(conversationKey);
    if (participantIds.length < 2) {
      throw new BadRequestException('Conversation key không hợp lệ');
    }

    let conversation = await this.conversationRepo.findOne({
      where: { conversationKey },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        conversationKey,
        type: this.detectConversationType(conversationKey),
      });
      conversation = await this.conversationRepo.save(conversation);
    }

    await this.ensureParticipants(this.participantRepo, conversation.id, participantIds);

    return conversation;
  }

  async getMessages(
    userId: number,
    options: { conversationId?: number; conversationKey?: string; page?: number },
  ) {
    try {
      const conversation = await this.resolveConversationReference(
        options.conversationId,
        options.conversationKey,
      );

      const participant = await this.participantRepo.findOne({
        where: { conversationId: conversation.id, userId },
      });

      if (!participant) {
        throw new BadRequestException(
          'Bạn không có quyền truy cập cuộc trò chuyện này',
        );
      }

      const take = 5;
      const page = options.page && options.page > 0 ? options.page : 1;
      
      // Đếm tổng số messages
      const totalMessages = await this.messageRepo
        .createQueryBuilder('message')
        .where('message.conversation_id = :conversation_id', {
          conversation_id: conversation.id,
        })
        .getCount();
      
      const totalPages = Math.ceil(totalMessages / take);

      const messageQuery = this.messageRepo
        .createQueryBuilder('message')
        .leftJoin('message.sender', 'sender')
        .leftJoin('message.conversation', 'conversation')
        .where('message.conversation_id = :conversation_id', {
          conversation_id: conversation.id,
        })
        .orderBy('message.created_at', 'DESC')
        .select([
          'message.id as id',
          'message.created_at as created_at',
          'message.content as content',
          'message.message_key as message_key',
          'sender.name as username',
          'sender.image as avatar',
          'sender.id as user_id',
        ])
        .skip(take * (page - 1))
        .limit(take);

      const data = await messageQuery.getRawMany();

      return {
        data,
        metadata: {
          conversationId: conversation.id,
          conversationKey: conversation.conversationKey,
          page,
          pageSize: take,
          totalMessages,
          totalPages,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Không thể tải tin nhắn');
    }
  }
}

