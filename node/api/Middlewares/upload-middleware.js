import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// יצירת תיקיית uploads אם היא לא קיימת
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// הגדרת storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // יצירת שם קובץ ייחודי
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// פילטר של סוגי קבצים
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPEG and PNG files are allowed'), false);
  }
};

// הגדרות multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter
});

// Middleware להעלאת קבצים רבים
export const uploadMultiple = upload.fields([
  { name: 'files_idCopy', maxCount: 1 },
  { name: 'files_studentAppendix', maxCount: 1 },
  { name: 'files_fatherAppendix', maxCount: 1 },
  { name: 'files_motherAppendix', maxCount: 1 },
  { name: 'files_studyApproval', maxCount: 1 },
  { name: 'files_bankAccountApproval', maxCount: 1 }
]);
