import { Box, IconButton, useTheme, Menu, MenuItem, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { MdOutlineLanguage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../LanguageContext"; // Import the useLanguage hook

const Topbar = ({ setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  // State for profile dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(anchorEl);

  // State for language dropdown
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const isLanguageMenuOpen = Boolean(languageAnchorEl);

  // Get language and changeLanguage function from context
  const { language, changeLanguage } = useLanguage();

  // Profile dropdown handlers
  const handleProfileHover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setCurrentView("EditProfile");
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("preferredLanguage");
    handleProfileMenuClose();
    navigate("/");
  };

  // Language dropdown handlers
  const handleLanguageHover = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang); // Update the language globally
    handleLanguageMenuClose();
  };

  // Languages list
  const languages = [
    { code: "en", name: "English" },
    { code: "am", name: "Amharic" },
    { code: "om", name: "Afaan Oromo" },
    { code: "ti", name: "Tigrinya" },
  ];

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
        {/* Theme Toggle Button */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>

        {/* Language Dropdown */}
        <IconButton
          onMouseEnter={handleLanguageHover}
          onMouseLeave={handleLanguageMenuClose}
        >
          <MdOutlineLanguage />
        </IconButton>
        <Menu
          anchorEl={languageAnchorEl}
          open={isLanguageMenuOpen}
          onClose={handleLanguageMenuClose}
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
          onMouseEnter={handleLanguageHover}
          onMouseLeave={handleLanguageMenuClose}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
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
                {lang.name}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* Profile Dropdown */}
        <IconButton onMouseEnter={handleProfileHover} onMouseLeave={handleProfileMenuClose}>
          <PersonOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
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
          onMouseLeave={handleProfileMenuClose}
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