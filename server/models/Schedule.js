const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
    },
    youtubeLink: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.TEXT,
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

module.exports = Schedule;
