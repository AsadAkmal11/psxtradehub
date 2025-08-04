const Customer = require('../models/customer.model');
const Portfolio = require('../models/portfolio.model');
const sequelize = require('../config/db');
const TradeOrder = require('../models/tradeorder.model');
const Stock = require('../models/stock.model');
const { Op } = require('sequelize');

exports.createCustomerAndPortfolio = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    cnic,
    customerNo,
    portfolioName,
    initialCapital,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    // Check if customer already exists
    let customer = await Customer.findOne({ where: { customerNo } });

    if (!customer) {
      customer = await Customer.create({
        fullName,
        email,
        phone,
        cnic,
        customerNo,
      }, { transaction: t });
    }

    await Portfolio.create({
      portfolioName,
      initialCapital,
      customerNo: customer.customerNo,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Customer and portfolio created successfully',
      customer,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({
      message: 'Failed to create customer and portfolio',
      error: error.message,
    });
  }
};

// New: Save only customer
exports.createCustomer = async (req, res) => {
  const { fullName, email, phone, cnic, customerNo } = req.body;
  try {
    let customer = await Customer.findOne({ where: { customerNo } });
    if (customer) {
      return res.status(409).json({ message: 'Customer already exists.' });
    }
    customer = await Customer.create({ fullName, email, phone, cnic, customerNo });
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create customer', error: error.message });
  }
};
exports.createPortfolio = async (req, res) => {
  const { portfolioName, portfolioNo, customerNo, initialCapital } = req.body;
  try {
    // Optionally, check if customer exists
    const customer = await Customer.findOne({ where: { customerNo } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Create the portfolio
    const portfolio = await Portfolio.create({
      portfolioName,
      portfolioNo,
      customerNo,
      initialCapital,
    });
    res.status(201).json({ message: 'Portfolio created successfully', portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create portfolio', error: error.message });
  }
};
exports.getCustomerPortfolio = async (req, res) => {
    const { customerNo } = req.params;
    try {
      // Fetch all trade orders for the customer, grouped by symbol and action
      const TradeData = await TradeOrder.findAll({
        where: { customerNo },
        attributes: [
          'symbol',
          'action',
          [sequelize.fn('sum', sequelize.col('quantity')), 'totalQuantity'],
          [sequelize.fn('sum', sequelize.col('price')), 'totalPrice']
        ],
        group: ['symbol', 'action'],
        raw: true
      });

      // Aggregate buy and sell for each symbol
      const symbolMap = {};
      for (const row of TradeData) {
        const { symbol, action, totalQuantity, totalPrice } = row;
        if (!symbolMap[symbol]) {
          symbolMap[symbol] = { buyQty: 0, buyAmt: 0, sellQty: 0, sellAmt: 0 };
        }
        if (action === 'buy') {
          symbolMap[symbol].buyQty += Number(totalQuantity);
          symbolMap[symbol].buyAmt += Number(totalPrice);
        } else if (action === 'sell') {
          symbolMap[symbol].sellQty += Number(totalQuantity);
          symbolMap[symbol].sellAmt += Number(totalPrice);
        }
      }

      const result = [];
      for (const symbol in symbolMap) {
        const { buyQty, buyAmt, sellQty, sellAmt } = symbolMap[symbol];
        const netQty = buyQty - sellQty;
        const netAmt = buyAmt - sellAmt;
        // Do NOT skip if netQty is zero; show all symbols
        const avgprice = netQty !== 0 ? netAmt / netQty : 0;
        // Use correct field for Stock lookup and price
        const stock = await Stock.findOne({ where: { symbol } });
        const currentPrice = stock ? stock.closePrice : 0;
        const marketValue = netQty * currentPrice;
        const profitLoss = (currentPrice - avgprice) * netQty;
        result.push({ symbol, totalQuantity: netQty, avgprice, currentPrice, marketValue, profitLoss });
      }
      const totalInvested = result.reduce((acc, r) => acc + r.avgprice * r.totalQuantity, 0);
      const totalMarketValue = result.reduce((acc, r) => acc + r.marketValue, 0);
      const totalProfitLoss = totalMarketValue - totalInvested;

      res.status(200).json({
        portfolio: result,
        totals: {
          totalInvested: parseFloat(totalInvested.toFixed(2)),
          totalMarketValue: parseFloat(totalMarketValue.toFixed(2)),
          totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2))
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch portfolio', error: error.message });
    }
};
// Get all customers
exports.getAllCustomers = async (req, res) => {
 
  try { 
    const customers = await Customer.findAll();
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
}; 
exports.deleteCustomer = async (req, res) => {
  const { customerNo } = req.params;
  const t = await sequelize.transaction();
  
  try {
    console.log(`Starting deletion process for customer: ${customerNo}`);
    
    // Check if customer exists
    const customer = await Customer.findOne({ where: { customerNo } });
    if (!customer) {
      await t.rollback();
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Get all portfolios for this customer first
    const portfolios = await Portfolio.findAll({ 
      where: { customerNo }, 
      transaction: t 
    });
    console.log(`Found ${portfolios.length} portfolios for customer ${customerNo}`);
    
    // Get portfolio IDs
    const portfolioIds = portfolios.map(p => p.id);
    console.log(`Portfolio IDs: ${portfolioIds.join(', ')}`);
    
    // Step 1: Delete ALL trade orders for this customer (by customerNo)
    console.log('Step 1: Deleting ALL trade orders for this customer...');
    const deletedTradeOrders = await TradeOrder.destroy({ 
      where: { customerNo }, 
      transaction: t 
    });
    console.log(`Successfully deleted ${deletedTradeOrders} trade orders by customerNo`);
    
    // Step 2: Delete all portfolios for this customer
    console.log('Step 2: Deleting portfolios...');
    const deletedPortfolios = await Portfolio.destroy({ 
      where: { customerNo }, 
      transaction: t 
    });
    console.log(`Successfully deleted ${deletedPortfolios} portfolios`);
    
    // Step 3: Delete the customer
    console.log('Step 3: Deleting customer...');
    await customer.destroy({ transaction: t });
    console.log(`Successfully deleted customer: ${customerNo}`);
    
    // Commit the transaction
    await t.commit();
    console.log('Transaction committed successfully');
    
    res.status(200).json({ 
      message: 'Customer deleted successfully',
      deletedTradeOrders,
      deletedPortfolios
    });
    
  } catch (error) {
    await t.rollback();
    console.error('Delete customer error details:', {
      message: error.message,
      code: error.code,
      sql: error.sql,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Failed to delete customer due to database constraints',
      details: error.message,
      code: error.code
    });
  }
};
// Edit customer details (except customerNo)
exports.editCustomer = async (req, res) => {
  const { customerNo } = req.params;  // customerNo comes from URL
  const { fullName, email, phone, cnic } = req.body; // Editable fields

  try {
    // 1. Check if customer exists
    const customer = await Customer.findOne({ where: { customerNo } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // 2. Update only editable fields
    await customer.update({
      fullName,
      email,
      phone,
      cnic
    });

    // 3. Respond with updated customer
    res.status(200).json({
      message: 'Customer updated successfully',
      customer
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Failed to update customer', 
      error: error.message 
    });
  }
};
