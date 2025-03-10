import { Box, Typography, TextField, Button, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from "axios";
import { useState, useEffect } from "react";
import defaultProfilePic from "../../assets/default.png"; // Import the default profile image

const EditProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  // State for user data fetched from the backend
  const [user, setUser] = useState(null);

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
        setUser(response.data.user); // Update state with user data
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUserData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update your profile.");
      return;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id; // Extract user ID from JWT

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/update-profile/${userId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

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
            overflow="hidden"
            border={`2px solid ${colors.greenAccent[500]}`}
          >
            <img
              alt="profile-user"
              src={user?.profileImage ? `/uploads/${user.profileImage}` : defaultProfilePic}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
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
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </IconButton>
      </Box>

      {/* Form Fields */}
      <Box display="flex" flexDirection="column" gap="20px" component="form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Username */}
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          variant="outlined"
          sx={{ backgroundColor: colors.primary[400] }}
        />

        {/* Save Changes Button */}
        <Button
          type="submit"
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