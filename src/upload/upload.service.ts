import { Injectable, UploadedFiles } from '@nestjs/common';
import { Express } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadFile(
    @UploadedFiles() file: Express.Multer.File,
  ): Promise<string> {
    if (!file) throw new Error('File not found');

    const uploadResult = file as unknown as UploadApiResponse;
    return uploadResult.secure_url;
  }
}
