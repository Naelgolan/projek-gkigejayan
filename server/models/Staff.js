const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.TEXT,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    order: {
        type: DataTypes.INTEGER,
    },
});

module.exports = Staff;
