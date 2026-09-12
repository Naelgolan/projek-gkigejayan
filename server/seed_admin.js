const Admin = require('./models/Admin');
const sequelize = require('./config/database');

async function seedAdmin() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const email = 'admingkigejayan@gmail.com';
        const password = 'gkigejayan2026!';

        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin user already exists.');
        } else {
            await Admin.create({ email, password });
            console.log('Admin user seeded successfully.');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        process.exit();
    }
}

seedAdmin();
