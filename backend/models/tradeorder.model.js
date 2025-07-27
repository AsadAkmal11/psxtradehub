const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./customer.model');
const Portfolio = require('./portfolio.model');

const TradeOrder = sequelize.define('TradeOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  customerNo: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Customer,
      key: 'customerNo'
    }
  },
  symbol: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  broker: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  portfolioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Portfolio,
      key: 'id'
    }
  },
  tradeDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false
  },
  orderType: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  timestamps: false,
  tableName: 'trade_orders'
});

TradeOrder.belongsTo(Customer, { foreignKey: 'customerNo', targetKey: 'customerNo' });
Customer.hasMany(TradeOrder, { foreignKey: 'customerNo', sourceKey: 'customerNo' });
TradeOrder.belongsTo(Portfolio, { foreignKey: 'portfolioId' });
Portfolio.hasMany(TradeOrder, { foreignKey: 'portfolioId' });

module.exports = TradeOrder; 