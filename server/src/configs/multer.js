import multer from 'multer';

// Temporary disk storage for processing uploaded image files before sending to Cloudinary
const storage = multer.diskStorage({});

export const upload = multer({ storage });