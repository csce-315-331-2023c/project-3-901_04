import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom';

// Import components and pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Customer from './pages/Customer';
import Cashier from './pages/Cashier';
import Manager from './pages/Manager';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AccessibilityWidget from './components/AccessibilityWidget';
import ManagerReports from './pages/ManagerReports.jsx';

// Import css for the app
import './styles/navbar.css';
import './App.css';

// Protected Route Component
// const PrivateRoute = ({ children }) => {
//   const checkAuth = () => {
//     const token = localStorage.getItem('token');
//     return !!token;
//   };

//   return checkAuth() ? children : <Navigate to="/" />;
// };

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  document.title = 'Mo\'s Irish Pub';

  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Wrap the protected routes in a single element */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="customer" element={<Customer />} />
            <Route path="cashier" element={<Cashier />} />
            <Route path="manager" element={<Manager />} />
            <Route path="managerReports" element={<ManagerReports />} />
          </Route>
        </Routes>
        <AccessibilityWidget isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </Router>
    </div>
  );
}

// Protected Layout Component
function ProtectedLayout() {
  const location = useLocation();
  const showNavbar = !['/', '/signup'].includes(location.pathname);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  if (!checkAuth()) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="main-content">
        <Outlet /> {/* Render child routes here */}
      </div>
    </>
  );
}

export default App;
