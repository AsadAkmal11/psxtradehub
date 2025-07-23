import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="country-container">
      <h2>Country Management</h2>
      <form onSubmit={handleSubmit} className="country-form">
        <input
          type="text"
          name="name"
          placeholder="Country Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="code"
          placeholder="Country Code"
          value={form.code}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Country</button>
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
          {(countries || []).map((country) => (
            <tr key={country.id}>
              <td>{country.name}</td>
              <td>{country.code}</td>
              <td>
                <button onClick={() => handleEdit(country)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(country.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Country; 