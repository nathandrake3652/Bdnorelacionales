import { extname } from 'path';
import { diskStorage } from 'multer';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads', // Carpeta donde se guardan los archivos
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
};