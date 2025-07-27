const TradeOrder = require('../models/tradeorder.model');

exports.createOrder = async (req, res) => {
  try {
    const { customerNo, symbol, broker, portfolioId, tradeDate, action, orderType, quantity, price } = req.body;
    if (!customerNo || !symbol || !broker || !portfolioId || !tradeDate || !action || !orderType || !quantity || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const order = await TradeOrder.create({
      customerNo,
      symbol,
      broker,
      portfolioId,
      tradeDate,
      action,
      orderType,
      quantity,
      price,
      status: 'pending',
    });
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await TradeOrder.findAll();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
}; 