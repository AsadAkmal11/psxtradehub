const Customer = require('../models/customer.model');
const Portfolio = require('../models/portfolio.model');
const sequelize = require('../config/db');
const { TradeOrder } = require('../models/tradeorder.model');
const { Stock } = require('../models/stock.model');
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

exports.getCustomerPortfolio = async (req, res) => {
    const{customerNo} = req.params;
    try{
      const TradeData = await TradeOrder.findAll({where:
        {customerNo,
          
        },
      attributes:[
        'symbol', [sequelize.fn('sum', sequelize.col('quantity')), 'totalQuantity'], [sequelize.fn('sum', sequelize.col('price')), 'totalprice']
      ],
    group:['symbol'],
    raw:true
  });
  const result=[];
  for(let i=0; i<TradeData.length; i++){
    const {symbol, totalQuantity, totalprice} = TradeData[i];
    const avgprice= totalprice/totalQuantity;
    const stock= await Stock.findOne({where:{symbol}});
    const currentPrice = stock ? stock.currentPrice : 0;
    const marketValue = totalQuantity * currentPrice;
    const profitLoss = (currentPrice - avgprice)* totalQuantity;
    result.push({symbol, totalQuantity, avgprice, currentPrice, marketValue, profitLoss});
  }
    const totalInvested = result.reduce((acc, r) => acc + r.avgprice * r.quantity, 0);
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