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
    campaign: "Campaign",
    salesQuantity: "Sales Quantity",
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
    campaign: "ዘመቻ",
    salesQuantity: "የሽያጭ ብዛት",
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
    campaign: "Kaampaanii",
    salesQuantity: "Gatii gurguramaa",
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
    newClients: "ሓደስቲ �ላዕለይ",
    trafficReceived: "ትራፊክ ተቐቢሉ",
    revenueGenerated: "ገቢ ተፈጢሩ",
    recentTransactions: "ቀረባ ግብይት",
    campaign: "ካምፓን",
    salesQuantity: "ብዝሒ ሽያጭ",
    geographyBasedTraffic: "ትራፊክ ኣብ ጂኦግራፊ ዝተመስረተ",
    revenueGeneratedText: "$48,352 ገቢ ተፈጢሩ",
    includesExtraCosts: "ወጻኢታት የሕልና ወጪ የሚያካትት",
  },
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage(); // Get the current language

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
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <StatBox
            title="12,361"
            subtitle={dashboardTranslations[language].emailsSent}
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <StatBox
            title="431,225"
            subtitle={dashboardTranslations[language].salesObtained}
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <StatBox
            title="32,441"
            subtitle={dashboardTranslations[language].newClients}
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <StatBox
            title="1,325,134"
            subtitle={dashboardTranslations[language].trafficReceived}
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
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
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                {dashboardTranslations[language].revenueGenerated}
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              {dashboardTranslations[language].recentTransactions}
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

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
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {dashboardTranslations[language].revenueGeneratedText}
            </Typography>
            <Typography>
              {dashboardTranslations[language].includesExtraCosts}
            </Typography>
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
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
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
            sx={{ marginBottom: "15px" }}
          >
            {dashboardTranslations[language].geographyBasedTraffic}
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;