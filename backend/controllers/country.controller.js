const Country = require('../models/country.model');

exports.createCountry = async (req, res) => {
  const { name, code } = req.body;
  try {
    const country = await Country.create({ name, code });
    res.status(201).json({ message: 'Country created successfully', country });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create country', error: error.message });
  }
};

// Get all countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.status(200).json({ countries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch countries', error: error.message });
  }
};

// Update a country
exports.updateCountry = async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;
  try {
    const [updated] = await Country.update({ name, code }, { where: { id } });
    if (updated) {
      const updatedCountry = await Country.findByPk(id);
      res.status(200).json({ message: 'Country updated', country: updatedCountry });
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update country', error: error.message });
  }
};

// Delete a country
exports.deleteCountry = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Country.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Country deleted' });
    } else {
      res.status(404).json({ message: 'Country not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete country', error: error.message });
  }
}; 