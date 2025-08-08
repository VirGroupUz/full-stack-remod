const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product'); // Product modelini import qilish

const getSalesReport = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'delivered' });

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getFullYear(), now.getMonth() - 1, now.getDate());
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

        const dailySales = orders
            .filter(order => order.createdAt && new Date(order.createdAt) >= today)
            .reduce((sum, order) => sum + (order.total || 0), 0);

        const weeklySales = orders
            .filter(order => order.createdAt && new Date(order.createdAt) >= weekAgo)
            .reduce((sum, order) => sum + (order.total || 0), 0);

        const monthlySales = orders
            .filter(order => order.createdAt && new Date(order.createdAt) >= monthAgo)
            .reduce((sum, order) => sum + (order.total || 0), 0);

        const yearlySales = orders
            .filter(order => order.createdAt && new Date(order.createdAt) >= yearAgo)
            .reduce((sum, order) => sum + (order.total || 0), 0);

        res.json({
            daily: dailySales,
            weekly: weeklySales,
            monthly: monthlySales,
            yearly: yearlySales,
        });
    } catch (error) {
        console.error('Error getting sales report:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTopProducts = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');
        const productSales = {};

        orders.forEach(order => {
            order.products.forEach(item => {
                if (item.productId) { // productId mavjudligini tekshirish
                    const productId = item.productId._id.toString();
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            productName: item.productId.name,
                            totalSold: 0,
                            totalRevenue: 0,
                        };
                    }
                    productSales[productId].totalSold += item.quantity;
                    productSales[productId].totalRevenue += item.productId.price * item.quantity;
                }
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5);

        res.json(topProducts);
    } catch (error) {
        console.error('Error getting top products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserActivity = async (req, res) => {
    try {
        const users = await User.find();
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const activeUsers = users.length;
        const newUsers = users.filter(user => user.createdAt && new Date(user.createdAt) >= monthAgo).length;

        res.json({
            activeUsers,
            newUsers,
        });
    } catch (error) {
        console.error('Error getting user activity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getSalesReport, getTopProducts, getUserActivity };
