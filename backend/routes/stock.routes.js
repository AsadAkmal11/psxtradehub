const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');
const { authorizeAdmin } = require('../middleware/auth.middleware');
const { upload, preview, save, getAllStocks } = require('../controllers/stock.controller');

// Public: Get all stocks
router.get('/', getAllStocks);
// Preview CSV (admin only)
router.post('/preview', authenticate, authorizeAdmin, upload.single('file'), preview);
// Save stocks (admin only)
router.post('/save', authenticate, authorizeAdmin, save);

module.exports = router;    