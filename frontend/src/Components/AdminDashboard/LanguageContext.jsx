import React, { createContext, useState, useContext } from "react";

// Create the context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language is English

  // Function to change the language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    sessionStorage.setItem("preferredLanguage", lang); // Save the selected language in session storage
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the LanguageContext
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
