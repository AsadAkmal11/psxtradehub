import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import BackButton from './components/BackButton';
import SearchableDropdown from './components/SearchableDropdown';
import './App.css';

const initialState = {
  customerNo: '',
  symbol: '',
  broker: '',
  portfolioId: '',
  tradeDate: '',
  action: '',
  orderType: '',
  quantity: '',
  price: '',
};

export default function Order({ onBack }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [stocks, setStocks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [brokers, setBrokers] = useState(["Broker A", "Broker B", "Broker C"]); // Example brokers
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Theme colors based on action
  const getThemeColors = () => {
    if (form.action === 'sell') {
      return {
        primary: '#F6465D',
        secondary: '#FFE6E9',
        border: '#F6465D',
        text: '#8B0000'
      };
    } else if (form.action === 'buy') {
      return {
        primary: '#38a169',
        secondary: '#E6FFE9',
        border: '#38a169',
        text: '#006400'
      };
    }
    return {
      primary: '#F0B90B',
      secondary: '#FFF8E1',
      border: '#F0B90B',
      text: '#B8860B'
    };
  };

  const theme = getThemeColors();

  useEffect(() => {
    axios.get('/api/stocks').then(res => setStocks(res.data.stocks || []));
    axios.get('/api/customers').then(res => setCustomers(res.data.customers || []));
    axios.get('/api/portfolios').then(res => setPortfolios(res.data.portfolios || []));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.customerNo) newErrors.customerNo = 'Customer is required';
    if (!form.symbol) newErrors.symbol = 'Stock symbol is required';
    if (!form.broker) newErrors.broker = 'Broker is required';
    if (!form.portfolioId) newErrors.portfolioId = 'Portfolio is required';
    if (!form.tradeDate) newErrors.tradeDate = 'Trade date is required';
    if (!form.action) newErrors.action = 'Action is required';
    if (!form.orderType) newErrors.orderType = 'Order type is required';
    if (!form.quantity || isNaN(form.quantity) || form.quantity <= 0) newErrors.quantity = 'Quantity must be a positive number';
    if (!form.price || isNaN(form.price) || form.price <= 0) newErrors.price = 'Price must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/orders', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Order placed successfully!');
      setForm(initialState);
    } catch (err) {
      setSuccess(null);
      setErrors({ submit: err.response?.data?.message || 'Order failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{
      border: `2px solid ${theme.border}`,
      backgroundColor: theme.secondary,
      transition: 'all 0.3s ease',
      maxWidth: '1200px' // Increased from 600px to accommodate rows
    }}>
      {/* <BackButton onBack={onBack} /> */}
      <h2 style={{ color: theme.text, transition: 'color 0.3s ease' }}>Buy/Sell Order</h2>
      {errors.submit && <div className="watchlist-message" style={{ background: theme.primary }}>{errors.submit}</div>}
      {success && <div className="watchlist-message" style={{ background: theme.primary }}>{success}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        
        {/* Row 1: Customer, Stock Symbol, Portfolio */}
        <div className="form-group">
          <label>Customer:</label>
          <SearchableDropdown
            options={customers.map(c => `${c.fullName} (${c.customerNo})`)}
            value={form.customerNo}
            onChange={val => {
              // Extract customerNo from "Name (customerNo)"
              const match = val.match(/\(([^)]+)\)$/);
              setForm(f => ({ ...f, customerNo: match ? match[1] : '' }));
            }}
            placeholder="Search customer..."
          />
          {errors.customerNo && <div className="error">{errors.customerNo}</div>}
        </div>
        
        <div className="form-group">
          <label>Stock Symbol:</label>
          <SearchableDropdown
            options={stocks.map(s => s.symbol)}
            value={form.symbol}
            onChange={val => setForm(f => ({ ...f, symbol: val }))}
            placeholder="Search symbol..."
          />
          {errors.symbol && <div className="error">{errors.symbol}</div>}
        </div>
        
        <div className="form-group">
          <label>Portfolio:</label>
          <SearchableDropdown
            options={portfolios.map(p => `${p.portfolioName} (ID: ${p.id})`)}
            value={form.portfolioId}
            onChange={val => {
              // Extract id from "Name (ID: id)"
              const match = val.match(/ID: (\d+)\)$/);
              setForm(f => ({ ...f, portfolioId: match ? match[1] : '' }));
            }}
            placeholder="Search portfolio..."
          />
          {errors.portfolioId && <div className="error">{errors.portfolioId}</div>}
        </div>

        {/* Row 2: Broker, Trade Date, Action */}
        <div className="form-group">
          <label style={{ color: theme.text }}>Broker:</label>
          <select 
            name="broker" 
            value={form.broker} 
            onChange={handleChange}
            style={{
              border: `2px solid ${theme.border}`,
              backgroundColor: 'white',
              color: theme.text,
              transition: 'border-color 0.3s ease',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="">Select Broker</option>
            {brokers.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {errors.broker && <div className="error" style={{ color: theme.primary }}>{errors.broker}</div>}
        </div>
        
        <div className="form-group">
          <label>Trade Date:</label>
          <input type="DATE" name="tradeDate" value={form.tradeDate} onChange={handleChange}
            style={{
              border: `2px solid ${theme.border}`,
              backgroundColor: theme.secondary,
              color: theme.text,
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
           />
          {errors.tradeDate && <div className="error">{errors.tradeDate}</div>}
        </div>
        
        <div className="form-group">
          <label style={{ color: theme.text, fontWeight: 'bold' }}>Action:</label>
          <select 
            name="action" 
            value={form.action} 
            onChange={handleChange}
            style={{
              border: `2px solid ${theme.border}`,
              backgroundColor: theme.secondary,
              color: theme.text,
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="">Select Action</option>
            <option value="buy" style={{ backgroundColor: '#E6FFE9', color: '#006400' }}>Buy</option>
            <option value="sell" style={{ backgroundColor: '#FFE6E9', color: '#8B0000' }}>Sell</option>
          </select>
          {errors.action && <div className="error" style={{ color: theme.primary }}>{errors.action}</div>}
        </div>

        {/* Row 3: Order Type, Quantity, Price */}
        <div className="form-group">
          <label style={{ color: theme.text }}>Order Type:</label>
          <input 
            name="orderType" 
            value={form.orderType} 
            onChange={handleChange} 
            placeholder="e.g. Limit, Market"
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: 'black',
              transition: 'border-color 0.3s ease',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '1rem',
              color: 'white'
            }}
          />
          {errors.orderType && <div className="error" style={{ color: theme.primary }}>{errors.orderType}</div>}
        </div>
        
        <div className="form-group">
          <label style={{ color: theme.text }}>Quantity:</label>
          <input 
            name="quantity" 
            type="number" 
            value={form.quantity} 
            onChange={handleChange}
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: 'black',
              transition: 'border-color 0.3s ease',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '1rem',
              color: 'white'
            }}
          />
          {errors.quantity && <div className="error" style={{ color: theme.primary }}>{errors.quantity}</div>}
        </div>
        
        <div className="form-group">
          <label style={{ color: theme.text }}>Price:</label>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            value={form.price} 
            onChange={handleChange}
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: 'black',
              transition: 'border-color 0.3s ease',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '1rem',
              color: 'white'
            }}
          />
          {errors.price && <div className="error" style={{ color: theme.primary }}>{errors.price}</div>}
        </div>

        {/* Submit button spans full width */}
        <div className="form-group" style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem' }}>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
            style={{
              backgroundColor: theme.primary,
              border: `2px solid ${theme.border}`,
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              minWidth: '200px'
            }}
          >
            {loading ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
} 