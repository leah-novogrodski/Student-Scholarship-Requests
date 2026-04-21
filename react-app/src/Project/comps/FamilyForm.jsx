import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
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
  }

export const FamilyForm = () => {
  const [FamilyDetailes, setFamilyDetailes] = useSessionStorage("FamilyForm", {
    fatherName: "",
    motherName: "",
    notes: "",
  });

  const [errors, setErrors] = React.useState({});

 
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "fatherName":
        if (!value.trim()) {
          error = "נא להזין את שם האב";
        } else if (value.trim().length < 2) {
          error = "שם האב חייב להכיל לפחות 2 תווים";
        }
        break;

      case "motherName":
        if (!value.trim()) {
          error = "נא להזין את שם האם";
        } else if (value.trim().length < 2) {
          error = "שם האם חייב להכיל לפחות 2 תווים";
        }
        break;

      case "notes":
        if (value.length > 300) {
          error = "הערות יכולות להכיל עד 300 תווים";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return !error;
  };


  const handleChange = (field) => (e) => {
    setFamilyDetailes((s) => ({ ...s, [field]: e.target.value }));
    setErrors((s) => ({ ...s, [field]: undefined }));
  };


  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      const currentValues = getSessionStorageValue("FamilyForm");
      dispatch(
        setCurrentRequest({
          key: "FamilyDetailes",
          value: currentValues,
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card sx={{ width: 400, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          פרטי המשפחה
        </Typography>

   
        <TextField
          label="שם האב"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={FamilyDetailes.fatherName}
          onChange={handleChange("fatherName")}
          onBlur={() =>
            validateField("fatherName", FamilyDetailes.fatherName)
          }
          error={!!errors.fatherName}
          helperText={errors.fatherName}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="שם האם"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={FamilyDetailes.motherName}
          onChange={handleChange("motherName")}
          onBlur={() =>
            validateField("motherName", FamilyDetailes.motherName)
          }
          error={!!errors.motherName}
          helperText={errors.motherName}
          InputProps={{ style: { textAlign: "right" } }}
        />

     
        <TextField
          label="הערות נוספות"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2, ...inputStyle }}
          value={FamilyDetailes.notes}
          onChange={handleChange("notes")}
          onBlur={() => validateField("notes", FamilyDetailes.notes)}
          error={!!errors.notes}
          helperText={errors.notes}
          InputProps={{ style: { textAlign: "right" } }}
        />
      </CardContent>
    </Card>
  );
};
