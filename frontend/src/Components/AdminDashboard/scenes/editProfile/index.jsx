// AdminDashboard/scenes/editProfile/index.jsx
import { Box, Typography, TextField, Button, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const EditProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* Title */}
      <Typography 
        variant="h3" 
        color={colors.grey[100]} 
        fontWeight="bold" 
        sx={{ mb: "20px" }}
      >
        Edit Profile
      </Typography>

      {/* Profile Picture Upload */}
      <Box display="flex" alignItems="center" gap="20px" mb="20px">
        <Box
          width="100px"
          height="100px"
          borderRadius="50%"
          bgcolor={colors.primary[400]}
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <Typography variant="h6" color={colors.grey[100]}>
            No Image
          </Typography>
        </Box>
        <IconButton
          component="label"
          sx={{
            backgroundColor: colors.greenAccent[500],
            "&:hover": { backgroundColor: colors.greenAccent[600] },
            padding: "10px",
          }}
        >
          <PhotoCameraIcon />
          <input type="file" hidden accept="image/*" />
        </IconButton>
      </Box>

      {/* Form Fields */}
      <Box display="flex" flexDirection="column" gap="20px">
        {/* Full Name */}
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Username */}
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Save Changes Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.greenAccent[500],
            "&:hover": { backgroundColor: colors.greenAccent[600] },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;