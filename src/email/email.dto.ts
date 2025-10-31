import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class MailToReceiveTokenDTO {
    @IsEmail()
    @ApiProperty({ example: 'user@example.com', description: 'Email đã đăng kí muốn verify'})
    email: string
}