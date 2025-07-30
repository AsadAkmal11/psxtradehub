import './App.css';
import Login from './Login';
import StockUpload from './stockupload';
import Home from './Home';
import MarketWatch from './MarketWatch';
import CustomerPortfolio from './CustomerPortfolio';
import Portfolio from './Portfolio.jsx';
import Country from './Country';
import Currency from './Currency';
import Customers from './Customers';
import Exchange from './Exchange';
import Order from './Order';
import OrdersList from './OrdersList';
import EChartsTest from './EChartsTest';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Window from './Window.jsx';
import WindowManager from './components/WindowManager';
import { FaBars, FaUpload, FaChartLine, FaShoppingCart, FaListAlt, FaUsers, FaGlobe, FaMoneyBillWave, FaUserFriends, FaExchangeAlt } from 'react-icons/fa';
import GeminiChat from "./gemini.jsx";
import { WINDOW_CONFIG } from './config/windowConfig';
import './components/WindowManager.css';

// Component mapping for dynamic creation
const COMPONENT_MAP = {
  StockUpload,
  MarketWatch,
  CustomerPortfolio,
  Portfolio,
  Country,
  Currency,
  Customers,
  Exchange,
  Order,
  OrdersList,
  EChartsTest
};

function App() {
  return (
    <div>
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

function AppContent() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [openWindows, setOpenWindows] = useState({});
  const [windowStates, setWindowStates] = useState({});
  const [menuState, setMenuState] = useState('minimized');
  const [activeWindow, setActiveWindow] = useState(null);

  if (!token || !user) {
    return <LoginWrapper onLogin={() => {
      setOpenWindows({});
      setMenuState('minimized');
      navigate('/home');
    }} />;
  }

  const handleMenuOpen = () => setMenuState('normal');
  const handleMenuClose = () => setMenuState('minimized');
  
  const handleOpenWindow = (key) => {
    setOpenWindows(prev => ({ ...prev, [key]: true }));
    setWindowStates((ws) => ({ ...ws, [key]: 'normal' }));
    setActiveWindow(key);
    setMenuState('minimized');
  };
  
  const handleMinimize = (key) => setWindowStates((ws) => ({ ...ws, [key]: 'minimized' }));
  const handleMaximize = (key) => setWindowStates((ws) => ({ ...ws, [key]: ws[key] === 'maximized' ? 'normal' : 'maximized' }));
  const handleRestore = (key) => setWindowStates((ws) => ({ ...ws, [key]: 'normal' }));
  
  const handleClose = (key) => {
    setOpenWindows(prev => {
      const newWindows = { ...prev };
      delete newWindows[key];
      return newWindows;
    });
    setWindowStates((ws) => {
      const newStates = { ...ws };
      delete newStates[key];
      return newStates;
    });
    if (activeWindow === key) {
      setActiveWindow(null);
    }
  };

  const handleWindowActivate = (key) => {
    setActiveWindow(key);
  };

  const handleWindowResize = (key, newSize) => {
    // Handle window resize if needed
    console.log(`Window ${key} resized to:`, newSize);
  };

  const menuLinks = [
    ...(user && user.role === 'admin' ? [{ key: 'upload', label: 'Stock Upload', icon: FaUpload }] : []),
    { key: 'marketwatch', label: 'Market Watch', icon: FaChartLine },
    { key: 'order', label: 'Buy/Sell Order', icon: FaShoppingCart },
    { key: 'orderslist', label: 'Orders List', icon: FaListAlt },
    { key: 'customer-portfolio', label: 'Customer', icon: FaUsers },
    { key: 'portfolio', label: 'Portfolio', icon: FaUsers },
    { key: 'country', label: 'Country', icon: FaGlobe },
    { key: 'currency', label: 'Currency', icon: FaMoneyBillWave },
    { key: 'customers', label: 'Customers Information', icon: FaUserFriends },
    { key: 'exchange', label: 'Exchange', icon: FaExchangeAlt },
    { key: 'EChartsTest', label: 'ECharts Test', icon: FaChartLine }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setOpenWindows({});
    setMenuState('minimized');
    navigate('/');
  };

  return (
    <div className="app-background">
      <div className="header">
        <div className="header-row">
          <button className="hamburger-icon-left" onClick={handleMenuOpen}>
            <FaBars size={28} color="#F0B90B" />
          </button>
          <h1 className="header-title">FinDexPro</h1>
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
        <Home onOpenWindow={handleOpenWindow} />
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
          style={{
            width: menuState === 'maximized' ? '100vw' : '800px',
            minWidth: '600px',
            maxWidth: '90vw'
          }}
        >
          <nav className="overlay-nav" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            padding: '24px',
            maxWidth: '100%',
            '@media (max-width: 768px)': {
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              padding: '16px'
            }
          }}>
            {menuLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.key}
                  className="nav-link"
                  style={{ 
                    padding: '16px 20px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    border: '2px solid #F0B90B',
                    backgroundColor: 'rgba(35, 38, 47, 0.98)',
                    color: '#F0B90B',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#F0B90B';
                    e.target.style.color = '#181A20';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(240, 185, 11, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(35, 38, 47, 0.98)';
                    e.target.style.color = '#F0B90B';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                  onClick={() => handleOpenWindow(item.key)}
                >
                  {IconComponent && <IconComponent size={24} />}
                  <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </Window>
      )}
      <WindowManager
        openWindows={openWindows}
        windowStates={windowStates}
        onWindowClose={handleClose}
        onWindowMinimize={handleMinimize}
        onWindowMaximize={handleMaximize}
        onWindowRestore={handleRestore}
        onWindowResize={handleWindowResize}
        activeWindow={activeWindow}
        onWindowActivate={handleWindowActivate}
        user={user}
      />

        <div className="taskbar">
          {Object.entries(windowStates).map(([key, state]) => (
            state === "minimized" && (
              <button
                key={key}
                className="taskbar-icon"
                onClick={() => {
                  setWindowStates((ws) => ({ ...ws, [key]: 'normal' }));
                  setActiveWindow(key);
                }}
              >
                📄 {WINDOW_CONFIG[key].title}
              </button>
            )
          ))}
        </div>

      <GeminiChat />
      
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
