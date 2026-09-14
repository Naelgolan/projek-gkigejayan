const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket) => {
    console.log('Client connected via WebSocket:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Attach Socket.io instance to req for route usage
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('GKI Gejayan API is running (PostgreSQL with Realtime WebSockets)...');
});

// Import Models for Sync
const Pastor = require('./models/Pastor');
const Ministry = require('./models/Ministry');
const Schedule = require('./models/Schedule');
const Event = require('./models/Event');
const Admin = require('./models/Admin');
const Contact = require('./models/Contact');
const Volunteer = require('./models/Volunteer');
const FooterBlock = require('./models/FooterBlock');
const Staff = require('./models/Staff');
const OfficeInfo = require('./models/OfficeInfo');

// Set up Associations
Volunteer.belongsTo(Ministry, { foreignKey: 'ministryId' });
Ministry.hasMany(Volunteer, { foreignKey: 'ministryId' });

// Implementation of basic routes
const pastorRoutes = require('./routes/pastors');
const ministryRoutes = require('./routes/ministries');
const scheduleRoutes = require('./routes/schedules');
const eventRoutes = require('./routes/events');
const contactRoutes = require('./routes/contacts');
const authRoutes = require('./routes/auth');
const footerBlockRoutes = require('./routes/footerBlocks');
const staffRoutes = require('./routes/staff');
const officeInfoRoutes = require('./routes/officeInfo');

app.use('/api/pastors', pastorRoutes);
app.use('/api/ministries', ministryRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/footer-blocks', footerBlockRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/office-info', officeInfoRoutes);

// Database Connection & Sync
sequelize.authenticate()
    .then(() => {
        console.log('PostgreSQL (Sequelize) Connected');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Database Synced');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT} with Socket.IO enabled`);
        });
    })
    .catch(err => {
        console.log('Database Error:', err);
    });

