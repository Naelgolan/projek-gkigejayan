const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    documentUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    documentTitle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    googlePhotosUrl: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isPast: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Event;
