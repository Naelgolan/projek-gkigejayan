const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProductionOrSupabase = process.env.DATABASE_URL || process.env.DB_SSL === 'true';

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize(
        process.env.DB_NAME || 'Gki Gejayan',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASS || 'admin123',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            dialectOptions: isProductionOrSupabase ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {},
            logging: false,
        }
    );

module.exports = sequelize;
