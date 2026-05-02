import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setCurrentRequest } from "../redux/RequestSlice";
import useSessionStorage, {
  getSessionStorageValue,
} from "../redux/useSessionStorage";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

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

const disabledStyle = {
  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ccc",
    borderWidth: 1,
  },
};

export const PersonalForm = () => {
  const token = Cookies.get("token");
  const CurrentUser = token ? jwtDecode(token) : null;

  const [personalDetails, setPersonalDetails] = useSessionStorage(
    "PersonalForm",
    {
      id: CurrentUser?.id || "",
      firstName: CurrentUser?.firstName || "",
      lastName: CurrentUser?.lastName || "",
      birthDate: "",
      city: "",
      address: "",
      mobilePhone: "",
      homePhone: "",
    }

  );

  const [errors, setErrors] = React.useState({});

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "birthDate":
        if (!value) error = "נא להזין תאריך לידה";
        break;

      case "city":
        if (!value.trim()) {
          error = "נא להזין עיר מגורים";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "נא להזין כתובת";
        } else if (value.trim().length < 4) {
          error = "כתובת חייבת להכיל לפחות 4 תווים";
        }
        break;

      case "mobilePhone":
        if (!value) {
          error = "נא להזין טלפון נייד";
        } else if (!/^05\d{8}$/.test(value)) {
          error = "מספר טלפון אינו תקין (050-0599999)";
        }
        break;

      case "homePhone":
        if (value && !/^\d{8,10}$/.test(value)) {
          error = "טלפון נייח אינו תקין";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return !error;
  };

  const handleChange = (field) => (e) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      const currentValues = getSessionStorageValue("PersonalForm");
      dispatch(
        setCurrentRequest({
          key: "personalDetails",
          value: currentValues,
        })
      );
    };
  }, [dispatch]);

  return (
    <Card sx={{ width: "100%", maxWidth: 500, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, textAlign: "center" }}>
          פרטים אישיים
        </Typography>

        <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
            פרטים מהמערכת (אינם ניתנים לשינוי):
          </Typography>

          <TextField
            label="תעודת זהות"
            fullWidth
            value={CurrentUser?.id}
            disabled
            sx={{ mb: 2, ...inputStyle, ...disabledStyle }}
            InputProps={{ style: { textAlign: "right" } }}
          />

          <TextField
            label="שם פרטי"
            fullWidth
            value={CurrentUser?.firstName}
            disabled
            sx={{ mb: 2, ...inputStyle, ...disabledStyle }}
            InputProps={{ style: { textAlign: "right" } }}
          />

          <TextField
            label="שם משפחה"
            fullWidth
            value={CurrentUser?.lastName}
            disabled
            sx={{ mb: 2, ...inputStyle, ...disabledStyle }}
            InputProps={{ style: { textAlign: "right" } }}
          />
        </Box>

        {/* שדות ניתנים לשינוי */}
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          פרטים נוספים:
        </Typography>

        <TextField
          label="תאריך לידה"
          type="date"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={personalDetails.birthDate}
          onChange={handleChange("birthDate")}
          onBlur={(e) => validateField("birthDate", e.target.value)}
          error={!!errors.birthDate}
          helperText={errors.birthDate}
          InputLabelProps={{ shrink: true }}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="עיר מגורים"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={personalDetails.city}
          onChange={handleChange("city")}
          onBlur={(e) => validateField("city", e.target.value)}
          error={!!errors.city}
          helperText={errors.city}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="כתובת"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={personalDetails.address}
          onChange={handleChange("address")}
          onBlur={(e) => validateField("address", e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="טלפון נייד"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={personalDetails.mobilePhone}
          onChange={handleChange("mobilePhone")}
          onBlur={(e) => validateField("mobilePhone", e.target.value)}
          error={!!errors.mobilePhone}
          helperText={errors.mobilePhone}
          inputMode="numeric"
          placeholder="05X-XXXXXXX"
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="טלפון נייח (אופציונאלי)"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          value={personalDetails.homePhone}
          onChange={handleChange("homePhone")}
          onBlur={(e) => validateField("homePhone", e.target.value)}
          error={!!errors.homePhone}
          helperText={errors.homePhone}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />
      </CardContent>
    </Card>
  );
};
