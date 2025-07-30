const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require('../middleware/auth.middleware');
const Portfolio = require('../models/portfolio.model');
router.post('/customer',authMiddleware,customerController.createCustomer);
router.post('/customer-portfolio', authMiddleware, customerController.createCustomerAndPortfolio);

// Get all customers
router.get('/customers', customerController.getAllCustomers);

router.get('/portfolios', async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll();
    res.json({ portfolios });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolios', error: error.message });
  }
});
router.get('/customerPortfolio/:customerNo', customerController.getCustomerPortfolio);
router.post('/CustomerPortfolio/:customerNo',customerController.deleteCustomer);
router.put('/customers/:customerNo', customerController.editCustomer);
module.exports = router; 