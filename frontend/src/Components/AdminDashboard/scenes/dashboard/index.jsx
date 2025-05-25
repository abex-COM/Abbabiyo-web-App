import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

import { useLanguage } from "../../LanguageContext";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserData from "../../../../hooks/useUserData";
import baseUrl from "../../../../baseUrl/baseUrl";

const dashboardTranslations = {
  en: {
    dashboardTitle: "DASHBOARD",
    dashboardSubtitle: "Welcome to your dashboard",
    downloadReports: "Export Excel",
    emailsSent: "Emails Sent",
    salesObtained: "Sales Obtained",
    newClients: "New Clients",
    trafficReceived: "Traffic Received",
    revenueGenerated: "Revenue Generated",
    recentTransactions: "Recent Transactions",
    campaign: "Total Registered Farmers",
    salesQuantity: "Farmers By Zone",
    geographyBasedTraffic: "Geography Based Traffic",
    revenueGeneratedText: "$48,352 revenue generated",
    includesExtraCosts: "Includes extra misc expenditures and costs",
  },
  am: {
    dashboardTitle: "ዳሽቦርድ",
    dashboardSubtitle: "ወደ ዳሽቦርድዎ እንኳን በደህና መጡ",
    downloadReports: "ኤክሴል ሪፖርት ይውርዱ",
    emailsSent: "ኢሜሎች ተልከዋል",
    salesObtained: "የተገኙ ሽያጮች",
    newClients: "አዲስ ደንበኞች",
    trafficReceived: "የተቀበለ ትራፊክ",
    revenueGenerated: "የሚገኝ ገቢ",
    recentTransactions: "የቅርብ ጊዜ ግብይቶች",
    campaign: "የተመዘገቡ ገበሬዎች ጠቅላላ ብዛት",
    salesQuantity: "የክልል ያነፈ ገበሬዎች",
    geographyBasedTraffic: "በጂኦግራፊ ላይ የተመሰረተ ትራፊክ",
    revenueGeneratedText: "$48,352 ገቢ ተፈጥሯል",
    includesExtraCosts: "ተጨማሪ ወጪዎችን ያጠቃልላል",
  },
  om: {
    dashboardTitle: "Daashboordii",
    dashboardSubtitle: "Baga daashboordii kee seenaa",
    downloadReports: "Eksel dhiyeessuu",
    emailsSent: "Imeelii ergame",
    salesObtained: "Gatii gurguramaa",
    newClients: "Miseensota haaraa",
    trafficReceived: "Traafiifi qabadame",
    revenueGenerated: "Mallaqa argame",
    recentTransactions: "Gareen walqabsiisaa",
    campaign: "Baay'ina Guutuu Faarmerootaa",
    salesQuantity: "Faarmeroota Naannoo",
    geographyBasedTraffic: "Traafiifi geografii irratti hundaa’e",
    revenueGeneratedText: "$48,352 mallaqa argame",
    includesExtraCosts: "Kostii dabalataa ni hammata",
  },
  ti: {
    dashboardTitle: "ዳሽቦርድ",
    dashboardSubtitle: "ናብ ዳሽቦርድካ ብደሓን መጻእካ",
    downloadReports: "ሪፖርት ምውራድ",
    emailsSent: "ኢሜል ተልኪኡ",
    salesObtained: "ዝተገዝአ ሽያጭ",
    newClients: "ሓደስቲ ላዕለይ",
    trafficReceived: "ትራፊክ ተቐቢሉ",
    revenueGenerated: "ገቢ ተፈጢሩ",
    recentTransactions: "ቀረባ ግብይት",
    campaign: "ድምሩ ዝተመዝገቡ ኣራሒታት",
    salesQuantity: "ብዝሒ ኣራሒታት ናይ ዞባ",
    geographyBasedTraffic: "ትራፊክ ኣብ ጂኦግራፊ ዝተመስረተ",
    revenueGeneratedText: "$48,352 ገቢ ተፈጢሩ",
    includesExtraCosts: "ወጻኢታት የሕልና ወጪ የሚያካትት",
  },
};

const Dashboard = () => {
  const user = useUserData();
  const [dashboardData, setDashboardData] = useState({});
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();

  const [woredas, setWoredas] = useState([]);
  const [selectedWoreda, setSelectedWoreda] = useState("");
  const downloadReport = async () => {
    if (!selectedWoreda) {
      alert("Please select a woreda to download the report.");
      return;
    }
    try {
      const response = await axios.get(
        `${baseUrl}/api/admin/download-report?woreda=${selectedWoreda}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for downloading files
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${selectedWoreda}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };
  useEffect(() => {
    const fetchWoredas = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/admin/getUsersworedas?zone=${user.zone}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWoredas(res.data);
      } catch (err) {
        console.error("Failed to load woredas", err);
      }
    };
    fetchWoredas();
  }, [user.zone, token]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${baseUrl}/api/admin/dashboard-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/admin/farmers-per-region`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load farmer stats", err);
      }
    };
    fetchFarmers();
  }, [token]);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={dashboardTranslations[language].dashboardTitle}
          subtitle={dashboardTranslations[language].dashboardSubtitle}
        />
        {user.role === "admin" ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Select
              value={selectedWoreda}
              onChange={(e) => setSelectedWoreda(e.target.value)}
              sx={{
                width: "200px",
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
              }}
              displayEmpty
            >
              <MenuItem value="">Select Woreda to Download</MenuItem>
              {woredas.map((woreda, index) => (
                <MenuItem key={index} value={woreda}>
                  {woreda}
                </MenuItem>
              ))}
            </Select>

            <Button
              onClick={downloadReport}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: colors.blueAccent[800],
                },
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              {dashboardTranslations[language].downloadReports}
            </Button>
          </Box>
        ) : (
          ""
        )}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="flex"
        justifyContent="space-around"
        gap="20px"
        flexWrap="wrap"
        mt="20px"
      >
        {/* Total Farmers */}
        <Box
          flex="1 1 300px"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="5px"
          sx={{
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Typography variant="h5" fontWeight="600">
            {dashboardTranslations[language].campaign}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {dashboardData?.totalFarmers || 0} farmers
            </Typography>
          </Box>
        </Box>

        {/* Farmers by Zone/Woreda */}
        <Box
          flex="1 1 700px"
          backgroundColor={colors.primary[400]}
          borderRadius="5px"
          p="30px"
          sx={{
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Typography variant="h5" fontWeight="600">
            {user?.role === "superadmin"
              ? dashboardTranslations[language].salesQuantity
              : "Farmers By Woreda"}
          </Typography>
          <Box height="250px" mt="20px">
            <BarChart data={data} isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
