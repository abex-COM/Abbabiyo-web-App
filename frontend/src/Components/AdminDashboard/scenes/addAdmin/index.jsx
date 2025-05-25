import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../LanguageContext";
import { MenuItem } from "@mui/material"; // Make sure this import exists
import { ethiopianZones } from "../../../../constants/ethiopianData";
import baseUrl from "../../../../baseUrl/baseUrl";
import { useNavigate } from "react-router-dom";

// Translation dictionary
const addAdminTranslations = {
  en: {
    title: "CREATE ADMIN",
    subtitle: "Create a New Admin Profile",
    fullName: "Full Name",
    zone: "Zone",
    username: "Username",
    email: "Email",
    password: "Password",
    createButton: "Create New Admin",
    success: "Admin created successfully!",
    error: "An unexpected error occurred. Please try again.",
    validation: {
      fullNameRequired: "Full Name is required",
      fullNameInvalid:
        "Full Name must contain only alphabetic characters and spaces",
      usernameRequired: "Username is required",
      emailInvalid: "Invalid email",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
    },
  },
  am: {
    title: "አዲስ አስተዳዳሪ ይፍጠሩ",
    subtitle: "አዲስ የአስተዳዳሪ መግለጫ ይፍጠሩ",
    fullName: "ሙሉ ስም",
    username: "የተጠቃሚ ስም",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    createButton: "አዲስ አስተዳዳሪ ይፍጠሩ",
    success: "አስተዳዳሪ በተሳካ ሁኔታ ተፈጥሯል!",
    error: "ያልተጠበቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።",
    validation: {
      fullNameRequired: "ሙሉ ስም ያስፈልጋል",
      fullNameInvalid: "ሙሉ ስም የሆሄያት ቁምፊዎችና ቦታዎች ብቻ ሊኖሩት ይገባል",
      usernameRequired: "የተጠቃሚ ስም ያስፈልጋል",
      emailInvalid: "ልክ ያልሆነ ኢሜይል",
      emailRequired: "ኢሜይል ያስፈልጋል",
      passwordRequired: "የይለፍ ቃል ያስፈልጋል",
      zone: "ዞን ይምረጡ",
    },
  },
  om: {
    title: "ADMINISTRAATORAA UUMUU",
    subtitle: "Administraatoraa haaraa uumuu",
    fullName: "Maqaa Guutuu",
    username: "Maqaa Fayyadamaa",
    email: "Imeelii",
    zone: "Zoonii",
    password: "Jecha Iccitii",
    createButton: "Administraatoraa Haaraa Uumuu",
    success: "Administraatoraa muuxannoo ta'een uumame!",
    error: "Dogoggora hin eegamne dhagahame. Irra deebi'ii yaali.",
    validation: {
      fullNameRequired: "Maqaa guutuu barbaachisa",
      fullNameInvalid: "Maqaa guutuun qubee fi iddoo qofa qabaachuu qaba",
      usernameRequired: "Maqaa fayyadamaa barbaachisa",
      emailInvalid: "Imeelii sirrii miti",
      emailRequired: "Imeelii barbaachisa",
      passwordRequired: "Jecha iccitii barbaachisa",
    },
  },
  ti: {
    title: "ኣስተዳደርቲ ምፍጣር",
    subtitle: "ሓድሽ ኣስተዳደርቲ ምፍጣር",
    fullName: "ምሉእ ስም",
    username: "ስም ተጠቃሚ",
    email: "ኢመይል",
    password: "ቃል ምልጃ",
    createButton: "ሓድሽ ኣስተዳደርቲ ምፍጣር",
    success: "ኣስተዳደርቲ ብትኽክል ተፈጢሩ!",
    error: "ዘይተጸበናይ ጌጋ ተፈጢሩ። በጃኹም ደጊምኩም ፈትኑ።",
    validation: {
      fullNameRequired: "ምሉእ ስም የድሊ",
      fullNameInvalid: "ምሉእ ስም ፊደላትን ስፍሓትን ጥራይ ክህልዎ ኣለዎ",
      usernameRequired: "ስም ተጠቃሚ የድሊ",
      emailInvalid: "ዘይቅኑዕ ኢመይል",
      emailRequired: "ኢመይል የድሊ",
      passwordRequired: "ቃል ምልጃ የድሊ",
    },
  },
};

const AddAdmin = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { language } = useLanguage();

  const navigation = useNavigate();
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const token = localStorage.getItem("token");

      // Send a POST request to create a new admin
      const response = await axios.post(`${baseUrl}/api/admin/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Use the success message from the backend response
      toast.success(
        response.data.message || addAdminTranslations[language].success
      );

      resetForm();
      navigation(-1);
    } catch (error) {
      console.error(
        "Error creating admin:",
        error.response?.data || error.message
      );

      // Use the error message from the backend response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(addAdminTranslations[language].error);
      }
    }
  };

  // Validation Schema with translated messages
  const checkoutSchema = yup.object().shape({
    fullName: yup
      .string()
      .required(addAdminTranslations[language].validation.fullNameRequired)
      .matches(
        /^[A-Za-z\s]+$/,
        addAdminTranslations[language].validation.fullNameInvalid
      ),
    username: yup
      .string()
      .required(addAdminTranslations[language].validation.usernameRequired),
    email: yup
      .string()
      .email(addAdminTranslations[language].validation.emailInvalid)
      .required(addAdminTranslations[language].validation.emailRequired),
    password: yup
      .string()
      .required(addAdminTranslations[language].validation.passwordRequired),
    zone: yup
      .string()
      .required(addAdminTranslations[language].validation.zoneRequired),
  });

  // Initial Values with zone included
  const initialValues = {
    fullName: "",
    username: "",
    email: "",
    password: "",
    zone: "",
  };

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

      <Header
        title={addAdminTranslations[language].title}
        subtitle={addAdminTranslations[language].subtitle}
      />

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
              {/* Full Name Field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={addAdminTranslations[language].fullName}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Username Field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={addAdminTranslations[language].username}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Email Field */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={addAdminTranslations[language].email}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label={addAdminTranslations[language].password}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Zone Field */}
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 4" }}
                error={!!touched.zone && !!errors.zone}
              >
                <InputLabel>{addAdminTranslations[language].zone}</InputLabel>
                <Select
                  name="zone"
                  value={values.zone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label={addAdminTranslations[language].zone}
                >
                  {ethiopianZones["Oromia"].map((zone) => (
                    <MenuItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </MenuItem>
                  ))}
                </Select>
                {touched.zone && errors.zone && (
                  <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                    {errors.zone}
                  </Box>
                )}
              </FormControl>
            </Box>

            {/* Submit Button */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{
                  "&:hover": {
                    transform: "none",
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                {addAdminTranslations[language].createButton}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddAdmin;
