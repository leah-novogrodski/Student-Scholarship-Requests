import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";

export const ViewStatus = () => {
  const users = useSelector((state) => state.user);
  const requests = useSelector((state) => state.request);
  console.log(requests, "requests");
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  useEffect(() => {
    const fetchStatus = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/requests/my-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequestDetails(response.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [token]);
  if (requestDetails) {
    return (
      <>
        <Box
          sx={{
            maxWidth: 750,
            mx: "auto",
            mt: 6,
            p: 2,
          }}
        >
          <Typography variant="h4" fontWeight={600} textAlign="center" mb={3}>
            סטטוס בקשת מלגה
          </Typography>

          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={500}>
                פרטי בקשה
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={600}>מספר בקשה:</Typography>
                  <Typography>{requestDetails.id}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={600}>שם מבקש/ת:</Typography>
                  <Typography>{requestDetails.personalDetails.name}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={600}>תאריך הגשה:</Typography>
                  <Typography>{requestDetails.date}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography fontWeight={600}>עדכון אחרון:</Typography>
                  <Typography>{requestDetails.lastUpdated}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography fontWeight={600}>סטטוס:</Typography>
                  <Chip
                    label={requestDetails.status}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography fontWeight={600}>הערות:</Typography>
                  <Typography>{requestDetails.notes}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
            </CardContent>
          </Card>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 6,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={3}>
            לא נמצאה בקשת מלגה עבור המשתמש הנוכחי.
          </Typography>
          <Typography variant="body1">
            אנא הגש בקשת מלגה חדשה דרך טופס ההגשה.
          </Typography>
        </Box>
      </>
    );
  }
};

