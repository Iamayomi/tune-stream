import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'others';
    if (file.fieldname === 'audio') folder = 'music/audio';
    else if (file.fieldname === 'cover') folder = 'music/covers';
    else if (file.fieldname === 'profile') folder = 'users/profile';

    return {
      folder,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      resource_type: file.mimetype.startsWith('audio/') ? 'video' : 'image',
    };
  },
});

export { cloudinary };
