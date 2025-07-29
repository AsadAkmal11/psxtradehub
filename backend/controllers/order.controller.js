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
    const { filter, date } = req.query;
    let whereClause = {};

    const getDateString = (date) => {
      return date.toISOString().split('T')[0];
    };

    // Apply date filtering based on the filter parameter
    if (filter) {
      const today = new Date();
      
      switch (filter.toLowerCase()) {
        case 'today':
          whereClause.tradeDate = getDateString(today);
          break;
          
        // case 'yesterday':
        //   const yesterday = new Date(today);
        //   yesterday.setDate(today.getDate() - 1);
        //   whereClause.tradeDate = getDateString(yesterday);
        //   break;
          
        // case 'tomorrow':
        //   const tomorrow = new Date(today);
        //   tomorrow.setDate(today.getDate() + 1);
        //   whereClause.tradeDate = getDateString(tomorrow);
        //   break;
          
        case 'specific':
          if (date) {
            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
              return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
            }
            whereClause.tradeDate = date;
          } else {
            return res.status(400).json({ message: 'Date parameter is required for specific date filter' });
          }
          break;
          
        // case 'all':
          // No where clause - fetch all orders
          // break;
          
        default:
          // Default to today if invalid filter
          whereClause.tradeDate = getDateString(today);
          break;
      }
    } else {
      // Default to today if no filter specified
      whereClause.tradeDate = getDateString(new Date());
    }

    const orders = await TradeOrder.findAll({
      where: whereClause,
      order: [['tradeDate', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({ 
      orders,
      filter: filter || 'today',
      date: whereClause.tradeDate || 'all'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};