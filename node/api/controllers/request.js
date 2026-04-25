import Request from '../models/RequestSchema.js';
import User from '../models/user-model.js';

export const createRequest = async (req, res) => {
  try {
    const { personalDetails, familyDetails, courseDetails, bankDetails, isVerified } = req.body;
    const userIdFromToken = req.user.id; 

    const user = await User.findOne({ id: userIdFromToken }); 
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא במערכת" });
    }

    // 2. עדכון או יצירה (Upsert)
    const updatedRequest = await Request.findOneAndUpdate(
      { userId: user._id }, // הקריטריון לחיפוש: בקשה השייכת למשתמש הזה
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
        new: true,      // מחזיר את המסמך המעודכן
        upsert: true,   // אם לא נמצאה בקשה - יוצר אחת חדשה
        runValidators: true // מוודא שהנתונים עומדים בכללי הסכמה
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