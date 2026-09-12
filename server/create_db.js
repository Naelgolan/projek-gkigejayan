const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        password: process.env.DB_PASS || 'admin123',
        port: 5432,
        database: 'postgres' // Connect to default DB first
    });

    try {
        await client.connect();
        const dbName = process.env.DB_NAME || 'Gki Gejayan';
        
        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        
        if (res.rowCount === 0) {
            console.log(`Creating database "${dbName}"...`);
            // MUST use double quotes for names with spaces
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log('Database created successfully.');
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
