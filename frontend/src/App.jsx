import './App.css';
import Login from './Login';
import StockUpload from './stockupload';
import Home from './Home';
import MarketWatch from './MarketWatch';
import CustomerPortfolio from './CustomerPortfolio';
import Country from './Country';
import Currency from './Currency';
import Customers from './Customers';
import Exchange from './Exchange';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Window from './Window.jsx';
import { FaBars } from 'react-icons/fa';

const WINDOW_CONFIG = {
  upload: { title: 'Stock Upload', component: StockUpload, admin: true },
  marketwatch: { title: 'Market Watch', component: MarketWatch },
  'customer-portfolio': { title: 'Customer/Portfolio', component: CustomerPortfolio },
  country: { title: 'Country', component: Country },
  currency: { title: 'Currency', component: Currency },
  customers: { title: 'Customers Information', component: Customers },
  exchange: { title: 'Exchange', component: Exchange },
};

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
  const navigate = useNavigate();
  const [openWindow, setOpenWindow] = useState(null);
  const [windowStates, setWindowStates] = useState({});
  const [menuState, setMenuState] = useState('minimized');

  if (!token || !user) {
    return <LoginWrapper onLogin={() => {
      setOpenWindow(null);
      setMenuState('minimized');
      navigate('/home');
    }} />;
  }

  const handleMenuOpen = () => setMenuState('normal');
  const handleMenuClose = () => setMenuState('minimized');
  const handleOpenWindow = (key) => {
    setOpenWindow(key);
    setWindowStates((ws) => ({ ...ws, [key]: 'normal' }));
    setMenuState('minimized');
  };
  const handleMinimize = (key) => setWindowStates((ws) => ({ ...ws, [key]: 'minimized' }));
  const handleMaximize = (key) => setWindowStates((ws) => ({ ...ws, [key]: ws[key] === 'maximized' ? 'normal' : 'maximized' }));
  const handleClose = (key) => {
    setWindowStates((ws) => ({ ...ws, [key]: undefined }));
    setOpenWindow(null);
  };

  const menuLinks = [
    ...(user && user.role === 'admin' ? [{ key: 'upload', label: 'Stock Upload' }] : []),
    { key: 'marketwatch', label: 'Market Watch' },
    { key: 'customer-portfolio', label: 'Customer/Portfolio' },
    { key: 'country', label: 'Country' },
    { key: 'currency', label: 'Currency' },
    { key: 'customers', label: 'Customers Information' },
    { key: 'exchange', label: 'Exchange' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setOpenWindow(null);
    setMenuState('minimized');
    navigate('/');
  };

  return (
    <div className="app-background">
      <div className="header">
        <div className="header-row">
          <button className="hamburger-icon left" onClick={handleMenuOpen}>
            <FaBars size={28} color="#F0B90B" />
          </button>
          <h1 className="header-title">PSX Trade Hub</h1>
          <button
            className="logout-btn" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <hr />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Home />
      </div>
      {menuState !== 'minimized' && (
        <Window
          title="Menu"
          windowState={menuState}
          onMinimize={() => setMenuState('minimized')}
          onMaximize={() => setMenuState(menuState === 'maximized' ? 'normal' : 'maximized')}
          onRestore={() => setMenuState('normal')}
          onClose={handleMenuClose}
          draggable={false}
        >
          <nav className="overlay-nav">
            {menuLinks.map((item) => (
              <button
                key={item.key}
                className="nav-link"
                style={{ marginBottom: 12, width: '100%', textAlign: 'left' }}
                onClick={() => handleOpenWindow(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </Window>
      )}
      {openWindow && windowStates[openWindow] !== 'minimized' && (
        <Window
          title={WINDOW_CONFIG[openWindow].title}
          windowState={windowStates[openWindow] || 'normal'}
          onMinimize={() => handleMinimize(openWindow)}
          onMaximize={() => handleMaximize(openWindow)}
          onRestore={() => handleMaximize(openWindow)}
          onClose={() => handleClose(openWindow)}
          draggable={true}
        >
          {(!WINDOW_CONFIG[openWindow].admin || (user && user.role === 'admin')) ? (
            React.createElement(WINDOW_CONFIG[openWindow].component, {
              onBack: () => {
                setOpenWindow(null);
                setMenuState('normal');
              }
            })
          ) : (
            <div style={{ padding: 32, color: 'red' }}>You do not have access to this window.</div>
          )}
        </Window>
      )}
    </div>
  );
}

function LoginWrapper({ onLogin }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      if (onLogin) onLogin();
      navigate('/home', { replace: true });
    }
  }, [navigate, onLogin]);
  return (
    <div className="login-container">
      <div className="login-form">
        <Login />
      </div>
    </div>
  );
}

export default App;
