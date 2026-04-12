import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getValidToken = () => {
  const token = Cookies.get("token");

  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      Cookies.remove("token"); // ניקוי אוטומטי
      return null;
    }

    return token; // הטוקן תקין, מחזירים אותו
  } catch (error) {
    return null;
  }
};

const settings = ["Profile", "Account", "Dashboard", "Logout"];

export const Nav = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const user = useSelector((state) => state.user.currentUser);

  const isLogedIn = async (path) => {
    const token = getValidToken();
    if (!token) {
      await Swal.fire({
        icon: "error",
        title: "עליך להתחבר למערכת כדי להמשיך.",
        confirmButtonText: "כניסה",
        confirmButtonColor: "#FF7A00",
      });
      navigate("/Login");
    } else {
      navigate(path);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "#0A1A44",
        boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
        fontFamily: "Rubik, sans-serif",
        borderBottom: "4px solid #FF7A00", // נגיעה כתומה חזקה
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component={NavLink}
            to="/home"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{
                height: 40,
                width: "auto",
              }}
            />
          </Box>

          {/* תפריט מובייל */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon sx={{ fontSize: 28, color: "#FF7A00" }} />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 3,
                  padding: 1,
                  background: "white",
                  border: "2px solid #FF7A00",
                },
              }}
            >
              {[
                { to: "Login", label: "כניסה" },
                {
                  to: "/SendRequest/PersonalForm",
                  label: "שליחת בקשה",
                  fn: true,
                },
                { to: "ViewStatus", label: "צפייה בסטטוס" },
                { to: "ViewRequests", label: "צפייה בבקשות" },
              ].map((item) => (
                <MenuItem key={item.label}>
                  <Typography
                    component={item.fn ? "div" : NavLink}
                    to={!item.fn ? item.to : undefined}
                    onClick={
                      item.fn
                        ? () => isLogedIn("/SendRequest/PersonalForm")
                        : undefined
                    }
                    sx={{
                      color: "#0A1A44",
                      fontFamily: "Rubik",
                      fontWeight: 600,
                      "&:hover": {
                        color: "#FF7A00",
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            component={NavLink}
            to="/home"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{
                height: 32,
                width: "auto",
              }}
            />
          </Box>

          {/* תפריט רוחב */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {[{ to: "Login", label: "כניסה" }].map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                sx={{
                  my: 2,
                  mx: 1,
                  color: "white",
                  fontFamily: "Rubik",
                  fontWeight: 500,
                  padding: "6px 16px",
                  borderRadius: "12px",
                  border: "2px solid transparent",
                  transition: "0.25s",
                  "&:hover": {
                    borderColor: "#FF7A00",
                    color: "#FF7A00",
                    backgroundColor: "rgba(255, 122, 0, 0.15)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* שליחת בקשה */}
            <Button
              onClick={() => isLogedIn("/SendRequest/PersonalForm")}
              sx={{
                my: 2,
                mx: 1,
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                border: "2px solid transparent",
                "&:hover": {
                  color: "#FF7A00",
                  borderColor: "#FF7A00",
                  backgroundColor: "rgba(255,122,0,0.15)",
                },
              }}
            >
              שליחת בקשה
            </Button>

            {/* צפייה בסטטוס */}
            <Button
              onClick={() => isLogedIn("/viewStatus")}
              sx={{
                my: 2,
                mx: 1,
                color: "white",
                fontWeight: 600,
                borderRadius: "12px",
                "&:hover": {
                  color: "#FF7A00",
                  borderColor: "#FF7A00",
                  backgroundColor: "rgba(255,122,0,0.15)",
                },
              }}
            >
              צפיה בסטטוס
            </Button>

            {user.id === "123" && (
              <Button
                component={NavLink}
                to="ViewRequests"
                sx={{
                  my: 2,
                  mx: 1,
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "12px",
                  "&:hover": {
                    color: "#FF7A00",
                    borderColor: "#FF7A00",
                    backgroundColor: "rgba(255,122,0,0.15)",
                  },
                }}
              >
                צפייה בבקשות
              </Button>
            )}
          </Box>

          {/* תפריט משתמש */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={user.name ? user.name : "Open settings"}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user.name}
                  src="..."
                  sx={{
                    border: "2px solid #FF7A00",
                  }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  borderRadius: 3,
                  border: "2px solid #FF7A00",
                  padding: 1,
                },
              }}
            >
              {settings.map((setting) => (
                <MenuItem key={setting}>
                  <Typography
                    sx={{
                      fontFamily: "Rubik",
                      fontWeight: 500,
                      "&:hover": { color: "#FF7A00" },
                    }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
