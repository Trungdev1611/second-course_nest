import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class IdParamDto {
  @ApiProperty({ example: 1, description: "id của item muốn lấy thông tin" })
  @Type(() => Number)   // 👈 Auto transform string -> number
  @IsNumber()
  id: number;
}
