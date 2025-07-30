import React, { useState } from 'react';
// import BackButton from './components/BackButton';
import { commonStyles, theme } from './components/ThemeProvider';

function CustomerPortfolio({ onBack }) {
  const [formData, setFormData] = useState({
    // Customer fields
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    customerNo: '',
    // Portfolio fields
    portfolioName: '',
    initialCapital: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save only customer
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const { fullName, email, phone, cnic, customerNo } = formData;
    if (!fullName || !email || !cnic || !customerNo) {
      setError('Please fill out all required customer fields.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, email, phone, cnic, customerNo }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Customer saved successfully!');
      } else {
        setError(result.message || 'Failed to save customer');
      }
    } catch (error) {
      setError('Error saving customer: ' + error.message);
    }
  };

  // Save both customer and portfolio
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    // Basic validation
    for (const key in formData) {
      if (formData[key] === '' && key !== 'phone') {
        setError('Please fill out all required fields.');
        return;
      }
    }
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/customer-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Customer and portfolio created successfully!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          cnic: '',
          customerNo: '',
          portfolioName: '',
          initialCapital: '',
        });
      } else {
        setError(result.message || 'Failed to save data');
      }
    } catch (error) {
      setError('Error submitting form: ' + error.message);
    }
  };

  return (
    <div style={commonStyles.container}>
      {/* <BackButton onBack={onBack} /> */}
      <h2 style={commonStyles.header}>Customer & Portfolio Management</h2>
      <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {message && <div style={{...commonStyles.message.success, gridColumn: '1 / -1'}}>{message}</div>}
        {error && <div style={{...commonStyles.message.error, gridColumn: '1 / -1'}}>{error}</div>}
        
        {/* Customer Details Section */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
          <h3 style={{ 
            color: theme.colors.primary, 
            fontSize: '1.2rem', 
            marginBottom: '1rem', 
            borderBottom: `2px solid ${theme.colors.border}`, 
            paddingBottom: '0.5rem',
            gridColumn: '1 / -1'
          }}>Customer Details</h3>
        </div>

        {/* Row 1: Full Name, Email */}
        <div style={commonStyles.formGroup}>
          <label htmlFor="fullName" style={{...commonStyles.label, marginBottom: '0.5rem'}}>Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            style={{
              ...commonStyles.input,
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginBottom: '0.5rem'
            }}
          />
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="email" style={{...commonStyles.label, marginBottom: '0.5rem'}}>Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
            style={{
              ...commonStyles.input,
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginBottom: '0.5rem'
            }}
          />
        </div>

        {/* Row 2: Phone, CNIC */}
        <div style={commonStyles.formGroup}>
          <label htmlFor="phone" style={{...commonStyles.label, marginBottom: '0.5rem'}}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number (optional)"
            style={{
              ...commonStyles.input,
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginBottom: '0.5rem'
            }}
          />
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="cnic" style={{...commonStyles.label, marginBottom: '0.5rem'}}>CNIC/ID Number *</label>
          <input
            type="text"
            id="cnic"
            name="cnic"
            value={formData.cnic}
            onChange={handleChange}
            required
            placeholder="Enter CNIC or ID number"
            style={{
              ...commonStyles.input,
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginBottom: '0.5rem'
            }}
          />
        </div>

        {/* Row 3: Customer No */}
        <div style={commonStyles.formGroup}>
          <label htmlFor="customerNo" style={{...commonStyles.label, marginBottom: '0.5rem'}}>Customer Number *</label>
          <input
            type="text"
            id="customerNo"
            name="customerNo"
            value={formData.customerNo}
            onChange={handleChange}
            required
            placeholder="Enter customer number"
            style={{
              ...commonStyles.input,
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginBottom: '0.5rem'
            }}
          />
        </div>

        {/* Save Customer Button */}
        <div style={{...commonStyles.formGroup, gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem'}}>
          <button 
            type="button" 
            style={{
              ...commonStyles.button.primary,
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              minWidth: '200px'
            }} 
            onClick={handleSaveCustomer}
          >
            Save Customer
          </button>
        </div>

        {/* Portfolio Details Section */}
        <div style={{ gridColumn: '1 / -1', marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ 
            color: theme.colors.primary, 
            fontSize: '1.2rem', 
            marginBottom: '1rem', 
            borderBottom: `2px solid ${theme.colors.border}`, 
            paddingBottom: '0.5rem'
          }}>Portfolio Details</h3>
        </div>

        {/* Row 4: Portfolio Name, Initial Capital */}
        <div style={commonStyles.formGroup}>
          <label htmlFor="portfolioName" style={{...commonStyles.label, marginBottom: '0.5rem'}}>Portfolio Name *</label>
          <input
            type="text"
            id="portfolioName"
            name="portfolioName"
            value={formData.portfolioName}
            onChange={handleChange}
            required
            placeholder="Enter portfolio name"
            style={{
              ...commonStyles.input,
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginBottom: '0.5rem'
            }}
          />
        </div>

        <div style={commonStyles.formGroup}>
          <label htmlFor="initialCapital" style={{...commonStyles.label, marginBottom: '0.5rem'}}>Initial Capital *</label>
          <input
            type="number"
            id="initialCapital"
            name="initialCapital"
            value={formData.initialCapital}
            onChange={handleChange}
            required
            placeholder="Enter initial capital amount"
            min="0"
            step="0.01"
            style={{
              ...commonStyles.input,
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginBottom: '0.5rem'
            }}
          />
        </div>

        {/* Save Portfolio Button */}
        <div style={{...commonStyles.formGroup, gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem'}}>
          <button 
            type="button" 
            style={{
              ...commonStyles.button.primary,
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              minWidth: '200px'
            }} 
            onClick={handleSavePortfolio}
          >
            Save Portfolio
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerPortfolio;
