const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/customer-portfolio', authMiddleware, customerController.createCustomerAndPortfolio);

module.exports = router; 