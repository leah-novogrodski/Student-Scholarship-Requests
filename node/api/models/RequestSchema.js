import mongoose from 'mongoose';

// סכמה משנית לפרטים אישיים (PersonalForm)
const PersonalDetailsSchema = new mongoose.Schema({
  id: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  birthDate: { type: Date },
  city: { type: String },
  address: { type: String },
  mobilePhone: { type: String },
  homePhone: { type: String }
}, { _id: false });

// סכמה משנית לפרטי משפחה (FamilyForm)
const FamilyDetailsSchema = new mongoose.Schema({
  fatherId: { type: String },
  fatherLastName: { type: String },
  fatherFirstName: { type: String },
  motherId: { type: String },
  motherLastName: { type: String },
  motherFirstName: { type: String },
  siblingsBelowAge18: { type: Number },
  siblingsAboveAge21WithMultipleChildren: { type: Number }
}, { _id: false });

// סכמה משנית לפרטי לימודים (CourseForm)
const CourseDetailsSchema = new mongoose.Schema({
  major: { type: String },
  instituteName: { type: String },
  yearsOfStudy: { type: Number, min: 1, max: 10 },
  annualTuition: { type: Number }
}, { _id: false });

// סכמה משנית לפרטי בנק (BankForm)
const BankDetailsSchema = new mongoose.Schema({
  accountOwnerId: { type: String },
  bankName: { type: String },
  bankNumber: { type: String },
  branchNumber: { type: String },
  accountNumber: { type: String }
}, { _id: false });

// סכמה משנית לקבצים שהועלו (FileUploadForm)
const FileUploadsSchema = new mongoose.Schema({
  idCopy: { type: String }, // נתיב לקובץ
  studentAppendix: { type: String },
  fatherAppendix: { type: String },
  motherAppendix: { type: String },
  studyApproval: { type: String },
  bankAccountApproval: { type: String }
}, { _id: false });

// --- הסכמה הראשית: Request ---
const RequestSchema = new mongoose.Schema({
  // קישור למשתמש שיצר את הבקשה
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
  fileUploads: FileUploadsSchema,

  // שדות סטטוס ואימות
  isVerified: { 
    type: Boolean, 
    default: false
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