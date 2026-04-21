import React, { useEffect } from "react";
import useSessionStorage from "../redux/useSessionStorage";
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setCurrentRequest } from "../redux/RequestSlice";

const BANK_OPTIONS = [
  { value: "hapoalim", label: "בנק הפועלים" },
  { value: "leumi", label: "בנק לאומי" },
  { value: "discount", label: "בנק דיסקונט" },
  { value: "mizrahi", label: "בנק מזרחי" },
];

export const BankForm = () => {

  const [BankDetailes, setBankDetailes] = useSessionStorage("BankForm", {
    ownerName: "",
    bank: "",
    branchNumber: "",
    accountNumber: "",
  });

  const [errors, setErrors] = React.useState({});

 
  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "ownerName":
        if (!String(value || "").trim()) {
          error = "נא להזין שם בעל חשבון";
        } else if (String(value).trim().length < 2) {
          error = "השם חייב להכיל לפחות 2 תווים";
        }
        break;

      case "bank":
        if (!value) error = "נא לבחור בנק";
        break;

      case "branchNumber":
        if (!/^\d{3,4}$/.test(String(value).trim())) {
          error = "מספר סניף חייב להכיל 3–4 ספרות";
        }
        break;

      case "accountNumber":
        if (!/^\d{5,10}$/.test(String(value).trim())) {
          error = "מספר חשבון חייב להיות בין 5–10 ספרות";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return !error;
  };
  

  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e;
    setBankDetailes((s) => ({ ...s, [field]: value }));
    setErrors((s) => ({ ...s, [field]: undefined }));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(
        setCurrentRequest({ key: "BankDetailes", value: BankDetailes })
      );
    };
  }, []);

  
  const outlineBlue = {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF7A00",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#FF7A00",
    },
  };

  return (
    <Card sx={{ width: 350, p: 2, direction: "rtl" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          פרטי חשבון בנק
        </Typography>

       
        <TextField
          label="שם בעל החשבון"
          fullWidth
          sx={{ mb: 2, ...outlineBlue }}
          value={BankDetailes.ownerName}
          onChange={handleChange("ownerName")}
          onBlur={() => validateField("ownerName", BankDetailes.ownerName)}
          error={!!errors.ownerName}
          helperText={errors.ownerName}
          InputProps={{ style: { textAlign: "right" } }}
        />

      
        <FormControl
          fullWidth
          sx={{ mb: 2, ...outlineBlue }}
          error={!!errors.bank}
        >
          <InputLabel>בחר בנק</InputLabel>
          <Select
            value={BankDetailes.bank}
            label="בחר בנק"
            onChange={handleChange("bank")}
            onBlur={() => validateField("bank", BankDetailes.bank)}
            sx={{ textAlign: "right" }}
          >
            {BANK_OPTIONS.map((b) => (
              <MenuItem key={b.value} value={b.value}>
                {b.label}
              </MenuItem>
            ))}
          </Select>

          {errors.bank && (
            <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
              {errors.bank}
            </Typography>
          )}
        </FormControl>

   
        <TextField
          label="מספר סניף"
          fullWidth
          sx={{ mb: 2, ...outlineBlue }}
          value={BankDetailes.branchNumber}
          onChange={handleChange("branchNumber")}
          onBlur={() =>
            validateField("branchNumber", BankDetailes.branchNumber)
          }
          error={!!errors.branchNumber}
          helperText={errors.branchNumber}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="מספר חשבון"
          fullWidth
          sx={{ mb: 2, ...outlineBlue }}
          value={BankDetailes.accountNumber}
          onChange={handleChange("accountNumber")}
          onBlur={() =>
            validateField("accountNumber", BankDetailes.accountNumber)
          }
          error={!!errors.accountNumber}
          helperText={errors.accountNumber}
          InputProps={{ style: { textAlign: "right" } }}
        />
      </CardContent>
    </Card>
  );
};
