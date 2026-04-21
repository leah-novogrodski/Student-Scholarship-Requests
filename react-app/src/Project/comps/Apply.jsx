import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router";

export const Apply = () => {
  return (
    <>
      <Box
        sx={{
          maxWidth: 700,
          mx: "auto",
          mt: 6,
          p: 2,
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            background: "linear-gradient(to bottom right, #ffffff, #f7f9fb)",
            p: 1,
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
         
            <Typography
              variant="h4"
              fontWeight={600}
              mb={2}
              sx={{ color: "#0d47a1" }} 
            >
              בקשתך נשלחה בהצלחה!
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: "#333" }}>
              הבקשה נקלטה במערכת ותטופל בהקדם.  
              ניתן לעקוב אחר סטטוס הבקשה שלך בכל רגע בדף סטטוס המילגה.
            </Typography>

            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/viewStatus"
              sx={{
                mt: 2,
                px: 4,
                py: 1.2,
                borderRadius: "12px",
                fontWeight: 600,
                backgroundColor: "#ff8f00", // כתום עדין — אותו סגנון
                "&:hover": { backgroundColor: "#ff6f00" },
              }}
            >
              מעבר לסטטוס הבקשה
            </Button>

         
            <Typography variant="body2" sx={{ mt: 4, color: "#666" }}>
              תודה שהגשת בקשה דרך המערכת.  
              במידה ויש צורך בעדכון נוסף — ניצור עמך קשר.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
