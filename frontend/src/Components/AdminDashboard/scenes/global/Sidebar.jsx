import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
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

const Item = ({ title, icon, selected, setSelected, setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Map the title to the correct view name
  const getViewName = (title) => {
    switch (title) {
      case "Manage Team":
        return "Team";
      case "Contacts Information":
        return "Contacts";
      case "Invoices Balances":
        return "Invoices";
      case "Create User":
        return "Form";
      case "FAQ Page":
        return "FAQ";
      case "Bar Chart":
        return "Bar";
      case "Pie Chart":
        return "Pie";
      case "Line Chart":
        return "Line";
      case "Geography Chart":
        return "Geography";
      default:
        return title; // For "Dashboard" and "Calendar"
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
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, setCurrentView }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    profileImage: "default.png", // Default profile image
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userId = JSON.parse(atob(token.split('.')[1])).id; // Extract user ID from JWT

      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update state with user data
        setUser(response.data.user);

        // Log the image path for debugging
        console.log(
          "Image Path:",
          response.data.user?.profileImage ? `/uploads/${response.data.user.profileImage}` : defaultProfilePic
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

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
                <Typography variant="h3" color={colors.grey[100]}>
                  Admin
                </Typography>
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
              width="100px"
              height="100px"
              borderRadius="50%"
              overflow="hidden"
              border={`2px solid ${colors.greenAccent[500]}`}
            >
              <img
                alt="profile-user"
                src={user?.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : defaultProfilePic}
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
                  System Admin
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
            />

            {/* DATA SECTION */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Manage Team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Contacts Information"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Invoices Balances"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />

            {/* PAGES SECTION */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Create User"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="FAQ Page"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />

            {/* CHARTS SECTION */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Pie Chart"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Line Chart"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
            <Item
              title="Geography Chart"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setCurrentView={setCurrentView}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;