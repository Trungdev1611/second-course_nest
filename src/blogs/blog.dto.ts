import { IsString, IsOptional, IsEnum, IsInt, IsArray, Min, IsNumber } from 'class-validator';

export class CreateBlogDTO {
  @IsString()
  title: string; // tiêu đề bài viết

  @IsString()
  content: string; // nội dung bài viết

  @IsOptional()
  @IsString()
  excerpt?: string; // mô tả ngắn

  @IsOptional()
  @IsString()
  thumbnail?: string; // ảnh đại diện

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived'; // trạng thái bài viết

  @IsOptional()
  @IsInt()
  @Min(0)
  views?: number = 0; // lượt xem (mặc định 0)

  @IsOptional()
  @IsInt()
  @Min(0)
  likes?: number = 0; // lượt thích (mặc định 0)

  @IsOptional()
  @IsNumber()
  reading_time?: number; // thời gian đọc ước lượng (phút)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]; // danh sách tag (mảng string)
}