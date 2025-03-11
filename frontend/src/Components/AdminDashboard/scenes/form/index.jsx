import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Send a POST request to the backend to create a new farmer
      const response = await axios.post("http://localhost:5000/api/farmers/register", values);
      console.log("Farmer created:", response.data);
      toast.success("Farmer created successfully!");
      // Clear the form fields after successful registration
      resetForm();
    } catch (error) {
      console.error("Error creating farmer:", error.response?.data || error.message);
      toast.error("Failed to create farmer. Please try again.");
      resetForm();
    }
  };

  return (
    <Box m="20px">
      {/* Toast Container */}
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
      <Header title="CREATE FARMER" subtitle="Create a New Farmer Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Full Name */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Username */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Email */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Password */}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Farm Name */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Farm Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.farmName}
                name="farmName"
                error={!!touched.farmName && !!errors.farmName}
                helperText={touched.farmName && errors.farmName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Location */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={!!touched.location && !!errors.location}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Crops (Comma-separated) */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Crops (Comma-separated)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.crops}
                name="crops"
                error={!!touched.crops && !!errors.crops}
                helperText={touched.crops && errors.crops}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{
                  "&:hover": {
                    transform: "none", // Disable size increase on hover
                    backgroundColor: "secondary.main", // Keep the same background color on hover
                  },
                }}
              >
                Create New Farmer
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
  password: yup.string().required("Password is required"),
  farmName: yup.string().required("Farm Name is required"),
  location: yup.string().required("Location is required"),
  crops: yup.string().required("Crops are required"),
});

// Initial Values
const initialValues = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  farmName: "",
  location: "",
  crops: "",
};

export default Form;