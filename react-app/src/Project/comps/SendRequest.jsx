import * as React from "react";
import useSessionStorage, {
  getSessionStorageValue,
} from "../redux/useSessionStorage";
import {
  Box,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

const steps = ["פרטים אישיים", "פרטי משפחה", "השכלה", "פרטי בנק", "העלאת קבצים", "אימות"];
const components = [
  "PersonalForm",
  "FamilyForm",
  "CourseForm",
  "BankForm",
  "FileUploadForm",
  "Verify",
];
const REQUIRED_FIELDS = {
  PersonalForm:[ "birthDate", "city", "address", "mobilePhone", "homePhone"],
  FamilyForm:["fatherId","fatherLastName","fatherFirstName","motherId","motherLastName","motherFirstName","siblingsBelowAge18","siblingsAboveAge21WithMultipleChildren"],
  CourseForm:["major","instituteName","yearsOfStudy","annualTuition"],
  BankForm:["accountOwnerId","bankName","branchNumber","accountNumber"],
  FileUploadForm:["idCopy","studentAppendix","fatherAppendix","motherAppendix","studyApproval","bankAccountApproval"],
  "Verify":[],
}
export const SendRequest = () => {
  const [activeStep, setActiveStep] = useSessionStorage(
    "sendRequest_activeStep",
    0,
  );
  const [completed, setCompleted] = useSessionStorage(
    "sendRequest_completed",
    {},
  );

  const navigate = useNavigate();

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();
const updateCompleted = () => {
  const componentName = components[activeStep];
  const form = getSessionStorageValue(componentName);
  const requiredFields = REQUIRED_FIELDS[componentName] || [];

  if (!form) {
    setCompleted({ ...completed, [activeStep]: false });
    return;
  }

  // בדיקה האם כל השדה שנדרש קיים ומלא
  const allFilled = requiredFields.every((key) => {
    const value = form[key];
    return (
      value !== "" &&
      value !== null &&
      value !== undefined &&
      !(Array.isArray(value) && value.length === 0)
    );
  });

  setCompleted((prev) => ({ ...prev, [activeStep]: allFilled }));
};

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;

    setActiveStep(newActiveStep);
    navigate(`/SendRequest/${components[newActiveStep]}`);
    updateCompleted();
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const prev = activeStep - 1;
      setActiveStep(prev);
      navigate(`/SendRequest/${components[prev]}`);
      updateCompleted();
    }
  };

  const handleStep = (stepIndex) => () => {
    setActiveStep(stepIndex);
    navigate(`/SendRequest/${components[stepIndex]}`);
    updateCompleted();
  };

  const handleComplete = () => {
    setCompleted({ ...completed, [activeStep]: true });
    updateCompleted();

    const next = activeStep + 1 < totalSteps() ? activeStep + 1 : activeStep;

    setActiveStep(next);
    navigate(`/SendRequest/${components[next]}`);
  };
  const saveDraft = async () => {
    try {
      const personalDetails = getSessionStorageValue("PersonalForm");
      const familyDetails = getSessionStorageValue("FamilyForm");
      const courseDetails = getSessionStorageValue("CourseForm");
      const bankDetails = getSessionStorageValue("BankForm");
      const fileUploads = getSessionStorageValue("FileUploadForm");
      const token = Cookies.get("token");

      // יצירת FormData לשליחת קבצים
      const formData = new FormData();
      formData.append("personalDetails", JSON.stringify(personalDetails));
      formData.append("familyDetails", JSON.stringify(familyDetails));
      formData.append("courseDetails", JSON.stringify(courseDetails));
      formData.append("bankDetails", JSON.stringify(bankDetails));
      formData.append("isVerified", false);

      // הוספת קבצים ל-FormData
      Object.keys(fileUploads || {}).forEach((key) => {
        if (fileUploads[key] && fileUploads[key].fileData) {
          // שליחת הנתונים כ-Base64 או כ-Blob
          formData.append(`files_${key}`, fileUploads[key].fileData);
          formData.append(`fileNames_${key}`, fileUploads[key].fileName);
        }
      });

      const response = await axios.post("http://localhost:5000/api/requests/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire({
          title: "טיוטה נשמרה בהצלחה",
          icon: "success",
          confirmButtonColor: "#FF7A00",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "שגיאה בשמירת הטיוטה",
        text: error.response?.data?.message || "קרתה שגיאה בשמירת הטיוטה",
        icon: "error",
      });
    }
  };

  React.useEffect(() => {}, [completed, navigate]);

  return (
    <Box
      sx={{
        width: "75%",
        margin: "auto",
        mt: 4,
        mb: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#1f2d5c",
          mb: 4,
        }}
      >
        שליחת בקשה
      </Typography>

      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #d7ddf0",
          background: "#ffffff",
        }}
      >
        <Box
          sx={{
            background: "#f7f8ff",
            borderBottom: "1px solid #e3e6f3",
            p: 3,
          }}
        >
          <Stepper
            nonLinear
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepLabel-label": {
                fontWeight: 500,
                color: "#2e3b78",
              },
              "& .MuiStepLabel-label.Mui-active": {
                color: "#1f2d5c",
                fontWeight: 700,
              },
              "& .MuiStepLabel-label.Mui-completed": {
                color: "#e0672b",
                fontWeight: 700,
              },
              "& .MuiStepIcon-root": {
                color: "#b9c4e5",
              },
              "& .MuiStepIcon-root.Mui-active": {
                color: "#1f2d5c",
              },
              "& .MuiStepIcon-root.Mui-completed": {
                color: "#e0672b",
              },
              dir: "rtl",
            }}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton onClick={handleStep(index)}>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box
          sx={{
            p: 4,
            background: "#ffffff",
          }}
        >
          <Outlet />

          <Box sx={{ display: "flex", flexDirection: "row", pt: 3 }}>
            <Button
              variant="outlined"
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                mr: 1,
                borderRadius: 2,
                borderColor: "#b5c0e6",
                color: "#1f2d5c",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#1f2d5c",
                },
              }}
            >
              חזרה
            </Button>

            <Box sx={{ flex: "1 1 auto" }} />
              <Button
          variant="text"
          sx={{ color: "#1f2d5c", fontWeight: 600, mx: 2 }}
          onClick={saveDraft}
        >
          שמור כטיוטה
        </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 700,
                background: "#1f2d5c",
                "&:hover": {
                  background: "#162349",
                },
              }}
            >
              הבא
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
