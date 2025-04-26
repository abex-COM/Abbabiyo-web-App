import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { Box } from "@mui/material"; // Box from MUI
import useUserData from "./../../../hooks/useUserData";

const BarChart = ({ data = [], isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useUserData();
  let formattedData = [];

  if (user?.role === "superadmin") {
    formattedData = data.map((item) => ({
      region: item.region, // superadmin data uses "region"
      farmers: item.Farmers,
    }));
  } else if (user?.role === "admin") {
    formattedData = data.map((item) => ({
      region: item.woreda, // admin data uses "woreda", but map it to "region"
      farmers: item.Farmers,
    }));
  }

  // Fallback for safety
  if (!formattedData || formattedData.length === 0) {
    return <div>No data available for the chart</div>;
  }

  return (
    <Box height="100%" width="100%">
      <ResponsiveBar
        data={formattedData}
        keys={["farmers"]}
        indexBy="region" // Always use "region" as index
        theme={{
          axis: {
            domain: { line: { stroke: colors.grey[100] } },
            legend: { text: { fill: colors.grey[100] } },
            ticks: {
              line: { stroke: colors.grey[100], strokeWidth: 1 },
              text: { fill: colors.grey[100] },
            },
          },
          legends: { text: { fill: colors.grey[100] } },
        }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", "1.6"]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Region/Woreda",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Number of Farmers",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableLabel={false}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            symbolSize: 20,
            effects: [{ on: "hover", style: { itemOpacity: 1 } }],
          },
        ]}
        role="application"
        barAriaLabel={(e) =>
          `${e.id}: ${e.formattedValue} farmers in region: ${e.indexValue}`
        }
      />
    </Box>
  );
};

export default BarChart;
