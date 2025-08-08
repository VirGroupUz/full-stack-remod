const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart,addOrIncrementCartItem, updateCartItemQuantity } = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.delete('/', authenticate, removeFromCart);
router.post('/', authenticate, addOrIncrementCartItem);

// Use updateCartItemQuantity for setting a specific quantity (for plus/minus buttons)
router.put('/', authenticate, updateCartItemQuantity);

module.exports = router;