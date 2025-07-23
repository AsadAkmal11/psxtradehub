const Currency = require('../models/currency.model');

// Create a new currency
exports.createCurrency = async (req, res) => {
  const { name, code } = req.body;
  try {
    const currency = await Currency.create({ name, code });
    res.status(201).json({ message: 'Currency created successfully', currency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create currency', error: error.message });
  }
};

// Get all currencies
exports.getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll();
    res.status(200).json({ currencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch currencies', error: error.message });
  }
};

// Update a currency
exports.updateCurrency = async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;
  try {
    const [updated] = await Currency.update({ name, code }, { where: { id } });
    if (updated) {
      const updatedCurrency = await Currency.findByPk(id);
      res.status(200).json({ message: 'Currency updated', currency: updatedCurrency });
    } else {
      res.status(404).json({ message: 'Currency not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update currency', error: error.message });
  }
};

// Delete a currency
exports.deleteCurrency = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Currency.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Currency deleted' });
    } else {
      res.status(404).json({ message: 'Currency not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete currency', error: error.message });
  }
}; 