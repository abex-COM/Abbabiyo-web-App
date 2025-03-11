import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import { useNavigate } from "react-router-dom";
import EditProfile from "./scenes/editProfile";
import ManageAdmins from "./scenes/manageAdmins"; // Import the ManageAdmins component
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("Dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const renderView = () => {
    switch (currentView) {
      case "Dashboard":
        return <Dashboard />;
      case "Team":
        return <Team />;
      case "Contacts":
        return <Contacts />;
      case "Invoices":
        return <Invoices />;
      case "Form":
        return <Form />;
      case "Calendar":
        return <Calendar />;
      case "FAQ":
        return <FAQ />;
      case "Bar":
        return <Bar />;
      case "Pie":
        return <Pie />;
      case "Line":
        return <Line />;
      case "Geography":
        return <Geography />;
      case "EditProfile":
        return <EditProfile />;
      case "ManageAdmins": // Add this case
        return <ManageAdmins />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            setCurrentView={setCurrentView}
          />
          <main
            className="content"
            style={{
              marginLeft: isSidebarCollapsed ? "80px" : "270px",
              transition: "margin 0.3s ease",
            }}
          >
            <Topbar setCurrentView={setCurrentView} />
            {renderView()}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminDashboard;