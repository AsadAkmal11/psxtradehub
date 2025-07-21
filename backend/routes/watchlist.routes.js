const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlist.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/watchlist', authMiddleware, watchlistController.addToWatchlist);
router.delete('/watchlist/:id', authMiddleware, watchlistController.removeFromWatchlist);
router.get('/watchlist', authMiddleware, watchlistController.getUserWatchlist);

module.exports = router; 