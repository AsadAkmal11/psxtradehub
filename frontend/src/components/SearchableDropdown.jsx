import React, { useState, useRef, useEffect } from 'react';

function SearchableDropdown({ options, value, onChange, placeholder, disabled }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Filter options based on search
  const filtered = options.filter(opt =>
    (opt?.toLowerCase?.() || '').includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: 16 }}>
      <input
        type="text"
        value={search || value || ''}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setOpen(true)}
        onChange={e => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        style={{ width: '100%', padding: '0.75rem', borderRadius: 4, border: '1px solid #4a5568', background: disabled ? '#2d3748' : '#1a202c', color: '#f7fafc', cursor: disabled ? 'not-allowed' : 'auto' }}
      />
      {open && !disabled && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            background: '#23272f',
            border: '1px solid #4a5568',
            borderRadius: 4,
            maxHeight: 180,
            overflowY: 'auto',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {filtered.length === 0 && (
            <li style={{ padding: '0.75rem', color: '#a0aec0' }}>No results</li>
          )}
          {filtered.map(opt => (
            <li
              key={opt}
              style={{ padding: '0.75rem', cursor: 'pointer' }}
              onClick={() => {
                onChange(opt);
                setSearch('');
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchableDropdown; 