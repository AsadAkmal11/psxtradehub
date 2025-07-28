import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useInterval from './components/useInterval';
import { commonStyles, theme } from './components/ThemeProvider';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchCustomers = () => {
    axios.get('/api/customers')
      .then(res => setCustomers(Array.isArray(res.data.customers) ? res.data.customers : []))
      .catch(() => setMessage('Failed to fetch customers'));
  };

  useEffect(() => {
    fetchCustomers(); // Initial fetch on mount
  }, []);

  useInterval(fetchCustomers, 2000); // Poll every 2 seconds
  return (
    <div style={commonStyles.container}>
      <h2 style={commonStyles.header}>Customers Information</h2>
      {message && <div style={commonStyles.message.error}>{message}</div>}
      <table style={commonStyles.table}>
        <thead>
          <tr>
            <th style={commonStyles.tableHeader}>Name</th>
            <th style={commonStyles.tableHeader}>Email</th>
            <th style={commonStyles.tableHeader}>Phone</th>
            <th style={commonStyles.tableHeader}>CNIC</th>
            <th style={commonStyles.tableHeader}>Customer No</th>
          </tr>
        </thead>
        <tbody>
          {(customers || []).map(c => (
            <tr key={c.id || c.customerNo} style={commonStyles.tableRow}>
              <td style={commonStyles.tableCell}>{c.fullName}</td>
              <td style={commonStyles.tableCell}>{c.email}</td>
              <td style={commonStyles.tableCell}>{c.phone}</td>
              <td style={commonStyles.tableCell}>{c.cnic}</td>
              <td style={commonStyles.tableCell}>{c.customerNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers; 