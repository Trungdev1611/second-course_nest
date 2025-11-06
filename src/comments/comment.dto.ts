import { IsString } from "class-validator";

export class CommentCreateDTO {
    @IsString()
    content: string
}