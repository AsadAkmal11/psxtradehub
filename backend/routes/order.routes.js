const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authenticate = require('../middleware/auth.middleware');

// Create a new order
router.post('/orders', authenticate, orderController.createOrder);
// Get all orders
router.get('/orders', authenticate, orderController.getAllOrders);

module.exports = router; 