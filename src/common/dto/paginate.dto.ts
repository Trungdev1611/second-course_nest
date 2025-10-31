import { IsNumber, IsOptional, IsString } from "class-validator";

export class PaginateAndSearchDTO {
    @IsNumber()
    @IsOptional()
    page?: number = 1

    @IsNumber()
    @IsOptional()
    per_page?: number = 20

    @IsString()
    @IsOptional()
    search?: string = ''
}