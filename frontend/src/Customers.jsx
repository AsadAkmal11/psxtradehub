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

  // Enhanced modal styles
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    },
    modal: {
      background: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: '32px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: theme.shadows.lg,
      border: `2px solid ${theme.colors.border}`,
      position: 'relative',
      animation: 'modalSlideIn 0.3s ease-out'
    },
    header: {
      color: theme.colors.primary,
      marginBottom: '24px',
      fontSize: '1.5rem',
      fontWeight: '700',
      textAlign: 'center',
      borderBottom: `2px solid ${theme.colors.border}`,
      paddingBottom: '16px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      color: theme.colors.text,
      fontSize: '0.95rem',
      fontWeight: '600',
      marginBottom: '8px',
      letterSpacing: '0.5px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: theme.colors.secondary,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      color: theme.colors.text,
      fontSize: '1rem',
      transition: theme.transitions.normal,
      outline: 'none',
      boxSizing: 'border-box',
      '&:focus': {
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 3px ${theme.colors.primary}33`
      },
      '&:hover': {
        borderColor: theme.colors.borderHover
      }
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    button: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.secondary,
        border: `2px solid ${theme.colors.primary}`,
        borderRadius: theme.borderRadius.md,
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: theme.transitions.normal,
        outline: 'none',
        letterSpacing: '0.5px',
        minWidth: '100px',
        '&:hover': {
          backgroundColor: theme.colors.secondary,
          color: theme.colors.primary,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.lg
        }
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `2px solid ${theme.colors.primary}`,
        borderRadius: theme.borderRadius.md,
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: theme.transitions.normal,
        outline: 'none',
        minWidth: '100px',
        '&:hover': {
          backgroundColor: theme.colors.primary,
          color: theme.colors.secondary
        }
      }
    }
  };

  // Responsive styles for mobile
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    modalStyles.modal.padding = '24px';
    modalStyles.modal.maxWidth = '95vw';
    modalStyles.buttonGroup.flexDirection = 'column';
    modalStyles.buttonGroup.gap = '12px';
  }

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
        {/* Enhanced Edit Modal */}
        {editModal.open && (
          <div
            style={modalStyles.overlay}
            onClick={closeEditModal}
          >
            <form
              onClick={e => e.stopPropagation()}
              onSubmit={handleEditSubmit}
              style={modalStyles.modal}
            >
              <h3 style={modalStyles.header}>Edit Customer</h3>
              
              <div style={modalStyles.formGroup}>
                <label style={modalStyles.label}>Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                  style={modalStyles.input}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div style={modalStyles.formGroup}>
                <label style={modalStyles.label}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  style={modalStyles.input}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div style={modalStyles.formGroup}>
                <label style={modalStyles.label}>Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  style={modalStyles.input}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div style={modalStyles.formGroup}>
                <label style={modalStyles.label}>CNIC</label>
                <input
                  type="text"
                  value={editForm.cnic}
                  onChange={e => setEditForm(f => ({ ...f, cnic: e.target.value }))}
                  style={modalStyles.input}
                  placeholder="Enter CNIC number"
                  required
                />
              </div>
              
              <div style={modalStyles.buttonGroup}>
                <button 
                  type="submit" 
                  style={modalStyles.button.primary}
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  style={modalStyles.button.secondary} 
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
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
      
      {/* Add CSS for modal animation */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @media (max-width: 768px) {
          .modal-content {
            padding: 20px;
            margin: 10px;
            max-width: calc(100vw - 20px);
          }
        }
      `}</style>
    </div>
  );
}

export default Customers; 