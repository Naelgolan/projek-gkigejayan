const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || 'Gki Gejayan', process.env.DB_USER || 'postgres', process.env.DB_PASS || 'admin123', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;
