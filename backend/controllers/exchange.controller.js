const Exchange = require('../models/exchange.model');

exports.createExchange = async (req, res) => {
  try {
    const { name, country, timezone, currency } = req.body;
    const exchange = await Exchange.create({
      name,
      countryName: country.name,
      countryCode: country.code,
      timezone,
      currencyName: currency.name,
      currencyCode: currency.code,
    });
    res.status(201).json({ message: 'Exchange created', exchange });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create exchange', error: error.message });
  }
};
