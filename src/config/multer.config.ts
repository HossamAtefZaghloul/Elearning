import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
};
