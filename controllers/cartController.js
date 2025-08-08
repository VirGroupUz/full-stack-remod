const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
            return res.status(400).json({ message: 'Invalid product or insufficient stock' });
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, products: [] });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        cart.updatedAt = Date.now();
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to add a product to cart or increment its quantity
const addOrIncrementCartItem = async (req, res) => {
    const { productId, quantity } = req.body; // quantity here is the amount to ADD
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, products: [] });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex > -1) {
            // Product exists, increment quantity
            const newQuantity = cart.products[productIndex].quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
            cart.products[productIndex].quantity = newQuantity;
        } else {
            // Product does not exist, add it
            if (product.stock < quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
            cart.products.push({ productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to set a specific quantity for a cart item
const updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body; // quantity here is the new total quantity
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        if (quantity <= 0) {
            // If quantity is 0 or less, remove the item
            cart.products.splice(productIndex, 1);
        } else {
            const product = await Product.findById(productId);
            if (!product || product.stock < quantity) {
                return res.status(400).json({ message: 'Invalid product or insufficient stock for requested quantity' });
            }
            cart.products[productIndex].quantity = quantity;
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {addOrIncrementCartItem, updateCartItemQuantity, addToCart, getCart, removeFromCart };