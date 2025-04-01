import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from "../../LanguageContext";

// Translation dictionary
const farmerTranslations = {
  en: {
    title: "CREATE FARMER",
    subtitle: "Create a New Farmer Profile",
    fullName: "Full Name",
    username: "Username",
    email: "Email",
    password: "Password",
    farmName: "Farm Name",
    location: "Location",
    crops: "Crops (Comma-separated)",
    createButton: "Create New Farmer",
    success: "Farmer created successfully!",
    error: "Failed to create farmer. Please try again.",
    validation: {
      fullNameRequired: "Full Name is required",
      fullNameInvalid: "Full Name must contain only alphabetic characters and spaces",
      usernameRequired: "Username is required",
      emailInvalid: "Invalid email",
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      farmNameRequired: "Farm Name is required",
      locationRequired: "Location is required",
      cropsRequired: "Crops are required"
    }
  },
  am: {
    title: "ገበሬ ይፍጠሩ",
    subtitle: "አዲስ የገበሬ መግለጫ ይፍጠሩ",
    fullName: "ሙሉ ስም",
    username: "የተጠቃሚ ስም",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    farmName: "የግብርና ስም",
    location: "ቦታ",
    crops: "የተለማመዱ እምቦታዎች (በነጠላ ሰረዝ የተለዩ)",
    createButton: "አዲስ ገበሬ ይፍጠሩ",
    success: "ገበሬ በተሳካ ሁኔታ ተፈጥሯል!",
    error: "ገበሬ ለመፍጠር አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    validation: {
      fullNameRequired: "ሙሉ ስም ያስፈልጋል",
      fullNameInvalid: "ሙሉ ስም የሆሄያት ቁምፊዎችና ቦታዎች ብቻ ሊኖሩት ይገባል",
      usernameRequired: "የተጠቃሚ ስም ያስፈልጋል",
      emailInvalid: "ልክ ያልሆነ ኢሜይል",
      emailRequired: "ኢሜይል ያስፈልጋል",
      passwordRequired: "የይለፍ ቃል ያስፈልጋል",
      farmNameRequired: "የግብርና ስም ያስፈልጋል",
      locationRequired: "ቦታ ያስፈልጋል",
      cropsRequired: "የተለማመዱ እምቦታዎች ያስፈልጋሉ"
    }
  },
  om: {
    title: "QEERANSAA UUMUU",
    subtitle: "Qeeransaa haaraa uumuu",
    fullName: "Maqaa Guutuu",
    username: "Maqaa Fayyadamaa",
    email: "Imeelii",
    password: "Jecha Iccitii",
    farmName: "Maqaa Qonnaa",
    location: "Bakka",
    crops: "Mala Qonnaa (Walitti qoodaman)",
    createButton: "Qeeransaa Haaraa Uumuu",
    success: "Qeeransichii muuxannoo ta'een uumame!",
    error: "Qeeransaa uumuu hindandeenye. Irra deebi'ii yaali.",
    validation: {
      fullNameRequired: "Maqaa guutuu barbaachisa",
      fullNameInvalid: "Maqaa guutuun qubee fi iddoo qofa qabaachuu qaba",
      usernameRequired: "Maqaa fayyadamaa barbaachisa",
      emailInvalid: "Imeelii sirrii miti",
      emailRequired: "Imeelii barbaachisa",
      passwordRequired: "Jecha iccitii barbaachisa",
      farmNameRequired: "Maqaa qonnaa barbaachisa",
      locationRequired: "Bakka barbaachisa",
      cropsRequired: "Mala qonnaa barbaachisa"
    }
  },
  ti: {
    title: "ገበራዊ ምፍጣር",
    subtitle: "ሓድሽ ገበራዊ ምፍጣር",
    fullName: "ምሉእ ስም",
    username: "ስም ተጠቃሚ",
    email: "ኢመይል",
    password: "ቃል ምልጃ",
    farmName: "ስም ሕርሻ",
    location: "ቦታ",
    crops: "ዝራውቲ (ብነጠላ ሰረዝ ዝተፈላለዩ)",
    createButton: "ሓድሽ ገበራዊ ምፍጣር",
    success: "ገበራዊ ብትኽክል ተፈጢሩ!",
    error: "ገበራዊ ክፍጠር ኣይከኣለን። በጃኹም ደጊምኩም ፈትኑ።",
    validation: {
      fullNameRequired: "ምሉእ ስም የድሊ",
      fullNameInvalid: "ምሉእ ስም ፊደላትን ስፍሓትን ጥራይ ክህልዎ ኣለዎ",
      usernameRequired: "ስም ተጠቃሚ የድሊ",
      emailInvalid: "ዘይቅኑዕ ኢመይል",
      emailRequired: "ኢመይል የድሊ",
      passwordRequired: "ቃል ምልጃ የድሊ",
      farmNameRequired: "ስም ሕርሻ የድሊ",
      locationRequired: "ቦታ የድሊ",
      cropsRequired: "ዝራውቲ የድሊ"
    }
  }
};

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { language } = useLanguage();

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Convert crops string to array before sending
      const dataToSend = {
        ...values,
        crops: values.crops.split(',').map(item => item.trim())
      };
      
      const response = await axios.post("http://localhost:5000/api/farmers/register", dataToSend);
      console.log("Farmer created:", response.data);
      toast.success(farmerTranslations[language].success);
      resetForm();
    } catch (error) {
      console.error("Error creating farmer:", error.response?.data || error.message);
      toast.error(farmerTranslations[language].error);
      resetForm();
    }
  };

  // Validation Schema with translated messages
  const checkoutSchema = yup.object().shape({
    fullName: yup
      .string()
      .required(farmerTranslations[language].validation.fullNameRequired)
      .matches(/^[A-Za-z\s]+$/, farmerTranslations[language].validation.fullNameInvalid),
    username: yup.string().required(farmerTranslations[language].validation.usernameRequired),
    email: yup.string()
      .email(farmerTranslations[language].validation.emailInvalid)
      .required(farmerTranslations[language].validation.emailRequired),
    password: yup.string().required(farmerTranslations[language].validation.passwordRequired),
    farmName: yup.string().required(farmerTranslations[language].validation.farmNameRequired),
    location: yup.string().required(farmerTranslations[language].validation.locationRequired),
    crops: yup.string().required(farmerTranslations[language].validation.cropsRequired),
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
      
      <Header 
        title={farmerTranslations[language].title} 
        subtitle={farmerTranslations[language].subtitle} 
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
              {/* Full Name */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={farmerTranslations[language].fullName}
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
                label={farmerTranslations[language].username}
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
                label={farmerTranslations[language].email}
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
                label={farmerTranslations[language].password}
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
                label={farmerTranslations[language].farmName}
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
                label={farmerTranslations[language].location}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={!!touched.location && !!errors.location}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Crops */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={farmerTranslations[language].crops}
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
                    transform: "none",
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                {farmerTranslations[language].createButton}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;