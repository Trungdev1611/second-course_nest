import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class PaginateAndSearchDTO {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ example: 1, description: "current page" })
    page?: number = 1

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ example: 20, description: "số items trên một page" })
    per_page?: number = 20

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: "", description: "text cần search trong input name" })
    search?: string = ''

    
}