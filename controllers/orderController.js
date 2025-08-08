const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        let total = 0;
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Invalid product or insufficient stock: ${item.productId}` });
            }
            total += product.price * item.quantity;
        }

        const order = new Order({
            userId: req.user.id,
            products,
            total,
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
const getOrders = async (req, res) => {
    try {
        let query = {};
        // Agar autentifikatsiya qilingan foydalanuvchi admin bo'lmasa, faqat o'z buyurtmalarini ko'rishi mumkin.
        // Agar admin bo'lsa, barcha buyurtmalarni ko'rishi mumkin.
        if (req.user && req.user.role !== 'admin') {
            query = { userId: req.user.id };
        }

        const orders = await Order.find(query)
            .populate('userId', 'name email') // Foydalanuvchi ma'lumotlarini (ismi va emaili) to'ldirish
            .populate('products.productId', 'name price'); // Mahsulot ma'lumotlarini (nomi va narxi) to'ldirish
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus };