import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  IconButton,
  Chip,
  Stack,
  Collapse,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allowRequest, rejectRequest } from "../redux/RequestSlice";

export const ViewRequests = () => {
  const [openRow, setOpenRow] = useState(null);

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };
  const dispatch=useDispatch()


  const allRequests=  useSelector((state) => state.request);
  const requests=allRequests.list.filter(req=>req.status==="בהמתנה")
  const allow = (id) => {
  const updatedAt = new Date().toLocaleDateString("he-IL");
  dispatch(allowRequest({ id, updatedAt }));
}

const reject = (id) => {
  const updatedAt = new Date().toLocaleDateString("he-IL");
  dispatch(rejectRequest({ id, updatedAt }));
}


  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 6, p: 2 }}>
      <Typography variant="h4" fontWeight={600} mb={3} textAlign="center">
        ניהול בקשות מלגה
      </Typography>

      <Paper sx={{ borderRadius: 3, boxShadow: "none", border: "1px solid #e0e0e0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell sx={{ fontWeight: 600 }}>מספר בקשה</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>שם מבקש/ת</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>תאריך הגשה</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>סטטוס</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">פעולות</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {requests.map((req) => (
                <>
                  {/* שורה רגילה */}
                  <TableRow key={req.id}>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleRow(req.id)}>
                        {openRow === req.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>

                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.personalDetails.name}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>
                      <Chip label={req.status} variant="outlined" color="primary" />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          sx={{ borderRadius: "10px", px: 2, minWidth: 80 }}
                          onClick={()=>allow(req.id)}
                        >
                          אישור
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          sx={{ borderRadius: "10px", px: 2, minWidth: 80 }}
                          onClick={()=>reject(req.id)}
                        >
                          דחייה
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {/* שורת פרטים מורחבים */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={openRow === req.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#fafafa", borderTop: "1px solid #eee" }}>
                          <Typography fontWeight={600} mb={1}>
                            פרטי בקשה
                          </Typography>
                          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <Typography><b>טלפון:</b> {req.personalDetails.phoneNumber}</Typography>
                            {/* <Typography><b>אימייל:</b> {req.details.email}</Typography> */}
                            <Typography><b>מספר זהות:</b> {req.personalDetails.id}</Typography>
                            <Typography><b>כתובת:</b> {req.personalDetails.adress}</Typography>
                            <Typography><b>תאריך לידה:</b> {req.personalDetails.birthDate}</Typography>
                            <Typography><b>שם האב:</b> {req.FamilyDetailes.fatherName}</Typography>
                            <Typography><b>שם האם:</b> {req.FamilyDetailes.motherName}</Typography>
                            <Typography><b>בנק:</b> {req.BankDetailes.bank}</Typography>
                            <Typography><b>סניף:</b> {req.BankDetailes.branchNumber}</Typography>
                            <Typography><b>מספר חשבון:</b> {req.BankDetailes.accountNumber}</Typography>
                            <Typography><b>שם קורס:</b> {req.courseDetailes.major}</Typography>
                            <Typography><b>משך קורס:</b> {req.courseDetailes.years} שנים</Typography>
                             <Typography><b>שכר לימוד:</b> {req.courseDetailes.tuition}</Typography>
                            <Typography><b>הערות:</b> {req.FamilyDetailes.notes}</Typography>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
