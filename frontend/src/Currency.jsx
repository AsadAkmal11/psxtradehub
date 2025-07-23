import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Currency() {
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCurrencies = async () => {
    try {
      const res = await axios.get('/api/currency');
      setCurrencies(Array.isArray(res.data.currencies) ? res.data.currencies : []);
    } catch (err) {
      setMessage('Failed to fetch currencies');
      setCurrencies([]);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/currency/${editingId}`, form);
        setMessage('Currency updated');
      } else {
        await axios.post('/api/currency', form);
        setMessage('Currency added');
      }
      setForm({ name: '', code: '' });
      setEditingId(null);
      fetchCurrencies();
    } catch (err) {
      setMessage('Failed to save currency');
    }
  };

  const handleEdit = (currency) => {
    setForm({ name: currency.name, code: currency.code });
    setEditingId(currency.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this currency?')) return;
    try {
      await axios.delete(`/api/currency/${id}`);
      setMessage('Currency deleted');
      fetchCurrencies();
    } catch (err) {
      setMessage('Failed to delete currency');
    }
  };

  return (
    <div className="currency-container">
      <h2>Currency Management</h2>
      <form onSubmit={handleSubmit} className="currency-form">
        <input
          type="text"
          name="name"
          placeholder="Currency Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="code"
          placeholder="Currency Code"
          value={form.code}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Currency</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', code: '' }); }}>Cancel</button>
        )}
      </form>
      {message && <div style={{ color: '#F0B90B', margin: '1rem 0' }}>{message}</div>}
      <table className="modern-table" style={{ marginTop: 24 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(currencies || []).map((currency) => (
            <tr key={currency.id}>
              <td>{currency.name}</td>
              <td>{currency.code}</td>
              <td>
                <button onClick={() => handleEdit(currency)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(currency.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Currency; 