import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'avatars' }, // Optional: folder name in Cloudinary
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); // Return the image URL
              },
            );
      
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          });
    } catch (error) {
        throw new BadRequestException(error.message)
    }
    
  }
}
