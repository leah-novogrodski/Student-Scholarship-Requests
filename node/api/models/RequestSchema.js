import mongoose from 'mongoose';

// סכמה משנית לפרטים אישיים (PersonalForm)
const PersonalDetailsSchema = new mongoose.Schema({
  name: { type: String },
  id: { type: String},
  birthDate: { type: Date},
  adress: { type: String}, // השארתי 'adress' עם שגיאת הכתיב כדי להתאים לקוד ה-Front שלך
  phoneNumber: { type: String}
}, { _id: false });

// סכמה משנית לפרטי משפחה (FamilyForm)
const FamilyDetailsSchema = new mongoose.Schema({
  fatherName: { type: String },
  motherName: { type: String },
  notes: { type: String, maxLength: 300 }
}, { _id: false });

// סכמה משנית לפרטי לימודים (CourseForm)
const CourseDetailsSchema = new mongoose.Schema({
  major: { type: String},
  tuition: { type: Number },
  years: { type: Number, min: 1, max: 10 }
}, { _id: false });

// סכמה משנית לפרטי בנק (BankForm)
const BankDetailsSchema = new mongoose.Schema({
  ownerName: { type: String },
  bank: { type: String},
  branchNumber: { type: String},
  accountNumber: { type: String }
}, { _id: false });

// --- הסכמה הראשית: Request ---
const RequestSchema = new mongoose.Schema({
  // קישור למשתמש שיצר את הבקשה (במידה ויש לך מודל User)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // השלבים השונים כתוספות (Sub-documents)
  personalDetails: PersonalDetailsSchema,
  familyDetails: FamilyDetailsSchema,
  courseDetails: CourseDetailsSchema,
  bankDetails: BankDetailsSchema,

  // שדות סטטוס ואימות
  isVerified: { 
    type: Boolean, 
    default: false,
    required: true // מתאים ל-Checkbox ב-Verify.jsx
  },
  
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },

  submissionDate: { 
    type: Date, 
    default: null 
  }
}, { 
  timestamps: true 
});


export default mongoose.model('Request', RequestSchema); 