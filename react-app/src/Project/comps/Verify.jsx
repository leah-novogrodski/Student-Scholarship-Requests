import React from "react";
import useSessionStorage from "../redux/useSessionStorage";
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

export const Verify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentRequest = useSelector((state) => state.request);

  const [checked, setChecked] = useSessionStorage("Verify", false);
  const handleSubmit = () => {
    const allStepsCompleted = Object.values(isComplete).every(
      (val) => val === true
    );

    if (allStepsCompleted) {
      const requestWithDate = {
        ...currentRequest.currentRequest,
        date: new Date().toLocaleDateString("he-IL"),
      };
      sessionStorage.removeItem("BankForm");
      sessionStorage.removeItem("CourseForm");
      sessionStorage.removeItem("FamilyForm");
      sessionStorage.removeItem("PersonalForm");
      sessionStorage.removeItem("sendRequest_completed");
      sessionStorage.removeItem("sendRequest_activeStep");
      sessionStorage.removeItem("Verify");

  

      dispatch(addRequest(requestWithDate));
      navigate("/Apply");
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
  const data = useSelector((state) => state.request.currentRequest);
  console.log("data in Verify:", data);
  const [isComplete, setIscomplete] = useSessionStorage(
    "sendRequest_completed",
    {}
  );

  console.log("isComplete in Verify:", isComplete);

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
