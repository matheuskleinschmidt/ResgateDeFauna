const { Sequelize } = require('sequelize');
const config = require('../database/config/config.js');

const env = process.env.NODE_ENV || 'development';
const options = config[env];

const sequelize = new Sequelize(options.database, options.username, options.password, options);

module.exports = sequelize;
