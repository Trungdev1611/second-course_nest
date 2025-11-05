import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.service';
import { Uploadcontroller } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [],
  controllers: [Uploadcontroller],
  providers: [CloudinaryProvider, UploadService],
  exports: [CloudinaryProvider, UploadService]
})
export class CouldinaryModule {}