import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import LoginRegister from "./components/LoginRegister/LoginRegister";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import { LanguageProvider } from "./components/AdminDashboard/LanguageContext";
import AddAdmin from "./components/AdminDashboard/scenes/addAdmin";

function App() {
  // Helper function to check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists, false otherwise
  };

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route
            path="/admin"
            element={
              isAuthenticated() ? <AdminDashboard /> : <Navigate to="/" />
            }
          />
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* <Route path="/edit-profile" element={<EditProfile />} /> */}
          <Route path="/add-admin" element={<AddAdmin />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
