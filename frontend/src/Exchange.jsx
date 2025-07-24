import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Exchange({ onClose, onExchangeSaved }) {
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    countryName: '',
    countryCode: '',
    timezone: '',
    currencyName: '',
    currencyCode: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    axios.get('/api/country').then(res => {
      setCountries(Array.isArray(res.data.countries) ? res.data.countries : []);
    });
    axios.get('/api/currency').then(res => {
      setCurrencies(Array.isArray(res.data.currencies) ? res.data.currencies : []);
    });
  }, []);

  // Link country name/code
  const handleCountryChange = (field, value) => {
    let update = { [field]: value };
    if (field === 'countryName') {
      const match = countries.find(c => c.name === value);
      if (match) update.countryCode = match.code;
    } else if (field === 'countryCode') {
      const match = countries.find(c => c.code === value);
      if (match) update.countryName = match.name;
    }
    setForm(f => ({ ...f, ...update }));
  };

  // Link currency name/code
  const handleCurrencyChange = (field, value) => {
    let update = { [field]: value };
    if (field === 'currencyName') {
      const match = currencies.find(c => c.name === value);
      if (match) update.currencyCode = match.code;
    } else if (field === 'currencyCode') {
      const match = currencies.find(c => c.code === value);
      if (match) update.currencyName = match.name;
    }
    setForm(f => ({ ...f, ...update }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Exchange name is required.';
    if (!form.countryName) errs.countryName = 'Country name is required.';
    if (!form.countryCode) errs.countryCode = 'Country code is required.';
    if (!form.currencyName) errs.currencyName = 'Currency name is required.';
    if (!form.currencyCode) errs.currencyCode = 'Currency code is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      await axios.post('/api/exchanges', {
        name: form.name,
        country: { name: form.countryName, code: form.countryCode },
        timezone: form.timezone,
        currency: { name: form.currencyName, code: form.currencyCode },
      });
      setSaving(false);
      setSuccessMsg('Exchange saved');
      setTimeout(() => {
        setSuccessMsg('');
        if (onExchangeSaved) onExchangeSaved();
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      setSaving(false);
      setErrors({ submit: 'Failed to save exchange.' });
    }
  };

  return (
    <div className="exchange-container">
      <h2>Add Exchange</h2>
      {successMsg && <div style={{ color: '#0ECB81', marginBottom: 12, fontWeight: 600 }}>{successMsg}</div>}
      <form className="exchange-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem 2rem', maxWidth: 600 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            name="name"
            placeholder="Enter exchange name (e.g., Pakistan Stock Exchange)"
            value={form.name}
            onChange={handleChange}
            style={{ marginBottom: 4 }}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <select
            name="countryName"
            value={form.countryName}
            onChange={e => handleCountryChange('countryName', e.target.value)}
            style={{ marginBottom: 4 }}
          >
            <option value="">Select country</option>
            {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {errors.countryName && <span className="error-text">{errors.countryName}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <select
            name="countryCode"
            value={form.countryCode}
            onChange={e => handleCountryChange('countryCode', e.target.value)}
            style={{ marginBottom: 4 }}
          >
            <option value="">Select country code</option>
            {countries.map(c => <option key={c.id} value={c.code}>{c.code}</option>)}
          </select>
          {errors.countryCode && <span className="error-text">{errors.countryCode}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            name="timezone"
            placeholder="Enter timezone (e.g., Asia/Karachi)"
            value={form.timezone}
            onChange={handleChange}
            style={{ marginBottom: 4 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <select
            name="currencyName"
            value={form.currencyName}
            onChange={e => handleCurrencyChange('currencyName', e.target.value)}
            style={{ marginBottom: 4 }}
          >
            <option value="">Select currency name</option>
            {currencies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          {errors.currencyName && <span className="error-text">{errors.currencyName}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <select
            name="currencyCode"
            value={form.currencyCode}
            onChange={e => handleCurrencyChange('currencyCode', e.target.value)}
            style={{ marginBottom: 4 }}
          >
            <option value="">Select currency code</option>
            {currencies.map(c => <option key={c.id} value={c.code}>{c.code}</option>)}
          </select>
          {errors.currencyCode && <span className="error-text">{errors.currencyCode}</span>}
        </div>
        <div style={{ gridColumn: '1 / span 2', textAlign: 'center', marginTop: 12 }}>
          <button type="submit" disabled={saving} style={{ padding: '0.7em 2em', fontWeight: 700 }}>
            {saving ? 'Saving...' : 'Save / Add Exchange'}
          </button>
          {errors.submit && <div className="error-text" style={{ marginTop: 8 }}>{errors.submit}</div>}
        </div>
      </form>
    </div>
  );
}

export default Exchange; 