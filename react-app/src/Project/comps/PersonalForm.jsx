import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
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
  }

export const PersonalForm = () => {
  const token = Cookies.get("token"); 
const CurrentUser = token ? jwtDecode(token) : null;
console.log("Decoded User from Token:", CurrentUser);

  const [personalDetails, setPersonalDetails] = useSessionStorage(
    "PersonalForm",
    {
      name: CurrentUser.name,
      id: CurrentUser.id,
      birthDate: "",
      adress: "",
      phoneNumber: "",
    }
  );

  const [errors, setErrors] = React.useState({});


  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "birthDate":
        if (!value) error = "נא להזין תאריך לידה";
        break;

      case "adress":
        if (!value.trim()) {
          error = "נא להזין כתובת";
        } else if (value.trim().length < 4) {
          error = "כתובת חייבת להכיל לפחות 4 תווים";
        }
        break;

      case "phoneNumber":
        if (!value) {
          error = "נא להזין מספר טלפון";
        } else if (!/^05\d{8}$/.test(value)) {
          error = "מספר טלפון אינו תקין";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    return !error;
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
    <Card sx={{ width: 350, p: 2 }}>
      <CardContent>
      
        <TextField
          label="שם"
          fullWidth
          value={CurrentUser.name}
          disabled
          sx={{ mb: 2, ...inputStyle }}
          InputProps={{ style: { textAlign: "right" } }}
        />

   
        <TextField
          label="תעודת זהות"
          fullWidth
          value={CurrentUser.id}
          disabled
          sx={{ mb: 2, ...inputStyle }}
          InputProps={{ style: { textAlign: "right" } }}
        />

    
        <TextField
          label="תאריך לידה"
          type="date"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          defaultValue={personalDetails.birthDate}
          onBlur={(e) => {
            setPersonalDetails((p) => ({
              ...p,
              birthDate: e.target.value,
            }));
            validateField("birthDate", e.target.value);
          }}
          error={!!errors.birthDate}
          helperText={errors.birthDate}
          InputLabelProps={{ shrink: true }}
          InputProps={{ style: { textAlign: "right" } }}
        />

      
        <TextField
          label="כתובת"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          defaultValue={personalDetails.adress}
          onBlur={(e) => {
            setPersonalDetails((p) => ({
              ...p,
              adress: e.target.value,
            }));
            validateField("adress", e.target.value);
          }}
          error={!!errors.adress}
          helperText={errors.adress}
          InputProps={{ style: { textAlign: "right" } }}
        />

        <TextField
          label="טלפון"
          fullWidth
          sx={{ mb: 2, ...inputStyle }}
          defaultValue={personalDetails.phoneNumber}
          onBlur={(e) => {
            setPersonalDetails((p) => ({
              ...p,
              phoneNumber: e.target.value,
            }));
            validateField("phoneNumber", e.target.value);
          }}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          inputMode="numeric"
          InputProps={{ style: { textAlign: "right" } }}
        />
      </CardContent>
    </Card>
  );
};
