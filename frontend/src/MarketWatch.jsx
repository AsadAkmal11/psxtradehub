import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from './components/BackButton';

function MarketWatch({ onBack }) {
  const [stocks, setStocks] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('symbol');
  const [sortAsc, setSortAsc] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks')
      .then(res => setStocks(res.data.stocks))
      .catch(() => setStocks([]));
  }, []);

  const handleAddToWatchlist = async (stockSymbol) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to add to a watchlist.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/watchlist', 
        { stockSymbol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add to watchlist.');
    }
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredStocks = stocks
    .filter(s =>
      (s.symbol || '').toLowerCase().includes(filter.toLowerCase()) ||
      (s.name || '').toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="marketwatch-container">
      <BackButton onBack={onBack} />
      <h2>Market Watch</h2>
      {message && <div className="watchlist-message">{message}</div>}
      <input
        type="text"
        placeholder="Filter by symbol or name"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="marketwatch-filter"
      />
      <div className="marketwatch-table-wrapper">
        {filteredStocks.length === 0 ? (
          <div className="marketwatch-error">
            No data available in the stocks table.
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('symbol')}>Symbol</th>
                <th onClick={() => handleSort('name')}>Name</th>
                <th onClick={() => handleSort('price')}>Last Price</th>
                <th onClick={() => handleSort('change')}>Change %</th>
                <th onClick={() => handleSort('volume')}>Volume</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map(stock => (
                <tr key={stock.id}>
                  <td>{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>{Number(stock.price).toFixed(2)}</td>
                  <td style={{ color: stock.change >= 0 ? '#0ECB81' : '#F6465D', fontWeight: 600 }}>
                    {stock.change}%
                  </td>
                  <td>{stock.volume?.toLocaleString()}</td>
                  <td>
                    <button 
                      className="watchlist-btn"
                      onClick={() => handleAddToWatchlist(stock.symbol)}
                    >
                      Add to Watchlist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MarketWatch; 