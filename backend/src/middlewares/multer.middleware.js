import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AppError from '../utils/AppError.js';

// Use /tmp directory on production/Vercel, fallback to local uploads folder in development
const uploadDir = process.env.NODE_ENV === 'production' 
    ? os.tmpdir() 
    : path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage location and filename format
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Saves files into your root 'uploads/' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `event-${uniqueSuffix}${ext}`); // generate filename to avoid duplication
    }
});

// File filter (Reject non-image files)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed!', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;

// multer attaches information about file to the request - req.file

// req.file have 

/* req.file {
        fieldname: 'image',
        originalname: 'festival.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'event-1723456789-123456789.jpg',
        path: 'uploads/event-1723456789-123456789.jpg',
        size: 245678
    }
*/