require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors');
app.use(cors());

app.use(express.json({ limit: '10mb' })); 



const authRoutes = require('./routes/auth.routes'); 
app.use('/api/auth', authRoutes); 

const stockRoutes = require('./routes/stock.routes');
app.use('/api/stocks', stockRoutes);

const customerRoutes = require('./routes/customer.routes');
app.use('/api', customerRoutes);

const watchlistRoutes = require('./routes/watchlist.routes');
app.use('/api', watchlistRoutes);

const countryRoutes = require('./routes/country.routes');
app.use('/api', countryRoutes);

const currencyRoutes = require('./routes/currency.routes');
app.use('/api', currencyRoutes);

const exchangeRoutes = require('./routes/exchange.routes');
app.use('/api', exchangeRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/api', orderRoutes);


app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
require('./models/stock.model');
require('./models/customer.model');
require('./models/portfolio.model');
require('./models/watchlist.model');
require('./models/country.model');
require('./models/currency.model');
require('./models/exchange.model');
require('./models/tradeorder.model');

db.sync()
  .then(() => {
    console.log('Connected to MySQL');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err);    
  });
