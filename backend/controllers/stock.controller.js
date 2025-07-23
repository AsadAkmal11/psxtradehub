const Stock = require('../models/stock.model');
const csv = require('csv-parser');
const multer = require('multer');
const fs = require('fs');

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// Store preview data in memory (for demo; in production, use a better approach)
let previewCache = [];

const preview = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const results = []; 
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      previewCache = results;
      fs.unlinkSync(req.file.path);
      res.json({ preview: results });
    });
};

const save = async (req, res) => {
  const previewData = req.body.data; //  Take from frontend

  if (!previewData || !previewData.length) {
    return res.status(400).json({ message: 'No stock data to save' });
  }

  try {
    // 💡 Upsert each row or use bulkCreate
    for (const stock of previewData) {
      await Stock.upsert({
        date: stock['Date'],
        symbol: stock['Symbol'],
        code: parseInt(stock['Code']),
        companyName: stock['Company Name'],
        openPrice: parseFloat(stock['Open Price']),
        highPrice: parseFloat(stock['High Price']),
        lowPrice: parseFloat(stock['Low Price']),
        closePrice: parseFloat(stock['Close Price']),
        volume: parseInt(stock['Volume']),
        previousClose: parseFloat(stock['Previous Close']),
      });
    }

    res.json({ message: 'Stocks saved successfully' });
  } catch (err) {
    console.error('❌ Save error:', err);
    res.status(500).json({ message: 'Failed to save stocks', error: err.message });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      attributes: ['id', 'Symbol', 'Company_Name', 'Close_Price', 'Previous_Close', 'Volume'],
      order: [['Symbol', 'ASC']],
      raw: true
    });
    console.log('Stocks raw:', stocks);
    // Calculate change % and last price for each stock
    const stocksWithChange = stocks.map(s => {
      const price = s.Close_Price;
      const prev = s.Previous_Close;
      const change = prev && prev !== 0 ? (((price - prev) / prev) * 100).toFixed(2) : '0.00';
      return {
        id: s.id,
        symbol: s.Symbol,
        name: s.Company_Name,
        price,
        change,
        volume: s.Volume || Math.floor(Math.random() * 1000000),
      };
    });
    res.json({ stocks: stocksWithChange });
  } catch (err) {
    console.error('Error fetching stocks:', err);
    res.status(500).json({ message: 'Failed to fetch stocks', error: err.message });
  }
};



module.exports = { upload, preview, save, getAllStocks }; 