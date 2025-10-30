import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginDTO {

    @ApiProperty({ example: 'user@example.com', description: 'Email của người dùng' })
    @IsEmail()
    email: string

    @ApiProperty({ example: '123456', description: 'Mật khẩu của người dùng' })
    @IsString()
    @IsNotEmpty()
    password: string
}
