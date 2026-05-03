import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useSessionStorage, {
  getSessionStorageValue,
} from "../redux/useSessionStorage";
import { useDispatch } from "react-redux";
import { setCurrentRequest } from "../redux/RequestSlice";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

const FILE_REQUIREMENTS = [
  {
    id: "idCopy",
    label: "צילום תעודת זהות",
    description: "תמונה ברורה של שני הצדדים של ת.ז",
    required: true,
  },
  {
    id: "studentAppendix",
    label: "ספח של הסטודנט",
    description: "מסמך המאשר סטטוס של סטודנט",
    required: true,
  },
  {
    id: "fatherAppendix",
    label: "ספח של האב",
    description: "מסמך המאשר סטטוס של האב",
    required: true,
  },
  {
    id: "motherAppendix",
    label: "ספח של האם",
    description: "מסמך המאשר סטטוס של האם",
    required: true,
  },
  {
    id: "studyApproval",
    label: "אישור לימודים",
    description: "מכתב מהמוסד המעיד על לימודים עדכניים",
    required: true,
  },
  {
    id: "bankAccountApproval",
    label: "אישור ניהול חשבון בנק",
    description: "מסמך המאשר את החשבון הבנקאי",
    required: true,
  },
];

const inputStyle = {
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#FF7A00",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FF7A00",
  },
};

export const FileUploadForm = () => {
  const [fileUploads, setFileUploads] = useSessionStorage("FileUploadForm", {
    idCopy: null,
    studentAppendix: null,
    fatherAppendix: null,
    motherAppendix: null,
    studyApproval: null,
    bankAccountApproval: null,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});

  // פונקציה להמרת קובץ ל-Base64
const handleFileSelect = (fileId) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [fileId]: "רק קבצי PDF, JPG ו-PNG מותרים" }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [fileId]: "גודל הקובץ לא יכול להיות יותר מ-10MB" }));
      return;
    }

    setUploading(true);
    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    try {
      const formData = new FormData();
      formData.append(fileId, file); // שם השדה יהיה ה-ID של הקובץ

      // העלאה אמיתית לשרת בזמן בחירת הקובץ
      const response = await axios.post(
        "http://localhost:5000/api/requests/upload-single",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress((prev) => ({ ...prev, [fileId]: percentCompleted }));
          },
        }
      );

      if (response.data.success) {
        setFileUploads((prev) => ({
          ...prev,
          [fileId]: {
            fileName: file.name,
            path: response.data.path, // שמירת הנתיב היחסי מהשרת לאחסון המקומי
          },
        }));
        setErrors((prev) => ({ ...prev, [fileId]: undefined }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, [fileId]: "שגיאה בהעלאת הקובץ" }));
    } finally {
      setUploading(false);
      // משאירים את ההתקדמות על 100 לזמן קצר כדי לתת פידבק ויזואלי לפני היעלמות
      setTimeout(() => setUploadProgress((prev) => ({ ...prev, [fileId]: 0 })), 1000);
    }
  };
  const removeFile = (fileId) => {
    setFileUploads((prev) => ({
      ...prev,
      [fileId]: null,
    }));
    setErrors((prev) => ({
      ...prev,
      [fileId]: undefined,
    }));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      const currentValues = getSessionStorageValue("FileUploadForm");
      dispatch(
        setCurrentRequest({
          key: "fileUploads",
          value: currentValues,
        })
      );
    };
  }, [dispatch]);

  const uploadedCount = Object.values(fileUploads).filter(
    (f) => f !== null
  ).length;
  const requiredCount = FILE_REQUIREMENTS.filter((f) => f.required).length;

  return (
    <Card sx={{ width: "100%", maxWidth: 600, p: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
          העלאת טפסים ומסמכים
        </Typography>

        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {uploadedCount} מתוך {requiredCount} קבצים הועלו
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(uploadedCount / requiredCount) * 100}
            sx={{ mb: 1 }}
          />
        </Box>

        {FILE_REQUIREMENTS.map((requirement) => (
          <Box
            key={requirement.id}
            sx={{
              mb: 3,
              p: 2,
              border: "1px solid #eee",
              borderRadius: 1,
              backgroundColor: fileUploads[requirement.id] ? "#f0f7ff" : "#fff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", flex: 1 }}>
                {requirement.label}
              </Typography>
              {requirement.required && (
                <Chip label="חובה" size="small" color="error" variant="outlined" />
              )}
            </Box>

            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mb: 2 }}
            >
              {requirement.description}
            </Typography>

            {!fileUploads[requirement.id] ? (
              <>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  sx={{
                    mb: 1,
                    borderColor: "#FF7A00",
                    color: "#FF7A00",
                    "&:hover": {
                      borderColor: "#ff9800",
                      backgroundColor: "rgba(255, 122, 0, 0.05)",
                    },
                  }}
                >
                  בחר קובץ
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect(requirement.id)}
                    disabled={uploading}
                  />
                </Button>

                {uploadProgress[requirement.id] !== undefined &&
                  uploadProgress[requirement.id] > 0 &&
                  uploadProgress[requirement.id] < 100 && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress[requirement.id]}
                      sx={{ mb: 1 }}
                    />
                  )}
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon sx={{ color: "success.main" }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {fileUploads[requirement.id].fileName}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => removeFile(requirement.id)}
                >
                  הסר
                </Button>
              </Box>
            )}

            {errors[requirement.id] && (
              <Typography variant="caption" sx={{ color: "error.main", display: "block", mt: 1 }}>
                {errors[requirement.id]}
              </Typography>
            )}
          </Box>
        ))}

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          הערה: התומכות בפורמטים הן PDF, JPG ו-PNG. גודל הקובץ המרבי הוא 10MB.
        </Typography>
      </CardContent>
    </Card>
  );
};
