import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import defaultProfilePic from "../../assets/default.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../LanguageContext";

// Translation dictionary for the EditProfile
const editProfileTranslations = {
  en: {
    editProfileTitle: "Edit Profile",
    fullNameLabel: "Full Name",
    fullNameError:
      "Full Name must contain only alphabetic characters and spaces",
    emailLabel: "Email",
    emailError: "Invalid email",
    usernameLabel: "Username",
    usernameError: "Username is required",
    passwordLabel: "Password",
    passwordError: "Password must be at least 6 characters",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordError: "Passwords must match",
    saveChanges: "Save Changes",
    fetchError: "Failed to fetch user data",
    loginError: "You must be logged in to update your profile.",
    updateSuccess: "Profile updated successfully",
    updateError: "Failed to update profile.",
  },
  am: {
    editProfileTitle: "መገለጫ አርትዕ",
    fullNameLabel: "ሙሉ ስም",
    fullNameError: "ሙሉ ስም የፊደላት እና ቦታዎች ብቻ ሊይዝ �ለው",
    emailLabel: "ኢሜይል",
    emailError: "ልክ ያልሆነ ኢሜይል",
    usernameLabel: "የተጠቃሚ ስም",
    usernameError: "የተጠቃሚ ስም ያስፈልጋል",
    passwordLabel: "የይለፍ ቃል",
    passwordError: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖሩት ይገባል",
    confirmPasswordLabel: "የይለፍ ቃል አረጋግጥ",
    confirmPasswordError: "የይለፍ ቃሎች መስማማት አለባቸው",
    saveChanges: "ለውጦችን አስቀምጥ",
    fetchError: "የተጠቃሚ መረጃ ማግኘት አልተቻለም",
    loginError: "መገለጫዎን ለመሻሻል መግባት አለብዎት",
    updateSuccess: "መገለጫው በተሳካ ሁኔታ ተዘምኗል",
    updateError: "መገለጫውን ማዘመን አልተቻለም",
  },
  om: {
    editProfileTitle: "Faayilaa Sirreessuu",
    fullNameLabel: "Maqaa Guutuu",
    fullNameError: "Maqaa guutuu qubee fi iddoo qofa qabaachuu qaba",
    emailLabel: "Imeelii",
    emailError: "Imeelii dogoggora",
    usernameLabel: "Maqaa Fayyadamaa",
    usernameError: "Maqaa fayyadamaa barbaachisa",
    passwordLabel: "Jecha Darbii",
    passwordError: "Jecha darbii sadii ol ta'uu qaba",
    confirmPasswordLabel: "Jecha Darbii Mirkaneessuu",
    confirmPasswordError: "Jecha darbii wal qixa ta'uu qaba",
    saveChanges: "Jijjiiramaa Galii",
    fetchError: "Odeeffannoo fayyadamtoota argachuu hindandeenye",
    loginError: "Faayilaa sirreessuuf seenuu qabda",
    updateSuccess: "Faayilaa sirrii ta'een sirreeffame",
    updateError: "Faayilaa sirreessuu hindandeenye",
  },
  ti: {
    editProfileTitle: "መግለጺ ምሕዳስ",
    fullNameLabel: "ምሉእ ስም",
    fullNameError: "ምሉእ ስም ፊደላትን ከፊትን ጥራይ ክህልዎ ኣለዎ",
    emailLabel: "ኢመይል",
    emailError: "ዘይቅኑዕ ኢመይል",
    usernameLabel: "ስም ተጠቃሚ",
    usernameError: "ስም ተጠቃሚ ኣስፈላጢ እዩ",
    passwordLabel: "ቃል ምስጢር",
    passwordError: "ቃል ምስጢር ልዕሊ 6 ፊደላት ክኸውን ኣለዎ",
    confirmPasswordLabel: "ቃል ምስጢር ኣረጋግጽ",
    confirmPasswordError: "ቃላት ምስጢር ተመሳሳሊ ክኸውን ኣለዎ",
    saveChanges: "ለውጥታት ኣስቀምጥ",
    fetchError: "ሓበሬታ ተጠቃሚ ክረኽብ ኣይተኻእለን",
    loginError: "መግለጽካ ንምሕዳስ ክትኣቱ ኣለካ",
    updateSuccess: "መግለጺ ብትኽክል ተሓዲሱ",
    updateError: "መግለጺ ምሕዳስ ኣይተኻእለን",
  },
};

const EditProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { language } = useLanguage(); // Get the current language
  const token = localStorage.getItem("token");

  const userId = JSON.parse(atob(token.split(".")[1])).id;

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/get-admin/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.admin);
      } catch (err) {
        console.error(err);
        toast.error(editProfileTranslations[language].fetchError);
      }
    };

    fetchUserData();
  }, [language, userId]);

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
      toast.error(editProfileTranslations[language].loginError);
      return;
    }

    const userId = JSON.parse(atob(token.split(".")[1])).id;

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
        `http://localhost:5000/api/admin/update-profile/${userId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(editProfileTranslations[language].updateSuccess);

      // Clear the preview after successful upload
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear inputs after successful update
      resetForm();

      // Force a full page reload after 1 second to show updated data everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          editProfileTranslations[language].updateError
      );
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
        {editProfileTranslations[language].editProfileTitle}
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
              (user?.profileImage
                ? `http://localhost:5000/uploads/${user.profileImage}`
                : defaultProfilePic)
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
          fullName: user?.fullName || "",
          username: user?.username || "",
          email: user?.email || "",
          password: "",
          confirmPassword: "",
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
                label={editProfileTranslations[language].fullNameLabel}
                name="fullName"
                value={values.fullName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.fullName && !!errors.fullName}
                helperText={
                  touched.fullName &&
                  errors.fullName &&
                  editProfileTranslations[language].fullNameError
                }
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              <TextField
                fullWidth
                label={editProfileTranslations[language].emailLabel}
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.email && !!errors.email}
                helperText={
                  touched.email &&
                  errors.email &&
                  editProfileTranslations[language].emailError
                }
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              <TextField
                fullWidth
                label={editProfileTranslations[language].usernameLabel}
                name="username"
                value={values.username}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.username && !!errors.username}
                helperText={
                  touched.username &&
                  errors.username &&
                  editProfileTranslations[language].usernameError
                }
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              <TextField
                fullWidth
                label={editProfileTranslations[language].passwordLabel}
                name="password"
                type="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.password && !!errors.password}
                helperText={
                  touched.password &&
                  errors.password &&
                  editProfileTranslations[language].passwordError
                }
                variant="outlined"
                sx={{ backgroundColor: colors.primary[400] }}
              />

              <TextField
                fullWidth
                label={editProfileTranslations[language].confirmPasswordLabel}
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={
                  touched.confirmPassword &&
                  errors.confirmPassword &&
                  editProfileTranslations[language].confirmPasswordError
                }
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
                {editProfileTranslations[language].saveChanges}
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
    .required("required")
    .matches(/^[A-Za-z\s]+$/, "invalid"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid").required("required"),
  password: yup.string().min(6, "too short"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "mismatch"),
});

export default EditProfile;
