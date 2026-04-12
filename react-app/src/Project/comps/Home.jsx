import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export const Home = () => {
  return <>
   <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {/* HERO */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: 2,
          background: "linear-gradient(to bottom right,lightgray, #ffffff)",
        }}
      >
        <Typography variant="h3" sx={{ color: "#ff7b22", fontWeight: "bold" }}>
          כל מה שצריך לדעת על מילגות – במקום אחד
        </Typography>

        <Typography
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 3,
            fontSize: 20,
            color: "#444",
          }}
        >
          מרכז מידע אמין ומעודכן על מאות מילגות לסטודנטים: לפי מצב כלכלי,
          מצוינות, תחום לימוד, אזור מגורים ועוד.
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 5,
            backgroundColor: "#ff7b22",
            borderRadius: "30px",
            px: 4,
            py: 1.5,
            fontSize: "18px",
            "&:hover": { backgroundColor: "#e96f1d" },
          }}
        >
          התחל חיפוש מילגות
        </Button>
      </Box>

      {/* CATEGORIES */}
      <Container sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          sx={{ color: "#ff7b22", fontWeight: "bold", mb: 2 }}
        >
          קטגוריות פופולריות של מילגות
        </Typography>

        <Grid container spacing={3}>
          {/* CARD 1 */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#ff8c32", fontWeight: "bold" }}
              >
                מילגות על בסיס סוציו־אקונומי
              </Typography>
              <Typography sx={{ mt: 1 }}>
                מיועדות לסטודנטים שזקוקים לתמיכה במימון שכר לימוד ומחיה. לרוב
                יידרשו מסמכי הכנסה ואישור סטודנט.
              </Typography>
            </Paper>
          </Grid>

          {/* CARD 2 */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#ff8c32", fontWeight: "bold" }}
              >
                מילגות מצוינות
              </Typography>
              <Typography sx={{ mt: 1 }}>
                מוענקות על בסיס הישגים גבוהים: פסיכומטרי, בגרות, או ממוצע
                אקדמי. חלקן כוללות פרויקטים חברתיים.
              </Typography>
            </Paper>
          </Grid>

          {/* CARD 3 */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#ff8c32", fontWeight: "bold" }}
              >
                מילגות לפי תחום לימוד
              </Typography>
              <Typography sx={{ mt: 1 }}>
                הנדסה, חינוך, מדעי המחשב, משפטים ועוד — גופים ציבוריים ופרטיים
                מעניקים תמיכה ייעודית.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* FORM PROCESS */}
      <Container sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          sx={{ color: "#ff7b22", fontWeight: "bold", mb: 2 }}
        >
          תהליך הגשת בקשה למילגה
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ff8c32", fontWeight: "bold" }}
              >
                1. איסוף מסמכים
              </Typography>
              <Typography sx={{ mt: 1 }}>
                • אישור לימודים  
                • מסמכי הכנסה  
                • תדפיס בנק  
                • מכתב אישי (מומלץ)
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ff8c32", fontWeight: "bold" }}
              >
                2. שליחת בקשה
              </Typography>
              <Typography sx={{ mt: 1 }}>
                מילוי טופס הגשה מקוון וצירוף כל המסמכים הנדרשים לפני מועד
                הסיום.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ff8c32", fontWeight: "bold" }}
              >
                3. מעקב סטטוס
              </Typography>
              <Typography sx={{ mt: 1 }}>
                בדיקת סטטוס הבקשה: נשלח, בטיפול, בבדיקה, אושר או נדחה.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* FAQ */}
      <Container sx={{ mt: 10, mb: 10 }}>
        <Typography
          variant="h4"
          sx={{ color: "#ff7b22", fontWeight: "bold", mb: 3 }}
        >
          שאלות נפוצות
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ color: "#ff7b22", fontWeight: "bold" }}>
              כמה זמן לוקח לקבל תשובה?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            בד"כ 3–10 שבועות, תלוי בגוף שמעניק את המילגה.
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ color: "#ff7b22", fontWeight: "bold" }}>
              האם ניתן להגיש לכמה מילגות במקביל?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            כן, מומלץ להגדיל את סיכויי הקבלה.
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ color: "#ff7b22", fontWeight: "bold" }}>
              האם יש מילגות בלי מבחני הכנסה?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            כן — מילגות מצוינות וייעודיות לרוב לא בודקות מצב כלכלי.
          </AccordionDetails>
        </Accordion>
      </Container>

      {/* FOOTER */}
      <Box
        sx={{
          backgroundColor: "#333",
          color: "#eee",
          textAlign: "center",
          py: 5,
          mt: 10,
        }}
      >
        <Typography variant="h6" sx={{ color: "#ff8c32" }}>
          מרכז המילגות לסטודנטים בישראל
        </Typography>
        <Typography>מידע אמין, עדכני ומלא.</Typography>
        <Typography sx={{ mt: 1 }}>support@scholarcenter.co.il</Typography>
      </Box>
    </Box>
  </>;
};
