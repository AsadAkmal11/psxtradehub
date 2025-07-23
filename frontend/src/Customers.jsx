import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/customers')
      .then(res => setCustomers(Array.isArray(res.data.customers) ? res.data.customers : []))
      .catch(() => setMessage('Failed to fetch customers'));
  }, []);

  return (
    <div className="customers-container">
      <h2>Customers</h2>
      {message && <div style={{ color: 'red' }}>{message}</div>}
      <table className="modern-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>CNIC</th>
            <th>Customer No</th>
          </tr>
        </thead>
        <tbody>
          {(customers || []).map(c => (
            <tr key={c.id || c.customerNo}>
              <td>{c.fullName}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.cnic}</td>
              <td>{c.customerNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers; 