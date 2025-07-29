import React, { useEffect, useState } from 'react';
import { commonStyles, theme } from './components/ThemeProvider';

function VirtualPortfolioScreen() {
    const [inputCustomerNo, setInputCustomerNo] = useState('');
    const [customerNo, setCustomerNo] = useState('');
    const [portfolio, setPortfolio] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!customerNo) {
            setPortfolio(null);
            return;
        }
        setError('');
        const fetchData = () => {
            fetch(`/api/customerPortfolio/${customerNo}`)
                .then((response) => {
                    if (!response.ok) throw new Error('Not found');
                    return response.json();
                })
                .then((data) => setPortfolio(data))
                .catch((error) => {
                    setPortfolio(null);
                    setError('Failed to fetch portfolio.');
                });
        };
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [customerNo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputCustomerNo.trim()) {
            setError('Please enter a customer number.');
            setPortfolio(null);
            return;
        }
        setCustomerNo(inputCustomerNo.trim());
    };

    return (
        <div style={{ ...commonStyles.container, maxWidth: 900, margin: '2rem auto' }}>
            <h2 style={commonStyles.header}>Virtual Portfolio</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.xl, justifyContent: 'center' }}>
                <label htmlFor="customerNoInput" style={{ ...commonStyles.label, margin: 0 }}>Customer No:</label>
                <input
                    id="customerNoInput"
                    type="text"
                    value={inputCustomerNo}
                    onChange={e => setInputCustomerNo(e.target.value)}
                    style={{ ...commonStyles.input, width: 180, minWidth: 120 }}
                    placeholder="Enter customer no."
                />
                <button type="submit" style={commonStyles.button.primary}>View Portfolio</button>
            </form>
            {error && <div style={commonStyles.message.error}>{error}</div>}
            {portfolio ? (
                <>
                    <div style={{ display: 'flex', gap: theme.spacing.xl, justifyContent: 'center', marginBottom: theme.spacing.xl, flexWrap: 'wrap' }}>
                        <div style={{ background: '#23272f', border: `2px solid ${theme.colors.primary}`, borderRadius: theme.borderRadius.md, padding: theme.spacing.lg, minWidth: 180, textAlign: 'center', color: theme.colors.primary, fontWeight: 700 }}>
                            <div style={{ color: theme.colors.textSecondary, fontWeight: 500, fontSize: '1rem', marginBottom: 4 }}>Total Invested</div>
                            <div style={{ fontSize: '1.3rem' }}>{portfolio.totals.totalInvested}</div>
                        </div>
                        <div style={{ background: '#23272f', border: `2px solid ${theme.colors.primary}`, borderRadius: theme.borderRadius.md, padding: theme.spacing.lg, minWidth: 180, textAlign: 'center', color: theme.colors.primary, fontWeight: 700 }}>
                            <div style={{ color: theme.colors.textSecondary, fontWeight: 500, fontSize: '1rem', marginBottom: 4 }}>Market Value</div>
                            <div style={{ fontSize: '1.3rem' }}>{portfolio.totals.totalMarketValue}</div>
                        </div>
                        <div style={{ background: '#23272f', border: `2px solid ${theme.colors.primary}`, borderRadius: theme.borderRadius.md, padding: theme.spacing.lg, minWidth: 180, textAlign: 'center', color: theme.colors.primary, fontWeight: 700 }}>
                            <div style={{ color: theme.colors.textSecondary, fontWeight: 500, fontSize: '1rem', marginBottom: 4 }}>Profit / Loss</div>
                            <div style={{ fontSize: '1.3rem', color: portfolio.totals.totalProfitLoss >= 0 ? theme.colors.success : theme.colors.error }}>{portfolio.totals.totalProfitLoss}</div>
                        </div>
                    </div>

                    <h3 style={{ color: theme.colors.primary, fontSize: '1.1rem', marginBottom: theme.spacing.md, borderBottom: `2px solid ${theme.colors.border}`, paddingBottom: theme.spacing.sm, textAlign: 'left' }}>Stocks</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Quantity</th>
                                    <th>Avg Buy Price</th>
                                    <th>Current Price</th>
                                    <th>Market Value</th>
                                    <th>P/L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.portfolio.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                        <td>{item.symbol}</td>
                                        <td>{item.totalQuantity}</td>
                                        <td>{item.avgprice.toFixed(2)}</td>
                                        <td>{item.currentPrice}</td>
                                        <td>{item.marketValue.toFixed(2)}</td>
                                        <td style={{ color: item.profitLoss >= 0 ? theme.colors.success : theme.colors.error, fontWeight: 600 }}>{item.profitLoss.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                customerNo && !error && <p style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.xl }}>Loading portfolio...</p>
            )}
        </div>
    );
}

export default VirtualPortfolioScreen;
