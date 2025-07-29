import React, { useState } from 'react';
import OrdersList from './OrdersList';
import Customers from './Customers';
import { FaListAlt, FaUserFriends,FaChartPie } from 'react-icons/fa';
import VirtualPortfolioScreen from './VirtualPortfolioScreen';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('customers'); // only one tab state

  return (
    <div className="home-container">
      <h2 style={{ marginBottom: 24 }}>Welcome, {user?.username || 'User'}!</h2>
      <nav className="home-navbar">
        <button
          className={`home-tab${activeTab === 'customers' ? ' active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <FaUserFriends style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Customers
        </button>
        <button
          className={`home-tab${activeTab === 'orderslist' ? ' active' : ''}`}
          onClick={() => setActiveTab('orderslist')}
        >
          <FaListAlt style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Orders List
        </button>
        <button
          className={`home-tab${activeTab === 'VirtualPortfolioScreen' ? ' active' : ''}`}
          onClick={() => setActiveTab('VirtualPortfolioScreen')}
        >
          <FaChartPie style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Portfolio Screen
        </button>
      </nav>
      <div className="home-tab-content fade-in" style={{ marginTop: 24 }}>
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'orderslist' && <OrdersList showBackButton={false} />}
        {activeTab === 'VirtualPortfolioScreen' && <VirtualPortfolioScreen />}
      </div>
      <hr />
    </div>
  );
}

export default Home;
