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
import ManagerOrders from './pages/ManagerOrders.jsx';
import AddMenuItem from './pages/AddMenuItem';
import AdministratorTools from './pages/AdministratorTools.jsx';


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
  const [isHighContrast, setHighContrast] = useState(false);

  document.title = 'Mo\'s Irish Pub';

  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode) {
      setHighContrast(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dark-mode', JSON.stringify(isHighContrast));
  }, [isHighContrast]);

  return (
    <div className={isHighContrast ? "dark-mode" : ""}>
      <Router>
        <Routes>
          <Route path="/" element={<Login isHighContrast={isHighContrast} />} />
          <Route path="/signup" element={<Signup isHighContrast={isHighContrast} />} />
          {/* Wrap the protected routes in a single element */}
          <Route path="/" element={<ProtectedLayout isHighContrast={isHighContrast} />}>
            <Route path="home" element={<Home isHighContrast={isHighContrast} />} />
            <Route path="menu" element={<Menu isHighContrast={isHighContrast} />} />
            <Route path="customer" element={<Customer isHighContrast={isHighContrast}  />} />
            <Route path="cashier" element={<Cashier isHighContrast={isHighContrast} />} />
            <Route path="manager" element={<Manager isHighContrast={isHighContrast}  />} />
            <Route path="managerReports" element={<ManagerReports isHighContrast={isHighContrast}  />} />
            <Route path="managerOrders" element={<ManagerOrders isHighContrast={isHighContrast} />} />
            <Route path="/add-menu-item" element={<AddMenuItem isHighContrast={isHighContrast}  />} />
            <Route path="/admin-tools" element={<AdministratorTools isHighContrast={isHighContrast} />} />

          </Route>
        </Routes>
        <AccessibilityWidget isHighContrast={isHighContrast} setHighContrast={setHighContrast} />
      </Router>
    </div>
  );
}

// Protected Layout Component
function ProtectedLayout({isHighContrast}) {
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
