import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import axios from "axios";
import defaultProfilePic from "../../assets/default.png"; // Import the default profile image
import { useLanguage } from "../../LanguageContext"; // Import the useLanguage hook
import useUserData from "./../../../../hooks/useUserData";
// Translation dictionary for the sidebar
const sidebarTranslations = {
  en: {
    Dashboard: "Dashboard",
    ContactsInformation: "Contacts Information",
    InvoicesBalances: "Invoices Balances",
    CreateUser: "Register Farmer",
    CreateFarmer: "Register",
    FAQPage: "FAQ Page",
    BarChart: "Bar Chart",
    PieChart: "Pie Chart",
    LineChart: "Line Chart",
    GeographyChart: "Geography Chart",
    Admins: "Admins",
    Team: "Farmers", // Change "Team" to "Farmers"
    CreateAdmin: "Register Admin",
    Data: "Data",
    Pages: "Pages",
    Calendar: "Calendar",
    Charts: "Charts",
    SuperAdmin: "Super Admin",
    Admin: "Admin",
    Manage: "Manage",
  },
  am: {
    Dashboard: "ዳሽቦርድ",
    ContactsInformation: "የእውቂያ መረጃ",
    InvoicesBalances: "የክፍያ ሒሳቦች",
    CreateUser: "ፍጠር",
    FAQPage: "ተደጋጋሚ ጥያቄዎች",
    BarChart: "ባር ገበታ",
    PieChart: "ፓይ ገበታ",
    LineChart: "መስመር ገበታ",
    GeographyChart: "ጂኦግራፊ ገበታ",
    Admins: "አስተዳዳሪዎች",
    Team: "ሐበሬታ", // Update translation if needed for "Farmers"
    CreateAdmin: "አስተዳዳሪ ፍጠር",
    Data: "ዳታ",
    Pages: "ገጾች",
    Calendar: "ቀን መቁጠሪያ",
    Charts: "ገበታዎች",
    SuperAdmin: "ሱፐር አስተዳዳሪ",
    Admin: "አስተዳዳሪ",
    Manage: "አስተዳደር",
  },
  om: {
    Dashboard: "Daashboordii",
    ContactsInformation: "Oduu Walqunnamtii",
    InvoicesBalances: "Balansii Kaartaa",
    CreateUser: "Fayyadamaa Uumu",
    FAQPage: "Gaaffilee Faakii",
    BarChart: "Baar Chaartii",
    PieChart: "Pie Chaartii",
    LineChart: "Layin Chaartii",
    GeographyChart: "Jiyoogiraafii Chaartii",
    Admins: "Bulchaa",
    Team: "Fira", // Update translation for "Farmers"
    CreateAdmin: "Manaajii Uumu",
    Data: "Daataa",
    Pages: "Fuulli",
    Calendar: "Kalindarii",
    Charts: "Chaartii",
    SuperAdmin: "Bulchaa Ol-aanaa",
    Admin: "Bulchaa",
    Manage: "Manaajii",
  },
  ti: {
    Dashboard: "ዳሽቦርድ",
    ContactsInformation: "ሓበሬታ ተወላዋይ",
    InvoicesBalances: "ሒሳብ ክፍሊት",
    CreateUser: "ተጠቃሚ ምፍጣር",
    FAQPage: "ተደጋጋሚ ሕቶታት",
    BarChart: "ባር ገበታ",
    PieChart: "ፓይ ገበታ",
    LineChart: "መስመር ገበታ",
    GeographyChart: "ጂኦግራፊ ገበታ",
    Admins: "ኣስተዳደርቲ",
    Team: "ቡድን", // Change "Team" to "Farmers"
    CreateAdmin: "ኣስተዳደርቲ ምፍጣር",
    Data: "ዳታ",
    Pages: "ገጻት",
    Calendar: "ቀን መቁጠሪያ",
    Charts: "ገበታታት",
    SuperAdmin: "ሱፐር ኣስተዳደርቲ",
    Admin: "ኣስተዳደርቲ",
    Manage: "ምምሕዳር",
  },
};

const Item = ({
  title,
  icon,
  selected,
  setSelected,
  setCurrentView,
  closeDropdowns,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage(); // Get the current language

  // Map the title to the correct view name
  const getViewName = (title) => {
    switch (title) {
      case "Dashboard":
        return "Dashboard";
      case "ContactsInformation":
        return "Contacts";
      case "InvoicesBalances":
        return "Invoices";
      case "CreateUser":
        return "Form";
      case "FAQPage":
        return "FAQ";
      case "BarChart":
        return "Bar";
      case "PieChart":
        return "Pie";
      case "LineChart":
        return "Line";
      case "GeographyChart":
        return "Geography";
      case "Admins": // Redirect to ManageAdmins
        return "ManageAdmins";
      case "Team": // Redirect to Team
        return "Team";
      case "CreateAdmin": // Redirect to AddAdmin
        return "AddAdmin";
      default:
        return title;
    }
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        setCurrentView(getViewName(title)); // Update the current view
        closeDropdowns(); // Close all dropdowns when an item is clicked
      }}
      icon={icon}
    >
      <Typography>{sidebarTranslations[language][title] || title}</Typography>
    </MenuItem>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");

  const user = useUserData();
  // State to manage dropdown open/close
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // Function to close all dropdowns
  const closeDropdowns = () => {
    setIsCreateOpen(false);
    setIsManageOpen(false);
  };

  // Function to handle Create dropdown open/close
  const handleCreateOpen = () => {
    setIsCreateOpen(!isCreateOpen);
    setIsManageOpen(false); // Close Manage dropdown when Create is opened
  };

  // Function to handle Manage dropdown open/close
  const handleManageOpen = () => {
    setIsManageOpen(!isManageOpen);
    setIsCreateOpen(false); // Close Create dropdown when Manage is opened
  };

  const { language } = useLanguage(); // Get the current language

  return (
    <Box
      sx={{
        position: "fixed", // Fix the sidebar position
        left: 0,
        top: 0,
        height: "100vh", // Full height of the viewport
        zIndex: 1000, // Ensure the sidebar is above other content
        width: isCollapsed ? "80px" : "270px", // Adjust width when collapsed
        transition: "width 0.3s ease", // Smooth transition
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ zIndex: 1000 }} // Set z-index for the toggle button
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {isCollapsed && (
              <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{ zIndex: 1000 }} // Set z-index for the toggle button
              >
                <MenuOutlinedIcon />
              </IconButton>
            )}
          </MenuItem>

          {/* USER PROFILE SECTION */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center" // Center horizontally
            justifyContent="center" // Center vertically
            height="100%" // Take full height of the sidebar
            mb={isCollapsed ? "0px" : "25px"} // Adjust margin when collapsed
          >
            <Box
              width="200px"
              height="200px"
              borderRadius="50%"
              overflow="hidden"
              border={`2px solid ${colors.greenAccent[500]}`}
            >
              <img
                alt="profile-user"
                src={
                  user?.profileImage
                    ? `http://localhost:5000/uploads/${user.profileImage}`
                    : defaultProfilePic
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  // Fallback to default image if the profile image fails to load
                  e.target.src = defaultProfilePic;
                }}
              />
            </Box>
            {!isCollapsed && (
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.fullName || "Fira Teferi"}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user?.role === "superadmin"
                    ? sidebarTranslations[language].SuperAdmin
                    : sidebarTranslations[language].Admin}
                </Typography>
                <Typography variant="h4" color={colors.grey[100]}>
                  {user?.zone} Zone Admin
                </Typography>
              </Box>
            )}
          </Box>

          {/* MENU ITEMS */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Dashboard */}
            <Item
              title="Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
              closeDropdowns={closeDropdowns} // Pass closeDropdowns function
            />

            {/* DATA SECTION */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              {sidebarTranslations[language].Data}
            </Typography>
            {/* Create Dropdown */}
            <SubMenu
              title={sidebarTranslations[language].CreateFarmer}
              icon={<PersonOutlinedIcon />}
              open={isCreateOpen}
              onOpenChange={handleCreateOpen} // Use handleCreateOpen to manage dropdown state
            >
              {/* Show Create Admin only for superadmin */}
              {user?.role === "superadmin" && (
                <Item
                  title="CreateAdmin"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  setCurrentView={setCurrentView}
                  closeDropdowns={closeDropdowns} // Pass closeDropdowns function
                />
              )}
              {/* Show Create User for both superadmin and admin */}
              <Item
                title="CreateUser"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setCurrentView={setCurrentView}
                closeDropdowns={closeDropdowns} // Pass closeDropdowns function
              />
            </SubMenu>

            {/* Manage Dropdown */}
            <SubMenu
              title={sidebarTranslations[language].Manage}
              icon={<PeopleOutlinedIcon />}
              open={isManageOpen}
              onOpenChange={handleManageOpen} // Use handleManageOpen to manage dropdown state
            >
              {/* Show Manage Admins only for superadmin */}
              {user?.role === "superadmin" && (
                <Item
                  title="Admins"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  setCurrentView={setCurrentView}
                  closeDropdowns={closeDropdowns} // Pass closeDropdowns function
                />
              )}
              {/* Show Manage Team for both superadmin and admin */}
              <Item
                title="Team"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                setCurrentView={setCurrentView}
                closeDropdowns={closeDropdowns} // Pass closeDropdowns function
              />
            </SubMenu>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
