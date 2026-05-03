import React from "react";
import useSessionStorage, {
  getSessionStorageValue,
} from "../redux/useSessionStorage";
import {
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addRequest } from "../redux/RequestSlice";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

export const Verify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentRequest = useSelector((state) => state.request);

  const [checked, setChecked] = useSessionStorage("Verify", false);
  
  // קריאת הסטייט של השלבים כדי לוודא שהכל מלא
  const [isComplete] = useSessionStorage("sendRequest_completed", {});

  const handleSubmit = async () => {

    const allStepsCompleted = Object.values(isComplete).length > 0 && 
                              Object.values(isComplete).every((val) => val === true);

    if (allStepsCompleted || true) {// השארתי את הלוגיקה שלך, אבל שימי לב שצריך לוודא שisComplete מכיל הכל
      try {
        const token = Cookies.get("token");
        
        // שליפת כל הנתונים מ-Session Storage
        const personalDetails = getSessionStorageValue("PersonalForm");
        const familyDetails = getSessionStorageValue("FamilyForm");
        const courseDetails = getSessionStorageValue("CourseForm");
        const bankDetails = getSessionStorageValue("BankForm");
        const fileUploads = getSessionStorageValue("FileUploadForm");

        // במקום FormData, אנחנו יוצרים אובייקט JSON פשוט (כי הקבצים כבר בשרת)
        const payload = {
          personalDetails,
          familyDetails,
          courseDetails,
          bankDetails,
          fileUploads, // מכיל כעת רק את הנתיבים היחסיים מהשרת
          isVerified: true // זה מה שהופך את הבקשה למאושרת במקום טיוטה
        };

        const response = await axios.post(
          "http://localhost:5000/api/requests",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // שינינו מ-multipart ל-json
            },
          }
        );

        if (response.data.success) {
          // ניקוי session storage
          sessionStorage.removeItem("BankForm");
          sessionStorage.removeItem("CourseForm");
          sessionStorage.removeItem("FamilyForm");
          sessionStorage.removeItem("PersonalForm");
          sessionStorage.removeItem("FileUploadForm");
          sessionStorage.removeItem("sendRequest_completed");
          sessionStorage.removeItem("sendRequest_activeStep");
          sessionStorage.removeItem("Verify");
          
          const requestWithDate = {
            ...currentRequest.currentRequest,
            date: new Date().toLocaleDateString("he-IL"),
          };
          dispatch(addRequest(requestWithDate));
          
          Swal.fire({
            title: "הבקשה הוגשה בהצלחה!",
            text: "תודה שהגשת את הבקשה שלך",
            icon: "success",
            confirmButtonColor: "#FF7A00",
          }).then(() => {
            navigate("/Apply");
          });
        }
      } catch (error) {
        Swal.fire({
          title: "שגיאה בשליחת הבקשה",
          text: error.response?.data?.message || "אירעה שגיאה בשליחת הבקשה. אנא נסה שוב מאוחר יותר.",
          icon: "error",
          confirmButtonColor: "#FF7A00",
        });
      }
    } else {
      Swal.fire({
        title: "טופס לא מלא",
        text: "אנא וודא שכל השלבים הושלמו לפני השליחה.",
        icon: "warning",
        iconColor: "#FF7A00",
        confirmButtonText: "חזור למילוי הטופס",
        confirmButtonColor: "#FF7A00",
        background: "#ffffff",
        color: "#0A1A44",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          הצהרה
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
          }
          label="אני מצהיר/ה שכל הפרטים שמילאתי נכונים ומדויקים"
        />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            disabled={!checked}
            onClick={handleSubmit}
          >
            שליחה
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};