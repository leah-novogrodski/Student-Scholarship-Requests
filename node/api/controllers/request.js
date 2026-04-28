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

export const createRequest = async (req, res) => {
  try {
    const { personalDetails, familyDetails, courseDetails, bankDetails, isVerified } = req.body;
   if (isVerified) {
      const isDataMissing = 
        !isObjectComplete(personalDetails) ||
        !isObjectComplete(familyDetails) ||
        !isObjectComplete(courseDetails) ||
        !isObjectComplete(bankDetails);

      if (isDataMissing) {
        return res.status(400).json({
          success: false,
          message: "לא ניתן להגיש את הבקשה. חסרים פרטים באחד או יותר מהשלבים."
        });
      }
    }
    const userIdFromToken = req.user.id; 

    const user = await User.findOne({ id: userIdFromToken }); 
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא במערכת" });
    }

    // 2. עדכון או יצירה (Upsert)
    const updatedRequest = await Request.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        personalDetails,
        familyDetails,
        courseDetails,
        bankDetails,
        isVerified,
        status: isVerified ? 'submitted' : 'draft',
        submissionDate: isVerified ? new Date() : null
      },
      { 
        new: true,      
        upsert: true,  
        runValidators: true 
      }
    );

    res.status(200).json({
      success: true,
      message: isVerified ? "הבקשה הוגשה בהצלחה!" : "הטיוטה נשמרה בהצלחה!",
      data: updatedRequest
    });

  } catch (error) {
    console.error("Error saving request:", error);
    res.status(500).json({
      success: false,
      message: "שגיאה בתהליך השמירה",
      error: error.message
    });
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