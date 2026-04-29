import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Divider,
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

export const FamilyForm = () => {
  const [familyDetails, setFamilyDetails] = useSessionStorage("FamilyForm", {
    fatherId: "",
    fatherLastName: "",
    fatherFirstName: "",
    motherId: "",
    motherLastName: "",
    motherFirstName: "",
    siblingsBelowAge18: "",
    siblingsAboveAge21WithMultipleChildren: "",
  });

  const [errors, setErrors] = React.useState({});

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "fatherId":
        if (!value.trim()) {
          error = "נא להזין ת.ז של האב";
        } else if (!/^\d{5,9}$/.test(value.trim())) {
          error = "ת.ז חייבת להיות בין 5-9 ספרות";
        }
        break;

      case "fatherLastName":
        if (!value.trim()) {
          error = "נא להזין שם משפחה של האב";
        } else if (value.trim().length < 2) {
          error = "שם משפחה חייב להכיל לפחות 2 תווים";
        }
        break;

      case "fatherFirstName":
        if (!value.trim()) {
          error = "נא להזין שם פרטי של האב";
        } else if (value.trim().length < 2) {
          error = "שם פרטי חייב להכיל לפחות 2 תווים";
        }
        break;

      case "motherId":
        if (!value.trim()) {
          error = "נא להזין ת.ז של האם";
        } else if (!/^\d{5,9}$/.test(value.trim())) {
          error = "ת.ז חייבת להיות בין 5-9 ספרות";
        }
        break;

      case "motherLastName":
        if (!value.trim()) {
          error = "נא להזין שם משפחה של האם";
        } else if (value.trim().length < 2) {
          error = "שם משפחה חייב להכיל לפחות 2 תווים";
        }
        break;

      case "motherFirstName":
        if (!value.trim()) {
          error = "נא להזין שם פרטי של האם";
        } else if (value.trim().length < 2) {
          error = "שם פרטי חייב להכיל לפחות 2 תווים";
        }
        break;

      case "siblingsBelowAge18":
        if (value !== "" && !/^\d+$/.test(value)) {
          error = "חייב להיות מספר";
        }
        break;

      case "siblingsAboveAge21WithMultipleChildren":
        if (value !== "" && !/^\d+$/.test(value)) {
          error = "חייב להיות מספר";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return !error;
  };

  const handleChange = (field) => (e) => {
    setFamilyDetails((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      const currentValues = getSessionStorageValue("FamilyForm");
      dispatch(
        setCurrentRequest({
          key: "familyDetails",
          value: currentValues,
        })
      );
    };
  }, [dispatch]);

  return (
    <Card sx={{ width: "100%", maxWidth: 600, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
          פרטי המשפחה
        </Typography>

        {/* פרטי האב */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
          פרטי האב:
        </Typography>

        <TextField
          label="ת.ז של האב"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={familyDetails.fatherId}
          onChange={handleChange("fatherId")}
          onBlur={(e) => validateField("fatherId", e.target.value)}
          error={!!errors.fatherId}
          helperText={errors.fatherId}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="שם משפחה של האב"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={familyDetails.fatherLastName}
          onChange={handleChange("fatherLastName")}
          onBlur={(e) => validateField("fatherLastName", e.target.value)}
          error={!!errors.fatherLastName}
          helperText={errors.fatherLastName}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="שם פרטי של האב"
          fullWidth
          sx={{ mb: 3, ...inputStyle }}
          value={familyDetails.fatherFirstName}
          onChange={handleChange("fatherFirstName")}
          onBlur={(e) => validateField("fatherFirstName", e.target.value)}
          error={!!errors.fatherFirstName}
          helperText={errors.fatherFirstName}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <Divider sx={{ my: 2 }} />

        {/* פרטי האם */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
          פרטי האם:
        </Typography>

        <TextField
          label="ת.ז של האם"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={familyDetails.motherId}
          onChange={handleChange("motherId")}
          onBlur={(e) => validateField("motherId", e.target.value)}
          error={!!errors.motherId}
          helperText={errors.motherId}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="שם משפחה של האם"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={familyDetails.motherLastName}
          onChange={handleChange("motherLastName")}
          onBlur={(e) => validateField("motherLastName", e.target.value)}
          error={!!errors.motherLastName}
          helperText={errors.motherLastName}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="שם פרטי של האם"
          fullWidth
          sx={{ mb: 3, ...inputStyle }}
          value={familyDetails.motherFirstName}
          onChange={handleChange("motherFirstName")}
          onBlur={(e) => validateField("motherFirstName", e.target.value)}
          error={!!errors.motherFirstName}
          helperText={errors.motherFirstName}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <Divider sx={{ my: 2 }} />

        {/* פרטי אחים */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
          פרטי אחים:
        </Typography>

        <TextField
          label="מספר אחים מתחת לגיל 18"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={familyDetails.siblingsBelowAge18}
          onChange={handleChange("siblingsBelowAge18")}
          onBlur={(e) =>
            validateField("siblingsBelowAge18", e.target.value)
          }
          error={!!errors.siblingsBelowAge18}
          helperText={errors.siblingsBelowAge18}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="מספר אחים מעל לגיל 21 שיש להם יותר מילד אחד"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={familyDetails.siblingsAboveAge21WithMultipleChildren}
          onChange={handleChange("siblingsAboveAge21WithMultipleChildren")}
          onBlur={(e) =>
            validateField(
              "siblingsAboveAge21WithMultipleChildren",
              e.target.value
            )
          }
          error={!!errors.siblingsAboveAge21WithMultipleChildren}
          helperText={errors.siblingsAboveAge21WithMultipleChildren}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />
      </CardContent>
    </Card>
  );
};
