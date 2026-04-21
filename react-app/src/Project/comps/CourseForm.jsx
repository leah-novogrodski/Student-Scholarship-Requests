import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import useSessionStorage, {
  getSessionStorageValue,
} from "../redux/useSessionStorage";
import { useDispatch } from "react-redux";
import { setCurrentRequest } from "../redux/RequestSlice";


const inputStyle = {
 "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF7A00",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#FF7A00",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff9800",
      borderWidth: 2,
    },
    
    "&.Mui-error fieldset": {
      borderColor: "#d32f2f", 
    },
  };



const MAJORS = [
  "מדעי המחשב",
  "חשבונאות",
  "פסיכולוגיה",
  "חינוך",
  "ניהול",
  "אדריכלות",
  "הנדסת תוכנה",
  "משפטים",
  "תרפיה",
  "מגמה אחרת",
];

export const CourseForm = ({ onSubmit, onCancel }) => {
  const [values, setValues] = useSessionStorage("CourseForm", {
    major: "",
    tuition: "",
    years: "",
  });

  const [errors, setErrors] = React.useState({});


  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "major":
        if (!value) error = "נא לבחור מגמה";
        break;

      case "tuition":
        if (!value) {
          error = "נא להזין שכר לימוד";
        } else if (!/^\d+$/.test(value)) {
          error = "שכר לימוד חייב להכיל ספרות בלבד";
        } else if (Number(value) < 1000) {
          error = "שכר לימוד נראה נמוך מדי";
        }
        break;

      case "years":
        if (!value) {
          error = "נא להזין שנות לימוד";
        } else if (!/^\d+$/.test(value)) {
          error = "שנות לימוד חייבות להיות מספר";
        } else if (Number(value) < 1 || Number(value) > 10) {
          error = "שנות לימוד חייבות להיות בין 1 ל־10";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return !error;
  };


  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      const currentValues = getSessionStorageValue("CourseForm");
      dispatch(
        setCurrentRequest({
          key: "courseDetailes",
          value: currentValues,
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Card sx={{ width: 350, p: 2, direction: "rtl" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          פרטי לימודים
        </Typography>

     
        <TextField
          select
          label="מגמה"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={values.major}
          onChange={handleChange("major")}
          onBlur={() => validateField("major", values.major)}
          error={!!errors.major}
          helperText={errors.major}
          InputProps={{ style: { textAlign: "right" } }}
        >
          {MAJORS.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>

      
        <TextField
          label="שכר לימוד שנתי (₪)"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={values.tuition}
          onChange={handleChange("tuition")}
          onBlur={() => validateField("tuition", values.tuition)}
          error={!!errors.tuition}
          helperText={errors.tuition}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />

     
        <TextField
          label="שנות לימוד"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={values.years}
          onChange={handleChange("years")}
          onBlur={() => validateField("years", values.years)}
          error={!!errors.years}
          helperText={errors.years}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />
      </CardContent>
    </Card>
  );
};
