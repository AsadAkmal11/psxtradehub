import React, { useState } from 'react';
import BackButton from './components/BackButton';
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
      <BackButton onBack={onBack} />
      <h2 style={commonStyles.header}>Customer & Portfolio Management</h2>
      <form>
        {message && <div style={commonStyles.message.success}>{message}</div>}
        {error && <div style={commonStyles.message.error}>{error}</div>}
        <h3 style={{ color: theme.colors.primary, fontSize: '1.2rem', marginBottom: theme.spacing.lg, borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: theme.spacing.sm }}>Customer Details</h3>
        <div style={commonStyles.formGroup}>
          <label htmlFor="fullName" style={commonStyles.label}>Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={commonStyles.input}
          />
        </div>
        <div style={commonStyles.formGroup}>
          <label htmlFor="email" style={commonStyles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={commonStyles.input}
          />
        </div>
        <div style={commonStyles.formGroup}>
          <label htmlFor="phone" style={commonStyles.label}>Phone Number (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={commonStyles.input}
          />
        </div>
        <div style={commonStyles.formGroup}>
          <label htmlFor="cnic" style={commonStyles.label}>CNIC or ID Number</label>
          <input
            type="text"
            id="cnic"
            name="cnic"
            value={formData.cnic}
            onChange={handleChange}
            required
            style={commonStyles.input}
          />
        </div>
        <div style={commonStyles.formGroup}>
          <label htmlFor="customerNo" style={commonStyles.label}>Customer No</label>
          <input
            type="text"
            id="customerNo"
            name="customerNo"
            value={formData.customerNo}
            onChange={handleChange}
            required
            style={commonStyles.input}
          />
        </div>
        <button type="button" style={{...commonStyles.button.primary, marginBottom: theme.spacing.lg}} onClick={handleSaveCustomer}>Save Customer</button>

        <h3 style={{ color: theme.colors.primary, fontSize: '1.2rem', marginBottom: theme.spacing.lg, borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: theme.spacing.sm }}>Portfolio Details</h3>
        <div style={commonStyles.formGroup}>
          <label htmlFor="portfolioName" style={commonStyles.label}>Portfolio Name</label>
          <input
            type="text"
            id="portfolioName"
            name="portfolioName"
            value={formData.portfolioName}
            onChange={handleChange}
            required
            style={commonStyles.input}
          />
        </div>
        <div style={commonStyles.formGroup}>
          <label htmlFor="initialCapital" style={commonStyles.label}>Initial Capital</label>
          <input
            type="number"
            id="initialCapital"
            name="initialCapital"
            value={formData.initialCapital}
            onChange={handleChange}
            required
            style={commonStyles.input}
          />
        </div>
        <button type="button" style={commonStyles.button.primary} onClick={handleSavePortfolio}>Save Portfolio</button>
      </form>
    </div>
  );
}

export default CustomerPortfolio;
