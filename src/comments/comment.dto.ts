import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { PaginateAndSearchDTO } from "src/common/dto/paginate.dto";

export class CommentCreateDTO {
    @IsString()
    @ApiProperty({
        description: 'nội dung comment',
        example: 'it is so exciting',
      })
    content: string
}

