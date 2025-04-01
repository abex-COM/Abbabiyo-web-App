import { Box, Typography, TextField, Button, useTheme, IconButton } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import defaultProfilePic from "../../assets/default.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userId = JSON.parse(atob(token.split('.')[1])).id;

      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Update Formik's form data with the new file
      setUser((prevUser) => ({ ...prevUser, profileImage: file }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (values, { resetForm }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    const userId = JSON.parse(atob(token.split('.')[1])).id;

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
    
      toast.success(response.data.message);
    
      // Clear the preview after successful upload
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    
      // Clear inputs after successful update
      resetForm();
    
      // Force a full page reload after 1 second to show updated data everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // Clean up the object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Box m="20px">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

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
            src={
              imagePreview || 
              (user?.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : defaultProfilePic)
            }
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src = defaultProfilePic;
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
          <input
            type="file"
            hidden
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
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
        enableReinitialize
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

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  "&:hover": {
                    transform: "none",
                    backgroundColor: colors.greenAccent[600],
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