const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');

router.post('/country', countryController.createCountry);
router.get('/country', countryController.getCountries);
router.put('/country/:id', countryController.updateCountry);
router.delete('/country/:id', countryController.deleteCountry);

module.exports = router; 