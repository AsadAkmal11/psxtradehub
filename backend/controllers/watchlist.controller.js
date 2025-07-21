const Watchlist = require('../models/watchlist.model');
const User = require('../models/user.model');

exports.addToWatchlist = async (req, res) => {
  const userId = req.user.id; // assuming auth middleware sets req.user
  const { stockSymbol } = req.body;

  if (!stockSymbol) {
    return res.status(400).json({ message: 'Stock symbol is required.' });
  }

  try {
    // Prevent duplicate entries
    const exists = await Watchlist.findOne({ where: { userId, stockSymbol } });
    if (exists) {
      return res.status(409).json({ message: 'Stock already in watchlist.' });
    }
    const entry = await Watchlist.create({ userId, stockSymbol });
    res.status(201).json({ message: 'Added to watchlist.', entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add to watchlist.', error: error.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const deleted = await Watchlist.destroy({ where: { id, userId } });
    if (deleted) {
      res.json({ message: 'Removed from watchlist.' });
    } else {
      res.status(404).json({ message: 'Watchlist entry not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from watchlist.', error: error.message });
  }
};

exports.getUserWatchlist = async (req, res) => {
  const userId = req.user.id;
  try {
    const watchlist = await Watchlist.findAll({ where: { userId } });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch watchlist.', error: error.message });
  }
}; 