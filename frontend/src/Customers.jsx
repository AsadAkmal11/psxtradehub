import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useInterval from './components/useInterval';
import { commonStyles, theme } from './components/ThemeProvider';

function Customers() {
  const [filter, setFilter] = useState('');
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [sortKey, setSortKey] = useState('fullName');
  const [sortAsc, setSortAsc] = useState(true);
  const [contextMenu, setContextMenu] = useState(null); // {x, y, customer}
  const [editModal, setEditModal] = useState({ open: false, customer: null });
  const [editForm, setEditForm] = useState({ fullName: '', email: '', phone: '', cnic: '' });
  const tableRef = useRef();

  const fetchCustomers = () => {
    axios.get('/api/customers')
      .then(res => setCustomers(Array.isArray(res.data.customers) ? res.data.customers : []))
      .catch(() => setMessage('Failed to fetch customers'));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filteredCustomers = customers.filter(customer =>
    (customer.fullName || '').toLowerCase().includes(filter.toLowerCase()) ||
    (customer.customerNo?.toString() || '').includes(filter)
  ).sort((a, b) => {
    const aValue = a[sortKey] || '';
    const bValue = b[sortKey] || '';
    if (aValue < bValue) return sortAsc ? -1 : 1;
    if (aValue > bValue) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };
  const getSortIndicator = (key) => sortKey !== key ? '↕' : (sortAsc ? '↑' : '↓');

  // Context menu logic
  const handleContextMenu = (e, customer) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, customer });
  };
  const handleCloseContextMenu = () => setContextMenu(null);

  // Edit modal logic
  const openEditModal = (customer) => {
    setEditModal({ open: true, customer });
    setEditForm({
      fullName: customer.fullName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      cnic: customer.cnic || ''
    });
    setContextMenu(null);
  };
  const closeEditModal = () => setEditModal({ open: false, customer: null });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/customers/${editModal.customer.customerNo}`, editForm);
      setMessage('Customer updated successfully');
      fetchCustomers();
      closeEditModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update customer: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Delete handler
  const handleDelete = async (customerNo) => {
    handleCloseContextMenu();
    if (!window.confirm('Delete this customer?')) return;
    try {
      const response = await axios.delete(`/api/CustomerPortfolio/${customerNo}`);
      if (response.status === 200) {
        setMessage('Customer deleted successfully');
        fetchCustomers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete customer');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (contextMenu && tableRef.current && !tableRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  return (
    <div style={commonStyles.container}>
      <h2 style={commonStyles.header}>Customers Information</h2>
      <div style={{ marginBottom: theme.spacing.lg }}>
        <input
          type="text"
          placeholder="Search by name or customer number..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            ...commonStyles.input,
            width: '100%',
            maxWidth: '500px',
            marginBottom: theme.spacing.sm
          }}
        />
        <div style={{ color: theme.colors.textSecondary, fontSize: '0.9rem', marginBottom: theme.spacing.md }}>
          {filteredCustomers.length} of {customers.length} customers found
        </div>
      </div>
      {message && (
        <div style={message.includes('successfully') ? commonStyles.message.success : commonStyles.message.error}>
          {message}
        </div>
      )}
      <div style={{ overflowX: 'auto' }} ref={tableRef}>
        <table className="styled-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('fullName')} style={{ ...commonStyles.tableHeader, cursor: 'pointer', userSelect: 'none', position: 'relative' }}>Name {getSortIndicator('fullName')}</th>
              <th onClick={() => handleSort('email')} style={{ ...commonStyles.tableHeader, cursor: 'pointer', userSelect: 'none' }}>Email {getSortIndicator('email')}</th>
              <th onClick={() => handleSort('phone')} style={{ ...commonStyles.tableHeader, cursor: 'pointer', userSelect: 'none' }}>Phone {getSortIndicator('phone')}</th>
              <th onClick={() => handleSort('cnic')} style={{ ...commonStyles.tableHeader, cursor: 'pointer', userSelect: 'none' }}>CNIC {getSortIndicator('cnic')}</th>
              <th onClick={() => handleSort('customerNo')} style={{ ...commonStyles.tableHeader, cursor: 'pointer', userSelect: 'none' }}>Customer No {getSortIndicator('customerNo')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, idx) => (
              <tr
                key={customer.id || customer.customerNo}
                className={idx % 2 === 0 ? 'row-even' : 'row-odd'}
                onContextMenu={e => handleContextMenu(e, customer)}
                style={{ cursor: 'context-menu' }}
              >
                <td>{customer.fullName}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.cnic}</td>
                <td>{customer.customerNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Context Menu */}
        {contextMenu && (
          <ul
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              background: theme.colors.surface,
              color: theme.colors.text,
              border: `1.5px solid ${theme.colors.primary}`,
              borderRadius: 8,
              boxShadow: theme.shadows.md,
              zIndex: 9999,
              listStyle: 'none',
              padding: 0,
              margin: 0,
              minWidth: 120,
            }}
            onContextMenu={e => e.preventDefault()}
          >
            <li
              style={{ padding: '10px 18px', cursor: 'pointer', borderBottom: `1px solid ${theme.colors.border}` }}
              onClick={() => openEditModal(contextMenu.customer)}
            >
              Edit
            </li>
            <li
              style={{ padding: '10px 18px', cursor: 'pointer', color: theme.colors.error }}
              onClick={() => handleDelete(contextMenu.customer.customerNo)}
            >
              Delete
            </li>
          </ul>
        )}
        {/* Edit Modal */}
        {editModal.open && (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={closeEditModal}
          >
            <form
              onClick={e => e.stopPropagation()}
              onSubmit={handleEditSubmit}
              style={{
                background: theme.colors.surface,
                borderRadius: 12,
                padding: 32,
                minWidth: 320,
                boxShadow: theme.shadows.lg,
                color: theme.colors.text
              }}
            >
              <h3 style={{ color: theme.colors.primary, marginBottom: 24 }}>Edit Customer</h3>
              <div style={commonStyles.formGroup}>
                <label style={commonStyles.label}>Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                  style={commonStyles.input}
                  required
                />
              </div>
              <div style={commonStyles.formGroup}>
                <label style={commonStyles.label}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  style={commonStyles.input}
                  required
                />
              </div>
              <div style={commonStyles.formGroup}>
                <label style={commonStyles.label}>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  style={commonStyles.input}
                />
              </div>
              <div style={commonStyles.formGroup}>
                <label style={commonStyles.label}>CNIC</label>
                <input
                  type="text"
                  value={editForm.cnic}
                  onChange={e => setEditForm(f => ({ ...f, cnic: e.target.value }))}
                  style={commonStyles.input}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                <button type="submit" style={commonStyles.button.primary}>Save</button>
                <button type="button" style={commonStyles.button.secondary} onClick={closeEditModal}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      {filteredCustomers.length === 0 && !message && (
        <div style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.xl, fontSize: '1.1rem' }}>
          {filter ? 'No customers found matching your search.' : 'No customers available.'}
        </div>
      )}
    </div>
  );
}

export default Customers; 