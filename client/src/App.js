import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import components and pages
import Navbar from './components/Navbar';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu';
import Customer from './pages/Customer';
import Cashier from './pages/Cashier';
import Manager from './pages/Manager';
import AccessibilityWidget from './components/AccessibilityWidget';

// Import css for navbar
import './styles/navbar.css';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
        <Navbar />
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/manager" element={<Manager />} />
        </Routes>
      </Router>
      <AccessibilityWidget isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </div>
  );
}

export default App;
