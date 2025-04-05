import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: async (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get<string>(CLOUDINARY_CLOUD_NAME),
      api_key: configService.get<string>(CLOUDINARY_API_KEY),
      api_secret: configService.get<string>(CLOUDINARY_API_SECRET),
      timeout: 60000,
    });
    return cloudinary;
  },
  inject: [ConfigService],
};
