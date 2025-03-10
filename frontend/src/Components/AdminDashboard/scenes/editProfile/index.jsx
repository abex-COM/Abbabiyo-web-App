import { Box, Typography, TextField, Button, useTheme, IconButton } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from "axios";
import { useState, useEffect } from "react";
import defaultProfilePic from "../../assets/default.png"; // Import the default profile image

const EditProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

  // Handle form submission
  const handleFormSubmit = async (values, { resetForm }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update your profile.");
      return;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id; // Extract user ID from JWT

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", values.fullName);
    formDataToSend.append("username", values.username);
    formDataToSend.append("email", values.email);
    if (values.password) {
      formDataToSend.append("password", values.password);
    }
    if (values.profileImage) {
      formDataToSend.append("profileImage", values.profileImage);
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

      // Clear inputs after successful update
      resetForm();
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
          <input type="file" hidden accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              // Update Formik's form data with the new file
              setUser((prevUser) => ({ ...prevUser, profileImage: file.name }));
            }
          }} />
        </IconButton>
      </Box>

      {/* Form Fields */}
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          fullName: user?.fullName || '',
          username: user?.username || '',
          email: user?.email || '',
          password: '',
          confirmPassword: '',
          profileImage: user?.profileImage || null,
        }}
        validationSchema={checkoutSchema}
        enableReinitialize // Reinitialize form when user data changes
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="20px">
              {/* Full Name */}
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={values.fullName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              {/* Username */}
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={values.username}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />
            </Box>

            {/* Save Changes Button */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  "&:hover": {
                    transform: "none", // Disable size increase on hover
                    backgroundColor: colors.greenAccent[600], // Keep the same background color on hover
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Validation Schema
const checkoutSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full Name is required")
    .matches(/^[A-Za-z\s]+$/, "Full Name must contain only alphabetic characters and spaces"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default EditProfile;