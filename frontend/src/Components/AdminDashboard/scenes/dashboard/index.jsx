import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useLanguage } from "../../LanguageContext"; // Import the useLanguage hook
import { useEffect, useState } from "react";
import axios from "axios";

// Translation dictionary for the Dashboard
const dashboardTranslations = {
  en: {
    dashboardTitle: "DASHBOARD",
    dashboardSubtitle: "Welcome to your dashboard",
    downloadReports: "Download Reports",
    emailsSent: "Emails Sent",
    salesObtained: "Sales Obtained",
    newClients: "New Clients",
    trafficReceived: "Traffic Received",
    revenueGenerated: "Revenue Generated",
    recentTransactions: "Recent Transactions",
    campaign: "Total Registered Farmers", // updated
    salesQuantity: "Farmers By Zone",
    geographyBasedTraffic: "Geography Based Traffic",
    revenueGeneratedText: "$48,352 revenue generated",
    includesExtraCosts: "Includes extra misc expenditures and costs",
  },
  am: {
    dashboardTitle: "ዳሽቦርድ",
    dashboardSubtitle: "ወደ ዳሽቦርድዎ እንኳን በደህና መጡ",
    downloadReports: "ሪፖርቶችን አውርድ",
    emailsSent: "ኢሜሎች ተልከዋል",
    salesObtained: "የተገኙ ሽያጮች",
    newClients: "አዲስ ደንበኞች",
    trafficReceived: "የተቀበለ ትራፊክ",
    revenueGenerated: "የሚገኝ ገቢ",
    recentTransactions: "የቅርብ ጊዜ ግብይቶች",
    campaign: "የተመዘገቡ ገበሬዎች ጠቅላላ ብዛት", // updated
    salesQuantity: "የክልል ያነፈ ገበሬዎች",
    geographyBasedTraffic: "በጂኦግራፊ ላይ የተመሰረተ ትራፊክ",
    revenueGeneratedText: "$48,352 ገቢ ተፈጥሯል",
    includesExtraCosts: "ተጨማሪ ወጪዎችን ያጠቃልላል",
  },
  om: {
    dashboardTitle: "Daashboordii",
    dashboardSubtitle: "Baga daashboordii kee seenaa",
    downloadReports: "Raapportii dhiyeessuu",
    emailsSent: "Imeelii ergame",
    salesObtained: "Gatii gurguramaa",
    newClients: "Miseensota haaraa",
    trafficReceived: "Traafiifi qabadame",
    revenueGenerated: "Mallaqa argame",
    recentTransactions: "Gareen walqabsiisaa",
    campaign: "Baay'ina Guutuu Faarmerootaa", // updated
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
    campaign: "ድምሩ ዝተመዝገቡ ኣራሒታት", // updated
    salesQuantity: "ብዝሒ ኣራሒታት ናይ ዞባ",
    geographyBasedTraffic: "ትራፊክ ኣብ ጂኦግራፊ ዝተመስረተ",
    revenueGeneratedText: "$48,352 ገቢ ተፈጢሩ",
    includesExtraCosts: "ወጻኢታት የሕልና ወጪ የሚያካትት",
  },
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(0);
  const [data, setData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage(); // Get the current language
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/dashboard-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/farmers-per-region"
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to load farmer stats", err);
      }
    };

    fetchFarmers();
  }, []);
  console.log(dashboardData);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={dashboardTranslations[language].dashboardTitle}
          subtitle={dashboardTranslations[language].dashboardSubtitle}
        />

        <Box>
          <Button
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
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="flex"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        justifyContent="space-around"
        gap="20px"
      >
        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          sx={{
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
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
            <ProgressCircle
              progress={(dashboardData?.totalFarmers || 0) / 100}
              size="125"
            />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {dashboardData?.totalFarmers || 0} farmers
            </Typography>

            {/* <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {dashboardTranslations[language].revenueGeneratedText}
            </Typography>
            <Typography>
              {dashboardTranslations[language].includesExtraCosts}
            </Typography> */}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          sx={{
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            {dashboardTranslations[language].salesQuantity}
          </Typography>
          <Box height="250px" width="700px" mt="-20px">
            <BarChart data={data} isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
