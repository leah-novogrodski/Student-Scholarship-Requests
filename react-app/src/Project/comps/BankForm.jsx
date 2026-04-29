import React, { useEffect } from "react";
import useSessionStorage, {
  getSessionStorageValue,
} from "../redux/useSessionStorage";
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
  { value: "hapoalim", label: "בנק הפועלים", code: "12" },
  { value: "leumi", label: "בנק לאומי", code: "10" },
  { value: "discount", label: "בנק דיסקונט", code: "11" },
  { value: "mizrahi", label: "בנק מזרחי תמורה", code: "13" },
  { value: "igud", label: "בנק אגוד", code: "14" },
  { value: "beyaachad", label: "בנק בי בחד", code: "15" },
];

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

export const BankForm = () => {
  const [bankDetails, setBankDetails] = useSessionStorage("BankForm", {
    accountOwnerId: "",
    bankName: "",
    bankNumber: "",
    branchNumber: "",
    accountNumber: "",
  });

  const [errors, setErrors] = React.useState({});

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "accountOwnerId":
        if (!String(value || "").trim()) {
          error = "נא להזין ת.ז של בעל החשבון";
        } else if (!/^\d{5,9}$/.test(String(value).trim())) {
          error = "ת.ז חייבת להיות בין 5-9 ספרות";
        }
        break;

      case "bankName":
        if (!value) error = "נא לבחור בנק";
        break;

      case "bankNumber":
        if (!String(value || "").trim()) {
          error = "נא להזין מספר בנק";
        } else if (!/^\d{2}$/.test(String(value).trim())) {
          error = "מספר בנק חייב להיות 2 ספרות";
        }
        break;

      case "branchNumber":
        if (!String(value || "").trim()) {
          error = "נא להזין מספר סניף";
        } else if (!/^\d{3,4}$/.test(String(value).trim())) {
          error = "מספר סניף חייב להכיל 3–4 ספרות";
        }
        break;

      case "accountNumber":
        if (!String(value || "").trim()) {
          error = "נא להזין מספר חשבון";
        } else if (!/^\d{5,10}$/.test(String(value).trim())) {
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
    setBankDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBankChange = (e) => {
    const bankValue = e.target.value;
    const selectedBank = BANK_OPTIONS.find((b) => b.value === bankValue);
    setBankDetails((prev) => ({
      ...prev,
      bankName: bankValue,
      bankNumber: selectedBank?.code || "",
    }));
    setErrors((prev) => ({ ...prev, bankName: undefined }));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      const currentValues = getSessionStorageValue("BankForm");
      dispatch(
        setCurrentRequest({ key: "bankDetails", value: currentValues })
      );
    };
  }, [dispatch]);

  return (
    <Card sx={{ width: "100%", maxWidth: 500, p: 2, direction: "rtl" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
          פרטי חשבון בנק
        </Typography>

        <TextField
          label="ת.ז של בעל החשבון"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={bankDetails.accountOwnerId}
          onChange={handleChange("accountOwnerId")}
          onBlur={() =>
            validateField("accountOwnerId", bankDetails.accountOwnerId)
          }
          error={!!errors.accountOwnerId}
          helperText={errors.accountOwnerId}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />

        <FormControl fullWidth sx={{ mb: 2, ...inputStyle }} error={!!errors.bankName}>
          <InputLabel>בחר בנק</InputLabel>
          <Select
            value={bankDetails.bankName}
            label="בחר בנק"
            onChange={handleBankChange}
            onBlur={() => validateField("bankName", bankDetails.bankName)}
            sx={{ textAlign: "right" }}
          >
            {BANK_OPTIONS.map((b) => (
              <MenuItem key={b.value} value={b.value}>
                {b.label}
              </MenuItem>
            ))}
          </Select>
          {errors.bankName && (
            <Typography sx={{ color: "red", fontSize: "0.75rem", mt: 0.5 }}>
              {errors.bankName}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="מספר בנק"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={bankDetails.bankNumber}
          disabled
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="מספר סניף"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={bankDetails.branchNumber}
          onChange={handleChange("branchNumber")}
          onBlur={() =>
            validateField("branchNumber", bankDetails.branchNumber)
          }
          error={!!errors.branchNumber}
          helperText={errors.branchNumber}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="מספר חשבון"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={bankDetails.accountNumber}
          onChange={handleChange("accountNumber")}
          onBlur={() =>
            validateField("accountNumber", bankDetails.accountNumber)
          }
          error={!!errors.accountNumber}
          helperText={errors.accountNumber}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />
      </CardContent>
    </Card>
  );
};
