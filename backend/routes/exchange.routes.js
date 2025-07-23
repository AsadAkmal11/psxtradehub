const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchange.controller');

router.post('/exchanges', exchangeController.createExchange);

module.exports = router; 