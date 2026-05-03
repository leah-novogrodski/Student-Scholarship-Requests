import Request from '../models/RequestSchema.js';
import User from '../models/user-model.js';
import jwt from 'jsonwebtoken';

const isObjectComplete = (obj) => {
  if (!obj) return false;
  // עובר על כל הערכים באובייקט ובודק שאין ערך ריק
  return Object.values(obj).every(value => 
    value !== undefined && 
    value !== null && 
    value.toString().trim() !== ""
  );
};
export const uploadSingleFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "לא הועלה קובץ" });
    }
    
    const file = req.files[0];
    const userId = req.user.id;
    
    // יצירת נתיב יחסי שיישמר בסטורג' ובמסד הנתונים
    const relativePath = `/uploads/${userId}/${file.filename}`;
    
    res.status(200).json({ 
      success: true, 
      path: relativePath, 
      fileName: file.originalname 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "שגיאה בהעלאת הקובץ", error: error.message });
  }
};
export const createRequest = async (req, res) => {
  try {
    // קבלת הנתונים כ-JSON נקי (אין יותר FormData בקשה זו)
    const { personalDetails, familyDetails, courseDetails, bankDetails, fileUploads, isVerified } = req.body;

    // חילוץ הנתיבים בלבד עבור מסד הנתונים (תואם ל-Schema שהגדרת)
    const formattedFileUploads = {};
    if (fileUploads) {
      Object.keys(fileUploads).forEach(key => {
        if (fileUploads[key] && fileUploads[key].path) {
          formattedFileUploads[key] = fileUploads[key].path;
        }
      });
    }

    if (isVerified === 'true' || isVerified === true) {
      const isDataMissing =
        !isObjectComplete(personalDetails) ||
        !isObjectComplete(familyDetails) ||
        !isObjectComplete(courseDetails) ||
        !isObjectComplete(bankDetails) ||
        Object.keys(formattedFileUploads).length === 0;

      if (isDataMissing) {
        return res.status(400).json({
          success: false,
          message: "לא ניתן להגיש את הבקשה. חסרים פרטים באחד או יותר מהשלבים.",
        });
      }
    }

    const userIdFromToken = req.user.id;
    const user = await User.findOne({ id: userIdFromToken });
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא במערכת" });
    }

 

    // עדכון או יצירה (Upsert)
    const updatedRequest = await Request.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        personalDetails,
        familyDetails,
        courseDetails,
        bankDetails,
        fileUploads: formattedFileUploads, // נשמרים רק הנתיבים
        isVerified,
        status: isVerified ? 'submitted' : 'draft',
        submissionDate: isVerified ? new Date() : null,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: isVerified ? "הבקשה הוגשה בהצלחה!" : "הטיוטה נשמרה בהצלחה!",
      data: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "שגיאה בתהליך השמירה", error: error.message });
  }
};
// הוספת הפונקציה לקובץ controllers/request.js

export const getMyRequest = async (req, res) => {
  try {
    const userIdFromToken = req.user.id; 
    
    const user = await User.findOne({ id: userIdFromToken }); 
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא במערכת" });
    }
console.log("User ID from token:", userIdFromToken); // הוספנו לוג כדי לבדוק את הערך של userIdFromToken

    
    const existingRequest = await Request.findOne({ userId: user._id });

    if (!existingRequest) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "לא קיימת בקשה קודמת"
      });
    }

    
    res.status(200).json({
      success: true,
      data: existingRequest
    });

  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({
      success: false,
      message: "שגיאה בשליפת הנתונים",
      error: error.message
    });
  }
};

export const getRequestByLoggedUser = async (req, res) => {
  try {
    const userIdFromToken = req.user.id;
    console.log("User ID from token in getRequestByLoggedUser:", req.user.id); // לוג נוסף לבדיקה
    const user = await User.findOne({ id: userIdFromToken }); 
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא במערכת" });
    }

    const request = await Request.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!request) {
      return res.status(404).json({ success: false, message: "לא נמצאה בקשה" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ success: false, message: "שגיאת שרת", error: error.message });
  }
};