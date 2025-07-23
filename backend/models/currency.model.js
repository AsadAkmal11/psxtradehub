const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Currency = sequelize.define('Currency', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'currency'
});

module.exports = Currency; 