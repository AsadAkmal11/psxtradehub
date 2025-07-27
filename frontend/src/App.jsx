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
import Order from './Order';
import OrdersList from './OrdersList';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Window from './Window.jsx';
import { FaBars, FaUpload, FaChartLine, FaShoppingCart, FaListAlt, FaUsers, FaGlobe, FaMoneyBillWave, FaUserFriends, FaExchangeAlt } from 'react-icons/fa';

const WINDOW_CONFIG = {
  upload: { title: 'Stock Upload', component: StockUpload, admin: true },
  marketwatch: { title: 'Market Watch', component: MarketWatch },
  'customer-portfolio': { title: 'Customer/Portfolio', component: CustomerPortfolio },
  country: { title: 'Country', component: Country },
  currency: { title: 'Currency', component: Currency },
  customers: { title: 'Customers Information', component: Customers },
  exchange: { title: 'Exchange', component: Exchange },
  order: { title: 'Buy/Sell Order', component: Order },
  orderslist: { title: 'Orders List', component: OrdersList },
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
    ...(user && user.role === 'admin' ? [{ key: 'upload', label: 'Stock Upload', icon: FaUpload }] : []),
    { key: 'marketwatch', label: 'Market Watch', icon: FaChartLine },
    { key: 'order', label: 'Buy/Sell Order', icon: FaShoppingCart },
    { key: 'orderslist', label: 'Orders List', icon: FaListAlt },
    { key: 'customer-portfolio', label: 'Customer/Portfolio', icon: FaUsers },
    { key: 'country', label: 'Country', icon: FaGlobe },
    { key: 'currency', label: 'Currency', icon: FaMoneyBillWave },
    { key: 'customers', label: 'Customers Information', icon: FaUserFriends },
    { key: 'exchange', label: 'Exchange', icon: FaExchangeAlt },
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
      {openWindow && (
        <Window
          title={WINDOW_CONFIG[openWindow].title}
          windowState={windowStates[openWindow] || 'normal'}
          onMinimize={() => handleMinimize(openWindow)}
          onMaximize={() => handleMaximize(openWindow)}
          onRestore={() => handleMaximize(openWindow)}
          onClose={() => handleClose(openWindow)}
          draggable={true}
        >
          <div
            style={{
              display: windowStates[openWindow] === 'minimized' ? 'none' : 'block',
              height: '100%',
            }}
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
          </div>
        </Window>
      )}

        <div className="taskbar">
        {Object.entries(windowStates).map(([key, state]) => (
        state === "minimized" && (
        <button
        key={key}
        className="taskbar-icon"
        onClick={() => {
          setWindowStates((ws) => ({ ...ws, [key]: 'normal' }));
          setOpenWindow(key);
        }}
      >
        📄 {WINDOW_CONFIG[key].title}
      </button>
    )
  ))}
</div>

      
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
