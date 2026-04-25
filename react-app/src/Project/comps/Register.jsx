import React, { useState } from "react";
import {
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Card,
  Box,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/UserSlice"; // הורדתי את addUser כי השרת מטפל בזה
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import useSessionStorage from "../redux/useSessionStorage";

axios.defaults.withCredentials = true;

const getIsraeliIdError = (id) => {
  if (!id) return "יש להזין תעודת זהות";
  if (!/^\d+$/.test(id)) return "תעודת זהות יכולה להכיל ספרות בלבד";
  if (id.length < 9) return "תעודת זהות חייבת להכיל 9 ספרות";

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let num = Number(id[i]) * ((i % 2) + 1);
    if (num > 9) num -= 9;
    sum += num;
  }
  if (sum % 10 !== 0) return "תעודת זהות אינה תקינה";
  return "";
};

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useSessionStorage("currentUser", {
    name: "",
    id: "",
    password: "",
    email: "",
  });
  const [idError, setIdError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const saveUser = async () => {
    const errorMsg = getIsraeliIdError(user.id);
    if (errorMsg) {
      setIdError(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName: user.name,
          email: user.email,
          password: user.password,
          id: user.id,
        },
      );
      const { token, user: userData } = response.data;
      Cookies.set("token", token, {
        expires: 1,
        secure: false,
        sameSite: "Strict",
      });
      dispatch(setCurrentUser(response.data.user));
      console.log("User registered:", response.data.user);
      navigate("/Home");

      Swal.fire({
        title: "נרשמת בהצלחה!",
        text: "החשבון שלך נוצר והכל מוכן.",
        icon: "success",
        confirmButtonText: "המשך",
        confirmButtonColor: "#FF7A00",
      }).then(() => navigate("/Home"));
    } catch (error) {
      const message = error.response?.data?.message || "קרתה שגיאה ברישום";

      Swal.fire({
        title: "אופס...",
        text: message,
        icon: "error",
        confirmButtonText: "נסה שוב",
        confirmButtonColor: "#FF7A00",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        direction: "rtl",
      }}
    >
      <Card
        onKeyDown={(e) => e.key === "Enter" && saveUser()}
        sx={{
          width: 350,
          p: 2,
          borderRadius: "16px",
          borderTop: "5px solid #FF7A00",
          boxShadow: "0px 4px 14px rgba(0,0,0,0.12)",
        }}
      >
        <CardContent>
          <TextField
            label="שם מלא"
            fullWidth
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            label="תעודת זהות"
            fullWidth
            value={user.id}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setUser({ ...user, id: val });
              if (val.length === 9) setIdError(getIsraeliIdError(val));
            }}
            error={Boolean(idError)}
            helperText={idError}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>אימייל</InputLabel>
            <OutlinedInput
              type="text"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              label="אימייל"
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>סיסמה</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="סיסמה"
            />
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={saveUser}
            sx={{
              backgroundColor: "#0A1A44",
              borderRadius: "12px",
              p: "10px",
              "&:hover": { backgroundColor: "#FF7A00" },
            }}
          >
            {loading ? "נרשם..." : "הירשם"}
          </Button>

          <p style={{ textAlign: "center", marginTop: "10px" }}>
            כבר יש לך חשבון?{" "}
            <Link to="/Login" style={{ color: "#FF7A00", fontWeight: 700 }}>
              היכנס
            </Link>
          </p>
        </CardContent>
      </Card>
    </Box>
  );
};
