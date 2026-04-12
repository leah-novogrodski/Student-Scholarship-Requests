import * as React from "react";
import useSessionStorage, { getSessionStorageValue } from "../redux/useSessionStorage";
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

const steps = ["פרטים אישיים", "פרטי משפחה", "השכלה", "פרטי בנק", "אימות"];
const components = [
  "PersonalForm",
  "FamilyForm",
  "CourseForm",
  "BankForm",
  "Verify",
];

export const SendRequest = () => {
  const [activeStep, setActiveStep] = useSessionStorage(
    "sendRequest_activeStep",
    0
  );
  const [completed, setCompleted] = useSessionStorage(
    "sendRequest_completed",
    {}
  );

  const navigate = useNavigate();

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const updateCompleted = () => {
    const form = getSessionStorageValue(components[activeStep]);
    if (form !== undefined && form !== null) {
      let allFilled = true;
      for (const key in form) {
        if (
          form[key] === "" ||
          form[key] === null ||
          form[key] === undefined ||
          (Array.isArray(form[key]) && form[key].length === 0)
        ) {
          allFilled = false;
        }
      }
      if (allFilled) {
        setCompleted({ ...completed, [activeStep]: true });
      } else {
        setCompleted({ ...completed, [activeStep]: false });
      }
    }
  };

  // -------- Navigation --------
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

  React.useEffect(() => {
   
  }, [completed, navigate]);

  return (
     <Box
    sx={{
      width: "75%",
      margin: "auto",
      mt: 4,
      mb: 6,
    }}
  >
    {/* כותרת */}
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

    {/* עטיפה מאוחדת של הכל */}
    <Paper
      elevation={4}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #d7ddf0",
        background: "#ffffff",
      }}
    >
      {/* -------- STEPPER -------- */}
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
              <StepButton onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* -------- CONTENT -------- */}
      <Box 
        sx={{
          
          p: 4,
          background: "#ffffff",
        }}
      >
        <Outlet />

        {/* -------- BUTTONS -------- */}
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
