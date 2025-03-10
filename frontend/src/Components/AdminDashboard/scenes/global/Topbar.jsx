// Topbar.jsx
import { Box, IconButton, useTheme, Menu, MenuItem, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Topbar = ({ setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileHover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setCurrentView("EditProfile"); // Update the current view to "EditProfile"
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("preferredLanguage");
    handleMenuClose();
    navigate("/");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="10px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onMouseEnter={handleProfileHover} onMouseLeave={handleMenuClose}>
          <PersonOutlinedIcon />
        </IconButton>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            style: {
              backgroundColor: colors.primary[400],
              borderRadius: "5px",
              padding: "0",
              marginTop: "38px",
            },
          }}
          onMouseEnter={handleProfileHover}
          onMouseLeave={handleMenuClose}
        >
          <MenuItem
            onClick={handleEditProfile}
            sx={{
              color: colors.greenAccent[600],
              fontWeight: "800",
              borderBottom: `1px solid ${colors.grey[100]}`,
              "&:hover": {
                color: "#00e2e5",
                backgroundColor: "transparent",
              },
            }}
          >
            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "700" }}>
              Edit Profile
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: colors.greenAccent[600],
              fontWeight: "800",
              borderBottom: `1px solid ${colors.grey[100]}`,
              "&:hover": {
                color: "#00e2e5",
                backgroundColor: "transparent",
              },
            }}
          >
            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "700" }}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;