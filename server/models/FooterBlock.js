const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FooterBlock = sequelize.define('FooterBlock', {
    blockType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instagramUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tiktokUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    facebookUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    youtubeUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

module.exports = FooterBlock;
