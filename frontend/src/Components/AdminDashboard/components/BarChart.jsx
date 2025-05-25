import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { Box } from "@mui/material";
import useUserData from "./../../../hooks/useUserData";

const BarChart = ({ data = [], isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useUserData();
  let formattedData = [];

  if (!user) return <div>Loading...</div>;

  if (user.role === "superadmin") {
    formattedData = data.map((item) => ({
      region: item.region,
      farmers: item.Farmers,
    }));
  } else if (user.role === "admin") {
    formattedData = data.map((item) => ({
      region: item.woreda,
      farmers: item.Farmers,
    }));
  }

  if (formattedData.length === 0) {
    return <div>No data available for the chart</div>;
  }

  // Calculate the maximum farmer count
  const maxFarmers = Math.max(...formattedData.map((item) => item.farmers), 0);
  // Generate tick values from 0 to maxFarmers
  const tickValues = Array.from({ length: maxFarmers + 1 }, (_, i) => i);

  return (
    <Box height="100%" width="100%">
      <ResponsiveBar
        data={formattedData}
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
          grid: {
            line: {
              stroke: "transparent", // This removes the grid lines
            },
          },
        }}
        keys={["farmers"]}
        indexBy="region"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
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
          legend: isDashboard ? undefined : "Region / Woreda",
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
          format: (value) => Math.floor(value),
          tickValues: tickValues, // Use our generated tick values
        }}
        enableGridY={false} // This completely disables the y-axis grid lines
        enableLabel={false}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
          },
        ]}
        role="application"
        barAriaLabel={({ id, formattedValue, indexValue }) =>
          `${id}: ${formattedValue} farmers in region: ${indexValue}`
        }
      />
    </Box>
  );
};

export default BarChart;
