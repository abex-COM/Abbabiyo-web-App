import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../LanguageContext";

// Translation dictionary
const farmerTranslations = {
  en: {
    title: "CREATE FARMER",
    subtitle: "Create a New Farmer Profile",
    name: "Full Name",
    phoneNumber: "Phone Number",
    password: "Password",
    region: "Region",
    zone: "Zone",
    woreda: "Woreda",
    createButton: "Create New Farmer",
    success: "Farmer created successfully!",
    error: "Failed to create farmer. Please try again.",
    validation: {
      nameRequired: "Full Name is required",
      nameInvalid:
        "Full Name must contain only alphabetic characters and spaces",
      phoneNumberRequired: "Phone Number is required",
      passwordRequired: "Password is required",
      regionRequired: "Region is required",
      zoneRequired: "Zone is required",
      woredaRequired: "Woreda is required",
    },
  },
  am: {
    title: "ገበሬ ይፍጠሩ",
    subtitle: "አዲስ የገበሬ መግለጫ ይፍጠሩ",
    name: "ሙሉ ስም",
    phoneNumber: "ስልክ ቁጥር",
    password: "የይለፍ ቃል",
    region: "ክልል",
    zone: "ዞን",
    woreda: "ወረዳ",
    createButton: "አዲስ ገበሬ ይፍጠሩ",
    success: "ገበሬ በተሳካ ሁኔታ ተፈጥሯል!",
    error: "ገበሬ ለመፍጠር አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    validation: {
      nameRequired: "ሙሉ ስም ያስፈልጋል",
      nameInvalid: "ሙሉ ስም የሆኑ ፊደላትና ቦታዎች ብቻ ሊኖሩት ይገባል",
      phoneNumberRequired: "ስልክ ቁጥር ያስፈልጋል",
      passwordRequired: "የይለፍ ቃል ያስፈልጋል",
      regionRequired: "ክልል ያስፈልጋል",
      zoneRequired: "ዞን ያስፈልጋል",
      woredaRequired: "ወረዳ ያስፈልጋል",
    },
  },
  om: {
    title: "QEERANSAA UUMUU",
    subtitle: "Qeeransaa haaraa uumuu",
    name: "Maqaa Guutuu",
    phoneNumber: "Lakkoofsa Bilbilaa",
    password: "Jecha Iccitii",
    region: "Naannoo",
    zone: "Ganda",
    woreda: "Aanaa",
    createButton: "Qeeransaa Haaraa Uumuu",
    success: "Qeeransichi milkaa’inaan uumame!",
    error: "Qeeransaa uumuu hindandeenye. Irra deebi’ii yaali.",
    validation: {
      nameRequired: "Maqaa guutuu barbaachisa",
      nameInvalid: "Maqaan qubee fi iddoo qofa qabaachuu qaba",
      phoneNumberRequired: "Lakkoofsi bilbilaa barbaachisa",
      passwordRequired: "Jecha iccitii barbaachisa",
      regionRequired: "Naannoo barbaachisa",
      zoneRequired: "Ganda barbaachisa",
      woredaRequired: "Aanaa barbaachisa",
    },
  },
  ti: {
    title: "ገበራዊ ምፍጣር",
    subtitle: "ሓድሽ ገበራዊ ፕሮፋይል ምፍጣር",
    name: "ምሉእ ስም",
    phoneNumber: "ቁፅሪ ስልኪ",
    password: "ቃል ምልጃ",
    region: "ክልል",
    zone: "ዞን",
    woreda: "ወረዳ",
    createButton: "ሓድሽ ገበራዊ ምፍጣር",
    success: "ገበራዊ ብትኽክል ተፈጢሩ!",
    error: "ገበራዊ ክፍጠር ኣይከኣለን። በጃኹም ደጊምኩም ፈትኑ።",
    validation: {
      nameRequired: "ምሉእ ስም የድሊ",
      nameInvalid: "ምሉእ ስም ፊደላትን ስፍሓትን ጥራይ ክህልዎ ኣለዎ",
      phoneNumberRequired: "ቁፅሪ ስልኪ የድሊ",
      passwordRequired: "ቃል ምልጃ የድሊ",
      regionRequired: "ክልል የድሊ",
      zoneRequired: "ዞን የድሊ",
      woredaRequired: "ወረዳ የድሊ",
    },
  },
};

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { language } = useLanguage();

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const dataToSend = {
        name: values.name,
        phoneNumber: values.phoneNumber,
        password: values.password,
        profilePicture: "", // Not used in form currently
        location: {
          region: values.region,
          zone: values.zone,
          woreda: values.woreda,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        dataToSend
      );

      console.log("Farmer created:", response.data.newUser);
      toast.success(farmerTranslations[language].success);
      resetForm();
    } catch (error) {
      console.error(
        "Error creating farmer:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "An error occurred");
      resetForm();
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^(0\d{9}|\+251\d{9})$/,
        "Phone number must start with 0 or +251 and have 9 digits after"
      ),

    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    region: yup.string().required("Region is required"),
    zone: yup.string().required("Zone is required"),
    woreda: yup.string().required("Woreda is required"),
  });

  const initialValues = {
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    region: "",
    zone: "",
    woreda: "",
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title={farmerTranslations[language].title}
        subtitle={farmerTranslations[language].subtitle}
      />

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label={farmerTranslations[language].name}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              margin="normal"
            />

            <TextField
              fullWidth
              variant="outlined"
              label={farmerTranslations[language].phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phoneNumber}
              error={touched.phoneNumber && Boolean(errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
              margin="normal"
            />

            <TextField
              fullWidth
              variant="outlined"
              type="password"
              label={farmerTranslations[language].password}
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              margin="normal"
            />

            <TextField
              fullWidth
              variant="outlined"
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              margin="normal"
            />

            <TextField
              fullWidth
              variant="outlined"
              label={farmerTranslations[language].region}
              name="region"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.region}
              error={touched.region && Boolean(errors.region)}
              helperText={touched.region && errors.region}
              margin="normal"
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Zone"
              name="zone"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.zone}
              error={touched.zone && Boolean(errors.zone)}
              helperText={touched.zone && errors.zone}
              margin="normal"
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Woreda"
              name="woreda"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.woreda}
              error={touched.woreda && Boolean(errors.woreda)}
              helperText={touched.woreda && errors.woreda}
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {farmerTranslations[language].createButton}
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
