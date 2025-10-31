import { IsString, IsOptional, IsEnum, IsInt, Min, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogDTO {
  @ApiProperty({
    description: 'Tiêu đề bài viết',
    example: 'Hướng dẫn NestJS',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Nội dung bài viết',
    example: 'Nội dung chi tiết về cách sử dụng NestJS...',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn cho bài viết',
    example: 'Tổng quan về NestJS',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({
    description: 'Ảnh đại diện cho bài viết',
    example: 'https://example.com/thumbnail.png',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái bài viết',
    example: 'draft',
    enum: ['draft', 'published', 'archived'],
  })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiPropertyOptional({
    description: 'Số lượt xem (mặc định 0)',
    example: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  views?: number = 0;

  @ApiPropertyOptional({
    description: 'Số lượt thích (mặc định 0)',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  likes?: number = 0;

  @ApiPropertyOptional({
    description: 'Thời gian đọc ước lượng (phút)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  reading_time?: number;

  @ApiPropertyOptional({
    description: 'Danh sách tag cho bài viết',
    example: ['nestjs', 'typescript', 'backend'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
