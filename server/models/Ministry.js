const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ministry = sequelize.define('Ministry', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.STRING,
    },
});

module.exports = Ministry;
