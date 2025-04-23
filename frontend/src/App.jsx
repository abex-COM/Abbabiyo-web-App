import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister/LoginRegister';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

function App() {
  // Helper function to check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if token exists, false otherwise
  };

  return (
    <Router>
      <Routes>
        {/* Login/Register Page */}
        <Route path="/" element={<LoginRegister />} />

        {/* Admin Dashboard (Protected Route) */}
        <Route
          path="/admin"
          element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/" />}
        />

        <Route path="/register" element={<LoginRegister />} />
      </Routes>
    </Router>
  );
}

export default App;