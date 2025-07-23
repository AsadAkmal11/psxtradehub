const Customer = require('../models/customer.model');
const Portfolio = require('../models/portfolio.model');
const sequelize = require('../config/db');

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

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
}; 