import './App.css';
import Login from './Login';
import StockUpload from './stockupload';
import Home from './Home';
import MarketWatch from './MarketWatch';
import CustomerPortfolio from './CustomerPortfolio'; // Import the new component
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, NavLink } from 'react-router-dom';
import React from 'react';

function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const showNav = token && user;
  return (
    <Router>
      <div className="app-background">
        <div className="header">
          <h1>PSX Trade Hub</h1>
          {token && user && <LogoutButton />}
          <hr />
        </div>
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
    </Router>
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
