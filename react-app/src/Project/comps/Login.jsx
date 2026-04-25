import {
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Card } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../redux/UserSlice";
import Swal from "sweetalert2";
import useSessionStorage from "../redux/useSessionStorage";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

export const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = useSessionStorage("currentUser", {
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const isUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: user.email,
          password: user.password,
        },
      );

      const { token, user: userData } = response.data;

      Cookies.set("token", token, {
        expires: 1,
        secure: false,
        sameSite: "Strict",
      });

      dispatch(setCurrentUser(userData));
      navigate("/Home");
    } catch (error) {
      Swal.fire({
        title: "שגיאה בהתחברות",
        text: error.response?.data?.message || "בדוק את פרטי הגישה שלך",
        icon: "error",
        confirmButtonColor: "#FF7A00",
      });
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "'Heebo', sans-serif",
        backgroundColor: "#F4F6FA",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        direction: "rtl",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: 360,
          p: 3,
          borderRadius: "18px",
          boxShadow: "0px 4px 14px rgba(0,0,0,0.12)",
          borderTop: "6px solid #FF7A00",
        }}
      >
        <CardContent>
          <TextField
            onKeyDown={(e) => {
              if (e.key === "Enter") isUser(e);
            }}
            label="אימייל"
            fullWidth
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            sx={{
              mb: 2,
              "& label.Mui-focused": { color: "#FF7A00" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#FF7A00",
              },
            }}
          />

          <FormControl
            onKeyDown={(e) => {
              if (e.key === "Enter") isUser(e);
            }}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              "& label.Mui-focused": { color: "#FF7A00" },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#FF7A00",
              },
            }}
          >
            <InputLabel htmlFor="password-input">סיסמא</InputLabel>

            <OutlinedInput
              id="password-input"
              type={showPassword ? "text" : "password"}
              onChange={(e) =>
                setUser((u) => ({ ...u, password: e.target.value }))
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="סיסמא"
            />
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={isUser}
            sx={{
              mt: 1,
              backgroundColor: "#0A1A44",
              borderRadius: "12px",
              fontWeight: 600,
              padding: "10px",
              "&:hover": {
                backgroundColor: "#FF7A00",
              },
            }}
          >
            היכנס
          </Button>

          <p style={{ textAlign: "center", marginTop: "10px" }}>
            אין לך חשבון?{" "}
            <Link
              to="/Register"
              style={{
                color: "#FF7A00",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              הירשם
            </Link>
          </p>
        </CardContent>
      </Card>
    </Box>
  );
};
