const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pastor = sequelize.define('Pastor', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    order: {
        type: DataTypes.INTEGER,
    },
});

module.exports = Pastor;
