const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stock = sequelize.define('Stock', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'Date'
  },

  symbol: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'Symbol'
  },
  code: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'Code'
  },
  companyName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'Company_Name'
  },
  openPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'Open_Price'
  },
  highPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'High_Price'
  },
  lowPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'Low_Price'
  },
  closePrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'Close_Price'
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'Volume'
  },
  previousClose: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'Previous_Close'
  },
}, {
  timestamps: false,
  tableName: 'stocks'
});

module.exports = Stock;
