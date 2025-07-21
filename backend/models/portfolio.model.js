const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./customer.model');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  portfolioName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  initialCapital: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  customerNo: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Customer,
      key: 'customerNo'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  timestamps: false,
  tableName: 'portfolios'
});

Portfolio.belongsTo(Customer, { foreignKey: 'customerNo', targetKey: 'customerNo' });
Customer.hasMany(Portfolio, { foreignKey: 'customerNo', sourceKey: 'customerNo' });


module.exports = Portfolio; 