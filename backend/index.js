require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' })); 


// 🔥 Add your auth routes here
const authRoutes = require('./routes/auth.routes'); // ✅
app.use('/api/auth', authRoutes); // ✅

const stockRoutes = require('./routes/stock.routes');
app.use('/api/stocks', stockRoutes);

// Test route (optional)
app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
require('./models/stock.model'); 
db.sync()
  .then(() => {
    console.log('Connected to MySQL');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err);    
  });
