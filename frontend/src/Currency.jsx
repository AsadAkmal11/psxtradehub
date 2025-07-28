import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { commonStyles, theme } from './components/ThemeProvider';

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
    <div style={commonStyles.container}>
      <h2 style={commonStyles.header}>Currency Management</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <input
          type="text"
          name="name"
          placeholder="Currency Name"
          value={form.name}
          onChange={handleChange}
          required
          style={commonStyles.input}
        />
        <input
          type="text"
          name="code"
          placeholder="Currency Code"
          value={form.code}
          onChange={handleChange}
          required
          style={commonStyles.input}
        />
        <button type="submit" style={commonStyles.button.primary}>{editingId ? 'Update' : 'Add'} Currency</button>
        {editingId && (
          <button type="button" style={commonStyles.button.secondary} onClick={() => { setEditingId(null); setForm({ name: '', code: '' }); }}>Cancel</button>
        )}
      </form>
      {message && <div style={commonStyles.message.warning}>{message}</div>}
      <table style={commonStyles.table}>
        <thead>
          <tr>
            <th style={commonStyles.tableHeader}>Name</th>
            <th style={commonStyles.tableHeader}>Code</th>
            <th style={commonStyles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(currencies || []).map((currency) => (
            <tr key={currency.id} style={commonStyles.tableRow}>
              <td style={commonStyles.tableCell}>{currency.name}</td>
              <td style={commonStyles.tableCell}>{currency.code}</td>
              <td style={commonStyles.tableCell}>
                <button onClick={() => handleEdit(currency)} style={{...commonStyles.button.secondary, marginRight: theme.spacing.sm, padding: `${theme.spacing.sm} ${theme.spacing.md}`}}>Edit</button>
                <button onClick={() => handleDelete(currency.id)} style={commonStyles.button.danger}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Currency; 