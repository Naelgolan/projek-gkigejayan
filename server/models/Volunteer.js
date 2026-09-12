const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Volunteer = sequelize.define('Volunteer', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    ministryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: true }
    }
});

module.exports = Volunteer;
