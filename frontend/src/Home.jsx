import React, { useState } from 'react';
import OrdersList from './OrdersList';
import { FaListAlt } from 'react-icons/fa';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('orderslist');

  return (
    <div className="home-container">
      <h2 style={{ marginBottom: 24 }}>Welcome, {user?.username || 'User'}!</h2>
      <nav className="home-navbar">
        <button
          className={`home-tab${activeTab === 'orderslist' ? ' active' : ''}`}
          onClick={() => setActiveTab('orderslist')}
        >
          <FaListAlt style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Orders List
        </button>
      </nav>
      <div className="home-tab-content fade-in">
        {activeTab === 'orderslist' && (
          <div style={{ marginTop: 24 }}>
            <OrdersList showBackButton={false} />
          </div>
        )}
      </div>
      <hr />
      <p style={{ marginTop: '2rem' }}></p>
    </div>
  );
}

export default Home; 