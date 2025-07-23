const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currency.controller');

router.post('/currency', currencyController.createCurrency);
router.get('/currency', currencyController.getCurrencies);
router.put('/currency/:id', currencyController.updateCurrency);
router.delete('/currency/:id', currencyController.deleteCurrency);

module.exports = router; 