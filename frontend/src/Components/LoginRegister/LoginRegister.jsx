import React, { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { FaRegMoon } from "react-icons/fa6";
import { MdOutlineLanguage } from "react-icons/md";
import { TiWeatherSunny } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginRegister.css";
import { tokens } from "./theme";
import axios from "axios";
import baseUrl from "../../baseUrl/baseUrl";
// Translation dictionary
const translations = {
  en: {
    login: "Login",
    username: "Username",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password",
  },
  am: {
    login: "ግባ",
    username: "የተጠቃሚ ስም",
    password: "የይለፍ ቃል",
    rememberMe: "አስታውሰኝ",
    forgotPassword: "የይለፍ ቃል ረሳኽው?",
  },
  om: {
    login: "Seeni",
    username: "Maqaa Fayyadamaa",
    password: "Jecha Darbii",
    rememberMe: "Na Yaadadhu",
    forgotPassword: "Jecha Darbii Dagadhe?",
  },
  ti: {
    login: "እተው",
    username: "ስም ተጠቃሚ",
    password: "መሕለፊ ቃል",
    rememberMe: "ዘክርኒ",
    forgotPassword: "መሕለፊ ቃል ረሲዕካ?",
  },
};

// Language Dropdown Component
const LanguageDropdown = ({
  onLanguageChange,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  colors,
}) => {
  const languages = [
    { code: "en", name: "Eng" },
    { code: "am", name: "Amh" },
    { code: "om", name: "A/O" },
    { code: "ti", name: "Tig" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: "0",
        top: "40px",
        backgroundColor: colors.primary[500],
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: isOpen ? "block" : "none",
        zIndex: 1000,
        color: colors.grey[100],
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {languages.map((lang) => (
        <div
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          style={{
            padding: "10px",
            cursor: "pointer",
            color: colors.grey[100],
            borderBottom: "1px solid #ddd",
            transition: "color 0.3s ease",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#00bfff")}
          onMouseLeave={(e) => (e.target.style.color = colors.grey[100])}
        >
          {lang.name}
        </div>
      ))}
    </div>
  );
};

// Main Login Component
const LoginRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isNightMode, setIsNightMode] = useState(false);
  const [language, setLanguage] = useState("en"); // Default to English
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Initialize language from session storage or browser preference
  useEffect(() => {
    const savedLanguage = sessionStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      const userLanguage = navigator.language.split("-")[0];
      if (translations[userLanguage]) {
        setLanguage(userLanguage);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const res = await axios.post(`${baseUrl}/api/admin/login`, formData);
      // console.log("Login response:", res.data); // Log the response for debugging

      const { token } = res.data;
      localStorage.setItem("token", token);

      // Navigate to the admin page
      navigate("/admin", { replace: true }); // Use replace to prevent re-submission on refresh

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setFormData({
        username: "",
        password: "",
      });
    }
  };

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    sessionStorage.setItem("preferredLanguage", lang);
    setIsLanguageDropdownOpen(false);
  };

  const toggleLanguageDropdown = (isOpen) => {
    setIsLanguageDropdownOpen(isOpen);
  };

  const colors = tokens(isNightMode ? "light" : "dark");

  return (
    <div
      className={`containerbox ${isNightMode ? "day-mode" : "night-mode"}`}
      style={{ backgroundColor: colors.primary[500] }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          className="theme-toggle"
          onClick={toggleTheme}
          style={{ color: colors.grey[100] }}
        >
          {isNightMode ? <TiWeatherSunny /> : <FaRegMoon />}
        </div>
        <div
          onMouseEnter={(e) => {
            toggleLanguageDropdown(true);
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.border = `2px solid ${colors.greenAccent[500]}`;
            e.currentTarget.style.backgroundColor = colors.primary[400];
          }}
          onMouseLeave={(e) => {
            toggleLanguageDropdown(false);
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.border = "none";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          style={{
            cursor: "pointer",
            color: colors.grey[100],
            position: "absolute",
            right: "20px",
            top: "80px",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            transition: "all 0.3s ease",
          }}
        >
          <MdOutlineLanguage size={25} />
          <LanguageDropdown
            onLanguageChange={handleLanguageChange}
            isOpen={isLanguageDropdownOpen}
            onMouseEnter={() => toggleLanguageDropdown(true)}
            onMouseLeave={() => toggleLanguageDropdown(false)}
            colors={colors}
          />
        </div>
      </div>
      <div
        className="wrapper"
        style={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        }}
      >
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>{translations[language].login}</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder={translations[language].username}
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  color: colors.grey[100],
                  border: `1px solid ${colors.grey[100]}`,
                }}
              />
              <FaUser className="icon" style={{ color: colors.grey[100] }} />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder={translations[language].password}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  color: colors.grey[100],
                  border: `1px solid ${colors.grey[100]}`,
                }}
              />
              <FaLock className="icon" style={{ color: colors.grey[100] }} />
            </div>
            <div className="remember-forgot">
              <label htmlFor="">
                <input type="checkbox" /> {translations[language].rememberMe}
              </label>
              <span
                onClick={() => {
                  /* Add your logic here, e.g., open a modal */
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {translations[language].forgotPassword}
              </span>
            </div>
            <button
              type="submit"
              style={{
                color: colors.grey[100],
                border: `1px solid ${colors.grey[100]}`,
              }}
            >
              {translations[language].login}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginRegister;
