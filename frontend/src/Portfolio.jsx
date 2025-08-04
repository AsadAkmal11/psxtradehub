 import React, { useState } from 'react';
 // import BackButton from './components/BackButton';
 import { commonStyles, theme } from './components/ThemeProvider';
 
 function Portfolio({ onBack }) {
   const [formData, setFormData] = useState({
     // Portfolio fields
     portfolioName: '',
     customerNo:'',
     portfolioNo:'',
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
      const response = await fetch('http://localhost:5000/api/portfolio', {
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
        portfolioName: '',
        portfolioNo:'',
        customerNo: '',
        initialCapital: '',
        });
      } else {
        setError(result.message || 'Failed to save data');
      }
    } catch (error) {
      setError('Error submitting form: ' + error.message);
    }
  };return (
      <div style={commonStyles.container}>
        {/* <BackButton onBack={onBack} /> */}
        <h2 style={commonStyles.header}>Portfolio Management</h2>
        <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {message && <div style={{...commonStyles.message.success, gridColumn: '1 / -1'}}>{message}</div>}
          {error && <div style={{...commonStyles.message.error, gridColumn: '1 / -1'}}>{error}</div>}
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
                  <label htmlFor="portfolioNo" style={{...commonStyles.label, marginBottom: '0.5rem'}}>Portfolio Number *</label>
                  <input
                    type="text"
                    id="portfolioNo"
                    name="portfolioNo"
                    value={formData.portfolioNo}
                    onChange={handleChange}
                    required
                    placeholder="Enter portfolio number"
                    style={{
                      ...commonStyles.input,
                      padding: '0.75rem',
                      fontSize: '0.95rem',
                      marginBottom: '0.5rem'
                    }}
                  />
                </div>
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
export default Portfolio;