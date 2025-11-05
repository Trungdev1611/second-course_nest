import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UseGuards,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwtAuthGuard';
  @ApiTags('Upload')
  @Controller('upload')
  export class Uploadcontroller {
    constructor(private readonly uploadService: UploadService) {}
  
    @Post('avatar')
    @ApiOperation({ summary: 'Upload user avatar - use formdata in body' })
    @ApiResponse({
        status: 200,
        schema: {
          example: { message: 'Upload successful', imageUrl: "string" },
        }})

        @ApiBody({
            schema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  format: 'binary', // <-- this shows "Choose File" button
                },
              },
            },
          })
        
    @ApiConsumes('multipart/form-data') //accept -formdata
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
      const imageUrl = await this.uploadService.uploadImage(file);
      return { message: 'Upload successful', imageUrl };
    }
  }
  