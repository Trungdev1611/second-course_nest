import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDTO {
  @ApiProperty({
    description: 'Nội dung tin nhắn',
    example: 'Xin chào, bạn có thể giúp tôi không?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID của conversation',
    example: 1,
  })
  @IsNumber()
  conversationId: number;

  @ApiPropertyOptional({
    description: 'ID của tin nhắn được reply (nếu có)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  replyToId?: number;
}

export class GetMessagesDTO {
  @ApiProperty({
    description: 'ID của conversation',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  conversationId: number;

  @ApiPropertyOptional({
    description: 'Số trang',
    example: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Số lượng tin nhắn mỗi trang',
    example: 20,
  })
  @IsOptional()
  limit?: number;
}

