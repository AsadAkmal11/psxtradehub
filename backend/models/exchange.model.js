const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exchange = sequelize.define('Exchange', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  countryName: { type: DataTypes.STRING(100), allowNull: false },
  countryCode: { type: DataTypes.STRING(10), allowNull: false },
  timezone: { type: DataTypes.STRING(50) },
  currencyName: { type: DataTypes.STRING(100), allowNull: false },
  currencyCode: { type: DataTypes.STRING(10), allowNull: false },
}, {
  timestamps: false,
  tableName: 'exchanges'
});

module.exports = Exchange; 