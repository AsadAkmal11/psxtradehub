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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add validation
    console.log('Form data submitted:', formData);
    // TODO: Send data to backend API
    /*
    try {
      const response = await fetch('/api/customer-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Successfully saved:', result);
        // TODO: show success message and clear form
      } else {
        console.error('Failed to save data');
        // TODO: show error message
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    */
  };

  return (
    <div className="form-container">
      <h2>Customer & Portfolio Management</h2>
      <form onSubmit={handleSubmit}>
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
