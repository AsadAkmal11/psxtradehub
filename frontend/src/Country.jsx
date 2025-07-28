import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { commonStyles, theme } from './components/ThemeProvider';

function Country() {
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({ name: '', code: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchCountries = async () => {
    try {
      const res = await axios.get('/api/country');
      setCountries(Array.isArray(res.data.countries) ? res.data.countries : []);
    } catch (err) {
      setMessage('Failed to fetch countries');
      setCountries([]);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/country/${editingId}`, form);
        setMessage('Country updated');
      } else {
        await axios.post('/api/country', form);
        setMessage('Country added');
      }
      setForm({ name: '', code: '' });
      setEditingId(null);
      fetchCountries();
    } catch (err) {
      setMessage('Failed to save country');
    }
  };

  const handleEdit = (country) => {
    setForm({ name: country.name, code: country.code });
    setEditingId(country.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this country?')) return;
    try {
      await axios.delete(`/api/country/${id}`);
      setMessage('Country deleted');
      fetchCountries();
    } catch (err) {
      setMessage('Failed to delete country');
    }
  };

  return (
    <div style={commonStyles.container}>
      <h2 style={commonStyles.header}>Country Management</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <input
          type="text"
          name="name"
          placeholder="Country Name"
          value={form.name}
          onChange={handleChange}
          required
          style={commonStyles.input}
        />
        <input
          type="text"
          name="code"
          placeholder="Country Code"
          value={form.code}
          onChange={handleChange}
          required
          style={commonStyles.input}
        />
        <button type="submit" style={commonStyles.button.primary}>{editingId ? 'Update' : 'Add'} Country</button>
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
          {(countries || []).map((country) => (
            <tr key={country.id} style={commonStyles.tableRow}>
              <td style={commonStyles.tableCell}>{country.name}</td>
              <td style={commonStyles.tableCell}>{country.code}</td>
              <td style={commonStyles.tableCell}>
                <button onClick={() => handleEdit(country)} style={{...commonStyles.button.secondary, marginRight: theme.spacing.sm, padding: `${theme.spacing.sm} ${theme.spacing.md}`}}>Edit</button>
                <button onClick={() => handleDelete(country.id)} style={commonStyles.button.danger}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Country; 