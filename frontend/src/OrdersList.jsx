import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
// import BackButton from './components/BackButton';
import useInterval from './components/useInterval';
import './App.css';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specificDate, setSpecificDate] = useState('');

  const fetchOrders = useCallback(() => {
    const token = localStorage.getItem('token');
    let url = '/api/orders';
    
    // If a specific date is selected, use it; otherwise show today's orders
    if (specificDate) {
      url += `?filter=specific&date=${specificDate}`;
    }

    axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setOrders(res.data.orders || []);
        setLoading(false);
        setError('');
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setLoading(false);
      });
  }, [specificDate]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Set up interval for auto-refresh every 2 seconds
  useInterval(fetchOrders, 2000);

  const handleSpecificDateChange = (date) => {
    setSpecificDate(date);
  };
  
  const getFilterDisplayText = () => {
    if (specificDate) {
      return `Date: ${specificDate}`;
    }
    return 'Today';
  };

  return (
    <div className="form-container" style={{ maxWidth: 1100 }}>
      {/* {showBackButton && <BackButton onBack={onBack} />} */}
      <h2>Orders List</h2>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center', 
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600, color: 'white' }}>Date:</label>
          <input
            type="date"
            value={specificDate}
            onChange={(e) => handleSpecificDateChange(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '2px solid #F0B90B',
              backgroundColor: '#2d3748',
              color:'white',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ 
          padding: '0.5rem 1rem', 
          border: '2px solid #F0B90B',
          backgroundColor: '#2d3748', 
          borderRadius: '4px',
          fontSize: '14px',
          color: 'white'
        }}>
          Showing: {getFilterDisplayText()}
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="watchlist-message" style={{ background: '#F6465D' }}>{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div style={{ color: '#a0aec0', margin: '2rem 0', textAlign: 'center' }}>
          No orders found for {getFilterDisplayText().toLowerCase()}.
        </div>
      )}
      {!loading && !error && orders.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: 24 }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Symbol</th>
                <th>Broker</th>
                <th>Portfolio</th>
                <th>Trade Date</th>
                <th>Action</th>
                <th>Order Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td>{order.id}</td>
                  <td>{order.customerNo}</td>
                  <td>{order.symbol}</td>
                  <td>{order.broker}</td>
                  <td>{order.portfolioId}</td>
                  <td>{order.tradeDate}</td>
                  <td style={{ color: order.action === 'buy' ? '#38a169' : '#F6465D', fontWeight: 600 }}>{order.action}</td>
                  <td>{order.orderType}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 