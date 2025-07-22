import './App.css';
import Login from './Login';
import StockUpload from './stockupload';
import Home from './Home';
import MarketWatch from './MarketWatch';
import CustomerPortfolio from './CustomerPortfolio';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import Menu from './menu.jsx';

function MenuButton() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-icon" onClick={() => setOpen(o => !o)} aria-label="Open menu">
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
      </button>
      {open && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  // Hide Menu on login page (path is '/')
  const hideMenu = location.pathname === '/';
  return (
    <div className="app-background">
      <div className="header">
        <h1>PSX Trade Hub</h1>
        {token && user && <MenuButton />}
        <hr />
      </div>
      {!hideMenu && <Menu />}
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/upload" element={<AdminRoute><StockUpload /></AdminRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><MarketWatch /></ProtectedRoute>} />
        <Route path="/marketwatch" element={<ProtectedRoute><MarketWatch /></ProtectedRoute>} />
        <Route path="/customer-portfolio" element={<ProtectedRoute><CustomerPortfolio /></ProtectedRoute>} />
        <Route path="*" element={<LoginWrapper />} />
      </Routes>
    </div>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      navigate('/home');
    }
  }, [navigate]);
  return (
    <div className="login-container">
      <div className="login-form">
        <Login />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (token && user) {
    return children;
  }
  return <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (token && user && user.role === 'admin') {
    return children;
  }
  return <Navigate to="/" replace />;
}

export default App;
