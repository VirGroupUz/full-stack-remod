const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
require('dotenv').config({ path: '.env' });
const analyticsRoutes = require('./routes/analytics');
const faqRoutes = require('./routes/faq');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/faq', faqRoutes);



// Swagger Documentation
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Create default admin account and FAQs
const initializeData = async () => {
    try {
        // Default admin
        const adminExists = await User.findOne({ email: 'admin@dernmarket.com' });
        if (!adminExists) {
            const admin = new User({
                name: 'Admin',
                email: 'admin@dernmarket.com',
                password: await bcrypt.hash('admin123', 10), // Default password: admin123
                role: 'admin',
            });
            await admin.save();
            console.log('Default admin created: admin@dernmarket.com / admin123');
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
};

initializeData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
    console.log(` Swagger Docs available at http://localhost:${PORT}/api-docs`);
});