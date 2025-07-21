import React, { useState } from 'react';
import './App.css'; // Assuming you have some shared styles here

function CustomerPortfolio() {
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

  const handleSubmit = async (e) => {
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
    <div className="form-container">
      <h2>Customer & Portfolio Management</h2>
      <form onSubmit={handleSubmit}>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <h3>Customer Details</h3>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cnic">CNIC or ID Number</label>
          <input
            type="text"
            id="cnic"
            name="cnic"
            value={formData.cnic}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerNo">Customer No</label>
          <input
            type="text"
            id="customerNo"
            name="customerNo"
            value={formData.customerNo}
            onChange={handleChange}
            required
          />
        </div>

        <h3>Portfolio Details</h3>
        <div className="form-group">
          <label htmlFor="portfolioName">Portfolio Name</label>
          <input
            type="text"
            id="portfolioName"
            name="portfolioName"
            value={formData.portfolioName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="initialCapital">Initial Capital</label>
          <input
            type="number"
            id="initialCapital"
            name="initialCapital"
            value={formData.initialCapital}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Save</button>
      </form>
    </div>
  );
}

export default CustomerPortfolio;
