import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../LanguageContext";
import ethiopianRegions, {
  ethiopianWoredas,
  ethiopianZones,
} from "./../../../../constants/ethiopianData";
import { useEffect, useState } from "react";
import useUserData from "../../../../hooks/useUserData";
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
    createButton: "Register",
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
  // const userZone = JSON.parse(atob(token.split(".")[1])).zone;
  // const userrole = JSON.parse(atob(token.split(".")[1])).role;
  const { language } = useLanguage();
  const user = useUserData();
  const [selectedRegion, setSelectedRegion] = useState("Oromia");
  const [selectedZone, setSelectedZone] = useState("");
  const regions = ethiopianRegions;
  const zones = selectedRegion ? ethiopianZones[selectedRegion] || [] : [];
  const woredas = selectedZone ? ethiopianWoredas[selectedZone] || [] : [];
  const initialValues = {
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    region: "Oromia",
    zone: user?.role === "admin" ? user.zone : "",
    woreda: "",
  };
  // Decode token to get user ID
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const dataToSend = {
        name: values.name,
        phoneNumber: values.phoneNumber,
        password: values.password,
        profilePicture: "",
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

      toast.success(farmerTranslations[language].success);
      resetForm();
      setSelectedRegion("");
      setSelectedZone("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || farmerTranslations[language].error
      );
    }
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required(farmerTranslations[language].validation.nameRequired),
    phoneNumber: yup
      .string()
      .required(farmerTranslations[language].validation.phoneNumberRequired)
      .matches(
        /^(0\d{9}|\+251\d{9})$/,
        "Phone number must start with 0 or +251 and have 9 digits after"
      ),
    password: yup
      .string()
      .required(farmerTranslations[language].validation.passwordRequired),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    region: yup
      .string()
      .required(farmerTranslations[language].validation.regionRequired),
    zone: yup
      .string()
      .required(farmerTranslations[language].validation.zoneRequired),
    woreda: yup
      .string()
      .required(farmerTranslations[language].validation.woredaRequired),
  });

  useEffect(() => {
    if (user?.role === "admin" && user?.zone) {
      setSelectedZone(user.zone);
    }
  }, [user]);
  return (
    <Box m="20px" height="1000px">
      <ToastContainer />
      <Header
        title={farmerTranslations[language].title}
        subtitle={farmerTranslations[language].subtitle}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
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

            {/* Region Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>{farmerTranslations[language].region}</InputLabel>
              <Select
                name="region"
                value={values.region}
                onChange={(e) => {
                  const selected = e.target.value;
                  setFieldValue("region", selected);
                  setSelectedRegion(selected);
                  setSelectedZone("");
                  setFieldValue("zone", "");
                  setFieldValue("woreda", "");
                }}
                disabled
              >
                {regions.map((region) => (
                  <MenuItem key={region.value} value={region.value}>
                    {region.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Zone Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>{farmerTranslations[language].zone}</InputLabel>
              <Select
                name="zone"
                value={values.zone}
                onChange={(e) => {
                  const selected = e.target.value;
                  setFieldValue("zone", selected);
                  setSelectedZone(selected);
                  setFieldValue("woreda", "");
                }}
                disabled={user?.role === "admin" ? true : !selectedRegion}
              >
                {zones.map((zone) => (
                  <MenuItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Woreda Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel>{farmerTranslations[language].woreda}</InputLabel>
              <Select
                name="woreda"
                value={values.woreda}
                onChange={handleChange}
                disabled={user?.role === "admin" ? false : !selectedZone}
              >
                {woredas.map((woreda) => (
                  <MenuItem key={woreda.value} value={woreda.value}>
                    {woreda.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 2, width: "300px" }}
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
