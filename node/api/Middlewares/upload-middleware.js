import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// תיקיית האב של כל ההעלאות
const uploadsDirBase = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // משיכת מזהה המשתמש מהטוקן שיורט ב-auth middleware
    const userId = req.user?.id || 'unknown'; 
    const userDir = path.join(uploadsDirBase, String(userId));
    
    // יצירת תיקייה למשתמש אם לא קיימת
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    // שימוש בשם השדה באנגלית (כמו idCopy, studyApproval וכו')
    const fieldName = file.fieldname;
    const ext = path.extname(file.originalname);
    
    // שמירת הקובץ: שם השדה + חותמת זמן למניעת כפילויות + סיומת
    cb(null, `${fieldName}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPEG and PNG files are allowed'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // מגבלה של 10MB
  fileFilter: fileFilter
});

// מידלוואר לקבלת קובץ בודד עם שם שדה דינמי
export const uploadSingleFileMiddleware = upload.any();